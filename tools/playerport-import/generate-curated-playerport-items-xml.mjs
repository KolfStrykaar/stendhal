#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';

const sourcePath = process.argv[2] || path.join(process.cwd(), 'data/conf/items/playerport_objects.xml');
const outPath = process.argv[3] || path.join(process.cwd(), 'data/conf/items/playerport_curated.xml');

const src = fs.readFileSync(sourcePath, 'utf8');
const itemBlocks = [...src.matchAll(/<item\s+[\s\S]*?<\/item>/g)].map(m => m[0]);

// Keep a conservative subset for staged rollout.
const curated = itemBlocks.slice(0, 250);

const xml = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '',
  '<items xmlns="stendhal" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"',
  '\txsi:schemaLocation="stendhal ../items.xsd">',
  '',
  ...curated,
  '',
  '</items>',
  ''
].join('\n');

fs.writeFileSync(outPath, xml, 'utf8');
console.log(`Wrote ${outPath}`);
console.log(`Curated items: ${curated.length}`);
