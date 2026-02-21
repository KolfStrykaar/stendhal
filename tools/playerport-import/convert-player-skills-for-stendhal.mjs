#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';

const skillsStubPath = process.argv[2] || path.join(process.cwd(), 'data/conf/playerport/skills.stub.json');
const playerSkillsPath = process.argv[3] || path.join(process.cwd(), 'tools/playerport-import/player-skills-export.json');
const outPath = process.argv[4] || path.join(process.cwd(), 'tools/playerport-import/player-skills-stendhal.json');

const stub = JSON.parse(fs.readFileSync(skillsStubPath, 'utf8'));
const exported = JSON.parse(fs.readFileSync(playerSkillsPath, 'utf8'));

const map = new Map();
for (const s of (stub.skills || [])) {
  if (s.legacyName && s.stendhalId) map.set(String(s.legacyName).toLowerCase(), s.stendhalId);
}

const players = (exported.players || []).map(p => {
  const converted = {};
  for (const [legacyName, value] of Object.entries(p.skills || {})) {
    const id = map.get(String(legacyName).toLowerCase());
    if (id) converted[id] = value;
  }
  return {
    name: p.name,
    skillCount: Object.keys(converted).length,
    skills: converted,
  };
});

const payload = {
  generatedAt: new Date().toISOString(),
  count: players.length,
  players,
};

fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');
console.log(`Wrote ${outPath}`);
console.log(`Players converted: ${players.length}`);
