import { BRAND } from '../data/constants.js';

export default function About() {
  return (
    <section className="section" id="about">
      <div className="wrap about-grid">
        <div className="about-imgs">
          <img className="a1" src="/assets/img/triveni.jpg" alt="MRDS किसान बाज़ार गेट" />
          <img className="a2" src="/assets/img/triveni-drone.jpg" alt="MRDS त्रिवेणी ऑफिस ड्रोन दृश्य" />
          <div className="support"><span>24*7</span><b>सहायता</b></div>
        </div>

        <div className="about-txt">
          <span className="eyebrow">हमारे बारे में</span>
          <h2>हमारी जानकारी</h2>

          <p>
            <b>{BRAND.name}</b> — जयपुर की प्रतिष्ठित रियल एस्टेट कंपनी। प्लॉट, दुकान,
            फार्महाउस, फ्लैट एवं विला के लिए एस्टेट एजेंट, बिल्डर्स एवं डेवलपर,
            प्रॉपर्टी कंसल्टेंट और रेजिडेंशियल प्लॉट — हम इन सबके लिए जाने जाते हैं।
          </p>
          <p className="hi">
            हम "सुरक्षित निवेश, सुनिश्चित भविष्य" के मूल्यांकन पर काम करते हैं — रजिस्ट्री से
            लेकर प्लॉट बुकिंग तक पूरी सहायता।
          </p>
          <p className="hi">
            <b>हमारा क्षेत्र — पूरा राजस्थान।</b> जयपुर, जोधपुर, उदयपुर, कोटा, अजमेर, सीकर,
            भीलवाड़ा, अलवर — पूरे राजस्थान में प्लॉट, दुकान, फार्महाउस, फ्लैट और विला उपलब्ध हैं।
          </p>

          <ul className="about-points">
            <li><b>एमआरडीएस ग्रुप खोजें</b><span>क्षेत्रफल के साथ सत्यापित प्लॉट, दुकान एवं फार्महाउस</span></li>
            <li><b>हमारी टीम से मिलें</b><span>साइट विज़िट, रजिस्ट्री एवं कागज़ी कामों में पूरा सहयोग</span></li>
            <li><b>चाबियाँ पाएँ</b><span>रजिस्ट्री के बाद तुरंत कब्ज़ा एवं चाबियाँ</span></li>
          </ul>

          <div className="about-btns">
            <a className="btn btn-primary" href="#properties">सभी प्रॉपर्टी देखें</a>
            <a className="btn btn-green" href={BRAND.waLink} target="_blank" rel="noopener">💬 अभी व्हाट्सएप करें</a>
            <a className="btn btn-outline-red" href={BRAND.tel}>📞 संपर्क करें</a>
          </div>
        </div>
      </div>
    </section>
  );
}
