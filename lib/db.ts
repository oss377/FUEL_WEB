import { User, Vehicle, Station, Report } from '@/types';

// Simulating a database with arrays
export const users: User[] = [];
export const vehicles: Vehicle[] = [];
export const stations: Station[] = [];
export const reports: Report[] = [];

// Helper functions
export const findUserByEmail = (email: string) => 
  users.find(user => user.email === email);

export const findUserById = (id: string) => 
  users.find(user => user.id === id);

export const addUser = (user: Omit<User, 'id' | 'createdAt'>) => {
  const newUser = {
    ...user,
    id: Date.now().toString(),
    createdAt: new Date()
  };
  users.push(newUser);
  return newUser;
};