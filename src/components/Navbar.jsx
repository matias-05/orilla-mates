import { User, ShoppingCart } from 'lucide-react';
import { HashLink } from 'react-router-hash-link';

export default function Navbar() {
  return (
    <nav className="sticky top-0 bg-[#2F4A2F] text-[#E8D6B3] px-8 h-20 flex items-center justify-between shadow-md font-quicksand z-50">
      <div className="relative w-24 h-full flex items-center">
        <HashLink smooth to="/#inicio">
          <img 
            src="/logo-orilla.png" 
            alt="Orilla Mates Logo" 
            className="absolute top-1/2 -translate-y-1/2 left-0 h-24 w-24 min-w-[112px] object-contain drop-shadow-xl hover:scale-105 transition-transform"
          />
        </HashLink>
      </div>

      <div className="hidden md:flex items-center gap-10 text-sm tracking-[0.2em] font-medium ">
        <HashLink smooth border to="/#inicio" className="hover:text-white transition-colors">Inicio</HashLink>
        <HashLink smooth to="/#productos" className="hover:text-white transition-colors">Productos</HashLink>
        <HashLink smooth to="/#sobre-nosotros" className="hover:text-white transition-colors">Sobre nosotros</HashLink>
        <HashLink smooth to="/#contacto" className="hover:text-white transition-colors">Contacto</HashLink>
      </div>

      <div className="flex items-center gap-6">
        <User size={22} className="cursor-pointer hover:scale-110 transition-transform" />
        <div className="relative cursor-pointer hover:scale-110 transition-transform">
          <ShoppingCart size={22} />
          <span className="absolute -top-2 -right-2 bg-orange-700 text-[10px] rounded-full h-4 w-4 flex items-center justify-center text-white">0</span>
        </div>
      </div>
    </nav>
  );
}