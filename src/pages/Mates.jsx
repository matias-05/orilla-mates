import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import CardMates from '../components/CardMates';

export default function SeccionMates() {

  const [filtro, setFiltro] = useState('Todos');

  return (
    <section className="bg-[#F2E4C9] min-h-screen py-12 px-8 font-quicksand">
      <div className="max-w-7xl mx-auto">
        

        <div className="mb-10 relative w-fit group">
          <select 
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
            className="bg-[#8B5E3C] text-[#F2E4C9] pl-6 pr-12 py-2.5 rounded-full appearance-none cursor-pointer outline-none font-medium min-w-[180px] shadow-md transition-all hover:bg-[#724d2b] border-none focus:ring-2 focus:ring-[#2F4A2F]"
          >
            <option value="Todos">Todos</option>
            <option value="Camionero">Camioneros</option>
            <option value="Imperial">Imperiales</option>
            <option value="Torpedo">Torpedos</option>
            <option value="Ranchero">Rancheros</option>
          </select>

          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[#F2E4C9] group-hover:scale-110 transition-transform">
            <ChevronDown size={20} strokeWidth={2.5} />
          </div>
        </div>


        <CardMates filtro={filtro} />

      </div>
    </section>
  );
}