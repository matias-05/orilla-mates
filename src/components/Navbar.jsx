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
    { name: "Inicio", to: "/#inicio", id: "inicio" },
    { name: "Productos", to: "/#productos", id: "productos" },
    { name: "Nosotros", to: "/#sobre-nosotros", id: "sobre-nosotros" },
    { name: "Contacto", to: "/#contacto", id: "contacto" },
  ];

  const toggleMenu = () => setIsOpen(!isOpen);

  useEffect(() => {
    if (location.pathname !== "/") {
      setActiveHash("");
      return;
    }

    let observer;
    let retryCount = 0;
    const maxRetries = 50;

    const connectObserver = () => {
      const sections = navLinks.map((link) => document.getElementById(link.id));
      const foundAny = sections.some((el) => el !== null);

      if (!foundAny) {
        if (retryCount < maxRetries) {
          retryCount++;
          setTimeout(connectObserver, 100);
        }
        return;
      }

      const observerOptions = {
        root: null,
        rootMargin: "-40% 0px -40% 0px",
        threshold: 0,
      };

      const observerCallback = (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveHash(`#${entry.target.id}`);
          }
        });
      };

      observer = new IntersectionObserver(observerCallback, observerOptions);

      sections.forEach((el) => {
        if (el) observer.observe(el);
      });
    };

    connectObserver();

    return () => {
      if (observer) observer.disconnect();
    };
  }, [location.pathname]);

  const checkIsActive = (link) => {
    const { pathname } = location;
    if (link.name === "Productos" && pathname.startsWith("/productos"))
      return true;
    if (pathname === "/") return activeHash === `#${link.id}`;
    return false;
  };

  return (
    <nav className="sticky top-0 bg-[#2F4A2F] h-[80px] w-full flex items-center justify-between px-6 md:px-12 z-[100] font-quicksand shadow-md">
      <style>{`
        @keyframes fadeInDown {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .nav-animate {
          opacity: 0;
          animation: fadeInDown 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>

      <div
        className="relative w-24 h-full flex items-center nav-animate"
        style={{ animationDelay: "0s" }}
      >
        <HashLink smooth to="/#inicio" aria-label="Volver al inicio">
          <img
            src="/logo-orilla.webp"
            alt="Logo Orilla Mates"
            width="96"
            height="96"
            className="absolute top-1/2 -translate-y-1/2 -translate-x-1/3 left-0 h-20 w-20 lg:w-24 lg:h-24 min-w-[112px] object-contain drop-shadow-xl hover:scale-105 transition-transform"
          />
        </HashLink>
      </div>

      <div className="hidden md:flex items-center gap-8 text-[#E8D6B3] text-sm tracking-widest font-medium">
        {navLinks.map((link, index) => {
          const isActive = checkIsActive(link);
          const delay = `${0.1 + index * 0.1}s`;

          return (
            <HashLink
              key={link.name}
              smooth
              to={link.to}
              className={`relative py-1 transition-colors group nav-animate ${
                isActive ? "text-[#F2E4C9] font-bold" : "hover:text-[#F2E4C9]"
              }`}
              style={{ animationDelay: delay }}
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

      <div
        className="flex items-center gap-4 md:gap-6 text-[#E8D6B3] nav-animate"
        style={{ animationDelay: "0.5s" }}
      >
        <div className="relative cursor-pointer hover:scale-110 transition-transform">
          <HashLink
            to="/carrito"
            aria-label={`Ver carrito, ${cartCount} items`}
          >
            <ShoppingCart size={22} aria-hidden="true" />
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
          aria-label={isOpen ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={isOpen}
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
                isActive ? "text-white font-bold" : "hover:text-white"
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
