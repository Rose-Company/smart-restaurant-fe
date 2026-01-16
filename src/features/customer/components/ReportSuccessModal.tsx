import React from 'react';
import { CheckCircle, Mail } from 'lucide-react';

interface ReportSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderNumber: string;
}

export function ReportSuccessModal({ isOpen, onClose, orderNumber }: ReportSuccessModalProps) {
  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      zIndex: 10000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '16px'
    }}>
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '16px',
        maxWidth: '400px',
        width: '100%',
        padding: '32px',
        boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
        textAlign: 'center'
      }}>
        {/* Success Icon */}
        <div style={{
          width: '80px',
          height: '80px',
          backgroundColor: 'rgba(39, 174, 96, 0.1)',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 24px'
        }}>
          <CheckCircle style={{
            width: '48px',
            height: '48px',
            color: '#27ae60',
            strokeWidth: 2
          }} />
        </div>

        {/* Heading */}
        <h2 style={{
          fontSize: '16px',
          fontWeight: '400',
          color: '#101828',
          margin: '0 0 12px 0',
          letterSpacing: '-0.31px'
        }}>
          We are sorry about that!
        </h2>

        {/* Description */}
        <p style={{
          fontSize: '16px',
          color: '#4a5565',
          margin: '0 0 12px 0',
          letterSpacing: '-0.31px',
          lineHeight: '1.5'
        }}>
          Your report for{' '}
          <span style={{ fontWeight: '600', color: '#101828' }}>
            Order #{orderNumber}
          </span>
          {' '}has been received.
        </p>

        <p style={{
          fontSize: '16px',
          color: '#4a5565',
          margin: '0 0 24px 0',
          letterSpacing: '-0.31px',
          lineHeight: '1.5'
        }}>
          Our support team will review it and contact you via email shortly.
        </p>

        {/* Email Banner */}
        <div style={{
          backgroundColor: '#eff6ff',
          border: '1px solid #bedbff',
          borderRadius: '10px',
          padding: '16px',
          display: 'flex',
          gap: '12px',
          alignItems: 'flex-start',
          marginBottom: '24px',
          textAlign: 'left'
        }}>
          <Mail style={{
            width: '20px',
            height: '20px',
            color: '#1c398e',
            flexShrink: 0,
            marginTop: '2px'
          }} />
          <div>
            <p style={{
              fontSize: '14px',
              fontWeight: '400',
              color: '#1c398e',
              margin: '0 0 4px 0',
              letterSpacing: '-0.15px'
            }}>
              Check your inbox
            </p>
            <p style={{
              fontSize: '12px',
              color: '#1447e6',
              margin: 0,
              lineHeight: '1.3'
            }}>
              We'll send updates to your registered email address
            </p>
          </div>
        </div>

        {/* Back Button */}
        <button
          onClick={onClose}
          style={{
            width: '100%',
            padding: '14px',
            backgroundColor: '#ffffff',
            color: '#27ae60',
            border: '1px solid #27ae60',
            borderRadius: '8px',
            fontSize: '16px',
            fontWeight: '500',
            cursor: 'pointer',
            letterSpacing: '-0.31px',
            marginBottom: '16px'
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f0fdf4'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#ffffff'}
        >
          Back to Order Details
        </button>

        {/* Help Text */}
        <p style={{
          fontSize: '12px',
          color: '#6a7282',
          margin: 0
        }}>
          Need immediate help? Call us at{' '}
          <span style={{
            fontWeight: '600',
            color: '#27ae60'
          }}>
            1-800-RESTO
          </span>
        </p>
      </div>
    </div>
  );
}
