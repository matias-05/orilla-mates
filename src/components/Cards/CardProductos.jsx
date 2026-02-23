import { useEffect, useState, useMemo } from "react";
import { db } from "../../firebase/config";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const normalizar = (txt) => {
  if (!txt) return "";
  return txt
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
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

// -------------------------------------------------------------
// COMPONENTE 1: La tarjeta individual del producto
// -------------------------------------------------------------
function ProductoItem({ prod, getColorBackground }) {
  const navigate = useNavigate();
  const coloresDisponibles = prod.colores || [];

  const [colorElegido, setColorElegido] = useState(coloresDisponibles[0] || "");

  const totalStock = useMemo(() => {
    const stock = prod.stock;
    if (!stock) return 0;
    if (typeof stock === "number") return stock;
    if (typeof stock === "string") return parseInt(stock, 10) || 0;
    if (typeof stock === "object") {
      return Object.values(stock).reduce(
        (acc, curr) => acc + (Number(curr) || 0),
        0,
      );
    }
    return 0;
  }, [prod.stock]);

  const sinStockGeneral = totalStock <= 0;

  // 🔥 LÓGICA PARA ARCHIVOS LOCALES: Agrega sufijos al nombre del archivo
  const imagenMostrada = useMemo(() => {
    if (!prod.imagen) return "/logo-orilla.png";

    if (prod.imagenes && prod.imagenes[colorElegido]) {
      return prod.imagenes[colorElegido];
    }

    if (colorElegido) {
      const colorNorm = normalizar(colorElegido);

      const sufijos = {
        borravino: "B",
        negro: "N",
        marron: "M",
      };

      const letraAgregada = sufijos[colorNorm];

      if (letraAgregada) {
        return prod.imagen.replace(/(\.[\w\d_-]+)$/i, `${letraAgregada}$1`);
      }
    }

    return prod.imagen;
  }, [colorElegido, prod.imagen, prod.imagenes]);

  return (
    <div
      className={`flex flex-col shadow-xl transition-all duration-300 overflow-hidden h-full bg-[#2F4A2F] ${
        sinStockGeneral ? "opacity-80 grayscale-[0.8]" : "hover:scale-[1.02]"
      }`}
    >
      <div className="bg-[#617A67] p-4 relative">
        {sinStockGeneral && (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/50 backdrop-blur-[2px]">
            <span className="bg-[#8B5E3C] text-[#F2E4C9] text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] px-6 py-3 border border-[#F2E4C9]/30 shadow-2xl animate-pulse">
              Agotado
            </span>
          </div>
        )}

        <div className="aspect-square w-full overflow-hidden bg-white/5 relative">
          <img
            loading="lazy"
            src={imagenMostrada}
            alt={`${prod.nombre} - ${colorElegido || "General"}`}
            className={`w-full h-full object-cover transition-all duration-300 ${
              sinStockGeneral ? "opacity-40" : "opacity-100"
            }`}
          />
        </div>
      </div>

      <div className="p-4 flex flex-col flex-grow text-[#F2E4C9] relative">
        <div className="mb-4">
          <h3 className="text-sm font-light mb-1 leading-tight min-h-[2.5rem]">
            {prod.nombre}
          </h3>
          <span className="text-lg font-bold text-[#E8D6B3]">
            $ {Number(prod.precio).toLocaleString("es-AR")}
          </span>
        </div>

        {coloresDisponibles.length > 0 && !sinStockGeneral && (
          <div className="mb-6">
            <p className="text-[11px]  tracking-widest opacity-60 mb-2">
              Colores Disponibles:
            </p>
            <div className="flex flex-wrap gap-3">
              {coloresDisponibles.map((color) => {
                const stockEsteColor = obtenerStockColor(prod.stock, color);
                const sinStockColor = stockEsteColor <= 0;

                return (
                  <button
                    key={color}
                    disabled={sinStockColor}
                    onClick={() => setColorElegido(color)}
                    className={`group relative flex flex-col items-center gap-1 transition-all ${
                      sinStockColor
                        ? "opacity-30 cursor-not-allowed"
                        : "cursor-pointer"
                    } ${
                      colorElegido === color
                        ? "scale-110"
                        : "opacity-70 hover:opacity-100"
                    }`}
                  >
                    <div
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                        colorElegido === color
                          ? "border-[#F2E4C9]"
                          : "border-transparent"
                      }`}
                      style={{ backgroundColor: getColorBackground(color) }}
                    >
                      {sinStockColor && (
                        <div className="absolute w-full h-[1px] bg-white rotate-45"></div>
                      )}
                    </div>
                    <span
                      className={`text-[10px] font-medium tracking-tighter ${
                        sinStockColor ? "line-through" : ""
                      }`}
                    >
                      {color}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        <button
          onClick={() => navigate(`/producto/${prod.id}`)}
          className={`mt-auto py-3 px-8 cursor-pointer self-center text-sm font-medium tracking-wider w-full shadow-lg transition-all ${
            sinStockGeneral
              ? "bg-gray-600 text-[#F2E4C9] hover:bg-gray-500"
              : "bg-[#8B5E3C] text-[#F2E4C9] hover:bg-[#a67148] hover:shadow-xl active:scale-95"
          }`}
        >
          Ver Detalle
        </button>
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// COMPONENTE 2: El contenedor principal (ESTO ES LO QUE FALTABA)
// -------------------------------------------------------------
export default function CardProductos({ categoria, filtro }) {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);

  const getColorBackground = (color) => {
    if (!color) return "transparent";
    const c = normalizar(color);
    if (c === "negro") return "black";
    if (c === "borravino") return "#4A0E0E";
    if (c === "marron") return "#5C3D2E";
    return "#5C3D2E";
  };

  useEffect(() => {
    const obtenerProductos = async () => {
      setLoading(true);
      try {
        const q = query(
          collection(db, "catalogo"),
          where("categoria", "==", categoria),
        );
        const querySnapshot = await getDocs(q);
        const data = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setProductos(data);
      } catch (error) {
        console.error("Error Firebase:", error);
      } finally {
        setLoading(false);
      }
    };
    if (categoria) obtenerProductos();
  }, [categoria]);

  const productosFiltrados = productos.filter((prod) => {
    if (!filtro || filtro === "Todos") return true;
    return (prod.nombre || "").toLowerCase().includes(filtro.toLowerCase());
  });

  if (loading)
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2F4A2F]"></div>
      </div>
    );

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 pb-10">
      {productosFiltrados.map((prod) => (
        <ProductoItem
          key={prod.id}
          prod={prod}
          getColorBackground={getColorBackground}
        />
      ))}
    </div>
  );
}
