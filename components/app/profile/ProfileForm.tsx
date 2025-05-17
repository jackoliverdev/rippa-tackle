"use client";
import { useUserProfile } from "@/hooks/app/useUserProfile";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { useEffect } from "react";
import { Fish, MapPin } from "lucide-react";

const profileSchema = z.object({
  email: z.string().email(),
  first_name: z.string().optional(),
  last_name: z.string().optional(),
  phone: z.string().optional(),
  location: z.string().optional(),
  max_distance: z.coerce.number().min(0).optional(),
  preferred_species: z.string().optional(),
  preferred_method: z.string().optional(),
});

export function ProfileForm() {
  const { user, profile, updateUser, updateProfile, loading } = useUserProfile();
  const form = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      email: user?.email || "",
      first_name: user?.first_name || "",
      last_name: user?.last_name || "",
      phone: profile?.partner_first_name || "", // Repurposing partner_first_name for phone
      location: profile?.location || "",
      max_distance: profile?.max_distance || undefined,
      preferred_species: profile?.partner_last_name || "", // Repurposing partner_last_name for preferred species
      preferred_method: profile?.wedding_date || "", // Repurposing wedding_date for fishing method
    },
  });

  useEffect(() => {
    form.reset({
      email: user?.email || "",
      first_name: user?.first_name || "",
      last_name: user?.last_name || "",
      phone: profile?.partner_first_name || "", // Repurposing partner_first_name for phone
      location: profile?.location || "",
      max_distance: profile?.max_distance || undefined,
      preferred_species: profile?.partner_last_name || "", // Repurposing partner_last_name for preferred species
      preferred_method: profile?.wedding_date || "", // Repurposing wedding_date for fishing method
    });
  }, [user, profile]);

  const onSubmit = async (values: any) => {
    try {
      await updateUser({
        first_name: values.first_name,
        last_name: values.last_name,
      });
      await updateProfile({
        partner_first_name: values.phone, // Storing phone in partner_first_name
        partner_last_name: values.preferred_species, // Storing preferred_species in partner_last_name
        wedding_date: values.preferred_method, // Storing preferred_method in wedding_date
        guest_count: null, // Not using this field
        location: values.location,
        max_distance: values.max_distance,
      });
      toast({ title: "Profile updated", description: "Your profile has been saved." });
    } catch (error: any) {
      toast({ title: "Error", description: error?.message || "Could not update profile." });
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <label className="block mb-1 font-medium">Email</label>
          <Input {...form.register("email")} readOnly className="bg-gray-100 cursor-not-allowed" />
        </div>
        <div>
          <label className="block mb-1 font-medium">First Name</label>
          <Input {...form.register("first_name")} autoComplete="given-name" />
        </div>
        <div>
          <label className="block mb-1 font-medium">Last Name</label>
          <Input {...form.register("last_name")} autoComplete="family-name" />
        </div>
        <div>
          <label className="block mb-1 font-medium">Phone Number</label>
          <Input {...form.register("phone")} autoComplete="tel" />
        </div>
        
        <div className="md:col-span-2">
          <div className="flex items-center mb-3">
            <MapPin className="mr-2 h-5 w-5 text-blue-600" />
            <h3 className="font-semibold text-blue-800">Location Details</h3>
          </div>
        </div>
        
        <div>
          <label className="block mb-1 font-medium">Location</label>
          <Input {...form.register("location")} placeholder="Town or City" />
        </div>
        <div>
          <label className="block mb-1 font-medium">Max Travel Distance (miles)</label>
          <Input type="number" {...form.register("max_distance")} min={0} />
        </div>
        
        <div className="md:col-span-2">
          <div className="flex items-center mb-3 mt-2">
            <Fish className="mr-2 h-5 w-5 text-blue-600" />
            <h3 className="font-semibold text-blue-800">Fishing Preferences</h3>
          </div>
        </div>
        
        <div>
          <label className="block mb-1 font-medium">Preferred Species</label>
          <Input {...form.register("preferred_species")} placeholder="e.g. Carp, Pike, Tench" />
        </div>
        <div>
          <label className="block mb-1 font-medium">Preferred Fishing Method</label>
          <Input {...form.register("preferred_method")} placeholder="e.g. Float, Feeder, Zig Rig" />
        </div>
      </div>
      <Button type="submit" disabled={loading} className="mt-4 bg-blue-600 hover:bg-blue-700">Save Profile</Button>
    </form>
  );
} 