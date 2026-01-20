import React, { useState } from 'react';
import { X } from 'lucide-react';
import type { TableOrder, OrderDetail } from '../types/kitchen.types';
import { QuickUpdateModal } from './QuickUpdateModal';

interface ItemSummary {
  itemName: string;
  category: string;
  totalQuantity: number;
  tables: Array<{
    tableNumber: string;
    quantity: number;
    orderNumber: string;
    orderId: string;
    itemId: string;
  }>;
}

interface ItemSummaryModalProps {
  orders: TableOrder[];
  orderDetails: OrderDetail[];
  isOpen: boolean;
  onClose: () => void;
  onQuickUpdate: (selections: Array<{ orderId: string; itemId: string }>) => void;
}

export function ItemSummaryModal({ orders, orderDetails, isOpen, onClose, onQuickUpdate }: ItemSummaryModalProps) {
  const [selectedItem, setSelectedItem] = useState<ItemSummary | null>(null);
  
  if (!isOpen) return null;

  // Aggregate items from all orders (using TableOrder items, not OrderDetail)
  const itemSummaryMap = new Map<string, ItemSummary>();

  orders.forEach(order => {
    if (!order.items) return;

    order.items
      .filter(item => item.status !== 'done') // Only count items not yet completed
      .forEach(item => {
        const key = item.name;
        
        if (!itemSummaryMap.has(key)) {
          itemSummaryMap.set(key, {
            itemName: item.name,
            category: item.category || 'Other',
            totalQuantity: 0,
            tables: []
          });
        }

        const summary = itemSummaryMap.get(key)!;
        summary.totalQuantity += item.quantity;
        summary.tables.push({
          tableNumber: order.tableNumber,
          quantity: item.quantity,
          orderNumber: order.orderNumber,
          orderId: order.id,
          itemId: item.id
        });
      });
  });

  // Convert map to array and sort by total quantity (descending)
  const itemSummaries = Array.from(itemSummaryMap.values()).sort(
    (a, b) => b.totalQuantity - a.totalQuantity
  );

  // Group by category
  const groupedByCategory = itemSummaries.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, ItemSummary[]>);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Appetizer': return '#00a63e';
      case 'Main Course': return '#ff6900';
      case 'Dessert': return '#e91e63';
      case 'Beverage': return '#155dfc';
      default: return '#6b7280';
    }
  };

  const categoryOrder = ['Appetizer', 'Main Course', 'Dessert', 'Beverage', 'Other'];
  const sortedCategories = Object.keys(groupedByCategory).sort(
    (a, b) => categoryOrder.indexOf(a) - categoryOrder.indexOf(b)
  );

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 50
    }}>
      <div style={{
        backgroundColor: '#101828',
        border: '2px solid #364153',
        borderRadius: '24px',
        width: '1200px',
        maxWidth: '90vw',
        maxHeight: '90vh',
        boxShadow: '0px 25px 50px -12px rgba(0,0,0,0.25)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
      }}>
        {/* Header */}
        <div style={{
          background: 'linear-gradient(to right, #9810fa, #8200db)',
          padding: '32px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div>
            <h2 style={{
              fontSize: '30px',
              fontWeight: 'bold',
              lineHeight: '36px',
              letterSpacing: '0.3955px',
              color: '#ffffff',
              margin: '0 0 8px 0'
            }}>
              Item Summary
            </h2>
            <p style={{
              fontSize: '16px',
              lineHeight: '24px',
              color: 'rgba(255, 255, 255, 0.9)',
              margin: 0
            }}>
              Overview of all items currently in preparation
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              width: '48px',
              height: '48px',
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
            <X style={{ width: '24px', height: '24px', color: '#ffffff' }} />
          </button>
        </div>

        {/* Content */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: '32px'
        }}>
          {itemSummaries.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '80px 0',
              color: 'rgba(255, 255, 255, 0.6)'
            }}>
              <p style={{ fontSize: '18px', margin: 0 }}>No items in preparation</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
              {sortedCategories.map(category => (
                <div key={category}>
                  {/* Category Header */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    marginBottom: '16px'
                  }}>
                    <div style={{
                      width: '4px',
                      height: '24px',
                      backgroundColor: getCategoryColor(category),
                      borderRadius: '2px'
                    }} />
                    <h3 style={{
                      fontSize: '20px',
                      fontWeight: 'bold',
                      color: '#ffffff',
                      margin: 0
                    }}>
                      {category}
                    </h3>
                    <div style={{
                      backgroundColor: getCategoryColor(category),
                      color: '#ffffff',
                      fontSize: '14px',
                      fontWeight: 'bold',
                      padding: '4px 12px',
                      borderRadius: '12px'
                    }}>
                      {groupedByCategory[category].reduce((sum, item) => sum + item.totalQuantity, 0)} items
                    </div>
                  </div>

                  {/* Items in Category */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {groupedByCategory[category].map((item, idx) => (
                      <div
                        key={idx}
                        onClick={() => setSelectedItem(item)}
                        style={{
                          backgroundColor: '#1e2939',
                          border: '2px solid #364153',
                          borderRadius: '16px',
                          padding: '20px 24px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          gap: '24px',
                          cursor: 'pointer',
                          transition: 'all 0.2s'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = '#2a3a4d';
                          e.currentTarget.style.borderColor = '#4a5565';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = '#1e2939';
                          e.currentTarget.style.borderColor = '#364153';
                        }}
                      >
                        {/* Item Name & Quantity */}
                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                            <div style={{
                              width: '56px',
                              height: '56px',
                              borderRadius: '12px',
                              background: `linear-gradient(135deg, ${getCategoryColor(category)}33, ${getCategoryColor(category)}66)`,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}>
                              <span style={{
                                fontSize: '24px',
                                fontWeight: '900',
                                color: getCategoryColor(category)
                              }}>
                                {item.totalQuantity}x
                              </span>
                            </div>
                            <div>
                              <h4 style={{
                                fontSize: '20px',
                                fontWeight: 'bold',
                                color: '#ffffff',
                                margin: '0 0 4px 0'
                              }}>
                                {item.itemName}
                              </h4>
                              <p style={{
                                fontSize: '14px',
                                color: '#99a1af',
                                margin: 0
                              }}>
                                {item.tables.length} {item.tables.length === 1 ? 'table' : 'tables'}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Tables List */}
                        <div style={{
                          display: 'flex',
                          flexWrap: 'wrap',
                          gap: '8px',
                          maxWidth: '400px'
                        }}>
                          {item.tables.map((table, tableIdx) => (
                            <div
                              key={tableIdx}
                              style={{
                                backgroundColor: '#364153',
                                border: '1px solid #4a5565',
                                borderRadius: '8px',
                                padding: '6px 12px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px'
                              }}
                            >
                              <span style={{
                                fontSize: '14px',
                                fontWeight: 'bold',
                                color: '#ffffff'
                              }}>
                                Table {table.tableNumber}
                              </span>
                              <span style={{
                                fontSize: '12px',
                                color: '#99a1af'
                              }}>
                                ({table.quantity}x)
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      {/* Quick Update Modal */}
      {selectedItem && (
        <QuickUpdateModal
          isOpen={!!selectedItem}
          onClose={() => setSelectedItem(null)}
          itemName={selectedItem.itemName}
          category={selectedItem.category}
          tables={selectedItem.tables}
          onConfirm={(selections) => {
            onQuickUpdate(selections);
            setSelectedItem(null);
          }}
        />
      )}    </div>
  );
}
