import { NextRequest, NextResponse } from 'next/server';
import { getAdminAuth } from '@/lib/firebase-admin';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { success: false, error: 'Email is required' },
        { status: 400 }
      );
    }

    const adminAuth = getAdminAuth();

    // Generate password reset link
    const resetLink = await adminAuth.generatePasswordResetLink(email, {
      url: `${process.env.NEXT_PUBLIC_APP_URL}/reset-password`,
      handleCodeInApp: true
    });

    // In production, you would send this link via email
    // For now, we'll log it (remove in production)
    console.log('Password reset link:', resetLink);

    return NextResponse.json({
      success: true,
      message: 'Password reset email sent',
      // Remove resetLink in production, only for development
      ...(process.env.NODE_ENV === 'development' && { resetLink })
    });

  } catch (error: any) {
    console.error('Reset password API error:', error);
    
    let errorMessage = 'Failed to send reset email';
    
    if (error.code === 'auth/user-not-found') {
      errorMessage = 'No account found with this email';
    }

    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 400 }
    );
  }
}