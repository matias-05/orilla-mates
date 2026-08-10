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

// 🔥 Extraemos esta función para poder ordenar los productos antes de mostrarlos
const calcularTotalStock = (stock) => {
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
};

function ProductoItem({ prod }) {
  const navigate = useNavigate();
  const coloresDisponibles = prod.colores || [];

  const [colorElegido, setColorElegido] = useState(coloresDisponibles[0] || "");

  const totalStock = useMemo(
    () => calcularTotalStock(prod.stock),
    [prod.stock],
  );
  const sinStockGeneral = totalStock <= 0;

  const imagenMostrada = useMemo(() => {
    if (!prod.imagen) return "/logo-orilla.png";

    if (prod.imagenes && typeof prod.imagenes === "object" && colorElegido) {
      const colorKey = Object.keys(prod.imagenes).find(
        (k) => normalizar(k) === normalizar(colorElegido),
      );

      if (colorKey && prod.imagenes[colorKey]) {
        const fotos = prod.imagenes[colorKey];
        if (Array.isArray(fotos) && fotos.length > 0) {
          return fotos[0];
        }
        if (typeof fotos === "string") {
          return fotos;
        }
      }
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
    // 🔥 Quitamos el filtro gris y la opacidad del contenedor principal
    <div className="flex flex-col shadow-xl transition-all duration-300 overflow-hidden h-full bg-[#2F4A2F] hover:scale-[1.02]">
      <div className="bg-[#617A67] p-4 relative">
        <div className="aspect-square w-full overflow-hidden bg-white/5 relative">
          {/* 🔥 Nueva etiqueta de "Sin Stock" arriba a la derecha */}
          {sinStockGeneral && (
            <div className="absolute top-2 right-2 z-20">
              <span className="bg-[#2F4A2F] text-[#F2E4C9] text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] px-3 py-1.5 border border-[#F2E4C9]/30 shadow-lg">
                Sin Stock
              </span>
            </div>
          )}

          {/* 🔥 La imagen ya no tiene opacidad disminuida */}
          <img
            loading="lazy"
            src={imagenMostrada}
            alt={`${prod.nombre} - ${colorElegido || "General"}`}
            className="w-full h-full object-cover transition-all duration-300 opacity-100"
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

        {/* 🔥 El botón vuelve a tener su diseño original siempre */}
        <button
          onClick={() => navigate(`/producto/${prod.id}`)}
          className="mt-auto py-3 px-8 cursor-pointer self-center text-sm font-medium tracking-wider w-full shadow-lg transition-all bg-[#8B5E3C] text-[#F2E4C9] hover:bg-[#a67148] hover:shadow-xl active:scale-95"
        >
          Ver Detalle
        </button>
      </div>
    </div>
  );
}

export default function CardProductos({ categoria, filtro }) {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);

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

  // 🔥 Filtramos y ORDENAMOS los productos para mandar los sin stock al final
  const productosFiltradosYOrdenados = useMemo(() => {
    const filtrados = productos.filter((prod) => {
      if (!filtro || filtro === "Todos") return true;
      return (prod.nombre || "").toLowerCase().includes(filtro.toLowerCase());
    });

    return filtrados.sort((a, b) => {
      const stockA = calcularTotalStock(a.stock);
      const stockB = calcularTotalStock(b.stock);

      const sinStockA = stockA <= 0;
      const sinStockB = stockB <= 0;

      // Si A no tiene stock y B sí, A va al final
      if (sinStockA && !sinStockB) return 1;
      // Si A tiene stock y B no, A va primero
      if (!sinStockA && sinStockB) return -1;

      return 0; // Si ambos tienen o no tienen stock, mantienen su orden natural
    });
  }, [productos, filtro]);

  if (loading)
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2F4A2F]"></div>
      </div>
    );

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 pb-10">
      {productosFiltradosYOrdenados.map((prod) => (
        <ProductoItem key={prod.id} prod={prod} />
      ))}
    </div>
  );
}
