import { useState, useEffect, useMemo } from "react";
import { db } from "../firebase/config";
import {
  collection,
  getDocs,
  updateDoc,
  doc,
  deleteDoc,
  addDoc,
} from "firebase/firestore";
import {
  Edit,
  Package,
  DollarSign,
  Search,
  Loader2,
  Trash2,
  PlusCircle,
  UploadCloud,
  Tag,
  Image as ImageIcon,
  X,
} from "lucide-react";
import { toast } from "sonner";

export default function AdminPage() {
  const [productos, setProductos] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  // 🔥 Nuevo estado para el filtro de categorías
  const [filterCategoria, setFilterCategoria] = useState("Todos");

  const [editingId, setEditingId] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const [tipoColor, setTipoColor] = useState("unico");
  const [nuevoColor, setNuevoColor] = useState("");

  const categoriasDisponibles = [
    "Todos",
    "Mates",
    "Termos",
    "Bombillas",
    "Yerbas",
    "Otros",
  ];

  const [editForm, setEditForm] = useState({
    nombre: "",
    precio: 0,
    imagen: "",
    categoria: "Mates",
    descripcion: "",
    stock: { Unico: 0 },
    colores: [],
    imagenes: {},
  });

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

  // 🔥 Actualizamos el useMemo para filtrar por búsqueda Y por categoría
  const productosFiltrados = useMemo(() => {
    return productos.filter((prod) => {
      const matchBuscador = prod.nombre
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchCategoria =
        filterCategoria === "Todos" || prod.categoria === filterCategoria;
      return matchBuscador && matchCategoria;
    });
  }, [searchTerm, filterCategoria, productos]);

  const resetForm = () => {
    setImageFile(null);
    setImagePreview(null);
    setTipoColor("unico");
    setNuevoColor("");
    setEditForm({
      nombre: "",
      precio: 0,
      imagen: "",
      categoria: "Mates",
      descripcion: "",
      stock: { Unico: 0 },
      colores: [],
      imagenes: {},
    });
  };

  const handleEditClick = (prod) => {
    setIsCreating(false);
    setEditingId(prod.id);
    setImageFile(null);
    setImagePreview(prod.imagen || null);

    const esVariantes = prod.colores && prod.colores.length > 0;
    setTipoColor(esVariantes ? "varios" : "unico");

    let stockInicial = {};
    if (typeof prod.stock === "object") {
      stockInicial = { ...prod.stock };
      if (stockInicial["Único"] !== undefined) {
        stockInicial["Unico"] = stockInicial["Único"];
        delete stockInicial["Único"];
      }
    } else {
      stockInicial = { Unico: prod.stock || 0 };
    }

    if (esVariantes) {
      delete stockInicial["Unico"];
      delete stockInicial["Único"];
    }

    const safeImagenes = {};
    if (prod.imagenes) {
      for (const key in prod.imagenes) {
        safeImagenes[key] = Array.isArray(prod.imagenes[key])
          ? prod.imagenes[key]
          : [prod.imagenes[key]];
      }
    }

    setEditForm({
      nombre: prod.nombre || "",
      precio: prod.precio || 0,
      imagen: prod.imagen || "",
      categoria: prod.categoria || "Mates",
      descripcion: prod.descripcion || "",
      stock: stockInicial,
      colores: prod.colores || [],
      imagenes: safeImagenes,
    });
  };

  const handleCreateNewClick = () => {
    setEditingId(null);
    setIsCreating(true);
    resetForm();
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const uploadToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "orillandomates");
    const cloudinaryUrl = `https://api.cloudinary.com/v1_1/dcpxbcrdq/image/upload`;

    const res = await fetch(cloudinaryUrl, { method: "POST", body: formData });
    if (!res.ok) throw new Error("Error al subir a Cloudinary");
    const data = await res.json();
    return data.secure_url;
  };

  const handleColorImageUpload = async (color, e) => {
    const file = e.target.files[0];
    if (!file) return;

    toast.info(`Subiendo foto para ${color}...`);
    try {
      const url = await uploadToCloudinary(file);
      setEditForm((prev) => {
        const arrExistente = prev.imagenes[color] || [];
        return {
          ...prev,
          imagenes: { ...prev.imagenes, [color]: [...arrExistente, url] },
        };
      });
      toast.success(`¡Foto agregada a ${color}!`);
    } catch (error) {
      toast.error(`Error al subir la foto`);
    }
  };

  const handleRemoveColorImage = (color, indexToRemove) => {
    setEditForm((prev) => {
      const arrCopy = [...(prev.imagenes[color] || [])];
      arrCopy.splice(indexToRemove, 1);
      return {
        ...prev,
        imagenes: { ...prev.imagenes, [color]: arrCopy },
      };
    });
  };

  const handleAddColor = () => {
    if (!nuevoColor.trim()) return;

    const colorTrimmed = nuevoColor.trim();
    const colorCapitalized =
      colorTrimmed.charAt(0).toUpperCase() +
      colorTrimmed.slice(1).toLowerCase();

    if (editForm.colores.includes(colorCapitalized)) {
      toast.error("Este color ya fue agregado");
      return;
    }

    setEditForm((prev) => ({
      ...prev,
      colores: [...prev.colores, colorCapitalized],
      stock: { ...prev.stock, [colorCapitalized]: 0 },
      imagenes: { ...prev.imagenes, [colorCapitalized]: [] },
    }));
    setNuevoColor("");
  };

  const handleRemoveColor = (colorToRemove) => {
    const newStock = { ...editForm.stock };
    delete newStock[colorToRemove];

    const newImagenes = { ...editForm.imagenes };
    delete newImagenes[colorToRemove];

    setEditForm((prev) => ({
      ...prev,
      colores: prev.colores.filter((c) => c !== colorToRemove),
      stock: newStock,
      imagenes: newImagenes,
    }));
  };

  const handleSave = async () => {
    setIsUploading(true);
    try {
      let finalImageUrl = editForm.imagen;

      if (imageFile) {
        finalImageUrl = await uploadToCloudinary(imageFile);
      }

      const categoriaCapitalized = editForm.categoria
        ? editForm.categoria.charAt(0).toUpperCase() +
          editForm.categoria.slice(1).toLowerCase()
        : "Mates";

      let finalStock = { ...editForm.stock };
      let finalColores = editForm.colores;
      let finalImagenes = { ...editForm.imagenes };

      if (tipoColor === "unico") {
        const stockValor = editForm.stock.Unico ?? editForm.stock.Único ?? 0;
        finalStock = { Unico: Number(stockValor) };
        finalColores = [];
        finalImagenes =
          finalImagenes["Unico"] && finalImagenes["Unico"].length > 0
            ? { Unico: finalImagenes["Unico"] }
            : {};
      } else {
        delete finalStock["Unico"];
        delete finalStock["Único"];
        delete finalImagenes["Unico"];
      }

      const dataToSave = {
        ...editForm,
        categoria: categoriaCapitalized,
        precio: Number(editForm.precio),
        imagen: finalImageUrl,
        stock: finalStock,
        colores: finalColores,
        imagenes: finalImagenes,
      };

      if (isCreating) {
        const docRef = await addDoc(collection(db, "catalogo"), dataToSave);
        setProductos([...productos, { id: docRef.id, ...dataToSave }]);
        toast.success("Producto creado exitosamente");
      } else {
        const docRef = doc(db, "catalogo", editingId);
        await updateDoc(docRef, dataToSave);
        setProductos(
          productos.map((p) =>
            p.id === editingId ? { ...p, ...dataToSave } : p,
          ),
        );
        toast.success("Producto actualizado");
      }

      setEditingId(null);
      setIsCreating(false);
      resetForm();
    } catch (error) {
      console.error("Error al guardar:", error);
      toast.error("Error al guardar el producto");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (id, nombre) => {
    if (
      window.confirm(
        `¿Estás seguro de que quieres eliminar "${nombre}"? Esta acción no se puede deshacer.`,
      )
    ) {
      try {
        await deleteDoc(doc(db, "catalogo", id));
        setProductos(productos.filter((p) => p.id !== id));
        toast.success("Producto eliminado");
      } catch (error) {
        console.error("Error al eliminar:", error);
        toast.error("Error al eliminar el producto");
      }
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
        <header className="mb-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left">
            <h1 className="font-belleza text-3xl md:text-4xl text-[#2F4A2F]">
              Administración
            </h1>
            <p className="text-[#2F4A2F]/60 uppercase tracking-widest text-[10px] font-bold mt-1">
              Orilla Mates - Gestión de Catálogo
            </p>
          </div>
          <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
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
            <button
              onClick={handleCreateNewClick}
              className="flex items-center justify-center gap-2 bg-[#2F4A2F] text-[#F2E4C9] px-6 py-3 rounded-2xl shadow-md hover:bg-[#1f331f] transition-colors shrink-0"
            >
              <PlusCircle size={20} />
              <span className="font-bold tracking-wider text-sm">
                Nuevo Mate
              </span>
            </button>
          </div>
        </header>

        {/* 🔥 NAVEGADOR DE CATEGORÍAS */}
        <div className="flex overflow-x-auto gap-3 pb-4 mb-4 custom-scrollbar">
          {categoriasDisponibles.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCategoria(cat)}
              className={`px-5 py-2.5 rounded-xl whitespace-nowrap text-sm font-bold tracking-wide transition-all duration-300 shadow-sm ${
                filterCategoria === cat
                  ? "bg-[#8B5E3C] text-[#F2E4C9] scale-105"
                  : "bg-white/60 text-[#2F4A2F] hover:bg-white"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-4 md:hidden">
          {productosFiltrados.map((prod) => {
            const stockUnico =
              typeof prod.stock === "object"
                ? (prod.stock?.Unico ?? prod.stock?.Único ?? 0)
                : prod.stock || 0;

            return (
              <div
                key={prod.id}
                className="bg-white/60 backdrop-blur-sm p-5 rounded-3xl border border-white shadow-lg space-y-3"
              >
                <div className="flex justify-between items-start">
                  <div className="flex gap-3">
                    <img
                      src={prod.imagen || "/logo-orilla.png"}
                      className="w-14 h-14 rounded-2xl object-cover bg-white shadow-sm"
                    />
                    <div>
                      <h3 className="font-bold text-[#2F4A2F] text-lg leading-tight">
                        {prod.nombre}
                      </h3>
                      <p className="text-[#8B5E3C] font-black text-xl mt-1">
                        ${Number(prod.precio).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => handleEditClick(prod)}
                      className="bg-[#2F4A2F] text-white p-2 rounded-xl shadow-md active:scale-90 transition-transform"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(prod.id, prod.nombre)}
                      className="bg-red-100 text-red-600 p-2 rounded-xl border border-red-200 shadow-sm active:scale-90 transition-transform"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 pt-2 border-t border-black/5">
                  {prod.colores && prod.colores.length > 0 ? (
                    prod.colores.map((color) => {
                      const cant = prod.stock?.[color] || 0;
                      return (
                        <span
                          key={color}
                          className="px-2 py-1 bg-white border border-[#2F4A2F]/10 rounded-xl text-[10px] font-bold shadow-sm"
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
                      );
                    })
                  ) : (
                    <span className="px-2 py-1 bg-white border border-[#2F4A2F]/10 rounded-xl text-[10px] font-bold shadow-sm">
                      STOCK:{" "}
                      <span
                        className={
                          stockUnico <= 3 ? "text-red-500" : "text-[#8B5E3C]"
                        }
                      >
                        {stockUnico}
                      </span>
                    </span>
                  )}
                </div>
              </div>
            );
          })}

          {/* 🔥 Mensaje si el filtro no da resultados */}
          {productosFiltrados.length === 0 && (
            <div className="text-center py-10 text-[#2F4A2F]/60 font-bold">
              No hay productos en esta categoría.
            </div>
          )}
        </div>

        <div className="hidden md:block bg-white/40 backdrop-blur-md rounded-[2.5rem] shadow-2xl overflow-hidden border border-white/50">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-[#2F4A2F] text-[#F2E4C9] uppercase text-[10px] tracking-[0.2em]">
                <th className="p-6">Producto</th>
                <th className="p-6">Categoría</th>
                <th className="p-6">Precio</th>
                <th className="p-6">Stock por Variantes</th>
                <th className="p-6 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2F4A2F]/5 text-sm">
              {productosFiltrados.map((prod) => {
                const stockUnico =
                  typeof prod.stock === "object"
                    ? (prod.stock?.Unico ?? prod.stock?.Único ?? 0)
                    : prod.stock || 0;

                return (
                  <tr
                    key={prod.id}
                    className="hover:bg-white/60 transition-colors"
                  >
                    <td className="p-4 flex items-center gap-3">
                      <img
                        src={prod.imagen || "/logo-orilla.png"}
                        className="w-12 h-12 rounded-lg object-cover bg-white"
                      />
                      <span className="font-bold text-[#2F4A2F]">
                        {prod.nombre}
                      </span>
                    </td>
                    {/* 🔥 Agregué la categoría a la tabla para mayor claridad visual */}
                    <td className="p-6 text-[#2F4A2F]/60 font-bold">
                      {prod.categoria || "Mates"}
                    </td>
                    <td className="p-6 text-[#8B5E3C] font-black text-base">
                      ${Number(prod.precio).toLocaleString()}
                    </td>
                    <td className="p-6">
                      <div className="flex flex-wrap gap-2">
                        {prod.colores && prod.colores.length > 0 ? (
                          prod.colores.map((color) => {
                            const cant = prod.stock?.[color] || 0;
                            return (
                              <span
                                key={color}
                                className="px-3 py-1 bg-white/80 border border-[#2F4A2F]/10 rounded-full text-[10px] font-bold shadow-sm"
                              >
                                {color.toUpperCase()}:{" "}
                                <span
                                  className={
                                    cant <= 3
                                      ? "text-red-500"
                                      : "text-[#8B5E3C]"
                                  }
                                >
                                  {cant}
                                </span>
                              </span>
                            );
                          })
                        ) : (
                          <span className="px-3 py-1 bg-white/80 border border-[#2F4A2F]/10 rounded-full text-[10px] font-bold shadow-sm">
                            STOCK:{" "}
                            <span
                              className={
                                stockUnico <= 3
                                  ? "text-red-500"
                                  : "text-[#8B5E3C]"
                              }
                            >
                              {stockUnico}
                            </span>
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="p-6 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleEditClick(prod)}
                          className="bg-[#2F4A2F] text-white p-2.5 rounded-xl hover:bg-[#8B5E3C] shadow-md transition-colors"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(prod.id, prod.nombre)}
                          className="bg-white text-red-500 p-2.5 rounded-xl border border-red-100 hover:bg-red-50 hover:text-red-600 shadow-sm transition-colors"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {productosFiltrados.length === 0 && (
                <tr>
                  <td
                    colSpan="5"
                    className="text-center py-10 text-[#2F4A2F]/60 font-bold"
                  >
                    No hay productos en esta categoría.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {(editingId || isCreating) && (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-0 md:p-4 bg-[#2F4A2F]/60 backdrop-blur-md">
          <div className="bg-[#F2E4C9] w-full max-w-2xl p-6 md:p-8 rounded-t-[2.5rem] md:rounded-[2.5rem] shadow-2xl border border-white animate-in slide-in-from-bottom duration-300">
            <div className="w-12 h-1.5 bg-[#2F4A2F]/10 rounded-full mx-auto mb-4 md:hidden"></div>
            <h2 className="font-belleza text-2xl text-[#2F4A2F] mb-6 flex items-center gap-2 uppercase tracking-tight">
              {isCreating ? "Crear Nuevo Producto" : "Actualizar Producto"}
            </h2>

            <div className="space-y-4 overflow-y-auto max-h-[65vh] px-2 custom-scrollbar">
              <div className="mb-4">
                <label className="text-[10px] uppercase font-black text-[#2F4A2F]/40 mb-2 block">
                  Foto Principal (Portada)
                </label>
                <div className="flex items-center gap-4">
                  <div className="w-24 h-24 rounded-2xl border-2 border-dashed border-[#2F4A2F]/30 bg-white flex items-center justify-center overflow-hidden shrink-0">
                    {imagePreview ? (
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <UploadCloud className="text-[#2F4A2F]/30" size={32} />
                    )}
                  </div>
                  <div className="flex-1">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                      id="file-upload"
                    />
                    <label
                      htmlFor="file-upload"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-white text-[#2F4A2F] border border-[#2F4A2F]/20 rounded-xl font-bold text-sm cursor-pointer hover:bg-black/5 transition-colors shadow-sm"
                    >
                      <UploadCloud size={16} /> Cambiar Portada
                    </label>
                  </div>
                </div>
              </div>

              <div>
                <label className="text-[10px] uppercase font-black text-[#2F4A2F]/40 mb-1 block">
                  Nombre
                </label>
                <input
                  type="text"
                  value={editForm.nombre}
                  onChange={(e) =>
                    setEditForm({ ...editForm, nombre: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-white rounded-xl shadow-inner font-bold text-[#2F4A2F] outline-none focus:ring-2 focus:ring-[#8B5E3C]"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] uppercase font-black text-[#2F4A2F]/40 mb-1 block">
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
                      className="w-full pl-12 pr-4 py-3 bg-white rounded-xl shadow-inner font-bold text-[#2F4A2F] outline-none focus:ring-2 focus:ring-[#8B5E3C]"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] uppercase font-black text-[#2F4A2F]/40 mb-1 block">
                    Categoría
                  </label>
                  <div className="relative">
                    <Tag
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-[#2F4A2F]/30"
                      size={18}
                    />
                    <select
                      value={editForm.categoria}
                      onChange={(e) =>
                        setEditForm({ ...editForm, categoria: e.target.value })
                      }
                      className="w-full pl-12 pr-4 py-3 bg-white rounded-xl shadow-inner font-bold text-[#2F4A2F] outline-none focus:ring-2 focus:ring-[#8B5E3C] appearance-none"
                    >
                      <option value="Mates">Mates</option>
                      <option value="Termos">Termos</option>
                      <option value="Bombillas">Bombillas</option>
                      <option value="Yerbas">Yerbas</option>
                      <option value="Otros">Otros</option>
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <label className="text-[10px] uppercase font-black text-[#2F4A2F]/40 mb-1 block">
                  Descripción
                </label>
                <textarea
                  value={editForm.descripcion}
                  onChange={(e) =>
                    setEditForm({ ...editForm, descripcion: e.target.value })
                  }
                  rows={3}
                  className="w-full px-4 py-3 bg-white rounded-xl shadow-inner font-bold text-[#2F4A2F] outline-none focus:ring-2 focus:ring-[#8B5E3C] resize-y"
                  placeholder="Detalles del producto, materiales, tamaño..."
                />
              </div>

              <div className="bg-white/40 p-4 rounded-2xl border border-white/60 space-y-4">
                <label className="text-[10px] uppercase font-black text-[#2F4A2F]/60 block tracking-wider">
                  Configuración de Color y Stock
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 font-bold text-sm text-[#2F4A2F] cursor-pointer">
                    <input
                      type="radio"
                      name="tipoColor"
                      value="unico"
                      checked={tipoColor === "unico"}
                      onChange={() => setTipoColor("unico")}
                    />
                    Color Único
                  </label>
                  <label className="flex items-center gap-2 font-bold text-sm text-[#2F4A2F] cursor-pointer">
                    <input
                      type="radio"
                      name="tipoColor"
                      value="varios"
                      checked={tipoColor === "varios"}
                      onChange={() => setTipoColor("varios")}
                    />
                    Varios Colores
                  </label>
                </div>

                {tipoColor === "unico" ? (
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <label className="text-[9px] uppercase font-bold text-[#2F4A2F]/40 block w-32">
                        Stock Único
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={
                          editForm.stock.Unico ?? editForm.stock.Único ?? 0
                        }
                        onChange={(e) => {
                          const val = Math.max(0, Number(e.target.value));
                          setEditForm({
                            ...editForm,
                            stock: { Unico: val },
                          });
                        }}
                        className="w-24 px-4 py-2 bg-white rounded-xl shadow-inner font-bold text-[#2F4A2F] outline-none text-center"
                      />
                    </div>
                    <div className="border-t border-black/5 pt-3">
                      <p className="text-[10px] font-bold text-[#2F4A2F]/60 mb-2 uppercase">
                        Fotos Extras (Carrusel)
                      </p>
                      <div className="flex gap-2 flex-wrap items-center">
                        {(editForm.imagenes["Unico"] || []).map((url, i) => (
                          <div key={i} className="relative group">
                            <img
                              src={url}
                              className="w-12 h-12 rounded border object-cover shadow-sm"
                            />
                            <button
                              type="button"
                              onClick={() => handleRemoveColorImage("Unico", i)}
                              className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-4 h-4 text-[10px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <X size={10} />
                            </button>
                          </div>
                        ))}
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleColorImageUpload("Unico", e)}
                          className="hidden"
                          id="upload-Unico"
                        />
                        <label
                          htmlFor="upload-Unico"
                          className="w-12 h-12 rounded border border-dashed border-gray-400 flex items-center justify-center cursor-pointer hover:bg-black/5 transition-colors"
                        >
                          <PlusCircle size={14} className="text-gray-400" />
                        </label>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Ej. negro, rojo, verde..."
                        value={nuevoColor}
                        onChange={(e) => setNuevoColor(e.target.value)}
                        className="flex-1 px-4 py-2 bg-white rounded-xl shadow-inner font-bold text-[#2F4A2F] outline-none"
                        onKeyDown={(e) => e.key === "Enter" && handleAddColor()}
                      />
                      <button
                        type="button"
                        onClick={handleAddColor}
                        className="bg-[#2F4A2F] text-[#F2E4C9] px-4 py-2 rounded-xl font-bold text-xs hover:bg-[#1f331f] transition-colors"
                      >
                        Agregar Color
                      </button>
                    </div>

                    <div className="grid grid-cols-1 gap-3 mt-2 max-h-72 overflow-y-auto pr-1">
                      {editForm.colores.map((color) => (
                        <div
                          key={color}
                          className="flex flex-col bg-white/60 p-4 rounded-xl border border-white gap-3 shadow-sm"
                        >
                          <div className="flex items-center justify-between border-b border-black/5 pb-2">
                            <span className="capitalize text-[#2F4A2F] font-bold flex items-center gap-2 text-sm">
                              <Package size={14} className="text-[#8B5E3C]" />
                              {color}
                            </span>
                            <div className="flex items-center gap-4">
                              <label className="text-[10px] font-bold text-[#2F4A2F]/50">
                                STOCK:
                              </label>
                              <input
                                type="number"
                                min="0"
                                value={editForm.stock[color] || 0}
                                onChange={(e) => {
                                  const val = Math.max(
                                    0,
                                    Number(e.target.value),
                                  );
                                  setEditForm({
                                    ...editForm,
                                    stock: {
                                      ...editForm.stock,
                                      [color]: val,
                                    },
                                  });
                                }}
                                className="w-16 text-center font-black text-[#8B5E3C] bg-white rounded p-1 outline-none shadow-inner"
                              />
                              <button
                                type="button"
                                onClick={() => handleRemoveColor(color)}
                                className="text-red-400 hover:text-red-600 transition-colors ml-2"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </div>

                          <div>
                            <p className="text-[9px] uppercase font-bold text-[#2F4A2F]/40 mb-2">
                              Fotos del Color (Carrusel)
                            </p>
                            <div className="flex gap-2 flex-wrap items-center">
                              {(editForm.imagenes[color] || []).map(
                                (url, i) => (
                                  <div key={i} className="relative group">
                                    <img
                                      src={url}
                                      className="w-12 h-12 rounded border object-cover shadow-sm"
                                    />
                                    <button
                                      type="button"
                                      onClick={() =>
                                        handleRemoveColorImage(color, i)
                                      }
                                      className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-4 h-4 text-[10px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                      <X size={10} />
                                    </button>
                                  </div>
                                ),
                              )}
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) =>
                                  handleColorImageUpload(color, e)
                                }
                                className="hidden"
                                id={`upload-${color}`}
                              />
                              <label
                                htmlFor={`upload-${color}`}
                                className="w-12 h-12 rounded border border-dashed border-[#2F4A2F]/30 flex items-center justify-center cursor-pointer hover:bg-white transition-colors"
                              >
                                <PlusCircle
                                  size={14}
                                  className="text-[#2F4A2F]/40"
                                />
                              </label>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-4 mt-6 pt-4 border-t border-[#2F4A2F]/10">
              <button
                onClick={() => {
                  setEditingId(null);
                  setIsCreating(false);
                  resetForm();
                }}
                disabled={isUploading}
                className="flex-1 py-3 text-[#2F4A2F] font-black text-xs tracking-widest uppercase hover:bg-black/5 rounded-xl transition-colors disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                onClick={handleSave}
                disabled={
                  !editForm.nombre || editForm.precio <= 0 || isUploading
                }
                className="flex-1 flex items-center justify-center gap-2 py-3 bg-[#2F4A2F] text-[#F2E4C9] rounded-xl font-black text-xs tracking-widest shadow-md uppercase disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#1f331f] transition-colors"
              >
                {isUploading ? (
                  <>
                    <Loader2 className="animate-spin" size={16} /> Guardando...
                  </>
                ) : isCreating ? (
                  "Crear Producto"
                ) : (
                  "Guardar Cambios"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
