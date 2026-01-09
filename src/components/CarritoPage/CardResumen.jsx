import { CreditCard, Banknote } from 'lucide-react';
import {  useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useState } from 'react';
export default function CardResumen() {

    const { cart } = useCart();
    const navigate = useNavigate();
    const envio = 0; 
    const subtotal = cart.reduce((acc, item) => acc + (item.precio * item.cantidad), 0);
    const totalFinal = subtotal + envio;
    const [metodoPago, setMetodoPago] = useState('mercadopago'); 

    const handleFinalizarPedido = () => {
    if (metodoPago === 'mercadopago') {
        navigate('/checkout');
    } else {
        const datosParaTicket = {
            paymentId: `EF-${Math.floor(Math.random() * 100000)}`, 
            items: [...cart],
            total: totalFinal,
            esEfectivo: true 
        };
        navigate('/compra-exitosa', { state: datosParaTicket });
    }
};


    return (
    <div className="bg-[#2F4A2F] p-8  text-[#F2E4C9] shadow-2xl sticky top-24">
            <h3 className="font-belleza text-3xl mb-8 border-b border-white/10 pb-4">Resumen</h3>
            
            <div className="mb-8 space-y-3">
                <p className="text-[10px] uppercase font-bold tracking-widest opacity-60 mb-4">Elegí cómo pagar</p>
                <button 
                    onClick={() => setMetodoPago('mercadopago')}
                    className={`cursor-pointer w-full flex items-center gap-3 p-4  border-2 transition-all ${metodoPago === 'mercadopago' ? 'border-[#E8D6B3] bg-white/10' : 'border-white/10 hover:border-white/30'}`}
                >
                    <CreditCard size={18} />
                    <span className="text-sm font-bold">Mercado Pago / Tarjeta</span>
                </button>
                <button 
                    onClick={() => setMetodoPago('efectivo')}
                    className={`cursor-pointer w-full flex items-center gap-3 p-4  border-2 transition-all ${metodoPago === 'efectivo' ? 'border-[#E8D6B3] bg-white/10' : 'border-white/10 hover:border-white/30'}`}
                >
                    <Banknote size={18} />
                    <span className="text-sm font-bold">Efectivo</span>
                </button>
            </div>

            <div className="space-y-4 mb-8">
              <div className="flex justify-between opacity-80">
                <span>Subtotal</span>
                <span>${subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between opacity-80">
                <span>Envío (Paraná)</span>
                <span className="text-green-400 uppercase text-xs font-bold self-center">Gratis</span>
              </div>
              <div className="h-px bg-white/10 my-4"></div>
              <div className="flex justify-between items-end">
                <span className="text-2xl font-medium">Total</span>
                <span className="text-2xl font-medium text-[#E8D6B3]">${totalFinal.toLocaleString()}</span>
              </div>
            </div>

            <button 
                onClick={handleFinalizarPedido}
                className="cursor-pointer w-full bg-[#8B5E3C] hover:bg-[#a67148] text-[#F2E4C9] py-4  tracking-[0.2em] transition-all shadow-lg active:scale-95"
            >
                Finalizar Compra
            </button>

            
          </div>
        
    );
}