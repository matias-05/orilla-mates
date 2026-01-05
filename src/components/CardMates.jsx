import React, { useEffect, useState } from 'react';
import { db } from '../firebase/config'; 
import { collection, getDocs } from 'firebase/firestore';

export default function CardMates({ filtro }) {
    const [mates, setMates] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const obtenerMates = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, "catalogo"));
                const data = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setMates(data);
                setLoading(false);
            } catch (error) {
                console.error("Error al obtener productos:", error);
                setLoading(false);
            }
        };
        obtenerMates();
    }, []);

    const matesFiltrados = mates.filter(mate => {
        if (filtro === 'Todos') return true;
        return mate.nombre.toLowerCase().includes(filtro.toLowerCase());
    });

    if (loading) return <div className="text-center p-10 text-[#2F4A2F]">Cargando...</div>;

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {matesFiltrados.map((mate) => (
                <div 
                    key={mate.id} 
                    className="flex flex-col shadow-xl hover:scale-[1.02] transition-transform duration-300 overflow-hidden h-full"
                >
                    <div className="bg-[#617A67] p-4">
                        <div className="aspect-square w-full overflow-hidden">
                            <img 
                                src={mate.imagen || '/mate-prod.png'} 
                                alt={mate.nombre} 
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </div>


                    <div className="bg-[#2F4A2F] p-4 flex flex-col flex-grow text-[#F2E4C9]">
                        
                        <div className="flex justify-between items-start mb-6">
                            <div className="pr-2">
                                <h3 className="text-sm font-light mb-1 leading-tight min-h-[2.5rem]">
                                    {mate.nombre}
                                </h3>
                                <span className="text-lg font-bold">
                                    $ {Number(mate.precio).toLocaleString('es-AR')}
                                </span>
                            </div>
                            
                            <div className="flex flex-col gap-2 text-[10px] uppercase tracking-tighter shrink-0">
                                {mate.colores && mate.colores.map((color, index) => (
                                    <div key={index} className="flex items-center gap-1">
                                        <div 
                                            className="w-3 h-3 rounded-full border border-white/20"
                                            style={{ 
                                                backgroundColor: 
                                                    color.toLowerCase() === 'negro' ? 'black' : 
                                                    color.toLowerCase() === 'borravino' ? '#4A0E0E' : 
                                                    '#5C3D2E' 
                                            }}
                                        ></div>
                                        <span>{color}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <button className="mt-auto bg-[#8B5E3C] text-[#F2E4C9] py-2 px-8 rounded-sm self-center text-sm font-medium hover:bg-[#724d2b] transition-colors shadow-md tracking-wider">
                            Comprar
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
}