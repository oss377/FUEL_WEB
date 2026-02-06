import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { findUserByEmail, addUser } from './db';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export const hashPassword = async (password: string): Promise<string> => {
  return await bcrypt.hash(password, 10);
};

export const comparePassword = async (password: string, hashedPassword: string): Promise<boolean> => {
  return await bcrypt.compare(password, hashedPassword);
};

export const generateToken = (userId: string): string => {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' });
};

export const verifyToken = (token: string): any => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch {
    return null;
  }
};

export const registerUser = async (email: string, password: string, name: string) => {
  const existingUser = findUserByEmail(email);
  if (existingUser) {
    throw new Error('User already exists');
  }

  const hashedPassword = await hashPassword(password);
  const user = addUser({ email, password: hashedPassword, name });
  
  const token = generateToken(user.id);
  return { user: { id: user.id, email: user.email, name: user.name }, token };
};

export const loginUser = async (email: string, password: string) => {
  const user = findUserByEmail(email);
  if (!user) {
    throw new Error('User not found');
  }

  const isValid = await comparePassword(password, user.password);
  if (!isValid) {
    throw new Error('Invalid password');
  }

  const token = generateToken(user.id);
  return { user: { id: user.id, email: user.email, name: user.name }, token };
};