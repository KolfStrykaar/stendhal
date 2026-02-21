# Playerport Quest/Script Adaptation Baseline

This maps Playerport narrative/behavioral concepts into Stendhal-native quest/NPC scripting.

## Adaptation strategy
1. Preserve Stendhal quest engine as source of truth.
2. Import Playerport lore elements as quest text/state machines.
3. Recreate scripted encounters as NPC dialogue + map triggers.

## Baseline conversion units
- Clan storylines -> faction quest chains
- God lore -> temple NPC dialogues + blessing tasks
- Area-specific roleplay hooks -> zone quest starters

## Initial deliverables (baseline)
- gods->factions seed (`tools/playerport-import/gods-factions-seed.json`)
- room atlas references for quest placement (`data/conf/zones/playerport_room_atlas.json`)
- migration runbook section for staged quest rollout
