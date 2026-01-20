import React, { useState } from 'react';
import { MOCK_PROFILE_DATA } from '../data/mockData';
import { ProfileData, PasswordData } from '../types/profile.types';
import { ProfilePictureCard } from '../components/ProfilePictureCard';
import { AccountTypeCard } from '../components/AccountTypeCard';
import { PersonalDetailsCard } from '../components/PersonalDetailsCard';
import { SecuritySettingsCard } from '../components/SecuritySettingsCard';

export function MyProfilePage() {
  const [profileData, setProfileData] = useState<ProfileData>(MOCK_PROFILE_DATA);

  const [passwordData, setPasswordData] = useState<PasswordData>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleSaveProfile = () => {
    setSaving(true);
    setTimeout(() => {
      alert('Profile updated successfully!');
      setSaving(false);
    }, 500);
  };

  const handleChangePassword = () => {
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      alert('Please fill in all password fields');
      return;
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('New passwords do not match');
      return;
    }
    if (passwordData.newPassword.length < 8) {
      alert('New password must be at least 8 characters');
      return;
    }

    setSaving(true);
    setTimeout(() => {
      alert('Password changed successfully!');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      setSaving(false);
    }, 500);
  };

  return (
    <div style={{
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      background: '#f9fafb',
      overflow: 'auto'
    }}>
      {/* Header */}
      <div style={{
        background: '#2c3e50',
        padding: '32px 40px',
        borderBottom: '1px solid #e5e7eb'
      }}>
        <h1 style={{
          fontSize: '32px',
          fontWeight: 'bold',
          color: '#ffffff',
          margin: '0 0 8px 0'
        }}>
          My Profile
        </h1>
        <p style={{
          fontSize: '16px',
          color: 'rgba(255, 255, 255, 0.7)',
          margin: 0
        }}>
          Manage your personal information and security settings
        </p>
      </div>

      {/* Content */}
      <div style={{
        padding: '32px 40px'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '400px 1fr',
          gap: '24px',
          maxWidth: '1400px'
        }}>
          {/* Left Column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <ProfilePictureCard avatar={profileData.avatar} />
            <AccountTypeCard role={profileData.role} />
          </div>

          {/* Right Column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <PersonalDetailsCard
              profileData={profileData}
              setProfileData={setProfileData}
              onSave={handleSaveProfile}
              saving={saving}
            />
            <SecuritySettingsCard
              passwordData={passwordData}
              setPasswordData={setPasswordData}
              showCurrentPassword={showCurrentPassword}
              setShowCurrentPassword={setShowCurrentPassword}
              showNewPassword={showNewPassword}
              setShowNewPassword={setShowNewPassword}
              showConfirmPassword={showConfirmPassword}
              setShowConfirmPassword={setShowConfirmPassword}
              onChangePassword={handleChangePassword}
              saving={saving}
            />
          </div>
        </div>
      </div>
    </div>
  );
}