#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';

const areaDir = process.argv[2] || '/home/jacob/playerport/area';
const outPath = process.argv[3] || path.join(process.cwd(), 'tools/playerport-import/playerport-mobiles-export.json');

function parseMobiles(file) {
  const lines = fs.readFileSync(file, 'utf8').split(/\r?\n/);
  const mobiles = [];
  let inMobiles = false;

  for (let i = 0; i < lines.length; i += 1) {
    const line = lines[i].trim();
    if (line === '#MOBILES') {
      inMobiles = true;
      continue;
    }
    if (!inMobiles) continue;
    if (line === '#0') break;

    const m = line.match(/^#(\d+)$/);
    if (!m) continue;

    const vnum = Number.parseInt(m[1], 10);
    const playerName = (lines[i + 1] || '').replace(/~\s*$/, '');
    const shortDescr = (lines[i + 2] || '').replace(/~\s*$/, '');
    const longDescr = (lines[i + 3] || '').replace(/~\s*$/, '');

    mobiles.push({
      areaFile: path.basename(file),
      vnum,
      playerName,
      shortDescr,
      longDescr,
    });
  }

  return mobiles;
}

const files = fs.readdirSync(areaDir).filter(n => n.endsWith('.are')).map(n => path.join(areaDir, n));
const mobiles = files.flatMap(parseMobiles);

const payload = {
  generatedAt: new Date().toISOString(),
  source: areaDir,
  count: mobiles.length,
  mobiles,
};

fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');
console.log(`Wrote ${outPath}`);
console.log(`Mobiles exported: ${mobiles.length}`);
