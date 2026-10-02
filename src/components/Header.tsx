import { useState, useEffect } from 'react';
import { Menu, X, Phone, Mail, ChevronDown, Building2 } from 'lucide-react';
import { COMPANY } from '@/data';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const closeAll = () => {
    setMenuOpen(false);
    setContactOpen(false);
  };

  const navItems = [
    { label: 'Servicios', href: '#servicios' },
    { label: 'Promoción', href: '#promo' },
    { label: 'Blog', href: '#blog' },
  ];

  return (
    <>
      {/* Top bar */}
      <div className="bg-black text-white">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 flex items-center justify-between py-3 gap-4">
          <a href="#inicio" className="flex items-center gap-3 text-white">
            <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-white/10">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="block text-[9px] tracking-[3px] font-medium text-white/70">{COMPANY.tagline}</span>
              <span className="block text-lg font-bold leading-tight">{COMPANY.name}</span>
            </div>
          </a>
          <div className="hidden sm:flex flex-col items-end gap-0.5 text-xs">
            <a href={COMPANY.phoneHref} className="flex items-center gap-1.5 hover:text-white/80 transition-colors">
              <Phone className="w-3.5 h-3.5" /> {COMPANY.phone}
            </a>
            <a href={`mailto:${COMPANY.email}`} className="flex items-center gap-1.5 hover:text-white/80 transition-colors">
              <Mail className="w-3.5 h-3.5" /> {COMPANY.email}
            </a>
          </div>
        </div>
      </div>

      {/* Nav bar */}
      <nav
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-blue-950/95 backdrop-blur-md shadow-lg'
            : 'bg-blue-950/80 backdrop-blur-sm'
        }`}
      >
        <div className="max-w-7xl mx-auto px-5 sm:px-8 flex items-center justify-between py-3.5">
          <div className="sm:hidden text-white text-sm font-semibold">{COMPANY.name}</div>

          <div className="hidden sm:flex items-center gap-8 text-xs font-medium tracking-wide text-white">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="hover:text-blue-200 transition-colors uppercase"
              >
                {item.label}
              </a>
            ))}
            <div className="relative">
              <button
                onClick={() => setContactOpen(!contactOpen)}
                className="flex items-center gap-1.5 hover:text-blue-200 transition-colors uppercase"
              >
                Contacto
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${contactOpen ? 'rotate-180' : ''}`} />
              </button>
              {contactOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setContactOpen(false)} />
                  <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-lg shadow-xl py-2 z-50 border border-gray-100">
                    <a href="#contacto" onClick={closeAll} className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-900 transition-colors">Pedir presupuesto</a>
                    <a href={COMPANY.whatsapp} target="_blank" rel="noopener" onClick={closeAll} className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-900 transition-colors">WhatsApp</a>
                    <a href={COMPANY.phoneHref} onClick={closeAll} className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-900 transition-colors">Llamar</a>
                    <a href={`mailto:${COMPANY.email}`} onClick={closeAll} className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-900 transition-colors">Email</a>
                  </div>
                </>
              )}
            </div>
            <a
              href="#contacto"
              className="bg-white text-blue-950 px-5 py-2.5 rounded-md font-bold text-xs uppercase hover:bg-blue-100 transition-colors"
            >
              Solicitar presupuesto
            </a>
          </div>

          <button
            className="sm:hidden text-white p-2"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Abrir menú"
          >
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="sm:hidden bg-blue-950 border-t border-white/10 px-5 py-4 flex flex-col gap-3 text-white text-sm">
            {navItems.map((item) => (
              <a key={item.href} href={item.href} onClick={closeAll} className="py-1.5 uppercase tracking-wide hover:text-blue-200 transition-colors">
                {item.label}
              </a>
            ))}
            <div className="border-t border-white/10 pt-3 flex flex-col gap-2">
              <a href="#contacto" onClick={closeAll} className="py-1.5 uppercase tracking-wide hover:text-blue-200">Pedir presupuesto</a>
              <a href={COMPANY.whatsapp} target="_blank" rel="noopener" onClick={closeAll} className="py-1.5 hover:text-blue-200">WhatsApp</a>
              <a href={COMPANY.phoneHref} onClick={closeAll} className="py-1.5 hover:text-blue-200">{COMPANY.phone}</a>
              <a href={`mailto:${COMPANY.email}`} onClick={closeAll} className="py-1.5 hover:text-blue-200">{COMPANY.email}</a>
            </div>
          </div>
        )}
      </nav>
    </>
  );
}
