import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useUser } from "reactfire";

export function useUserProfile() {
  const { data: authUser } = useUser();
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authUser) return;
    setLoading(true);
    (async () => {
      // Fetch user row
      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("*")
        .eq("firebase_uid", authUser.uid)
        .single();
      if (userError) {
        setUser(null);
        setProfile(null);
        setLoading(false);
        return;
      }
      setUser(userData);
      // Fetch user_profile row
      const { data: profileData } = await supabase
        .from("user_profiles")
        .select("*")
        .eq("user_id", userData.id)
        .single();
      setProfile(profileData);
      setLoading(false);
    })();
  }, [authUser]);

  const updateUser = async (fields: any) => {
    if (!user) return;
    const { data, error } = await supabase
      .from("users")
      .update(fields)
      .eq("id", user.id)
      .select()
      .single();
    if (error) throw error;
    setUser(data);
    return data;
  };

  const updateProfile = async (fields: any) => {
    if (!profile) return;
    const { data, error } = await supabase
      .from("user_profiles")
      .update(fields)
      .eq("id", profile.id)
      .select()
      .single();
    if (error) throw error;
    setProfile(data);
    return data;
  };

  return { user, profile, loading, updateUser, updateProfile };
} 