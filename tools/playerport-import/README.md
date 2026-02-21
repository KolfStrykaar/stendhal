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

## 5) Export object templates from area files

```bash
node tools/playerport-import/extract-objects-from-areas.mjs /home/jacob/playerport/area
```

Outputs:
- `tools/playerport-import/playerport-objects-export.json`

## 6) Convert exported player skills to Stendhal IDs

```bash
node tools/playerport-import/convert-player-skills-for-stendhal.mjs
```

Outputs:
- `tools/playerport-import/player-skills-stendhal.json`

## 7) Convert clan stubs to Stendhal guild import seed

```bash
node tools/playerport-import/convert-clans-for-stendhal.mjs
```

Outputs:
- `tools/playerport-import/clans-stendhal.json`
