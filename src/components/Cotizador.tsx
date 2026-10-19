import { useMemo, useState, type FormEvent } from 'react';
import emailjs from '@emailjs/browser';
import { Calculator, Info, Lock, Send, AlertCircle, CheckCircle2 } from 'lucide-react';
import { CLASES, VIGENCIA } from '@/data';
import { calcularHonorario, pesos, ufFmt, IVA, PROMO_DESCUENTO, PROMO_MESES } from '@/lib/honorarios';

// Mismas credenciales de EmailJS que usa el formulario de contacto
const EMAILJS_SERVICE = 'service_5ek5yi8';
const EMAILJS_TEMPLATE = 'template_z9zzwuh';
const EMAILJS_PUBLIC_KEY = '1AfSE-UEasrdqsAPz';

type Paso = 'datos' | 'enviando' | 'listo';

// Clases que se muestran en el cotizador (las demás quedan en data.ts para uso futuro)
const CLASES_VISIBLES = CLASES.filter((c) => ['D', 'C'].includes(c.id));

export default function Cotizador() {
  const [claseId, setClaseId] = useState('C');
  const [unidades, setUnidades] = useState(20);
  const [complementarias, setComplementarias] = useState(0);
  const [conIva, setConIva] = useState(true);
  const [esNuevo, setEsNuevo] = useState(true);

  const [paso, setPaso] = useState<Paso>('datos');
  const [errorEnvio, setErrorEnvio] = useState(false);
  const [contacto, setContacto] = useState({ nombre: '', email: '', telefono: '', direccion: '' });

  const clase = CLASES_VISIBLES.find((c) => c.id === claseId)!;
  const r = useMemo(() => calcularHonorario(clase, unidades, complementarias), [clase, unidades, complementarias]);

  const factorIva = conIva ? 1 + IVA : 1;
  const mensual = r.neto * factorIva;
  const mensualPromo = mensual * (1 - PROMO_DESCUENTO);
  const ahorroPromo = (mensual - mensualPromo) * PROMO_MESES;
  const anual = esNuevo ? mensualPromo * PROMO_MESES + mensual * (12 - PROMO_MESES) : mensual * 12;
  const unidadesValidas = unidades > 0;

  const resumenMail = () =>
    [
      'Presupuesto calculado desde la web:',
      `- ${clase.nombre} · ${unidades} UF + ${complementarias} cocheras/bauleras (${ufFmt(r.ufTotales)} UF)`,
      `- Honorario mensual: ${pesos(mensual)} ${conIva ? 'con IVA' : 'sin IVA'}`,
      esNuevo
        ? `- Consorcio nuevo (20% OFF): ${pesos(mensualPromo)} los primeros ${PROMO_MESES} meses`
        : '- Consorcio existente (sin promo)',
      `- Costo anual estimado: ${pesos(anual)}`,
    ].join('\n');

  const enviar = async (e: FormEvent) => {
    e.preventDefault();
    if (!unidadesValidas) return;
    setPaso('enviando');
    setErrorEnvio(false);
    try {
      await emailjs.send(
        EMAILJS_SERVICE,
        EMAILJS_TEMPLATE,
        {
          nombre: contacto.nombre,
          email: contacto.email,
          telefono: contacto.telefono,
          direccion: contacto.direccion || 'No especificada',
          mensaje: resumenMail(),
        },
        EMAILJS_PUBLIC_KEY,
      );
      setPaso('listo');
    } catch (err) {
      console.error('Error al enviar cotización:', err);
      setErrorEnvio(true);
      setPaso('datos');
    }
  };

  const numInput =
    'w-full bg-white border border-gray-300 rounded-lg py-2.5 px-3 text-sm text-gray-900 focus:border-blue-900 focus:outline-none transition-colors';
  const txtInput =
    'w-full bg-white/10 border border-white/20 rounded-lg py-2.5 px-3 text-sm text-white placeholder-blue-200/50 focus:border-white focus:outline-none transition-colors';

  return (
    <section id="cotizador" className="bg-white py-20 sm:py-28">
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 text-blue-900 mb-3">
            <Calculator className="w-5 h-5" />
            <span className="text-xs tracking-[2px] uppercase font-bold">Cotizador online</span>
          </div>
          <div className="w-16 h-0.5 bg-blue-900 mx-auto mb-6" />
          <h2 className="text-3xl sm:text-4xl font-light text-gray-900 mb-4">
            ¿Cuánto cuesta <span className="font-bold">administrar tu edificio?</span>
          </h2>
          <p className="text-sm text-gray-500 max-w-xl mx-auto">
            Calculá una estimación del honorario mensual según la tabla de honorarios sugeridos
            vigente ({VIGENCIA}). La propuesta final la confirmamos por escrito tras visitar el edificio.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Entradas */}
          <div className="lg:col-span-3 space-y-7">
            <fieldset disabled={paso === 'enviando'}>
              <legend className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
                1. Tipo de edificio
              </legend>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {CLASES_VISIBLES.map((c) => {
                  const sel = c.id === claseId;
                  return (
                    <button
                      type="button"
                      key={c.id}
                      onClick={() => setClaseId(c.id)}
                      className={`text-left rounded-xl border p-4 transition-all ${
                        sel ? 'border-blue-900 bg-blue-50 ring-1 ring-blue-900' : 'border-gray-200 hover:border-blue-300'
                      }`}
                    >
                      <div className="flex items-baseline justify-between gap-2 mb-1">
                        <span className="font-semibold text-gray-900 text-sm">{c.nombre}</span>
                        <span className="text-xs text-gray-500">desde {pesos(c.minimo)}</span>
                      </div>
                      <p className="text-xs text-gray-600 leading-relaxed">{c.descripcion}</p>
                    </button>
                  );
                })}
              </div>
              <p className="flex gap-2 text-xs text-gray-600 mt-3 leading-relaxed">
                <Info className="w-4 h-4 flex-shrink-0 text-blue-900" />
                <span>
                  ¿Tu edificio tiene amenities, servicios centrales u otras prestaciones? Tenemos honorarios
                  para otros tipos de consorcio.{' '}
                  <a href="#contacto" className="text-blue-900 font-semibold underline">Consultanos por un presupuesto a medida</a>.
                </span>
              </p>
            </fieldset>

            <fieldset disabled={paso === 'enviando'}>
              <legend className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
                2. Unidades
              </legend>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <label className="flex flex-col gap-1.5 text-xs text-gray-600">
                  Departamentos / locales / oficinas *
                  <input
                    type="number" min={1} max={2000} inputMode="numeric"
                    value={unidades}
                    onChange={(e) => setUnidades(Math.max(0, Number(e.target.value) || 0))}
                    className={numInput}
                  />
                </label>
                <label className="flex flex-col gap-1.5 text-xs text-gray-600">
                  Cocheras y bauleras (cuentan ½ UF)
                  <input
                    type="number" min={0} max={2000} inputMode="numeric"
                    value={complementarias}
                    onChange={(e) => setComplementarias(Math.max(0, Number(e.target.value) || 0))}
                    className={numInput}
                  />
                </label>
              </div>
            </fieldset>

            <fieldset disabled={paso === 'enviando'} className="flex flex-col sm:flex-row gap-4 sm:gap-8">
              <label className="flex items-center gap-2.5 text-sm text-gray-700 cursor-pointer">
                <input type="checkbox" checked={conIva} onChange={(e) => setConIva(e.target.checked)} className="w-4 h-4 accent-blue-900" />
                Mostrar con IVA (21%)
              </label>
              <label className="flex items-center gap-2.5 text-sm text-gray-700 cursor-pointer">
                <input type="checkbox" checked={esNuevo} onChange={(e) => setEsNuevo(e.target.checked)} className="w-4 h-4 accent-blue-900" />
                Consorcio nuevo (20% OFF los primeros {PROMO_MESES} meses)
              </label>
            </fieldset>
          </div>

          {/* Panel derecho: datos de contacto → resultado */}
          <div className="lg:col-span-2">
            <div className="bg-blue-950 text-white rounded-2xl p-7 sm:p-8 lg:sticky lg:top-24">
              {paso !== 'listo' ? (
                <form onSubmit={enviar} data-testid="form-cotizador">
                  <div className="flex items-center gap-2 mb-1">
                    <Lock className="w-4 h-4 text-blue-200" />
                    <p className="text-xs uppercase tracking-wide text-blue-200/70">3. Tus datos</p>
                  </div>
                  <p className="text-sm text-blue-100/90 mb-5">
                    Dejanos tus datos de contacto y te mostramos el presupuesto al instante.
                    También te lo enviamos por email.
                  </p>

                  <div className="space-y-3">
                    <input
                      type="text" required placeholder="Nombre y apellido *" autoComplete="name"
                      value={contacto.nombre}
                      onChange={(e) => setContacto({ ...contacto, nombre: e.target.value })}
                      className={txtInput}
                    />
                    <input
                      type="email" required placeholder="Email *" autoComplete="email"
                      value={contacto.email}
                      onChange={(e) => setContacto({ ...contacto, email: e.target.value })}
                      className={txtInput}
                    />
                    <input
                      type="tel" required placeholder="Teléfono *" autoComplete="tel" minLength={8}
                      value={contacto.telefono}
                      onChange={(e) => setContacto({ ...contacto, telefono: e.target.value })}
                      className={txtInput}
                    />
                    <input
                      type="text" placeholder="Dirección del edificio" autoComplete="street-address"
                      value={contacto.direccion}
                      onChange={(e) => setContacto({ ...contacto, direccion: e.target.value })}
                      className={txtInput}
                    />
                  </div>

                  {!unidadesValidas && (
                    <p className="flex gap-2 text-xs text-amber-200 mt-4">
                      <Info className="w-4 h-4 flex-shrink-0" /> Ingresá la cantidad de unidades del edificio.
                    </p>
                  )}
                  {errorEnvio && (
                    <p className="flex gap-2 text-xs text-red-200 mt-4">
                      <AlertCircle className="w-4 h-4 flex-shrink-0" />
                      No pudimos enviar tus datos. Intentá de nuevo o escribinos por WhatsApp.
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={paso === 'enviando' || !unidadesValidas}
                    className="w-full mt-5 inline-flex items-center justify-center gap-2 bg-white text-blue-950 font-bold text-sm uppercase px-6 py-3.5 rounded-md hover:bg-blue-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {paso === 'enviando' ? (
                      <>
                        <div className="w-4 h-4 border-2 border-blue-950 border-t-transparent rounded-full animate-spin" />
                        Enviando...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" /> Ver mi presupuesto
                      </>
                    )}
                  </button>
                  <p className="text-[11px] text-blue-200/60 mt-4 leading-relaxed">
                    Usamos tus datos solo para enviarte el presupuesto y contactarte por tu consulta.
                  </p>
                </form>
              ) : (
                <div data-testid="resultado-cotizador">
                  <p className="flex items-center gap-2 text-xs text-green-300 mb-4">
                    <CheckCircle2 className="w-4 h-4" /> Listo, {contacto.nombre.split(' ')[0]}. Te lo enviamos a {contacto.email}.
                  </p>
                  <p className="text-xs uppercase tracking-wide text-blue-200/70 mb-1">Honorario mensual estimado</p>
                  <p className="text-4xl font-bold mb-1">{pesos(mensual)}</p>
                  <p className="text-xs text-blue-200/70 mb-5">
                    {conIva ? `${pesos(r.neto)} + IVA` : 'Sin IVA'} · {ufFmt(r.ufTotales)} UF · {clase.nombre}
                  </p>

                  {esNuevo && (
                    <div className="bg-white/10 rounded-lg px-4 py-3 mb-5">
                      <p className="text-xs text-blue-100">Consorcio nuevo · 20% OFF los primeros {PROMO_MESES} meses</p>
                      <p className="text-xl font-bold">{pesos(mensualPromo)}<span className="text-xs font-normal text-blue-200"> /mes</span></p>
                      <p className="text-xs text-blue-200/70 mt-1">Ahorrás {pesos(ahorroPromo)} en total.</p>
                    </div>
                  )}

                  <div className="border-t border-white/10 pt-4 space-y-1.5 text-xs">
                    {r.lineas.map((l) => (
                      <div key={l.label} className="flex justify-between gap-3 text-blue-100/90">
                        <span>
                          {l.label}
                          {l.label.startsWith('UF') && <span className="text-blue-200/60"> ({ufFmt(l.uf)} × {pesos(l.valor)})</span>}
                        </span>
                        <span className="tabular-nums">{pesos(l.subtotal)}</span>
                      </div>
                    ))}
                    {conIva && (
                      <div className="flex justify-between gap-3 text-blue-100/90">
                        <span>IVA 21%</span>
                        <span className="tabular-nums">{pesos(r.neto * IVA)}</span>
                      </div>
                    )}
                    {esNuevo && (
                      <div className="flex justify-between gap-3 text-green-300">
                        <span>Descuento consorcio nuevo ({PROMO_MESES} meses)</span>
                        <span className="tabular-nums">−{pesos(ahorroPromo)}</span>
                      </div>
                    )}
                    <div className="flex justify-between gap-3 pt-2 font-semibold">
                      <span>Costo anual estimado</span>
                      <span className="tabular-nums">{pesos(anual)}</span>
                    </div>
                  </div>

                  {r.aviso && (
                    <p className="flex gap-2 text-xs text-amber-200 mt-4">
                      <Info className="w-4 h-4 flex-shrink-0" /> {r.aviso}
                    </p>
                  )}

                  <p className="text-[11px] text-blue-200/60 mt-5 leading-relaxed">
                    Valores orientativos. No incluyen impuestos provinciales, servicios informáticos,
                    comisiones de cobranza ni tareas que se cobran aparte (ver aranceles).
                    Podés seguir cambiando los datos del edificio y el presupuesto se actualiza.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
