# Playerport Migration Runbook (Stendhal-native)

## Scope
Migrate Playerport content/theme into Stendhal while preserving Stendhal gameplay model.

## 0) Preflight
- Ensure repo is clean on target commit.
- Back up DB and server config.
- Confirm `tools/playerport-import/*` scripts are present.

## 1) Generate migration artifacts
```bash
node tools/playerport-import/run-all-playerport-pipeline.mjs /home/jacob/playerport
```

## 2) Validate artifacts
```bash
node tools/playerport-import/validate-generated-artifacts.mjs
node tools/playerport-import/dry-run-import-report.mjs
```

## 3) Deploy generated seed files
- `data/conf/spells/playerport.xml`
- `data/conf/items/playerport_objects.xml`
- `data/conf/creatures/playerport_mobiles.xml`
- `data/conf/zones/playerport_seed.json`
- `data/conf/zones/playerport_room_atlas.json`
- `data/conf/playerport/*.json`

## 4) Online import commands (staging)
- Skills import (all online players): `ppimportskills`
- Skills import (single player): with action attr `target=<name>`
- Clan import (all online players): `ppimportclans`
- Clan import (single clan): with action attr `clan=<legacyClan>`

## 5) Gameplay sanity pass
Use checklist:
- `tools/playerport-import/gameplay-sanity-checklist.md`

## 6) Rollback plan
If issues detected:
1. Revert to previous server build/config snapshot
2. Restore DB backup
3. Disable Playerport seed groups/files from runtime config
4. Re-run sanity checks on known-good baseline

## 7) Release notes
Document:
- commit hash deployed
- generated artifact counts
- known caveats (seed quality, balancing TODOs)
