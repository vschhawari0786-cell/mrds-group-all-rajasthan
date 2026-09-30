import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { EkFb } from './data/firebase.js';
import App from './App.jsx';
import './styles.css';

/* Firebase SDK index.html me CDN se already load hai.
   Agar load nahi hua (offline) to site localStorage mode me chalegi. */
EkFb.init();
if (EkFb.isOn()) console.info('ekweb: Firebase mode ON (' + EkFb.config.projectId + ')');
else console.info('ekweb: localStorage mode (' + (EkFb.state.err || 'SDK unavailable') + ')');

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);
