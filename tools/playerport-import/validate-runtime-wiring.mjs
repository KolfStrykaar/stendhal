#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';

const base = process.cwd();

function mustContain(file, needle) {
  const p = path.join(base, file);
  const txt = fs.readFileSync(p, 'utf8');
  return txt.includes(needle);
}

const checks = {
  spellsCuratedWired: mustContain('data/conf/spells.xml', 'spells/playerport_curated.xml'),
  itemsCuratedWired: mustContain('data/conf/items.xml', 'items/playerport_curated.xml'),
  creaturesCuratedWired: mustContain('data/conf/creatures.xml', 'creatures/playerport_curated.xml')
};

const ok = Object.values(checks).every(Boolean);
const report = { generatedAt: new Date().toISOString(), checks, ok };

const out = path.join(base, 'tools/playerport-import/runtime-wiring-report.json');
fs.writeFileSync(out, `${JSON.stringify(report, null, 2)}\n`, 'utf8');
console.log(`Wrote ${out}`);
console.log(JSON.stringify(report, null, 2));
process.exit(ok ? 0 : 2);
