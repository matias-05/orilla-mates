import { Link, useLocation } from 'react-router-dom';
import { MessageCircle } from 'lucide-react'; 

const CompraExitosa = () => {
  const location = useLocation();
  const { paymentId, items, total } = location.state || { 
    paymentId: 'N/A', 
    items: [], 
    total: 0 
  };

  const TELEFONO_DUEÑO = import.meta.env.VITE_TELEFONO_DUENO;


  const enviarWhatsApp = () => {
    const textoBase = `¡Hola Orilla Mates! 👋 Acabo de realizar una compra.\n\n`;
    const textoID = `*Orden:* #${paymentId}\n`;

    let detalleItems = `*Detalle:*\n`;
    items.forEach(item => {
      detalleItems += `- ${item.nombre} (${item.colorSeleccionado}) x${item.cantidad}\n`;
    });

    const textoTotal = `\n*Total:* $${total}`;
    const textoCierre = `\n\nQuedo a la espera para coordinar el envío. Gracias!`;

    const mensajeFinal = encodeURIComponent(textoBase + textoID + detalleItems + textoTotal + textoCierre);
    
    window.open(`https://wa.me/${TELEFONO_DUEÑO}?text=${mensajeFinal}`, '_blank');
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-[#fcf9f5] px-4 py-10">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center border border-gray-100">
        
        <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-green-100 mb-6">
          <svg className="h-10 w-10 text-[#2F4A2F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h2 className="text-3xl font-bold text-[#2F4A2F] mb-2 font-serif">¡Muchas Gracias!</h2>
        <p className="text-gray-600 mb-6">Tu pedido ha sido procesado con éxito.</p>

        <button 
          onClick={enviarWhatsApp}
          className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white font-bold py-4 px-6 rounded-xl transition duration-300 flex items-center justify-center gap-3 shadow-lg mb-4"
        >
          <MessageCircle size={24} />
          Enviar Comprobante por WhatsApp
        </button>

        <div className="bg-gray-50 rounded-lg p-4 mb-6 border border-gray-100 text-left">
          <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-2 font-bold">Resumen de compra</p>
          {items.map((item, index) => (
            <p key={index} className="text-sm text-gray-700">
              {item.cantidad}x {item.nombre} <span className="text-gray-400">({item.colorSeleccionado})</span>
            </p>
          ))}
          <p className="border-t border-gray-200 mt-2 pt-2 font-bold text-[#2F4A2F]">
            Total: ${total}
          </p>
        </div>

        <Link 
          to="/" 
          className="text-[#2F4A2F] font-semibold hover:underline text-sm"
        >
          Volver a la tienda
        </Link>
      </div>
    </div>
  );
};

export default CompraExitosa;