import { Mail, Instagram, MapPin, MessageCircle } from "lucide-react";

export default function SectionContacto() {
  const contacto = {
    email: "orillamates@gmail.com",
    instagram: "@orillamates.parana",
    whatsapp: import.meta.env.VITE_WHATSAPP_NUMBER,
  };

  return (
    <section
      id="contacto"
      className="bg-[#F2E4C9] h-[calc(100vh-80px)] w-full flex flex-col font-quicksand overflow-hidden"
    >
      <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
        <div className="relative mb-4 md:mb-10">
          <div className="absolute inset-0 bg-[#8B5E3C] blur-3xl opacity-10 rounded-full"></div>
          <img
            src="/logo-orilla.webp"
            alt="Logo Orilla Mates"
            width="192"
            height="192"
            loading="lazy"
            className="relative w-20 h-20 md:w-48 md:h-48 object-contain animate-float"
          />
        </div>

        <h2 className="font-belleza text-4xl md:text-7xl text-[#2F4A2F] mb-4 md:mb-8 leading-tight">
          ¡ Gracias por <br className="block md:hidden" /> elegirnos !
        </h2>

        <p className="text-[#2F4A2F]/70 text-lg md:text-2xl max-w-xl mx-auto font-light leading-snug">
          Cada mate cuenta una historia. Gracias por permitir que{" "}
          <strong className="font-bold">Orilla Mates</strong> sea parte de las
          tuyas.
        </p>

        <div className="w-16 h-1 bg-[#8B5E3C] mt-6 md:mt-10 rounded-full opacity-40"></div>
      </div>

      <div className="bg-[#2F4A2F] w-full py-6 md:py-12 px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-5">
            <a
              href={`https://wa.me/${contacto.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Contactar por WhatsApp"
              className="flex items-center gap-3 transition-transform active:scale-95"
            >
              <div className="p-2.5 bg-[#F2E4C9]/10 text-[#F2E4C9] rounded-xl">
                <MessageCircle size={20} aria-hidden="true" />
              </div>
              <div className="text-[#F2E4C9]">
                <p className="text-[8px] uppercase tracking-widest opacity-40 font-bold">
                  WhatsApp
                </p>
                <p className="text-xs font-bold">Escribinos</p>
              </div>
            </a>

            <a
              href={`https://instagram.com/${contacto.instagram.replace(
                "@",
                "",
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Seguir en Instagram"
              className="flex items-center gap-3 transition-transform active:scale-95"
            >
              <div className="p-2.5 bg-[#F2E4C9]/10 text-[#F2E4C9] rounded-xl">
                <Instagram size={20} aria-hidden="true" />
              </div>
              <div className="text-[#F2E4C9]">
                <p className="text-[8px] uppercase tracking-widest opacity-40 font-bold">
                  Instagram
                </p>
                <p className="text-xs font-bold">@orillamates</p>
              </div>
            </a>

            <a
              href={`mailto:${contacto.email}`}
              aria-label="Enviar correo electrónico"
              className="flex items-center gap-3 transition-transform active:scale-95"
            >
              <div className="p-2.5 bg-[#F2E4C9]/10 text-[#F2E4C9] rounded-xl">
                <Mail size={20} aria-hidden="true" />
              </div>
              <div className="text-[#F2E4C9]">
                <p className="text-[8px] uppercase tracking-widest opacity-40 font-bold">
                  Email
                </p>
                <p className="text-xs font-bold">Enviar Mail</p>
              </div>
            </a>

            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-[#F2E4C9]/10 text-[#F2E4C9] rounded-xl">
                <MapPin size={20} aria-hidden="true" />
              </div>
              <div className="text-[#F2E4C9]">
                <p className="text-[8px] uppercase tracking-widest opacity-40 font-bold">
                  Ubicación
                </p>
                <p className="text-xs font-bold text-nowrap">Paraná, ER</p>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-white/5 text-center">
            <p className="text-[#F2E4C9]/20 text-[9px] uppercase tracking-[0.4em]">
              © 2026 Orilla Mates Paraná
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
