# Playerport Backend Integration Plan (Stendhal UI)

## Goal
Use Stendhal's modern UI shell as a frontend for the Playerport MUD backend.

## Reality check
Stendhal and Playerport use different protocols and gameplay models:
- **Stendhal**: state-driven MMORPG protocol (entities/maps/events)
- **Playerport**: line-oriented telnet MUD stream

So the integration requires a **translation layer**.

## Proposed architecture

```text
Stendhal UI
   |
   | HTTP/SSE (or WebSocket)
   v
Playerport Gateway Adapter (new)
   |
   | TCP telnet
   v
Playerport (ROM/Merc server)
```

## Phase breakdown

### Phase A — Transport bridge (in progress)
- Add a gateway service (`tools/playerport-gateway.mjs`)
- Session management per player
- Stream Playerport output to browser (SSE)
- Send commands from browser to Playerport

### Phase B — UI adapter mode
- Add a "Playerport mode" in Stendhal web client
- Route input bar to gateway `send`
- Render output as scrollable console panel
- Keep Stendhal chrome/theme (chat, panels, HUD shell)

### Phase C — Semantic upgrades
- Parse Playerport text into structured events where possible:
  - room title/description
  - exits
  - combat state
  - hp/mana/move prompt values
- Feed these into Stendhal-style widgets/minimap panels

### Phase D — Gameplay parity layers
- Quest/status panes from parsed text and command macros
- inventory/equipment side panels
- command shortcuts (look, score, inventory, skills)

## Data mapping strategy
1. Start with **raw terminal stream** for correctness
2. Add **regex parser modules** for known prompt/combat patterns
3. Add optional server-side enrichments (JSON events) later

## Security
- Bind gateway to localhost by default
- Use session tokens if exposed remotely
- Enforce per-session command rate limits

## Current deliverables
- `tools/playerport-gateway.mjs`: sessionized Playerport transport adapter
- `src/js/stendhal/backend/playerport_client.js`: browser-side helper for adapter endpoints

## Next implementation steps
1. Wire a temporary page/panel in Stendhal UI to this adapter.
2. Add parser for Playerport prompt (`hp/mana/move`) and combat lines.
3. Map parsed state into Stendhal HUD widgets.
