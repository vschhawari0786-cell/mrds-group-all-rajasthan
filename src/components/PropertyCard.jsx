import { TYPES, BRAND, priceText, sizeText, placeText, hasVideo, toSqft } from '../data/constants.js';
import { cardTags } from '../lib/propertyHelpers.js';

export default function PropertyCard({ p, onOpen }) {
  const cfg = TYPES[p.type] || { icon: '🏠', label: p.type };
  const photo = (p.photos || [])[0];
  const phone = String(p.contact?.phone || '').replace(/\D/g, '');

  return (
    <article className="pcard">
      <div className="pcard-media">
        {photo
          ? <img src={photo} alt={p.title} loading="lazy" />
          : <div className="ph">{cfg.icon}</div>}

        <span className="badge">{cfg.icon} {cfg.label}</span>
        {p.featured && <span className="badge feat">★ फीचर्ड</span>}
        {hasVideo(p) && <span className="badge video">▶ वीडियो</span>}
        <span className="price-tag">{priceText(p)}</span>
      </div>

      <div className="pcard-body">
        <h3>{p.title}</h3>
        <div className="size-line">📏 {sizeText(p)}</div>
        <div className="loc">📍 {placeText(p) || 'स्थान जानकारी हेतु संपर्क करें'}</div>
        <div className="tags">
          {cardTags(p).map((t, i) => <span className="tag" key={i}>{t}</span>)}
        </div>
      </div>

      <div className="pcard-foot">
        <button className="btn btn-primary btn-sm" onClick={() => onOpen(p)}>
          विवरण एवं वीडियो
        </button>
        <a className="btn btn-ghost btn-sm icon-only" href={'tel:+' + phone} title="कॉल करें" aria-label="कॉल करें">📞</a>
        <a className="btn btn-ghost btn-sm icon-only" href={BRAND.waLink} target="_blank" rel="noopener" title="व्हाट्सएप" aria-label="व्हाट्सएप">💬</a>
      </div>
    </article>
  );
}

export { toSqft };
