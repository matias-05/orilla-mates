import {  useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { MessageCircle, Check, ShoppingBag, ArrowLeft, Loader2 } from 'lucide-react'; 
import { useCart } from '../../context/CartContext';

const CompraExitosa = () => {
  const { clearCart, cartCount } = useCart();
  const location = useLocation();
  const [isProcessing, setIsProcessing] = useState(false);
  
  const { paymentId, items, total, esEfectivo } = location.state || { 
    paymentId: null, 
    items: [], 
    total: 0,
    esEfectivo: false
  };

  const TELEFONO_DUEÑO = import.meta.env.VITE_TELEFONO_DUENO;


  if (cartCount <= 0) {
    return (
      <div className="h-[calc(100vh-80px)] flex items-center justify-center bg-[#F2E4C9] px-4">
        <div className="max-w-md w-full bg-[#2F4A2F] p-10 text-center shadow-2xl border border-[#E8D6B3]/20">
          <ShoppingBag size={48} className="text-[#E8D6B3] mx-auto mb-6 opacity-50" />
          <h2 className="font-belleza text-[#E8D6B3] text-2xl tracking-widest  mb-4">
            Haz Finalizado tu Compra
          </h2>
          
          <Link 
            to="/#productos" 
            className="inline-flex items-center gap-2 bg-[#E8D6B3] text-[#2F4A2F] px-8 py-4 font-bold text-[10px] tracking-[0.3em] uppercase hover:bg-white transition-colors"
          >
            <ArrowLeft size={14} /> Volver al Inicio
          </Link>
        </div>
      </div>
    );
  }

  const enviarWhatsApp = async () => {
    if (isProcessing) return;
    setIsProcessing(true);

    try {
      if (esEfectivo) {
        const response = await fetch('https://orilla-mates-backend.onrender.com/process_cash_order', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ items: items }) 
        });

        if (!response.ok) {
          throw new Error("Error al procesar el stock");
        }
      }

      const textoBase = `¡Hola Orilla Mates! Acabo de realizar una compra.\n\n`;
      const textoID = `*Orden:* #${paymentId}\n`;
      let detalleItems = `*Detalle:*\n`;
      items.forEach(item => {
        detalleItems += `- ${item.nombre} (${item.colorSeleccionado}) x${item.cantidad}\n`;
      });
      const textoTotal = `\n*Total:* $${total}`;
      const mensajeFinal = encodeURIComponent(textoBase + textoID + detalleItems + textoTotal + `\n\nQuedo a la espera para coordinar. Gracias!`);
      
      window.open(`https://wa.me/${TELEFONO_DUEÑO}?text=${mensajeFinal}`, '_blank');
      
      clearCart();

    } catch (error) {
      console.error("Error al finalizar pedido:", error);
      alert("Hubo un problema al procesar el stock. Por favor, intenta enviar nuevamente.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center bg-[#F2E4C9] px-4 py-12">
      <div className="max-w-md w-full bg-white shadow-2xl p-0 border border-[#2F4A2F]/10">
        
        <div className="bg-[#2F4A2F] p-8 text-center">
          <div className="mx-auto flex items-center justify-center h-16 w-16 bg-[#E8D6B3]/10 border border-[#E8D6B3]/30 mb-6">
            <Check className="h-8 w-8 text-[#E8D6B3]" strokeWidth={3} />
          </div>
          <h2 className="font-belleza text-3xl text-[#E8D6B3] tracking-[0.2em] mb-2">
            ¡Muchas Gracias!
          </h2>
          <p className="text-[#E8D6B3]/60 text-[10px] tracking-[0.2em] uppercase">
            Pedido realizado con éxito
          </p>
        </div>

        <div className="p-8">
          <p className="text-[#2F4A2F] text-l text-center mb-8 leading-relaxed tracking-wider">
            Para finalizar su pedido, <br />
            por favor envíe el ticket por WhatsApp
          </p>

          <button 
            onClick={enviarWhatsApp}
            disabled={isProcessing}
            className={`cursor-pointer w-full bg-[#25D366] hover:bg-[#1eb956] text-white font-bold py-5 px-6 transition-all duration-300 flex items-center justify-center gap-3 shadow-lg active:scale-95 mb-8 ${isProcessing ? 'opacity-70' : ''}`}
          >
            {isProcessing ? (
              <Loader2 className="animate-spin" size={22} />
            ) : (
              <MessageCircle size={22} />
            )}
            <span className="text-[11px] tracking-[0.2em]">
              {isProcessing ? 'PROCESANDO...' : 'Enviar Ticket'}
            </span>
          </button>

          <div className="bg-[#F8F5F0] p-6 border-l-4 border-[#2F4A2F]">
            <p className="text-[9px] uppercase tracking-[0.3em] text-[#2F4A2F]/40 mb-4 font-black">
              Resumen de la Orden {paymentId ? `#${paymentId.toString().slice(-6)}` : ''}
            </p>
            
            <div className="space-y-3 mb-4">
              {items.map((item, index) => (
                <div key={index} className="flex justify-between items-start">
                  <p className="text-[11px] text-[#2F4A2F] uppercase tracking-wide">
                    <span className="font-bold">{item.cantidad}x</span> {item.nombre} 
                    <span className="block text-[9px] opacity-50">{item.colorSeleccionado}</span>
                  </p>
                  <p className="text-[11px] font-bold text-[#2F4A2F]">
                    ${(item.precio * item.cantidad).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>

            <div className="border-t border-[#2F4A2F]/10 mt-4 pt-4 flex justify-between items-center">
              <span className="font-belleza text-lg text-[#2F4A2F] tracking-widest uppercase">Total</span>
              <span className="text-xl font-bold text-[#2F4A2F] font-belleza">
                ${total.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompraExitosa;