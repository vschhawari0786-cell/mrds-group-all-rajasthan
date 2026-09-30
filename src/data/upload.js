/* MRDS — photo / video upload (Cloud Storage + base64 fallback) */
import { EkFb } from './firebase.js';
import { MAX_PHOTOS } from './constants.js';

const useFb = () => { EkFb.init(); return EkFb.isOn(); };

function compress(file, maxW = 1400, q = 0.8) {
  return new Promise((resolve, reject) => {
    const fr = new FileReader();
    fr.onerror = () => reject(new Error('read failed'));
    fr.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error('decode failed'));
      img.onload = () => {
        const s = Math.min(1, maxW / img.width);
        const c = document.createElement('canvas');
        c.width = Math.round(img.width * s);
        c.height = Math.round(img.height * s);
        c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
        resolve(c.toDataURL('image/jpeg', q));
      };
      img.src = fr.result;
    };
    fr.readAsDataURL(file);
  });
}

function dataUriToBlob(dataUri) {
  const [head, b64] = dataUri.split(',');
  const mime = (head.match(/:(.*?);/) || [, 'image/jpeg'])[1];
  const bin = atob(b64);
  const arr = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) arr[i] = bin.charCodeAt(i);
  return new Blob([arr], { type: mime });
}

export const EkUpload = {
  MAX_PHOTOS,

  async photos(files, folderId) {
    const out = [];
    const on = useFb() && !!EkFb.storage();

    for (const f of files) {
      if (out.length >= MAX_PHOTOS) break;
      if (!f.type.startsWith('image/')) continue;
      const dataUri = await compress(f);
      if (!on) { out.push(dataUri); continue; }
      try {
        const name = `properties/${folderId || 'new'}/${Date.now()}_${Math.random().toString(36).slice(2, 8)}.jpg`;
        const ref = EkFb.storage().ref(name);
        await ref.put(dataUriToBlob(dataUri), { contentType: 'image/jpeg' });
        out.push(await ref.getDownloadURL());
      } catch (e) {
        console.warn('ekweb: photo upload fail, base64 use —', e.message);
        out.push(dataUri);
      }
    }
    return out;
  },

  video(file) {
    if (!file) return Promise.resolve('');
    return Promise.resolve(URL.createObjectURL(file));
  },
};
