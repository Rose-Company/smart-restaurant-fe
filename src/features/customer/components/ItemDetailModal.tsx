import React from 'react';
import { X, Plus, Minus } from 'lucide-react';
import type { MenuItem, ModifierGroup } from '../../menu/types/menu.types';

interface SelectedModifiers {
  [groupId: string]: string[];
}

interface ItemDetailModalProps {
  item: MenuItem;
  quantity: number;
  selectedModifiers: SelectedModifiers;
  onQuantityChange: (newQuantity: number) => void;
  onModifierChange: (groupId: string, optionId: string, selectionType: 'Single' | 'Multi') => void;
  onClose: () => void;
  onAddToCart: () => void;
  calculatePrice: (item: MenuItem, modifiers: SelectedModifiers) => number;
}

export function ItemDetailModal({
  item,
  quantity,
  selectedModifiers,
  onQuantityChange,
  onModifierChange,
  onClose,
  onAddToCart,
  calculatePrice
}: ItemDetailModalProps) {
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 100 }}>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)'
        }}
      />

      {/* Modal Panel */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#ffffff',
        borderTopLeftRadius: '24px',
        borderTopRightRadius: '24px',
        boxShadow: '0 -4px 20px rgba(0,0,0,0.15)',
        maxHeight: '90vh',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            backgroundColor: '#ffffff',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            zIndex: 10
          }}
        >
          <X style={{ width: '24px', height: '24px', color: '#1f2937' }} />
        </button>

        {/* Scrollable Content */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          paddingBottom: '100px'
        }}>
          {/* Hero Image */}
          <div style={{
            width: '100%',
            height: '280px',
            backgroundColor: '#f3f4f6',
            position: 'relative',
            borderTopLeftRadius: '24px',
            borderTopRightRadius: '24px',
            overflow: 'hidden'
          }}>
            <img
              src={item.imageUrl}
              alt={item.name}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover'
              }}
            />
          </div>

          {/* Item Info */}
          <div style={{ padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
              <h2 style={{
                fontSize: '24px',
                fontWeight: '600',
                color: '#1f2937',
                margin: 0,
                flex: 1
              }}>
                {item.name}
              </h2>
              <span style={{
                fontSize: '24px',
                fontWeight: '700',
                color: '#52b788',
                marginLeft: '16px'
              }}>
                ${item.price.toFixed(2)}
              </span>
            </div>

            {item.description && (
              <p style={{
                fontSize: '15px',
                color: '#6b7280',
                lineHeight: '1.5',
                margin: '0 0 24px 0'
              }}>
                {item.description}
              </p>
            )}

            {/* Modifiers */}
            {item.modifiers && item.modifiers.map((group) => (
              <div key={group.id} style={{ marginBottom: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                  <h3 style={{
                    fontSize: '16px',
                    fontWeight: '600',
                    color: '#1f2937',
                    margin: 0
                  }}>
                    {group.name}
                  </h3>
                  <span style={{
                    fontSize: '12px',
                    fontWeight: '500',
                    padding: '2px 8px',
                    borderRadius: '4px',
                    backgroundColor: group.required ? '#fee2e2' : '#dbeafe',
                    color: group.required ? '#991b1b' : '#1e40af'
                  }}>
                    {group.required ? 'Required' : 'Optional'}
                  </span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {group.options?.map((option) => {
                    const isSelected = selectedModifiers[group.id]?.includes(option.id);
                    const isSingle = group.selectionType === 'Single';

                    return (
                      <button
                        key={option.id}
                        onClick={() => onModifierChange(group.id, option.id, group.selectionType || 'Single')}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '16px',
                          border: isSelected ? '2px solid #52b788' : '1px solid #e5e7eb',
                          borderRadius: '12px',
                          backgroundColor: isSelected ? '#f0fdf4' : '#ffffff',
                          cursor: 'pointer',
                          transition: 'all 0.2s',
                          textAlign: 'left'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
                          {/* Radio or Checkbox */}
                          <div style={{
                            width: '20px',
                            height: '20px',
                            borderRadius: isSingle ? '50%' : '4px',
                            border: isSelected ? '2px solid #52b788' : '2px solid #d1d5db',
                            backgroundColor: isSelected ? '#52b788' : '#ffffff',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0
                          }}>
                            {isSelected && (
                              isSingle ? (
                                <div style={{
                                  width: '8px',
                                  height: '8px',
                                  borderRadius: '50%',
                                  backgroundColor: '#ffffff'
                                }} />
                              ) : (
                                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                                  <path d="M10 3L4.5 8.5L2 6" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                              )
                            )}
                          </div>

                          <span style={{
                            fontSize: '15px',
                            fontWeight: '500',
                            color: '#1f2937'
                          }}>
                            {option.name}
                          </span>
                        </div>

                        {option.price > 0 && (
                          <span style={{
                            fontSize: '15px',
                            fontWeight: '600',
                            color: '#52b788'
                          }}>
                            +${option.price.toFixed(2)}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}

            {/* Quantity Selector */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginTop: '24px'
            }}>
              <h3 style={{
                fontSize: '16px',
                fontWeight: '600',
                color: '#1f2937',
                margin: 0
              }}>
                Quantity
              </h3>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <button
                  onClick={() => onQuantityChange(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    border: '2px solid #e5e7eb',
                    backgroundColor: '#ffffff',
                    cursor: quantity <= 1 ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    opacity: quantity <= 1 ? 0.5 : 1
                  }}
                >
                  <Minus style={{ width: '20px', height: '20px', color: '#6b7280' }} />
                </button>

                <span style={{
                  fontSize: '20px',
                  fontWeight: '600',
                  color: '#1f2937',
                  minWidth: '40px',
                  textAlign: 'center'
                }}>
                  {quantity}
                </span>

                <button
                  onClick={() => onQuantityChange(quantity + 1)}
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    border: '2px solid #52b788',
                    backgroundColor: '#52b788',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <Plus style={{ width: '20px', height: '20px', color: '#ffffff' }} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer - Add to Order Button */}
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          padding: '16px 20px',
          backgroundColor: '#ffffff',
          borderTop: '1px solid #e5e7eb',
          boxShadow: '0 -2px 10px rgba(0,0,0,0.05)'
        }}>
          <button
            onClick={onAddToCart}
            style={{
              width: '100%',
              backgroundColor: '#52b788',
              color: '#ffffff',
              border: 'none',
              borderRadius: '12px',
              padding: '16px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'background-color 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#40a574'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#52b788'}
          >
            Add to Order - ${(calculatePrice(item, selectedModifiers) * quantity).toFixed(2)}
          </button>
        </div>
      </div>
    </div>
  );
}
