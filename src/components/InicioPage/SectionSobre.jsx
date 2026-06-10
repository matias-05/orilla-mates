import { useState, useEffect, useRef } from "react";

export default function SectionSobre() {
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
      { threshold: 0.25 },
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="sobre-nosotros"
      className="
        w-full 
        h-[calc(100vh-80px)]
        flex flex-col 
        font-quicksand
      "
    >
      <style>{`
        .reveal-base {
          opacity: 0;
          transition: all 1s cubic-bezier(0.17, 0.55, 0.55, 1);
        }

        .start-zoom { transform: scale(0.9); }
        .start-up { transform: translateY(40px); }
        .start-rotate { transform: rotate(-10deg) scale(0.8); }

        .reveal-visible {
          opacity: 1;
          transform: translate(0) scale(1) rotate(0deg);
        }
      `}</style>

      <div className="relative flex-[1.5] w-full flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0 bg-black">
          <div
            className="
              absolute inset-0
              bg-[url('/fondo-productos.jpeg')]
              bg-center bg-no-repeat bg-cover
              opacity-50
              bg-scroll md:bg-fixed
            "
          />
          <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px]" />
        </div>

        <h2
          className={`
            relative z-10 font-belleza text-4xl md:text-6xl text-[#E8D6B3] text-center px-4 drop-shadow-lg
            reveal-base start-zoom ${isVisible ? "reveal-visible" : ""}
          `}
        >
          ¿ Quiénes Somos ?
        </h2>
      </div>

      <div className="bg-[#2F4A2F] flex-1 flex flex-col md:flex-row items-center justify-center px-6 md:px-16 py-10 md:py-0 gap-8 md:gap-16 relative z-10 shadow-[0_-10px_20px_rgba(0,0,0,0.3)]">
        <div
          className={`lg:block shrink-0 reveal-base start-rotate ${isVisible ? "reveal-visible" : ""}`}
          style={{ transitionDelay: "0.2s" }}
        >
          <img
            src="/logo-orilla.webp"
            alt="Orilla Mates Logo"
            width="144"
            height="144"
            loading="lazy"
            className="w-28 h-28 md:w-36 md:h-36 object-contain"
          />
        </div>

        <div
          className={`max-w-4xl text-center reveal-base start-up ${isVisible ? "reveal-visible" : ""}`}
          style={{ transitionDelay: "0.4s" }}
        >
          <p className="text-[#E8D6B3] text-md md:text-lg lg:text-xl leading-relaxed font-light tracking-wide">
            Somos un emprendimiento de <strong>Paraná, Entre Ríos</strong>,
            apasionados por la cultura del mate. Buscamos unir la tradición
            artesanal con la calidad premium que cada cebador merece. En Orilla
            Mates, cada producto cuenta una historia.
          </p>
        </div>

        <div
          className={`hidden lg:block shrink-0 reveal-base start-rotate ${isVisible ? "reveal-visible" : ""}`}
          style={{ transitionDelay: "0.2s" }}
        >
          <img
            src="/logo-orilla.webp"
            alt="Orilla Mates Logo"
            width="144"
            height="144"
            loading="lazy"
            className="w-28 h-28 md:w-36 md:h-36 object-contain"
          />
        </div>
      </div>
    </section>
  );
}
