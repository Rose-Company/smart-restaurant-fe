import { Shield, Users, ChefHat } from 'lucide-react';
import { UserRole, RoleConfig } from '../types/profile.types';

export const getRoleConfig = (role: UserRole): RoleConfig => {
  switch (role) {
    case 'admin':
      return {
        icon: Shield,
        title: 'Administrator',
        description: 'Full system access',
        bgColor: '#f3e8ff',
        iconColor: '#7c3aed'
      };
    case 'waiter':
      return {
        icon: Users,
        title: 'Waiter',
        description: 'Table and order management',
        bgColor: '#ffedd5',
        iconColor: '#ea580c'
      };
    case 'kitchen':
      return {
        icon: ChefHat,
        title: 'Kitchen Staff',
        description: 'Food preparation and orders',
        bgColor: '#dbeafe',
        iconColor: '#2563eb'
      };
  }
};
