const crypto = require('crypto');
const buckets = new Map();
const allowedTypes = new Set(['suggestion', 'correction', 'bug', 'confidentialite']);
function json(statusCode, body, headers = {}) { return { statusCode, headers: { 'content-type': 'application/json; charset=utf-8', ...headers }, body: JSON.stringify(body) }; }
function secret(){ return process.env.CSRF_SECRET || process.env.RESEND_API_KEY || 'dev-csrf-secret-change-me'; }
function sign(ts, nonce){ return crypto.createHmac('sha256', secret()).update(`${ts}.${nonce}`).digest('hex'); }
function verify(token){ const [ts, nonce, mac] = String(token||'').split('.'); if(!ts||!nonce||!mac) return false; if(Date.now()-Number(ts)>60*60*1000) return false; return crypto.timingSafeEqual(Buffer.from(mac), Buffer.from(sign(ts, nonce))); }
async function verifyRecaptcha(token, ip){ if(!process.env.RECAPTCHA_SECRET) return true; if(!token) return false; const body=new URLSearchParams({secret:process.env.RECAPTCHA_SECRET,response:token,remoteip:ip}); const r=await fetch('https://www.google.com/recaptcha/api/siteverify',{method:'POST',body}); const j=await r.json().catch(()=>({success:false})); return !!j.success && (j.score === undefined || j.score >= 0.5); }
exports.handler = async (event) => {
  if (event.httpMethod === 'GET') { const ts=Date.now().toString(); const nonce=crypto.randomBytes(12).toString('hex'); return json(200,{csrfToken:`${ts}.${nonce}.${sign(ts,nonce)}`, recaptchaSiteKey:process.env.RECAPTCHA_SITE_KEY||''}); }
  if (event.httpMethod !== 'POST') return json(405, { error: 'Méthode non autorisée.' });
  const ip = event.headers['x-nf-client-connection-ip'] || event.headers['client-ip'] || event.headers['x-forwarded-for'] || 'unknown';
  const now = Date.now(); const recent = (buckets.get(ip) || []).filter((t) => now - t < 15 * 60 * 1000);
  if (recent.length >= 3) return json(429, { error: 'Trop de messages envoyés. Réessayez plus tard.' });
  let data; try { data = JSON.parse(event.body || '{}'); } catch { return json(400, { error: 'Message illisible.' }); }
  if (data.company) return json(200, { ok: true });
  if (!verify(data.csrfToken)) return json(403, { error: 'Session expirée. Rechargez la page puis réessayez.' });
  if (!data.consent) return json(400, { error: 'Le consentement est obligatoire pour envoyer le formulaire.' });
  if (!(await verifyRecaptcha(data.recaptchaToken, ip))) return json(403, { error: 'Validation anti-spam impossible.' });
  const name = String(data.name || '').trim().slice(0, 120);
  const email = String(data.email || '').trim().slice(0, 160);
  const type = String(data.type || '').trim();
  const page = String(data.page || '').trim().slice(0, 220);
  const message = String(data.message || '').trim();
  if (!allowedTypes.has(type)) return json(400, { error: 'Type de message invalide.' });
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return json(400, { error: 'Adresse email invalide.' });
  if (message.length < 20 || message.length > 3000) return json(400, { error: 'Le message doit contenir entre 20 et 3000 caractères.' });
  const to = process.env.CONTACT_TO_EMAIL || process.env.RECEPTION_EMAIL || 'laloumaxime951@gmail.com';
  const subject = `[calcul-aah.fr] ${type} ${page || ''}`.slice(0, 140);
  const text = `Type: ${type}\nPage: ${page}\nNom: ${name}\nEmail: ${email}\nIP: ${ip}\n\n${message}`;
  try {
    if (!process.env.RESEND_API_KEY) return json(503, { error: 'Service d’envoi non configuré. Utilisez l’email de secours.' });
    const from = process.env.CONTACT_FROM_EMAIL || 'contact@calcul-aah.fr';
    const r = await fetch('https://api.resend.com/emails', { method: 'POST', headers: { authorization: `Bearer ${process.env.RESEND_API_KEY}`, 'content-type': 'application/json' }, body: JSON.stringify({ from, to, reply_to: email || undefined, subject, text }) });
    if (!r.ok) throw new Error(`Resend ${r.status}`);
    recent.push(now); buckets.set(ip, recent);
    return json(200, { ok: true });
  } catch (e) { console.error('Contact send failed', e); return json(502, { error: 'Envoi impossible pour le moment. Utilisez l’email de secours.' }); }
};
