#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';

const playerportRoot = process.argv[2] || '/home/jacob/playerport';
const outPath = process.argv[3] || path.join(process.cwd(), 'tools/playerport-import/playerport-snapshot.json');

function readLines(file) {
  return fs.readFileSync(file, 'utf8').split(/\r?\n/);
}

function safeList(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir).map(name => path.join(dir, name));
}

function parseSkillsFromPlayer(file) {
  const out = [];
  for (const line of readLines(file)) {
    const m = line.match(/^Sk\s+(\d+)\s+'(.+)'\s*$/);
    if (m) out.push({ value: Number.parseInt(m[1], 10), name: m[2] });
  }
  return out;
}

function parseClan(file) {
  return readLines(file)
    .map(s => s.trim())
    .filter(Boolean);
}

function parseGod(file) {
  const first = readLines(file).find(Boolean) || '';
  return { summary: first.trim() };
}

function parseAreaMeta(file) {
  const lines = readLines(file);
  const idx = lines.findIndex(l => l.trim().toUpperCase() === '#AREADATA' || l.trim().toUpperCase() === '#AREA');
  if (idx < 0) return null;

  let name = null;
  let vnums = null;

  for (let i = idx + 1; i < Math.min(lines.length, idx + 60); i += 1) {
    const line = lines[i].trim();
    if (!line) continue;
    const mName = line.match(/^Name\s+(.+)~$/i);
    const mVnums = line.match(/^VNUMs\s+(\d+)\s+(\d+)$/i);
    if (mName) name = mName[1];
    if (mVnums) vnums = { min: Number.parseInt(mVnums[1], 10), max: Number.parseInt(mVnums[2], 10) };
    if (/^End$/i.test(line) || line === '#HELPS') break;
  }

  return { file: path.basename(file), name, vnums };
}

function main() {
  const playerDir = path.join(playerportRoot, 'player');
  const clanDir = path.join(playerportRoot, 'data');
  const godsDir = path.join(playerportRoot, 'gods');
  const areaDir = path.join(playerportRoot, 'area');

  const playerFiles = safeList(playerDir).filter(p => fs.statSync(p).isFile());
  const clanFiles = safeList(clanDir).filter(p => path.basename(p).startsWith('clan.'));
  const godFiles = safeList(godsDir).filter(p => fs.statSync(p).isFile());
  const areaFiles = safeList(areaDir).filter(p => p.endsWith('.are'));

  const skillSet = new Map();
  const samplePlayers = [];

  for (const p of playerFiles) {
    const skills = parseSkillsFromPlayer(p);
    if (skills.length > 0 && samplePlayers.length < 30) {
      samplePlayers.push({ name: path.basename(p), skills: skills.length });
    }
    for (const sk of skills) {
      if (!skillSet.has(sk.name)) skillSet.set(sk.name, { name: sk.name, maxSeen: sk.value, count: 1 });
      else {
        const cur = skillSet.get(sk.name);
        cur.maxSeen = Math.max(cur.maxSeen, sk.value);
        cur.count += 1;
      }
    }
  }

  const clans = {};
  for (const c of clanFiles) clans[path.basename(c)] = parseClan(c);

  const gods = {};
  for (const g of godFiles) gods[path.basename(g)] = parseGod(g);

  const areas = areaFiles.map(parseAreaMeta).filter(Boolean);

  const snapshot = {
    generatedAt: new Date().toISOString(),
    source: playerportRoot,
    counts: {
      players: playerFiles.length,
      clans: clanFiles.length,
      gods: godFiles.length,
      areas: areaFiles.length,
      uniqueSkillsSeenInPlayers: skillSet.size,
    },
    samplePlayers,
    skills: [...skillSet.values()].sort((a, b) => a.name.localeCompare(b.name)),
    clans,
    gods,
    areas,
  };

  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, `${JSON.stringify(snapshot, null, 2)}\n`, 'utf8');
  console.log(`Wrote ${outPath}`);
  console.log(JSON.stringify(snapshot.counts, null, 2));
}

main();
