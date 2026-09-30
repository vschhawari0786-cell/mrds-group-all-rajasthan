import { useEffect, useState } from 'react';
import { TYPES, BRAND, priceText, videoId, isDirectVideo } from '../data/constants.js';
import { detailCells } from '../lib/propertyHelpers.js';
import { EkStore } from '../data/store.js';

export default function PropertyModal({ p, admin, onClose, onEdit, onDeleted, notify }) {
  const [media, setMedia] = useState(null); // null => default
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    setMedia(null);
    document.body.style.overflow = 'hidden';
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    return () => { document.body.style.overflow = ''; document.removeEventListener('keydown', onKey); };
  }, [p?.id, onClose]);

  if (!p) return null;

  const photos = p.photos || [];
  const cfg = TYPES[p.type] || { icon: '🏠', label: p.type };
  const yid = videoId(p.video);
  const phone = String(p.contact?.phone || '').replace(/\D/g, '');

  const defaultMedia = yid
    ? <iframe title="प्रॉपर्टी वीडियो" allow="accelerometer;autoplay;clipboard-write;encrypted-media;gyroscope;picture-in-picture" allowFullScreen
        src={'https://www.youtube.com/embed/' + yid + '?rel=0'} />
    : isDirectVideo(p)
      ? <video controls playsInline src={p.video} />
      : photos[0]
        ? <img src={photos[0]} alt={p.title} />
        : <div className="ph" style={{ fontSize: 60 }}>{cfg.icon}</div>;

  const del = async () => {
    if (!confirm('क्या यह प्रॉपर्टी हटानी है?')) return;
    setBusy(true);
    const r = await EkStore.remove(p.id);
    setBusy(false);
    if (!r.ok) return notify(r.error || 'हटाया नहीं जा सका।');
    onDeleted();
    notify('प्रॉपर्टी हटा दी गई।');
  };

  return (
    <div className="modal" onClick={(e) => e.target.classList.contains('modal-back') && onClose()}>
      <div className="modal-back" />
      <div className="modal-box" role="dialog" aria-modal="true">
        <button className="modal-x" onClick={onClose} aria-label="बंद करें">✕</button>

        <div className="m-media">{media || defaultMedia}</div>

        {photos.length > 1 && (
          <div className="m-photos">
            {photos.map((src, i) => (
              <img key={i} src={src} alt={'फोटो ' + (i + 1)} className={i === 0 ? 'on' : ''}
                onClick={() => { setMedia(<img src={src} alt={p.title} />); }} />
            ))}
          </div>
        )}

        <div className="m-body">
          <div className="m-title">
            <div>
              <h3>{p.title}</h3>
              <div className="muted">
                📍 {[p.address, p.locality, p.city].filter(Boolean).join(' — ') || '—'}
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div className="m-price">{p.priceRange || priceText(p)}</div>
              {p.negotiable && <div className="muted" style={{ fontSize: 12 }}>मूल्य तय करने योग्य</div>}
            </div>
          </div>

          <div className="m-grid">
            {detailCells(p).map((c, i) => (
              <div className="m-cell" key={i}><span>{c.k}</span><b>{c.v}</b></div>
            ))}
          </div>

          {p.description && <p className="m-desc">{p.description}</p>}

          <div className="m-actions">
            <a className="btn btn-primary" href={'tel:+' + phone}>📞 {p.contact?.phone || 'कॉल करें'}</a>
            <a className="btn btn-ghost" href={BRAND.waLink} target="_blank" rel="noopener">💬 व्हाट्सएप</a>
            {p.video && (
              <button className="btn btn-ghost" onClick={() =>
                setMedia(yid
                  ? <iframe title="वीडियो" allow="autoplay;encrypted-media" allowFullScreen
                      src={'https://www.youtube.com/embed/' + yid + '?autoplay=1&rel=0'} />
                  : <video controls autoPlay playsInline src={p.video} />)
              }>▶ वीडियो देखें</button>
            )}
            {p.mapUrl && <a className="btn btn-ghost" href={p.mapUrl} target="_blank" rel="noopener">🗺️ नक्शा</a>}
            {admin && <button className="btn btn-danger btn-sm" onClick={() => { onClose(); onEdit(p); }}>✎ संपोधित करें</button>}
            {admin && <button className="btn btn-danger btn-sm" disabled={busy} onClick={del}>🗑 हटाएँ</button>}
          </div>
        </div>
      </div>
    </div>
  );
}
