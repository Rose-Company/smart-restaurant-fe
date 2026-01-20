import React from 'react';
import { Camera } from 'lucide-react';

interface ProfilePictureCardProps {
  avatar: string;
}

export function ProfilePictureCard({ avatar }: ProfilePictureCardProps) {
  return (
    <div style={{
      background: '#ffffff',
      borderRadius: '12px',
      border: '1px solid #e5e7eb',
      padding: '32px',
      textAlign: 'center'
    }}>
      <div style={{
        fontSize: '12px',
        fontWeight: '600',
        color: '#6b7280',
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
        marginBottom: '20px'
      }}>
        Profile Picture
      </div>
      
      {/* Avatar */}
      <div style={{
        position: 'relative',
        width: '120px',
        height: '120px',
        margin: '0 auto 20px'
      }}>
        <div style={{
          width: '120px',
          height: '120px',
          borderRadius: '50%',
          background: '#00bc7d',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#ffffff',
          fontSize: '40px',
          fontWeight: 'bold'
        }}>
          {avatar}
        </div>
        <button
          style={{
            position: 'absolute',
            bottom: '5px',
            right: '5px',
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            background: '#00bc7d',
            border: '3px solid #ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff',
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#00a36b';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = '#00bc7d';
          }}
        >
          <Camera size={18} />
        </button>
      </div>

      <button
        style={{
          width: '100%',
          padding: '10px 20px',
          background: 'transparent',
          border: '1px solid #d1d5db',
          borderRadius: '8px',
          fontSize: '14px',
          fontWeight: '500',
          color: '#374151',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          transition: 'all 0.2s'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = '#9ca3af';
          e.currentTarget.style.background = '#f9fafb';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = '#d1d5db';
          e.currentTarget.style.background = 'transparent';
        }}
      >
        <Camera size={16} />
        Change Photo
      </button>
    </div>
  );
}
