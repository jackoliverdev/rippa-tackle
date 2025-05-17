import { supabase } from './supabase';
import { VenueAccount } from './types';

// Create a venue account in the venue_accounts table
export async function createVenueAccount({
  firebase_uid,
  email,
  venue_name = null,
  first_name = null,
  last_name = null,
  profile_image_url = null,
  role = 'venue',
}: {
  firebase_uid: string;
  email: string;
  venue_name?: string | null;
  first_name?: string | null;
  last_name?: string | null;
  profile_image_url?: string | null;
  role?: string;
}): Promise<VenueAccount | null> {
  const { data, error } = await supabase
    .from('venue_accounts')
    .insert([
      {
        firebase_uid,
        email,
        venue_name,
        first_name,
        last_name,
        profile_image_url,
        role,
      },
    ])
    .select()
    .single();

  if (error) throw error;
  return data;
}

// Fetch a venue account by Firebase UID
export async function getVenueAccountByFirebaseUid(firebase_uid: string): Promise<VenueAccount | null> {
  const { data, error } = await supabase
    .from('venue_accounts')
    .select('*')
    .eq('firebase_uid', firebase_uid)
    .single();
  if (error) throw error;
  return data;
}

// Update a venue account
export async function updateVenueAccount(id: string, fields: Partial<VenueAccount>): Promise<VenueAccount | null> {
  const { data, error } = await supabase
    .from('venue_accounts')
    .update(fields)
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data;
} 