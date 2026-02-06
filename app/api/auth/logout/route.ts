import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
  try {
    // Clear any authentication cookies if you're using them
    const cookieStore = await cookies();
    
    // Clear any auth-related cookies
    const authCookies = ['auth-token', 'session', 'user-token'];
    authCookies.forEach(cookieName => {
      cookieStore.delete(cookieName);
    });
    
    return NextResponse.json({
      success: true,
      message: 'Logged out successfully'
    });

  } catch (error: any) {
    console.error('Logout error:', error);
    
    return NextResponse.json(
      { success: false, error: 'An error occurred during logout' },
      { status: 500 }
    );
  }
}