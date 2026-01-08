import { useState, useEffect } from 'react';
import { db } from '../firebase/config';
import { collection, getDocs, updateDoc, doc } from 'firebase/firestore';
import { Edit } from 'lucide-react';

export default function AdminPage() {
  const [productos, setProductos] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ precio: 0, stock: {} });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "catalogo"));
        const docs = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setProductos(docs);
      } catch (error) {
        console.error("Error al cargar productos:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProductos();
  }, []);

  const calcularTotalStock = (stock) => {
    if (typeof stock === 'number') return stock;
    if (typeof stock === 'object' && stock !== null) {
      return Object.values(stock).reduce((acc, curr) => acc + Number(curr), 0);
    }
    return 0;
  };

  const handleEditClick = (prod) => {
    setEditingId(prod.id);
    setEditForm({ 
      precio: prod.precio || 0, 
      stock: typeof prod.stock === 'object' ? { ...prod.stock } : { "Unico": prod.stock } 
    });
  };

  const handleSave = async (id) => {
    try {
      const docRef = doc(db, "catalogo", id);
      await updateDoc(docRef, {
        precio: Number(editForm.precio),
        stock: editForm.stock 
      });
      
      setProductos(productos.map(p => p.id === id ? { ...p, ...editForm } : p));
      setEditingId(null);
    } catch (error) {
      alert("Error al guardar");
    }
  };

  if (loading) return <div className="min-h-screen bg-[#F2E4C9] flex items-center justify-center font-belleza text-2xl">Cargando...</div>;

  return (
    <div className="bg-[#F2E4C9] min-h-screen p-6 md:p-12 font-quicksand">
      <div className="max-w-6xl mx-auto">
        <header className="mb-12 border-b border-[#2F4A2F]/10 pb-6 flex justify-between items-end">
          <h1 className="font-belleza text-4xl text-[#2F4A2F]">Panel de Administración</h1>
          <img src="/logo-orilla.webp" alt="Logo" className="w-16 h-16 object-contain" />
        </header>

        <div className="bg-white/50 backdrop-blur-sm rounded-3xl shadow-xl overflow-hidden border border-white">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#2F4A2F] text-[#F2E4C9] uppercase text-[10px] tracking-[0.2em]">
                <th className="p-5">Producto</th>
                <th className="p-5">Precio</th>
                <th className="p-5">Stock por Variante</th>
                <th className="p-5 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2F4A2F]/5">
              {productos.map((prod) => (
                <tr key={prod.id} className="hover:bg-white/40">
                  <td className="p-5 font-medium text-[#2F4A2F]">{prod.nombre}</td>
                  <td className="p-5 text-[#8B5E3C] font-bold">${prod.precio}</td>
                  <td className="p-5">
                    <div className="flex flex-wrap gap-2">
                      {typeof prod.stock === 'object' ? (
                        Object.entries(prod.stock).map(([color, cant]) => (
                          <span key={color} className="px-2 py-1 bg-[#2F4A2F]/10 rounded text-[10px] text-[#2F4A2F]">
                            {color}: <strong>{cant}</strong>
                          </span>
                        ))
                      ) : (
                        <span className="text-gray-500 italic">Sin variantes: {prod.stock}</span>
                      )}
                    </div>
                  </td>
                  <td className="p-5 text-center">
                    <button onClick={() => handleEditClick(prod)} className="text-[#2F4A2F] hover:text-[#8B5E3C]"><Edit size={20} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {editingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-[#F2E4C9] w-full max-w-md p-8 rounded-3xl shadow-2xl">
            <h2 className="font-belleza text-2xl text-[#2F4A2F] mb-6">Editar Producto</h2>
            
            <div className="space-y-4">
              <label className="text-[10px] font-bold uppercase text-gray-500">Precio ($)</label>
              <input 
                type="number" 
                value={editForm.precio}
                onChange={(e) => setEditForm({...editForm, precio: e.target.value})}
                className="w-full p-3 rounded-xl border-none outline-none"
              />

              <p className="text-[10px] font-bold uppercase text-gray-500 mt-4">Stock por Colores:</p>
              {Object.entries(editForm.stock).map(([color, cant]) => (
                <div key={color} className="flex items-center justify-between bg-white p-3 rounded-xl">
                  <span className="text-[#2F4A2F] text-sm">{color}</span>
                  <input 
                    type="number" 
                    value={cant}
                    onChange={(e) => setEditForm({
                      ...editForm,
                      stock: { ...editForm.stock, [color]: Number(e.target.value) }
                    })}
                    className="w-20 text-right font-bold text-[#8B5E3C] outline-none"
                  />
                </div>
              ))}
            </div>

            <div className="flex gap-4 mt-8">
              <button onClick={() => setEditingId(null)} className="flex-1 py-3 text-[#2F4A2F] font-bold">CANCELAR</button>
              <button onClick={() => handleSave(editingId)} className="flex-1 py-3 bg-[#2F4A2F] text-white rounded-xl font-bold">GUARDAR</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}