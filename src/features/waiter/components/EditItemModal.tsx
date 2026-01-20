import React, { useState } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';

// UI-friendly representation of order item
interface UIOrderItem {
  id: string;
  name: string;
  quantity: number;
  status: 'pending' | 'completed';
  modifiers?: string[];
  note?: string;
  price: number;
}

interface EditItemModalProps {
  item: UIOrderItem;
  isOpen: boolean;
  onClose: () => void;
  onSave: (item: UIOrderItem) => void;
}

export const EditItemModal: React.FC<EditItemModalProps> = ({
  item,
  isOpen,
  onClose,
  onSave
}) => {
  const [modifiers, setModifiers] = useState<string[]>(item.modifiers || []);
  const [newModifier, setNewModifier] = useState('');
  const [note, setNote] = useState(item.note || '');

  if (!isOpen) return null;

  const handleAddModifier = () => {
    if (newModifier.trim()) {
      setModifiers([...modifiers, newModifier.trim()]);
      setNewModifier('');
    }
  };

  const handleRemoveModifier = (index: number) => {
    setModifiers(modifiers.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    onSave({
      ...item,
      modifiers: modifiers.length > 0 ? modifiers : undefined,
      note: note.trim() || undefined
    });
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.8)',
          zIndex: 1100,
          animation: 'fadeIn 0.2s ease-out'
        }}
      />

      {/* Modal */}
      <div style={{
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '90%',
        maxWidth: '600px',
        maxHeight: '80vh',
        background: '#1e2939',
        borderRadius: '16px',
        boxShadow: '0px 20px 50px rgba(0, 0, 0, 0.5)',
        zIndex: 1101,
        animation: 'scaleIn 0.2s ease-out',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* Header */}
        <div style={{
          padding: '20px 24px',
          borderBottom: '1px solid #364153',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <h2 style={{
            color: '#ffffff',
            fontSize: '20px',
            fontWeight: 'bold',
            margin: 0,
            letterSpacing: '-0.4492px'
          }}>
            Chỉnh sửa món ăn
          </h2>

          <button
            onClick={onClose}
            style={{
              width: '32px',
              height: '32px',
              background: 'rgba(255, 255, 255, 0.1)',
              border: 'none',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
            }}
          >
            <X style={{ width: '20px', height: '20px', color: '#ffffff' }} />
          </button>
        </div>

        {/* Content */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: '24px'
        }}>
          {/* Item Name */}
          <div style={{ marginBottom: '24px' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              marginBottom: '8px'
            }}>
              <span style={{
                color: '#ffffff',
                fontSize: '24px',
                fontWeight: 'bold',
                letterSpacing: '0.0703px'
              }}>
                {item.quantity}x
              </span>
              <h3 style={{
                color: '#ffffff',
                fontSize: '18px',
                fontWeight: 'bold',
                margin: 0,
                letterSpacing: '-0.4395px'
              }}>
                {item.name}
              </h3>
            </div>
            <div style={{
              padding: '8px 12px',
              background: item.status === 'pending' 
                ? 'rgba(255, 137, 4, 0.1)' 
                : 'rgba(0, 201, 80, 0.1)',
              borderRadius: '8px',
              width: 'fit-content'
            }}>
              <span style={{
                color: item.status === 'pending' 
                  ? '#ff8904' 
                  : '#05df72',
                fontSize: '12px',
                fontWeight: 600,
                textTransform: 'capitalize'
              }}>
                {item.status === 'pending' ? 'Đang chờ' : 'Hoàn tất'}
              </span>
            </div>
          </div>

          {/* Modifiers Section */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{
              display: 'block',
              color: '#d1d5dc',
              fontSize: '14px',
              fontWeight: 600,
              marginBottom: '12px',
              letterSpacing: '-0.1504px'
            }}>
              Yêu cầu đặc biệt (Modifiers)
            </label>

            {/* Existing Modifiers */}
            {modifiers.length > 0 && (
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                marginBottom: '12px'
              }}>
                {modifiers.map((modifier, index) => (
                  <div
                    key={index}
                    style={{
                      background: 'rgba(253, 199, 0, 0.1)',
                      border: '1px solid rgba(253, 199, 0, 0.3)',
                      borderRadius: '8px',
                      padding: '10px 12px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}
                  >
                    <span style={{
                      color: '#fdc700',
                      fontSize: '14px',
                      fontWeight: 500,
                      letterSpacing: '-0.1504px'
                    }}>
                      • {modifier}
                    </span>
                    <button
                      onClick={() => handleRemoveModifier(index)}
                      style={{
                        background: 'rgba(231, 0, 11, 0.2)',
                        border: 'none',
                        borderRadius: '6px',
                        width: '28px',
                        height: '28px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'rgba(231, 0, 11, 0.3)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'rgba(231, 0, 11, 0.2)';
                      }}
                    >
                      <Trash2 style={{ width: '14px', height: '14px', color: '#ff6467' }} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Add New Modifier */}
            <div style={{
              display: 'flex',
              gap: '8px'
            }}>
              <input
                type="text"
                value={newModifier}
                onChange={(e) => setNewModifier(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleAddModifier();
                  }
                }}
                placeholder="VD: Không hành, Thêm phô mai..."
                style={{
                  flex: 1,
                  background: 'rgba(16, 24, 40, 0.5)',
                  border: '1px solid #364153',
                  borderRadius: '8px',
                  padding: '10px 12px',
                  color: '#ffffff',
                  fontSize: '14px',
                  outline: 'none',
                  transition: 'all 0.2s'
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = '#00a63e';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = '#364153';
                }}
              />
              <button
                onClick={handleAddModifier}
                style={{
                  background: '#00a63e',
                  border: 'none',
                  borderRadius: '8px',
                  width: '40px',
                  height: '40px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  flexShrink: 0
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#008236';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#00a63e';
                }}
              >
                <Plus style={{ width: '20px', height: '20px', color: '#ffffff' }} />
              </button>
            </div>
          </div>

          {/* Note Section */}
          <div>
            <label style={{
              display: 'block',
              color: '#d1d5dc',
              fontSize: '14px',
              fontWeight: 600,
              marginBottom: '12px',
              letterSpacing: '-0.1504px'
            }}>
              Ghi chú cho đầu bếp
            </label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Nhập ghi chú thêm cho đầu bếp..."
              rows={4}
              style={{
                width: '100%',
                background: 'rgba(16, 24, 40, 0.5)',
                border: '1px solid #364153',
                borderRadius: '8px',
                padding: '12px',
                color: '#ffffff',
                fontSize: '14px',
                lineHeight: '20px',
                outline: 'none',
                resize: 'vertical',
                fontFamily: 'inherit',
                transition: 'all 0.2s'
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = '#00a63e';
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = '#364153';
              }}
            />
          </div>
        </div>

        {/* Footer */}
        <div style={{
          padding: '16px 24px',
          borderTop: '1px solid #364153',
          display: 'flex',
          gap: '12px'
        }}>
          <button
            onClick={onClose}
            style={{
              flex: 1,
              height: '48px',
              background: 'rgba(255, 255, 255, 0.1)',
              border: 'none',
              borderRadius: '8px',
              color: '#ffffff',
              fontSize: '16px',
              fontWeight: 'bold',
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
            Hủy
          </button>

          <button
            onClick={handleSave}
            style={{
              flex: 1,
              height: '48px',
              background: 'linear-gradient(to right, #00a63e, #008236)',
              border: 'none',
              borderRadius: '8px',
              boxShadow: '0px 4px 12px rgba(0, 166, 62, 0.4)',
              color: '#ffffff',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0px 6px 16px rgba(0, 166, 62, 0.5)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0px 4px 12px rgba(0, 166, 62, 0.4)';
            }}
          >
            Lưu thay đổi
          </button>
        </div>
      </div>

      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          
          @keyframes scaleIn {
            from {
              transform: translate(-50%, -50%) scale(0.9);
              opacity: 0;
            }
            to {
              transform: translate(-50%, -50%) scale(1);
              opacity: 1;
            }
          }
        `}
      </style>
    </>
  );
};
