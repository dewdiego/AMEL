import { ChevronDown } from 'lucide-react';
import { HERO_IMAGE, COMPANY } from '@/data';

export default function Hero() {
  return (
    <section id="inicio" className="relative">
      {/* Background image */}
      <div className="relative h-[340px] sm:h-[440px] overflow-hidden">
        <img
          src={HERO_IMAGE}
          alt="Edificio de departamentos"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-blue-950/60 via-blue-950/40 to-blue-950/70" />
        <div className="absolute inset-0 flex items-center">
          <div className="max-w-7xl mx-auto px-5 sm:px-8 w-full">
            <div className="max-w-xl text-white">
              <p className="text-xs sm:text-sm tracking-[3px] uppercase font-medium text-blue-200 mb-3">
                {COMPANY.tagline} DE CONSORCIOS
              </p>
              <h1 className="text-3xl sm:text-5xl font-light leading-tight mb-4">
                Gestión transparente <br className="hidden sm:block" />
                <span className="font-bold">para tu consorcio</span>
              </h1>
              <p className="text-sm sm:text-base text-blue-100/90 max-w-md leading-relaxed">
                Administración profesional con seguimiento de cada reclamo,
                control de gastos y documentación siempre disponible.
              </p>
            </div>
          </div>
        </div>
        <a
          href="#servicios"
          className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/80 hover:text-white transition-colors animate-bounce"
          aria-label="Desplazarse abajo"
        >
          <ChevronDown className="w-7 h-7" />
        </a>
      </div>
    </section>
  );
}
