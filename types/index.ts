export interface User {
  id: string;
  email: string;
  name: string;
  password: string;
  createdAt: Date;
}

export interface Vehicle {
  id: string;
  name: string;
  type: string;
  status: 'active' | 'inactive' | 'maintenance';
  location: string;
  lastService: Date;
}

export interface Station {
  id: string;
  name: string;
  location: string;
  status: 'operational' | 'maintenance' | 'closed';
  capacity: number;
}

export interface Report {
  id: string;
  title: string;
  type: string;
  date: Date;
  status: 'pending' | 'completed' | 'review';
}