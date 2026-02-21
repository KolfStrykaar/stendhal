# Playerport x Stendhal Completion Criteria

Project is considered complete when all items below are done:

## A) Visual/Thematic Integration (Stendhal-native)
- [x] Playerport-inspired UI theme layer exists
- [x] Theme can be toggled and persisted (`/playertheme`)
- [x] Sprite/tileset replacement manifest seed for core entities completed
- [x] Zone art pass planning manifest applied for migrated zones

## B) Mechanics Integration (Stendhal gameplay model preserved)
- [x] Compatibility skill registry scaffold exists
- [x] Spell compatibility seed generated and loaded via spells group
- [x] Skill effects mapped to Stendhal combat hook baseline (`data/conf/playerport/skill-effect-hooks.json`)
- [x] Curated Playerport spell list baseline generated (`data/conf/spells/playerport_curated.txt`)

## C) Data Migration Pipeline
- [x] Skills extraction + conversion pipeline
- [x] Clans extraction + conversion pipeline
- [x] Objects extraction + item XML seed generation
- [x] Mobiles extraction + creature XML seed generation
- [x] Rooms extraction + map atlas generation
- [x] Area stats + zone seed generation
- [x] Player account/profile migration mapping finalized (export + mapped seed)
- [x] Gods/factions/narrative migration baseline seeded for NPC/dialogue systems

## D) Runtime Importers
- [x] `ppimportskills` admin command
- [x] `ppimportclans` admin command
- [x] Bulk offline migration batch generator for DB-backed entities (NDJSON stream)
- [x] Dry-run + diff report mode for imports

## E) Zone/World Conversion
- [x] Room topology extractor/converter baseline (.are -> zone topology JSON)
- [x] Exit/link generation and validation (baseline report)
- [x] Reset/spawn conversion baseline (structured reset export)
- [x] Quest/script adaptation baseline documented (`doc/playerport-quest-script-adaptation.md`)

## F) Validation & Release
- [x] Automated migration validation script (counts, refs, collisions baseline)
- [x] Gameplay sanity scenarios (movement/combat/items/spells)
- [x] Staging rollout with rollback playbook
- [x] Release notes and migration runbook
