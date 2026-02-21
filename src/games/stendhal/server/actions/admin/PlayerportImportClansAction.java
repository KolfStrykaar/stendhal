package games.stendhal.server.actions.admin;

import java.io.FileReader;
import java.io.Reader;

import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.JSONValue;

import games.stendhal.server.actions.CommandCenter;
import games.stendhal.server.core.engine.SingletonRepository;
import games.stendhal.server.entity.player.Player;
import marauroa.common.game.RPAction;

/**
 * Admin command to import converted Playerport clans into online players' guild field.
 *
 * Action name: "ppimportclans"
 *
 * Optional RPAction attrs:
 * - file: override JSON path (default tools/playerport-import/clans-stendhal.json)
 * - clan: import only one legacy clan
 */
public class PlayerportImportClansAction extends AdministrationAction {

	private static final String ACTION_NAME = "ppimportclans";
	private static final String DEFAULT_FILE = "tools/playerport-import/clans-stendhal.json";

	public static void register() {
		CommandCenter.register(ACTION_NAME, new PlayerportImportClansAction(), 900);
	}

	@Override
	protected void perform(final Player admin, final RPAction action) {
		final String file = action.has("file") ? action.get("file") : DEFAULT_FILE;
		final String onlyClan = action.has("clan") ? action.get("clan") : null;

		int clansSeen = 0;
		int membershipsSeen = 0;
		int membershipsApplied = 0;

		try (Reader reader = new FileReader(file)) {
			Object parsed = JSONValue.parse(reader);
			if (!(parsed instanceof JSONObject)) {
				admin.sendPrivateText("Playerport clan import failed: invalid JSON root in " + file);
				return;
			}

			JSONObject root = (JSONObject) parsed;
			Object clansObj = root.get("clans");
			if (!(clansObj instanceof JSONArray)) {
				admin.sendPrivateText("Playerport clan import failed: no clans[] in " + file);
				return;
			}

			JSONArray clans = (JSONArray) clansObj;
			for (Object obj : clans) {
				if (!(obj instanceof JSONObject)) {
					continue;
				}
				JSONObject c = (JSONObject) obj;
				String legacyClan = c.get("legacyClan") == null ? null : String.valueOf(c.get("legacyClan"));
				if (legacyClan == null || legacyClan.isEmpty()) {
					continue;
				}

				if (onlyClan != null && !onlyClan.equalsIgnoreCase(legacyClan)) {
					continue;
				}

				String guildId = c.get("stendhalGuildId") == null ? null : String.valueOf(c.get("stendhalGuildId"));
				if (guildId == null || guildId.isEmpty()) {
					guildId = "pp_clan_" + legacyClan.toLowerCase();
				}

				clansSeen += 1;
				Object membersObj = c.get("members");
				if (!(membersObj instanceof JSONArray)) {
					continue;
				}
				JSONArray members = (JSONArray) membersObj;
				for (Object mObj : members) {
					if (mObj == null) {
						continue;
					}
					String memberName = String.valueOf(mObj).trim();
					if (memberName.isEmpty()) {
						continue;
					}
					membershipsSeen += 1;
					Player online = SingletonRepository.getRuleProcessor().getPlayer(memberName);
					if (online == null) {
						continue;
					}

					online.put("guild", guildId);
					online.setKeyedSlot("!features", "playerport_legacy_clan", legacyClan);
					membershipsApplied += 1;
				}
			}

			admin.sendPrivateText("Playerport clan import complete. file=" + file
					+ " clans_seen=" + clansSeen
					+ " memberships_seen=" + membershipsSeen
					+ " online_applied=" + membershipsApplied
					+ (onlyClan != null ? " clan=" + onlyClan : ""));
		} catch (Exception e) {
			logger.error("Playerport clan import failed", e);
			admin.sendPrivateText("Playerport clan import failed: " + e.getMessage());
		}
	}
}
