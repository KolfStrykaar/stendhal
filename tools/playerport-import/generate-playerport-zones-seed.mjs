#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';

const areasPath = process.argv[2] || path.join(process.cwd(), 'tools/playerport-import/playerport-areas-export.json');
const outPath = process.argv[3] || path.join(process.cwd(), 'data/conf/zones/playerport_seed.json');

const areasExport = JSON.parse(fs.readFileSync(areasPath, 'utf8'));
const areas = areasExport.areas || [];

const zones = areas.map((a, idx) => ({
  id: `pp_zone_${idx + 1}`,
  sourceAreaFile: a.file,
  name: a.name || a.file,
  vnumRange: a.vnums || null,
  stats: {
    rooms: a.rooms,
    objects: a.objects,
    mobiles: a.mobiles,
    resets: a.resets,
  },
  status: 'todo-convert-rooms-and-resets'
}));

const payload = {
  generatedAt: new Date().toISOString(),
  count: zones.length,
  zones,
};

fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');

console.log(`Wrote ${outPath}`);
console.log(`Generated zones: ${zones.length}`);
