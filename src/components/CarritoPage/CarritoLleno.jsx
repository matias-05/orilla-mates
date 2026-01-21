import { useState } from "react";
import { ChevronLeft } from "lucide-react";
import { NavLink } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import AlertaBorrar from "./AlertaBorrar";
import CardResumen from "../Cards/CardResumen";
import CardProdInCart from "../Cards/CardProdInCart";

export default function CarritoLleno() {
  const { cart } = useCart();
  const [showConfirm, setShowConfirm] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  return (
    <section className="bg-[#F2E4C9] min-h-[calc(100dvh-80px)] font-quicksand py-8 md:py-16 px-4 md:px-12 relative">
      <AlertaBorrar
        showConfirm={showConfirm}
        setShowConfirm={setShowConfirm}
        productToDelete={productToDelete}
        setProductToDelete={setProductToDelete}
      />

      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-10">
          <h1 className="font-belleza text-4xl md:text-5xl text-[#2F4A2F]">
            Mi Carrito
          </h1>
          <NavLink
            to="/productos/mates"
            aria-label="Volver al catálogo de productos"
            className="flex items-center gap-2 text-[#2F4A2F]/60 hover:text-[#2F4A2F] transition-colors text-sm font-medium"
          >
            <ChevronLeft
              size={18}
              className="cursor-pointer"
              aria-hidden="true"
            />{" "}
            Continuar comprando
          </NavLink>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item) => (
              <CardProdInCart
                key={`${item.id}-${item.colorSeleccionado}`}
                item={item}
                setProductToDelete={setProductToDelete}
                setShowConfirm={setShowConfirm}
              />
            ))}
          </div>
          <CardResumen />
        </div>
      </div>
    </section>
  );
}
