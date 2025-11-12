import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { STORAGE_KEYS } from '../constants';
import { useDataSync } from './DataSyncContext';

const CartContext = createContext();

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_TO_CART': {
      const existingItem = state.items.find(item => {
        if (action.payload.size || action.payload.color) {
          return (
            item.id === action.payload.id &&
            item.size === action.payload.size &&
            item.color === action.payload.color
          );
        }
        return item.id === action.payload.id;
      });

      if (existingItem) {
        return {
          ...state,
          items: state.items.map(item => {
            if (action.payload.size || action.payload.color) {
              return (
                item.id === action.payload.id &&
                item.size === action.payload.size &&
                item.color === action.payload.color
              ) ? { ...item, quantity: item.quantity + (action.payload.quantity || 1) }
                : item;
            }
            return item.id === action.payload.id
              ? { ...item, quantity: item.quantity + (action.payload.quantity || 1) }
              : item;
          })
        };
      }

      return {
        ...state,
        items: [...state.items, { ...action.payload, quantity: action.payload.quantity || 1 }]
      };
    }

    case 'REMOVE_FROM_CART':
      return {
        ...state,
        items: state.items.filter(item => {
          if (action.payload.size || action.payload.color) {
            return !(
              item.id === action.payload.id &&
              item.size === action.payload.size &&
              item.color === action.payload.color
            );
          }
          return item.id !== action.payload.id;
        })
      };

    case 'UPDATE_QUANTITY': {
      const newQuantity = Math.max(0, Math.min(99, action.payload.quantity));
      
      return {
        ...state,
        items: state.items.map(item => {
          if (action.payload.size || action.payload.color) {
            return (
              item.id === action.payload.id &&
              item.size === action.payload.size &&
              item.color === action.payload.color
            ) ? { ...item, quantity: newQuantity }
              : item;
          }
          return item.id === action.payload.id
            ? { ...item, quantity: newQuantity }
            : item;
        }).filter(item => item.quantity > 0)
      };
    }

    case 'CLEAR_CART':
      return {
        ...state,
        items: []
      };

    case 'LOAD_CART':
      return {
        ...state,
        items: action.payload || []
      };

    case 'SET_COUPON':
      return {
        ...state,
        coupon: action.payload
      };

    case 'REMOVE_COUPON':
      return {
        ...state,
        coupon: null
      };

    default:
      return state;
  }
};

export const CartProvider = ({ children }) => {
  const dataSync = useDataSync ? (() => {
    try {
      return useDataSync();
    } catch {
      return null;
    }
  })() : null;

  const [state, dispatch] = useReducer(cartReducer, {
    items: [],
    coupon: null
  });

  useEffect(() => {
    try {
      const savedCart = localStorage.getItem(STORAGE_KEYS.CART);
      if (savedCart) {
        const parsedCart = JSON.parse(savedCart);
        dispatch({ type: 'LOAD_CART', payload: parsedCart });
      }
    } catch (error) {
      console.error('Failed to load cart from localStorage:', error);
      localStorage.removeItem(STORAGE_KEYS.CART);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(state.items));
      if (dataSync) {
        dataSync.emitCartUpdate({ action: 'update', items: state.items });
      }
    } catch (error) {
      console.error('Failed to save cart to localStorage:', error);
    }
  }, [state.items, dataSync]);

  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === STORAGE_KEYS.CART && e.newValue !== e.oldValue) {
        try {
          const newCart = e.newValue ? JSON.parse(e.newValue) : [];
          dispatch({ type: 'LOAD_CART', payload: newCart });
        } catch (error) {
          console.error('Error syncing cart from storage:', error);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const addToCart = (product) => {
    if (!product || !product.id) {
      console.error('Invalid product data');
      return;
    }
    
    const productWithDefaults = {
      ...product,
      price: product.price || 0,
      quantity: product.quantity || 1,
      name: product.name || 'Unnamed Product',
      image: product.image || null
    };
    
    dispatch({ type: 'ADD_TO_CART', payload: productWithDefaults });
  };

  const removeFromCart = (productId, options = {}) => {
    dispatch({ 
      type: 'REMOVE_FROM_CART', 
      payload: { id: productId, ...options } 
    });
  };

  const updateQuantity = (productId, quantity, options = {}) => {
    const sanitizedQuantity = parseInt(quantity) || 0;
    
    dispatch({ 
      type: 'UPDATE_QUANTITY', 
      payload: { 
        id: productId, 
        quantity: sanitizedQuantity,
        ...options 
      } 
    });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  const setCoupon = (coupon) => {
    dispatch({ type: 'SET_COUPON', payload: coupon });
  };

  const removeCoupon = () => {
    dispatch({ type: 'REMOVE_COUPON' });
  };

  const getItemById = (productId, options = {}) => {
    return state.items.find(item => {
      if (options.size || options.color) {
        return (
          item.id === productId &&
          item.size === options.size &&
          item.color === options.color
        );
      }
      return item.id === productId;
    });
  };

  const isInCart = (productId, options = {}) => {
    return !!getItemById(productId, options);
  };

  const totalItems = state.items.reduce((sum, item) => sum + item.quantity, 0);
  
  const totalPrice = state.items.reduce((sum, item) => {
    const itemPrice = item.price || 0;
    const itemQuantity = item.quantity || 0;
    return sum + (itemPrice * itemQuantity);
  }, 0);

  const subtotal = totalPrice;

  const getCartSummary = () => {
    return {
      itemCount: totalItems,
      subtotal: subtotal,
      total: totalPrice
    };
  };

  const value = {
    items: state.items,
    coupon: state.coupon,
    totalItems,
    totalPrice,
    subtotal,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    setCoupon,
    removeCoupon,
    getItemById,
    isInCart,
    getCartSummary
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
