#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';

const mobilesPath = process.argv[2] || path.join(process.cwd(), 'tools/playerport-import/playerport-mobiles-export.json');
const outPath = process.argv[3] || path.join(process.cwd(), 'data/conf/creatures/playerport_mobiles.xml');

const data = JSON.parse(fs.readFileSync(mobilesPath, 'utf8'));
const mobiles = data.mobiles || [];

function esc(s) {
  return String(s || '').replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&apos;');
}

const xml = [];
xml.push('<?xml version="1.0" encoding="UTF-8"?>');
xml.push('');
xml.push('<creatures xmlns="stendhal" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"');
xml.push('\txsi:schemaLocation="stendhal ../creatures.xsd">');
xml.push('');

for (const m of mobiles) {
  const id = `pp_mob_${m.vnum}`;
  const name = m.shortDescr?.trim() || m.playerName || id;
  const desc = m.longDescr?.trim() || `${name}.`;

  xml.push(`\t<creature name="${esc(id)}">`);
  xml.push(`\t\t<description value="${esc(desc)}"/>`);
  xml.push(`\t\t<title value="${esc(name)}"/>`);
  xml.push(`\t\t<attributes>`);
  xml.push(`\t\t\t<level value="1"/>`);
  xml.push(`\t\t\t<hp value="20"/>`);
  xml.push(`\t\t\t<atk value="5"/>`);
  xml.push(`\t\t\t<def value="5"/>`);
  xml.push(`\t\t\t<xp value="10"/>`);
  xml.push(`\t\t\t<playerport-vnum value="${m.vnum}"/>`);
  xml.push(`\t\t\t<playerport-area value="${esc(m.areaFile)}"/>`);
  xml.push(`\t\t</attributes>`);
  xml.push(`\t</creature>`);
  xml.push('');
}

xml.push('</creatures>');
xml.push('');

fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, xml.join('\n'), 'utf8');
console.log(`Wrote ${outPath}`);
console.log(`Generated creatures: ${mobiles.length}`);
