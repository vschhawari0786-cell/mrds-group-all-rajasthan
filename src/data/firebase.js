/* MRDS — Firebase config & init
   Project: mrds-28d50  |  Hosting: mrds-28d50.web.app

   ⚠️ NOTE: `apiKey` yahan public hai — ye Firebase web app ki CLIENT key hai,
   jo by design frontend code me rehti hai (har Firebase site aisa karti hai).
   Asli security `firestore.rules` + `storage.rules` se aati hai, key chhupane se nahi.
   Isiliye ye file GitHub par dalna SAFE hai. */
const config = {
  apiKey: 'AIzaSyDOvq0mmx1jurXdgrf8TEWHdGV6reunN4E',
  authDomain: 'mrds-28d50.firebaseapp.com',
  projectId: 'mrds-28d50',
  storageBucket: 'mrds-28d50.firebasestorage.app',
  messagingSenderId: '485947947104',
  appId: '1:485947947104:web:f0740ca9149d6557caeb05',
};

const state = { on: false, ready: false, err: null, user: null, fs: null, au: null, st: null };
const listeners = new Set();

function init() {
  if (state.ready) return state;
  state.ready = true;
  try {
    if (typeof firebase === 'undefined') {
      state.err = 'SDK load nahi hua';
      return state;
    }
    if (!firebase.apps.length) firebase.initializeApp(config);
    else firebase.app();

    state.fs = firebase.firestore();
    state.au = firebase.auth();
    state.st = firebase.storage ? firebase.storage() : null;
    state.on = true;

    state.au.onAuthStateChanged((u) => {
      state.user = u;
      listeners.forEach((fn) => fn(u));
    });
  } catch (e) {
    state.err = e.message;
    console.warn('ekweb: Firebase init nahi hua, localStorage mode —', e.message);
  }
  return state;
}

export const EkFb = {
  config,
  state,
  init,
  isOn: () => state.on,
  db: () => state.fs,
  auth: () => state.au,
  storage: () => state.st,
  user: () => state.user,
  onAuth(fn) {
    listeners.add(fn);
    if (state.user !== undefined) fn(state.user);
    return () => listeners.delete(fn);
  },
};
