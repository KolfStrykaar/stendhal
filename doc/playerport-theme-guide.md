# Playerport Theme Guide (Stendhal UI)

A first style layer was added in:

- `src/js/css/playerport-theme.css`

## How to activate
Add `playerport-theme` class to the root element (`<html>` or `<body>` or UI root container).

## Scope
- Darker panel/background palette inspired by Playerport vibe
- Borders/controls tuned for terminal-fantasy feel
- Prompt utility classes (`.playerport-prompt`) for future HUD integration

## Next UI tasks
1. Add a settings toggle: default theme vs playerport theme.
2. Hook prompt stats from backend parser into `.playerport-prompt` widget.
3. Style chat/combat/event lines with semantic classes.
