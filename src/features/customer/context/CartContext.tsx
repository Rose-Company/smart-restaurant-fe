import React, { createContext, useContext, useState, ReactNode } from 'react';
import type { MenuItem } from '../../menu/types/menu.types';

interface SelectedModifiers {
  [groupId: string]: string[];
}

export interface CartItem {
  item: MenuItem;
  quantity: number;
  selectedModifiers?: SelectedModifiers;
  modifierPrice?: number;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (item: MenuItem, quantity?: number, modifiers?: SelectedModifiers, modifierPrice?: number) => void;
  removeFromCart: (itemId: number) => void;
  updateQuantity: (itemId: number, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);

  const addToCart = (
    item: MenuItem, 
    quantity: number = 1, 
    modifiers?: SelectedModifiers, 
    modifierPrice: number = 0
  ) => {
    setCart(prevCart => {
      const existingItemIndex = prevCart.findIndex(
        cartItem => cartItem.item.id === item.id && 
        JSON.stringify(cartItem.selectedModifiers) === JSON.stringify(modifiers)
      );

      if (existingItemIndex > -1) {
        const newCart = [...prevCart];
        newCart[existingItemIndex].quantity += quantity;
        return newCart;
      }

      return [...prevCart, {
        item,
        quantity,
        selectedModifiers: modifiers,
        modifierPrice
      }];
    });
  };

  const removeFromCart = (itemId: number) => {
    setCart(prevCart => prevCart.filter(cartItem => cartItem.item.id !== itemId));
  };

  const updateQuantity = (itemId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }
    
    setCart(prevCart => 
      prevCart.map(cartItem => 
        cartItem.item.id === itemId 
          ? { ...cartItem, quantity } 
          : cartItem
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => {
      const itemPrice = item.item.price + (item.modifierPrice || 0);
      return total + (itemPrice * item.quantity);
    }, 0);
  };

  return (
    <CartContext.Provider value={{
      cart,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      getTotalItems,
      getTotalPrice
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
