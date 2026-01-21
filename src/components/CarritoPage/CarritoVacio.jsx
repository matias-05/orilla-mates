import { NavLink } from "react-router-dom";
import { ShoppingBag } from "lucide-react";

export default function CarritoVacio() {
  return (
    <section className="bg-[#F2E4C9] min-h-[calc(100dvh-80px)] flex flex-col items-center justify-center p-6 text-center font-quicksand">
      <div className="bg-[#2F4A2F] p-12 shadow-xl border border-[#2F4A2F]/10 flex flex-col items-center translate-y-0 hover:-translate-y-1 transition-all duration-500">
        <ShoppingBag
          size={80}
          className="text-[#E8D6B3] mb-6"
          aria-hidden="true"
        />
        <h2 className=" text-3xl font-bold text-[#E8D6B3] mb-4">
          Tu carrito está vacío
        </h2>
        <p className="text-[#E8D6B3] mb-8 max-w-xs">
          Parece que aún no has elegido tu próximo compañero de mate.
        </p>
        <NavLink
          to="/productos/mates"
          className="bg-[#8B5E3C] text-[#F2E4C9] px-8 py-3  font-medium  tracking-widest hover:bg-[#8B5E3C] translate-y-0 hover:-translate-y-1 transition-all duration-500"
        >
          Ver Productos
        </NavLink>
      </div>
    </section>
  );
}
