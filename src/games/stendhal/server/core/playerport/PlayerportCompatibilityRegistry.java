package games.stendhal.server.core.playerport;

import java.io.FileReader;
import java.io.Reader;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Collection;
import java.util.Collections;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.Map;

import org.apache.log4j.Logger;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.JSONValue;

import games.stendhal.server.entity.player.Player;

/**
 * Loads and exposes Playerport compatibility skill mappings.
 *
 * Current scope:
 * - load generated compatibility skill stubs
 * - provide legacy->stendhal ID lookup
 * - apply imported skill values onto Stendhal player's keyed skills slot
 */
public class PlayerportCompatibilityRegistry {

	private static final Logger LOGGER = Logger.getLogger(PlayerportCompatibilityRegistry.class);
	private static final Path DEFAULT_SKILL_STUB = Paths.get("data", "conf", "playerport", "skills.stub.json");

	private final Map<String, PlayerportSkillDefinition> byLegacyName;

	private PlayerportCompatibilityRegistry(final Map<String, PlayerportSkillDefinition> skills) {
		this.byLegacyName = new LinkedHashMap<String, PlayerportSkillDefinition>(skills);
	}

	public static PlayerportCompatibilityRegistry loadDefault() {
		return loadFromSkillStub(DEFAULT_SKILL_STUB);
	}

	public static PlayerportCompatibilityRegistry loadFromSkillStub(final Path skillStubPath) {
		Map<String, PlayerportSkillDefinition> skills = new LinkedHashMap<String, PlayerportSkillDefinition>();
		try (Reader reader = new FileReader(skillStubPath.toFile())) {
			Object parsed = JSONValue.parse(reader);
			if (!(parsed instanceof JSONObject)) {
				LOGGER.warn("Invalid Playerport skill stub root: " + skillStubPath);
				return new PlayerportCompatibilityRegistry(skills);
			}

			JSONObject root = (JSONObject) parsed;
			Object skillsObj = root.get("skills");
			if (!(skillsObj instanceof JSONArray)) {
				LOGGER.warn("No skills array in Playerport skill stub: " + skillStubPath);
				return new PlayerportCompatibilityRegistry(skills);
			}

			JSONArray arr = (JSONArray) skillsObj;
			for (Object o : arr) {
				if (!(o instanceof JSONObject)) {
					continue;
				}
				JSONObject e = (JSONObject) o;
				String legacyName = asString(e.get("legacyName"));
				String stendhalId = asString(e.get("stendhalId"));
				int maxSeen = asInt(e.get("maxSeen"));
				String status = asString(e.get("status"));

				if (legacyName == null || legacyName.isEmpty() || stendhalId == null || stendhalId.isEmpty()) {
					continue;
				}

				skills.put(legacyName.toLowerCase(), new PlayerportSkillDefinition(legacyName, stendhalId, maxSeen, status));
			}
		} catch (Exception e) {
			LOGGER.error("Failed loading Playerport skill stub: " + skillStubPath, e);
		}

		LOGGER.info("Loaded Playerport compatibility skills: " + skills.size());
		return new PlayerportCompatibilityRegistry(skills);
	}

	public PlayerportSkillDefinition getByLegacyName(final String legacyName) {
		if (legacyName == null) {
			return null;
		}
		return byLegacyName.get(legacyName.toLowerCase());
	}

	public Collection<PlayerportSkillDefinition> getAllSkills() {
		return Collections.unmodifiableCollection(byLegacyName.values());
	}

	public Map<String, Integer> convertLegacySkillMap(final Map<String, Integer> legacySkillValues) {
		Map<String, Integer> converted = new HashMap<String, Integer>();
		for (Map.Entry<String, Integer> entry : legacySkillValues.entrySet()) {
			PlayerportSkillDefinition def = getByLegacyName(entry.getKey());
			if (def == null) {
				continue;
			}
			converted.put(def.getStendhalId(), entry.getValue());
		}
		return converted;
	}

	/**
	 * Apply already-converted compatibility skills to a player.
	 *
	 * @param player target player
	 * @param stendhalSkillValues map key = stendhal skill id, value = integer skill value
	 */
	public void applySkillsToPlayer(final Player player, final Map<String, Integer> stendhalSkillValues) {
		for (Map.Entry<String, Integer> e : stendhalSkillValues.entrySet()) {
			player.setSkill(e.getKey(), String.valueOf(e.getValue()));
		}
	}

	private static String asString(final Object value) {
		return value == null ? null : String.valueOf(value);
	}

	private static int asInt(final Object value) {
		if (value == null) {
			return 0;
		}
		if (value instanceof Number) {
			return ((Number) value).intValue();
		}
		try {
			return Integer.parseInt(String.valueOf(value));
		} catch (NumberFormatException e) {
			return 0;
		}
	}
}
