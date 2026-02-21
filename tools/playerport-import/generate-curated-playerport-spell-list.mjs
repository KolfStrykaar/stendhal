#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';

const inPath = process.argv[2] || path.join(process.cwd(), 'data/conf/spells/playerport.xml');
const outPath = process.argv[3] || path.join(process.cwd(), 'data/conf/spells/playerport_curated.txt');

const txt = fs.readFileSync(inPath, 'utf8');
const names = [...txt.matchAll(/<spell\s+name="([^"]+)"/g)].map(m => m[1]);

const allow = names.filter(n => /heal|shield|fire|ice|lightning|poison|curse|haste|slow|invis|summon|recall/.test(n));
fs.writeFileSync(outPath, allow.join('\n') + '\n', 'utf8');
console.log(`Wrote ${outPath}`);
console.log(`Curated spells: ${allow.length}`);
