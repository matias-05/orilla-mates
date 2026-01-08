import { NavLink } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';

export default function CarritoVacio() {
  return (

    <section className="bg-[#F2E4C9] min-h-[calc(100dvh-80px)] flex flex-col items-center justify-center p-6 text-center font-quicksand">
        <div className="bg-white/50 p-12 rounded-3xl shadow-xl border border-[#2F4A2F]/10 flex flex-col items-center">
          <ShoppingBag size={80} className="text-[#2F4A2F]/20 mb-6" />
          <h2 className="font-belleza text-3xl text-[#2F4A2F] mb-4">Tu carrito está vacío</h2>
          <p className="text-[#2F4A2F]/60 mb-8 max-w-xs">Parece que aún no has elegido tu próximo compañero de mate.</p>
          <NavLink 
            to="/productos/mates" 
            className="bg-[#2F4A2F] text-[#F2E4C9] px-8 py-3 rounded-full font-bold uppercase tracking-widest hover:bg-[#8B5E3C] transition-all"
          >
            Ver Productos
          </NavLink>
        </div>
      </section>

  );
}