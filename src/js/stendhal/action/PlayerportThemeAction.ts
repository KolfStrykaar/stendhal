import { stendhal } from "../stendhal";
import { SlashAction } from "./SlashAction";
import { Chat } from "../util/Chat";

const THEME_CLASS = "playerport-theme";
const CONFIG_KEY = "playerport.theme";

export class PlayerportThemeAction extends SlashAction {
	readonly minParams = 0;
	readonly maxParams = 1;
	override readonly desc = "Toggle Playerport-inspired visual theme.";

	static applyFromConfig(): void {
		const enabled = stendhal.config.getBoolean(CONFIG_KEY);
		PlayerportThemeAction.apply(enabled);
	}

	private static apply(enabled: boolean): void {
		if (!document?.documentElement) return;
		document.documentElement.classList.toggle(THEME_CLASS, enabled);
		document.body?.classList.toggle(THEME_CLASS, enabled);
	}

	execute(_type: string, params: string[], _remainder: string): boolean {
		let enabled = stendhal.config.getBoolean(CONFIG_KEY);
		if (params.length > 0) {
			const p = params[0].toLowerCase();
			if (p === "on" || p === "enable" || p === "1" || p === "true") enabled = true;
			else if (p === "off" || p === "disable" || p === "0" || p === "false") enabled = false;
			else enabled = !enabled;
		} else {
			enabled = !enabled;
		}

		stendhal.config.set(CONFIG_KEY, enabled ? "true" : "false");
		PlayerportThemeAction.apply(enabled);
		Chat.log("client", "Playerport visual theme " + (enabled ? "enabled" : "disabled") + ".");
		return true;
	}
}
