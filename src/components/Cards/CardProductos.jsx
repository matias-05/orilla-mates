import React, { useEffect, useState } from 'react';
import { db } from '../../firebase/config';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { useCart } from '../../context/CartContext';
import { Check } from 'lucide-react'; 
function ProductoItem({ prod, addToCart, getColorBackground }) {
    const [colorElegido, setColorElegido] = useState(prod.colores?.[0] || '');
    
    const sinStock = !prod.stock || prod.stock <= 0;

    const handleAgregar = () => {
        if (sinStock) return;
        addToCart({
            ...prod,
            colorSeleccionado: colorElegido
        });
    };

    return (
        <div className={`flex flex-col shadow-xl transition-all duration-300 overflow-hidden h-full bg-[#2F4A2F] ${sinStock ? 'opacity-80 grayscale-[0.5]' : 'hover:scale-[1.02]'}`}>

            <div className="bg-[#617A67] p-4 relative">
                {sinStock && (
                    <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/40 backdrop-blur-[2px]">
                        <span className="bg-[#8B5E3C] text-[#F2E4C9] text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] px-4 py-2 rounded-full border border-[#F2E4C9]/30 shadow-2xl animate-pulse">
                            Sin Stock
                        </span>
                    </div>
                )}
                
                <div className="aspect-square w-full overflow-hidden rounded-sm">
                    <img 
                        loading="lazy"
                        src={prod.imagen || '/logo-orilla.png'} 
                        alt={prod.nombre} 
                        className={`w-full h-full object-cover ${sinStock ? 'opacity-50' : ''}`}
                    />
                </div>
            </div>

            <div className="p-4 flex flex-col flex-grow text-[#F2E4C9]">
                <div className="mb-4">
                    <h3 className="text-sm font-light mb-1 leading-tight min-h-[2.5rem]">
                        {prod.nombre}
                    </h3>
                    <span className="text-lg font-bold">
                        $ {Number(prod.precio).toLocaleString('es-AR')}
                    </span>
                </div>

                {prod.colores && prod.colores.length > 0 && (
                    <div className={`mb-6 ${sinStock ? 'pointer-events-none opacity-20' : ''}`}>
                        <p className="text-[10px] uppercase tracking-widest opacity-60 mb-2">Seleccionar Color:</p>
                        <div className="flex flex-wrap gap-3">
                            {prod.colores.map((color) => (
                                <button
                                    key={color}
                                    onClick={() => setColorElegido(color)}
                                    className={`group relative flex flex-col items-center gap-1 cursor-pointer transition-all ${
                                        colorElegido === color ? 'scale-110' : 'opacity-70 hover:opacity-100'
                                    }`}
                                >
                                    <div 
                                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                                            colorElegido === color ? 'border-[#F2E4C9]' : 'border-transparent'
                                        }`}
                                        style={{ backgroundColor: getColorBackground(color) }}
                                    >
                                        {colorElegido === color && <Check size={12} className="text-white drop-shadow-md" />}
                                    </div>
                                    <span className="text-[9px] uppercase font-bold tracking-tighter">{color}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                <button 
                    onClick={handleAgregar}
                    disabled={sinStock}
                    className={`mt-auto py-2 px-8 rounded-sm self-center text-sm font-medium transition-all shadow-md tracking-wider w-full ${
                        sinStock 
                        ? 'bg-gray-600 text-gray-300 cursor-not-allowed opacity-50' 
                        : 'bg-[#8B5E3C] text-[#F2E4C9] hover:bg-[#724d2b] active:scale-95 cursor-pointer'
                    }`}
                >
                    {sinStock ? 'Agotado' : 'Agregar al carrito'}
                </button>
            </div>
        </div>
    );
}

export default function CardProductos({ categoria, filtro }) {
    const [productos, setProductos] = useState([]);
    const [loading, setLoading] = useState(true);
    const { addToCart } = useCart();

    const getColorBackground = (color) => {
        const lowerColor = color.toLowerCase();
        if (lowerColor === 'negro') return 'black';
        if (lowerColor === 'borravino') return '#4A0E0E';
        if (lowerColor === 'marron' || lowerColor === 'marrón') return '#5C3D2E';
        if (lowerColor === 'crema') return '#F2E4C9';
        return '#5C3D2E';
    };

    useEffect(() => {
        const obtenerProductos = async () => {
            setLoading(true);
            try {
                const q = query(collection(db, "catalogo"), where("categoria", "==", categoria));
                const querySnapshot = await getDocs(q);
                const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setProductos(data);
            } catch (error) {
                console.error("Error:", error);
            } finally {
                setLoading(false);
            }
        };
        if (categoria) obtenerProductos();
    }, [categoria]);

    const productosFiltrados = productos.filter(prod => {
        if (!filtro || filtro === 'Todos') return true;
        return (prod.nombre || "").toLowerCase().includes(filtro.toLowerCase());
    });

    if (loading) return <div className="text-center p-10 text-[#2F4A2F]">Cargando {categoria}...</div>;

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {productosFiltrados.map((prod) => (
                <ProductoItem 
                    key={prod.id} 
                    prod={prod} 
                    addToCart={addToCart} 
                    getColorBackground={getColorBackground} 
                />
            ))}
        </div>
    );
}