"use client";
import { useVenueProfile } from "@/hooks/venue/useVenueProfile";
import { useRef, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";

export function VenueProfileAvatar() {
  const { venue, updateVenue, loading } = useVenueProfile();
  const [preview, setPreview] = useState<string | null>(venue?.profile_image_url || null);
  const [file, setFile] = useState<File | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Ensure preview updates if venue.profile_image_url changes (e.g. after reload)
  useEffect(() => {
    setPreview(venue?.profile_image_url || null);
  }, [venue?.profile_image_url]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) {
      setFile(f);
      setPreview(URL.createObjectURL(f));
    }
  };

  const handleSave = async () => {
    if (!file || !venue) return;
    try {
      // Upload to Supabase Storage (venues/profile bucket)
      const fileExt = file.name.split('.').pop();
      const fileName = `${venue.id}_${Date.now()}.${fileExt}`;
      const { data, error: uploadError } = await supabase.storage
        .from('venues/profile')
        .upload(fileName, file, { upsert: true });
      if (uploadError) throw uploadError;
      // Get public URL
      const { data: publicUrlData } = supabase.storage
        .from('venues/profile')
        .getPublicUrl(fileName);
      const publicUrl = publicUrlData?.publicUrl;
      if (!publicUrl) throw new Error('Could not get public URL');
      await updateVenue({ profile_image_url: publicUrl });
      setPreview(publicUrl);
      toast({ title: "Profile image updated" });
    } catch (error: any) {
      toast({ title: "Error", description: error?.message || "Could not update image." });
    }
  };

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-100 border">
        {preview ? (
          <img src={preview} alt="Profile" className="object-cover w-full h-full" />
        ) : (
          <span className="flex items-center justify-center w-full h-full text-3xl text-gray-400">?</span>
        )}
      </div>
      <input
        type="file"
        accept="image/*"
        ref={inputRef}
        className="hidden"
        onChange={handleFileChange}
      />
      <Button type="button" variant="outline" onClick={() => inputRef.current?.click()} disabled={loading}>
        Choose Image
      </Button>
      {file && (
        <Button type="button" onClick={handleSave} disabled={loading}>
          Save Image
        </Button>
      )}
    </div>
  );
} 