#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';

const areaDir = process.argv[2] || '/home/jacob/playerport/area';
const outPath = process.argv[3] || path.join(process.cwd(), 'tools/playerport-import/playerport-objects-export.json');

function parseObjectsFromArea(file) {
  const lines = fs.readFileSync(file, 'utf8').split(/\r?\n/);
  const objects = [];

  let i = 0;
  let inObjects = false;

  while (i < lines.length) {
    const line = lines[i].trim();

    if (line === '#OBJECTS') {
      inObjects = true;
      i += 1;
      continue;
    }

    if (!inObjects) {
      i += 1;
      continue;
    }

    if (line === '#0') break;

    const vnumMatch = line.match(/^#(\d+)$/);
    if (!vnumMatch) {
      i += 1;
      continue;
    }

    const vnum = Number.parseInt(vnumMatch[1], 10);
    const name = (lines[i + 1] || '').replace(/~\s*$/, '');
    const shortDescr = (lines[i + 2] || '').replace(/~\s*$/, '');
    const longDescr = (lines[i + 3] || '').replace(/~\s*$/, '');
    const actionDescr = (lines[i + 4] || '').replace(/~\s*$/, '');

    let type = null;
    for (let j = i + 5; j < Math.min(i + 20, lines.length); j += 1) {
      const t = lines[j].trim();
      if (!t) continue;
      if (/^#\d+/.test(t) || t === '#0') break;
      const nums = t.split(/\s+/).filter(x => /^-?\d+$/.test(x));
      if (nums.length >= 2) {
        type = Number.parseInt(nums[1], 10);
        break;
      }
    }

    objects.push({
      areaFile: path.basename(file),
      vnum,
      name,
      shortDescr,
      longDescr,
      actionDescr,
      rawType: type,
    });

    i += 1;
  }

  return objects;
}

function main() {
  const files = fs.readdirSync(areaDir)
    .filter(n => n.endsWith('.are'))
    .map(n => path.join(areaDir, n));

  const objects = files.flatMap(parseObjectsFromArea);
  const payload = {
    generatedAt: new Date().toISOString(),
    source: areaDir,
    count: objects.length,
    objects,
  };

  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');

  console.log(`Wrote ${outPath}`);
  console.log(`Objects exported: ${objects.length}`);
}

main();
