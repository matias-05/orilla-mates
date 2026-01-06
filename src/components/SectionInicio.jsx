import { HashLink } from 'react-router-hash-link';

export default function SectionInicio() {
  return (
    <section 
      className="flex flex-col md:flex-row h-[calc(100vh-80px)] w-full overflow-hidden font-quicksand" 
      id="inicio"
    >

      <div className="w-full md:w-1/2 bg-[#F2E4C9] flex flex-col justify-center px-6 sm:px-12 md:px-24 py-8 md:py-0 gap-6 md:gap-12 order-2 md:order-1 flex-1 md:h-full">
        
        <h1 className="font-belleza text-4xl sm:text-6xl lg:text-8xl text-black leading-[1.1]">
          Orilla Mates <br /> Paraná
        </h1>

        <HashLink 
          smooth 
          to="/#productos" 
          className="bg-black text-white w-full sm:w-fit text-center px-10 py-4 md:py-3 rounded-full text-xs md:text-sm font-medium hover:bg-gray-800 transition-all tracking-widest cursor-pointer uppercase"
        >
          Ver Productos
        </HashLink>

        <div className="mt-2 md:mt-4 space-y-3 md:space-y-2 text-black/90">
          <p className="text-base md:text-xl lg:text-2xl font-medium max-w-md leading-relaxed">
            Orillas mates, una orilla con muchos mates para comprar.
          </p>
          <p className="text-[10px] md:text-sm font-regular tracking-[0.2em] uppercase">
            Estamos en Paraná, Entre Ríos, Argentina.
          </p>
        </div>
      </div>

      <div className="w-full md:w-1/2 h-[35vh] md:h-full order-1 md:order-2 shrink-0 md:shrink">
        <img 
          src="/foto-inicio.png" 
          alt="Mates Orilla"
          className="w-full h-full object-cover object-center"
        />
      </div>

    </section>
  );
}