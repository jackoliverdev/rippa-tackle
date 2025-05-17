import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(
  req: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const userId = params.userId;
    
    // Fetch user
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (userError) {
      console.error('Error fetching user:', userError);
      return NextResponse.json({ error: userError.message }, { status: 500 });
    }
    
    if (!userData) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    
    // Fetch user profile
    const { data: profileData, error: profileError } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', userId)
      .single();
    
    if (profileError && profileError.code !== 'PGRST116') { // PGRST116 means no rows returned
      console.warn(`Error fetching profile for user ${userId}:`, profileError);
    }
    
    return NextResponse.json({
      ...userData,
      profile: profileData || null
    });
  } catch (err) {
    console.error('Unexpected error fetching user details:', err);
    return NextResponse.json({ error: 'Failed to fetch user details' }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const userId = params.userId;
    const { user, profile } = await req.json();
    
    // Validate data
    if (!user) {
      return NextResponse.json({ error: 'No user data provided' }, { status: 400 });
    }
    
    // Update user
    const { error: userUpdateError } = await supabase
      .from('users')
      .update({
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        role: user.role,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId);
    
    if (userUpdateError) {
      console.error('Error updating user:', userUpdateError);
      return NextResponse.json({ error: userUpdateError.message }, { status: 500 });
    }
    
    // Update profile if provided and exists
    if (profile && profile.id) {
      const { error: profileUpdateError } = await supabase
        .from('user_profiles')
        .update({
          partner_first_name: profile.partner_first_name,
          partner_last_name: profile.partner_last_name,
          wedding_date: profile.wedding_date,
          guest_count: profile.guest_count,
          location: profile.location,
          max_distance: profile.max_distance,
          budget_min: profile.budget_min,
          budget_max: profile.budget_max,
          preferences: profile.preferences,
          updated_at: new Date().toISOString()
        })
        .eq('id', profile.id);
      
      if (profileUpdateError) {
        console.error('Error updating user profile:', profileUpdateError);
        return NextResponse.json({ error: profileUpdateError.message }, { status: 500 });
      }
    }
    
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Unexpected error updating user:', err);
    return NextResponse.json({ error: 'Failed to update user' }, { status: 500 });
  }
} 