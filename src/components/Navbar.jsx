import { useState } from 'react';
import { HashLink } from 'react-router-hash-link';
import { Menu, X, ShoppingCart } from 'lucide-react';


export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  const navLinks = [
    { name: 'Inicio', to: '/#inicio' },
    { name: 'Productos', to: '/#productos' },
    { name: 'Sobre nosotros', to: '/#sobre-nosotros' },
    { name: 'Contacto', to: '/#contacto' },
  ];

  return (
    <nav className="sticky top-0 bg-[#2F4A2F] h-[80px] w-full flex items-center justify-between px-6 md:px-12 z-[100] font-quicksand shadow-md">
      
      <div className="relative w-24 h-full flex items-center">
        <HashLink smooth to="/#inicio">
          <img 
            src="/logo-orilla.webp" 
            alt="Orilla Mates Logo" 
            className="absolute top-1/2 -translate-y-1/2 left-0 h-24 w-24 min-w-[112px] object-contain drop-shadow-xl hover:scale-105 transition-transform"
          />
        </HashLink>
      </div>

      <div className="hidden md:flex items-center gap-8 text-[#E8D6B3] text-sm  tracking-widest font-medium">
        {navLinks.map((link) => (
          <HashLink 
            key={link.name} 
            smooth 
            to={link.to} 
            className="hover:text-white transition-colors"
          >
            {link.name}
          </HashLink>
        ))}
      </div>

      <div className="flex items-center gap-4 md:gap-6 text-[#E8D6B3]">
        
        <div className="relative cursor-pointer hover:scale-110 transition-transform">
          
          <ShoppingCart size={22} />
          <span className="absolute -top-2 -right-2 bg-orange-700 text-[10px] rounded-full h-4 w-4 flex items-center justify-center text-white font-bold">
            0
          </span>
        </div>


        <button onClick={toggleMenu} className="md:hidden focus:outline-none ml-2">
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>


      <div className={`
        absolute top-[80px] left-0 w-full bg-[#2F4A2F] text-[#E8D6B3] flex flex-col items-center gap-8 py-10 transition-all duration-300 ease-in-out md:hidden shadow-xl
        ${isOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-5'}
      `}>
        {navLinks.map((link) => (
          <HashLink 
            key={link.name} 
            smooth 
            to={link.to} 
            onClick={() => setIsOpen(false)} 
            className="text-lg uppercase tracking-[0.2em] font-light hover:text-white"
          >
            {link.name}
          </HashLink>
        ))}
      </div>
    </nav>
  );
}