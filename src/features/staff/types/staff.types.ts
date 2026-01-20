export type StaffRole = 'admin' | 'waiter' | 'kitchen';
export type StaffStatus = 'active' | 'inactive';

export interface Staff {
  id: number;
  name: string;
  email: string;
  phone?: string;
  role: StaffRole;
  status: StaffStatus;
  avatar_url?: string;
  assigned_tables?: number[];
  created_at: string;
  last_login?: string;
}

export interface StaffListResponse {
  total: number;
  page: number;
  page_size: number;
  items: Staff[];
}

export interface CreateStaffData {
  name: string;
  email: string;
  password: string;
  phone?: string;
  role: StaffRole;
  assigned_tables?: number[];
}

export interface UpdateStaffData {
  name?: string;
  email?: string;
  phone?: string;
  role?: StaffRole;
  status?: StaffStatus;
  assigned_tables?: number[];
}
