import React, { useState, useMemo } from "react";
import { useCart } from "../../context/CartContext";
import { toast } from "sonner";
import { ShoppingBag } from "lucide-react";

const normalizar = (txt) => {
  if (!txt) return "";
  return txt
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
};

const getColorBackground = (color) => {
  if (!color) return "transparent";
  const c = normalizar(color);
  if (c === "negro") return "black";
  if (c === "borravino") return "#4A0E0E";
  if (c === "marron") return "#5C3D2E";
  return "#5C3D2E";
};

const obtenerStockColor = (stock, colorName) => {
  if (stock === undefined || stock === null) return 0;
  if (typeof stock === "number") return stock;
  if (typeof stock === "string") return parseInt(stock, 10) || 0;
  if (typeof stock === "object") {
    if (!colorName || colorName === "" || colorName === "null") {
      return Number(stock["Unico"] || stock["unico"] || 0);
    }
    const keyLimpia = normalizar(colorName);
    return Number(
      stock[colorName] ||
        stock[colorName.toLowerCase()] ||
        stock[keyLimpia] ||
        stock["Unico"] ||
        0,
    );
  }
  return 0;
};

export default function ProdDetalle({ producto }) {
  if (!producto) return null;

  const { addToCart, cart } = useCart();
  const coloresDisponibles = producto.colores || [];

  const [colorElegido, setColorElegido] = useState(coloresDisponibles[0] || "");

  const stockDisponible = useMemo(() => {
    const colorParaStock = colorElegido || "Unico";
    return obtenerStockColor(producto.stock, colorParaStock);
  }, [producto.stock, colorElegido]);

  const sinStock = stockDisponible <= 0;

  const handleAgregarAlCarrito = () => {
    if (sinStock) return;

    const colorSeleccionado = colorElegido || "Unico";

    const productoEnCarrito = cart.find(
      (item) =>
        item.id === producto.id && item.colorSeleccionado === colorSeleccionado,
    );
    const cantidadActual = productoEnCarrito ? productoEnCarrito.cantidad : 0;

    if (cantidadActual >= stockDisponible) {
      addToCart({
        ...producto,
        cantidad: 1,
        colorSeleccionado,
      });
      return;
    }

    addToCart({
      ...producto,
      cantidad: 1,
      colorSeleccionado,
    });

    toast.success("¡Agregado al carrito con éxito!", {
      style: {
        background: "#2F4A2F",
        color: "#E8D6B3",
        border: "1px solid #E8D6B333",
      },
    });
  };

  return (
    <div className="flex-1 w-full flex items-center justify-center p-4 sm:px-6 lg:px-8 font-quicksand overflow-hidden">
      <div className="max-w-6xl w-full max-h-full flex flex-col md:flex-row bg-[#F2E4C9] shadow-2xl overflow-hidden rounded-sm">
        <div className="w-full md:w-1/2 h-64 md:h-auto relative flex-shrink-0">
          <div className="w-full h-full relative">
            {sinStock && (
              <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/40 backdrop-blur-[2px]">
                <span className="bg-[#8B5E3C] text-[#F2E4C9] text-sm font-bold uppercase tracking-widest px-8 py-4 border border-[#F2E4C9]/30">
                  Agotado
                </span>
              </div>
            )}
            <img
              src={producto.imagen || "/logo-orilla.png"}
              alt={producto.nombre}
              className={`w-full h-full object-cover transition-all ${
                sinStock ? "opacity-60 grayscale" : ""
              }`}
            />
          </div>
        </div>

        <div className="w-full md:w-1/2 flex flex-col p-6 md:p-10 overflow-y-auto justify-center">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-belleza text-[#2F4A2F] mb-4 tracking-wide">
            {producto.nombre}
          </h1>

          <div className="text-2xl md:text-3xl text-[#2F4A2F] mb-6">
            ${Number(producto.precio).toLocaleString("es-AR")}
          </div>

          <hr className="border-[#2F4A2F]/20 mb-6" />

          {coloresDisponibles.length > 0 && (
            <div className="mb-8">
              <span className="block text-sm font-bold text-[#2F4A2F] mb-3">
                Color:
              </span>
              <div className="flex flex-wrap gap-3">
                {coloresDisponibles.map((color) => {
                  const stockEsteColor = obtenerStockColor(
                    producto.stock,
                    color,
                  );
                  const isAgotado = stockEsteColor <= 0;
                  const isSelected = colorElegido === color;

                  return (
                    <button
                      key={color}
                      disabled={isAgotado}
                      onClick={() => setColorElegido(color)}
                      className={`flex items-center gap-2 px-3 py-2 border rounded-full transition-all ${
                        isAgotado
                          ? "opacity-40 cursor-not-allowed"
                          : "cursor-pointer"
                      } ${
                        isSelected
                          ? "border-[#2F4A2F] bg-white/50 shadow-sm"
                          : "border-gray-400 hover:border-[#2F4A2F]"
                      }`}
                    >
                      <div
                        className="w-5 h-5 rounded-full border border-gray-300 relative overflow-hidden"
                        style={{ backgroundColor: getColorBackground(color) }}
                      >
                        {isAgotado && (
                          <div className="absolute w-full h-[1px] bg-red-500 rotate-45 top-1/2 left-0 transform -translate-y-1/2"></div>
                        )}
                      </div>
                      <span
                        className={`text-sm ${
                          isAgotado ? "line-through" : ""
                        } text-[#2F4A2F]`}
                      >
                        {color}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          <div className="mb-8">
            <button
              onClick={handleAgregarAlCarrito}
              disabled={sinStock}
              className={`w-full flex items-center justify-center gap-3 py-4 px-8 tracking-widest transition-all cursor-pointer ${
                sinStock
                  ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                  : "bg-[#2F4A2F] text-[#F2E4C9] hover:bg-[#1f331f] active:scale-[0.98] shadow-md hover:shadow-lg"
              }`}
            >
              {sinStock ? "Sin Stock" : "Agregar al carrito"}
              {!sinStock && <ShoppingBag size={20} />}
            </button>
          </div>

          <hr className="border-[#2F4A2F]/20 mb-6" />

          <div className="text-[#2F4A2F] text-sm leading-relaxed">
            <h3 className="font-bold mb-2">Descripción del producto:</h3>
            <p className="opacity-90">
              {producto.descripcion ||
                "Un mate artesanal único para acompañar tus mejores momentos. Fabricado con materiales de primera calidad y diseño exclusivo de Orilla Mates."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
