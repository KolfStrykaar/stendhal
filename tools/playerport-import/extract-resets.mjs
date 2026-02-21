#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';

const areaDir = process.argv[2] || '/home/jacob/playerport/area';
const outPath = process.argv[3] || path.join(process.cwd(), 'tools/playerport-import/playerport-resets-export.json');

function parseResets(file) {
  const lines = fs.readFileSync(file, 'utf8').split(/\r?\n/);
  const resets = [];
  let inResets = false;

  for (const raw of lines) {
    const line = (raw || '').trim();
    if (line === '#RESETS') { inResets = true; continue; }
    if (!inResets) continue;
    if (line === 'S' || line === '#0') break;
    if (!/^[A-Z]\s/.test(line)) continue;

    const parts = line.split(/\s+/);
    const type = parts[0];
    const nums = parts.slice(1).map(x => Number.parseInt(x, 10)).filter(x => Number.isInteger(x));
    resets.push({ areaFile: path.basename(file), type, args: nums });
  }

  return resets;
}

const files = fs.readdirSync(areaDir).filter(n => n.endsWith('.are')).map(n => path.join(areaDir, n));
const resets = files.flatMap(parseResets);

const payload = { generatedAt: new Date().toISOString(), count: resets.length, resets };
fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');
console.log(`Wrote ${outPath}`);
console.log(`Resets exported: ${resets.length}`);
