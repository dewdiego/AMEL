// Portal del propietario · Grupo Amel
// La URL y la anon key de Supabase vienen de config.js, que se genera en el build con las variables de Cloudflare
// (VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY). Así no quedan en el repositorio.
const SUPABASE_URL = window.PORTAL_CONFIG?.url || '';
const SUPABASE_ANON_KEY = window.PORTAL_CONFIG?.key || '';

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
const sb = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const $ = (id) => document.getElementById(id);
const fmt = (n) => new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', minimumFractionDigits: 2 }).format(Number(n || 0));
const fdate = (d) => (d ? d.slice(0, 10).split('-').reverse().join('/') : '—');
const MESES = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
const periodo = (p) => { const [y, m] = p.split('-'); return `${MESES[Number(m) - 1]} ${y}`; };
const esc = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const vista = (v) => { for (const id of ['v-cargando', 'v-login', 'v-home']) $(id).classList.toggle('hidden', id !== v); $('btn-salir').classList.toggle('hidden', v !== 'v-home'); };
const msg = (el, texto, tipo = 'err') => { el.innerHTML = texto ? `<div class="msg ${tipo}">${texto}</div>` : ''; };

/** Llama a la Edge Function "portal" con la sesión actual */
async function portal(body) {
  const { data: { session } } = await sb.auth.getSession();
  const { data, error } = await sb.functions.invoke('portal', { body, headers: session ? { Authorization: `Bearer ${session.access_token}` } : {} });
  if (error) {
    let detalle = '';
    try { detalle = await error.context?.text(); } catch { /* noop */ }
    throw new Error(detalle || error.message || 'No se pudo conectar con el servidor.');
  }
  if (data?.error) throw new Error(data.error);
  return data;
}

// ---------------- Ingreso ----------------
let mailActual = '';
$('btn-codigo').onclick = async () => {
  const email = $('in-mail').value.trim().toLowerCase();
  msg($('login-msg'), '');
  if (!email.includes('@')) return msg($('login-msg'), 'Ingresá un mail válido.');
  $('btn-codigo').disabled = true;
  try {
    const v = await portal({ accion: 'verificar', email });
    if (!v.ok) throw new Error(v.error);
    const { error } = await sb.auth.signInWithOtp({ email, options: { shouldCreateUser: true } });
    if (error) throw new Error(error.message.includes('rate') ? 'Demasiados intentos. Esperá un minuto y volvé a probar.' : error.message);
    mailActual = email;
    $('mail-dest').textContent = email;
    $('paso-mail').classList.add('hidden'); $('paso-codigo').classList.remove('hidden');
    $('in-codigo').focus();
  } catch (e) { msg($('login-msg'), e.message); }
  $('btn-codigo').disabled = false;
};
$('btn-entrar').onclick = async () => {
  const token = $('in-codigo').value.replace(/\D/g, '');
  if (token.length !== 6) return msg($('login-msg'), 'El código tiene 6 dígitos.');
  $('btn-entrar').disabled = true; msg($('login-msg'), '');
  const { error } = await sb.auth.verifyOtp({ email: mailActual, token, type: 'email' });
  $('btn-entrar').disabled = false;
  if (error) return msg($('login-msg'), 'Código incorrecto o vencido. Pedí uno nuevo.');
  await cargarHome();
};
$('btn-otro').onclick = () => { $('paso-codigo').classList.add('hidden'); $('paso-mail').classList.remove('hidden'); msg($('login-msg'), ''); };
$('in-codigo').addEventListener('input', (e) => { if (e.target.value.replace(/\D/g, '').length === 6) $('btn-entrar').click(); });
$('btn-salir').onclick = async () => { await sb.auth.signOut(); location.reload(); };

// ---------------- Home ----------------
let datos = null;
async function cargarHome() {
  vista('v-cargando');
  try {
    datos = await portal({ accion: 'mis-datos' });
  } catch (e) {
    await sb.auth.signOut();
    vista('v-login'); msg($('login-msg'), e.message);
    return;
  }
  $('hdr-sub').textContent = datos.email;
  renderExpensas(); renderComunicados(); renderAdmin();
  await estadoPush();
  vista('v-home');
}

