import { useState } from 'react';
import { Trash2, Plus, Minus, ChevronLeft, AlertTriangle, CreditCard, Banknote } from 'lucide-react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';

export default function CarritoLleno() {
    const { cart, updateQuantity, removeItem, clearCart } = useCart();
    const navigate = useNavigate();
  
    const [showConfirm, setShowConfirm] = useState(false);
    const [productToDelete, setProductToDelete] = useState(null);
    const [metodoPago, setMetodoPago] = useState('mercadopago'); 

    const subtotal = cart.reduce((acc, item) => acc + (item.precio * item.cantidad), 0);
    const envio = 0; 
    const totalFinal = subtotal + envio;

    const getColorBackground = (color) => {
        if (!color) return 'transparent';
        const lowerColor = color.toLowerCase();
        if (lowerColor === 'negro') return 'black';
        if (lowerColor === 'borravino') return '#4A0E0E';
        if (lowerColor === 'marron' || lowerColor === 'marrón') return '#5C3D2E';
        if (lowerColor === 'crema') return '#F2E4C9';
        return '#5C3D2E';
    };

    const confirmDelete = (item) => {
        setProductToDelete(item);
        setShowConfirm(true);
    };

    const handleDelete = () => {
        removeItem(productToDelete.id, productToDelete.colorSeleccionado);
        setShowConfirm(false);
        setProductToDelete(null);
    };

    const handleFinalizarPedido = async () => {
    if (metodoPago === 'mercadopago') {
        navigate('/checkout');
    } else {
        try {
              const response = await fetch('https://orilla-mates-backend.onrender.com/process_cash_order', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ items: cart })
              });

              if (!response.ok) {
                  const errorData = await response.json();
                  alert(`Error: ${errorData.error}`); 
                  return;
              }

              const datosParaTicket = {
                  paymentId: `EF-${Math.floor(Math.random() * 100000)}`, 
                  items: [...cart],
                  total: totalFinal,
                  esEfectivo: true
              };

              clearCart();
              navigate('/success', { state: datosParaTicket });

          } catch (error) {
              console.error("Error al procesar pedido en efectivo:", error);
              alert("Hubo un problema al procesar tu pedido. Reintentá en unos momentos.");
          }
      }
  };
    
    return (
        <section className="bg-[#F2E4C9] min-h-[calc(100dvh-80px)] font-quicksand py-8 md:py-16 px-4 md:px-12 relative">
      
      {showConfirm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-[#F2E4C9] p-8 rounded-3xl shadow-2xl max-w-sm w-full border-2 border-[#8B5E3C]/20 text-center animate-in fade-in zoom-in duration-300">
            <div className="bg-[#8B5E3C]/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle size={32} className="text-[#8B5E3C]" />
            </div>
            <h3 className="font-belleza text-2xl text-[#2F4A2F] mb-2">¿Eliminar producto?</h3>
            <p className="text-[#2F4A2F]/70 mb-8 text-sm leading-relaxed">
              Estás por quitar <strong>{productToDelete?.nombre}</strong> ({productToDelete?.colorSeleccionado}) del carrito.
            </p>
            <div className="flex gap-4">
              <button onClick={() => setShowConfirm(false)} className="cursor-pointer flex-1 py-3 rounded-xl border-2 border-[#2F4A2F]/20 text-[#2F4A2F] font-bold uppercase text-xs tracking-widest">Cancelar</button>
              <button onClick={handleDelete} className="cursor-pointer flex-1 py-3 rounded-xl bg-red-600 text-white font-bold shadow-lg uppercase text-xs tracking-widest">Eliminar</button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-10">
          <h1 className="font-belleza text-4xl md:text-5xl text-[#2F4A2F]">Mi Carrito</h1>
          <NavLink to="/#productos" className="flex items-center gap-2 text-[#2F4A2F]/60 hover:text-[#2F4A2F] transition-colors text-sm font-medium">
            <ChevronLeft size={18} className='cursor-pointer'/> Continuar comprando
          </NavLink>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item) => (
              <div key={`${item.id}-${item.colorSeleccionado}`} className="bg-white/70 backdrop-blur-sm p-4 md:p-6 rounded-2xl shadow-sm border border-white flex gap-4 md:gap-6 items-center">
                <div className="w-24 h-24 md:w-32 md:h-32 rounded-xl overflow-hidden shrink-0 ">
                  <img src={item.imagen} alt={item.nombre} className="w-full h-full object-contain p-2" />
                </div>

                <div className="flex-grow">
                  <h3 className="font-belleza text-xl md:text-2xl text-[#2F4A2F] leading-tight">{item.nombre}</h3>
                  
                  {item.colorSeleccionado && (
                    <div className="flex items-center gap-2 mt-1 mb-2">
                      <div 
                        className="w-4 h-4 rounded-full border border-black/10 shadow-sm"
                        style={{ backgroundColor: getColorBackground(item.colorSeleccionado) }}
                      ></div>
                      <span className="text-[10px] uppercase font-bold tracking-widest text-[#2F4A2F]/50">
                        Color: {item.colorSeleccionado}
                      </span>
                    </div>
                  )}

                  <p className="text-[#8B5E3C] font-bold text-lg mt-1">${item.precio.toLocaleString()}</p>
                  
                  <div className="flex items-center gap-4 mt-4 md:hidden">
                    <div className="flex items-center border border-[#2F4A2F]/20 rounded-lg bg-white">
                      <button onClick={() => updateQuantity(item.id, item.colorSeleccionado, -1)} className="p-2"><Minus size={16}/></button>
                      <span className="px-2 font-bold">{item.cantidad}</span>
                      <button 
                        onClick={() => updateQuantity(item.id, item.colorSeleccionado, 1)} 
                        disabled={item.cantidad >= item.stock}
                        className={`p-3 transition-colors ${item.cantidad >= item.stock ? 'opacity-20 cursor-not-allowed' : 'hover:text-[#8B5E3C]'}`}
                      >
                        <Plus size={18}/>
                      </button>
                    </div>
                    <button onClick={() => confirmDelete(item)} className="text-red-400 p-2"><Trash2 size={20}/></button>
                  </div>
                </div>

                <div className="hidden md:flex flex-col items-end gap-4">
                  <div className="flex items-center border border-[#2F4A2F]/20 rounded-xl bg-white shadow-inner">
                    <button onClick={() => updateQuantity(item.id, item.colorSeleccionado, -1)} className="p-3 hover:text-[#8B5E3C] transition-colors"><Minus size={18}/></button>
                    <span className="px-4 font-bold text-lg min-w-[3rem] text-center">{item.cantidad}</span>
                    <button onClick={() => updateQuantity(item.id, item.colorSeleccionado, 1)} className="p-3 hover:text-[#8B5E3C] transition-colors"><Plus size={18}/></button>
                  </div>
                  <button onClick={() => confirmDelete(item)} className="flex items-center gap-2 text-red-400 hover:text-red-600 text-xs uppercase tracking-widest font-bold transition-all">
                    Eliminar <Trash2 size={16}/>
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-[#2F4A2F] p-8 rounded-3xl text-[#F2E4C9] shadow-2xl sticky top-24">
            <h3 className="font-belleza text-2xl mb-8 border-b border-white/10 pb-4">Resumen</h3>
            
            <div className="mb-8 space-y-3">
                <p className="text-[10px] uppercase font-bold tracking-widest opacity-60 mb-4">Elegí cómo pagar</p>
                <button 
                    onClick={() => setMetodoPago('mercadopago')}
                    className={`cursor-pointer w-full flex items-center gap-3 p-4 rounded-xl border-2 transition-all ${metodoPago === 'mercadopago' ? 'border-[#E8D6B3] bg-white/10' : 'border-white/10 hover:border-white/30'}`}
                >
                    <CreditCard size={18} />
                    <span className="text-sm font-bold">Mercado Pago / Tarjeta</span>
                </button>
                <button 
                    onClick={() => setMetodoPago('efectivo')}
                    className={`cursor-pointer w-full flex items-center gap-3 p-4 rounded-xl border-2 transition-all ${metodoPago === 'efectivo' ? 'border-[#E8D6B3] bg-white/10' : 'border-white/10 hover:border-white/30'}`}
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
                <span className="text-lg">Total</span>
                <span className="text-3xl font-bold text-[#E8D6B3]">${totalFinal.toLocaleString()}</span>
              </div>
            </div>

            <button 
                onClick={handleFinalizarPedido}
                className="cursor-pointer w-full bg-[#8B5E3C] hover:bg-[#a67148] text-[#F2E4C9] py-4 rounded-xl font-bold uppercase tracking-[0.2em] transition-all shadow-lg active:scale-95"
            >
                Finalizar Compra
            </button>

            <p className="mt-6 text-[10px] text-center opacity-40 leading-relaxed uppercase tracking-wider">
              Envíos en el día dentro de la zona de Paraná, Entre Ríos.
            </p>
          </div>
        </div>
      </div>
    </section>
    );
}