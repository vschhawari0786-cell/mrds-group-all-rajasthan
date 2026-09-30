import { BRAND } from '../data/constants.js';

export default function Footer({ admin }) {
  return (
    <>
      <footer className="foot">
        <div className="wrap foot-top">
          <img className="foot-logo" src="/assets/img/logo.png" alt="MRDS ग्रुप" />
          <div>
            <h4>ड्रीम होम चाहिए?</h4>
            <p className="muted">हम आपके नए घर के सपने को पूरा करने में मदद कर सकते हैं</p>
          </div>
          <a className="btn btn-gold" href="#properties">प्रॉपर्टी देखें</a>
        </div>

        <div className="wrap foot-grid">
          <div>
            <img className="foot-logo sm" src="/assets/img/logo.png" alt="MRDS ग्रुप" />
            <p className="muted">प्लॉट • दुकान • फार्महाउस • फ्लैट • विला — क्षेत्रफल, फोटो एवं वीडियो के साथ।</p>
            <p className="ra-foot">🗺️ <b>ऑल राजस्थान</b> · प्लॉट • दुकान • फार्महाउस • फ्लैट • विला</p>

            <h6 style={{ marginTop: 16 }}>तुरंत जुड़ें</h6>
            <div className="social">
              <a href={BRAND.call} title="फोन कॉल करें" aria-label="फोन कॉल करें">📞</a>
              <a href={BRAND.waLink} target="_blank" rel="noopener" title="व्हाट्सएप चैट" aria-label="व्हाट्सएप चैट">💬</a>
              <a href={BRAND.mapsDir} target="_blank" rel="noopener" title="Google Maps — दिशा" aria-label="Google Maps दिशा">🗺️</a>
              <a href={BRAND.search} target="_blank" rel="noopener" title="Google पर खोजें" aria-label="Google पर खोजें">G</a>
              <a href={BRAND.mail} title="ईमेल" aria-label="ईमेल">✉️</a>
            </div>
          </div>

          <div>
            <h6>त्वरित लिंक</h6>
            <a href="#about">हमारे बारे में</a>
            <a href="#properties">प्रॉपर्टीज़</a>
            {admin && <a href="#add">प्रॉपर्टी जोड़ें</a>}
            <a href="#contact">संपर्क करें</a>
          </div>

          <div>
            <h6>संपर्क करें</h6>
            <p className="muted">{BRAND.address}</p>
            <a href={BRAND.tel}>📞 {BRAND.phoneText}</a>
            <a href={BRAND.mail}>✉️ {BRAND.email}</a>
          </div>
        </div>

        <div className="copy">
          कॉपीराइट © {new Date().getFullYear()} {BRAND.name} — सर्वाधिकार सुरक्षित।
        </div>
      </footer>

      <div className="fab-stack">
        <a className="fab gmap" href={BRAND.mapsDir} target="_blank" rel="noopener"
          title="Google Maps — दिशा" aria-label="Google Maps दिशा">🗺️</a>
        <a className="fab wa" href={BRAND.waLink} target="_blank" rel="noopener"
          title="व्हाट्सएप चैट" aria-label="व्हाट्सएप चैट">💬</a>
        <a className="fab call" href={BRAND.call} title="फोन कॉल करें" aria-label="फोन कॉल करें">📞</a>
        <a className="fab top" href="#top" title="ऊपर जाएँ" aria-label="ऊपर जाएँ"
          style={{ opacity: 1, pointerEvents: 'auto' }}>▲</a>
      </div>
    </>
  );
}
