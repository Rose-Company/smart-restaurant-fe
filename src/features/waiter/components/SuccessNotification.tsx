import React, { useEffect } from 'react';
import { CheckCircle, X } from 'lucide-react';

interface SuccessNotificationProps {
  message: string;
  onClose: () => void;
  duration?: number;
}

export const SuccessNotification: React.FC<SuccessNotificationProps> = ({ 
  message, 
  onClose, 
  duration = 3000 
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <div style={{
      position: 'fixed',
      top: '24px',
      right: '24px',
      zIndex: 9999,
      animation: 'slideInRight 0.3s ease-out'
    }}>
      <div style={{
        background: 'linear-gradient(135deg, #00a63e 0%, #008236 100%)',
        borderRadius: '12px',
        boxShadow: '0px 10px 25px rgba(0, 166, 62, 0.4)',
        padding: '16px 20px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        minWidth: '320px',
        maxWidth: '480px'
      }}>
        <CheckCircle style={{ 
          width: '24px', 
          height: '24px', 
          color: '#ffffff',
          flexShrink: 0
        }} />
        
        <p style={{
          color: '#ffffff',
          fontSize: '16px',
          fontWeight: 600,
          lineHeight: '24px',
          margin: 0,
          flex: 1
        }}>
          {message}
        </p>

        <button
          onClick={onClose}
          style={{
            background: 'rgba(255, 255, 255, 0.2)',
            border: 'none',
            borderRadius: '6px',
            width: '28px',
            height: '28px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            flexShrink: 0,
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
          }}
        >
          <X style={{ width: '16px', height: '16px', color: '#ffffff' }} />
        </button>
      </div>

      <style>
        {`
          @keyframes slideInRight {
            from {
              transform: translateX(100%);
              opacity: 0;
            }
            to {
              transform: translateX(0);
              opacity: 1;
            }
          }
        `}
      </style>
    </div>
  );
};
