import { X, Minus, Plus, Sparkles } from 'lucide-react';
import { useState } from 'react';

interface OpenTableModalProps {
  tableId: number;
  onClose: () => void;
  onAssign?: (tableId: number, guests: number) => void;
  onMarkClean?: (tableId: number) => void;
}

export default function OpenTableModal({
  tableId,
  onClose,
  onAssign,
  onMarkClean
}: OpenTableModalProps) {
  const [guests, setGuests] = useState(4);
  const quickSelectOptions = [2, 4, 6, 8];

  const handleIncrement = () => {
    if (guests < 20) setGuests(guests + 1);
  };

  const handleDecrement = () => {
    if (guests > 1) setGuests(guests - 1);
  };

  const handleQuickSelect = (num: number) => {
    setGuests(num);
  };

  const handleAssign = () => {
    if (onAssign) {
      onAssign(tableId, guests);
    }
    onClose();
  };

  const handleCleanOnly = () => {
    if (onMarkClean) {
      onMarkClean(tableId);
    }
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.7)',
          zIndex: 10000,
          animation: 'fadeIn 0.2s ease-out'
        }}
      />

      {/* Modal */}
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          position: 'fixed',
          left: 0,
          right: 0,
          zIndex: 10001,
          background: 'linear-gradient(to bottom, #2d4a4a 0%, #1e2d3d 100%)',
          borderTopLeftRadius: '24px',
          borderTopRightRadius: '24px',
          padding: '24px',
          paddingBottom: 'calc(24px + env(safe-area-inset-bottom))',
          animation: 'slideUp 0.3s cubic-bezier(0.32, 0.72, 0, 1)',
          bottom: 0,
          maxHeight: '85vh',
          overflow: 'auto'
        }}
        className="open-table-modal"
      >
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '32px'
        }}>
          <h2 style={{
            fontSize: '28px',
            fontWeight: 'bold',
            color: '#ffffff',
            margin: 0
          }}>
            Open Table {tableId}
          </h2>
          <button
            onClick={onClose}
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              border: 'none',
              color: '#ffffff',
              cursor: 'pointer',
              padding: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '50%',
              width: '40px',
              height: '40px'
            }}
          >
            <X size={24} />
          </button>
        </div>

        {/* Divider */}
        <div style={{
          height: '1px',
          background: 'rgba(255, 255, 255, 0.1)',
          marginBottom: '32px'
        }} />

        {/* Guest Selection */}
        <div style={{
          textAlign: 'center',
          marginBottom: '32px'
        }}>
          <div style={{
            fontSize: '16px',
            color: '#99a1af',
            marginBottom: '24px'
          }}>
            How many guests?
          </div>

          {/* Counter */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '24px',
            marginBottom: '32px'
          }}>
            <button
              onClick={handleDecrement}
              disabled={guests <= 1}
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                background: '#2d3f4f',
                border: 'none',
                color: '#ffffff',
                cursor: guests <= 1 ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                opacity: guests <= 1 ? 0.5 : 1,
                transition: 'all 0.2s'
              }}
            >
              <Minus size={28} />
            </button>

            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center'
            }}>
              <div style={{
                fontSize: '72px',
                fontWeight: 'bold',
                color: '#ffffff',
                lineHeight: '1'
              }}>
                {guests}
              </div>
              <div style={{
                fontSize: '16px',
                color: '#99a1af',
                marginTop: '8px'
              }}>
                Guests
              </div>
            </div>

            <button
              onClick={handleIncrement}
              disabled={guests >= 20}
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                background: '#3d9970',
                border: 'none',
                color: '#ffffff',
                cursor: guests >= 20 ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                opacity: guests >= 20 ? 0.5 : 1,
                transition: 'all 0.2s'
              }}
            >
              <Plus size={28} />
            </button>
          </div>

          {/* Quick Select */}
          <div style={{
            display: 'flex',
            gap: '12px',
            justifyContent: 'center'
          }}>
            {quickSelectOptions.map((num) => (
              <button
                key={num}
                onClick={() => handleQuickSelect(num)}
                style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  background: guests === num ? '#3d9970' : '#2d3f4f',
                  border: 'none',
                  color: '#ffffff',
                  fontSize: '24px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                {num}
              </button>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div style={{
          height: '1px',
          background: 'rgba(255, 255, 255, 0.1)',
          marginBottom: '24px'
        }} />

        {/* Action Buttons */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '16px'
        }}>
          <button
            onClick={handleAssign}
            style={{
              width: '100%',
              padding: '18px',
              borderRadius: '12px',
              border: 'none',
              background: '#3d9970',
              color: '#ffffff',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#2d8760';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#3d9970';
            }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M16 21V19C16 17.9391 15.5786 16.9217 14.8284 16.1716C14.0783 15.4214 13.0609 15 12 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M8.5 11C10.7091 11 12.5 9.20914 12.5 7C12.5 4.79086 10.7091 3 8.5 3C6.29086 3 4.5 4.79086 4.5 7C4.5 9.20914 6.29086 11 8.5 11Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M20 8V14M23 11H17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Assign to me & start
          </button>

          <button
            onClick={handleCleanOnly}
            style={{
              width: '100%',
              padding: '16px',
              borderRadius: '12px',
              border: 'none',
              background: 'transparent',
              color: '#99a1af',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'all 0.2s',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = '#ffffff';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = '#99a1af';
            }}
          >
            <Sparkles size={18} />
            Just cleaning (Mark as Clean only)
          </button>
        </div>
      </div>

      <style>
        {`
          @media (min-width: 468px) {
            .open-table-modal {
              left: 50% !important;
              right: auto !important;
              bottom: auto !important;
              top: 50% !important;
              transform: translate(-50%, -50%) !important;
              animation: fadeIn 0.2s ease-out !important;
              border-radius: 16px !important;
              max-width: 500px;
              width: 90%;
              max-height: 90vh;
            }
          }
        `}
      </style>
    </>
  );
}
