import React from 'react';
import { LogOut, Settings as SettingsIcon } from 'lucide-react';

interface SettingsPageProps {
  onLogout: () => void;
}

export function SettingsPage({ onLogout }: SettingsPageProps) {
  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      onLogout();
    }
  };

  return (
    <div className="flex-1 overflow-auto bg-gray-50">
      {/* Header */}
      <div style={{
        backgroundColor: '#ffffff',
        borderBottom: '1px solid #e5e7eb',
        padding: '24px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px'
      }}>
        <SettingsIcon style={{ width: '32px', height: '32px', color: '#374151' }} />
        <div>
          <h1 style={{
            fontSize: '24px',
            fontWeight: '700',
            color: '#1f2937',
            margin: '0 0 4px 0'
          }}>
            Settings
          </h1>
          <p style={{
            fontSize: '14px',
            color: '#6b7280',
            margin: 0
          }}>
            Manage your account and preferences
          </p>
        </div>
      </div>

      {/* Content */}
      <div style={{
        padding: '32px 24px',
        maxWidth: '800px',
        margin: '0 auto'
      }}>
        {/* Account Section */}
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '12px',
          border: '1px solid #e5e7eb',
          padding: '24px',
          marginBottom: '24px'
        }}>
          <h2 style={{
            fontSize: '18px',
            fontWeight: '600',
            color: '#1f2937',
            marginBottom: '24px',
            margin: '0 0 24px 0'
          }}>
            Account
          </h2>

          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingBottom: '24px',
            borderBottom: '1px solid #e5e7eb'
          }}>
            <div>
              <p style={{
                fontSize: '15px',
                fontWeight: '500',
                color: '#1f2937',
                margin: '0 0 4px 0'
              }}>
                Logout
              </p>
              <p style={{
                fontSize: '13px',
                color: '#6b7280',
                margin: 0
              }}>
                Sign out from your account
              </p>
            </div>
            <button
              onClick={handleLogout}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 20px',
                backgroundColor: '#dc2626',
                color: '#ffffff',
                border: 'none',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#b91c1c';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#dc2626';
              }}
            >
              <LogOut style={{ width: '16px', height: '16px' }} />
              Logout
            </button>
          </div>
        </div>

        {/* App Info */}
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '12px',
          border: '1px solid #e5e7eb',
          padding: '24px'
        }}>
          <h2 style={{
            fontSize: '18px',
            fontWeight: '600',
            color: '#1f2937',
            marginBottom: '24px',
            margin: '0 0 24px 0'
          }}>
            About
          </h2>

          <div style={{
            display: 'grid',
            gap: '16px'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              paddingBottom: '16px',
              borderBottom: '1px solid #e5e7eb'
            }}>
              <p style={{
                fontSize: '14px',
                color: '#6b7280',
                margin: 0
              }}>
                Application Name
              </p>
              <p style={{
                fontSize: '14px',
                color: '#1f2937',
                fontWeight: '500',
                margin: 0
              }}>
                Smart Restaurant
              </p>
            </div>

            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              paddingBottom: '16px',
              borderBottom: '1px solid #e5e7eb'
            }}>
              <p style={{
                fontSize: '14px',
                color: '#6b7280',
                margin: 0
              }}>
                Version
              </p>
              <p style={{
                fontSize: '14px',
                color: '#1f2937',
                fontWeight: '500',
                margin: 0
              }}>
                1.0.0
              </p>
            </div>

            <div style={{
              display: 'flex',
              justifyContent: 'space-between'
            }}>
              <p style={{
                fontSize: '14px',
                color: '#6b7280',
                margin: 0
              }}>
                Environment
              </p>
              <p style={{
                fontSize: '14px',
                color: '#1f2937',
                fontWeight: '500',
                margin: 0
              }}>
                Development
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
