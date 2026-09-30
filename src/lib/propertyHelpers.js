/* MRDS — card ke liye helper (tags etc.) */
import { TYPES, UNITS, nf } from '../data/constants.js';

export function cardTags(p) {
  const s = p.size || {};
  const tags = [];

  if (p.type === 'plot') {
    if (s.length && s.width) tags.push(`${s.length} × ${s.width} फुट`);
    if (s.facing) tags.push('मुखमुख: ' + s.facing);
    if (s.bba) tags.push('बी.बी.ए.: ' + s.bba);
    if (s.corner) tags.push('कोने का प्लॉट');
  }
  if (p.type === 'shop') {
    if (s.floor) tags.push(s.floor);
    if (s.frontRoad) tags.push(s.frontRoad);
    if (s.facing) tags.push('मुखमुख: ' + s.facing);
  }
  if (p.type === 'farmhouse') {
    if (s.land) tags.push('भूमि: ' + nf(s.land) + ' ' + (UNITS[s.landUnit]?.label || 'एकड़'));
    if (s.boundary) tags.push(s.boundary);
    if (s.water) tags.push(s.water);
  }
  if (p.type === 'flat' || p.type === 'villa') {
    if (s.floor) tags.push(s.floor);
    if (s.beds) tags.push(s.beds + ' BHK');
    if (s.baths) tags.push(s.baths + ' बाथरूम');
    if (s.facing) tags.push('मुखमुख: ' + s.facing);
  }
  return tags.slice(0, 4);
}

/* modal ke andar dikhne wale "cells" */
export function detailCells(p) {
  const s = p.size || {};
  const U = UNITS[s.unit]?.label || '';
  const cells = [];
  const add = (k, v) => { if (v !== '' && v !== undefined && v !== null) cells.push({ k, v }); };

  add('प्रकार', TYPES[p.type]?.label);
  add('कुल क्षेत्रफल', s.area ? nf(s.area) + ' ' + U : '');

  if (p.type === 'plot') {
    add('लंबाई', s.length); add('चौड़ाई', s.width);
    add('बी.बी.ए. (सीमा)', s.bba); add('मुखमुख', s.facing);
    if (s.corner) add('कोने का प्लॉट', 'हाँ');
  }
  if (p.type === 'shop') {
    add('मंज़िल', s.floor); add('सामने सड़क', s.frontRoad); add('मुखमुख', s.facing);
  }
  if (p.type === 'farmhouse') {
    add('कुल भूमि क्षेत्रफल', s.land ? nf(s.land) + ' ' + (UNITS[s.landUnit]?.label || 'एकड़') : '');
    add('चारदीवारी', s.boundary); add('पानी का स्रोत', s.water);
    add('बेडरूम', s.beds); add('बाथरूम', s.baths); add('मुखमुख', s.facing);
  }
  if (p.type === 'flat' || p.type === 'villa') {
    add('मंज़िल', s.floor); add('कुल मंज़िलें', s.floors);
    add('बेडरूम', s.beds); add('बाथरूम', s.baths); add('मुखमुख', s.facing);
  }

  add('सड़क / पहचान', s.roadWidth);
  add('उद्देश्य', p.lease ? 'लीज़ / किराया' : 'बिक्री');
  add('संपर्क', p.contact?.name || '—');

  return cells;
}
