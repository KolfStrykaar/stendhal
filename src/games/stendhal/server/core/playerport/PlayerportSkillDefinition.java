package games.stendhal.server.core.playerport;

public class PlayerportSkillDefinition {

	private final String legacyName;
	private final String stendhalId;
	private final int maxSeen;
	private final String status;

	public PlayerportSkillDefinition(final String legacyName, final String stendhalId, final int maxSeen, final String status) {
		this.legacyName = legacyName;
		this.stendhalId = stendhalId;
		this.maxSeen = maxSeen;
		this.status = status;
	}

	public String getLegacyName() {
		return legacyName;
	}

	public String getStendhalId() {
		return stendhalId;
	}

	public int getMaxSeen() {
		return maxSeen;
	}

	public String getStatus() {
		return status;
	}
}
