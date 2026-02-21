#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';

const playerDir = process.argv[2] || '/home/jacob/playerport/player';
const outPath = process.argv[3] || path.join(process.cwd(), 'tools/playerport-import/player-profiles-export.json');

function parse(file) {
  const lines = fs.readFileSync(file, 'utf8').split(/\r?\n/);
  const out = { file: path.basename(file), name: null, title: null, level: null, classId: null, race: null, alignment: null, gold: null, bank: null, room: null };
  for (const line of lines) {
    let m;
    if ((m = line.match(/^Name\s+(.+)~$/))) out.name = m[1];
    else if ((m = line.match(/^Titl\s+(.+)~$/))) out.title = m[1];
    else if ((m = line.match(/^Levl\s+(\d+)/))) out.level = Number.parseInt(m[1], 10);
    else if ((m = line.match(/^Cla\s+(\d+)/))) out.classId = Number.parseInt(m[1], 10);
    else if ((m = line.match(/^Race\s+(.+)~$/))) out.race = m[1];
    else if ((m = line.match(/^Alig\s+(-?\d+)/))) out.alignment = Number.parseInt(m[1], 10);
    else if ((m = line.match(/^Gold\s+(-?\d+)/))) out.gold = Number.parseInt(m[1], 10);
    else if ((m = line.match(/^Bank\s+(-?\d+)/))) out.bank = Number.parseInt(m[1], 10);
    else if ((m = line.match(/^Room\s+(\d+)/))) out.room = Number.parseInt(m[1], 10);
  }
  return out;
}

const files = fs.readdirSync(playerDir).map(n => path.join(playerDir, n)).filter(f => fs.statSync(f).isFile());
const players = files.map(parse);
const payload = { generatedAt: new Date().toISOString(), count: players.length, players };
fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');
console.log(`Wrote ${outPath}`);
console.log(`Profiles exported: ${players.length}`);
