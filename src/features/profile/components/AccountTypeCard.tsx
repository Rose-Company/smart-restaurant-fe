import React from 'react';
import { UserRole, RoleConfig } from '../types/profile.types';
import { getRoleConfig } from '../utils/roleConfig';

interface AccountTypeCardProps {
  role: UserRole;
}

export function AccountTypeCard({ role }: AccountTypeCardProps) {
  const roleConfig = getRoleConfig(role);
  const RoleIcon = roleConfig.icon;

  return (
    <div style={{
      background: '#ffffff',
      borderRadius: '12px',
      border: '1px solid #e5e7eb',
      padding: '32px'
    }}>
      <div style={{
        fontSize: '12px',
        fontWeight: '600',
        color: '#6b7280',
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
        marginBottom: '20px'
      }}>
        Account Type
      </div>
      
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        padding: '16px',
        background: '#f9fafb',
        borderRadius: '10px',
        border: '1px solid #e5e7eb'
      }}>
        <div style={{
          width: '48px',
          height: '48px',
          borderRadius: '12px',
          background: roleConfig.bgColor,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: roleConfig.iconColor
        }}>
          <RoleIcon size={24} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{
            fontSize: '16px',
            fontWeight: '600',
            color: '#111827',
            marginBottom: '2px'
          }}>
            {roleConfig.title}
          </div>
          <div style={{
            fontSize: '13px',
            color: '#6b7280'
          }}>
            {roleConfig.description}
          </div>
        </div>
      </div>
    </div>
  );
}
