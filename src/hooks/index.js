import { useCallback, useEffect, useRef, useState } from 'react';

/* ---------------- toast ---------------- */
export function useToast() {
  const [toast, setToast] = useState({ msg: '', show: false });
  const t = useRef(null);

  const notify = useCallback((msg) => {
    setToast({ msg, show: true });
    clearTimeout(t.current);
    t.current = setTimeout(() => setToast((s) => ({ ...s, show: false })), 2800);
  }, []);

  useEffect(() => () => clearTimeout(t.current), []);
  return [toast, notify];
}

/* ---------------- theme ---------------- */
export function useTheme() {
  const [theme, setTheme] = useState(() => localStorage.getItem('ekweb.theme') || 'light');

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem('ekweb.theme', theme);
  }, [theme]);

  return [theme, () => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))];
}

/* ---------------- admin auth ---------------- */
export function useAdmin() {
  const [admin, setAdmin] = useState(false);
  const [email, setEmail] = useState('');
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let off;
    (async () => {
      const { EkAuth } = await import('../data/auth.js');
      off = EkAuth.onChange((a) => {
        setAdmin(!!a);
        setEmail(a?.email || '');
        setReady(true);
      });
    })();
    return () => off && off();
  }, []);

  return { admin, email, ready };
}

/* ---------------- properties ---------------- */
export function useProperties() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsub;
    (async () => {
      const { EkStore } = await import('../data/store.js');
      const first = await EkStore.prime();
      setList(first);
      setLoading(false);
      if (EkStore.mode() === 'firebase') {
        unsub = EkStore.subscribe(setList);
      }
    })();
    return () => unsub && unsub();
  }, []);

  return { list, loading, setList };
}

/* ---------------- scroll spy ---------------- */
export function useScrollSpy(ids) {
  const [active, setActive] = useState('#' + ids[0]);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY + 140;
      let cur = '#' + ids[0];
      ids.forEach((id) => {
        const el = document.getElementById(id);
        if (el && el.offsetTop <= y) cur = '#' + id;
      });
      setActive(cur);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [ids.join(',')]);

  return active;
}
