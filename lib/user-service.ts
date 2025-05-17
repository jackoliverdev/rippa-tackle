import { supabase } from './supabase';

// User type for Supabase user row
export interface User {
  id: string;
  firebase_uid: string;
  email: string;
  first_name?: string | null;
  last_name?: string | null;
  profile_image_url?: string | null;
  role?: string;
  created_at?: string;
  updated_at?: string;
}

// Create a user in the users table
export async function createUser({
  firebase_uid,
  email,
  first_name = null,
  last_name = null,
  profile_image_url = null,
  role = 'user',
}: {
  firebase_uid: string;
  email: string;
  first_name?: string | null;
  last_name?: string | null;
  profile_image_url?: string | null;
  role?: string;
}): Promise<User | null> {
  const { data, error } = await supabase
    .from('users')
    .insert([
      {
        firebase_uid,
        email,
        first_name,
        last_name,
        profile_image_url,
        role,
      },
    ])
    .select()
    .single();

  if (error) throw error;
  // After creating the user, create a blank user profile if not present
  if (data && data.id) {
    await createUserProfile({
      user_id: data.id,
      user_firebase_uid: data.firebase_uid,
      user_email: data.email,
    });
  }
  return data;
}

// Create a user profile in the user_profiles table
export async function createUserProfile({
  user_id,
  user_firebase_uid,
  user_email,
  quiz_summary = null,
  partner_first_name = null,
  partner_last_name = null,
  wedding_date = null,
  guest_count = null,
  location = null,
  max_distance = null,
  budget_min = null,
  budget_max = null,
  preferences = null,
}: {
  user_id: string;
  user_firebase_uid: string;
  user_email: string;
  quiz_summary?: string | null;
  partner_first_name?: string | null;
  partner_last_name?: string | null;
  wedding_date?: string | null;
  guest_count?: number | null;
  location?: string | null;
  max_distance?: number | null;
  budget_min?: number | null;
  budget_max?: number | null;
  preferences?: any;
}) {
  const { data, error } = await supabase
    .from('user_profiles')
    .insert([
      {
        user_id,
        user_firebase_uid,
        user_email,
        quiz_summary,
        partner_first_name,
        partner_last_name,
        wedding_date,
        guest_count,
        location,
        max_distance,
        budget_min,
        budget_max,
        preferences,
      },
    ])
    .select()
    .single();

  if (error) throw error;
  return data;
}