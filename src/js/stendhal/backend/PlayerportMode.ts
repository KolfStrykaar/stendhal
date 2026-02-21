export class PlayerportMode {
	private static instance: PlayerportMode;
	private panel?: HTMLDivElement;
	private logEl?: HTMLPreElement;
	private promptEl?: HTMLDivElement;
	private sessionId: string | null = null;
	private es: EventSource | null = null;
	private gatewayBase = "http://127.0.0.1:8787";

	static get(): PlayerportMode {
		if (!PlayerportMode.instance) {
			PlayerportMode.instance = new PlayerportMode();
		}
		return PlayerportMode.instance;
	}

	toggle(): void {
		if (this.panel) {
			this.destroyPanel();
			return;
		}
		this.createPanel();
	}

	private createPanel(): void {
		const panel = document.createElement("div");
		panel.className = "playerport-prompt";
		panel.style.position = "fixed";
		panel.style.right = "12px";
		panel.style.bottom = "12px";
		panel.style.width = "420px";
		panel.style.height = "300px";
		panel.style.zIndex = "99999";
		panel.style.display = "flex";
		panel.style.flexDirection = "column";
		panel.style.gap = "6px";

		const top = document.createElement("div");
		const host = document.createElement("input");
		host.value = "127.0.0.1";
		host.style.width = "110px";
		const port = document.createElement("input");
		port.value = "6100";
		port.style.width = "70px";
		const connectBtn = document.createElement("button");
		connectBtn.textContent = "Connect";
		const closeBtn = document.createElement("button");
		closeBtn.textContent = "Close";
		this.promptEl = document.createElement("div");
		this.promptEl.textContent = "HP: - | Mana: - | Move: - | Enemy: -";

		top.append("Host:", host, " Port:", port, connectBtn, closeBtn);
		top.style.display = "flex";
		top.style.gap = "6px";
		top.style.alignItems = "center";

		const log = document.createElement("pre");
		log.style.flex = "1";
		log.style.margin = "0";
		log.style.padding = "6px";
		log.style.overflow = "auto";
		log.style.background = "#060a0f";
		log.style.border = "1px solid #2a3948";
		this.logEl = log;

		const bottom = document.createElement("div");
		const input = document.createElement("input");
		input.placeholder = "Type command and press Enter";
		input.style.flex = "1";
		const sendBtn = document.createElement("button");
		sendBtn.textContent = "Send";
		bottom.style.display = "flex";
		bottom.style.gap = "6px";
		bottom.append(input, sendBtn);

		connectBtn.onclick = async () => {
			await this.connect(host.value, Number.parseInt(port.value, 10) || 6100);
		};
		closeBtn.onclick = () => this.destroyPanel();
		sendBtn.onclick = async () => {
			await this.send(input.value);
			input.value = "";
		};
		input.addEventListener("keydown", async (ev) => {
			if (ev.key === "Enter") {
				await this.send(input.value);
				input.value = "";
			}
		});

		panel.append(top, this.promptEl, log, bottom);
		document.body.appendChild(panel);
		this.panel = panel;
	}

	private destroyPanel(): void {
		if (this.es) {
			this.es.close();
			this.es = null;
		}
		this.sessionId = null;
		this.panel?.remove();
		this.panel = undefined;
		this.logEl = undefined;
		this.promptEl = undefined;
	}

	private appendLog(text: string): void {
		if (!this.logEl) return;
		this.logEl.textContent += text;
		this.logEl.scrollTop = this.logEl.scrollHeight;
		this.parseHud(text);
	}

	private parseHud(chunk: string): void {
		if (!this.promptEl) return;
		const loc = chunk.match(/locprothp\/mana\/move(\d+)locprothp\/mana\/move(\d+)locprothp\/mana\/move(\d+)/i);
		const enemy = chunk.match(/Enemy:\s*\{?[gYr]?([0-9]{1,3})\{?x?%/i);

		const hp = loc ? loc[1] : "-";
		const mana = loc ? loc[2] : "-";
		const move = loc ? loc[3] : "-";
		const enemyPct = enemy ? enemy[1] : "-";
		this.promptEl.innerHTML = `HP: <span class="hp">${hp}%</span> | Mana: <span class="mana">${mana}%</span> | Move: <span class="move">${move}%</span> | Enemy: <span class="enemy">${enemyPct}%</span>`;
	}

	private async connect(host: string, port: number): Promise<void> {
		const res = await fetch(`${this.gatewayBase}/session`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ host, port })
		});
		if (!res.ok) {
			this.appendLog(`\n[connect failed ${res.status}]\n`);
			return;
		}
		const payload = await res.json();
		this.sessionId = payload.id;
		this.appendLog(`\n[connected session=${this.sessionId}]\n`);
		this.es = new EventSource(`${this.gatewayBase}/session/${this.sessionId}/stream`);
		this.es.addEventListener("data", (ev: MessageEvent) => {
			try {
				const p = JSON.parse(ev.data);
				this.appendLog(p.text || "");
			} catch {
				// ignore parse issues
			}
		});
	}

	private async send(command: string): Promise<void> {
		if (!this.sessionId || !command.trim()) return;
		await fetch(`${this.gatewayBase}/session/${this.sessionId}/send`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ command })
		});
	}
}
