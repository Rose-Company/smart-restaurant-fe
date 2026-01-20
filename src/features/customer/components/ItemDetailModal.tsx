import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { X, Plus, Minus, Clock, Star } from 'lucide-react';
import type { MenuItem, ModifierGroup } from '../../menu/types/menu.types';
import { formatPrice } from '../../../lib/utils';

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
  const { t } = useTranslation('customer');
  const [imageIndex, setImageIndex] = useState(0);
  const [itemNotes, setItemNotes] = useState('');

  // Get primary or first image
  const images = item.images && item.images.length > 0 ? item.images : [];
  const primaryImage = images.find(img => img.isPrimary) || images[0];
  const currentImage = images.length > 0 ? images[imageIndex] : null;

  const handlePrevImage = () => {
    setImageIndex(prev => prev === 0 ? images.length - 1 : prev - 1);
  };

  const handleNextImage = () => {
    setImageIndex(prev => prev === images.length - 1 ? 0 : prev + 1);
  };

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
          paddingBottom: '120px'
        }}>
          {/* Hero Image with Carousel */}
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
              src={currentImage?.url || item.imageUrl}
              alt={item.name}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover'
              }}
            />

            {/* Chef Recommended Badge */}
            {item.chefRecommended && (
              <div style={{
                position: 'absolute',
                top: '16px',
                left: '16px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                backgroundColor: '#fef3c7',
                padding: '8px 12px',
                borderRadius: '20px'
              }}>
                <Star style={{ width: '16px', height: '16px', color: '#f59e0b', fill: '#f59e0b' }} />
                <span style={{ fontSize: '13px', fontWeight: '600', color: '#92400e' }}>Chef Recommended</span>
              </div>
            )}

            {/* Image Navigation */}
            {images.length > 1 && (
              <>
                <button
                  onClick={handlePrevImage}
                  style={{
                    position: 'absolute',
                    left: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M12 4L8 10L12 16" stroke="#1f2937" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>

                <button
                  onClick={handleNextImage}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M8 4L12 10L8 16" stroke="#1f2937" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>

                {/* Image Indicators */}
                <div style={{
                  position: 'absolute',
                  bottom: '12px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  display: 'flex',
                  gap: '6px'
                }}>
                  {images.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setImageIndex(idx)}
                      style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        backgroundColor: idx === imageIndex ? '#ffffff' : 'rgba(255, 255, 255, 0.5)',
                        border: 'none',
                        cursor: 'pointer'
                      }}
                    />
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Item Info */}
          <div style={{ padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
              <div style={{ flex: 1 }}>
                <h2 style={{
                  fontSize: '24px',
                  fontWeight: '600',
                  color: '#1f2937',
                  margin: '0 0 4px 0'
                }}>
                  {item.name}
                </h2>
                {item.category && (
                  <p style={{
                    fontSize: '13px',
                    color: '#9ca3af',
                    margin: 0
                  }}>
                    {item.category}
                  </p>
                )}
              </div>
              <span style={{
                fontSize: '24px',
                fontWeight: '700',
                color: '#52b788',
                marginLeft: '16px'
              }}>
                {formatPrice(item.price)}
              </span>
            </div>

            {/* Meta Info */}
            <div style={{ display: 'flex', gap: '16px', marginBottom: '24px', flexWrap: 'wrap' }}>
              {item.preparationTime && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Clock style={{ width: '16px', height: '16px', color: '#6b7280' }} />
                  <span style={{ fontSize: '13px', color: '#6b7280' }}>
                    {item.preparationTime} min
                  </span>
                </div>
              )}
              {item.status && (
                <span style={{
                  fontSize: '12px',
                  fontWeight: '500',
                  padding: '4px 10px',
                  borderRadius: '6px',
                  backgroundColor: item.status === 'available' ? '#dbeafe' : '#fee2e2',
                  color: item.status === 'available' ? '#1e40af' : '#991b1b',
                  textTransform: 'capitalize'
                }}>
                  {item.status}
                </span>
              )}
            </div>

            {/* Description */}
            {item.description && (
              <p style={{
                fontSize: '15px',
                color: '#6b7280',
                lineHeight: '1.6',
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
                            +{formatPrice(option.price)}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}

            {/* Special Instructions */}
            <div style={{ marginBottom: '24px' }}>
              <h3 style={{
                fontSize: '16px',
                fontWeight: '600',
                color: '#1f2937',
                margin: '0 0 12px 0'
              }}>
                Special Instructions (Optional)
              </h3>
              <textarea
                value={itemNotes}
                onChange={(e) => setItemNotes(e.target.value)}
                placeholder="e.g., No onions, extra sauce on the side..."
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #e5e7eb',
                  borderRadius: '10px',
                  fontSize: '14px',
                  color: '#1f2937',
                  fontFamily: 'inherit',
                  resize: 'vertical',
                  minHeight: '80px',
                  boxSizing: 'border-box',
                  transition: 'border-color 0.2s'
                }}
                onFocus={(e) => e.currentTarget.style.borderColor = '#52b788'}
                onBlur={(e) => e.currentTarget.style.borderColor = '#e5e7eb'}
              />
            </div>

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
            Add to Order - {formatPrice(calculatePrice(item, selectedModifiers) * quantity)}
          </button>
        </div>
      </div>
    </div>
  );
}
