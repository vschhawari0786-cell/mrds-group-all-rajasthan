import { useState } from 'react';
import { EkAuth } from '../data/auth.js';
import { BRAND } from '../data/constants.js';

export default function LoginModal({ onClose, onDone, notify }) {
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [show, setShow] = useState(false);
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setErr('');
    const r = await EkAuth.login(email, pass);
    setBusy(false);
    if (!r.ok) { setErr(r.error); setPass(''); return; }
    onDone();
    notify('स्वागत है एडमिन! अब प्रॉपर्टी जोड़ सकते हैं।');
  };

  return (
    <div className="modal" onClick={(e) => e.target.classList.contains('modal-back') && onClose()}>
      <div className="modal-back" />
      <div className="modal-box login-box" role="dialog" aria-modal="true">
        <button className="modal-x" onClick={onClose} aria-label="बंद करें">✕</button>

        <div className="login-body">
          <img className="login-logo" src="/assets/img/logo.png" alt="MRDS ग्रुप" />
          <h2>एडमिन लॉगिन</h2>
          <p className="muted">केवल एडमिन ही प्रॉपर्टी जोड़ / बदल / हटा सकता है।</p>

          <form onSubmit={submit}>
            <div className="field">
              <label htmlFor="l-email">ईमेल *</label>
              <input id="l-email" type="email" value={email} autoComplete="username"
                onChange={(e) => setEmail(e.target.value)} placeholder="admin@email.com" required />
            </div>

            <div className="field">
              <label htmlFor="l-pass">पासवर्ड *</label>
              <div className="pw-wrap">
                <input id="l-pass" type={show ? 'text' : 'password'} value={pass} autoComplete="current-password"
                  onChange={(e) => setPass(e.target.value)} placeholder="••••••••" required />
                <button type="button" className="pw-eye" onClick={() => setShow((s) => !s)}
                  title="देखें / छिपाएँ" aria-label="पासवर्ड दिखाएँ">👁️</button>
              </div>
            </div>

            {err && <div className="login-msg">{err}</div>}

            <button className="btn btn-primary btn-block" type="submit" disabled={busy}>
              {busy ? 'जाँच हो रही है…' : '🔐 लॉगिन करें'}
            </button>
          </form>

          <p className="login-note">
            ⚠️ लॉगिन Firebase Authentication से होता है — पासवर्ड किसी के कोड में नहीं रहता।
            डेटा सुरक्षित सर्वर (Firestore) में सेव होता है।
          </p>

          <p className="login-note" style={{ marginTop: 8 }}>
            भूल गए? {BRAND.phoneText} पर संपर्क करें।
          </p>
        </div>
      </div>
    </div>
  );
}
