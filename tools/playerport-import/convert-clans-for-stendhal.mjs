#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';

const clansStubPath = process.argv[2] || path.join(process.cwd(), 'data/conf/playerport/clans.stub.json');
const outPath = process.argv[3] || path.join(process.cwd(), 'tools/playerport-import/clans-stendhal.json');

const stub = JSON.parse(fs.readFileSync(clansStubPath, 'utf8'));

const clans = (stub.clans || []).map(c => ({
  legacyClan: c.clanName,
  stendhalGuildId: `pp_clan_${String(c.clanName).toLowerCase().replace(/[^a-z0-9]+/g, '_')}`,
  members: c.members || [],
  memberCount: (c.members || []).length,
}));

const payload = {
  generatedAt: new Date().toISOString(),
  count: clans.length,
  clans,
};

fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');
console.log(`Wrote ${outPath}`);
console.log(`Clans converted: ${clans.length}`);
