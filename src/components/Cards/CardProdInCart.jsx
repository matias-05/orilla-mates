import { Trash2, Plus, Minus } from "lucide-react";
import { useCart } from "../../context/CartContext";

export default function CardProdInCart({
  item,
  setProductToDelete,
  setShowConfirm,
}) {
  const { updateQuantity } = useCart();

  const getColorBackground = (color) => {
    if (!color) return "transparent";
    const lowerColor = color.toLowerCase();
    const colors = {
      negro: "black",
      borravino: "#4A0E0E",
      marron: "#5C3D2E",
    };
    return colors[lowerColor] || "#5C3D2E";
  };

  const handleConfirm = () => {
    setProductToDelete(item);
    setShowConfirm(true);
  };

  return (
    <div className="bg-[#2F4A2F] backdrop-blur-sm p-4 md:p-6 shadow-sm flex gap-4 md:gap-6 items-center border-b border-[#E8D6B3]/10">
      <div className="w-24 h-24 md:w-32 md:h-32 overflow-hidden shrink-0 flex items-center justify-center">
        <img
          src={item.imagen}
          alt={item.nombre}
          className="w-50 h-50 object-contain"
        />
      </div>

      <div className="flex-grow">
        <h3 className="font-belleza text-xl md:text-2xl text-[#E8D6B3] leading-tight tracking-wide">
          {item.nombre}
        </h3>

        {item.colorSeleccionado && (
          <div className="flex items-center gap-2 mt-1 mb-2">
            <div
              className="w-3 h-3 border rounded-full border-black/10 shadow-sm"
              style={{
                backgroundColor: getColorBackground(item.colorSeleccionado),
              }}
            ></div>
            <span className="text-[14px] font-bold tracking-widest text-[#E8D6B3]/80 ">
              {item.colorSeleccionado}
            </span>
          </div>
        )}

        <p className="text-[#E8D6B3] text-lg mt-1 tracking-widest font-belleza">
          ${(item.precio * item.cantidad).toLocaleString()}
        </p>

        <div className="flex items-center gap-3 mt-4 md:hidden">
          <div className="flex items-center border border-[#2F4A2F]/20 bg-[#F2E4C9] shadow-inner overflow-hidden">
            <button
              onClick={() =>
                updateQuantity(item.id, item.colorSeleccionado, -1)
              }
              className="p-2 hover:bg-[#8B5E3C]/10 transition-colors"
            >
              <Minus size={16} />
            </button>
            <span className="px-3 font-bold text-[#2F4A2F] min-w-[30px] text-center">
              {item.cantidad}
            </span>
            <button
              onClick={() => updateQuantity(item.id, item.colorSeleccionado, 1)}
              disabled={item.cantidad >= item.stock}
              className={`p-2 hover:bg-[#8B5E3C]/10 transition-colors ${
                item.cantidad >= item.stock ? "opacity-20" : ""
              }`}
            >
              <Plus size={16} />
            </button>
          </div>
          <button
            onClick={handleConfirm}
            className="flex items-center justify-center bg-[#F2E4C9] text-red-600 p-2 border border-[#2F4A2F]/20 shadow-md active:scale-90 transition-transform"
          >
            <Trash2 size={20} />
          </button>
        </div>
      </div>

      <div className="hidden md:flex flex-col items-center gap-4">
        <div className="flex items-center border border-[#2F4A2F]/20 bg-[#F2E4C9] shadow-inner overflow-hidden">
          <button
            onClick={() => updateQuantity(item.id, item.colorSeleccionado, -1)}
            className="cursor-pointer p-3 hover:bg-[#2F4A2F] hover:text-[#F2E4C9] transition-all duration-300"
          >
            <Minus size={18} />
          </button>
          <span className="px-4 font-bold text-lg min-w-[3.5rem] text-center text-[#2F4A2F] border-x border-[#2F4A2F]/10">
            {item.cantidad}
          </span>
          <button
            onClick={() => updateQuantity(item.id, item.colorSeleccionado, 1)}
            className="cursor-pointer p-3 hover:bg-[#2F4A2F] hover:text-[#F2E4C9] transition-all duration-300"
          >
            <Plus size={18} />
          </button>
        </div>

        <button
          onClick={handleConfirm}
          className="flex items-center gap-2 text-red-500 hover:bg-red-500 hover:text-white text-xs uppercase tracking-widest font-bold transition-all duration-300 cursor-pointer shadow-md px-4 py-2 bg-[#F2E4C9] border border-[#2F4A2F]/20"
        >
          Eliminar <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
}
