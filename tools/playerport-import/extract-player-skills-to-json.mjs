#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';

const playerDir = process.argv[2] || '/home/jacob/playerport/player';
const outPath = process.argv[3] || path.join(process.cwd(), 'tools/playerport-import/player-skills-export.json');

function parsePlayer(file) {
  const lines = fs.readFileSync(file, 'utf8').split(/\r?\n/);
  let name = path.basename(file);
  const skills = {};

  for (const line of lines) {
    const nm = line.match(/^Name\s+(.+)~$/);
    if (nm) name = nm[1];

    const sm = line.match(/^Sk\s+(\d+)\s+'(.+)'\s*$/);
    if (sm) {
      skills[sm[2]] = Number.parseInt(sm[1], 10);
    }
  }

  return { name, skills };
}

function main() {
  const files = fs.readdirSync(playerDir)
    .map(n => path.join(playerDir, n))
    .filter(f => fs.statSync(f).isFile());

  const players = files.map(parsePlayer);
  const payload = {
    generatedAt: new Date().toISOString(),
    source: playerDir,
    count: players.length,
    players,
  };

  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');

  console.log(`Wrote ${outPath}`);
  console.log(`Players exported: ${players.length}`);
}

main();
