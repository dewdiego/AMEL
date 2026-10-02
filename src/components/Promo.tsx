import { PROMO_IMAGE } from '@/data';

export default function Promo() {
  return (
    <section id="promo" className="py-16 sm:py-24 bg-white">
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 rounded-2xl overflow-hidden shadow-xl bg-blue-950">
          <div className="relative h-64 sm:h-80 lg:h-auto order-1 lg:order-1">
            <img
              src={PROMO_IMAGE}
              alt="Escritorio con cuaderno y notebook"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex flex-col justify-center gap-5 p-8 sm:p-12 lg:p-16 text-white order-2">
            <p className="text-5xl sm:text-7xl font-bold leading-none">20% OFF</p>
            <p className="text-lg sm:text-2xl font-semibold leading-snug text-blue-100">
              Durante 3 meses para nuevos consorcios.
            </p>
            <p className="text-sm text-blue-200/80 max-w-md">
              Contratá el servicio de administración y obtené un descuento
              del 20% durante los primeros tres meses.
            </p>
            <a
              href="#contacto"
              className="inline-flex items-center self-start bg-white text-blue-950 font-bold text-sm uppercase px-7 py-4 rounded-md hover:bg-blue-50 transition-colors mt-2"
            >
              Pedí tu presupuesto
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
