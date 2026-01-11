import { HashLink } from "react-router-hash-link";

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
          to="/productos/mates"
          className="group relative flex flex-col items-center justify-center bg-[#2F4A2F] w-fit px-6 py-2.5  shadow-sm hover:shadow-md  transition-all duration-500 cursor-pointer overflow-hidden border border-[#2F4A2F]/10"
        >
          <span className="font-belleza text-[#E8D6B3] text-sm md:text-base border-b border-[#E8D6B3]/20  pb-0.5 tracking-widest transition-transform duration-500 group-hover:-translate-y-2">
            Ver Productos
          </span>

          <span className="absolute bottom-1 text-[#E8D6B3]  text-[7px] md:text-[8px] tracking-[0.2em] uppercase opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-1 group-hover:translate-y-0 font-bold">
            Explorar
          </span>

          <div className="absolute inset-0 bg-[#2F4A2F]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        </HashLink>

        <div className="mt-2 md:mt-4 space-y-3 md:space-y-2 text-black/90">
          <p className="text-base md:text-xl lg:text-2xl font-medium max-w-md leading-relaxed">
            Orillas mates, el lugar perfecto para encontrar el mate perfecto.
          </p>
          <p className="text-[10px] md:text-sm font-regular tracking-[0.2em] ">
            Estamos en Paraná, Entre Ríos, Argentina.
          </p>
        </div>
      </div>

      <div className="w-full md:w-1/2 h-[35vh] md:h-full order-1 md:order-2 shrink-0 md:shrink">
        <img
          src="/foto-inicio.webp"
          alt="Mates Orilla"
          className="w-full h-full object-cover object-center"
        />
      </div>
    </section>
  );
}
