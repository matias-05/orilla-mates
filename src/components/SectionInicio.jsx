
import { HashLink } from 'react-router-hash-link';

export default function SectionInicio() {
  return (
    <section className="flex flex-col md:flex-row h-[calc(100vh-80px)] w-full overflow-hidden font-quicksand" id="inicio">
      

      <div className="w-full md:w-1/2 bg-[#F2E4C9] flex flex-col justify-center px-12 md:px-24 py-10 gap-16">
        

        <h1 className="font-belleza text-6xl md:text-8xl text-black leading-tight">
          Orilla Mates <br /> Paraná
        </h1>


        <HashLink 
          smooth 
          to="/#productos" 
          className="bg-black text-white w-fit px-10 py-3 rounded-full text-sm font-medium hover:bg-gray-800 transition-all  tracking-widest cursor-pointer"
        >
          Ver Productos
        </HashLink>

        

        {/* Textos Secundarios */}
        <div className="mt-4 space-y-2 text-black/90">
          <p className="text-xl md:text-2xl font-medium max-w-md leading-relaxed">
            Orillas mates, una orilla con muchos mates para comprar.
          </p>
          <p className="text-xs md:text-sm font-regular tracking-[0.2em] ">
            Estamos en Paraná, Entre Ríos, Argentina.
          </p>
        </div>
      </div>

      {/* LADO DERECHO: Imagen */}
      <div className="w-full md:w-1/2 h-full">
        <img 
          src="/foto-inicio.png" 
          alt="Mates Orilla"
          className="w-full h-full object-cover object-center"
        />
      </div>

    </section>
  );
}