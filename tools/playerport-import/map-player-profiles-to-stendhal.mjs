#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';

const inPath = process.argv[2] || path.join(process.cwd(), 'tools/playerport-import/player-profiles-export.json');
const outPath = process.argv[3] || path.join(process.cwd(), 'tools/playerport-import/player-profiles-stendhal.json');

const src = JSON.parse(fs.readFileSync(inPath, 'utf8')).players || [];

const mapped = src.map(p => ({
  name: p.name || p.file,
  profile: {
    title: p.title || '',
    level: p.level || 1,
    karmaHint: p.alignment ?? 0,
    legacyClassId: p.classId,
    legacyRace: p.race,
    wallet: { gold: p.gold || 0, bank: p.bank || 0 },
    legacyRoomVnum: p.room || null
  }
}));

const payload = { generatedAt: new Date().toISOString(), count: mapped.length, players: mapped };
fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');
console.log(`Wrote ${outPath}`);
console.log(`Profiles mapped: ${mapped.length}`);
