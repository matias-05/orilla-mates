import CardCategorias from "./CardCategorias";

export default function Productos() {
  return (
    <section 
      className="relative min-h-[calc(100vh-80px)] w-full flex flex-col items-center justify-center py-12 px-4 font-quicksand overflow-hidden" 
      id="productos"
    >

      <div className="absolute inset-0 z-0 bg-black">
        <div 
          className="absolute inset-0 bg-[url('/fondo-productos.png')] 
                     bg-center bg-no-repeat bg-cover 
                     opacity-50" 
          style={{ backgroundAttachment: 'fixed' }} 
        />
        <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px]"></div>
      </div>


      <div className="relative z-10 w-full max-w-7xl flex flex-col items-center">
        <h2 className="font-belleza text-4xl md:text-5xl text-[#E8D6B3] text-center mb-10 md:mb-16 drop-shadow-lg">
          Nuestros Productos
        </h2>

        <div className="w-full">
          <CardCategorias />
        </div>
      </div>
    </section>
  );
}