#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';

const sourcePath = process.argv[2] || path.join(process.cwd(), 'data/conf/creatures/playerport_mobiles.xml');
const outPath = process.argv[3] || path.join(process.cwd(), 'data/conf/creatures/playerport_curated.xml');

const src = fs.readFileSync(sourcePath, 'utf8');
const blocks = [...src.matchAll(/<creature\s+[\s\S]*?<\/creature>/g)].map(m => m[0]);

// Conservative staged subset.
const curated = blocks.slice(0, 180);

const xml = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '',
  '<creatures xmlns="stendhal" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"',
  '\txsi:schemaLocation="stendhal ../creatures.xsd">',
  '',
  ...curated,
  '',
  '</creatures>',
  ''
].join('\n');

fs.writeFileSync(outPath, xml, 'utf8');
console.log(`Wrote ${outPath}`);
console.log(`Curated creatures: ${curated.length}`);
