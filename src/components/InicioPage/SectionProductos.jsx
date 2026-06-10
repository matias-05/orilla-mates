import { useState, useEffect, useRef } from "react";
import CardCategorias from "../Cards/CardCategorias";

export default function Productos() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 },
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="productos"
      className="
        relative w-full
        min-h-[calc(100dvh-80px)]
        flex flex-col items-center justify-center
        py-8 md:py-12 px-4
        font-quicksand
        overflow-hidden
        bg-transparent
      "
    >
      <style>{`
        .opacity-0-start {
          opacity: 0;
          transform: translateY(40px);
          transition: opacity 0.8s ease-out, transform 0.8s ease-out;
        }
        .animate-trigger.visible {
          opacity: 1;
          transform: translateY(0);
        }
      `}</style>

      <div className="absolute inset-0 z-0 bg-black">
        <div
          className="
            absolute inset-0
            bg-[url('/fondo-productos.jpeg')] 
            md:bg-[url('/fondo-productos.jpeg')]
            bg-center bg-no-repeat bg-cover
            opacity-50
            bg-scroll md:bg-fixed
          "
        />
        <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px]" />
      </div>

      <div className="relative z-10 w-full max-w-7xl flex flex-col items-center">
        <h2
          className={`
            font-belleza text-4xl md:text-5xl text-[#E8D6B3] text-center mb-10 md:mb-16 drop-shadow-lg
            opacity-0-start animate-trigger ${isVisible ? "visible" : ""}
          `}
        >
          Nuestros Productos
        </h2>

        <div
          className={`
            w-full opacity-0-start animate-trigger ${isVisible ? "visible" : ""}
          `}
          style={{ transitionDelay: "0.2s" }}
        >
          <CardCategorias />
        </div>
      </div>
    </section>
  );
}
