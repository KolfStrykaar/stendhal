# Gameplay Sanity Scenarios (Playerport-flavored Stendhal)

Run these after importing generated artifacts into a staging server.

## 1) Core movement/world
- Login with migrated test account
- Traverse at least 3 converted zones
- Verify zone transitions and no stuck tiles
- Verify room/zone names are readable and themed

## 2) Combat baseline
- Fight at least 3 migrated creatures
- Confirm attack/defense values are in expected range
- Confirm death/respawn behavior is unchanged from Stendhal expectations

## 3) Skills/spells
- Apply `ppimportskills` to target test player
- Cast 5 Playerport-generated compatibility spells
- Verify mana/cooldown/level constraints still enforced by Stendhal

## 4) Items/equipment
- Spawn/equip imported item seed examples (weapon, armor, consumable)
- Verify equip slots and stat effects apply safely
- Verify no client render crashes on unknown assets

## 5) Clan/guild mapping
- Apply `ppimportclans`
- Verify online players get expected `guild` values
- Verify legacy clan metadata in `!features.playerport_legacy_clan`

## 6) UI/theme
- Enable `/playertheme`
- Verify persisted theme after reload
- Verify readability in chat, map panel, inventory, status bars

## 7) Regression checks
- Confirm quests, trading, chat, and grouping still work
- Confirm no critical errors in server logs during all scenarios
