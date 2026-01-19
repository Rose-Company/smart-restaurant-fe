import React, { useEffect, useState } from 'react';
import type { MenuItem } from '../../menu/types/menu.types';
import { customerMenuApi } from '../services/menu.api';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import {
  CustomerHeader,
  TableBadge,
  PromoBanner,
  CategoryTabs,
  MenuItemCard,
  ItemDetailModal,
  CartDrawer,
  BottomCartBar,
} from '../components';
import { MenuLoadingSkeleton } from '../components/LoadingSkeleton';

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

export function CustomerMenuPage({
  tableToken,
  tableNumber: initialTableNumber,
  onLoginClick,
  onAccountClick,
  onOrdersClick,
  onReportsClick,
}: CustomerMenuPageProps) {
  const { user, logout } = useAuth();
  const {
    cart,
    addToCart,
    updateQuantity,
    removeFromCart,
    getTotalItems,
    getTotalPrice,
    clearCart,
  } = useCart();

  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [tableNumber, setTableNumber] = useState(initialTableNumber || '');

  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [sort, setSort] = useState<
    'id' | 'name' | 'price_asc' | 'price_desc' | 'last_update'
  >('id');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const [showCart, setShowCart] = useState(false);
  const [showBanner, setShowBanner] = useState(true);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [selectedModifiers, setSelectedModifiers] =
    useState<SelectedModifiers>({});
  const [itemQuantity, setItemQuantity] = useState(1);

  // Order history state
  const [orderHistory, setOrderHistory] = useState<OrderHistory>({
    tableNumber: initialTableNumber || '05',
    rounds: [],
    subtotal: 0,
    vat: 0,
    total: 0
  });

  const categories = [
    'All',
    'Appetizer',
    'Main Courses',
    'Seafood',
    'Steaks & Grills',
    'Pasta & Risotto',
    'Desserts',
    'Beverages',
  ];

  useEffect(() => {
    const fetchMenu = async () => {
      const params = new URLSearchParams(window.location.search);
      const table = params.get('table') || tableNumber;
      const token = params.get('token') || tableToken;

      if (!table || !token) {
        setError('Missing table or token');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const res = await customerMenuApi.fetchMenu({
          table,
          token,
          page,
          page_size: pageSize,
          search: searchQuery || undefined,
          sort,
          category:
            selectedCategory !== 'All' ? selectedCategory : undefined,
        });

        const normalizedItems = res.items.map(item => ({
          ...item,
          status: item.status ?? 'available',
        }));

        setMenuItems(normalizedItems);
        setTotal(res.total);

        if (res.table_number) {
          setTableNumber(res.table_number);
        }
      } catch (err: any) {
        console.error(err);
        setError(err.message || 'Failed to load menu');
        setMenuItems([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMenu();
  }, [
    tableToken,
    tableNumber,
    page,
    pageSize,
    searchQuery,
    sort,
    selectedCategory,
  ]);

  const handleAddItem = (item: MenuItem) => {
    if (item.modifiers?.length) {
      setSelectedItem(item);
      setItemQuantity(1);
      // Initialize default selections for required modifiers
      const initialModifiers: SelectedModifiers = {};
      item.modifiers.forEach(group => {
        if (group.required && group.options && group.options.length > 0) {
          initialModifiers[group.id] = [group.options[0].id];
        }
      });
      setSelectedModifiers(initialModifiers);
    } else {
      addToCart(item, 1);
    }
  };

  const handleModifierChange = (
    groupId: string,
    optionId: string,
    type: 'Single' | 'Multi' = 'Single',
  ) => {
    setSelectedModifiers(prev => {
      const next = { ...prev };
      if (type === 'Single') {
        next[groupId] = [optionId];
      } else {
        next[groupId] = next[groupId]?.includes(optionId)
          ? next[groupId].filter(id => id !== optionId)
          : [...(next[groupId] || []), optionId];
      }
      return next;
    });
  };

  const calculateItemPrice = (
    item: MenuItem,
    modifiers: SelectedModifiers,
  ) => {
    let price = item.price;
    item.modifiers?.forEach(group => {
      modifiers[group.id]?.forEach(optionId => {
        const opt = group.options?.find(o => o.id === optionId);
        if (opt) price += opt.price;
      });
    });
    return price;
  };

  const addToCartWithModifiers = () => {
    if (!selectedItem) return;
    addToCart(selectedItem, itemQuantity, selectedModifiers);
    setSelectedItem(null);
    setSelectedModifiers({});
    setItemQuantity(1);
  };

  const handleUserClick = () => {
    if (user) {
      setShowUserMenu(!showUserMenu);
    } else if (onLoginClick) {
      onLoginClick();
    }
  };

  const handleLoginClick = () => {
    setShowUserMenu(false);
    onLoginClick?.();
  };

  const handleAccountClick = () => {
    setShowUserMenu(false);
    onAccountClick?.();
  };

  const handleOrdersClick = () => {
    setShowUserMenu(false);
    onOrdersClick?.();
  };

  const handleReportsClick = () => {
    setShowUserMenu(false);
    onReportsClick?.();
  };

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
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

  const handleCheckout = () => {
    alert('Checkout functionality coming soon!');
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#f5f5f5', paddingBottom: 80 }}>
        <CustomerHeader onUserClick={handleUserClick} />
        {tableNumber && <TableBadge tableNumber={tableNumber} />}
        <CategoryTabs
          categories={categories}
          selectedCategory={selectedCategory}
          onCategoryChange={cat => {
            setPage(1);
            setSelectedCategory(cat);
          }}
        />
        <MenuLoadingSkeleton />
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f5f5f5', paddingBottom: 80 }}>
      <div style={{ position: 'relative' }}>
        <CustomerHeader onUserClick={handleUserClick} />
        
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
              {user ? (
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
                    onClick={handleAccountClick}
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
                    My Account
                  </button>
                  <button
                    onClick={handleOrdersClick}
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
                    Order History
                  </button>
                  <button
                    onClick={handleReportsClick}
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
                    Reports
                  </button>
                  <button
                    onClick={handleLogout}
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
              ) : (
                <button
                  onClick={handleLoginClick}
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
                  Login
                </button>
              )}
            </div>
          </>
        )}
      </div>

      {tableNumber && <TableBadge tableNumber={tableNumber} />}

      {!user && showBanner && (
        <PromoBanner
          message="Log in to earn points & get a voucher!"
          onClose={() => setShowBanner(false)}
        />
      )}

      <CategoryTabs
        categories={categories}
        selectedCategory={selectedCategory}
        onCategoryChange={cat => {
          setPage(1);
          setSelectedCategory(cat);
        }}
      />

      <div style={{ padding: 16 }}>
        {error && (
          <div
            style={{
              padding: 16,
              marginBottom: 16,
              backgroundColor: '#fee',
              border: '1px solid #f88',
              borderRadius: 8,
              color: '#c00',
              textAlign: 'center',
            }}
          >
            {error}
          </div>
        )}

        {menuItems.length === 0 ? (
          <div style={{ textAlign: 'center', paddingTop: '48px', paddingBottom: '48px' }}>
            <p style={{ color: '#6b7280', fontSize: '16px' }}>No items found</p>
            <p style={{ color: '#9ca3af', fontSize: '14px', marginTop: '8px' }}>Try adjusting your filters</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {menuItems.map(item => (
              <MenuItemCard
                key={item.id}
                item={item}
                onAddClick={handleAddItem}
              />
            ))}
          </div>
        )}
      </div>

      {/* Pagination */}
      {total > pageSize && (
        <div style={{ textAlign: 'center', marginBottom: 16 }}>
          <button
            disabled={page === 1}
            onClick={() => setPage(p => p - 1)}
            style={{
              padding: '8px 16px',
              marginRight: '8px',
              backgroundColor: page === 1 ? '#e5e7eb' : '#52b788',
              color: page === 1 ? '#9ca3af' : '#fff',
              border: 'none',
              borderRadius: '8px',
              cursor: page === 1 ? 'not-allowed' : 'pointer',
              fontSize: '14px',
              fontWeight: '500'
            }}
          >
            Prev
          </button>
          <span style={{ margin: '0 12px', color: '#6b7280', fontSize: '14px' }}>
            Page {page}
          </span>
          <button
            disabled={page * pageSize >= total}
            onClick={() => setPage(p => p + 1)}
            style={{
              padding: '8px 16px',
              marginLeft: '8px',
              backgroundColor: page * pageSize >= total ? '#e5e7eb' : '#52b788',
              color: page * pageSize >= total ? '#9ca3af' : '#fff',
              border: 'none',
              borderRadius: '8px',
              cursor: page * pageSize >= total ? 'not-allowed' : 'pointer',
              fontSize: '14px',
              fontWeight: '500'
            }}
          >
            Next
          </button>
        </div>
      )}

      {selectedItem && (
        <ItemDetailModal
          item={selectedItem}
          quantity={itemQuantity}
          selectedModifiers={selectedModifiers}
          onQuantityChange={setItemQuantity}
          onModifierChange={handleModifierChange}
          calculatePrice={calculateItemPrice}
          onAddToCart={addToCartWithModifiers}
          onClose={() => {
            setSelectedItem(null);
            setSelectedModifiers({});
            setItemQuantity(1);
          }}
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
        getTotalItems={getTotalItems}
        getTotalPrice={getTotalPrice}
        orderHistory={orderHistory}
        onConfirmOrder={handleConfirmOrder}
      />
    </div>
  );
}