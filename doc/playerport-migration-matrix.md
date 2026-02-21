# Playerport → Stendhal Migration Matrix

## Objective
Port Playerport theme/mechanics/content into Stendhal while keeping Stendhal UI as the primary frontend.

## Source assets (Playerport)
- Engine/mechanics: `playerport/src/*.c`
- Skills/magic learned data: `playerport/player/*` (`Sk <value> '<skill name>'`)
- Clans: `playerport/data/clan.*`
- Gods/admin metadata: `playerport/gods/*`
- Areas/world: `playerport/area/*.are` + `area.lst`
- Players/persistence: `playerport/player/*`

## Target subsystems (Stendhal)
- Combat/stat logic: `src/games/stendhal/server/entity/*`, `server/actions/attack/*`
- Spell system: `server/entity/spell/*`, `server/actions/spell/*`
- Player/account model: `server/entity/player/*`, DB schema in `stendhal_init.sql`
- Items/equipment: `server/entity/item/*`, `server/entity/equip/*`
- World/maps/zones: `server/maps/*`, `server/core/config/zone/*`
- Web UI frontend: `src/js/stendhal/*`

## Migration mapping

| Domain | Playerport format | Stendhal target | Migration approach |
|---|---|---|---|
| Skills | `Sk` lines in pfiles + skill tables in C | New/extended skill registry + player skill state | Import names + learned values, map to Stendhal skill IDs |
| Magic/Spells | ROM spell functions + skill entries | `entity/spell/*` + action handlers | Implement compatibility spell set + effect mappers |
| Players | Flat text pfiles | SQL/player entities | Build parser + transform + loader script |
| Gods | `gods/*` text | Roles/admin metadata | Convert to role/permission records |
| Clans | `data/clan.*` member lists | Guild/group system | Import as guilds with member links |
| Items | `#OBJECTS` area sections | Item classes/templates | Build object extractor, map item type/flags |
| Areas | `.are` sections (`#ROOMS`, `#RESETS`, etc.) | Zone/map definitions | Build staged converter (rooms first, then mob/object placement) |
| Theme/Style | ANSI/prompt text style | Web UI CSS/theme + HUD widgets | Add Playerport theme pack + prompt/combat widgets |

## Incremental implementation plan

1. **Data extraction pipeline (now)**
   - Generate JSON snapshots from Playerport assets.
2. **Schema bridge**
   - Define canonical intermediate JSON model for skills/spells/items/areas.
3. **Mechanics bridge**
   - Add Playerport-compat skill/spell layer in Stendhal server.
4. **Content loaders**
   - Load clans/gods/players/items/areas from intermediate JSON.
5. **UI theme pass**
   - Add Playerport visual profile in Stendhal web client.
6. **Validation**
   - Character migration tests, combat parity tests, map/quest sanity tests.

## Risk notes
- Direct 1:1 behavior parity is unrealistic initially; use compatibility mode and iterate.
- Keep imports idempotent and reversible (dry-run + diff reports).
- Migrate player accounts only after mechanics baseline is stable.
