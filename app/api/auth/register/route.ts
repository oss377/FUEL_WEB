import { NextRequest, NextResponse } from 'next/server';
import { adminAuth, adminDb } from '@/lib/firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';
import { hash } from 'bcryptjs';

export async function POST(request: NextRequest) {
  try {
    const { email, password, name } = await request.json();

    // Validate input
    if (!email || !password || !name) {
      return NextResponse.json(
        { success: false, error: 'All fields are required' },
        { status: 400 }
      );
    }

    console.log('👤 Registration attempt for:', email);

    // Check if user already exists
    try {
      const existingUser = await adminAuth.getUserByEmail(email);
      console.log('ℹ️ User already exists:', existingUser.uid);
      return NextResponse.json(
        { success: false, error: 'Email already registered' },
        { status: 400 }
      );
    } catch (error: any) {
      // User not found is expected - we'll create a new one
      if (error.code !== 'auth/user-not-found') {
        throw error;
      }
    }

    // Hash password
    const passwordHash = await hash(password, 12);
    console.log('✅ Password hashed');

    // Create Firebase Auth user
    let userRecord;
    try {
      userRecord = await adminAuth.createUser({
        email,
        password, // Firebase will hash this for its own authentication
        displayName: name,
        emailVerified: false,
      });
      console.log('✅ Firebase user created:', userRecord.uid);
    } catch (error: any) {
      console.error('Error creating Firebase user:', error);
      
      if (error.code === 'auth/email-already-exists') {
        return NextResponse.json(
          { success: false, error: 'Email already registered' },
          { status: 400 }
        );
      } else if (error.code === 'auth/invalid-email') {
        return NextResponse.json(
          { success: false, error: 'Invalid email address' },
          { status: 400 }
        );
      } else if (error.code === 'auth/weak-password') {
        return NextResponse.json(
          { success: false, error: 'Password is too weak' },
          { status: 400 }
        );
      }
      
      throw error;
    }

    // Set default role as 'union'
    const userRole = 'union';
    
    // Set custom claims for role
    await adminAuth.setCustomUserClaims(userRecord.uid, {
      role: userRole
    });

    // Store user data in Firestore
    await adminDb.collection('users').doc(userRecord.uid).set({
      email,
      name,
      passwordHash, // Our hashed version for login verification
      role: userRole,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    });
    console.log('✅ User data stored in Firestore');

    // Create custom token for immediate login
    const customToken = await adminAuth.createCustomToken(userRecord.uid);
    console.log('✅ Custom token created');

    return NextResponse.json({
      success: true,
      message: 'Registration successful',
      user: {
        uid: userRecord.uid,
        email: userRecord.email,
        name: userRecord.displayName,
        role: userRole
      },
      customToken
    });

  } catch (error: any) {
    console.error('🔥 Registration error:', error.message);
    console.error('Error code:', error.code);
    
    let errorMessage = 'Registration failed';
    let statusCode = 500;
    
    if (error.code === 'auth/email-already-exists') {
      errorMessage = 'Email already registered';
      statusCode = 400;
    } else if (error.code === 'auth/invalid-email') {
      errorMessage = 'Invalid email address';
      statusCode = 400;
    } else if (error.code === 'auth/weak-password') {
      errorMessage = 'Password is too weak';
      statusCode = 400;
    }
    
    return NextResponse.json(
      { 
        success: false, 
        error: errorMessage,
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: statusCode }
    );
  }
}