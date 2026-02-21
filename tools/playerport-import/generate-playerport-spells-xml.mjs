#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';

const skillsStubPath = process.argv[2] || path.join(process.cwd(), 'data/conf/playerport/skills.stub.json');
const outPath = process.argv[3] || path.join(process.cwd(), 'data/conf/spells/playerport.xml');

const knownNonSpells = new Set([
  'reserved','axe','dagger','flail','mace','polearm','shield block','spear','sword','whip','backstab','bash','berserk',
  'camouflage','dirt kicking','disarm','dodge','enhanced damage','envenom','hand to hand','kick','parry','rescue','trip',
  'second attack','third attack','fourth attack','track','break weapon','counter','critical strike','dual wield','lore',
  'sneak','hide','steal','pick lock','peek','scan','fast healing','haggle','meditation','wilderness','hunt','blackjack',
  'ambush','strangle','assassinate','subdue','tripwire','sweep','impale','slice','cut throat'
]);

function escapeXml(s) {
  return s
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');
}

function pickSpellClass(name) {
  const n = name.toLowerCase();
  if (n.includes('heal') || n.includes('cure') || n.includes('refresh') || n.includes('aid')) return 'games.stendhal.server.entity.spell.HealingSpell';
  if (n.includes('shield') || n.includes('sanctuary') || n.includes('armor') || n.includes('protection')) return 'games.stendhal.server.entity.spell.ModifyDefSpell';
  if (n.includes('slow')) return 'games.stendhal.server.entity.spell.SlowDownSpell';
  if (n.includes('strength') || n.includes('frenzy') || n.includes('haste')) return 'games.stendhal.server.entity.spell.ModifyAtkSpell';
  return 'games.stendhal.server.entity.spell.AttackingSpell';
}

function main() {
  const stub = JSON.parse(fs.readFileSync(skillsStubPath, 'utf8'));
  const skills = Array.isArray(stub.skills) ? stub.skills : [];

  const spells = skills
    .map(s => s.legacyName)
    .filter(Boolean)
    .filter(name => !knownNonSpells.has(name.toLowerCase()))
    .filter(name => /\s/.test(name) || name.toLowerCase().includes('spell') || name.toLowerCase().includes('breath') || name.toLowerCase().includes('bolt') || name.toLowerCase().includes('blast') || name.toLowerCase().includes('word') || name.toLowerCase().includes('curse') || name.toLowerCase().includes('invis') || name.toLowerCase().includes('summon') || name.toLowerCase().includes('teleport') || name.toLowerCase().includes('fire') || name.toLowerCase().includes('ice') || name.toLowerCase().includes('lightning'))
    .sort((a,b) => a.localeCompare(b));

  const xml = [];
  xml.push('<?xml version="1.0" encoding="UTF-8"?>');
  xml.push('');
  xml.push('<spells xmlns="stendhal" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"');
  xml.push('\txsi:schemaLocation="stendhal ../spells.xsd">');
  xml.push('');

  for (const name of spells) {
    const cls = pickSpellClass(name);
    xml.push(`\t<spell name="pp_${escapeXml(name.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, ''))}">`);
    xml.push(`\t\t<implementation class-name="${cls}"/>`);
    xml.push('\t\t<nature value="dark"/>');
    xml.push('\t\t<attributes>');
    xml.push('\t\t\t<mana value="8"/>');
    xml.push('\t\t\t<cooldown value="4"/>');
    xml.push('\t\t\t<minimum-level value="1"/>');
    xml.push('\t\t\t<range value="8"/>');
    xml.push('\t\t\t<atk value="0"/>');
    xml.push('\t\t\t<def value="0"/>');
    xml.push('\t\t\t<amount value="80"/>');
    xml.push('\t\t\t<regen value="20"/>');
    xml.push('\t\t\t<rate value="1"/>');
    xml.push('\t\t\t<lifesteal value="0"/>');
    xml.push('\t\t\t<modifier value="0.3"/>');
    xml.push('\t\t</attributes>');
    xml.push('\t</spell>');
    xml.push('');
  }

  xml.push('</spells>');
  xml.push('');

  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, xml.join('\n'), 'utf8');

  console.log(`Wrote ${outPath}`);
  console.log(`Generated spells: ${spells.length}`);
}

main();
