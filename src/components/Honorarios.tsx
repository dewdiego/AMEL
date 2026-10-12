import { useState } from 'react';
import { Building, Gauge, ListChecks, Wrench, CheckCircle2, ChevronDown, Receipt } from 'lucide-react';
import { FACTORES_HONORARIO, CHECKLIST_COMPARAR, ARANCELES, VIGENCIA } from '@/data';

const iconos = [Building, Gauge, ListChecks, Wrench];

export default function Honorarios() {
  const [verAranceles, setVerAranceles] = useState(false);

  return (
    <section id="honorarios" className="bg-gray-50 py-20 sm:py-28">
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        <div className="text-center mb-14">
          <p className="text-xs tracking-[2px] uppercase font-bold text-blue-900 mb-3">Honorarios</p>
          <div className="w-16 h-0.5 bg-blue-900 mx-auto mb-6" />
          <h2 className="text-3xl sm:text-4xl font-light text-gray-900 mb-4">
            Qué define el <span className="font-bold">honorario</span>
          </h2>
          <p className="text-sm text-gray-500 max-w-xl mx-auto">
            En CABA no hay un arancel obligatorio: lo aprueba la asamblea. Tomamos como referencia la tabla
            de honorarios sugeridos de las cámaras del sector, que se actualiza cada dos meses.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-14">
          {FACTORES_HONORARIO.map((f, i) => {
            const Icon = iconos[i];
            return (
              <div key={f.titulo} className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
                <Icon className="w-6 h-6 text-blue-900 mb-4" />
                <h3 className="font-semibold text-gray-900 mb-2">{f.titulo}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{f.texto}</p>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-2xl p-7 sm:p-9 border border-gray-100 shadow-sm">
            <h3 className="text-xl font-semibold text-gray-900 mb-5">Antes de comparar propuestas</h3>
            <ul className="space-y-3">
              {CHECKLIST_COMPARAR.map((item) => (
                <li key={item} className="flex gap-3 text-sm text-gray-700">
                  <CheckCircle2 className="w-5 h-5 text-blue-900 flex-shrink-0" /> {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white rounded-2xl p-7 sm:p-9 border border-gray-100 shadow-sm">
            <div className="flex items-start gap-3 mb-3">
              <Receipt className="w-6 h-6 text-blue-900 flex-shrink-0" />
              <div>
                <h3 className="text-xl font-semibold text-gray-900">Tareas que se cobran aparte</h3>
                <p className="text-xs text-gray-500 mt-1">Aranceles de referencia · {VIGENCIA} · sin IVA</p>
              </div>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed mb-4">
              Obras, gestiones judiciales y trámites especiales no forman parte del honorario mensual.
              Se presupuestan por separado y siempre con aprobación previa.
            </p>
            <button
              type="button"
              onClick={() => setVerAranceles(!verAranceles)}
              className="flex items-center gap-1 text-sm font-semibold text-blue-900 hover:text-blue-700"
            >
              {verAranceles ? 'Ocultar aranceles' : 'Ver aranceles'}
              <ChevronDown className={`w-4 h-4 transition-transform ${verAranceles ? 'rotate-180' : ''}`} />
            </button>
            {verAranceles && (
              <div className="mt-5 space-y-5">
                {ARANCELES.map((g) => (
                  <div key={g.grupo}>
                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">{g.grupo}</p>
                    <table className="w-full text-sm">
                      <tbody>
                        {g.items.map((it) => (
                          <tr key={it.concepto} className="border-b border-gray-100 last:border-0">
                            <td className="py-2 pr-3 text-gray-700">{it.concepto}</td>
                            <td className="py-2 text-right text-gray-900 font-medium whitespace-nowrap">{it.valor}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
