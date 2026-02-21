#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';

const areaDir = process.argv[2] || '/home/jacob/playerport/area';
const outPath = process.argv[3] || path.join(process.cwd(), 'tools/playerport-import/playerport-room-topology.json');

const DIRS = { '0': 'north', '1': 'east', '2': 'south', '3': 'west', '4': 'up', '5': 'down' };

function parseArea(file) {
  const lines = fs.readFileSync(file, 'utf8').split(/\r?\n/);
  const rooms = [];
  let inRooms = false;
  let i = 0;

  while (i < lines.length) {
    const raw = lines[i] || '';
    const line = raw.trim();

    if (line === '#ROOMS') { inRooms = true; i += 1; continue; }
    if (!inRooms) { i += 1; continue; }
    if (line === '#0') break;

    const roomMatch = line.match(/^#(\d+)$/);
    if (!roomMatch) { i += 1; continue; }

    const vnum = Number.parseInt(roomMatch[1], 10);
    const name = (lines[i + 1] || '').replace(/~\s*$/, '');
    const exits = [];

    i += 3; // skip vnum, name, description line start

    while (i < lines.length) {
      const t = (lines[i] || '').trim();
      if (!t) { i += 1; continue; }
      if (/^#\d+$/.test(t) || t === 'S') break;

      const d = t.match(/^D([0-5])$/);
      if (d) {
        const dir = DIRS[d[1]] || d[1];
        const numsLine = (lines[i + 3] || '').trim();
        const nums = numsLine.split(/\s+/).map(x => Number.parseInt(x, 10)).filter(x => Number.isInteger(x));
        const toVnum = nums.length >= 3 ? nums[2] : null;
        exits.push({ dir, toVnum });
        i += 4;
        continue;
      }

      i += 1;
    }

    rooms.push({ areaFile: path.basename(file), vnum, name, exits });

    while (i < lines.length && (lines[i] || '').trim() !== 'S' && !/^#\d+$/.test((lines[i] || '').trim())) i += 1;
    if ((lines[i] || '').trim() === 'S') i += 1;
  }

  return rooms;
}

const files = fs.readdirSync(areaDir).filter(n => n.endsWith('.are')).map(n => path.join(areaDir, n));
const rooms = files.flatMap(parseArea);

const payload = { generatedAt: new Date().toISOString(), count: rooms.length, rooms };
fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');
console.log(`Wrote ${outPath}`);
console.log(`Rooms with topology: ${rooms.length}`);
