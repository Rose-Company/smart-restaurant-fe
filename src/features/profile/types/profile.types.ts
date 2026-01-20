export type UserRole = 'admin' | 'waiter' | 'kitchen';

export interface ProfileData {
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  avatar: string;
}

export interface PasswordData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface RoleConfig {
  icon: any;
  title: string;
  description: string;
  bgColor: string;
  iconColor: string;
}
