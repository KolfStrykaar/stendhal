#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';

const areaDir = process.argv[2] || '/home/jacob/playerport/area';
const outPath = process.argv[3] || path.join(process.cwd(), 'tools/playerport-import/playerport-areas-export.json');

function parseArea(file) {
  const lines = fs.readFileSync(file, 'utf8').split(/\r?\n/);
  const out = {
    file: path.basename(file),
    name: null,
    vnums: null,
    rooms: 0,
    objects: 0,
    mobiles: 0,
    resets: 0,
  };

  let section = '';
  for (const raw of lines) {
    const line = raw.trim();
    if (!line) continue;

    if (line === '#AREADATA' || line === '#AREA') section = 'area';
    else if (line === '#ROOMS') section = 'rooms';
    else if (line === '#OBJECTS') section = 'objects';
    else if (line === '#MOBILES') section = 'mobiles';
    else if (line === '#RESETS') section = 'resets';

    if (section === 'area') {
      const mName = line.match(/^Name\s+(.+)~$/i);
      const mVnums = line.match(/^VNUMs\s+(\d+)\s+(\d+)$/i);
      if (mName) out.name = mName[1];
      if (mVnums) out.vnums = { min: Number.parseInt(mVnums[1], 10), max: Number.parseInt(mVnums[2], 10) };
    }

    if (section === 'rooms' && /^#\d+/.test(line)) out.rooms += 1;
    if (section === 'objects' && /^#\d+/.test(line)) out.objects += 1;
    if (section === 'mobiles' && /^#\d+/.test(line)) out.mobiles += 1;
    if (section === 'resets' && /^[MOPEGDR].*/.test(line)) out.resets += 1;
  }

  return out;
}

function main() {
  const files = fs.readdirSync(areaDir)
    .filter(n => n.endsWith('.are'))
    .map(n => path.join(areaDir, n));

  const areas = files.map(parseArea);
  const totals = areas.reduce((acc, a) => {
    acc.rooms += a.rooms;
    acc.objects += a.objects;
    acc.mobiles += a.mobiles;
    acc.resets += a.resets;
    return acc;
  }, { rooms: 0, objects: 0, mobiles: 0, resets: 0 });

  const payload = {
    generatedAt: new Date().toISOString(),
    source: areaDir,
    count: areas.length,
    totals,
    areas,
  };

  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');

  console.log(`Wrote ${outPath}`);
  console.log(JSON.stringify({ count: payload.count, ...totals }, null, 2));
}

main();
