import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useUser } from "reactfire";
import { VenueAccount } from "@/lib/types";
import { getVenueAccountByFirebaseUid, updateVenueAccount } from "@/lib/venue-account-service";

export function useVenueProfile() {
  const { data: authUser } = useUser();
  const [venue, setVenue] = useState<VenueAccount | null>(null);
  const [loading, setLoading] = useState(true);

  // Helper to fetch latest venue data
  const fetchVenue = async (uid: string) => {
    const venueData = await getVenueAccountByFirebaseUid(uid);
    setVenue(venueData);
  };

  useEffect(() => {
    if (!authUser) return;
    setLoading(true);
    (async () => {
      try {
        await fetchVenue(authUser.uid);
      } catch {
        setVenue(null);
      } finally {
        setLoading(false);
      }
    })();
  }, [authUser]);

  const updateVenue = async (fields: Partial<VenueAccount>) => {
    if (!venue || !authUser) return;
    setLoading(true);
    try {
      await updateVenueAccount(venue.id, fields);
      // Refetch latest venue data after update
      await fetchVenue(authUser.uid);
    } finally {
      setLoading(false);
    }
  };

  return { venue, loading, updateVenue };
} 