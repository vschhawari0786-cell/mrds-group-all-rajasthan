import { useState } from 'react';
import { BRAND } from '../data/constants.js';

export default function Contact() {
  const [f, setF] = useState({ name: '', email: '', phone: '', subject: '', msg: '' });
  const [sent, setSent] = useState(false);

  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  const send = (e) => {
    e.preventDefault();
    const text = [
      'नाम: ' + f.name,
      'ईमेल: ' + (f.email || '-'),
      'फोन: ' + f.phone,
      'विषय: ' + (f.subject || 'प्रॉपर्टी संबंधी'),
      'संदेश: ' + f.msg,
      '',
      '— ' + BRAND.name + ' वेबसाइट से',
    ].join('\n');
    window.open(BRAND.waLink + '?text=' + encodeURIComponent(text), '_blank');
    setSent(true);
  };

  return (
    <section className="section alt" id="contact">
      <div className="wrap">
        <div className="sec-head">
          <div>
            <span className="eyebrow">संपर्क करें</span>
            <h2>संपर्क करें <small>— हमसे जुड़िए</small></h2>
            <p className="muted">प्रॉपर्टी लिस्ट करवानी है या प्लॉट / दुकान / फार्महाउस / फ्लैट खोजने हैं? हमसे संपर्क कीजिए।</p>
          </div>
        </div>

        <div className="card contact">
          <div className="contact-info">
            <div className="ci"><span>📍</span><div><b>पता</b><p>{BRAND.address}</p></div></div>
            <div className="ci"><span>📞</span><div><b>फोन / व्हाट्सएप</b>
              <p><a href={BRAND.tel}>+91 70232 72784</a></p></div></div>
            <div className="ci"><span>✉️</span><div><b>ईमेल</b>
              <p><a href={BRAND.mail}>{BRAND.email}</a></p></div></div>
            <div className="ci"><span>🏢</span><div><b>कंपनी</b>
              <p>{BRAND.name}<br /><span className="muted">सुरक्षित निवेश , सुनिश्चित भविष्य</span></p></div></div>
            <div className="ci"><span>🗺️</span><div><b>सेवा क्षेत्र</b>
              <p><b className="ra">ऑल राजस्थान</b> — जयपुर, जोधपुर, उदयपुर, कोटा, अजमेर, सीकर, भीलवाड़ा, अलवर एवं आगे के सभी शहर।</p></div></div>

            <div className="ci-btns">
              <a className="btn btn-primary" href={BRAND.call}>📞 अभी कॉल करें</a>
              <a className="btn btn-green" href={BRAND.waLink} target="_blank" rel="noopener">💬 व्हाट्सएप चैट</a>
              <a className="btn btn-gmap" href={BRAND.mapsDir} target="_blank" rel="noopener">🗺️ Google Maps</a>
              <a className="btn btn-outline-red" href={BRAND.mail}>✉️ ईमेल भेजें</a>
            </div>
          </div>

          <form className="card contact-form" onSubmit={send}>
            <h3>हमें संदेश भेजें</h3>
            <div className="field"><label htmlFor="c-name">पूरा नाम</label>
              <input id="c-name" value={f.name} onChange={set('name')} placeholder="आपका नाम" required /></div>
            <div className="field"><label htmlFor="c-email">ईमेल</label>
              <input id="c-email" type="email" value={f.email} onChange={set('email')} placeholder="you@example.com" /></div>
            <div className="field"><label htmlFor="c-phone">फोन</label>
              <input id="c-phone" type="tel" value={f.phone} onChange={set('phone')} placeholder="10 अंकों का मोबाइल" /></div>
            <div className="field"><label htmlFor="c-subject">विषय</label>
              <input id="c-subject" value={f.subject} onChange={set('subject')} placeholder="जैसे — प्लॉट से संबंधित जानकारी" /></div>
            <div className="field"><label htmlFor="c-msg">संदेश</label>
              <textarea id="c-msg" rows="3" value={f.msg} onChange={set('msg')} placeholder="आपको किस प्रॉपर्टी की आवश्यकता है?" required /></div>
            <button className="btn btn-primary" type="submit">📨 संदेश भेजें</button>
            {sent && <p className="muted" style={{ margin: 0, fontSize: 13 }}>व्हाट्सएप खुल गया — जल्दी उत्तर मिलेगा।</p>}
          </form>
        </div>
      </div>
    </section>
  );
}
