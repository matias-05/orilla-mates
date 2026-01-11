import { CreditCard, Banknote, MapPin, Truck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { useState } from "react";

export default function CardResumen() {
  const { cart } = useCart();
  const navigate = useNavigate();

  const [metodoPago, setMetodoPago] = useState("mercadopago");
  const [metodoEntrega, setMetodoEntrega] = useState("retiro");

  const subtotal = cart.reduce(
    (acc, item) => acc + item.precio * item.cantidad,
    0
  );

  const costoEnvio = metodoEntrega === "envio" ? 0 : 0;
  const totalFinal = subtotal + costoEnvio;

  const handleFinalizarPedido = () => {
    const datosPedido = {
      items: [...cart],
      total: totalFinal,
      metodoEntrega: metodoEntrega,
      metodoPago: metodoPago,
    };

    if (metodoPago === "mercadopago") {
      navigate("/checkout", { state: datosPedido });
    } else {
      const datosParaTicket = {
        ...datosPedido,
        paymentId: `EF-${Math.floor(Math.random() * 100000)}`,
        esEfectivo: true,
      };
      navigate("/compra-exitosa", { state: datosParaTicket });
    }
  };

  return (
    <div className="bg-[#2F4A2F] p-8 text-[#F2E4C9] shadow-2xl sticky top-24 border border-white/5">
      <h3 className="font-belleza text-3xl mb-8 border-b border-white/10 pb-4">
        Resumen
      </h3>

      <div className="mb-8">
        <p className="text-[10px] uppercase font-bold tracking-widest opacity-60 mb-4">
          ¿Cómo recibís tu pedido?
        </p>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => setMetodoEntrega("retiro")}
            className={`cursor-pointer flex flex-col items-center gap-2 p-3 border-2 transition-all ${
              metodoEntrega === "retiro"
                ? "border-[#E8D6B3] bg-white/10"
                : "border-white/10 hover:border-white/30"
            }`}
          >
            <MapPin size={18} />
            <span className="text-sm font-bold  tracking-tighter">
              Retiro Local
            </span>
          </button>
          <button
            onClick={() => setMetodoEntrega("envio")}
            className={`cursor-pointer flex flex-col items-center gap-2 p-3 border-2 transition-all ${
              metodoEntrega === "envio"
                ? "border-[#E8D6B3] bg-white/10"
                : "border-white/10 hover:border-white/30"
            }`}
          >
            <Truck size={18} />
            <span className="text-sm font-bold  tracking-tighter">Envío</span>
          </button>
        </div>
      </div>

      <div className="mb-8">
        <p className="text-[10px] uppercase font-bold tracking-widest opacity-60 mb-4">
          Elegí cómo pagar
        </p>
        <div className="space-y-3">
          <button
            onClick={() => setMetodoPago("mercadopago")}
            className={`cursor-pointer w-full flex items-center gap-3 p-4 border-2 transition-all ${
              metodoPago === "mercadopago"
                ? "border-[#E8D6B3] bg-white/10"
                : "border-white/10 hover:border-white/30"
            }`}
          >
            <CreditCard size={18} />
            <span className="text-sm font-bold text-left">
              Mercado Pago / Tarjeta
            </span>
          </button>
          <button
            onClick={() => setMetodoPago("efectivo")}
            className={`cursor-pointer w-full flex items-center gap-3 p-4 border-2 transition-all ${
              metodoPago === "efectivo"
                ? "border-[#E8D6B3] bg-white/10"
                : "border-white/10 hover:border-white/30"
            }`}
          >
            <Banknote size={18} />
            <span className="text-sm font-bold text-left">Efectivo</span>
          </button>
        </div>
      </div>

      <div className="space-y-4 mb-8">
        <div className="flex justify-between opacity-80 text-sm">
          <span>Subtotal</span>
          <span>${subtotal.toLocaleString()}</span>
        </div>
        <div className="flex justify-between opacity-80 text-sm">
          <span>
            {metodoEntrega === "retiro"
              ? "Retiro en Local"
              : "Envío a Domicilio"}
          </span>
          <span>${costoEnvio.toLocaleString()}</span>
        </div>
        <div className="h-px bg-white/10 my-4"></div>
        <div className="flex justify-between items-end">
          <span className="text-2xl font-bold font-belleza tracking-widest ">
            Total
          </span>
          <span className="text-2xl font-bold text-[#E8D6B3] font-belleza">
            ${totalFinal.toLocaleString()}
          </span>
        </div>
      </div>

      <button
        onClick={handleFinalizarPedido}
        className=" cursor-pointer w-full text-[16px] bg-[#8B5E3C] hover:bg-[#a67148] text-[#F2E4C9]  py-5 font-medium tracking-[0.3em] transition-all shadow-lg active:scale-95"
      >
        Finalizar Compra
      </button>
    </div>
  );
}