function renderExpensas() {
  const el = $('tab-expensas'); el.innerHTML = '';
  for (const u of datos.unidades) {
    const e = u.expensa, c = e?.cupon;
    const estado = !c ? '' : c.estado === 'pagado' ? '<span class="pill ok">Pagada</span>' : c.estado === 'parcial' ? '<span class="pill parcial">Pago parcial</span>' : '<span class="pill deuda">Pendiente</span>';
    el.insertAdjacentHTML('beforeend', `
      <div class="card">
        <h2>${esc(u.consorcio)}</h2>
        <div class="mut">UF ${u.uf} · ${esc(u.depto)} · ${u.rol === 'propietario' ? 'Propietario/a' : 'Inquilino/a'}${u.nombre ? ` · ${esc(u.nombre)}` : ''}</div>
        ${e ? `
          <h3>Expensas ${periodo(e.periodo)} ${estado}</h3>
          ${c ? `
            <div class="big">${fmt(c.total)}</div>
            <div class="mut">hasta el ${fdate(e.vencimiento_1)}${e.vencimiento_2 && Number(c.total_2do_venc) !== Number(c.total) ? ` · ${fmt(c.total_2do_venc)} hasta el ${fdate(e.vencimiento_2)}` : ''}</div>
            ${Number(c.saldo_anterior) ? `<div class="row"><span class="mut">Saldo anterior</span><b style="color:${c.saldo_anterior > 0 ? 'var(--red)' : 'var(--green)'}">${fmt(c.saldo_anterior)}</b></div>` : ''}
            ${Number(c.intereses) ? `<div class="row"><span class="mut">Intereses</span><b>${fmt(c.intereses)}</b></div>` : ''}
          ` : '<p class="mut">Tu cupón todavía no está disponible.</p>'}
          ${e.pdf_url ? `<a class="primary" style="margin-top:12px" href="${e.pdf_url}" target="_blank" rel="noopener">Ver liquidación (PDF)</a>` : ''}
        ` : '<p class="mut">Todavía no hay expensas publicadas.</p>'}
        ${u.pagos?.length ? `<h3>Últimos pagos</h3>${u.pagos.map((p) => `<div class="row"><span class="mut">${fdate(p.fecha)} · ${esc(p.metodo)}</span><b>${fmt(p.monto)}</b></div>`).join('')}` : ''}
      </div>`);
  }
}

function renderComunicados() {
  const el = $('tab-comunicados');
  if (!datos.comunicados.length) { el.innerHTML = '<div class="card"><p class="mut center">No hay comunicados por ahora.</p></div>'; return; }
  el.innerHTML = `<div class="card">${datos.comunicados.map((c) => `
    <div class="com">
      <div class="t">${esc(c.titulo)}</div>
      <div class="d">${fdate(c.fecha_publicacion)} · ${esc(c.consorcio)}${c.tipo && c.tipo !== 'general' ? ` · ${esc(c.tipo)}` : ''}</div>
      <div class="c">${esc(c.contenido)}</div>
      ${c.adjunto_url ? `<a href="${c.adjunto_url}" target="_blank" rel="noopener">Ver adjunto</a>` : ''}
    </div>`).join('')}</div>`;
}

function renderAdmin() {
  const a = datos.administracion || {};
  $('card-admin').innerHTML = `<h2>${esc(a.nombre || 'Administración')}</h2>
    ${a.telefono ? `<div class="row"><span class="mut">Teléfono</span><a href="tel:${esc(a.telefono)}">${esc(a.telefono)}</a></div>` : ''}
    ${a.email ? `<div class="row"><span class="mut">Mail</span><a href="mailto:${esc(a.email)}">${esc(a.email)}</a></div>` : ''}`;
}

