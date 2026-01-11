export default function SectionSobre() {
  return (
    <section
      id="sobre-nosotros"
      className="
        w-full 
        h-[calc(100vh-80px)]
        flex flex-col 
        font-quicksand
      "
    >
      <div className="relative flex-[1.5] w-full flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0 bg-black">
          <div
            className="
              absolute inset-0
              bg-[url('/fondo-productos.webp')]
              bg-center bg-no-repeat bg-cover
              opacity-50
              bg-scroll md:bg-fixed
            "
          />
          <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px]" />
        </div>

        <h2 className="relative z-10 font-belleza text-4xl md:text-6xl text-[#E8D6B3] text-center px-4 drop-shadow-lg">
          ¿ Quiénes Somos ?
        </h2>
      </div>

      <div className="bg-[#2F4A2F] flex-1 flex flex-col md:flex-row items-center justify-center px-6 md:px-16 py-10 md:py-0 gap-8 md:gap-16 relative z-10 shadow-[0_-10px_20px_rgba(0,0,0,0.3)]">
        <div className="lg:block shrink-0">
          <img
            src="/logo-orilla.webp"
            alt="Orilla Mates Logo"
            className="w-28 h-28 md:w-36 md:h-36 object-contain"
          />
        </div>

        <div className="max-w-4xl text-center">
          <p className="text-[#E8D6B3] text-md md:text-lg lg:text-xl leading-relaxed font-light tracking-wide">
            Somos un emprendimiento de <strong>Paraná, Entre Ríos</strong>,
            apasionados por la cultura del mate. Buscamos unir la tradición
            artesanal con la calidad premium que cada cebador merece. En Orilla
            Mates, cada producto cuenta una historia.
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
