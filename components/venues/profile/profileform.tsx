"use client";
import { useVenueProfile } from "@/hooks/venue/useVenueProfile";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { useEffect } from "react";

const venueProfileSchema = z.object({
  email: z.string().email(),
  venue_name: z.string().optional(),
  first_name: z.string().optional(),
  last_name: z.string().optional(),
});

export function VenueProfileForm() {
  const { venue, updateVenue, loading } = useVenueProfile();
  const form = useForm({
    resolver: zodResolver(venueProfileSchema),
    defaultValues: {
      email: venue?.email || "",
      venue_name: venue?.venue_name || "",
      first_name: venue?.first_name || "",
      last_name: venue?.last_name || "",
    },
  });

  useEffect(() => {
    form.reset({
      email: venue?.email || "",
      venue_name: venue?.venue_name || "",
      first_name: venue?.first_name || "",
      last_name: venue?.last_name || "",
    });
  }, [venue]);

  const onSubmit = async (values: any) => {
    try {
      await updateVenue({
        venue_name: values.venue_name,
        first_name: values.first_name,
        last_name: values.last_name,
      });
      toast({ title: "Venue profile updated", description: "Your venue profile has been saved." });
    } catch (error: any) {
      toast({ title: "Error", description: error?.message || "Could not update venue profile." });
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <label className="block mb-1 font-medium">Email</label>
          <Input {...form.register("email")} readOnly className="bg-gray-100 cursor-not-allowed" />
        </div>
        <div className="md:col-span-2">
          <label className="block mb-1 font-medium">Venue Name</label>
          <Input {...form.register("venue_name")} />
        </div>
        <div>
          <label className="block mb-1 font-medium">First Name</label>
          <Input {...form.register("first_name")} />
        </div>
        <div>
          <label className="block mb-1 font-medium">Last Name</label>
          <Input {...form.register("last_name")} />
        </div>
      </div>
      <Button type="submit" disabled={loading} className="mt-4">Save Profile</Button>
    </form>
  );
} 