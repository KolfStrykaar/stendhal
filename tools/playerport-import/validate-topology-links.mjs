#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';

const topoPath = process.argv[2] || path.join(process.cwd(), 'tools/playerport-import/playerport-room-topology.json');
const outPath = process.argv[3] || path.join(process.cwd(), 'tools/playerport-import/topology-validation.json');

const topo = JSON.parse(fs.readFileSync(topoPath, 'utf8'));
const rooms = topo.rooms || [];
const roomSet = new Set(rooms.map(r => Number(r.vnum)));

let exits = 0;
let dangling = 0;
const danglingSample = [];

for (const r of rooms) {
  for (const e of (r.exits || [])) {
    if (e.toVnum == null) continue;
    exits += 1;
    if (!roomSet.has(Number(e.toVnum))) {
      dangling += 1;
      if (danglingSample.length < 50) {
        danglingSample.push({ from: r.vnum, dir: e.dir, to: e.toVnum, areaFile: r.areaFile });
      }
    }
  }
}

const report = {
  generatedAt: new Date().toISOString(),
  rooms: rooms.length,
  exits,
  dangling,
  danglingSample,
  ok: dangling === 0
};

fs.writeFileSync(outPath, `${JSON.stringify(report, null, 2)}\n`, 'utf8');
console.log(`Wrote ${outPath}`);
console.log(JSON.stringify({ rooms: report.rooms, exits: report.exits, dangling: report.dangling }, null, 2));
process.exit(report.ok ? 0 : 2);
