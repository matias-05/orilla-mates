import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';

const CartContext = createContext(null);

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('orilla_cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  useEffect(() => {
    localStorage.setItem('orilla_cart', JSON.stringify(cart));
  }, [cart]);


  const addToCart = (product) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item =>
        item.id === product.id &&
        item.colorSeleccionado === product.colorSeleccionado
      );

      const stockDisponible = typeof product.stock === 'object' 
          ? product.stock[product.colorSeleccionado] 
          : product.stock;

      if (existingItem) {
        if (existingItem.cantidad >= stockDisponible) {
          alert(`Lo sentimos, solo hay ${stockDisponible} unidades disponibles en color ${product.colorSeleccionado}.`);
          return prevCart;
        }

        return prevCart.map(item =>
          item.id === product.id && item.colorSeleccionado === product.colorSeleccionado
            ? { ...item, cantidad: item.cantidad + 1 }
            : item
        );
      }

      return [...prevCart, { ...product, cantidad: 1 }];
    });
  };

  const updateQuantity = (id, color, amount) => {
    setCart(prevCart =>
      prevCart.map(item => {
        if (item.id === id && item.colorSeleccionado === color) {

          const stockDisponible = typeof item.stock === 'object'
            ? item.stock[color]
            : item.stock;

          const nuevaCantidad = item.cantidad + amount;

          if (amount > 0 && nuevaCantidad > stockDisponible) {
            alert(`Límite de stock alcanzado para color ${color}`);
            return item;
          }

          return {
            ...item,
            cantidad: Math.max(1, nuevaCantidad),
          };
        }
        return item;
      })
    );
  };

  const removeItem = (id, color) => {
    setCart(prevCart =>
      prevCart.filter(item =>
        !(item.id === id && item.colorSeleccionado === color)
      )
    );
  };

  const clearCart = () => {
    setCart([]); 

  };

  const cartCount = useMemo(() => {
    return cart.reduce((acc, item) => acc + Number(item.cantidad || 0), 0);
  }, [cart]);

  const total = useMemo(() => {
    return cart.reduce((acc, item) => {
      const price = Number(item.precio);
      const quantity = Number(item.cantidad);

      if (!Number.isFinite(price) || !Number.isFinite(quantity)) {
        return acc;
      }

      return acc + price * quantity;
    }, 0);
  }, [cart]);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        updateQuantity,
        removeItem,
        clearCart, 
        cartCount,
        total,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};