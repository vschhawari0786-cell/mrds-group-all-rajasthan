import { useEffect, useState } from 'react';
import { TYPES, UNITS, BRAND, MAX_PHOTOS } from '../data/constants.js';
import { EkStore } from '../data/store.js';
import { EkUpload } from '../data/upload.js';
import { plotArt } from '../data/plotart.js';

const BLANK = {
  id: null, title: '', type: 'plot', price: '', negotiable: false, featured: false,
  city: '', locality: '', address: '', mapUrl: '',
  video: '', description: '',
  size: {
    unit: 'sqft', area: '', length: '', width: '', bba: '', facing: '',
    floor: '', frontRoad: '', land: '', landUnit: 'acre',
    boundary: '', water: '', beds: '', baths: '', floors: '',
    roadWidth: '', corner: false,
  },
  contact: { name: BRAND.name, phone: BRAND.phoneText },
};

const fromProp = (p) => ({
  ...BLANK,
  ...p,
  size: { ...BLANK.size, ...(p?.size || {}) },
  contact: { ...BLANK.contact, ...(p?.contact || {}) },
  price: p?.price || '',
});

export default function AddProperty({ editing, onDone, onCancel, notify, onReset, onImport, onExport }) {
  const [f, setF] = useState(fromProp(editing));
  const [photos, setPhotos] = useState(editing?.photos || []);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState(editing ? 'संपादन जारी… सेव करने पर अपडेट हो जाएगा।' : '');

  useEffect(() => {
    setF(fromProp(editing));
    setPhotos(editing?.photos || []);
    setMsg(editing ? 'संपादन जारी… सेव करने पर अपडेट हो जाएगा।' : '');
  }, [editing]);

  const cfg = TYPES[f.type] || TYPES.plot;

  const set = (k, v) => setF((s) => ({ ...s, [k]: v }));
  const setSize = (k, v) => setF((s) => ({ ...s, size: { ...s.size, [k]: v } }));
  const setContact = (k, v) => setF((s) => ({ ...s, contact: { ...s.contact, [k]: v } }));

  const onType = (t) => {
    setF((s) => ({ ...s, type: t, size: { ...s.size, unit: TYPES[t]?.lockUnit ? 'sqft' : s.size.unit } }));
  };

  /* live area hint */
  const hint = (() => {
    const v = Number(f.size.area) || 0;
    if (!v || !UNITS[f.size.unit]) return '';
    const out = [];
    const l = Number(f.size.length), w = Number(f.size.width);
    if (l && w) out.push(l + ' × ' + w + ' = ' + (l * w) + ' ' + UNITS[f.size.unit].label);
    if (f.size.unit !== 'sqft') {
      const mult = UNITS[f.size.unit].inSqft;
      out.push('≈ ' + Math.round(v * mult) + ' वर्ग फुट');
    }
    return out.join('  •  ');
  })();

  const addFiles = async (fileList) => {
    const room = MAX_PHOTOS - photos.length;
    const list = [...fileList].slice(0, room);
    if (!list.length) return notify('अधिकतम ' + MAX_PHOTOS + ' फोटो।');
    notify('फोटो अपलोड हो रही है…');
    try {
      const added = await EkUpload.photos(list, editing?.id || 'new');
      setPhotos((p) => [...p, ...added]);
      notify(added.length + ' फोटो जुड़ गई।');
    } catch (e) {
      notify('फोटो अपलोड नहीं हुई: ' + e.message);
    }
  };

  const validate = () => {
    if (!f.title.trim()) return 'प्रॉपर्टी का नाम लिखिए।';
    if (!Number(f.price)) return 'सही मूल्य डालिए।';
    if (!Number(f.size.area)) return 'क्षेत्रफल डालिए — यह सबसे ज़रूरी है।';
    if (!f.city.trim()) return 'शहर का नाम डालिए।';
    if (!f.contact.name.trim()) return 'संपर्क व्यक्ति का नाम डालिए।';
    if (String(f.contact.phone).replace(/\D/g, '').length < 10) return '10 अंकों का मोबाइल नंबर डालिए।';
    return null;
  };

  const save = async (e) => {
    e.preventDefault();
    const err = validate();
    if (err) return notify(err);

    let ph = photos;
    if (!ph.length && f.type) {
      ph = [plotArt({
        label: cfg.label.toUpperCase(),
        width: Number(f.size.length) || 0,
        length: Number(f.size.width) || 0,
        area: Number(f.size.area) || 0,
        areaUnit: f.size.unit,
        road: f.size.roadWidth || 'road',
        corner: f.size.corner,
        tone: Number(f.price) % 3,
      })];
    }

    const prop = {
      ...f,
      price: Number(f.price),
      photos: ph,
      size: {
        ...f.size,
        area: Number(f.size.area) || 0,
        length: numOrBlank(f.size.length), width: numOrBlank(f.size.width),
        land: numOrBlank(f.size.land), beds: numOrBlank(f.size.beds),
        baths: numOrBlank(f.size.baths), floors: numOrBlank(f.size.floors),
      },
      contact: {
        name: f.contact.name.trim(),
        phone: f.contact.phone.replace(/\D/g, ''),
      },
    };
    delete prop._type;

    setBusy(true);
    const r = await EkStore.upsert(prop);
    setBusy(false);
    if (!r.ok) return notify(r.error);
    onDone();
    notify(f.id ? 'प्रॉपर्टी अपडेट हो गई!' : 'प्रॉपर्टी जुड़ गई!');
  };

  const row = (label, children) => <div className="field"><label>{label}</label>{children}</div>;

  return (
    <section className="section" id="add">
      <div className="wrap">
        <div className="admin-bar">
          <div className="ab-left">
            <span className="ab-dot" />
            <b>एडमिन पैनल</b>
            <span className="muted">— आप एडमिन के रूप में लॉगिन हैं। यहाँ से प्रॉपर्टी जोड़ें / बदलें / हटाएँ।</span>
          </div>
          <div className="ab-right">
            <span className="ab-email">{f.contact.name}</span>
            <button className="btn btn-ghost btn-sm" type="button" onClick={onCancel}>🚪 लॉगआउट</button>
          </div>
        </div>

        <div className="sec-head">
          <div>
            <span className="eyebrow">संपत्ति जोड़ें</span>
            <h2>{editing ? 'प्रॉपर्टी संपोधित करें' : 'प्रॉपर्टी जोड़ें'}
              <small>{editing ? '— ' + editing.title : '— नई लिस्टिंग'}</small></h2>
            <p className="muted">क्षेत्रफल, वीडियो, फोटो एवं संपर्क विवरण भरिए।</p>
          </div>
          <div className="sec-head-actions">
            <button className="btn btn-ghost btn-sm" type="button" onClick={onExport}>⬇ JSON निर्यात</button>
            <button className="btn btn-ghost btn-sm" type="button" onClick={onImport}>⬆ आयात</button>
            <button className="btn btn-ghost btn-sm" type="button" onClick={onReset}>↺ डेमो रीसेट</button>
          </div>
        </div>

        <form className="card form" onSubmit={save}>
          <div className="form-grid">
            {/* ---------- col 1 ---------- */}
            <div className="form-col">
              <h4 className="form-h">मूलभूत विवरण</h4>

              <div className="row-2">
                {row('प्रॉपर्टी का नाम *',
                  <input value={f.title} onChange={(e) => set('title', e.target.value)}
                    placeholder="जैसे — 100 फुट सड़क के पास 1200 वर्ग फुट प्लॉट" required />)}
                {row('प्रकार *',
                  <select value={f.type} onChange={(e) => onType(e.target.value)}>
                    {Object.entries(TYPES).map(([k, v]) => <option key={k} value={k}>{v.icon} {v.label}</option>)}
                  </select>)}
              </div>

              <div className="row-2">
                {row('मूल्य (₹) *',
                  <input type="number" min="0" step="1000" value={f.price}
                    onChange={(e) => set('price', e.target.value)} placeholder="जैसे — 2500000" required />)}
                <div className="field chk-end">
                  <label className="chk"><input type="checkbox" checked={f.negotiable}
                    onChange={(e) => set('negotiable', e.target.checked)} /> <span>मूल्य तय करने योग्य</span></label>
                  <label className="chk"><input type="checkbox" checked={f.featured}
                    onChange={(e) => set('featured', e.target.checked)} /> <span>फीचर्ड प्रॉपर्टी</span></label>
                </div>
              </div>

              <h4 className="form-h">क्षेत्रफल <small>(इकाई सहित)</small></h4>

              <div className="row-2">
                {row('इकाई',
                  <select value={f.size.unit} disabled={cfg.lockUnit}
                    onChange={(e) => setSize('unit', e.target.value)}>
                    {Object.entries(UNITS).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
                  </select>)}
                <div className="field">
                  <label>{cfg.areaLbl}{cfg.lockUnit ? ' (वर्ग फुट)' : ''} *</label>
                  <input type="number" min="0" step="0.01" value={f.size.area}
                    onChange={(e) => setSize('area', e.target.value)} placeholder="जैसे — 1200" />
                  <small className="hint">{hint}</small>
                </div>
              </div>

              <div className="quick">
                <span>तुरंत चुनें:</span>
                {cfg.quick.map((a) => (
                  <button type="button" key={a}
                    className={'qbtn' + (Number(f.size.area) === a && f.size.unit === 'sqft' ? ' on' : '')}
                    onClick={() => { setSize('unit', 'sqft'); setSize('area', a); }}>
                    {a} वर्ग फुट
                  </button>
                ))}
              </div>

              {f.type === 'plot' && (
                <>
                  <div className="row-2">
                    {row('लंबाई', <input type="number" min="0" step="0.01" value={f.size.length}
                      onChange={(e) => setSize('length', e.target.value)} placeholder="जैसे — 30" />)}
                    {row('चौड़ाई', <input type="number" min="0" step="0.01" value={f.size.width}
                      onChange={(e) => setSize('width', e.target.value)} placeholder="जैसे — 40" />)}
                  </div>
                  <div className="row-2">
                    {row('बी.बी.ए. (सीमा)', <input value={f.size.bba} onChange={(e) => setSize('bba', e.target.value)} placeholder="पूर्व-पश्चिम" />)}
                    {row('मुखमुख', <input value={f.size.facing} onChange={(e) => setSize('facing', e.target.value)} placeholder="पूर्व, उत्तर-पूर्व" />)}
                  </div>
                </>
              )}

              {f.type === 'shop' && (
                <div className="row-2">
                  {row('मंज़िल', <input value={f.size.floor} onChange={(e) => setSize('floor', e.target.value)} placeholder="ग्राउंड फ्लोर" />)}
                  {row('सामने सड़क की चौड़ाई', <input value={f.size.frontRoad} onChange={(e) => setSize('frontRoad', e.target.value)} placeholder="20 फुट" />)}
                </div>
              )}

              {f.type === 'farmhouse' && (
                <>
                  <div className="row-2">
                    {row('कुल भूमि क्षेत्रफल (वैकल्पिक)', <input type="number" min="0" step="0.01" value={f.size.land}
                      onChange={(e) => setSize('land', e.target.value)} placeholder="जैसे — 2" />)}
                    {row('भूमि इकाई',
                      <select value={f.size.landUnit} onChange={(e) => setSize('landUnit', e.target.value)}>
                        <option value="acre">एकड़</option>
                        <option value="bigha">बीघा</option>
                        <option value="sqyd">वर्ग गज</option>
                        <option value="sqft">वर्ग फुट</option>
                      </select>)}
                  </div>
                  <div className="row-2">
                    {row('चारदीवारी', <input value={f.size.boundary} onChange={(e) => setSize('boundary', e.target.value)} placeholder="6 फुट" />)}
                    {row('पानी का स्रोत', <input value={f.size.water} onChange={(e) => setSize('water', e.target.value)} placeholder="बोरवेल + टैंकर" />)}
                  </div>
                </>
              )}

              <div className="row-2">
                {row('बेडरूम', <input type="number" min="0" step="1" value={f.size.beds}
                  onChange={(e) => setSize('beds', e.target.value)} placeholder="3" />)}
                {row('बाथरूम', <input type="number" min="0" step="1" value={f.size.baths}
                  onChange={(e) => setSize('baths', e.target.value)} placeholder="3" />)}
              </div>

              {(f.type === 'flat' || f.type === 'villa') && (
                <div className="row-2">
                  {row('मंज़िल', <input value={f.size.floor} onChange={(e) => setSize('floor', e.target.value)} placeholder="4वीं मंज़िल" />)}
                  {row('कुल मंज़िलें', <input type="number" min="0" step="1" value={f.size.floors}
                    onChange={(e) => setSize('floors', e.target.value)} placeholder="2" />)}
                </div>
              )}

              <div className="row-2">
                {row('सड़क की चौड़ाई / पहचान', <input value={f.size.roadWidth}
                  onChange={(e) => setSize('roadWidth', e.target.value)} placeholder="100 फुट सड़क" />)}
                <div className="field chk-end">
                  <label className="chk"><input type="checkbox" checked={f.size.corner}
                    onChange={(e) => setSize('corner', e.target.checked)} /> <span>कोने का प्लॉट</span></label>
                  <label className="chk"><input type="checkbox" checked={f.lease}
                    onChange={(e) => set('lease', e.target.checked)} /> <span>लीज़ / किराये का</span></label>
                </div>
              </div>
            </div>

            {/* ---------- col 2 ---------- */}
            <div className="form-col">
              <h4 className="form-h">स्थान</h4>

              <div className="row-2">
                {row('शहर / ज़िला *', <input value={f.city} onChange={(e) => set('city', e.target.value)} placeholder="जैसे — जयपुर" required />)}
                {row('मोहल्ला / कॉलोनी', <input value={f.locality} onChange={(e) => set('locality', e.target.value)} placeholder="वैष्णवी नगर" />)}
              </div>

              {row('पूरा पता', <textarea rows="2" value={f.address} onChange={(e) => set('address', e.target.value)} placeholder="मकान नं., गली, पहचान…" />)}
              {row('मैप / गूगल मैप्स लिंक', <input value={f.mapUrl} onChange={(e) => set('mapUrl', e.target.value)} placeholder="https://maps.app.goo.gl/…" />)}

              <h4 className="form-h">संपर्क</h4>

              <div className="row-2">
                {row('संपर्क व्यक्ति *', <input value={f.contact.name} onChange={(e) => setContact('name', e.target.value)} placeholder="नाम" required />)}
                {row('मोबाइल / व्हाट्सएप *', <input type="tel" value={f.contact.phone} onChange={(e) => setContact('phone', e.target.value)} placeholder="10 अंकों का मोबाइल" required />)}
              </div>

              <h4 className="form-h">वीडियो <small>(यूट्यूब / mp4 लिंक)</small></h4>
              {row('वीडियो लिंक', <input value={f.video} onChange={(e) => set('video', e.target.value)} placeholder="https://youtube.com/watch?v=…" />)}
              {row('…या वीडियो फ़ाइल (सिर्फ इसी टैब में)', <input type="file" accept="video/*" onChange={(e) => notify('वीडियो फ़ाइल अस्थायी रूप से चलेगी — यूट्यूब लिंक बेहतर है।')} />)}

              <h4 className="form-h">फोटो</h4>
              {row('फोटो अपलोड (एक साथ कई)',
                <input type="file" accept="image/*" multiple onChange={(e) => { addFiles(e.target.files); e.target.value = ''; }} />)}
              <div className="field">
                <label>…या फोटो लिंक जोड़ें</label>
                <div className="inline">
                  <input id="f-photo-url" placeholder="https://…" />
                  <button type="button" className="btn btn-ghost btn-sm"
                    onClick={() => {
                      const el = document.getElementById('f-photo-url');
                      const u = el.value.trim();
                      if (!u) return notify('फोटो लिंक डालिए।');
                      if (photos.length >= MAX_PHOTOS) return notify('अधिकतम ' + MAX_PHOTOS + ' फोटो।');
                      setPhotos((p) => [...p, u]);
                      el.value = '';
                    }}>जोड़ें</button>
                </div>
              </div>

              {photos.length > 0 && (
                <div className="thumbs">
                  {photos.map((src, i) => (
                    <div className="thumb" key={i}>
                      <img src={src} alt={'फोटो ' + (i + 1)} />
                      <button type="button" onClick={() => setPhotos((p) => p.filter((_, j) => j !== i))}
                        aria-label="हटाएँ">✕</button>
                    </div>
                  ))}
                </div>
              )}

              <h4 className="form-h">विवरण</h4>
              {row('', <textarea rows="4" value={f.description} onChange={(e) => set('description', e.target.value)} placeholder="प्रॉपर्टी के बारे में विस्तार से लिखिए…" />)}
            </div>
          </div>

          <div className="form-foot">
            <span className="muted">{msg}</span>
            <div className="inline-end">
              <button type="button" className="btn btn-ghost" onClick={onCancel}>रद्द करें</button>
              <button type="submit" className="btn btn-primary" disabled={busy}>
                {busy ? 'सेव हो रहा है…' : editing ? 'अपडेट करें' : 'प्रॉपर्टी सेव करें'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
}

const numOrBlank = (v) => (v === '' || v === undefined ? '' : Number(v));
