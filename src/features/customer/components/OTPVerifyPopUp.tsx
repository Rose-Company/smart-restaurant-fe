import React, { useState, useRef, useEffect } from 'react';
import { X, Mail } from 'lucide-react';

interface OTPVerificationPopupProps {
  email: string;
  isOpen: boolean;
  onClose: () => void;
  onVerify: (otpCode: string) => Promise<void>;
  onResendOTP: () => Promise<void>;
}

export function OTPVerificationPopup({ email, isOpen, onClose, onVerify, onResendOTP }: OTPVerificationPopupProps) {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [resendCountdown, setResendCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (isOpen) {
      // Focus first input when popup opens
      setTimeout(() => {
        inputRefs.current[0]?.focus();
      }, 100);
    } else {
      // Reset state when popup closes
      setOtp(['', '', '', '', '', '']);
      setError('');
      setResendCountdown(60);
      setCanResend(false);
    }
  }, [isOpen]);

  useEffect(() => {
    if (resendCountdown > 0 && isOpen) {
      const timer = setTimeout(() => {
        setResendCountdown(resendCountdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [resendCountdown, isOpen]);

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) {
      value = value[0];
    }

    if (!/^\d*$/.test(value)) {
      return;
    }

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setError('');

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-submit when all filled
    if (newOtp.every(digit => digit !== '') && index === 5) {
      handleVerify(newOtp.join(''));
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6);

    if (!/^\d+$/.test(pastedData)) {
      return;
    }

    const newOtp = [...otp];
    for (let i = 0; i < pastedData.length; i++) {
      newOtp[i] = pastedData[i];
    }
    setOtp(newOtp);

    // Focus last filled input or submit
    const lastIndex = Math.min(pastedData.length - 1, 5);
    inputRefs.current[lastIndex]?.focus();

    if (pastedData.length === 6) {
      handleVerify(pastedData);
    }
  };

  const handleVerify = async (otpCode: string) => {
    setError('');
    setLoading(true);

    try {
      await onVerify(otpCode);
      // Parent component will handle closing the popup on success
    } catch (err: any) {
      setError(err.message || 'Verification failed. Please try again.');
      // Clear OTP on error
      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (!canResend) return;

    setLoading(true);
    setError('');

    try {
      await onResendOTP();
      setResendCountdown(60);
      setCanResend(false);
      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } catch (err: any) {
      setError(err.message || 'Failed to resend OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const otpCode = otp.join('');

    if (otpCode.length !== 6) {
      setError('Please enter all 6 digits');
      return;
    }

    handleVerify(otpCode);
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '16px'
        }}
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            onClose();
          }
        }}
      >
        {/* Popup */}
        <div
          style={{
            width: '100%',
            maxWidth: '400px',
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            padding: '32px',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
            position: 'relative',
            maxHeight: '90vh',
            overflowY: 'auto'
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            style={{
              position: 'absolute',
              right: '16px',
              top: '16px',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '8px',
              display: 'flex',
              alignItems: 'center',
              borderRadius: '8px'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f3f4f6'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            <X style={{ width: '20px', height: '20px', color: '#6b7280' }} />
          </button>

          {/* Icon */}
          <div style={{
            width: '80px',
            height: '80px',
            margin: '0 auto 24px',
            borderRadius: '50%',
            backgroundColor: '#dcfce7',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Mail style={{ width: '40px', height: '40px', color: '#52b788' }} />
          </div>

          <h1 style={{
            fontSize: '28px',
            fontWeight: '700',
            color: '#1f2937',
            marginBottom: '8px',
            textAlign: 'center'
          }}>
            Verify Your Email
          </h1>
          <p style={{
            fontSize: '15px',
            color: '#6b7280',
            marginBottom: '32px',
            textAlign: 'center'
          }}>
            We've sent a 6-digit code to<br />
            <strong style={{ color: '#1f2937' }}>{email}</strong>
          </p>

          {error && (
            <div style={{
              padding: '12px 16px',
              backgroundColor: '#fee2e2',
              color: '#991b1b',
              borderRadius: '8px',
              marginBottom: '20px',
              fontSize: '14px',
              textAlign: 'center'
            }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* OTP Input */}
            <div style={{
              display: 'flex',
              gap: '12px',
              justifyContent: 'center',
              marginBottom: '24px'
            }}>
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={el => { inputRefs.current[index] = el; }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={handlePaste}
                  disabled={loading}
                  style={{
                    width: '48px',
                    height: '56px',
                    border: `2px solid ${digit ? '#52b788' : '#d1d5db'}`,
                    borderRadius: '12px',
                    fontSize: '24px',
                    fontWeight: '600',
                    textAlign: 'center',
                    outline: 'none',
                    backgroundColor: loading ? '#f9fafb' : '#ffffff',
                    color: '#1f2937',
                    transition: 'border-color 0.2s'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#52b788';
                    e.target.select();
                  }}
                  onBlur={(e) => {
                    if (!digit) {
                      e.target.style.borderColor = '#d1d5db';
                    }
                  }}
                />
              ))}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || otp.some(digit => !digit)}
              style={{
                width: '100%',
                padding: '14px',
                backgroundColor: loading || otp.some(digit => !digit) ? '#9ca3af' : '#52b788',
                color: '#ffffff',
                border: 'none',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: loading || otp.some(digit => !digit) ? 'not-allowed' : 'pointer',
                marginBottom: '16px'
              }}
              onMouseEnter={(e) => {
                if (!loading && otp.every(digit => digit)) {
                  e.currentTarget.style.backgroundColor = '#40a574';
                }
              }}
              onMouseLeave={(e) => {
                if (!loading && otp.every(digit => digit)) {
                  e.currentTarget.style.backgroundColor = '#52b788';
                }
              }}
            >
              {loading ? 'Verifying...' : 'Verify Code'}
            </button>

            {/* Resend OTP */}
            <div style={{
              textAlign: 'center',
              fontSize: '14px',
              color: '#6b7280'
            }}>
              Didn't receive the code?{' '}
              {canResend ? (
                <button
                  type="button"
                  onClick={handleResendOTP}
                  disabled={loading}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#52b788',
                    fontWeight: '600',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    padding: 0,
                    textDecoration: 'underline'
                  }}
                >
                  Resend
                </button>
              ) : (
                <span style={{ color: '#9ca3af' }}>
                  Resend in {resendCountdown}s
                </span>
              )}
            </div>
          </form>
        </div>
      </div>
    </>
  );
}