#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';

const godsDir = process.argv[2] || '/home/jacob/playerport/gods';
const outPath = process.argv[3] || path.join(process.cwd(), 'tools/playerport-import/gods-factions-seed.json');

const files = fs.readdirSync(godsDir).map(n => path.join(godsDir, n)).filter(f => fs.statSync(f).isFile());
const factions = files.map(f => {
  const name = path.basename(f);
  const firstLine = (fs.readFileSync(f, 'utf8').split(/\r?\n/).find(Boolean) || '').trim();
  return {
    id: `pp_god_${name.toLowerCase().replace(/[^a-z0-9]+/g, '_')}`,
    name,
    summary: firstLine,
    npcDialogueSeed: `I am ${name}. ${firstLine}`
  };
});

const payload = { generatedAt: new Date().toISOString(), count: factions.length, factions };
fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');
console.log(`Wrote ${outPath}`);
console.log(`Factions seeded: ${factions.length}`);
