import { useState, type FormEvent } from 'react';
import emailjs from '@emailjs/browser';
import { COMPANY } from '@/data';
import { CheckCircle2, AlertCircle, Send, Phone, Mail, MessageCircle } from 'lucide-react';

type Status = 'idle' | 'submitting' | 'success' | 'error';

export default function Contact() {
  const [status, setStatus] = useState<Status>('idle');
  const [form, setForm] = useState({
    nombre: '',
    email: '',
    telefono: '',
    direccion: '',
    mensaje: '',
  });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    console.log("Intentando enviar formulario..."); // <-- Agrega esta línea
    setStatus('submitting');
  // ... resto del código
}
    e.preventDefault();
    setStatus('submitting');

    try {
      // Reemplaza estos tres valores con tus credenciales reales de EmailJS
      await emailjs.send(
        'service_5ek5yi8',
        'template_z9zzwuh',
        {
          nombre: form.nombre,
          email: form.email,
          telefono: form.telefono || 'No especificado',
          direccion: form.direccion || 'No especificada',
          mensaje: form.mensaje || 'Sin mensaje',
        },
        '1AfSE-UEasrdqsAPz'
      );

      setStatus('success');
      setForm({ nombre: '', email: '', telefono: '', direccion: '', mensaje: '' });
    } catch (error) {
      console.error('Error al enviar correo:', error);
      setStatus('error');
    }
  };

  const inputClass =
    'w-full bg-transparent border-b border-gray-300 py-2 px-1 text-sm text-gray-900 placeholder-gray-400 focus:border-blue-900 focus:outline-none transition-colors';

  return (
    <section id="contacto" className="bg-gray-100 py-20 sm:py-28">
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Form */}
          <div className="lg:col-span-3">
            <h2 className="text-2xl sm:text-3xl font-light text-gray-900 mb-2">
              Solicitá tu <span className="font-bold">presupuesto</span>
            </h2>
            <div className="w-16 h-0.5 bg-blue-900 mb-5" />
            <p className="text-sm text-gray-600 leading-relaxed mb-8 max-w-lg">
              Completá tus datos y te contactamos con una cotización a medida para tu consorcio.
              Si sos un consorcio nuevo, tenés 20% de descuento los primeros 3 meses.
            </p>

            {status === 'success' && (
              <div className="flex items-start gap-3 bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-green-800">
                  ¡Gracias! Recibimos tu solicitud. Te contactaremos a la brevedad.
                </p>
              </div>
            )}

            {status === 'error' && (
              <div className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-800">
                  Ocurrió un error al enviar. Por favor, intentá nuevamente o contactanos directamente.
                </p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <label className="flex flex-col gap-1.5 text-xs text-gray-500">
                  Nombre y apellido *
                  <input
                    type="text"
                    required
                    value={form.nombre}
                    onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                    className={inputClass}
                  />
                </label>
                <label className="flex flex-col gap-1.5 text-xs text-gray-500">
                  Email *
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className={inputClass}
                  />
                </label>
                <label className="flex flex-col gap-1.5 text-xs text-gray-500">
                  Teléfono
                  <input
                    type="tel"
                    value={form.telefono}
                    onChange={(e) => setForm({ ...form, telefono: e.target.value })}
                    className={inputClass}
                  />
                </label>
                <label className="flex flex-col gap-1.5 text-xs text-gray-500">
                  Dirección del edificio
                  <input
                    type="text"
                    value={form.direccion}
                    onChange={(e) => setForm({ ...form, direccion: e.target.value })}
                    className={inputClass}
                  />
                </label>
              </div>
              <label className="flex flex-col gap-1.5 text-xs text-gray-500">
                Mensaje (opcional)
                <textarea
                  rows={3}
                  value={form.mensaje}
                  onChange={(e) => setForm({ ...form, mensaje: e.target.value })}
                  className="w-full bg-transparent border border-gray-300 rounded-lg py-2.5 px-3 text-sm text-gray-900 placeholder-gray-400 focus:border-blue-900 focus:outline-none transition-colors resize-none"
                />
              </label>
              <button
                type="submit"
                disabled={status === 'submitting'}
                className="inline-flex items-center gap-2 bg-blue-950 text-white font-semibold text-sm uppercase px-8 py-3.5 rounded-md hover:bg-blue-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {status === 'submitting' ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Enviando...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Enviar
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Direct contact card */}
          <div className="lg:col-span-2">
            <div className="bg-blue-950 text-white rounded-2xl p-8 lg:p-10 flex flex-col gap-6 h-full">
              <div>
                <p className="text-base font-semibold mb-1">¿Preferís hablar directamente?</p>
                <p className="text-sm text-blue-200/80">
                  Estamos disponibles de 9 a 17 hs para responder cualquier consulta.
                </p>
              </div>
              <div className="flex flex-col gap-4">
                <a href={COMPANY.phoneHref} className="flex items-center gap-3 group">
                  <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors">
                    <Phone className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-xl font-bold">{COMPANY.phone}</span>
                </a>
                <a href={`mailto:${COMPANY.email}`} className="flex items-center gap-3 group">
                  <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors">
                    <Mail className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-sm text-blue-100 break-all">{COMPANY.email}</span>
                </a>
                <a href={COMPANY.whatsapp} target="_blank" rel="noopener" className="flex items-center gap-3 group">
                  <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors">
                    <MessageCircle className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-sm text-blue-100">Escribinos por WhatsApp</span>
                </a>
              </div>
              <div className="border-t border-white/10 pt-5 mt-auto">
                <p className="text-xs text-blue-200/60 uppercase tracking-wide mb-1">{COMPANY.tagline}</p>
                <p className="text-sm font-semibold">{COMPANY.name}</p>
                <p className="text-xs text-blue-200/70 mt-1">{COMPANY.address}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
