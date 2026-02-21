# Playerport Import Tools

## 1) Extract snapshot from Playerport

```bash
node tools/playerport-import/extract-playerport-data.mjs /home/jacob/playerport
```

Outputs:
- `tools/playerport-import/playerport-snapshot.json`

## 2) Generate migration stubs for Stendhal mapping

```bash
node tools/playerport-import/generate-stendhal-migration-stubs.mjs
```

Outputs:
- `tools/playerport-import/stubs/skills.stub.json`
- `tools/playerport-import/stubs/clans.stub.json`
- `tools/playerport-import/stubs/gods.stub.json`

These are starter artifacts for implementing real importers in server code.
