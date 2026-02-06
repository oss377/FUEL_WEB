import { NextRequest, NextResponse } from 'next/server';
import { verifyIdToken, getAdminDb } from '@/lib/firebase-admin';

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('Authorization');
    
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, error: 'No token provided' },
        { status: 401 }
      );
    }

    const token = authHeader.split('Bearer ')[1];
    
    // Verify the token
    const decodedToken = await verifyIdToken(token);
    
    // Get user data from Firestore
    const adminDb = getAdminDb();
    const userDoc = await adminDb.collection('users').doc(decodedToken.uid).get();
    
    if (!userDoc.exists) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    const userData = userDoc.data();

    return NextResponse.json({
      success: true,
      user: {
        uid: decodedToken.uid,
        email: decodedToken.email,
        name: decodedToken.name || userData?.name,
        emailVerified: decodedToken.email_verified || false,
        role: userData?.role || 'union',
        status: userData?.status || 'active',
        permissions: userData?.permissions || []
      }
    });

  } catch (error: any) {
    console.error('Get user API error:', error);
    
    return NextResponse.json(
      { success: false, error: 'Authentication failed' },
      { status: 401 }
    );
  }
}