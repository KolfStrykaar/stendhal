package games.stendhal.server.actions.admin;

import java.io.FileReader;
import java.io.Reader;
import java.util.Iterator;

import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.JSONValue;

import games.stendhal.server.actions.CommandCenter;
import games.stendhal.server.core.engine.SingletonRepository;
import games.stendhal.server.entity.player.Player;
import marauroa.common.game.RPAction;

/**
 * Admin command to import converted Playerport skills to online Stendhal players.
 *
 * Action name: "ppimportskills"
 *
 * Optional RPAction attrs:
 * - file: override JSON path (default tools/playerport-import/player-skills-stendhal.json)
 * - target: import only one player by name
 */
public class PlayerportImportSkillsAction extends AdministrationAction {

	private static final String ACTION_NAME = "ppimportskills";
	private static final String DEFAULT_FILE = "tools/playerport-import/player-skills-stendhal.json";

	public static void register() {
		CommandCenter.register(ACTION_NAME, new PlayerportImportSkillsAction(), 900);
	}

	@Override
	protected void perform(final Player admin, final RPAction action) {
		final String file = action.has("file") ? action.get("file") : DEFAULT_FILE;
		final String target = action.has("target") ? action.get("target") : null;

		int playersSeen = 0;
		int playersApplied = 0;
		int skillsApplied = 0;

		try (Reader reader = new FileReader(file)) {
			Object parsed = JSONValue.parse(reader);
			if (!(parsed instanceof JSONObject)) {
				admin.sendPrivateText("Playerport import failed: invalid JSON root in " + file);
				return;
			}

			JSONObject root = (JSONObject) parsed;
			Object playersObj = root.get("players");
			if (!(playersObj instanceof JSONArray)) {
				admin.sendPrivateText("Playerport import failed: no players[] in " + file);
				return;
			}

			JSONArray players = (JSONArray) playersObj;
			for (Object obj : players) {
				if (!(obj instanceof JSONObject)) {
					continue;
				}
				JSONObject p = (JSONObject) obj;
				String name = p.get("name") == null ? null : String.valueOf(p.get("name"));
				if (name == null || name.isEmpty()) {
					continue;
				}

				if (target != null && !target.equalsIgnoreCase(name)) {
					continue;
				}

				playersSeen += 1;
				Player online = SingletonRepository.getRuleProcessor().getPlayer(name);
				if (online == null) {
					continue;
				}

				Object skillsObj = p.get("skills");
				if (!(skillsObj instanceof JSONObject)) {
					continue;
				}

				JSONObject skills = (JSONObject) skillsObj;
				int appliedForPlayer = 0;
				for (Iterator<?> it = skills.keySet().iterator(); it.hasNext();) {
					Object keyObj = it.next();
					if (keyObj == null) {
						continue;
					}
					String skillKey = String.valueOf(keyObj);
					Object valueObj = skills.get(keyObj);
					if (valueObj == null) {
						continue;
					}

					int value;
					if (valueObj instanceof Number) {
						value = ((Number) valueObj).intValue();
					} else {
						try {
							value = Integer.parseInt(String.valueOf(valueObj));
						} catch (NumberFormatException e) {
							continue;
						}
					}

					online.setSkill(skillKey, String.valueOf(value));
					appliedForPlayer += 1;
				}

				if (appliedForPlayer > 0) {
					playersApplied += 1;
					skillsApplied += appliedForPlayer;
				}
			}

			admin.sendPrivateText("Playerport import complete. file=" + file
					+ " seen=" + playersSeen
					+ " online_applied=" + playersApplied
					+ " skills_applied=" + skillsApplied
					+ (target != null ? " target=" + target : ""));
		} catch (Exception e) {
			logger.error("Playerport skill import failed", e);
			admin.sendPrivateText("Playerport import failed: " + e.getMessage());
		}
	}
}
