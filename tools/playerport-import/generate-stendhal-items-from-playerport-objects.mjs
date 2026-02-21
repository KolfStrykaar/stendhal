#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';

const objectsPath = process.argv[2] || path.join(process.cwd(), 'tools/playerport-import/playerport-objects-export.json');
const outPath = process.argv[3] || path.join(process.cwd(), 'data/conf/items/playerport_objects.xml');

const exported = JSON.parse(fs.readFileSync(objectsPath, 'utf8'));
const objects = exported.objects || [];

function esc(s) {
  return String(s || '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');
}

function guessClass(o) {
  const t = (o.rawType ?? -1);
  if (t === 5 || /sword|axe|dagger|mace|whip|spear|flail|polearm/i.test(o.name)) return 'weapon';
  if (t === 9 || /armor|shield|helm|boots|cloak|gloves|ring/i.test(o.name)) return 'armor';
  if (t === 19 || /potion|elixir/i.test(o.name)) return 'drink';
  if (t === 12 || /scroll|tome/i.test(o.name)) return 'scroll';
  if (t === 15 || /food|bread|meat|fish|apple/i.test(o.name)) return 'food';
  return 'misc';
}

const xml = [];
xml.push('<?xml version="1.0" encoding="UTF-8"?>');
xml.push('');
xml.push('<items xmlns="stendhal" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"');
xml.push('\txsi:schemaLocation="stendhal ../items.xsd">');
xml.push('');

for (const o of objects) {
  const id = `pp_obj_${o.vnum}`;
  const cls = guessClass(o);
  const name = (o.shortDescr && o.shortDescr.trim()) ? o.shortDescr.trim() : (o.name || id);
  const desc = (o.longDescr && o.longDescr.trim()) ? o.longDescr.trim() : `${name}.`;

  xml.push(`\t<item name="${esc(id)}" clazz="${cls}">`);
  xml.push(`\t\t<description value="${esc(desc)}"/>`);
  xml.push(`\t\t<title value="${esc(name)}"/>`);
  xml.push(`\t\t<attributes>`);
  xml.push(`\t\t\t<weight value="1"/>`);
  xml.push(`\t\t\t<value value="1"/>`);
  xml.push(`\t\t\t<playerport-vnum value="${o.vnum}"/>`);
  xml.push(`\t\t\t<playerport-area value="${esc(o.areaFile)}"/>`);
  xml.push(`\t\t</attributes>`);
  xml.push(`\t</item>`);
  xml.push('');
}

xml.push('</items>');
xml.push('');

fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, xml.join('\n'), 'utf8');

console.log(`Wrote ${outPath}`);
console.log(`Generated items: ${objects.length}`);
