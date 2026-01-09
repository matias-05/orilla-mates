import { useState, useEffect } from 'react';
import { useParams, NavLink } from 'react-router-dom'; 
import { ChevronDown, Search } from 'lucide-react';
import CardProductos from '../components/Cards/CardProductos'; 


export default function PaginaProductos() {
  const { categoria } = useParams(); 
  const [filtro, setFiltro] = useState('Todos');

  const titulosPersonalizados = {
    mates: 'Nuestros Mates',
    termos: 'Nuestros Termos',
    bombillas: 'Nuestras Bombillas', 
    otros: 'Otros Productos'
  };

  const categoriasNav = [
    { nombre: 'Mates', path: '/productos/mates' },
    { nombre: 'Termos', path: '/productos/termos' },
    { nombre: 'Bombillas', path: '/productos/bombillas' },
    { nombre: 'Otros', path: '/productos/otros' },
  ];

  const categoriaFirebase = categoria 
    ? categoria.charAt(0).toUpperCase() + categoria.slice(1) 
    : 'Mates';
  const tituloMostrar = titulosPersonalizados[categoria.toLowerCase()] || `Nuestros ${categoriaFirebase}`;

  useEffect(() => {
    setFiltro(categoriaFirebase === 'Mates' ? 'Todos' : '');
  }, [categoriaFirebase]);

  const esSeccionMates = categoriaFirebase === 'Mates';

  return (
    <section className="bg-[#F2E4C9] min-h-[calc(100vh-80px)] py-12 px-8 font-quicksand">
      <div className="max-w-7xl mx-auto">
        
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12 border-b border-[#2F4A2F]/10 pb-8">
            
            <h2 className="font-belleza text-4xl md:text-5xl text-[#2F4A2F] capitalize drop-shadow-sm text-center md:text-left">
              {tituloMostrar}
            </h2>

            <nav className="flex flex-wrap justify-center gap-3 ">
                {categoriasNav.map((cat) => (
                    <NavLink
                        key={cat.nombre}
                        to={cat.path}
                        className={({ isActive }) => `
                            px-5 py-2  text-sm  tracking-widest  transition-all duration-300 border border-[#2F4A2F]
                            ${isActive 
                                ? 'bg-[#2F4A2F] text-[#F2E4C9] shadow-xl scale-105 hover:bg-[#2F4A2F]/90 font-semibold'
                                : 'bg-transparent text-[#2F4A2F] hover:bg-[#2F4A2F]/10'
                            }
                        `}
                    >
                        {cat.nombre}
                    </NavLink>
                ))}
            </nav>
        </div>

        <div className="mb-10 relative w-fit group mx-auto md:mx-0">
          {esSeccionMates ? (
            <div className="relative">
              <select 
                value={filtro}
                onChange={(e) => setFiltro(e.target.value)}
                className="bg-[#8B5E3C] text-[#F2E4C9] pl-6 pr-12 py-2.5  appearance-none cursor-pointer outline-none font-medium min-w-[180px] shadow-md transition-all  hover:bg-[#724d2b] border-none focus:ring-2 focus:ring-[#2F4A2F]"
              >
                <option value="Todos">Todos los Mates</option>
                <option value="Camionero">Camioneros</option>
                <option value="Imperial">Imperiales</option>
                <option value="Torpedo">Torpedos</option>
                <option value="Ranchero">Rancheros</option>
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[#F2E4C9] group-hover:scale-110  transition-transform">
                <ChevronDown size={20} strokeWidth={2.5} />
              </div>
            </div>
          ) : (
            <div className="relative">
              <input 
                type="text"
                placeholder={`Buscar ${categoriaFirebase} . . .`} 
                value={filtro}
                onChange={(e) => setFiltro(e.target.value)}
                className="bg-[#8B5E3C] text-[#F2E4C9] pl-6 pr-12 py-2.5  outline-none font-medium min-w-[250px] shadow-md transition-all hover:bg-[#724d2b] placeholder-[#F2E4C9]/70 border-none focus:ring-2 focus:ring-[#2F4A2F]"
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[#F2E4C9]">
                <Search size={20} strokeWidth={2.5} />
              </div>
            </div>
          )}
        </div>
        
        <CardProductos categoria={categoriaFirebase} filtro={filtro} />

      </div>
    </section>
  );
}