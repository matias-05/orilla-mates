import { useEffect, useState } from 'react';
import { db } from '../../firebase/config';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { useCart } from '../../context/CartContext';
import { toast } from 'sonner';

function ProductoItem({ prod, addToCart, getColorBackground }) {

    const coloresDisponibles = prod.colores || [];
    const [colorElegido, setColorElegido] = useState(coloresDisponibles[0] || '');
    
    const calcularStockTotal = (stock) => {
        if (!stock) return 0;
        if (typeof stock === 'number') return stock;
        if (typeof stock === 'object') {
            return Object.values(stock).reduce((acc, curr) => acc + Number(curr), 0);
        }
        return 0;
    };

    const totalStock = calcularStockTotal(prod.stock);
    const sinStock = totalStock <= 0;

    const stockDelColorSeleccionado = () => {
        if (typeof prod.stock === 'number') return prod.stock;
        if (typeof prod.stock === 'object' && colorElegido) {
            return prod.stock[colorElegido] || 0;
        }
        return 0;
    };

    const handleAgregar = () => {
        if (sinStock) return;

        const stockActual = stockDelColorSeleccionado();
        if (stockActual <= 0) {
            toast.error(`No hay stock disponible para el color ${colorElegido}`, {
            style: { 
                background: '#ce2a2a', 
                color: '#E8D6B3', 
                borderRadius: 0, 
                // Flexbox para centrado total
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',    // Centrado horizontal
                justifyContent: 'center', // Centrado vertical
                textAlign: 'center',      // Alineación de las líneas de texto
                minHeight: '80px',        // Altura mínima para asegurar espacio de centrado
                border: '1px solid #E8D6B333', // Opcional: un borde sutil para definir más el cuadrado
            },
            });
            return;
        }

        addToCart({
            ...prod,
            colorSeleccionado: colorElegido
        });
    };

    return (
        <div className={`flex flex-col shadow-xl transition-all duration-300 overflow-hidden h-full bg-[#2F4A2F]  ${sinStock ? 'opacity-80 grayscale-[0.8] pointer-events-none' : 'hover:scale-[1.02]'}`}>

            <div className="bg-[#617A67] p-4 relative">
                {sinStock && (
                    <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/50 backdrop-blur-[2px]">
                        <span className="bg-[#8B5E3C] text-[#F2E4C9] text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] px-6 py-3  border border-[#F2E4C9]/30 shadow-2xl animate-pulse">
                            Agotado
                        </span>
                    </div>
                )}
                
                <div className="aspect-square w-full overflow-hidden  bg-white/5">
                    <img 
                        loading="lazy"
                        src={prod.imagen || '/logo-orilla.png'} 
                        alt={prod.nombre} 
                        className={`w-full h-full object-cover transition-opacity ${sinStock ? 'opacity-40' : 'opacity-100'}`}
                    />
                </div>
            </div>

            <div className="p-4 flex flex-col flex-grow text-[#F2E4C9] relative">
                <div className="mb-4">
                    <h3 className="text-sm font-light mb-1 leading-tight min-h-[2.5rem]">
                        {prod.nombre}
                    </h3>
                    <span className="text-lg font-bold text-[#E8D6B3]">
                        $ {Number(prod.precio).toLocaleString('es-AR')}
                    </span>
                </div>


                {prod.colores && prod.colores.length > 0 && !sinStock && (
                    <div className="mb-6">
                        <p className="text-[10px] uppercase tracking-widest opacity-60 mb-2">Seleccionar Color:</p>
                        <div className="flex flex-wrap gap-3">
                            {prod.colores.map((color) => {
                                const stockEsteColor = typeof prod.stock === 'object' ? (prod.stock[color] || 0) : prod.stock;
                                const sinStockColor = stockEsteColor <= 0;

                                return (
                                    <button
                                        key={color}
                                        disabled={sinStockColor}
                                        onClick={() => setColorElegido(color)}
                                        className={`group relative flex flex-col items-center gap-1 transition-all ${
                                            sinStockColor ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer'
                                        } ${colorElegido === color ? 'scale-110' : 'opacity-70 hover:opacity-100'}`}
                                    >
                                        <div 
                                            className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                                                colorElegido === color ? 'border-[#F2E4C9]' : 'border-transparent'
                                            }`}
                                            style={{ backgroundColor: getColorBackground(color) }}
                                        >

                                            {sinStockColor && <div className="absolute w-full h-[1px] bg-white rotate-45"></div>}
                                        </div>
                                        <span className={`text-[9px] uppercase font-bold tracking-tighter ${sinStockColor ? 'line-through' : ''}`}>
                                            {color}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                )}

                <button 
                    onClick={handleAgregar}
                    disabled={sinStock}
                    className={`mt-auto py-3 px-8 cursor-pointer self-center text-sm font-bold uppercase tracking-wider w-full shadow-lg transition-all ${
                        sinStock 
                        ? 'bg-gray-600 text-gray-400 cursor-not-allowed' 
                        : 'bg-[#8B5E3C] text-[#F2E4C9] hover:bg-[#a67148] hover:shadow-xl active:scale-95'
                    }`}
                >
                    {sinStock ? 'Sin Stock' : 'Agregar al carrito'}
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
        if (!color) return 'transparent';
        const lowerColor = color.toLowerCase();
        if (lowerColor === 'negro') return 'black';
        if (lowerColor === 'borravino') return '#4A0E0E';
        if (lowerColor === 'marron' || lowerColor === 'marrón') return '#5C3D2E';
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

    if (loading) return (
        <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2F4A2F]"></div>
        </div>
    );

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 pb-10">
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