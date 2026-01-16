import React, { useState, useEffect } from 'react';
import type { MenuItem } from '../../menu/types/menu.types';
import { menuItemApi } from '../../menu/services/menu.api';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { MENU_ITEMS } from '../data/menuData';
import {
  CustomerHeader,
  TableBadge,
  PromoBanner,
  CategoryTabs,
  MenuItemCard,
  ItemDetailModal,
  CartDrawer,
  BottomCartBar
} from '../components';

interface SelectedModifiers {
  [groupId: string]: string[];
}

interface CartItem {
  item: MenuItem;
  quantity: number;
  selectedModifiers?: SelectedModifiers;
  modifierPrice?: number;
}

interface OrderHistoryItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  status: 'Served' | 'Preparing' | 'Pending';
}

interface OrderRound {
  roundNumber: number;
  time: string;
  items: OrderHistoryItem[];
}

interface OrderHistory {
  tableNumber: string;
  rounds: OrderRound[];
  subtotal: number;
  vat: number;
  total: number;
}

interface CustomerMenuPageProps {
  tableToken?: string;
  tableNumber?: string;
  onLoginClick?: () => void;
  onAccountClick?: () => void;
  onOrdersClick?: () => void;
  onReportsClick?: () => void;
}

export function CustomerMenuPage({ tableToken, tableNumber, onLoginClick, onAccountClick, onOrdersClick, onReportsClick }: CustomerMenuPageProps) {
  const { user, logout } = useAuth();
  const { cart, addToCart: addToCartContext, removeFromCart, updateQuantity, getTotalItems, getTotalPrice, clearCart } = useCart();
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('Main Course');
  const [searchQuery, setSearchQuery] = useState('');
  const [showCart, setShowCart] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showBanner, setShowBanner] = useState(true);
  const [showUserMenu, setShowUserMenu] = useState(false);

  // Order history state
  const [orderHistory, setOrderHistory] = useState<OrderHistory>({
    tableNumber: tableNumber || '05',
    rounds: [
      {
        roundNumber: 1,
        time: '7:28 PM',
        items: [
          { id: '1', name: 'Truffle Burger', quantity: 1, price: 28.50, status: 'Served' },
          { id: '2', name: 'Grilled Salmon', quantity: 1, price: 24.99, status: 'Served' },
          { id: '3', name: 'Lobster Linguine', quantity: 1, price: 38.00, status: 'Served' },
        ]
      },
      {
        roundNumber: 2,
        time: '7:28 PM',
        items: [
          { id: '4', name: 'Grilled Salmon', quantity: 2, price: 49.98, status: 'Preparing' },
        ]
      }
    ],
    subtotal: 141.47,
    vat: 11.32,
    total: 152.79
  });

  // Item detail modal states
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [selectedModifiers, setSelectedModifiers] = useState<SelectedModifiers>({});
  const [itemQuantity, setItemQuantity] = useState(1);

  // Load menu items from API
  useEffect(() => {
    const fetchMenu = async () => {
      if (!tableToken) {
        // If no token, use shared mock data
        setMenuItems(MENU_ITEMS);
        const uniqueCategories = Array.from(new Set(MENU_ITEMS.map(item => item.category)));
        setCategories(uniqueCategories);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        // const response = await customerMenuApi.fetchMenuByToken(tableToken);
        // setMenuItems(response.items);
        // const uniqueCategories = Array.from(new Set(response.items.map(item => item.category)));
        // setCategories(uniqueCategories);

        // // Update table number if provided from API
        // if (response.tableNumber && !tableNumber) {
        //   // Could update URL or state here if needed
        // }
      } catch (error) {
        console.error('Failed to fetch menu:', error);
        // Fallback to empty state or show error message
        setMenuItems([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMenu();
  }, [tableToken, tableNumber]);

  // Filter items based on category and search
  useEffect(() => {
    let filtered = menuItems.filter(item => item.status === 'available');

    if (selectedCategory === 'Popular') {
      filtered = filtered.filter(item => item.chefRecommended);
    } else if (selectedCategory === 'Chef Recommended') {
      filtered = filtered.filter(item => item.chefRecommended);
    } else if (selectedCategory !== 'all') {
      filtered = filtered.filter(item => item.category === selectedCategory);
    }

    if (searchQuery.trim()) {
      filtered = filtered.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredItems(filtered);
  }, [menuItems, selectedCategory, searchQuery]);

  const addToCart = (item: MenuItem) => {
    addToCartContext(item, 1);
  };

  const openItemDetail = (item: MenuItem) => {
    setSelectedItem(item);
    setItemQuantity(1);
    // Initialize default selections for required modifiers
    const initialModifiers: SelectedModifiers = {};
    item.modifiers?.forEach(group => {
      if (group.required && group.options && group.options.length > 0) {
        initialModifiers[group.id] = [group.options[0].id];
      }
    });
    setSelectedModifiers(initialModifiers);
  };

  const closeItemDetail = () => {
    setSelectedItem(null);
    setSelectedModifiers({});
    setItemQuantity(1);
  };

  const handleModifierChange = (groupId: string, optionId: string, selectionType: 'Single' | 'Multi' = 'Single') => {
    setSelectedModifiers(prev => {
      const newModifiers = { ...prev };

      if (selectionType === 'Single') {
        // Radio button - replace selection
        newModifiers[groupId] = [optionId];
      } else {
        // Checkbox - toggle selection
        const currentSelections = newModifiers[groupId] || [];
        if (currentSelections.includes(optionId)) {
          newModifiers[groupId] = currentSelections.filter(id => id !== optionId);
        } else {
          newModifiers[groupId] = [...currentSelections, optionId];
        }
      }

      return newModifiers;
    });
  };

  const calculateItemPrice = (item: MenuItem, modifiers: SelectedModifiers) => {
    let total = item.price;

    item.modifiers?.forEach(group => {
      const selectedOptions = modifiers[group.id] || [];
      selectedOptions.forEach(optionId => {
        const option = group.options?.find(opt => opt.id === optionId);
        if (option) {
          total += option.price;
        }
      });
    });

    return total;
  };

  const addToCartWithModifiers = () => {
    if (!selectedItem) return;

    addToCartContext(selectedItem, itemQuantity, selectedModifiers);

    closeItemDetail();
  };



  const handleConfirmOrder = (orderCart: CartItem[], customerName?: string) => {
    // Convert cart items to order history items
    const newOrderItems: OrderHistoryItem[] = orderCart.map((cartItem, index) => ({
      id: `order-${Date.now()}-${index}`,
      name: cartItem.item.name,
      quantity: cartItem.quantity,
      price: (cartItem.item.price + (cartItem.modifierPrice || 0)) * cartItem.quantity,
      status: 'Pending' as const
    }));

    // Calculate new round
    const newRoundNumber = orderHistory.rounds.length + 1;
    const now = new Date();
    const timeString = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });

    const newRound: OrderRound = {
      roundNumber: newRoundNumber,
      time: timeString,
      items: newOrderItems
    };

    // Calculate totals
    const newSubtotal = orderHistory.subtotal + getTotalPrice();
    const newVat = newSubtotal * 0.08;
    const newTotal = newSubtotal + newVat;

    // Update order history
    setOrderHistory({
      tableNumber: orderHistory.tableNumber,
      rounds: [...orderHistory.rounds, newRound],
      subtotal: newSubtotal,
      vat: newVat,
      total: newTotal
    });

    // Clear cart after order
    clearCart();
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '48px',
            height: '48px',
            border: '3px solid #e5e7eb',
            borderTopColor: '#52b788',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 16px'
          }} />
          <p style={{ color: '#6b7280', fontSize: '16px' }}>Loading menu...</p>
        </div>
      </div>
    );
  }

  const handleAddItem = (item: MenuItem) => {
    if (item.modifiers && item.modifiers.length > 0) {
      openItemDetail(item);
    } else {
      addToCart(item);
    }
  };

  const handleCheckout = () => {
    alert('Checkout functionality coming soon!');
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f5f5f5', paddingBottom: '80px' }}>
      <CustomerHeader
        onUserClick={() => {
          if (user) {
            setShowUserMenu(true);
          } else if (onLoginClick) {
            onLoginClick();
          }
        }}
      />

      {/* User Menu Dropdown */}
      {showUserMenu && (
        <>
          {/* Backdrop */}
          <div
            onClick={() => setShowUserMenu(false)}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 999
            }}
          />

          {/* Menu */}
          <div style={{
            position: 'fixed',
            top: '70px',
            right: '16px',
            backgroundColor: '#ffffff',
            borderRadius: '12px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            padding: '8px',
            zIndex: 1000,
            minWidth: '200px'
          }}>
            {user && (
              <>
                <div style={{
                  padding: '12px',
                  borderBottom: '1px solid #e5e7eb'
                }}>
                  <div style={{ fontSize: '14px', fontWeight: '600', color: '#1f2937' }}>
                    {user.name}
                  </div>
                  <div style={{ fontSize: '13px', color: '#6b7280', marginTop: '4px' }}>
                    {user.email}
                  </div>
                </div>
                <button
                  onClick={() => {
                    setShowUserMenu(false);
                    if (onAccountClick) {
                      onAccountClick();
                    }
                  }}
                  style={{
                    width: '100%',
                    padding: '12px',
                    backgroundColor: 'transparent',
                    border: 'none',
                    textAlign: 'left',
                    fontSize: '14px',
                    fontWeight: '500',
                    color: '#1f2937',
                    cursor: 'pointer',
                    borderRadius: '8px'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f3f4f6'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  Quản lý tài khoản
                </button>
                <button
                  onClick={() => {
                    setShowUserMenu(false);
                    if (onOrdersClick) {
                      onOrdersClick();
                    }
                  }}
                  style={{
                    width: '100%',
                    padding: '12px',
                    backgroundColor: 'transparent',
                    border: 'none',
                    textAlign: 'left',
                    fontSize: '14px',
                    fontWeight: '500',
                    color: '#1f2937',
                    cursor: 'pointer',
                    borderRadius: '8px'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f3f4f6'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  Lịch sử đơn hàng
                </button>
                <button
                  onClick={() => {
                    setShowUserMenu(false);
                    if (onReportsClick) {
                      onReportsClick();
                    }
                  }}
                  style={{
                    width: '100%',
                    padding: '12px',
                    backgroundColor: 'transparent',
                    border: 'none',
                    textAlign: 'left',
                    fontSize: '14px',
                    fontWeight: '500',
                    color: '#1f2937',
                    cursor: 'pointer',
                    borderRadius: '8px'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f3f4f6'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  Theo dõi báo cáo
                </button>
                <button
                  onClick={() => {
                    logout();
                    setShowUserMenu(false);
                  }}
                  style={{
                    width: '100%',
                    padding: '12px',
                    backgroundColor: 'transparent',
                    border: 'none',
                    textAlign: 'left',
                    fontSize: '14px',
                    fontWeight: '500',
                    color: '#dc2626',
                    cursor: 'pointer',
                    borderRadius: '8px'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#fef2f2'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </>
      )}

      {tableNumber && <TableBadge tableNumber={tableNumber} />}

      {showBanner && !user && (
        <PromoBanner
          message="Log in to earn points & get a voucher!"
          onClose={() => setShowBanner(false)}
        />
      )}

      <CategoryTabs
        categories={categories}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
      />

      {/* Menu Items */}
      <div style={{ padding: '16px' }}>
        {filteredItems.length === 0 ? (
          <div style={{ textAlign: 'center', paddingTop: '48px', paddingBottom: '48px' }}>
            <p style={{ color: '#6b7280', fontSize: '16px' }}>No items found</p>
            <p style={{ color: '#9ca3af', fontSize: '14px', marginTop: '8px' }}>Try adjusting your filters</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {filteredItems.map(item => (
              <MenuItemCard
                key={item.id}
                item={item}
                onAddClick={handleAddItem}
              />
            ))}
          </div>
        )}
      </div>

      {selectedItem && (
        <ItemDetailModal
          item={selectedItem}
          quantity={itemQuantity}
          selectedModifiers={selectedModifiers}
          onQuantityChange={setItemQuantity}
          onModifierChange={handleModifierChange}
          onClose={closeItemDetail}
          onAddToCart={addToCartWithModifiers}
          calculatePrice={calculateItemPrice}
        />
      )}

      <BottomCartBar
        itemCount={getTotalItems()}
        totalPrice={getTotalPrice()}
        onViewCart={() => setShowCart(true)}
      />

      <CartDrawer
        isOpen={showCart}
        cart={cart}
        tableNumber={tableNumber}
        onClose={() => setShowCart(false)}
        onUpdateQuantity={updateQuantity}
        onRemoveItem={removeFromCart}
        onCheckout={handleCheckout}
        getTotalPrice={getTotalPrice}
        getTotalItems={getTotalItems}
        orderHistory={orderHistory}
        onConfirmOrder={handleConfirmOrder}
      />
    </div>
  );
}

