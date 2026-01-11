import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { HashLink } from "react-router-hash-link";
import { ShoppingCart, Menu, X } from "lucide-react";
import { useCart } from "../context/CartContext";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const [activeHash, setActiveHash] = useState("#inicio");

  const { cart } = useCart();
  const cartCount = cart.reduce((acc, item) => acc + item.cantidad, 0);

  const navLinks = [
    { name: "Inicio", to: "/#inicio" },
    { name: "Productos", to: "/#productos" },
    { name: "Nosotros", to: "/#sobre-nosotros" },
    { name: "Contacto", to: "/#contacto" },
  ];

  const toggleMenu = () => setIsOpen(!isOpen);

  useEffect(() => {
    if (location.hash) {
      setActiveHash(location.hash);
    } else {
      setActiveHash("#inicio");
    }
  }, [location]);

  const checkIsActive = (link) => {
    const { pathname, hash } = location;
    const currentHash = hash || "#inicio";

    if (link.name === "Productos") {
      return currentHash === "#productos" || pathname.startsWith("/productos");
    }

    if (link.name === "Inicio") {
      return pathname === "/" && currentHash === "#inicio";
    }

    return currentHash === link.to.replace("/", "");
  };

  return (
    <nav className="sticky top-0 bg-[#2F4A2F] h-[80px] w-full flex items-center justify-between px-6 md:px-12 z-[100] font-quicksand shadow-md">
      <div className="relative w-24 h-full flex items-center">
        <HashLink smooth to="/#inicio">
          <img
            src="/logo-orilla.webp"
            alt="Logo Orilla Mates"
            className="absolute top-1/2 -translate-y-1/2 -translate-x-1/3  left-0 h-20 w-20 lg:w-24 lg:h-24 min-w-[112px] object-contain drop-shadow-xl hover:scale-105 transition-transform"
          />
        </HashLink>
      </div>

      <div className="hidden md:flex items-center gap-8 text-[#E8D6B3] text-sm tracking-widest font-medium">
        {navLinks.map((link) => {
          const isActive = checkIsActive(link);

          return (
            <HashLink
              key={link.name}
              smooth
              to={link.to}
              className={`relative py-1 transition-colors group ${
                isActive ? "text-[#F2E4C9]" : "hover:text-[#F2E4C9]"
              }`}
            >
              {link.name}
              <span
                className={`absolute bottom-0 left-0 h-[1px] bg-[#E8D6B3] transition-transform duration-300 ease-out 
                ${
                  isActive
                    ? "w-full scale-x-100"
                    : "w-full scale-x-0 origin-left group-hover:scale-x-100"
                }`}
              />
            </HashLink>
          );
        })}
      </div>

      <div className="flex items-center gap-4 md:gap-6 text-[#E8D6B3]">
        <div className="relative cursor-pointer hover:scale-110 transition-transform">
          <HashLink to="/carrito">
            <ShoppingCart size={22} />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-[#8B5E3C] text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full animate-in fade-in zoom-in">
                {cartCount}
              </span>
            )}
          </HashLink>
        </div>

        <button
          onClick={toggleMenu}
          className="md:hidden focus:outline-none ml-2"
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      <div
        className={`
        absolute top-[80px] left-0 w-full bg-[#2F4A2F] text-[#E8D6B3] flex flex-col items-center gap-8 py-10 transition-all duration-300 ease-in-out md:hidden shadow-xl
        ${
          isOpen
            ? "opacity-100 visible translate-y-0"
            : "opacity-0 invisible -translate-y-5"
        }
      `}
      >
        {navLinks.map((link) => {
          const isActive = checkIsActive(link);

          return (
            <HashLink
              key={link.name}
              smooth
              to={link.to}
              onClick={() => setIsOpen(false)}
              className={`relative text-lg tracking-[0.2em] font-light group ${
                isActive ? "text-white font-medium" : "hover:text-white"
              }`}
            >
              {link.name}
              <span
                className={`absolute -bottom-1 h-[1px] bg-[#E8D6B3] transition-all duration-300 ease-out 
                ${
                  isActive
                    ? "w-full left-0"
                    : "w-0 left-1/2 group-hover:w-full group-hover:left-0"
                }`}
              />
            </HashLink>
          );
        })}
      </div>
    </nav>
  );
}
