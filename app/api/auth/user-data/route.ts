import { NextRequest, NextResponse } from 'next/server';
import { adminAuth, adminDb } from '@/lib/firebase-admin';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('userId');
    const authHeader = request.headers.get('Authorization');

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Verify user is authenticated
    if (authHeader) {
      const token = authHeader.replace('Bearer ', '');
      try {
        await adminAuth.verifyIdToken(token);
      } catch (error) {
        return NextResponse.json(
          { success: false, error: 'Unauthorized' },
          { status: 401 }
        );
      }
    }

    // Get user data from Firestore
    const userDoc = await adminDb.collection('users').doc(userId).get();
    
    if (!userDoc.exists) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    const userData = userDoc.data();
    
    // Don't send password hash to client
    const { passwordHash, ...safeUserData } = userData || {};

    return NextResponse.json({
      success: true,
      userData: {
        uid: userId,
        ...safeUserData
      }
    });

  } catch (error: any) {
    console.error('Error fetching user data:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch user data'
      },
      { status: 500 }
    );
  }
}