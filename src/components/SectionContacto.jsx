import React from 'react';
import { Mail, Instagram, MapPin, MessageCircle } from 'lucide-react';

export default function SectionContacto() {
  const contacto = {
    email: "orillamates@gmail.com",
    instagram: "@orillamates.parana",
    direccion: "Paraná, Entre Ríos, Argentina", 
    whatsapp: import.meta.env.VITE_WHATSAPP_NUMBER, 
  };

  return (
    <section 
      id="contacto" 
      className="bg-[#F2E4C9] min-h-[calc(100vh-80px)] flex flex-col font-quicksand"
    >

      <div className="flex-grow flex flex-col items-center justify-center px-6 text-center py-12">
        <div className="relative mb-8">
          <div className="absolute inset-0 bg-[#8B5E3C] blur-3xl opacity-10 rounded-full"></div>
          <img 
            src="/logo-orilla.webp" 
            alt="Logo Orilla Mates" 
            className="relative w-32 h-32 md:w-48 md:h-48 object-contain animate-float"
          />
        </div>
        
        <h2 className="font-belleza text-4xl md:text-6xl text-[#2F4A2F] mb-6">
          ¡ Gracias por elegirnos !
        </h2>
        
        <p className="text-[#2F4A2F]/70 text-lg md:text-xl max-w-2xl mx-auto font-light leading-relaxed">
          Cada mate cuenta una historia. Gracias por permitir que <strong>Orilla Mates</strong> sea parte de las tuyas desde <strong>Paraná</strong> hacia todo el país.
        </p>
        
        <div className="w-16 h-1 bg-[#8B5E3C] mt-8 rounded-full opacity-40"></div>
      </div>

      <div className="bg-[#2F4A2F] w-full py-10 px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            <a 
              href={`https://wa.me/${contacto.whatsapp}`} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-4 group transition-all"
            >
              <div className="p-3 bg-[#F2E4C9]/10 text-[#F2E4C9] rounded-xl group-hover:bg-[#8B5E3C] transition-colors">
                <MessageCircle size={22} />
              </div>
              <div className="text-[#F2E4C9]">
                <p className="text-[10px] uppercase tracking-widest opacity-50 font-bold">WhatsApp</p>
                <p className="text-sm font-medium">Escribinos ahora</p>
              </div>
            </a>

            <a 
              href={`https://instagram.com/${contacto.instagram.replace('@', '')}`} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-4 group transition-all"
            >
              <div className="p-3 bg-[#F2E4C9]/10 text-[#F2E4C9] rounded-xl group-hover:bg-[#8B5E3C] transition-colors">
                <Instagram size={22} />
              </div>
              <div className="text-[#F2E4C9]">
                <p className="text-[10px] uppercase tracking-widest opacity-50 font-bold">Instagram</p>
                <p className="text-sm font-medium">{contacto.instagram}</p>
              </div>
            </a>

            <a 
              href={`mailto:${contacto.email}`} 
              className="flex items-center gap-4 group transition-all"
            >
              <div className="p-3 bg-[#F2E4C9]/10 text-[#F2E4C9] rounded-xl group-hover:bg-[#8B5E3C] transition-colors">
                <Mail size={22} />
              </div>
              <div className="text-[#F2E4C9]">
                <p className="text-[10px] uppercase tracking-widest opacity-50 font-bold">Email</p>
                <p className="text-sm font-medium truncate">{contacto.email}</p>
              </div>
            </a>

            <div className="flex items-center gap-4 group">
              <div className="p-3 bg-[#F2E4C9]/10 text-[#F2E4C9] rounded-xl">
                <MapPin size={22} />
              </div>
              <div className="text-[#F2E4C9]">
                <p className="text-[10px] uppercase tracking-widest opacity-50 font-bold">Ubicación</p>
                <p className="text-sm font-medium">Paraná, Entre Ríos</p>
              </div>
            </div>

          </div>

          <div className="mt-10 pt-6 border-t border-white/5 text-center">
            <p className="text-[#F2E4C9]/30 text-[10px] uppercase tracking-[0.4em]">
              © 2026 Orilla Mates Paraná 
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}