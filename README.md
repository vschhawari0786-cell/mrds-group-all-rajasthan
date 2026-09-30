# MRDS GROUP ALL RAJSTHAN PVT. LTD.

> **"सुरक्षित निवेश , सुनिश्चित भविष्य"**

पूरे राजस्थान में **प्लॉट · दुकान · फार्महाउस · फ्लैट · विला** — क्षेत्रफल, मूल्य, फोटो एवं वीडियो के साथ।

🌐 **Live:** https://mrds-28d50.web.app
📞 **7023272784** · ✉️ vschhawari0786@gmail.com
📍 Plot No. 121, Holi House, Heera Nagar "A", Ajmer Road, Jaipur – 302021, Rajasthan

---

## Stack

| | |
|---|---|
| **Frontend** | React 19 · React Router 7 · Vite 6 |
| **Styling** | Custom CSS (colorful theme + dark mode) |
| **Database** | Firebase **Firestore** (real-time) |
| **Auth** | Firebase **Authentication** (email/password) |
| **Photos** | Firebase **Cloud Storage** + base64 fallback |
| **Hosting** | Firebase Hosting |

---

## Features

- **5 property types** — प्लॉट, दुकान, फार्महाउस, फ्लैट/अपार्टमेंट, विला
- **Size with unit** — वर्ग फुट, वर्ग गज, वर्ग मीटर, एकड़, बीघा
- **Quick-size chips** — एक click me size set ( farmhouse: 500 / 1000 / 1500 / 2000 वर्ग फुट )
- **Plot image auto-generator** — photo na ho to site खुद बनाती है (क खाली प्लॉट + पक्की सड़क + चारदीवारी + लाइट + पेड़ + size labels)
- **Video** — YouTube / Vimeo / direct `.mp4`
- **Multiple photos** — auto-compressed, max 8
- **Filters** — keyword/locality, type, min/max area
- **Sort** — newest, price ↑↓, area ↑↓
- **Call · WhatsApp · Google Maps · Email** — हर जगह जुड़े हुए
- **Admin panel** — only admin can add / edit / delete
- **SEO** — Hindi `lang`, sitemap, robots.txt, JSON-LD `RealEstateAgent`, Open Graph
- **Dark mode**, Export/Import JSON, floating action buttons

---

## 🔐 Security

Sirf admin (`vschhawari0786@gmail.com`) hi property add / edit / delete kar sakta hai.

| | |
|---|---|
| Login | Firebase Authentication (server-side verify) |
| Write | Firestore Rules — `request.auth.token.email` se check |
| Read | Public — sab dekh sakte hain |

```js
// firestore.rules
function isAdmin() {
  return request.auth != null
    && request.auth.token.email == 'vschhawari0786@gmail.com';
}
allow read: if true;                    // sab dekh sakte hain
allow create, update, delete: if isAdmin();   // sirf admin likh sakta hai
```

> ⚠️ Repo me **plaintext password nahi** hai. `src/data/firebase.js` me jo `apiKey`
> hai wo Firebase ki **public client key** hai — jo by design frontend code me rehti
> hai (har Firebase website aisa karti hai). Asli security rules se aati hai.

---

## 🚀 Run locally

```bash
npm install
npm run dev        # http://localhost:5180
```

## Build & deploy

```bash
npm run build          # → dist/
npm run deploy         # build + Firebase Hosting deploy
npm run deploy:rules   # Firestore / Storage rules deploy
```

---

## Project structure

```
ekweb/
├── index.html              # SEO head (Hindi meta, JSON-LD, canonical)
├── vite.config.js
├── firebase.json           # hosting → dist/
├── firestore.rules         # security rules
├── storage.rules
├── sitemap.xml / robots.txt
├── plot-sample.svg         # plot image generator ka output
├── static/                 # public assets (images)
│   └── assets/img/
└── src/
    ├── main.jsx
    ├── App.jsx
    ├── styles.css
    ├── data/
    │   ├── firebase.js     # config + init
    │   ├── auth.js         # Firebase Auth (+ offline fallback)
    │   ├── store.js        # Firestore + localStorage fallback
    │   ├── upload.js       # Cloud Storage photos
    │   ├── plotart.js      # plot image generator
    │   ├── seed.js         # demo listings
    │   └── constants.js    # types, units, brand, formatting
    ├── hooks/
    │   └── index.js        # useToast, useTheme, useAdmin, useProperties, useScrollSpy
    ├── lib/
    │   └── propertyHelpers.js
    └── components/
        ├── Hero.jsx
        ├── About.jsx
        ├── Properties.jsx
        ├── PropertyCard.jsx
        ├── PropertyModal.jsx
        ├── AddProperty.jsx
        ├── Contact.jsx
        ├── Footer.jsx
        └── LoginModal.jsx
```

---

## Configuration

Brand info / phone / email yahan se badliye:

```
src/data/constants.js  →  BRAND object (phone, email, address, maps links)
src/data/firebase.js   →  Firebase config
firestore.rules        →  admin email
storage.rules          →  admin email
```

---

## Contact

<div>

**MRDS GROUP ALL RAJSTHAN PVT. LTD.**
सुरक्षित निवेश, सुनिश्चित भविष्य

📞 7023272784
✉️ vschhawari0786@gmail.com
📍 Plot No. 121, Holi House, Heera Nagar "A", Ajmer Road, Jaipur – 302021, Rajasthan
🌐 https://mrds-28d50.web.app

</div>
