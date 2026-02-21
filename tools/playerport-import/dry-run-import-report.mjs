#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';

const base = process.cwd();
const playerExportPath = process.argv[2] || path.join(base, 'tools/playerport-import/player-skills-export.json');
const playerConvertedPath = process.argv[3] || path.join(base, 'tools/playerport-import/player-skills-stendhal.json');
const clanConvertedPath = process.argv[4] || path.join(base, 'tools/playerport-import/clans-stendhal.json');
const outPath = process.argv[5] || path.join(base, 'tools/playerport-import/dry-run-report.json');

const sourcePlayers = JSON.parse(fs.readFileSync(playerExportPath, 'utf8')).players || [];
const convertedPlayers = JSON.parse(fs.readFileSync(playerConvertedPath, 'utf8')).players || [];
const convertedClans = JSON.parse(fs.readFileSync(clanConvertedPath, 'utf8')).clans || [];

const sourceByName = new Map(sourcePlayers.map(p => [String(p.name).toLowerCase(), p]));
const convertedByName = new Map(convertedPlayers.map(p => [String(p.name).toLowerCase(), p]));

let playersMatched = 0;
let skillsSource = 0;
let skillsConverted = 0;
let playersWithZeroConverted = 0;

const missingInConverted = [];
const sampleLossy = [];

for (const p of sourcePlayers) {
  const key = String(p.name).toLowerCase();
  const c = convertedByName.get(key);
  const srcCount = Object.keys(p.skills || {}).length;
  skillsSource += srcCount;

  if (!c) {
    missingInConverted.push(p.name);
    continue;
  }

  playersMatched += 1;
  const cvtCount = Object.keys(c.skills || {}).length;
  skillsConverted += cvtCount;

  if (cvtCount === 0) playersWithZeroConverted += 1;
  if (sampleLossy.length < 20 && cvtCount < srcCount) {
    sampleLossy.push({
      name: p.name,
      sourceSkills: srcCount,
      convertedSkills: cvtCount,
      drop: srcCount - cvtCount,
    });
  }
}

let clanMemberships = 0;
for (const c of convertedClans) clanMemberships += (c.members || []).length;

const report = {
  generatedAt: new Date().toISOString(),
  players: {
    sourceCount: sourcePlayers.length,
    convertedCount: convertedPlayers.length,
    matchedByName: playersMatched,
    missingInConvertedCount: missingInConverted.length,
    missingInConvertedSample: missingInConverted.slice(0, 30),
    skillsSource,
    skillsConverted,
    skillsDrop: skillsSource - skillsConverted,
    playersWithZeroConverted,
    sampleLossy,
  },
  clans: {
    convertedClanCount: convertedClans.length,
    totalMemberships: clanMemberships,
  }
};

fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, `${JSON.stringify(report, null, 2)}\n`, 'utf8');

console.log(`Wrote ${outPath}`);
console.log(JSON.stringify({
  sourcePlayers: report.players.sourceCount,
  convertedPlayers: report.players.convertedCount,
  matched: report.players.matchedByName,
  skillsSource: report.players.skillsSource,
  skillsConverted: report.players.skillsConverted,
  clans: report.clans.convertedClanCount
}, null, 2));
