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

## 3) Export area/object/mobile/reset coverage

```bash
node tools/playerport-import/extract-areas-and-objects.mjs /home/jacob/playerport/area
```

Outputs:
- `tools/playerport-import/playerport-areas-export.json`

## 4) Generate Playerport spell compatibility XML for Stendhal

```bash
node tools/playerport-import/generate-playerport-spells-xml.mjs
```

Outputs:
- `data/conf/spells/playerport.xml`

`data/conf/spells.xml` now includes this group file.
