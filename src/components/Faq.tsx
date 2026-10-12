import { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { FAQ } from '@/data';

export default function Faq() {
  const [abierta, setAbierta] = useState<number | null>(0);

  return (
    <section id="faq" className="bg-white py-20 sm:py-28">
      <div className="max-w-3xl mx-auto px-5 sm:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 text-blue-900 mb-3">
            <HelpCircle className="w-5 h-5" />
            <span className="text-xs tracking-[2px] uppercase font-bold">Preguntas frecuentes</span>
          </div>
          <div className="w-16 h-0.5 bg-blue-900 mx-auto" />
        </div>

        <div className="divide-y divide-gray-200 border-y border-gray-200">
          {FAQ.map((f, i) => {
            const open = abierta === i;
            return (
              <div key={f.q}>
                <button
                  type="button"
                  onClick={() => setAbierta(open ? null : i)}
                  className="w-full flex items-center justify-between gap-4 py-5 text-left"
                  aria-expanded={open}
                >
                  <span className="font-semibold text-gray-900">{f.q}</span>
                  <ChevronDown className={`w-5 h-5 text-blue-900 flex-shrink-0 transition-transform ${open ? 'rotate-180' : ''}`} />
                </button>
                {open && <p className="pb-5 text-sm text-gray-600 leading-relaxed">{f.a}</p>}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
