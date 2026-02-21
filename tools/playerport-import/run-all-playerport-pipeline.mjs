#!/usr/bin/env node

import { execSync } from 'node:child_process';
import path from 'node:path';

const repo = process.cwd();
const ppRoot = process.argv[2] || '/home/jacob/playerport';

const cmds = [
  `node tools/playerport-import/extract-playerport-data.mjs ${ppRoot} tools/playerport-import/playerport-snapshot.json`,
  `node tools/playerport-import/generate-stendhal-migration-stubs.mjs tools/playerport-import/playerport-snapshot.json tools/playerport-import/stubs`,
  `cp tools/playerport-import/stubs/skills.stub.json data/conf/playerport/skills.stub.json`,
  `cp tools/playerport-import/stubs/clans.stub.json data/conf/playerport/clans.stub.json`,
  `cp tools/playerport-import/stubs/gods.stub.json data/conf/playerport/gods.stub.json`,
  `node tools/playerport-import/extract-player-skills-to-json.mjs ${ppRoot}/player tools/playerport-import/player-skills-export.json`,
  `node tools/playerport-import/convert-player-skills-for-stendhal.mjs data/conf/playerport/skills.stub.json tools/playerport-import/player-skills-export.json tools/playerport-import/player-skills-stendhal.json`,
  `node tools/playerport-import/convert-clans-for-stendhal.mjs data/conf/playerport/clans.stub.json tools/playerport-import/clans-stendhal.json`,
  `node tools/playerport-import/extract-areas-and-objects.mjs ${ppRoot}/area tools/playerport-import/playerport-areas-export.json`,
  `node tools/playerport-import/generate-playerport-zones-seed.mjs tools/playerport-import/playerport-areas-export.json data/conf/zones/playerport_seed.json`,
  `node tools/playerport-import/extract-objects-from-areas.mjs ${ppRoot}/area tools/playerport-import/playerport-objects-export.json`,
  `node tools/playerport-import/generate-stendhal-items-from-playerport-objects.mjs tools/playerport-import/playerport-objects-export.json data/conf/items/playerport_objects.xml`,
  `node tools/playerport-import/extract-mobiles-from-areas.mjs ${ppRoot}/area tools/playerport-import/playerport-mobiles-export.json`,
  `node tools/playerport-import/generate-stendhal-creatures-from-playerport-mobiles.mjs tools/playerport-import/playerport-mobiles-export.json data/conf/creatures/playerport_mobiles.xml`,
  `node tools/playerport-import/extract-rooms-from-areas.mjs ${ppRoot}/area tools/playerport-import/playerport-rooms-export.json`,
  `node tools/playerport-import/generate-playerport-map-atlas.mjs tools/playerport-import/playerport-rooms-export.json data/conf/zones/playerport_room_atlas.json`,
  `node tools/playerport-import/generate-playerport-spells-xml.mjs data/conf/playerport/skills.stub.json data/conf/spells/playerport.xml`
];

for (const c of cmds) {
  console.log(`\n>>> ${c}`);
  execSync(c, { stdio: 'inherit', cwd: repo });
}

console.log('\n✅ Playerport pipeline run complete');
