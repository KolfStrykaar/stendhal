#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';

const roomsPath = process.argv[2] || path.join(process.cwd(), 'tools/playerport-import/playerport-rooms-export.json');
const outPath = process.argv[3] || path.join(process.cwd(), 'data/conf/zones/playerport_room_atlas.json');

const data = JSON.parse(fs.readFileSync(roomsPath, 'utf8'));
const rooms = data.rooms || [];

const zones = new Map();
for (const r of rooms) {
  if (!zones.has(r.areaFile)) {
    zones.set(r.areaFile, { areaFile: r.areaFile, roomCount: 0, rooms: [] });
  }
  const z = zones.get(r.areaFile);
  z.roomCount += 1;
  z.rooms.push({
    vnum: r.vnum,
    name: r.name,
    description: r.description,
    stendhalZoneHint: `pp_zone_${r.areaFile.replace(/\.are$/i, '').replace(/[^a-z0-9]+/gi, '_').toLowerCase()}`
  });
}

const payload = {
  generatedAt: new Date().toISOString(),
  zones: [...zones.values()].sort((a, b) => a.areaFile.localeCompare(b.areaFile)),
  zoneCount: zones.size,
  roomCount: rooms.length,
};

fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');
console.log(`Wrote ${outPath}`);
console.log(`Zones: ${payload.zoneCount}, Rooms: ${payload.roomCount}`);
