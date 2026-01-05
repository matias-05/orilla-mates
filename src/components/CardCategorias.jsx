import { Link } from 'react-router-dom';

const categorias = [
  { id: 1, nombre: 'Termos', imagen: '/termos.png', path: '/productos/termos' },
  { id: 2, nombre: 'Mates', imagen: '/mates.png', path: '/productos/mates' },
  { id: 3, nombre: 'Bombillas', imagen: '/bombillas.png', path: '/productos/bombillas' },
  { id: 4, nombre: 'Otros', imagen: '/otros.png', path: '/productos/otros' },
];

export default function CardCategorias() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 px-4 md:px-10 py-15">
      {categorias.map((cat) => (
        <Link 
          key={cat.id} 
          to={cat.path}
          className="group cursor-pointer flex flex-col bg-[#2F4A2F] border-[3px] border-[#2F4A2F] rounded-md overflow-hidden 
                     shadow-[0_10px_20px_rgba(0,0,0,0.3)] 
                     hover:shadow-[0_30px_60px_rgba(0,0,0,0.5)] 
                     ring-1 ring-white/10
                     transition-all duration-500 ease-in-out 
                     hover:-translate-y-3"
        >
          <div className="aspect-[3/4] overflow-hidden bg-white m-2 rounded-sm shadow-inner">
            <img 
              src={cat.imagen} 
              alt={cat.nombre} 
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
            />
          </div>

          <div className="py-5 text-center">
            <span className="text-[#F2E4C9] text-2xl font-light tracking-[0.15em] uppercase drop-shadow-sm">
              {cat.nombre}
            </span>
          </div>
        </Link>
      ))}
    </div>
  )
}