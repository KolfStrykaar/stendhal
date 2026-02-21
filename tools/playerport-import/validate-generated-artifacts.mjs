#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';

const base = process.cwd();

const requiredFiles = [
  'data/conf/playerport/skills.stub.json',
  'data/conf/playerport/clans.stub.json',
  'data/conf/playerport/gods.stub.json',
  'data/conf/spells/playerport.xml',
  'data/conf/items/playerport_objects.xml',
  'data/conf/creatures/playerport_mobiles.xml',
  'data/conf/zones/playerport_seed.json',
  'data/conf/zones/playerport_room_atlas.json',
  'tools/playerport-import/playerport-snapshot.json'
];

function exists(rel) {
  return fs.existsSync(path.join(base, rel));
}

function readJson(rel) {
  return JSON.parse(fs.readFileSync(path.join(base, rel), 'utf8'));
}

const report = {
  generatedAt: new Date().toISOString(),
  missingFiles: [],
  checks: {},
  ok: true,
};

for (const f of requiredFiles) {
  if (!exists(f)) report.missingFiles.push(f);
}

if (report.missingFiles.length > 0) {
  report.ok = false;
}

if (exists('tools/playerport-import/playerport-snapshot.json')) {
  const s = readJson('tools/playerport-import/playerport-snapshot.json');
  report.checks.snapshot = s.counts || {};
}

if (exists('data/conf/zones/playerport_seed.json')) {
  const z = readJson('data/conf/zones/playerport_seed.json');
  report.checks.zoneSeed = { zoneCount: z.count || 0 };
}

if (exists('data/conf/zones/playerport_room_atlas.json')) {
  const a = readJson('data/conf/zones/playerport_room_atlas.json');
  report.checks.roomAtlas = { zoneCount: a.zoneCount || 0, roomCount: a.roomCount || 0 };
}

if (exists('data/conf/playerport/skills.stub.json')) {
  const sk = readJson('data/conf/playerport/skills.stub.json');
  report.checks.skillsStub = { skillCount: (sk.skills || []).length };
}

if (exists('data/conf/playerport/clans.stub.json')) {
  const cl = readJson('data/conf/playerport/clans.stub.json');
  report.checks.clansStub = { clanCount: (cl.clans || []).length };
}

if (exists('data/conf/items/playerport_objects.xml')) {
  const txt = fs.readFileSync(path.join(base, 'data/conf/items/playerport_objects.xml'), 'utf8');
  report.checks.itemXml = { itemNodes: (txt.match(/<item\s+/g) || []).length };
}

if (exists('data/conf/creatures/playerport_mobiles.xml')) {
  const txt = fs.readFileSync(path.join(base, 'data/conf/creatures/playerport_mobiles.xml'), 'utf8');
  report.checks.creatureXml = { creatureNodes: (txt.match(/<creature\s+/g) || []).length };
}

if (exists('data/conf/spells/playerport.xml')) {
  const txt = fs.readFileSync(path.join(base, 'data/conf/spells/playerport.xml'), 'utf8');
  report.checks.spellXml = { spellNodes: (txt.match(/<spell\s+/g) || []).length };
}

if ((report.checks.itemXml?.itemNodes || 0) === 0) report.ok = false;
if ((report.checks.creatureXml?.creatureNodes || 0) === 0) report.ok = false;
if ((report.checks.spellXml?.spellNodes || 0) === 0) report.ok = false;

const out = path.join(base, 'tools/playerport-import/validation-report.json');
fs.writeFileSync(out, `${JSON.stringify(report, null, 2)}\n`, 'utf8');

console.log(`Wrote ${out}`);
console.log(JSON.stringify(report, null, 2));
process.exit(report.ok ? 0 : 2);
