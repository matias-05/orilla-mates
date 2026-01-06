import { Link } from 'react-router-dom';

const categorias = [
  { id: 1, nombre: 'Termos', imagen: '/termos.png', path: '/productos/termos' },
  { id: 2, nombre: 'Mates', imagen: '/mates.png', path: '/productos/mates' },
  { id: 3, nombre: 'Bombillas', imagen: '/bombillas.png', path: '/productos/bombillas' },
  { id: 4, nombre: 'Otros', imagen: '/otros.png', path: '/productos/otros' },
];

export default function CardCategorias() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8 w-full">
      {categorias.map((cat) => (
        <Link 
          key={cat.id}
          to={cat.path}
          className="group relative aspect-[3/4] overflow-hidden rounded-sm cursor-pointer shadow-2xl block"
        >
          <img 
            src={cat.imagen} 
            alt={cat.nombre} 
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-4 md:p-8">
            <h3 className="text-[#E8D6B3] font-belleza text-xl md:text-3xl text-center border-b border-[#E8D6B3]/30 pb-2">
              {cat.nombre}
            </h3>

            <span className="text-[#E8D6B3] text-[10px] md:text-xs text-center mt-2 tracking-[0.3em] uppercase opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              Ver más
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
}