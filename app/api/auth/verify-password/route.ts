// app/api/auth/verify-password/route.ts
import { NextResponse } from 'next/server';
import { compare } from 'bcryptjs';

// Store hashed passwords securely (you'll need to hash passwords when creating users)
const users = [
  {
    email: 'test@example.com',
    passwordHash: '$2a$12$...' // Hashed password
  }
];

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();
    
    // Find user
    const user = users.find(u => u.email === email);
    
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Invalid credentials' },
        { status: 401 }
      );
    }
    
    // Verify password
    const isValid = await compare(password, user.passwordHash);
    
    if (!isValid) {
      return NextResponse.json(
        { success: false, error: 'Invalid credentials' },
        { status: 401 }
      );
    }
    
    return NextResponse.json({
      success: true,
      email: user.email
    });
    
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Verification failed' },
      { status: 500 }
    );
  }
}