// ---------------- Tabs ----------------
document.querySelectorAll('.tabs button').forEach((b) => b.onclick = () => {
  document.querySelectorAll('.tabs button').forEach((x) => x.classList.toggle('on', x === b));
  for (const t of ['expensas', 'comunicados', 'avisos']) $(`tab-${t}`).classList.toggle('hidden', t !== b.dataset.tab);
});

// ---------------- Instalación y push ----------------
let promptInstalar = null;
window.addEventListener('beforeinstallprompt', (e) => { e.preventDefault(); promptInstalar = e; $('btn-instalar').classList.remove('hidden'); });
$('btn-instalar').onclick = async () => { if (promptInstalar) { promptInstalar.prompt(); promptInstalar = null; $('btn-instalar').classList.add('hidden'); } };

const esIOS = /iPhone|iPad|iPod/.test(navigator.userAgent);
const instalada = window.matchMedia('(display-mode: standalone)').matches || navigator.standalone === true;
let swReg = null;
if ('serviceWorker' in navigator) navigator.serviceWorker.register('/portal/sw.js').then((r) => { swReg = r; }).catch(() => {});

const b64ToU8 = (b64) => { const s = (b64 + '='.repeat((4 - b64.length % 4) % 4)).replace(/-/g, '+').replace(/_/g, '/'); const raw = atob(s); return Uint8Array.from([...raw].map((c) => c.charCodeAt(0))); };

async function estadoPush() {
  const est = $('avisos-estado');
  if (!('PushManager' in window) || !('Notification' in window)) {
    est.textContent = esIOS && !instalada ? 'Para recibir avisos en iPhone hay que instalar el portal en la pantalla de inicio.' : 'Este navegador no soporta notificaciones.';
    $('ios-ayuda').classList.toggle('hidden', !(esIOS && !instalada));
    $('btn-push').classList.add('hidden');
    return;
  }
  const reg = swReg || await navigator.serviceWorker.ready;
  const sub = await reg.pushManager.getSubscription();
  const activas = Notification.permission === 'granted' && !!sub;
  est.textContent = activas ? 'Notificaciones activadas en este dispositivo.' : datos.dispositivos > 0 ? `Tenés avisos activos en ${datos.dispositivos} dispositivo(s), pero no en este.` : 'Todavía no activaste las notificaciones.';
  est.className = `msg ${activas ? 'ok' : 'info'}`;
  $('btn-push').classList.toggle('hidden', activas);
  $('btn-push-off').classList.toggle('hidden', !activas);
}

$('btn-push').onclick = async () => {
  const est = $('avisos-estado');
  try {
    $('btn-push').disabled = true;
    const perm = await Notification.requestPermission();
    if (perm !== 'granted') throw new Error('No diste permiso para las notificaciones. Podés habilitarlas desde la configuración del navegador.');
    const { clave } = await portal({ accion: 'vapid' });
    if (!clave) throw new Error('La administración todavía no habilitó las notificaciones.');
    const reg = swReg || await navigator.serviceWorker.ready;
    const sub = await reg.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: b64ToU8(clave) });
    await portal({ accion: 'suscribir', suscripcion: sub.toJSON(), ua: navigator.userAgent });
    datos.dispositivos++;
    await estadoPush();
  } catch (e) { est.className = 'msg err'; est.textContent = e.message; }
  $('btn-push').disabled = false;
};
$('btn-push-off').onclick = async () => {
  const reg = swReg || await navigator.serviceWorker.ready;
  const sub = await reg.pushManager.getSubscription();
  if (sub) { await portal({ accion: 'desuscribir', endpoint: sub.endpoint }).catch(() => {}); await sub.unsubscribe(); datos.dispositivos = Math.max(0, datos.dispositivos - 1); }
  await estadoPush();
};

// ---------------- Arranque ----------------
(async () => {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) { vista('v-login'); msg($('login-msg'), 'El portal no está configurado (faltan las variables de Supabase en el build).'); return; }
  const { data: { session } } = await sb.auth.getSession();
  if (session) await cargarHome(); else vista('v-login');
})();
