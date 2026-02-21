#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';

const areaDir = process.argv[2] || '/home/jacob/playerport/area';
const outPath = process.argv[3] || path.join(process.cwd(), 'tools/playerport-import/playerport-rooms-export.json');

function parseRooms(file) {
  const lines = fs.readFileSync(file, 'utf8').split(/\r?\n/);
  const rooms = [];
  let inRooms = false;

  for (let i = 0; i < lines.length; i += 1) {
    const line = lines[i].trim();
    if (line === '#ROOMS') {
      inRooms = true;
      continue;
    }
    if (!inRooms) continue;
    if (line === '#0') break;

    const m = line.match(/^#(\d+)$/);
    if (!m) continue;

    const vnum = Number.parseInt(m[1], 10);
    const name = (lines[i + 1] || '').replace(/~\s*$/, '');
    const desc = (lines[i + 2] || '').replace(/~\s*$/, '');

    rooms.push({
      areaFile: path.basename(file),
      vnum,
      name,
      description: desc,
    });
  }

  return rooms;
}

const files = fs.readdirSync(areaDir).filter(n => n.endsWith('.are')).map(n => path.join(areaDir, n));
const rooms = files.flatMap(parseRooms);

const payload = {
  generatedAt: new Date().toISOString(),
  source: areaDir,
  count: rooms.length,
  rooms,
};

fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');
console.log(`Wrote ${outPath}`);
console.log(`Rooms exported: ${rooms.length}`);
