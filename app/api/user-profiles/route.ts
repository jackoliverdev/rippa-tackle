import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    console.log("Received request body:", body);
    
    const { userId, quiz_summary, ...otherFields } = body;
    
    if (!userId) {
      return NextResponse.json({ error: 'Missing userId' }, { status: 400 });
    }

    console.log("Attempting to update profile for user:", userId);

    // Try to fetch the user profile first to verify it exists
    const { data: profileData, error: profileError } = await supabase
      .from('user_profiles')
      .select('id')
      .eq('user_id', userId)
      .maybeSingle();

    if (profileError) {
      console.error("Error fetching profile:", profileError);
      return NextResponse.json({ error: profileError.message }, { status: 500 });
    }

    if (!profileData) {
      console.log("Profile not found, trying to create one");
      // Try to get the user data first
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('id, email, firebase_uid')
        .eq('id', userId)
        .maybeSingle();

      if (userError || !userData) {
        console.error("Error fetching user:", userError || "User not found");
        return NextResponse.json({ 
          error: userError?.message || "User not found" 
        }, { status: 404 });
      }

      // Create a new profile
      const { data: newProfile, error: createError } = await supabase
        .from('user_profiles')
        .insert({
          user_id: userData.id,
          user_firebase_uid: userData.firebase_uid,
          user_email: userData.email,
          quiz_summary
        })
        .select()
        .single();

      if (createError) {
        console.error("Error creating profile:", createError);
        return NextResponse.json({ error: createError.message }, { status: 500 });
      }

      return NextResponse.json(newProfile);
    }

    // Update the existing user profile with the quiz summary
    console.log("Profile found, updating...");
    const { data, error } = await supabase
      .from('user_profiles')
      .update({
        quiz_summary,
        ...otherFields,
        updated_at: new Date().toISOString()
      })
      .eq('user_id', userId)
      .select()
      .single();

    if (error) {
      console.error('Error updating user profile:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    console.log("Profile updated successfully:", data);
    return NextResponse.json(data);
  } catch (err: any) {
    console.error('Error in user profiles API:', err);
    return NextResponse.json({ error: err.message || 'Unknown error' }, { status: 500 });
  }
} 