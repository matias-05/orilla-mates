import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
} from "react";
import { toast } from "sonner";

const CartContext = createContext(null);

export const useCart = () => useContext(CartContext);

const TIEMPO_EXPIRACION = 15 * 60 * 1000;

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    try {
      const savedData = localStorage.getItem("orilla_cart");
      if (savedData) {
        const parsedData = JSON.parse(savedData);
        const ahora = new Date().getTime();

        if (Array.isArray(parsedData)) return parsedData;

        if (
          parsedData.timestamp &&
          ahora - parsedData.timestamp > TIEMPO_EXPIRACION
        ) {
          localStorage.removeItem("orilla_cart");
          return [];
        }

        return parsedData.productos || [];
      }
    } catch (error) {
      console.error("Error leyendo el carrito", error);
      return [];
    }
    return [];
  });

  useEffect(() => {
    const datosAGuardar = {
      productos: cart,
      timestamp: new Date().getTime(),
    };
    localStorage.setItem("orilla_cart", JSON.stringify(datosAGuardar));
  }, [cart]);

  useEffect(() => {
    if (cart.length === 0) return;

    const intervalo = setInterval(() => {
      const savedData = localStorage.getItem("orilla_cart");
      if (savedData) {
        try {
          const parsedData = JSON.parse(savedData);
          const ahora = new Date().getTime();

          if (
            parsedData.timestamp &&
            ahora - parsedData.timestamp > TIEMPO_EXPIRACION
          ) {
            setCart([]);
            toast.error("Tu carrito expiró por inactividad (15 min).", {
              style: {
                background: "#ce2a2a",
                color: "#E8D6B3",
                borderRadius: 0,
                textAlign: "center",
                border: "1px solid #E8D6B333",
              },
            });
          }
        } catch (e) {
          console.error("Error en el intervalo de expiración", e);
        }
      }
    }, 60000);

    return () => clearInterval(intervalo);
  }, [cart]);

  const addToCart = (product) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find(
        (item) =>
          item.id === product.id &&
          item.colorSeleccionado === product.colorSeleccionado,
      );

      const stockDisponible =
        typeof product.stock === "object"
          ? product.stock[product.colorSeleccionado]
          : product.stock;

      if (existingItem) {
        if (existingItem.cantidad >= stockDisponible) {
          toast.error(
            `Lo sentimos, solo hay ${stockDisponible} unidades disponibles.`,
            {
              style: {
                background: "#ce2a2a",
                color: "#E8D6B3",
                borderRadius: 0,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
                minHeight: "80px",
                border: "1px solid #E8D6B333",
              },
            },
          );
          return prevCart;
        }

        return prevCart.map((item) =>
          item.id === product.id &&
          item.colorSeleccionado === product.colorSeleccionado
            ? { ...item, cantidad: item.cantidad + 1 }
            : item,
        );
      }

      return [...prevCart, { ...product, cantidad: 1 }];
    });
  };

  const updateQuantity = (id, color, amount) => {
    setCart((prevCart) =>
      prevCart.map((item) => {
        if (item.id === id && item.colorSeleccionado === color) {
          const stockDisponible =
            typeof item.stock === "object" ? item.stock[color] : item.stock;

          const nuevaCantidad = item.cantidad + amount;

          if (amount > 0 && nuevaCantidad > stockDisponible) {
            toast.error(`Límite de stock alcanzado para color ${color}`, {
              style: {
                background: "#ce2a2a",
                color: "#E8D6B3",
                borderRadius: 0,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
                minHeight: "80px",
                border: "1px solid #E8D6B333",
              },
            });
            return item;
          }

          return {
            ...item,
            cantidad: Math.max(1, nuevaCantidad),
          };
        }
        return item;
      }),
    );
  };

  const removeItem = (id, color) => {
    setCart((prevCart) =>
      prevCart.filter(
        (item) => !(item.id === id && item.colorSeleccionado === color),
      ),
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
