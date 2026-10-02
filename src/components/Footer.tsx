import { Building2, Phone, Mail } from 'lucide-react';
import { COMPANY } from '@/data';

export default function Footer() {
  return (
    <footer className="bg-black text-white py-12">
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 items-start">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-white/10">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <span className="block text-[9px] tracking-[3px] font-medium text-white/60">{COMPANY.tagline}</span>
                <span className="block text-lg font-bold">{COMPANY.name}</span>
              </div>
            </div>
            <p className="text-sm text-white/50 max-w-xs">
              Administración profesional de consorcios en Ciudad Autónoma de Buenos Aires.
            </p>
          </div>
          <div className="flex flex-col gap-2 text-sm">
            <p className="text-xs text-white/40 uppercase tracking-wide mb-1">Contacto</p>
            <a href={COMPANY.phoneHref} className="flex items-center gap-2 hover:text-white/80 transition-colors">
              <Phone className="w-4 h-4" /> {COMPANY.phone}
            </a>
            <a href={`mailto:${COMPANY.email}`} className="flex items-center gap-2 hover:text-white/80 transition-colors break-all">
              <Mail className="w-4 h-4" /> {COMPANY.email}
            </a>
          </div>
          <div className="flex flex-col gap-2 text-sm">
            <p className="text-xs text-white/40 uppercase tracking-wide mb-1">Navegación</p>
            <a href="#servicios" className="hover:text-white/80 transition-colors">Servicios</a>
            <a href="#promo" className="hover:text-white/80 transition-colors">Promoción</a>
            <a href="#blog" className="hover:text-white/80 transition-colors">Blog</a>
            <a href="#contacto" className="hover:text-white/80 transition-colors">Solicitar presupuesto</a>
          </div>
        </div>
        <div className="border-t border-white/10 mt-8 pt-6 flex flex-col sm:flex-row justify-between gap-2 text-xs text-white/40">
          <p>© {new Date().getFullYear()} {COMPANY.name}. Todos los derechos reservados.</p>
          <p>Administración de consorcios — CABA</p>
        </div>
      </div>
    </footer>
  );
}
