import { useCallback, useMemo, useState } from 'react';
import { useToast, useTheme, useAdmin, useProperties, useScrollSpy } from './hooks/index.js';
import { EkStore } from './data/store.js';
import { EkAuth } from './data/auth.js';
import { EkSeed } from './data/seed.js';
import { BRAND } from './data/constants.js';
import Hero from './components/Hero.jsx';
import About from './components/About.jsx';
import Properties from './components/Properties.jsx';
import AddProperty from './components/AddProperty.jsx';
import Contact from './components/Contact.jsx';
import Footer from './components/Footer.jsx';
import LoginModal from './components/LoginModal.jsx';
import PropertyModal from './components/PropertyModal.jsx';

const NAV = [
  { href: '#top', label: 'होम', id: 'top' },
  { href: '#about', label: 'हमारे बारे में', id: 'about' },
  { href: '#properties', label: 'प्रॉपर्टीज़', id: 'properties' },
  { href: '#add', label: 'प्रॉपर्टी जोड़ें', id: 'add', adminOnly: true },
  { href: '#contact', label: 'संपर्क करें', id: 'contact' },
];

const SPY = ['top', 'about', 'properties', 'add', 'contact'];

export default function App() {
  const [toast, notify] = useToast();
  const [theme, toggleTheme] = useTheme();
  const { admin, email, ready } = useAdmin();
  const { list, loading, setList } = useProperties();
  const active = useScrollSpy(SPY);

  const [menuOpen, setMenuOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [openProp, setOpenProp] = useState(null);
  const [editing, setEditing] = useState(null);
  const [filters, setFilters] = useState({ q: '', type: '', min: '', max: '' });

  const stats = useMemo(() => ({
    total: list.length,
    plot: list.filter((p) => p.type === 'plot').length,
    shop: list.filter((p) => p.type === 'shop').length,
    farmhouse: list.filter((p) => p.type === 'farmhouse').length,
  }), [list]);

  const goProperties = useCallback(() => {
    setMenuOpen(false);
    setTimeout(() => document.getElementById('properties')?.scrollIntoView({ behavior: 'smooth' }), 30);
  }, []);

  const clearFilter = (key) => {
    if (key) setFilters((f) => ({ ...f, [key]: '' }));
    else setFilters({ q: '', type: '', min: '', max: '' });
  };

  const logout = async () => {
    await EkAuth.logout();
    setEditing(null);
    setLoginOpen(false);
    notify('एडमिन लॉगआउट हो गया।');
  };

  const doExport = () => {
    const blob = new Blob([JSON.stringify(list, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'mrds-properties.json';
    a.click();
    URL.revokeObjectURL(a.href);
    notify('JSON डाउनलोड हो गया।');
  };

  const doImport = () => {
    const inp = document.createElement('input');
    inp.type = 'file';
    inp.accept = 'application/json';
    inp.onchange = async () => {
      const file = inp.files?.[0];
      if (!file) return;
      try {
        const data = JSON.parse(await file.text());
        if (!Array.isArray(data)) throw new Error('bad');
        const r = await EkStore.replaceAll([...data, ...EkStore.all()]);
        if (!r.ok) return notify(r.error);
        setList(EkStore.all());
        notify(data.length + ' प्रॉपर्टी आयात हो गई।');
      } catch {
        notify('फ़ाइल सही नहीं — वैध JSON होना चाहिए।');
      }
    };
    inp.click();
  };

  const doReset = async () => {
    if (!confirm('सभी लिस्टिंग हटाकर डेमो डेटा दोबारा लोड करें?')) return;
    const r = await EkStore.replaceAll(EkSeed());
    if (!r.ok) return notify(r.error);
    setList(await EkStore.prime());
    clearFilter();
    notify('डेमो लिस्टिंग दोबारा लोड हो गई।');
  };

  return (
    <>
      {/* topbar */}
      <div className="topbar"><span className="ganesh">श्री गणेशाय नमः</span></div>

      {/* nav */}
      <header className="nav" id="nav">
        <div className="nav-inner">
          <a className="brand" href="#top">
            <img src="/assets/img/logo.png" alt={BRAND.name} className="brand-logo" />
            <span className="brand-txt">
              <b>MRDS ग्रुप</b>
              <small>ऑल राजस्थान प्रा. लि.</small>
            </span>
          </a>

          <nav className={'nav-links' + (menuOpen ? ' open' : '')}>
            {NAV.filter((n) => !n.adminOnly || admin).map((n) => (
              <a key={n.id} href={n.href} className={active === n.href ? 'active' : ''}
                onClick={() => setMenuOpen(false)}>{n.label}</a>
            ))}
          </nav>

          <div className="nav-actions">
            <a className="nav-phone" href={BRAND.tel}><span>📞</span> {BRAND.phoneText}</a>
            {admin ? (
              <button className="btn btn-ghost btn-sm" onClick={logout}>🚪 लॉगआउट</button>
            ) : (
              <button className="btn btn-green btn-sm" onClick={() => setLoginOpen(true)}>🔐 एडमिन लॉगिन</button>
            )}
            <button className="icon-btn" onClick={toggleTheme} title="थीम बदलें" aria-label="थीम बदलें">
              {theme === 'dark' ? '☀️' : '🌙'}
            </button>
            <button className="icon-btn only-mobile" onClick={() => setMenuOpen((o) => !o)}
              aria-label="मेन्यू">☰</button>
          </div>
        </div>
      </header>

      <main id="top">
        <Hero filters={filters} setFilters={setFilters} stats={stats} onSearch={goProperties} />
        <About />
        <Properties list={list} filters={filters} onClear={clearFilter}
          onOpen={setOpenProp} admin={admin} onLogin={() => setLoginOpen(true)} />
        {admin && (
          <AddProperty editing={editing} notify={notify} onCancel={() => { setEditing(null); logout(); }}
            onDone={() => { setEditing(null); goProperties(); }}
            onReset={doReset} onImport={doImport} onExport={doExport} />
        )}
        <Contact />
      </main>

      <Footer admin={admin} />

      {loginOpen && (
        <LoginModal onClose={() => setLoginOpen(false)} onDone={() => setLoginOpen(false)} notify={notify} />
      )}
      {openProp && (
        <PropertyModal p={openProp} admin={admin} onClose={() => setOpenProp(null)}
          onEdit={(p) => { setEditing(p); setOpenProp(null); setTimeout(() => document.getElementById('add')?.scrollIntoView({ behavior: 'smooth' }), 60); }}
          onDeleted={() => setOpenProp(null)} notify={notify} />
      )}

      {toast.show && <div className="toast">{toast.msg}</div>}
      {!ready && <div style={{ display: 'none' }}>loading</div>}
    </>
  );
}
