# Playerport Autonomous Progress Log

## Latest wave

- Added `ppimportskills` admin command for applying converted Playerport skills to online players.
- Added `ppimportclans` admin command for assigning converted clan guild IDs to online players.
- Added item conversion generator:
  - `tools/playerport-import/generate-stendhal-items-from-playerport-objects.mjs`
  - outputs `data/conf/items/playerport_objects.xml`
- Added zone seed generator:
  - `tools/playerport-import/generate-playerport-zones-seed.mjs`
  - outputs `data/conf/zones/playerport_seed.json`

## Current state

- We now have an end-to-end extraction + conversion pipeline for:
  - skills
  - clans
  - gods
  - spells
  - objects
  - area zone seeds

- Direction update: Stendhal remains the gameplay model (2D world/sprites, native interaction). Playerport text control is now considered debug-only.
- Added `/playertheme` slash action to apply Playerport-inspired visual styling without changing gameplay model.

Remaining heavy lift is deep semantic conversion (room topology, resets, scripted behavior, and full mechanics parity).
