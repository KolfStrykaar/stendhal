# Playerport x Stendhal Completion Criteria

Project is considered complete when all items below are done:

## A) Visual/Thematic Integration (Stendhal-native)
- [x] Playerport-inspired UI theme layer exists
- [x] Theme can be toggled and persisted (`/playertheme`)
- [ ] Sprite/tileset replacement pass for core entities completed
- [ ] Zone art pass applied for migrated zones

## B) Mechanics Integration (Stendhal gameplay model preserved)
- [x] Compatibility skill registry scaffold exists
- [x] Spell compatibility seed generated and loaded via spells group
- [ ] Skill effects mapped to Stendhal combat hooks with balancing
- [ ] Curated Playerport spell list tuned for production

## C) Data Migration Pipeline
- [x] Skills extraction + conversion pipeline
- [x] Clans extraction + conversion pipeline
- [x] Objects extraction + item XML seed generation
- [x] Mobiles extraction + creature XML seed generation
- [x] Rooms extraction + map atlas generation
- [x] Area stats + zone seed generation
- [ ] Player account/profile migration mapping finalized
- [ ] Gods/factions/narrative migration applied in NPC/dialogue systems

## D) Runtime Importers
- [x] `ppimportskills` admin command
- [x] `ppimportclans` admin command
- [ ] Bulk offline migration loader for DB-backed entities
- [x] Dry-run + diff report mode for imports

## E) Zone/World Conversion
- [ ] Room topology converter (.are -> Stendhal zone data)
- [ ] Exit/link generation and validation
- [ ] Reset/spawn conversion pass
- [ ] Quest/script adaptation pass

## F) Validation & Release
- [x] Automated migration validation script (counts, refs, collisions baseline)
- [x] Gameplay sanity scenarios (movement/combat/items/spells)
- [x] Staging rollout with rollback playbook
- [x] Release notes and migration runbook
