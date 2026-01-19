import { X } from 'lucide-react';

interface TableDetailModalProps {
  table: {
    id: number;
    status: 'available' | 'occupied' | 'cooking' | 'ready' | 'urgent';
    guests: number;
    orderAmount?: number;
    details?: string;
  };
  onClose: () => void;
  onAcceptRequest?: () => void;
  onMarkAsServed?: () => void;
}

export default function TableDetailModal({
  table,
  onClose,
  onAcceptRequest,
  onMarkAsServed
}: TableDetailModalProps) {
  const getStatusConfig = () => {
    switch (table.status) {
      case 'urgent':
        return {
          label: 'Urgent',
          bgColor: '#8b1a1f',
          textColor: '#fb2c36'
        };
      case 'ready':
        return {
          label: 'Ready',
          bgColor: '#004d24',
          textColor: '#00d65f'
        };
      case 'cooking':
        return {
          label: 'Cooking',
          bgColor: '#5f3f00',
          textColor: '#ffb020'
        };
      case 'occupied':
        return {
          label: 'Occupied',
          bgColor: '#0f2f6b',
          textColor: '#3b82f6'
        };
      default:
        return {
          label: 'Available',
          bgColor: '#2d3748',
          textColor: '#99a1af'
        };
    }
  };

  const statusConfig = getStatusConfig();

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
          background: '#2d3748',
          borderTopLeftRadius: '24px',
          borderTopRightRadius: '24px',
          padding: '24px',
          paddingBottom: 'calc(24px + env(safe-area-inset-bottom))',
          animation: 'slideUp 0.3s cubic-bezier(0.32, 0.72, 0, 1)',
          bottom: 0,
          maxHeight: '85vh',
          overflow: 'auto'
        }}
        className="table-detail-modal"
      >
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '24px'
        }}>
          <h2 style={{
            fontSize: '24px',
            fontWeight: 'bold',
            color: '#ffffff',
            margin: 0
          }}>
            Table {table.id}
          </h2>
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#99a1af',
              cursor: 'pointer',
              padding: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <X size={24} />
          </button>
        </div>

        {/* Divider */}
        <div style={{
          height: '1px',
          background: 'rgba(255, 255, 255, 0.1)',
          marginBottom: '24px'
        }} />

        {/* Status */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px'
        }}>
          <span style={{
            fontSize: '16px',
            color: '#99a1af'
          }}>Status</span>
          <span style={{
            padding: '6px 16px',
            borderRadius: '20px',
            fontSize: '14px',
            fontWeight: '600',
            background: statusConfig.bgColor,
            color: statusConfig.textColor
          }}>
            {statusConfig.label}
          </span>
        </div>

        {/* Guests */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px'
        }}>
          <span style={{
            fontSize: '16px',
            color: '#99a1af'
          }}>Guests</span>
          <span style={{
            fontSize: '16px',
            fontWeight: '600',
            color: '#ffffff'
          }}>
            {table.guests} people
          </span>
        </div>

        {/* Active Order (if exists) */}
        {table.orderAmount && (
          <div style={{
            background: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '12px',
            padding: '16px',
            marginBottom: '20px'
          }}>
            <div style={{
              fontSize: '14px',
              color: '#99a1af',
              marginBottom: '8px'
            }}>Active Order</div>
            <div style={{
              fontSize: '32px',
              fontWeight: 'bold',
              color: '#ffffff'
            }}>${table.orderAmount.toFixed(2)}</div>
          </div>
        )}

        {/* Details */}
        {table.details && (
          <>
            <div style={{
              fontSize: '16px',
              color: '#99a1af',
              marginBottom: '12px'
            }}>Details</div>
            <div style={{
              fontSize: '16px',
              color: '#ffffff',
              marginBottom: '24px'
            }}>
              {table.details}
            </div>
          </>
        )}

        {/* Action Buttons */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          marginTop: '32px'
        }}>
          {table.status === 'urgent' && onAcceptRequest && (
            <button
              onClick={onAcceptRequest}
              style={{
                width: '100%',
                padding: '16px',
                borderRadius: '12px',
                border: 'none',
                background: '#ff6b2c',
                color: '#ffffff',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#ff5517';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#ff6b2c';
              }}
            >
              Accept Request
            </button>
          )}

          {table.status === 'ready' && onMarkAsServed && (
            <button
              onClick={onMarkAsServed}
              style={{
                width: '100%',
                padding: '16px',
                borderRadius: '12px',
                border: 'none',
                background: '#00d65f',
                color: '#ffffff',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#00b851';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#00d65f';
              }}
            >
              Mark as Served
            </button>
          )}

          <button
            onClick={onClose}
            style={{
              width: '100%',
              padding: '16px',
              borderRadius: '12px',
              border: 'none',
              background: 'rgba(255, 255, 255, 0.1)',
              color: 'rgba(255, 255, 255, 0.4)',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
            }}
          >
            Close
          </button>
        </div>
      </div>

      <style>
        {`
          @media (min-width: 768px) {
            .table-detail-modal {
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
