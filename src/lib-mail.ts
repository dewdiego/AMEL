/*
  Click en el mail: un "mailto:" no hace nada en una PC sin programa de correo configurado (muy común).
  Esto intenta abrir el correo y, en el mismo click, copia la dirección y avisa; en escritorio además ofrece Gmail.
*/
export function abrirMail(email: string, asunto = 'Consulta desde la web') {
  const esMovil = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
  const mailto = `mailto:${email}?subject=${encodeURIComponent(asunto)}`;
  if (esMovil) { window.location.href = mailto; return; }
  navigator.clipboard?.writeText(email).catch(() => {});
  aviso(email, mailto, asunto);
}

function aviso(email: string, mailto: string, asunto: string) {
  document.getElementById('aviso-mail')?.remove();
  const d = document.createElement('div');
  d.id = 'aviso-mail';
  d.style.cssText = 'position:fixed;left:50%;bottom:24px;transform:translateX(-50%);background:#1e3a8a;color:#fff;padding:14px 18px;border-radius:12px;box-shadow:0 10px 30px rgba(0,0,0,.25);z-index:9999;font-size:14px;max-width:92vw;display:flex;flex-direction:column;gap:8px;align-items:center';
  const gmail = `https://mail.google.com/mail/?view=cm&to=${encodeURIComponent(email)}&su=${encodeURIComponent(asunto)}`;
  d.innerHTML = `<div><b>${email}</b> — dirección copiada ✓</div>
    <div style="display:flex;gap:8px;flex-wrap:wrap;justify-content:center">
      <a href="${gmail}" target="_blank" rel="noopener" style="background:#fff;color:#1e3a8a;padding:6px 12px;border-radius:8px;font-weight:600;text-decoration:none">Escribir desde Gmail</a>
      <a href="${mailto}" style="background:rgba(255,255,255,.15);color:#fff;padding:6px 12px;border-radius:8px;font-weight:600;text-decoration:none">Abrir mi correo</a>
      <button id="aviso-mail-x" style="background:transparent;color:#fff;border:0;opacity:.8;cursor:pointer">Cerrar</button>
    </div>`;
  document.body.appendChild(d);
  d.querySelector('#aviso-mail-x')?.addEventListener('click', () => d.remove());
  setTimeout(() => d.remove(), 12000);
}
