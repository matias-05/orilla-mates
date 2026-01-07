import React from 'react';

export default function SectionSobre() {
  return (
    <section 
      id="sobre-nosotros" 
      className="w-full min-h-[calc(100vh-80px)] flex flex-col font-quicksand"
    >

      <div className="relative flex-[1.5] w-full flex items-center justify-center overflow-hidden">
        

        <div className="absolute inset-0 z-0 bg-black">
          <div 
            className="absolute inset-0 bg-[url('/fondo-mobile.webp')] md:bg-[url('/fondo-productos.webp')] 
                      bg-center bg-no-repeat bg-cover 
                      opacity-50" 
            style={{ backgroundAttachment: 'fixed' }} 
          />
          <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px]"></div>
        </div>

        <h2 className="relative z-10 font-belleza text-4xl md:text-6xl text-[#E8D6B3] text-center px-4">
          ¿ Quienes Somos ?
        </h2>
      </div>


      <div className="bg-[#2F4A2F] flex-1 flex flex-col md:flex-row items-center justify-center  px-6 md:px-16 gap-8 md:gap-16 relative z-10">
        

        <div className="hidden lg:block shrink-0">
          <img 
            src="/logo-orilla.webp" 
            alt="Orilla Mates Logo" 
            className="w-28 h-28 md:w-36 md:h-36 object-contain"
          />
        </div>

        <div className="max-w-4xl text-center">
          <p className="text-[#E8D6B3] text-sm md:text-lg lg:text-xl leading-relaxed font-light tracking-wide ">
            Lorem Ipsum is simply dummy text of the printing and typesetting industry. 
            Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, 
            when an unknown printer took a galley of type and scrambled it to make a type 
            specimen book. It has survived not only five centuries, but also the leap 
            into electronic typesetting, remaining essentially unchanged.
          </p>
        </div>

        <div className="hidden lg:block shrink-0">
          <img 
            src="/logo-orilla.webp" 
            alt="Orilla Mates Logo" 
            className="w-28 h-28 md:w-36 md:h-36 object-contain"
          />
        </div>

      </div>

    </section>
  );
}