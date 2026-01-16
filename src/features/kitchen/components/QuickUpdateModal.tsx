import React, { useState } from 'react';
import { X, Check } from 'lucide-react';

interface QuickUpdateModalProps {
  isOpen: boolean;
  onClose: () => void;
  itemName: string;
  category: string;
  tables: Array<{
    tableNumber: string;
    quantity: number;
    orderNumber: string;
    orderId: string;
    itemId: string;
  }>;
  onConfirm: (selections: Array<{ orderId: string; itemId: string }>) => void;
}

export function QuickUpdateModal({ 
  isOpen, 
  onClose, 
  itemName, 
  category,
  tables, 
  onConfirm 
}: QuickUpdateModalProps) {
  const [selectedTables, setSelectedTables] = useState<Set<string>>(new Set(tables.map(t => t.orderId)));

  if (!isOpen) return null;

  const toggleTable = (orderId: string) => {
    setSelectedTables(prev => {
      const newSet = new Set(prev);
      if (newSet.has(orderId)) {
        newSet.delete(orderId);
      } else {
        newSet.add(orderId);
      }
      return newSet;
    });
  };

  const handleConfirm = () => {
    const selections = tables
      .filter(t => selectedTables.has(t.orderId))
      .map(t => ({ orderId: t.orderId, itemId: t.itemId }));
    
    onConfirm(selections);
    onClose();
  };

  const selectedCount = selectedTables.size;
  const totalQuantity = tables
    .filter(t => selectedTables.has(t.orderId))
    .reduce((sum, t) => sum + t.quantity, 0);

  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case 'Appetizer': return '#00a63e';
      case 'Main Course': return '#ff6900';
      case 'Dessert': return '#e91e63';
      case 'Beverage': return '#155dfc';
      default: return '#6b7280';
    }
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.9)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 60
    }}>
      <div style={{
        backgroundColor: '#101828',
        border: '2px solid #364153',
        borderRadius: '24px',
        width: '600px',
        maxWidth: '90vw',
        maxHeight: '80vh',
        boxShadow: '0px 25px 50px -12px rgba(0,0,0,0.5)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
      }}>
        {/* Header */}
        <div style={{
          background: `linear-gradient(135deg, ${getCategoryColor(category)}, ${getCategoryColor(category)}dd)`,
          padding: '24px 32px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div>
            <h3 style={{
              fontSize: '24px',
              fontWeight: 'bold',
              color: '#ffffff',
              margin: '0 0 8px 0',
              lineHeight: '32px'
            }}>
              Mark as Done
            </h3>
            <p style={{
              fontSize: '18px',
              fontWeight: 600,
              color: 'rgba(255, 255, 255, 0.95)',
              margin: 0
            }}>
              {itemName}
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'background-color 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.3)'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)'}
          >
            <X style={{ width: '20px', height: '20px', color: '#ffffff' }} />
          </button>
        </div>

        {/* Instructions */}
        <div style={{
          padding: '24px 32px',
          backgroundColor: 'rgba(30, 41, 57, 0.5)',
          borderBottom: '1px solid #364153'
        }}>
          <p style={{
            fontSize: '15px',
            color: '#d1d5dc',
            margin: 0,
            lineHeight: '22px'
          }}>
            Select tables to mark this item as done. All selected items will be updated at once.
          </p>
        </div>

        {/* Tables List */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: '24px 32px'
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {tables.map((table) => {
              const isSelected = selectedTables.has(table.orderId);
              
              return (
                <div
                  key={table.orderId}
                  onClick={() => toggleTable(table.orderId)}
                  style={{
                    backgroundColor: isSelected ? 'rgba(0, 166, 62, 0.1)' : '#1e2939',
                    border: isSelected ? '2px solid #00a63e' : '2px solid #364153',
                    borderRadius: '12px',
                    padding: '16px 20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    if (!isSelected) {
                      e.currentTarget.style.backgroundColor = '#2a3a4d';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isSelected) {
                      e.currentTarget.style.backgroundColor = '#1e2939';
                    }
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    {/* Checkbox */}
                    <div style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '8px',
                      border: isSelected ? '2px solid #00a63e' : '2px solid #4a5565',
                      backgroundColor: isSelected ? '#00a63e' : 'transparent',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'all 0.2s'
                    }}>
                      {isSelected && (
                        <Check style={{ width: '18px', height: '18px', color: '#ffffff' }} />
                      )}
                    </div>

                    {/* Table Info */}
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <span style={{
                          fontSize: '18px',
                          fontWeight: 'bold',
                          color: isSelected ? '#00a63e' : '#ffffff'
                        }}>
                          Table {table.tableNumber}
                        </span>
                        <span style={{
                          fontSize: '14px',
                          color: '#99a1af'
                        }}>
                          {table.orderNumber}
                        </span>
                      </div>
                      <p style={{
                        fontSize: '14px',
                        color: '#99a1af',
                        margin: '4px 0 0 0'
                      }}>
                        Quantity: {table.quantity}x
                      </p>
                    </div>
                  </div>

                  {/* Quantity Badge */}
                  <div style={{
                    backgroundColor: isSelected ? '#00a63e' : '#364153',
                    color: '#ffffff',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    padding: '6px 16px',
                    borderRadius: '8px',
                    minWidth: '48px',
                    textAlign: 'center'
                  }}>
                    {table.quantity}x
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div style={{
          backgroundColor: 'rgba(30, 41, 57, 0.5)',
          borderTop: '2px solid #364153',
          padding: '24px 32px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div>
            <p style={{
              fontSize: '14px',
              color: '#99a1af',
              margin: '0 0 4px 0'
            }}>
              Selected
            </p>
            <p style={{
              fontSize: '20px',
              fontWeight: 'bold',
              color: '#ffffff',
              margin: 0
            }}>
              {selectedCount} {selectedCount === 1 ? 'table' : 'tables'} • {totalQuantity} items
            </p>
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              onClick={onClose}
              style={{
                height: '48px',
                padding: '0 24px',
                border: '2px solid #4a5565',
                borderRadius: '8px',
                backgroundColor: 'transparent',
                color: '#ffffff',
                fontSize: '16px',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'background-color 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(74, 85, 101, 0.2)'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              disabled={selectedCount === 0}
              style={{
                height: '48px',
                padding: '0 32px',
                border: 'none',
                borderRadius: '8px',
                backgroundColor: selectedCount > 0 ? '#00a63e' : '#364153',
                color: selectedCount > 0 ? '#ffffff' : '#6a7282',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: selectedCount > 0 ? 'pointer' : 'not-allowed',
                opacity: selectedCount > 0 ? 1 : 0.5,
                transition: 'all 0.2s',
                boxShadow: selectedCount > 0 ? '0px 10px 15px -3px rgba(0,166,62,0.3)' : 'none'
              }}
              onMouseEnter={(e) => {
                if (selectedCount > 0) {
                  e.currentTarget.style.backgroundColor = '#009650';
                }
              }}
              onMouseLeave={(e) => {
                if (selectedCount > 0) {
                  e.currentTarget.style.backgroundColor = '#00a63e';
                }
              }}
            >
              Mark as Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
