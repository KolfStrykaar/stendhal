#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';

const skillsPath = process.argv[2] || path.join(process.cwd(), 'tools/playerport-import/player-skills-stendhal.json');
const clansPath = process.argv[3] || path.join(process.cwd(), 'tools/playerport-import/clans-stendhal.json');
const outPath = process.argv[4] || path.join(process.cwd(), 'tools/playerport-import/offline-import-batches.ndjson');

const skills = JSON.parse(fs.readFileSync(skillsPath, 'utf8')).players || [];
const clans = JSON.parse(fs.readFileSync(clansPath, 'utf8')).clans || [];

const lines = [];
for (const p of skills) {
  lines.push(JSON.stringify({ kind: 'skills', player: p.name, skills: p.skills || {} }));
}
for (const c of clans) {
  for (const m of (c.members || [])) {
    lines.push(JSON.stringify({ kind: 'clan', player: m, guild: c.stendhalGuildId, legacyClan: c.legacyClan }));
  }
}

fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, `${lines.join('\n')}\n`, 'utf8');
console.log(`Wrote ${outPath}`);
console.log(`Batch rows: ${lines.length}`);
