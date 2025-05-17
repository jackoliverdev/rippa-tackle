import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(req: NextRequest) {
  try {
    // Fetch all users
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (usersError) {
      console.error('Error fetching users:', usersError);
      return NextResponse.json({ error: usersError.message }, { status: 500 });
    }
    
    // Get user profile IDs
    const userIds = users.map(user => user.id);
    
    // Fetch profiles for all users
    const { data: profiles, error: profilesError } = await supabase
      .from('user_profiles')
      .select('*')
      .in('user_id', userIds);
    
    if (profilesError) {
      console.warn('Error fetching user profiles:', profilesError);
    }
    
    // Map profiles to users
    const usersWithProfiles = users.map(user => {
      const profile = profiles?.find(p => p.user_id === user.id) || null;
      return {
        ...user,
        profile
      };
    });
    
    return NextResponse.json(usersWithProfiles);
  } catch (err) {
    console.error('Unexpected error fetching users:', err);
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
  }
} 