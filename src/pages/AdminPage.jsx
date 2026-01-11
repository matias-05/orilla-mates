import { useState, useEffect, useMemo } from "react";
import { db } from "../firebase/config";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";
import { Edit, Package, DollarSign, Search, Loader2 } from "lucide-react";

export default function AdminPage() {
  const [productos, setProductos] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ precio: 0, stock: {} });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "catalogo"));
        const docs = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setProductos(docs);
      } catch (error) {
        console.error("Error al cargar productos:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProductos();
  }, []);

  const productosFiltrados = useMemo(() => {
    return productos.filter((prod) =>
      prod.nombre.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, productos]);

  const handleEditClick = (prod) => {
    setEditingId(prod.id);
    setEditForm({
      precio: prod.precio || 0,
      stock:
        typeof prod.stock === "object"
          ? { ...prod.stock }
          : { Único: prod.stock },
    });
  };

  const handleSave = async (id) => {
    try {
      const docRef = doc(db, "catalogo", id);
      await updateDoc(docRef, {
        precio: Number(editForm.precio),
        stock: editForm.stock,
      });
      setProductos(
        productos.map((p) => (p.id === id ? { ...p, ...editForm } : p))
      );
      setEditingId(null);
    } catch (error) {
      alert("Error al guardar");
    }
  };

  if (loading)
    return (
      <div className="min-h-screen bg-[#F2E4C9] flex flex-col items-center justify-center font-belleza">
        <Loader2 className="animate-spin text-[#2F4A2F] mb-4" size={48} />
        <span className="text-[#2F4A2F] tracking-widest">CARGANDO...</span>
      </div>
    );

  return (
    <div className="bg-[#F2E4C9] min-h-screen p-4 md:p-12 font-quicksand">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left">
            <h1 className="font-belleza text-3xl md:text-4xl text-[#2F4A2F]">
              Administración
            </h1>
            <p className="text-[#2F4A2F]/60 uppercase tracking-widest text-[10px] font-bold mt-1">
              Orilla Mates - Control de Stock
            </p>
          </div>
          <div className="relative w-full md:w-80">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-[#2F4A2F]/40"
              size={18}
            />
            <input
              type="text"
              placeholder="Buscar por nombre..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white/80 rounded-2xl border border-[#2F4A2F]/10 focus:ring-2 focus:ring-[#2F4A2F] outline-none transition-all shadow-sm"
            />
          </div>
        </header>

        <div className="grid grid-cols-1 gap-4 md:hidden">
          {productosFiltrados.map((prod) => (
            <div
              key={prod.id}
              className="bg-white/60 backdrop-blur-sm p-5 rounded-3xl border border-white shadow-lg"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex gap-3">
                  <img
                    src={prod.imagen}
                    className="w-14 h-14 rounded-2xl object-cover bg-white shadow-sm"
                  />
                  <div>
                    <h3 className="font-bold text-[#2F4A2F] text-lg leading-tight">
                      {prod.nombre}
                    </h3>
                    <p className="text-[#8B5E3C] font-black text-xl mt-1">
                      ${prod.precio.toLocaleString()}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => handleEditClick(prod)}
                  className="bg-[#2F4A2F] text-white p-3 rounded-2xl shadow-md active:scale-90 transition-transform"
                >
                  <Edit size={20} />
                </button>
              </div>

              <div className="bg-white/40 rounded-2xl p-3 border border-white/50">
                <p className="text-[10px] uppercase font-black text-[#2F4A2F]/40 mb-2 tracking-widest">
                  Disponibilidad:
                </p>
                <div className="flex flex-wrap gap-2">
                  {typeof prod.stock === "object" ? (
                    Object.entries(prod.stock).map(([color, cant]) => (
                      <div
                        key={color}
                        className="bg-white px-3 py-1.5 rounded-xl border border-[#2F4A2F]/5 shadow-sm flex items-center gap-2"
                      >
                        <span className="text-[11px] font-bold text-[#2F4A2F] uppercase">
                          {color}
                        </span>
                        <span
                          className={`text-sm font-black ${
                            cant <= 3 ? "text-red-500" : "text-[#8B5E3C]"
                          }`}
                        >
                          {cant}
                        </span>
                      </div>
                    ))
                  ) : (
                    <div className="bg-white px-3 py-1.5 rounded-xl border border-[#2F4A2F]/5 shadow-sm flex items-center gap-2">
                      <span className="text-[11px] font-bold text-[#2F4A2F] uppercase">
                        Stock:
                      </span>
                      <span
                        className={`text-sm font-black ${
                          prod.stock <= 3 ? "text-red-500" : "text-[#8B5E3C]"
                        }`}
                      >
                        {prod.stock}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="hidden md:block bg-white/40 backdrop-blur-md rounded-[2.5rem] shadow-2xl overflow-hidden border border-white/50">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-[#2F4A2F] text-[#F2E4C9] uppercase text-[10px] tracking-[0.2em]">
                <th className="p-6">Producto</th>
                <th className="p-6">Precio</th>
                <th className="p-6">Stock por Variantes</th>
                <th className="p-6 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2F4A2F]/5 text-sm">
              {productosFiltrados.map((prod) => (
                <tr
                  key={prod.id}
                  className="hover:bg-white/60 transition-colors"
                >
                  <td className="p-6 font-bold text-[#2F4A2F]">
                    {prod.nombre}
                  </td>
                  <td className="p-6 text-[#8B5E3C] font-black text-base">
                    ${prod.precio.toLocaleString()}
                  </td>
                  <td className="p-6">
                    <div className="flex flex-wrap gap-2">
                      {typeof prod.stock === "object" ? (
                        Object.entries(prod.stock).map(([color, cant]) => (
                          <span
                            key={color}
                            className="px-3 py-1 bg-white/80 border border-[#2F4A2F]/10 rounded-full text-[10px] font-bold shadow-sm"
                          >
                            {color.toUpperCase()}:{" "}
                            <span
                              className={
                                cant <= 3 ? "text-red-500" : "text-[#8B5E3C]"
                              }
                            >
                              {cant}
                            </span>
                          </span>
                        ))
                      ) : (
                        <span className="px-3 py-1 bg-white/80 border border-[#2F4A2F]/10 rounded-full text-[10px] font-bold shadow-sm">
                          STOCK:{" "}
                          <span
                            className={
                              prod.stock <= 3
                                ? "text-red-500"
                                : "text-[#8B5E3C]"
                            }
                          >
                            {prod.stock}
                          </span>
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="p-6 text-center">
                    <button
                      onClick={() => handleEditClick(prod)}
                      className="bg-[#2F4A2F] text-white p-2.5 rounded-xl hover:bg-[#8B5E3C] shadow-md"
                    >
                      <Edit size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {editingId && (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-0 md:p-4 bg-[#2F4A2F]/60 backdrop-blur-md">
          <div className="bg-[#F2E4C9] w-full max-w-md p-8 rounded-t-[2.5rem] md:rounded-[2.5rem] shadow-2xl border border-white animate-in slide-in-from-bottom duration-300">
            <div className="w-12 h-1.5 bg-[#2F4A2F]/10 rounded-full mx-auto mb-6 md:hidden"></div>
            <h2 className="font-belleza text-2xl text-[#2F4A2F] mb-6 flex items-center gap-2 uppercase tracking-tight">
              Actualizar
            </h2>

            <div className="space-y-6 overflow-y-auto max-h-[60vh] px-1 custom-scrollbar">
              <div>
                <label className="text-[10px] uppercase font-black text-[#2F4A2F]/40 mb-2 block">
                  Precio ($)
                </label>
                <div className="relative">
                  <DollarSign
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-[#2F4A2F]/30"
                    size={18}
                  />
                  <input
                    type="number"
                    min="0"
                    value={editForm.precio}
                    onChange={(e) =>
                      setEditForm({
                        ...editForm,
                        precio: Math.max(0, e.target.value),
                      })
                    }
                    className="w-full pl-12 pr-4 py-4 bg-white rounded-2xl shadow-inner font-bold text-[#2F4A2F] border-none focus:ring-2 focus:ring-[#8B5E3C]"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] uppercase font-black text-[#2F4A2F]/40 mb-3 block">
                  Stock
                </label>
                <div className="grid grid-cols-1 gap-3">
                  {Object.entries(editForm.stock).map(([color, cant]) => (
                    <div
                      key={color}
                      className="flex items-center justify-between bg-white/60 p-4 rounded-2xl border border-white"
                    >
                      <span className="capitalize text-[#2F4A2F] font-bold flex items-center gap-2">
                        <Package size={16} className="text-[#8B5E3C]" /> {color}
                      </span>
                      <input
                        type="number"
                        min="0"
                        value={cant}
                        onChange={(e) => {
                          const val = Number(e.target.value);
                          setEditForm({
                            ...editForm,
                            stock: {
                              ...editForm.stock,
                              [color]: val < 0 ? 0 : val,
                            },
                          });
                        }}
                        className="w-20 text-right font-black text-[#8B5E3C] bg-transparent outline-none text-xl"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-4 mt-8">
              <button
                onClick={() => setEditingId(null)}
                className="flex-1 py-4 text-[#2F4A2F] font-black text-[11px] tracking-widest uppercase"
              >
                Cancelar
              </button>
              <button
                onClick={() => handleSave(editingId)}
                className="flex-1 py-4 bg-[#2F4A2F] text-[#F2E4C9] rounded-2xl font-black text-[11px] tracking-widest shadow-lg uppercase"
              >
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
