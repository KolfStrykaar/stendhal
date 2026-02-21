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

## 8) Generate Playerport object item XML seed

```bash
node tools/playerport-import/generate-stendhal-items-from-playerport-objects.mjs
```

Outputs:
- `data/conf/items/playerport_objects.xml`

> Note: this is a migration seed file and is not automatically wired into `items.xml` yet.

## 9) Generate Playerport zone seed from area export

```bash
node tools/playerport-import/generate-playerport-zones-seed.mjs
```

Outputs:
- `data/conf/zones/playerport_seed.json`

## 10) Export mobiles from Playerport area files

```bash
node tools/playerport-import/extract-mobiles-from-areas.mjs /home/jacob/playerport/area
```

Outputs:
- `tools/playerport-import/playerport-mobiles-export.json`

## 11) Generate Stendhal creature XML seed from Playerport mobiles

```bash
node tools/playerport-import/generate-stendhal-creatures-from-playerport-mobiles.mjs
```

Outputs:
- `data/conf/creatures/playerport_mobiles.xml`

> Note: this is currently a seed file and not automatically wired into `creatures.xml` yet.

## 12) Export rooms from Playerport areas

```bash
node tools/playerport-import/extract-rooms-from-areas.mjs /home/jacob/playerport/area
```

Outputs:
- `tools/playerport-import/playerport-rooms-export.json`

## 13) Generate Playerport room atlas for zone migration planning

```bash
node tools/playerport-import/generate-playerport-map-atlas.mjs
```

Outputs:
- `data/conf/zones/playerport_room_atlas.json`

## 14) Run full Playerport import pipeline in one command

```bash
node tools/playerport-import/run-all-playerport-pipeline.mjs /home/jacob/playerport
```

This refreshes all generated migration artifacts in sequence.
