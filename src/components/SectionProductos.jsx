import CardCategorias from "./CardCategorias";
export default function Productos() {
  return (
    <section className="relative min-h-[calc(100vh-80px)] w-full flex flex-col items-center py-12 px-4 font-quicksand" id="productos">
      

      <div 
        className="absolute inset-0 z-0 bg-black" 
      >
        <div 
          className="absolute inset-0 bg-[url('/fondo-productos.png')] 
                     bg-center bg-no-repeat bg-cover 
                     opacity-60" 
          style={{ 
            backgroundAttachment: 'fixed' 
          }}
        />

        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/40 to-black/60 backdrop-blur-[1px]"></div>
      </div>


      <div className="relative z-10 w-full max-w-7xl">
        <h2 className="font-belleza text-4xl md:text-5xl text-[#E8D6B3] text-center mb-16 drop-shadow-lg">
          Nuestros Productos
        </h2>

        <CardCategorias />
      </div>
    </section>
  );
}