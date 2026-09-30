/* MRDS — Admin auth (Firebase Auth + offline fallback) */
import { EkFb } from './firebase.js';
import { ADMIN_EMAIL } from './constants.js';

/* Neeche ka SHA-256 hash SIRF offline fallback ke liye hai — jab Firebase SDK
   load na ho (jaise file:// se kholne par). Live site par Firebase Authentication
   hi asli password verify karta hai, aur wo server-side hota hai.
   Hash badalne ke liye: echo -n "password" | sha256sum */
const FALLBACK_HASH = '56b1b606c0d503ef7ad60dd71ad567eb396ee97b8db922999675029e0467db5e';
const SESSION_KEY = 'ekweb.admin.session';
const TTL = 1000 * 60 * 60 * 8;

const useFb = () => { EkFb.init(); return EkFb.isOn(); };

function sha256(str) {
  if (window.crypto?.subtle?.digest) {
    return crypto.subtle
      .digest('SHA-256', new TextEncoder().encode(str))
      .then((buf) => [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join(''));
  }
  let h = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 0x01000193) >>> 0; }
  return Promise.resolve('fallback-' + h.toString(16));
}

function saveLocal() {
  try { localStorage.setItem(SESSION_KEY, JSON.stringify({ email: ADMIN_EMAIL, at: Date.now() })); } catch {}
}

function readLocal() {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const s = JSON.parse(raw);
    if (!s || s.email !== ADMIN_EMAIL) return null;
    if (Date.now() - s.at > TTL) { localStorage.removeItem(SESSION_KEY); return null; }
    return s;
  } catch { return null; }
}

export const EkAuth = {
  isAdmin() {
    if (useFb()) {
      const u = EkFb.user();
      return !!u && u.email === ADMIN_EMAIL;
    }
    return !!readLocal();
  },

  current() {
    if (useFb()) {
      const u = EkFb.user();
      return u && u.email === ADMIN_EMAIL ? { email: u.email, uid: u.uid } : null;
    }
    return readLocal();
  },

  onChange(cb) {
    if (useFb()) {
      let last = undefined;
      return EkFb.onAuth((u) => {
        const admin = u && u.email === ADMIN_EMAIL ? { email: u.email, uid: u.uid } : null;
        const key = admin ? admin.uid : null;
        if (key !== last) { last = key; cb(admin); }
      });
    }
    cb(this.current());
    return () => {};
  },

  async login(email, password) {
    const mail = String(email || '').trim().toLowerCase();

    if (useFb()) {
      try {
        const cred = await EkFb.auth().signInWithEmailAndPassword(mail, password);
        if (!cred.user || cred.user.email !== ADMIN_EMAIL) {
          await EkFb.auth().signOut();
          return { ok: false, error: 'यह ईमेल एडमिन का नहीं है।' };
        }
        return { ok: true, email: cred.user.email, uid: cred.user.uid };
      } catch (e) {
        const code = e?.code || '';
        if (/invalid-email/.test(code)) return { ok: false, error: 'ईमेल सही नहीं है।' };
        if (/user-not-found|wrong-password|invalid-credential|invalid-login/.test(code))
          return { ok: false, error: 'ईमेल या पासवर्ड गलत है।' };
        if (/too-many-requests/.test(code)) return { ok: false, error: 'बहुत बार कोशिश। कृपया थोड़ी देर बाद प्रयास करें।' };
        if (/network-request-failed/.test(code)) return { ok: false, error: 'नेटवर्क त्रुटि। इंटरनेट जाँचिए।' };
        return { ok: false, error: e?.message || 'लॉगिन विफल रहा।' };
      }
    }

    const hash = await sha256(String(password || ''));
    if (hash !== FALLBACK_HASH) return { ok: false, error: 'पासवर्ड गलत है।' };
    if (mail !== ADMIN_EMAIL) return { ok: false, error: 'यह ईमेल एडमिन का नहीं है।' };
    saveLocal();
    return { ok: true, email: ADMIN_EMAIL, offline: true };
  },

  async logout() {
    if (useFb()) { try { await EkFb.auth().signOut(); } catch {} return; }
    try { localStorage.removeItem(SESSION_KEY); } catch {}
  },
};
