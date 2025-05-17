import { NextRequest, NextResponse } from 'next/server';
import { getAuth } from 'firebase-admin/auth';
import { initAdmin } from '@/lib/firebase-admin';

// Initialize Firebase Admin if not already initialized
initAdmin();

export async function POST(req: NextRequest) {
  try {
    const { email, firebase_uid } = await req.json();
    
    if (!email && !firebase_uid) {
      return NextResponse.json(
        { error: 'Email or Firebase UID is required' },
        { status: 400 }
      );
    }
    
    const auth = getAuth();
    
    // If Firebase UID is provided, use it directly
    if (firebase_uid) {
      const link = await auth.generatePasswordResetLink(email);
      return NextResponse.json({ success: true, message: 'Password reset link sent' });
    }
    
    // Otherwise use email
    await auth.generatePasswordResetLink(email);
    return NextResponse.json({ success: true, message: 'Password reset link sent' });
  } catch (err) {
    console.error('Error sending password reset:', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Failed to send password reset link' },
      { status: 500 }
    );
  }
} 