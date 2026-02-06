import { NextRequest, NextResponse } from 'next/server';
import { verifyIdToken, getAdminAuth, getAdminDb } from '@/lib/firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';

export async function PUT(request: NextRequest) {
  try {
    const authHeader = request.headers.get('Authorization');
    
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, error: 'No token provided' },
        { status: 401 }
      );
    }

    const token = authHeader.split('Bearer ')[1];
    const decodedToken = await verifyIdToken(token);
    
    const { name, role, status } = await request.json();

    const adminAuth = getAdminAuth();
    const adminDb = getAdminDb();

    // Update user in Auth (if name is provided)
    if (name) {
      await adminAuth.updateUser(decodedToken.uid, {
        displayName: name
      });
    }

    // Update user in Firestore
    const updateData: any = {
      updatedAt: FieldValue.serverTimestamp()
    };

    if (name) updateData.name = name;
    if (role) updateData.role = role;
    if (status) updateData.status = status;

    await adminDb.collection('users').doc(decodedToken.uid).update(updateData);

    // Get updated user data
    const userDoc = await adminDb.collection('users').doc(decodedToken.uid).get();
    const userData = userDoc.data();

    return NextResponse.json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        uid: decodedToken.uid,
        email: decodedToken.email,
        name: name || decodedToken.name || userData?.name,
        emailVerified: decodedToken.email_verified || false,
        role: role || userData?.role || 'union',
        status: status || userData?.status || 'active'
      }
    });

  } catch (error: any) {
    console.error('Update profile API error:', error);
    
    return NextResponse.json(
      { success: false, error: 'Failed to update profile' },
      { status: 400 }
    );
  }
}