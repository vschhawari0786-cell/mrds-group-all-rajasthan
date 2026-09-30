/* MRDS — demo listings (mrdsgroup.org ki properties, local images) */
import { plotArt } from './plotart.js';

const IMG = (f) => '/assets/img/' + f;
const U = (id, w = 1000) => `https://images.unsplash.com/${id}?w=${w}&q=70&auto=format&fit=crop`;

const P = {
  p1: U('photo-1501854140801-50d01698950b'),
  p3: U('photo-1449844908441-8829872d2607'),
  p4: U('photo-1570129477492-45c003edd2be'),
  p9: U('photo-1600585154340-be6161a56a0c'),
  s1: U('photo-1441986300917-64674bd600d8'),
  s2: U('photo-1441984904996-e0b6ba687e04'),
  s6: U('photo-1604719312566-8912e9227c6a'),
  f2: U('photo-1500382017468-9049fed747ef'),
  f4: U('photo-1416879595882-3373a0480b5b'),
};

const TEL = '917023272784';
const D = 86400000;

export function EkSeed() {
  const now = Date.now();
  return [
    {
      id: 'p_mrds1', title: 'Near TRIVENI DHAM Shahpura', type: 'plot',
      price: 2100000, priceRange: '₹ 21 लाख - ₹ 34.9 लाख', negotiable: true, featured: true,
      city: 'Jaipur', locality: 'Shahpura', address: 'Near by Devnarayan College, Piplod, Shahpura, Jaipur',
      mapUrl: '', photos: [IMG('piplod.jpg'), IMG('triveni.jpg'), P.p1], video: '',
      description: 'Triveni Dham ke paas residential plot, Devnarayan College ke nazdeek. Registry ready, boundary clear, pakka road aur paani ki facility. Investment ke liye best option.',
      size: { unit: 'sqft', area: 1200, length: 30, width: 40, bba: 'East-West', facing: 'East', roadWidth: '100 ft road', corner: true },
      contact: { name: 'MRDS Group All Rajasthan', phone: TEL },
      createdAt: now - 1 * D,
    },
    {
      id: 'p_mrds2', title: 'MRDS KISAN MARKET AND SUPER MARKET PROJECT', type: 'shop',
      price: 500000, priceRange: '₹ 5 लाख / यूनिट शॉप — ₹ 15 लाख / यूनिट प्लॉट', negotiable: true, featured: true,
      city: 'Jaipur', locality: 'Shahpura', address: 'Nearby Shahpura, Jaipur – 303103',
      mapUrl: '', photos: [IMG('kisan.jpg'), IMG('triveni-drone.jpg'), P.s1], video: '',
      description: 'Kisan Market & Super Market project me dukan aur plot dono available hain. Best investment for shop owners — high footfall, main road facing, guaranteed registry.',
      size: { unit: 'sqft', area: 300, floor: 'Ground floor', facing: 'North', frontRoad: '30 ft road', roadWidth: '30 ft road', corner: false },
      contact: { name: 'MRDS Group All Rajasthan', phone: TEL },
      createdAt: now - 2 * D,
    },
    {
      id: 'p_mrds3', title: 'Atlantica — 3 & 4 BHK', type: 'flat',
      price: 7890000, priceRange: '₹ 78.9 लाख - ₹ 1.42 करोड़', negotiable: false, featured: true,
      city: 'Jaipur', locality: 'Vaishali Nagar', address: 'Vaishali Nagar, Jaipur, Rajasthan',
      mapUrl: '', photos: [IMG('atlantica.webp')], video: '',
      description: 'Premium residential project with 3 & 4 BHK flats. Modern architecture, lift, parking, power backup aur gated security. Family ke liye ekdum perfect.',
      size: { unit: 'sqft', area: 1650, floor: '4th floor', floors: 1, beds: 4, baths: 4, facing: 'North-East', roadWidth: '30 ft road', corner: false },
      contact: { name: 'MRDS Group All Rajasthan', phone: TEL },
      createdAt: now - 3 * D,
    },
    {
      id: 'p_mrds4', title: 'The New Door — 1 & 2 BHK', type: 'flat',
      price: 2100000, priceRange: '₹ 21 लाख - ₹ 34.9 लाख', negotiable: true, featured: false,
      city: 'Jaipur', locality: 'Ajmer Road', address: 'Ajmer Road, Jaipur, Rajasthan',
      mapUrl: '', photos: [IMG('newdoor.jpg')], video: '',
      description: 'Ajmer Road par 1 & 2 BHK flats — sabse affordable price me. Connection ready, possession me turant, EMI arrange karne me madad.',
      size: { unit: 'sqft', area: 850, floor: '2nd floor', floors: 1, beds: 2, baths: 2, facing: 'East', roadWidth: '40 ft road', corner: false },
      contact: { name: 'MRDS Group All Rajasthan', phone: TEL },
      createdAt: now - 4 * D,
    },
    {
      id: 'p_mrds5', title: "The Amelia's — 1 & 2 BHK", type: 'flat',
      price: 1950000, priceRange: '₹ 19.50 लाख - ₹ 37.80 लाख', negotiable: true, featured: false,
      city: 'Jaipur', locality: 'Ajmer Road', address: 'Ajmer Road, Jaipur, Rajasthan',
      mapUrl: '', photos: [], video: '',
      description: "The Amelia's — Ajmer Road par 1 & 2 BHK flats. Prime location, sabhi basic facilities, competitive price aur easy registry.",
      size: { unit: 'sqft', area: 850, floor: '3rd floor', floors: 1, beds: 2, baths: 2, facing: 'West', roadWidth: '40 ft road', corner: false },
      contact: { name: 'MRDS Group All Rajasthan', phone: TEL },
      createdAt: now - 5 * D,
    },
    {
      id: 'p_mrds6', title: 'Sri Ganraj Buildcon Pvt. Ltd. — 2 & 3 BHK, Jagatpura', type: 'villa',
      price: 4500000, priceRange: 'मूल्य : ₹ 45 लाख - ₹ 70 लाख', negotiable: true, featured: true,
      city: 'Jaipur', locality: 'Jagatpura', address: 'Jagatpura, Jaipur, Rajasthan',
      mapUrl: '', photos: [IMG('project.webp'), IMG('triveni.jpg'), P.p9], video: '',
      description: 'Sri Ganraj Buildcon Pvt. Ltd. ka residential project Jagatpura me — 2 & 3 BHK. RERA approved, quality construction, greenery aur peaceful environment.',
      size: { unit: 'sqft', area: 1500, floor: 'Ground floor', floors: 2, beds: 3, baths: 3, facing: 'North', roadWidth: '30 ft road', corner: false },
      contact: { name: 'MRDS Group All Rajasthan', phone: TEL },
      createdAt: now - 6 * D,
    },
    {
      id: 'p_mrds7', title: '1500 sq.ft Farmhouse on 2 Acre — Mango Plantation', type: 'farmhouse',
      price: 14500000, priceRange: '₹ 1.45 करोड़', negotiable: true, featured: false,
      city: 'Jaipur', locality: 'Shahpura', address: 'Shahpura Bypass, Jaipur, Rajasthan',
      mapUrl: '',
      photos: [plotArt({ label: 'FARMHOUSE', width: 30, length: 50, area: 1500, areaUnit: 'sqft', road: 'pakka', corner: false, tone: 1 }), P.f2, P.f4],
      video: '',
      description: 'Fully developed farmhouse: 1500 sq.ft built-up villa, 6 ft boundary wall, borewell + tanker backup, mango plantation. Weekend family destination ke liye perfect.',
      size: { unit: 'sqft', area: 1500, land: 2, landUnit: 'acre', boundary: '6 ft wall', water: 'Borewell + Tanker', beds: 4, baths: 4, roadWidth: 'Pakka road, 12 km from city', facing: 'North-East', corner: false },
      contact: { name: 'MRDS Group All Rajasthan', phone: TEL },
      createdAt: now - 7 * D,
    },
    {
      id: 'p_mrds8', title: '1000 sq.ft Farmhouse — Road Touch, Ready to Move', type: 'farmhouse',
      price: 4800000, priceRange: '₹ 48 लाख', negotiable: true, featured: false,
      city: 'Jaipur', locality: 'Shahpura', address: 'Shahpura Bypass, Jaipur, Rajasthan',
      mapUrl: '', photos: [P.f2, IMG('triveni-drone.jpg'), P.p1], video: '',
      description: '1000 sq.ft ka fully ready farmhouse — pakka road se directe connect, electricity connection done, borewell aur boundary wall. Turant shift kar sakte hain.',
      size: { unit: 'sqft', area: 1000, land: 1, landUnit: 'acre', boundary: '5 ft wall', water: 'Borewell', beds: 3, baths: 3, roadWidth: 'Pakka road', facing: 'South', corner: false },
      contact: { name: 'MRDS Group All Rajasthan', phone: TEL },
      createdAt: now - 8 * D,
    },
  ];
}
