import React, { useState } from 'react';
import { ArrowLeft, Users } from 'lucide-react';
import TableDetailModal from './TableDetailModal';
import OpenTableModal from './OpenTableModal';

interface Table {
  id: number;
  status: 'available' | 'occupied' | 'cooking' | 'ready' | 'urgent';
  guests?: number;
}

interface TableMapModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTableSelect?: (tableId: number) => void;
}

export const TableMapModal: React.FC<TableMapModalProps> = ({
  isOpen,
  onClose,
  onTableSelect
}) => {
  const [selectedTable, setSelectedTable] = useState<number | null>(null);
  const [openTableId, setOpenTableId] = useState<number | null>(null);

  if (!isOpen) return null;

  // Mock table data with details
  const tables: Table[] = [
    { id: 1, status: 'available' },
    { id: 2, status: 'urgent', guests: 4 },
    { id: 3, status: 'ready', guests: 2 },
    { id: 4, status: 'available' },
    { id: 5, status: 'urgent', guests: 3 },
    { id: 6, status: 'occupied', guests: 2 },
    { id: 7, status: 'cooking', guests: 4 },
    { id: 8, status: 'ready', guests: 2 },
    { id: 9, status: 'available' },
    { id: 10, status: 'occupied', guests: 3 },
    { id: 11, status: 'available' },
    { id: 12, status: 'urgent', guests: 2 }
  ];

  // Table details data
  const tableDetails: Record<number, { orderAmount?: number; details: string }> = {
    2: { details: 'Customer needs napkins' },
    3: { orderAmount: 32.50, details: 'Burger & Fries Ready' },
    5: { details: 'Customer requesting service' },
    6: { orderAmount: 45.20, details: 'Guests ordering' },
    7: { orderAmount: 67.30, details: 'Kitchen cooking' },
    8: { orderAmount: 28.90, details: 'Order ready to serve' },
    10: { orderAmount: 52.15, details: 'Dining in progress' },
    12: { details: 'Urgent assistance needed' }
  };

  const getTableStyle = (status: Table['status']) => {
    switch (status) {
      case 'available':
        return {
          background: 'transparent',
          border: '2px solid #4a5565',
          color: '#99a1af'
        };
      case 'occupied':
        return {
          background: '#155dfc',
          border: '2px solid #2b7fff',
          color: '#ffffff'
        };
      case 'cooking':
        return {
          background: '#d08700',
          border: '2px solid #f0b100',
          color: '#ffffff'
        };
      case 'ready':
        return {
          background: '#00a63e',
          border: '2px solid #00c950',
          color: '#ffffff'
        };
      case 'urgent':
        return {
          background: '#e7000b',
          border: '2px solid #fb2c36',
          color: '#ffffff',
          opacity: 0.6,
          animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
        };
    }
  };

  const getStatusLabel = (status: Table['status']) => {
    switch (status) {
      case 'available':
        return 'Available';
      case 'occupied':
        return 'Occupied';
      case 'cooking':
        return 'Cooking';
      case 'ready':
        return 'Ready';
      case 'urgent':
        return 'Urgent';
    }
  };

  const handleTableClick = (table: Table) => {
    if (table.status === 'available') {
      setOpenTableId(table.id);
    } else {
      setSelectedTable(table.id);
      if (onTableSelect) {
        onTableSelect(table.id);
      }
    }
  };

  const selectedTableData = selectedTable ? tables.find(t => t.id === selectedTable) : null;
  const selectedTableDetail = selectedTable ? tableDetails[selectedTable] : null;

  return (
    <>
      {/* Backdrop */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.8)',
          zIndex: 999,
          animation: 'fadeIn 0.2s ease-out'
        }}
      />

      {/* Modal */}
      <div 
        onClick={(e) => e.stopPropagation()}
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 1000,
          display: 'flex',
          flexDirection: 'column',
          background: '#101828',
          animation: 'slideUp 0.3s ease-out'
        }}>
        {/* Header */}
        <div style={{
          background: 'linear-gradient(to right, #1e2939, #2a3f4f)',
          borderBottom: '1px solid #364153',
          padding: '16px 16px',
          paddingTop: 'calc(16px + env(safe-area-inset-top))',
          zIndex: 10
        }}>
          <button
            onClick={onClose}
            style={{
              width: '40px',
              height: '40px',
              background: 'transparent',
              border: 'none',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              marginBottom: '16px',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
            }}
          >
            <ArrowLeft style={{ width: '24px', height: '24px', color: '#ffffff' }} />
          </button>

          <div>
            <h1 style={{
              color: '#ffffff',
              fontSize: '20px',
              fontWeight: 'bold',
              lineHeight: '28px',
              margin: 0,
              marginBottom: '4px',
              letterSpacing: '-0.4492px'
            }}>
              Floor Plan
            </h1>
            <p style={{
              color: '#99a1af',
              fontSize: '14px',
              lineHeight: '20px',
              margin: 0,
              letterSpacing: '-0.1504px'
            }}>
              Restaurant table overview
            </p>
          </div>
        </div>

        {/* Content */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          background: '#101828',
          padding: '16px'
        }}>
          {/* Status Legend */}
          <div style={{
            background: '#1e2939',
            borderRadius: '10px',
            padding: '16px',
            marginBottom: '16px'
          }}>
            <p style={{
              color: '#99a1af',
              fontSize: '12px',
              lineHeight: '16px',
              margin: '0 0 12px 0',
              letterSpacing: '0.6px',
              textTransform: 'uppercase'
            }}>
              Status Legend
            </p>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '12px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{
                  width: '16px',
                  height: '16px',
                  background: '#4a5565',
                  borderRadius: '4px'
                }} />
                <span style={{
                  color: '#ffffff',
                  fontSize: '14px',
                  lineHeight: '20px',
                  letterSpacing: '-0.1504px'
                }}>
                  Available
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{
                  width: '16px',
                  height: '16px',
                  background: '#155dfc',
                  borderRadius: '4px'
                }} />
                <span style={{
                  color: '#ffffff',
                  fontSize: '14px',
                  lineHeight: '20px',
                  letterSpacing: '-0.1504px'
                }}>
                  Occupied
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{
                  width: '16px',
                  height: '16px',
                  background: '#d08700',
                  borderRadius: '4px'
                }} />
                <span style={{
                  color: '#ffffff',
                  fontSize: '14px',
                  lineHeight: '20px',
                  letterSpacing: '-0.1504px'
                }}>
                  Cooking
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{
                  width: '16px',
                  height: '16px',
                  background: '#00a63e',
                  borderRadius: '4px'
                }} />
                <span style={{
                  color: '#ffffff',
                  fontSize: '14px',
                  lineHeight: '20px',
                  letterSpacing: '-0.1504px'
                }}>
                  Food Ready
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{
                  width: '16px',
                  height: '16px',
                  background: '#e7000b',
                  borderRadius: '4px'
                }} />
                <span style={{
                  color: '#ffffff',
                  fontSize: '14px',
                  lineHeight: '20px',
                  letterSpacing: '-0.1504px'
                }}>
                  Urgent
                </span>
              </div>
            </div>
          </div>

          {/* Table Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '12px'
          }}>
            {tables.map((table) => {
              const style = getTableStyle(table.status);
              const isAvailable = table.status === 'available';

              return (
                <button
                  key={table.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleTableClick(table);
                  }}
                  style={{
                    ...style,
                    borderRadius: '12px',
                    padding: '12px 8px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: isAvailable ? '6px' : '3px',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    minHeight: '110px',
                    position: 'relative',
                    transform: 'scale(1)',
                    boxShadow: 'none'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'scale(1.08)';
                    e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.4)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  {isAvailable ? (
                    <>
                      <svg
                        width="32"
                        height="32"
                        viewBox="0 0 40 40"
                        fill="none"
                        style={{ opacity: 0.5 }}
                      >
                        <path
                          d="M16 8V24M8 16H24"
                          stroke="#99a1af"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                        />
                      </svg>
                      <div style={{
                        color: style.color,
                        fontSize: '15px',
                        fontWeight: 'bold',
                        lineHeight: '22px',
                        letterSpacing: '-0.3px'
                      }}>
                        Table {table.id}
                      </div>
                      <div style={{
                        color: style.color,
                        fontSize: '11px',
                        lineHeight: '14px',
                        opacity: 0.75
                      }}>
                        Available
                      </div>
                    </>
                  ) : (
                    <>
                      <div style={{
                        fontSize: '22px',
                        fontWeight: 'bold',
                        lineHeight: '28px',
                        letterSpacing: '0.05px',
                        color: style.color
                      }}>
                        {table.id}
                      </div>
                      <div style={{
                        fontSize: '11px',
                        lineHeight: '14px',
                        opacity: 0.9,
                        color: style.color
                      }}>
                        {getStatusLabel(table.status)}
                      </div>
                      {table.guests && (
                        <div style={{
                          fontSize: '10px',
                          lineHeight: '13px',
                          opacity: 0.75,
                          color: style.color,
                          display: 'flex',
                          alignItems: 'center',
                          gap: '2px'
                        }}>
                          {table.guests} guests
                        </div>
                      )}
                    </>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Table Detail Modal */}
      {selectedTableData && selectedTableDetail && (
        <TableDetailModal
          table={{
            id: selectedTableData.id,
            status: selectedTableData.status,
            guests: selectedTableData.guests || 0,
            orderAmount: selectedTableDetail.orderAmount,
            details: selectedTableDetail.details
          }}
          onClose={() => setSelectedTable(null)}
          onAcceptRequest={() => {
            console.log('Accept request for table', selectedTableData.id);
            setSelectedTable(null);
          }}
          onMarkAsServed={() => {
            console.log('Mark as served for table', selectedTableData.id);
            setSelectedTable(null);
          }}
        />
      )}

      {/* Open Table Modal */}
      {openTableId && (
        <OpenTableModal
          tableId={openTableId}
          onClose={() => setOpenTableId(null)}
          onAssign={(tableId, guests) => {
            console.log('Assign table', tableId, 'with', guests, 'guests');
            setOpenTableId(null);
          }}
          onMarkClean={(tableId) => {
            console.log('Mark table', tableId, 'as clean');
            setOpenTableId(null);
          }}
        />
      )}

      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          
          @keyframes slideUp {
            from {
              transform: translateY(100%);
            }
            to {
              transform: translateY(0);
            }
          }
          
          @keyframes pulse {
            0%, 100% {
              opacity: 0.6;
            }
            50% {
              opacity: 0.9;
            }
          }
        `}
      </style>
    </>
  );
};
