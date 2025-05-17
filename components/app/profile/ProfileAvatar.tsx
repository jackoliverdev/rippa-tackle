"use client";
import { useUserProfile } from "@/hooks/app/useUserProfile";
import { useRef, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";

export function ProfileAvatar() {
  const { user, updateUser, loading } = useUserProfile();
  const [preview, setPreview] = useState<string | null>(user?.profile_image_url || null);
  const [file, setFile] = useState<File | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Ensure preview updates if user.profile_image_url changes (e.g. after reload)
  useEffect(() => {
    setPreview(user?.profile_image_url || null);
  }, [user?.profile_image_url]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) {
      setFile(f);
      setPreview(URL.createObjectURL(f));
    }
  };

  const handleSave = async () => {
    if (!file) return;
    try {
      // Upload to Supabase Storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}_${Date.now()}.${fileExt}`;
      const { data, error: uploadError } = await supabase.storage
        .from('app/profile')
        .upload(fileName, file, { upsert: true });
      if (uploadError) throw uploadError;
      // Get public URL
      const { data: publicUrlData } = supabase.storage
        .from('app/profile')
        .getPublicUrl(fileName);
      const publicUrl = publicUrlData?.publicUrl;
      if (!publicUrl) throw new Error('Could not get public URL');
      await updateUser({ profile_image_url: publicUrl });
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