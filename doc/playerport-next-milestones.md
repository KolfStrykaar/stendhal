# Playerport Integration – Next Milestones

## Completed foundation
- Data extraction from Playerport (skills/clans/gods/areas/objects)
- Compatibility skill registry scaffold (server-side)
- Generated Playerport spell pack and wired into `spells.xml`
- Initial Playerport UI theme CSS

## Next concrete milestones

1. **Importer action (server admin command)** ✅
   - Command: `ppimportskills`
   - Loads `tools/playerport-import/player-skills-stendhal.json` by default
   - Resolves online player by name
   - Applies converted skill IDs + values
   - Reports import summary + misses

2. **Clan bridge**
   - Load `clans-stendhal.json`
   - Map to Stendhal group/guild structures
   - Keep legacy clan names as metadata tag

3. **Item template conversion**
   - Convert exported ROM objects to Stendhal item XML skeletons
   - Manual pass for type/slot stats

4. **Area migration prep**
   - Build room graph converter for `.are` -> zone skeleton JSON
   - Implement room-by-room import into staged test zone

5. **Playerport mode in web UI**
   - Add connect/send panel backed by gateway adapter
   - Add prompt parser for HP/Mana/Move + target health display
