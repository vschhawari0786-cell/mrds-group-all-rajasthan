/* MRDS — data layer: Firestore + localStorage fallback */
import { EkFb } from './firebase.js';
import { EkSeed } from './seed.js';
import { ADMIN_EMAIL } from './constants.js';

const KEY = 'ekweb.properties.v1';
const COL = 'properties';

const useFb = () => {
  EkFb.init();
  return EkFb.isOn();
};

/* ---------------- localStorage ---------------- */
const readLocal = () => {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const writeLocal = (list) => {
  try {
    localStorage.setItem(KEY, JSON.stringify(list));
    return { ok: true };
  } catch (e) {
    const quota = e && /quota|exceed/i.test((e.name || '') + ' ' + (e.message || ''));
    return {
      ok: false,
      error: quota
        ? 'स्टोरेज भर गया — कम फोटो रखें या कुछ प्रॉपर्टी हटाएँ।'
        : 'सेव नहीं हो पाया (ब्राउज़र स्टोरेज ब्लॉक है?)',
    };
  }
};

const fromDoc = (d) => ({ ...(d.data() || {}), id: d.id });
const toDoc = (p) => { const { id, ...rest } = p; return rest; };

/* ---------------- public API ---------------- */
export const EkStore = {
  mode: () => (useFb() ? 'firebase' : 'local'),

  all() { return readLocal(); },

  get(id) { return readLocal().find((p) => p.id === id) || null; },

  async prime() {
    if (!useFb()) {
      const loc = readLocal();
      if (loc.length) return loc;
      writeLocal(EkSeed());
      return readLocal();
    }
    try {
      const db = EkFb.db();
      const full = await db.collection(COL).get();
      if (!full.empty) return full.docs.map(fromDoc);

      const u = EkFb.user();
      if (u && u.email === ADMIN_EMAIL) {
        try {
          const batch = db.batch();
          EkSeed().forEach((p) => {
            const { id, ...rest } = p;
            batch.set(db.collection(COL).doc(id), rest);
          });
          await batch.commit();
          const again = await db.collection(COL).get();
          return again.docs.map(fromDoc);
        } catch (e2) {
          console.warn('ekweb: seed likh nahi paya —', e2.message);
        }
      }
      writeLocal(EkSeed());
      return readLocal();
    } catch (e) {
      console.warn('ekweb: prime failed —', e.message);
      const loc = readLocal();
      if (loc.length) return loc;
      writeLocal(EkSeed());
      return readLocal();
    }
  },

  subscribe(cb) {
    if (!useFb()) { cb(readLocal()); return () => {}; }
    try {
      return EkFb.db()
        .collection(COL)
        .onSnapshot(
          (snap) => cb(snap.docs.map(fromDoc)),
          (err) => { console.warn('ekweb: snapshot', err); cb(readLocal()); }
        );
    } catch (e) {
      cb(readLocal());
      return () => {};
    }
  },

  async upsert(prop) {
    if (useFb()) {
      try {
        const db = EkFb.db();
        if (prop.id) {
          prop.createdAt = prop.createdAt || this.get(prop.id)?.createdAt || Date.now();
          prop.updatedAt = Date.now();
          prop.by = EkFb.user()?.email || null;
          await db.collection(COL).doc(prop.id).set(toDoc(prop), { merge: true });
          return { ok: true, id: prop.id };
        }
        prop.id = db.collection(COL).doc().id;
        prop.createdAt = Date.now();
        prop.by = EkFb.user()?.email || null;
        await db.collection(COL).doc(prop.id).set(toDoc(prop));
        return { ok: true, id: prop.id };
      } catch (e) {
        return { ok: false, error: 'सेव नहीं हुआ: ' + (e.message || 'अनुमति नहीं') };
      }
    }

    const list = this.all();
    if (prop.id) {
      const i = list.findIndex((p) => p.id === prop.id);
      if (i > -1) {
        prop.createdAt = list[i].createdAt || Date.now();
        prop.updatedAt = Date.now();
        list[i] = prop;
      } else list.unshift(prop);
    } else {
      prop.id = 'p_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
      prop.createdAt = Date.now();
      list.unshift(prop);
    }
    const r = writeLocal(list);
    return { ...r, id: prop.id };
  },

  async remove(id) {
    if (useFb()) {
      try {
        await EkFb.db().collection(COL).doc(id).delete();
        return { ok: true };
      } catch (e) {
        return { ok: false, error: 'हटाया नहीं जा सका: ' + (e.message || 'अनुमति नहीं') };
      }
    }
    return writeLocal(this.all().filter((p) => p.id !== id));
  },

  async replaceAll(list) {
    if (useFb()) {
      try {
        const db = EkFb.db();
        const existing = await db.collection(COL).get();
        const batch = db.batch();
        existing.docs.forEach((d) => batch.delete(d.ref));
        list.forEach((p) => {
          const { id, ...rest } = p;
          batch.set(db.collection(COL).doc(id || db.collection(COL).doc().id), rest);
        });
        await batch.commit();
        return { ok: true };
      } catch (e) {
        return { ok: false, error: 'आयात नहीं हुआ: ' + (e.message || 'अनुमति नहीं') };
      }
    }
    return writeLocal(list);
  },
};
