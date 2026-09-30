import { useState } from 'react';
import { TYPES } from '../data/constants.js';

const CATS = [
  { type: 'flat', icon: '🏢', label: 'लक्जरी फ्लैट्स' },
  { type: 'villa', icon: '🏡', label: 'मॉडर्न विला' },
  { type: 'flat', icon: '🏬', label: 'अपार्टमेंट' },
  { type: 'flat', icon: '🏘️', label: 'टाउन हाउस' },
  { type: 'plot', icon: '📐', label: 'प्लॉट' },
  { type: 'shop', icon: '🏪', label: 'दुकान' },
  { type: 'farmhouse', icon: '🌳', label: 'फार्महाउस' },
];

export default function Hero({ filters, setFilters, stats, onSearch }) {
  const [q, setQ] = useState('');
  const [type, setType] = useState('');
  const [min, setMin] = useState('');
  const [max, setMax] = useState('');
  const [cat, setCat] = useState('');

  const submit = (e) => {
    e?.preventDefault();
    setFilters({ q, type, min, max });
    onSearch();
  };

  const pickCat = (t) => {
    const same = cat === t;
    const next = same ? '' : t;
    setCat(next);
    setType(next);
    setFilters({ q, type: next, min, max });
    onSearch();
  };

  return (
    <section className="hero">
      <div className="hero-bg" style={{ backgroundImage: "url('/assets/img/hero.jpg')" }} />
      <div className="hero-veil" />
      <div className="wrap hero-inner">
        <span className="pill">MRDS रियल एस्टेट ग्रुप में आपका स्वागत है</span>
        <h1>आज ही हमारे साथ अपना <em>नया ड्रीम होम</em> और प्रॉपर्टी खोजें।</h1>
        <p className="lead-hi">"सुरक्षित निवेश , सुनिश्चित भविष्य"</p>
        <p className="ra-strip">🗺️ <b>ऑल राजस्थान</b> — जयपुर · जोधपुर · उदयपुर · कोटा · अजमेर · सीकर · भीलवाड़ा · अलवर</p>

        <div className="hero-cats">
          {CATS.map((c, i) => (
            <button key={i} className={'cat' + (cat === c.type && cat ? ' on' : '')} onClick={() => pickCat(c.type)}>
              <span>{c.icon}</span>{c.label}
            </button>
          ))}
        </div>

        <form className="search-bar" onSubmit={submit}>
          <div className="field">
            <label htmlFor="q">कीवर्ड / इलाका</label>
            <input id="q" value={q} onChange={(e) => setQ(e.target.value)}
              placeholder="जैसे — 100 फुट सड़क, पीपलोद, वैष्णवी नगर" autoComplete="off" />
          </div>
          <div className="field">
            <label htmlFor="fType">प्रॉपर्टी का प्रकार</label>
            <select id="fType" value={type} onChange={(e) => setType(e.target.value)}>
              <option value="">सभी प्रकार</option>
              {Object.entries(TYPES).map(([k, v]) => <option key={k} value={k}>{v.icon} {v.label}</option>)}
            </select>
          </div>
          <div className="field">
            <label htmlFor="fMin">कम से कम क्षेत्रफल (वर्ग फुट)</label>
            <input id="fMin" type="number" min="0" step="50" value={min} onChange={(e) => setMin(e.target.value)} placeholder="0" />
          </div>
          <div className="field">
            <label htmlFor="fMax">अधिकतम क्षेत्रफल (वर्ग फुट)</label>
            <input id="fMax" type="number" min="0" step="50" value={max} onChange={(e) => setMax(e.target.value)} placeholder="कोई भी" />
          </div>
          <button className="btn btn-primary" type="submit">खोजें</button>
        </form>

        <div className="hero-stats">
          <div className="stat"><b>{stats.total}</b><span>कुल</span></div>
          <div className="stat"><b>{stats.plot}</b><span>प्लॉट</span></div>
          <div className="stat"><b>{stats.shop}</b><span>दुकान</span></div>
          <div className="stat"><b>{stats.farmhouse}</b><span>फार्महाउस</span></div>
        </div>
      </div>
    </section>
  );
}
