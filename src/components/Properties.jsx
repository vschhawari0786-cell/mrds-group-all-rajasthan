import { useMemo, useState } from 'react';
import { TYPES, toSqft } from '../data/constants.js';
import PropertyCard from './PropertyCard.jsx';

const SORTS = [
  { v: 'new', l: 'नया पहले' },
  { v: 'price-asc', l: 'मूल्य: कम से ज़्यादा' },
  { v: 'price-desc', l: 'मूल्य: ज़्यादा से कम' },
  { v: 'area-desc', l: 'क्षेत्रफल: बड़ा से छोटा' },
  { v: 'area-asc', l: 'क्षेत्रफल: छोटा से बड़ा' },
];

const PAGE = 9;

export default function Properties({ list, filters, onClear, onOpen, admin, onLogin }) {
  const [sort, setSort] = useState('new');
  const [shown, setShown] = useState(PAGE);

  const out = useMemo(() => {
    const needle = filters.q.trim().toLowerCase();

    let r = list.filter((p) => {
      if (filters.type && p.type !== filters.type) return false;
      if (needle) {
        const hay = [p.title, p.city, p.locality, p.address, p.description,
          p.size?.bba, p.size?.facing, p.size?.floor, p.size?.roadWidth]
          .join(' ').toLowerCase();
        if (!hay.includes(needle)) return false;
      }
      const a = toSqft(p.size?.area, p.size?.unit);
      if (filters.min && a < Number(filters.min)) return false;
      if (filters.max && a > Number(filters.max)) return false;
      return true;
    });

    const by = {
      'price-asc': (a, b) => a.price - b.price,
      'price-desc': (a, b) => b.price - a.price,
      'area-asc': (a, b) => toSqft(a.size?.area, a.size?.unit) - toSqft(b.size?.area, b.size?.unit),
      'area-desc': (a, b) => toSqft(b.size?.area, b.size?.unit) - toSqft(a.size?.area, a.size?.unit),
      new: (a, b) => (b.createdAt || 0) - (a.createdAt || 0),
    }[sort];

    return [...r].sort((a, b) => (a.featured !== b.featured ? (a.featured ? -1 : 1) : by(a, b)));
  }, [list, filters, sort]);

  const chips = [];
  if (filters.type) chips.push({ k: 'type', l: TYPES[filters.type]?.label || filters.type });
  if (filters.q) chips.push({ k: 'q', l: '"' + filters.q + '"' });
  if (filters.min) chips.push({ k: 'min', l: '≥ ' + filters.min + ' वर्ग फुट' });
  if (filters.max) chips.push({ k: 'max', l: '≤ ' + filters.max + ' वर्ग फुट' });

  return (
    <section className="section alt" id="properties">
      <div className="wrap">
        <div className="sec-head">
          <div>
            <span className="eyebrow">हमारी संपत्तियाँ</span>
            <h2>सर्वोत्तम आवासीय क्षेत्र <small>— लिस्टिंग से चाबियों तक</small></h2>
            <p className="muted" id="resultCount">
              {out.length} प्रॉपर्टी{out.length === 1 ? '' : 'ं'} दिख रही हैं
            </p>
          </div>
          <div className="sec-head-actions">
            <select className="mini-select" value={sort} onChange={(e) => setSort(e.target.value)} aria-label="क्रम">
              {SORTS.map((s) => <option key={s.v} value={s.v}>{s.l}</option>)}
            </select>
            <button className="btn btn-ghost btn-sm" onClick={onClear}>फ़िल्टर हटाएँ</button>
          </div>
        </div>

        {chips.length > 0 && (
          <div className="chipbar">
            {chips.map((c, i) => (
              <span className="chip" key={c.k}>
                {c.l} <button onClick={() => onClear(c.k)} title="हटाएँ" aria-label="हटाएँ">✕</button>
              </span>
            ))}
          </div>
        )}

        {out.length === 0 ? (
          <div className="empty">
            <div className="empty-ico">🏷️</div>
            <h3>कोई प्रॉपर्टी नहीं मिली</h3>
            <p className="muted">फ़िल्टर बदलकर देखिए, या अपनी प्रॉपर्टी जोड़िए।</p>
            <button className="btn btn-green" onClick={admin ? () => document.getElementById('add')?.scrollIntoView({ behavior: 'smooth' }) : onLogin}>
              {admin ? '+ प्रॉपर्टी जोड़ें' : '🔐 प्रॉपर्टी जोड़ने के लिए एडमिन लॉगिन'}
            </button>
          </div>
        ) : (
          <>
            <div className="grid">
              {out.slice(0, shown).map((p) => <PropertyCard key={p.id} p={p} onOpen={onOpen} />)}
            </div>
            {out.length > shown && (
              <div className="center">
                <button className="btn btn-ghost" onClick={() => setShown((s) => s + PAGE)}>और देखें</button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
