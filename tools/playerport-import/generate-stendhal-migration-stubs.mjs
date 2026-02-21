#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';

const snapshotPath = process.argv[2] || path.join(process.cwd(), 'tools/playerport-import/playerport-snapshot.json');
const outDir = process.argv[3] || path.join(process.cwd(), 'tools/playerport-import/stubs');

if (!fs.existsSync(snapshotPath)) {
  console.error(`Missing snapshot: ${snapshotPath}`);
  process.exit(1);
}

const snapshot = JSON.parse(fs.readFileSync(snapshotPath, 'utf8'));
fs.mkdirSync(outDir, { recursive: true });

const skillStub = {
  description: 'Playerport-compatible skill registry seed for Stendhal integration',
  generatedAt: new Date().toISOString(),
  skills: snapshot.skills.map(s => ({
    legacyName: s.name,
    stendhalId: `pp_${s.name.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '')}`,
    maxSeen: s.maxSeen,
    importedFromPlayers: s.count,
    status: 'todo-map-mechanics'
  }))
};

const clanStub = {
  description: 'Playerport clan import seed',
  generatedAt: new Date().toISOString(),
  clans: Object.entries(snapshot.clans).map(([file, members]) => ({
    sourceFile: file,
    clanName: file.replace(/^clan\./, ''),
    members,
    status: 'todo-map-guild-system'
  }))
};

const godStub = {
  description: 'Playerport gods/admin seed',
  generatedAt: new Date().toISOString(),
  gods: Object.entries(snapshot.gods).map(([name, meta]) => ({
    name,
    summary: meta.summary,
    status: 'todo-map-admin-roles'
  }))
};

fs.writeFileSync(path.join(outDir, 'skills.stub.json'), `${JSON.stringify(skillStub, null, 2)}\n`, 'utf8');
fs.writeFileSync(path.join(outDir, 'clans.stub.json'), `${JSON.stringify(clanStub, null, 2)}\n`, 'utf8');
fs.writeFileSync(path.join(outDir, 'gods.stub.json'), `${JSON.stringify(godStub, null, 2)}\n`, 'utf8');

console.log(`Wrote stubs to ${outDir}`);
