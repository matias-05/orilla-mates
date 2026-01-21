import { AlertTriangle } from "lucide-react";
import { useCart } from "../../context/CartContext";

export default function AlertaBorrar({
  showConfirm,
  setShowConfirm,
  productToDelete,
  setProductToDelete,
}) {
  const { removeItem } = useCart();

  const handleDelete = () => {
    if (productToDelete) {
      removeItem(productToDelete.id, productToDelete.colorSeleccionado);
      setShowConfirm(false);
      setProductToDelete(null);
    }
  };

  if (!showConfirm) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center px-4 bg-black/60 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="alert-title"
      aria-describedby="alert-desc"
    >
      <div className="bg-[#F2E4C9] p-8 shadow-2xl max-w-sm w-full border-2 border-[#8B5E3C]/20 text-center animate-in fade-in zoom-in duration-300">
        <div className="bg-[#8B5E3C]/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertTriangle
            size={32}
            className="text-[#8B5E3C]"
            aria-hidden="true"
          />
        </div>

        <h3 id="alert-title" className="text-2xl font-bold text-[#2F4A2F] mb-2">
          ¿Eliminar producto?
        </h3>
        <p
          id="alert-desc"
          className="text-[#2F4A2F]/70 mb-8 text-sm leading-relaxed"
        >
          Estás por quitar <strong>{productToDelete?.nombre}</strong> (
          {productToDelete?.colorSeleccionado}) del carrito.
        </p>

        <div className="flex gap-4">
          <button
            onClick={() => setShowConfirm(false)}
            className="cursor-pointer flex-1 py-3 border-2 border-[#2F4A2F]/20 text-[#2F4A2F] font-bold uppercase text-xs tracking-widest hover:bg-[#2F4A2F]/10 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleDelete}
            className="cursor-pointer flex-1 py-3 bg-red-600 text-white font-bold shadow-lg uppercase text-xs tracking-widest hover:bg-red-700 transition-colors"
          >
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
}
