import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, User, Mail, Phone, Lock, Save, CheckCircle, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { authCustomerApi } from '../services/auth.api';
import { profileApi } from '../../profile/services/profile.api';
import { OrderSuccessModal } from '../components/OrderSuccessModal';

interface CustomerAccountPageProps {
  onBack?: () => void;
}

type OTPStep = 'idle' | 'request' | 'verify' | 'reset';

export function CustomerAccountPage({ onBack }: CustomerAccountPageProps) {
  const { t } = useTranslation('customer');
  const { user, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [pageLoading, setPageLoading] = useState(true);

  // Profile form state
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    phone: user?.phone || ''
  });

  // Load user info on mount
  useEffect(() => {
    const loadUserInfo = async () => {
      try {
        setPageLoading(true);
        const userInfo = await authCustomerApi.getMe();
        if (userInfo?.data) {
          const fullName = `${userInfo.data.first_name} ${userInfo.data.last_name}`;
          
          // Update user context
          if (user?.id) {
            updateUser({
              ...user,
              id: user.id,
              name: fullName,
              email: userInfo.data.email
            });
          }
        } else {
          console.warn('No user data in response');
        }
      } catch (error) {
        console.error('Error loading user info:', error);
      } finally {
        setPageLoading(false);
      }
    };

    loadUserInfo();
  }, []);

  // Password reset state
  const [passwordStep, setPasswordStep] = useState<OTPStep>('idle');
  const [resetEmail, setResetEmail] = useState(user?.email || '');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleProfileUpdate = async () => {
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const updateData = {
        name: profileData.name,
        phone: profileData.phone
      };

      const response = await authCustomerApi.updateProfile(updateData);
      
      if (response.code === 200) {
        // Update user in context
        updateUser({
          ...user!,
          name: profileData.name,
          phone: profileData.phone
        });
        setSuccess('Profile updated successfully!');
        setIsEditing(false);
      } else {
        setError(response.message || 'Failed to update profile');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRequestPasswordOTP = async () => {
    setError('');
    setLoading(true);

    try {
      const response = await authCustomerApi.requestPasswordResetOTP(resetEmail);
      
      if (response.code === 200) {
        setPasswordStep('verify');
      } else {
        setError(response.message || 'Failed to send OTP');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    const otpCode = otp.join('');
    if (otpCode.length !== 6) {
      setError('Please enter all 6 digits');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const response = await authCustomerApi.verifyPasswordResetOTP(resetEmail, otpCode);
      
      if (response.code === 200 && response.data?.verify_token) {
        setResetToken(response.data.verify_token);
        setPasswordStep('reset');
        setOtp(['', '', '', '', '', '']);
      } else {
        setError(response.message || 'Invalid OTP');
      }
    } catch (err: any) {
      setError(err.message || 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    setError('');

    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      const response = await authCustomerApi.resetPassword(resetEmail, newPassword, resetToken);
      
      if (response.code === 200) {
        setShowSuccessModal(true);
        setPasswordStep('idle');
        setNewPassword('');
        setConfirmPassword('');
        setResetToken('');
      } else {
        setError(response.message || 'Failed to reset password');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleOTPChange = (index: number, value: string) => {
    if (value.length > 1) value = value[0];
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#f5f5f5'
    }}>
      {pageLoading && (
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          backgroundColor: 'rgba(0, 0, 0, 0.1)'
        }}>
          <div style={{
            width: '40px',
            height: '40px',
            border: '4px solid #e5e7eb',
            borderTop: '4px solid #52b788',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }} />
          <style>{`
            @keyframes spin {
              to { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      )}
      {!pageLoading && (
        <>
      {/* Header */}
      <div style={{
        backgroundColor: '#ffffff',
        padding: '16px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
      }}>
        {onBack && (
          <button
            onClick={onBack}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '8px',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <ArrowLeft style={{ width: '24px', height: '24px', color: '#1f2937' }} />
          </button>
        )}
        <h1 style={{
          fontSize: '18px',
          fontWeight: '600',
          color: '#1f2937',
          margin: 0
        }}>
          {t('account.title')}
        </h1>
      </div>

      {/* Content */}
      <div style={{ padding: '16px' }}>
        {/* Profile Section */}
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '12px',
          padding: '20px',
          marginBottom: '16px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '20px'
          }}>
            <h2 style={{
              fontSize: '16px',
              fontWeight: '600',
              color: '#1f2937',
              margin: 0
            }}>
              {t('account.profileSection')}
            </h2>
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#52b788',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer'
                }}
              >
                {t('account.edit')}
              </button>
            )}
          </div>

          {error && (
            <div style={{
              padding: '12px',
              backgroundColor: '#fee2e2',
              color: '#991b1b',
              borderRadius: '8px',
              marginBottom: '16px',
              fontSize: '14px'
            }}>
              {error}
            </div>
          )}

          {success && (
            <div style={{
              padding: '12px',
              backgroundColor: '#d1fae5',
              color: '#065f46',
              borderRadius: '8px',
              marginBottom: '16px',
              fontSize: '14px'
            }}>
              {success}
            </div>
          )}

          {/* Name */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '14px',
              fontWeight: '500',
              color: '#374151',
              marginBottom: '8px'
            }}>
              <User style={{ width: '16px', height: '16px' }} />
              {t('account.fullName')}
            </label>
            <input
              type="text"
              value={profileData.name}
              onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
              disabled={!isEditing}
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '15px',
                backgroundColor: isEditing ? '#ffffff' : '#f9fafb',
                color: '#1f2937'
              }}
            />
          </div>

          {/* Email (read-only) */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '14px',
              fontWeight: '500',
              color: '#374151',
              marginBottom: '8px'
            }}>
              <Mail style={{ width: '16px', height: '16px' }} />
              Email
            </label>
            <input
              type="email"
              value={user?.email}
              disabled
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '15px',
                backgroundColor: '#f9fafb',
                color: '#6b7280'
              }}
            />
          </div>

          {/* Phone */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '14px',
              fontWeight: '500',
              color: '#374151',
              marginBottom: '8px'
            }}>
              <Phone style={{ width: '16px', height: '16px' }} />
              {t('account.phone')}
            </label>
            <input
              type="tel"
              value={profileData.phone}
              onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
              disabled={!isEditing}
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '15px',
                backgroundColor: isEditing ? '#ffffff' : '#f9fafb',
                color: '#1f2937'
              }}
            />
          </div>

          {isEditing && (
            <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
              <button
                onClick={() => {
                  setIsEditing(false);
                  setProfileData({
                    name: user?.name || '',
                    phone: user?.phone || ''
                  });
                  setError('');
                }}
                style={{
                  flex: 1,
                  padding: '12px',
                  backgroundColor: '#ffffff',
                  color: '#6b7280',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '15px',
                  fontWeight: '500',
                  cursor: 'pointer'
                }}
              >
                {t('common.cancel')}
              </button>
              <button
                onClick={handleProfileUpdate}
                disabled={loading}
                style={{
                  flex: 1,
                  padding: '12px',
                  backgroundColor: loading ? '#9ca3af' : '#52b788',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '15px',
                  fontWeight: '500',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
              >
                <Save style={{ width: '16px', height: '16px' }} />
                {loading ? t('common.saving') : t('account.save')}
              </button>
            </div>
          )}
        </div>

        {/* Change Password Section */}
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '12px',
          padding: '20px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}>
          <h2 style={{
            fontSize: '16px',
            fontWeight: '600',
            color: '#1f2937',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <Lock style={{ width: '18px', height: '18px' }} />
            {t('account.changePassword')}
          </h2>

          {passwordStep === 'idle' && (
            <>
              <p style={{
                fontSize: '14px',
                color: '#6b7280',
                marginBottom: '16px'
              }}>
                {t('account.sendOTPHint')}
              </p>
              <button
                onClick={() => setPasswordStep('request')}
                style={{
                  width: '100%',
                  padding: '12px',
                  backgroundColor: '#52b788',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '15px',
                  fontWeight: '500',
                  cursor: 'pointer'
                }}
              >
                {t('account.startChangePassword')}
              </button>
            </>
          )}

          {passwordStep === 'request' && (
            <>
              <div style={{ marginBottom: '16px' }}>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#374151',
                  marginBottom: '8px'
                }}>
                  Email
                </label>
                <input
                  type="email"
                  value={resetEmail}
                  disabled
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '15px',
                    backgroundColor: '#f9fafb',
                    color: '#6b7280'
                  }}
                />
              </div>
              {error && (
                <div style={{
                  padding: '12px',
                  backgroundColor: '#fee2e2',
                  color: '#991b1b',
                  borderRadius: '8px',
                  marginBottom: '16px',
                  fontSize: '14px'
                }}>
                  {error}
                </div>
              )}
              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  onClick={() => setPasswordStep('idle')}
                  style={{
                    flex: 1,
                    padding: '12px',
                    backgroundColor: '#ffffff',
                    color: '#6b7280',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '15px',
                    fontWeight: '500',
                    cursor: 'pointer'
                  }}
                >
                  {t('common.cancel')}
                </button>
                <button
                  onClick={handleRequestPasswordOTP}
                  disabled={loading}
                  style={{
                    flex: 1,
                    padding: '12px',
                    backgroundColor: loading ? '#9ca3af' : '#52b788',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '15px',
                    fontWeight: '500',
                    cursor: loading ? 'not-allowed' : 'pointer'
                  }}
                >
                  {loading ? t('common.sending') : t('auth.sendOTP')}
                </button>
              </div>
            </>
          )}

          {passwordStep === 'verify' && (
            <>
              <p style={{
                fontSize: '14px',
                color: '#6b7280',
                marginBottom: '16px'
              }}>
                {t('auth.enterOTP')} <strong>{resetEmail}</strong>
              </p>
              <div style={{
                display: 'flex',
                gap: '8px',
                justifyContent: 'center',
                marginBottom: '16px'
              }}>
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOTPChange(index, e.target.value)}
                    style={{
                      width: '40px',
                      height: '48px',
                      border: `2px solid ${digit ? '#52b788' : '#e5e7eb'}`,
                      borderRadius: '8px',
                      fontSize: '20px',
                      fontWeight: '600',
                      textAlign: 'center',
                      outline: 'none'
                    }}
                  />
                ))}
              </div>
              {error && (
                <div style={{
                  padding: '12px',
                  backgroundColor: '#fee2e2',
                  color: '#991b1b',
                  borderRadius: '8px',
                  marginBottom: '16px',
                  fontSize: '14px'
                }}>
                  {error}
                </div>
              )}
              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  onClick={() => {
                    setPasswordStep('idle');
                    setOtp(['', '', '', '', '', '']);
                  }}
                  style={{
                    flex: 1,
                    padding: '12px',
                    backgroundColor: '#ffffff',
                    color: '#6b7280',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '15px',
                    fontWeight: '500',
                    cursor: 'pointer'
                  }}
                >
                  {t('common.cancel')}
                </button>
                <button
                  onClick={handleVerifyOTP}
                  disabled={loading || otp.some(d => !d)}
                  style={{
                    flex: 1,
                    padding: '12px',
                    backgroundColor: loading || otp.some(d => !d) ? '#9ca3af' : '#52b788',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '15px',
                    fontWeight: '500',
                    cursor: loading || otp.some(d => !d) ? 'not-allowed' : 'pointer'
                  }}
                >
                  {loading ? t('common.verifying') : t('auth.verify')}
                </button>
              </div>
            </>
          )}

          {passwordStep === 'reset' && (
            <>
              <div style={{ marginBottom: '16px' }}>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#374151',
                  marginBottom: '8px'
                }}>
                  {t('account.newPassword')}
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder={t('auth.passwordPlaceholder')}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '15px'
                  }}
                />
              </div>
              <div style={{ marginBottom: '16px' }}>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#374151',
                  marginBottom: '8px'
                }}>
                  {t('account.confirmPassword')}
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder={t('auth.confirmPasswordPlaceholder')}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '15px'
                  }}
                />
              </div>
              {error && (
                <div style={{
                  padding: '12px',
                  backgroundColor: '#fee2e2',
                  color: '#991b1b',
                  borderRadius: '8px',
                  marginBottom: '16px',
                  fontSize: '14px'
                }}>
                  {error}
                </div>
              )}
              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  onClick={() => {
                    setPasswordStep('idle');
                    setNewPassword('');
                    setConfirmPassword('');
                  }}
                  style={{
                    flex: 1,
                    padding: '12px',
                    backgroundColor: '#ffffff',
                    color: '#6b7280',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '15px',
                    fontWeight: '500',
                    cursor: 'pointer'
                  }}
                >
                  {t('common.cancel')}
                </button>
                <button
                  onClick={handleResetPassword}
                  disabled={loading || !newPassword || !confirmPassword}
                  style={{
                    flex: 1,
                    padding: '12px',
                    backgroundColor: loading || !newPassword || !confirmPassword ? '#9ca3af' : '#52b788',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '15px',
                    fontWeight: '500',
                    cursor: loading || !newPassword || !confirmPassword ? 'not-allowed' : 'pointer'
                  }}
                >
                  {loading ? t('common.updating') : t('account.changePassword')}
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Success Modal */}
      <OrderSuccessModal
        isOpen={showSuccessModal}
        onClose={() => {
          setShowSuccessModal(false);
          setError('');
        }}
      />
        </>
      )}
    </div>
  );
}
