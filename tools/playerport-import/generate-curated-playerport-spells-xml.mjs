#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';

const sourceXmlPath = process.argv[2] || path.join(process.cwd(), 'data/conf/spells/playerport.xml');
const allowlistPath = process.argv[3] || path.join(process.cwd(), 'data/conf/spells/playerport_curated.txt');
const outPath = process.argv[4] || path.join(process.cwd(), 'data/conf/spells/playerport_curated.xml');

const source = fs.readFileSync(sourceXmlPath, 'utf8');
const allow = new Set(
  fs.readFileSync(allowlistPath, 'utf8')
    .split(/\r?\n/)
    .map(s => s.trim())
    .filter(Boolean)
);

const spellBlocks = [...source.matchAll(/<spell\s+name="([^"]+)"[\s\S]*?<\/spell>/g)];
const selected = spellBlocks.filter(m => allow.has(m[1])).map(m => m[0]);

const xml = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '',
  '<spells xmlns="stendhal" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"',
  '\txsi:schemaLocation="stendhal ../spells.xsd">',
  '',
  ...selected,
  '',
  '</spells>',
  ''
].join('\n');

fs.writeFileSync(outPath, xml, 'utf8');
console.log(`Wrote ${outPath}`);
console.log(`Curated spell nodes: ${selected.length}`);
