const buckets = new Map();
const allowedTypes = new Set(['suggestion', 'correction', 'bug', 'confidentialite']);
function json(statusCode, body) { return { statusCode, headers: { 'content-type': 'application/json; charset=utf-8' }, body: JSON.stringify(body) }; }
exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') return json(405, { error: 'Méthode non autorisée.' });
  const ip = event.headers['x-nf-client-connection-ip'] || event.headers['client-ip'] || 'unknown';
  const now = Date.now(); const recent = (buckets.get(ip) || []).filter((t) => now - t < 15 * 60 * 1000);
  if (recent.length >= 3) return json(429, { error: 'Trop de messages envoyés. Réessayez plus tard.' });
  let data; try { data = JSON.parse(event.body || '{}'); } catch { return json(400, { error: 'Message illisible.' }); }
  if (data.company) return json(200, { ok: true });
  const name = String(data.name || '').trim().slice(0, 120);
  const email = String(data.email || '').trim().slice(0, 160);
  const type = String(data.type || '').trim();
  const page = String(data.page || '').trim().slice(0, 220);
  const message = String(data.message || '').trim();
  if (!allowedTypes.has(type)) return json(400, { error: 'Type de message invalide.' });
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return json(400, { error: 'Adresse email invalide.' });
  if (message.length < 20 || message.length > 3000) return json(400, { error: 'Le message doit contenir entre 20 et 3000 caractères.' });
  const to = process.env.CONTACT_TO_EMAIL || process.env.RECEPTION_EMAIL;
  if (!to) { console.warn('Contact form not sent: CONTACT_TO_EMAIL missing', { type, page }); return json(503, { error: 'Configuration d’envoi manquante. Utilisez l’email de secours.' }); }
  const subject = `[calcul-aah.fr] ${type} ${page || ''}`.slice(0, 140);
  const text = `Type: ${type}\nPage: ${page}\nNom: ${name}\nEmail: ${email}\nIP: ${ip}\n\n${message}`;
  try {
    if (process.env.RESEND_API_KEY) {
      const from = process.env.CONTACT_FROM_EMAIL || 'contact@calcul-aah.fr';
      const r = await fetch('https://api.resend.com/emails', { method: 'POST', headers: { authorization: `Bearer ${process.env.RESEND_API_KEY}`, 'content-type': 'application/json' }, body: JSON.stringify({ from, to, reply_to: email || undefined, subject, text }) });
      if (!r.ok) throw new Error(`Resend ${r.status}`);
    } else {
      console.info('Contact message received but no mail provider configured', { to, subject, preview: text.slice(0, 400) });
      return json(503, { error: 'Service d’envoi non configuré. Utilisez l’email de secours.' });
    }
    recent.push(now); buckets.set(ip, recent);
    return json(200, { ok: true });
  } catch (e) { console.error('Contact send failed', e); return json(502, { error: 'Envoi impossible pour le moment. Utilisez l’email de secours.' }); }
};
