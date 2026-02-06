import { NextRequest, NextResponse } from 'next/server';
import { adminAuth, adminDb } from '@/lib/firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';
import { compare } from 'bcryptjs';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Email and password are required' },
        { status: 400 }
      );
    }

    console.log('🔐 Login attempt for:', email);

    // Get user from Firebase Auth
    let userRecord;
    try {
      userRecord = await adminAuth.getUserByEmail(email);
      console.log('✅ User found in Firebase Auth:', userRecord.uid);
      console.log('📋 Firebase Auth user data:', {
        uid: userRecord.uid,
        email: userRecord.email,
        displayName: userRecord.displayName,
        emailVerified: userRecord.emailVerified,
        disabled: userRecord.disabled,
        metadata: userRecord.metadata
      });
    } catch (error: any) {
      console.error('Error getting user:', error.message);
      
      if (error.code === 'auth/user-not-found') {
        return NextResponse.json(
          { success: false, error: 'Invalid email or password' },
          { status: 401 }
        );
      }
      
      if (error.code === 'app/invalid-credential') {
        return NextResponse.json(
          { 
            success: false, 
            error: 'Server authentication error',
            details: 'Please check Firebase configuration'
          },
          { status: 500 }
        );
      }
      
      throw error;
    }

    // Get user data from Firestore
    const userDoc = await adminDb.collection('users').doc(userRecord.uid).get();
    const userData = userDoc.data();
    
    if (!userData) {
      console.log('❌ User data not found in Firestore');
      return NextResponse.json(
        { success: false, error: 'Invalid email or password' },
        { status: 401 }
      );
    }
    
    // Log all user data from database
    console.log('📊 User data from Firestore:', {
      documentId: userDoc.id,
      exists: userDoc.exists,
      data: userData,
      rawDocument: userDoc.data(),
      hasPassword: !!userData.passwordHash,
      role: userData.role || 'not set',
      allFields: Object.keys(userData)
    });
    
    // Check if password hash exists
    if (!userData.passwordHash) {
      console.log('❌ No password hash stored for user');
      return NextResponse.json(
        { success: false, error: 'Password not set up for this account' },
        { status: 401 }
      );
    }
    
    // Verify password against stored hash
    console.log('🔑 Verifying password...');
    let isValid = false;
    try {
      isValid = await compare(password, userData.passwordHash);
    } catch (bcryptError) {
      console.error('Password verification error:', bcryptError);
      return NextResponse.json(
        { success: false, error: 'Password verification failed' },
        { status: 500 }
      );
    }
    
    if (!isValid) {
      console.log('❌ Password verification failed');
      return NextResponse.json(
        { success: false, error: 'Invalid email or password' },
        { status: 401 }
      );
    }
    
    console.log('✅ Password verified successfully');

    // Ensure role is correctly set in custom claims
    const userRole = userData.role || 'union';
    console.log(`🎯 Setting custom claim role to: "${userRole}"`);
    
    try {
      await adminAuth.setCustomUserClaims(userRecord.uid, {
        role: userRole
      });
      
      // Verify custom claims were set
      const updatedUserRecord = await adminAuth.getUser(userRecord.uid);
      console.log('✅ Custom claims set:', updatedUserRecord.customClaims);
    } catch (claimsError) {
      console.error('Error setting custom claims:', claimsError);
      // Don't fail login if custom claims fail, but log it
    }

    // Update last login
    await adminDb.collection('users').doc(userRecord.uid).update({
      lastLogin: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp()
    });

    // Refresh user data after update
    const updatedUserDoc = await adminDb.collection('users').doc(userRecord.uid).get();
    const updatedUserData = updatedUserDoc.data();

    // Create custom token (includes custom claims)
    const customToken = await adminAuth.createCustomToken(userRecord.uid, {
      role: userRole
    });
    console.log('✅ Custom token created with role:', userRole);

    return NextResponse.json({
      success: true,
      message: 'Login successful',
      user: {
        uid: userRecord.uid,
        email: userRecord.email,
        name: userRecord.displayName || userData.name,
        emailVerified: userRecord.emailVerified,
        role: userRole,
        // Include additional user data
        ...updatedUserData
      },
      customToken
    });

  } catch (error: any) {
    console.error('🔥 Login API error:', error.message);
    console.error('Error code:', error.code);
    console.error('Full error:', error);
    console.error('Error stack:', error.stack);
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Authentication failed',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}