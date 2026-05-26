# Flight Planner — Captain Dadders LECL Expedition

## What This Is

A flight planning tool for the Lewis & Clark (LECL) expedition in MSFS 2024. The pilot follows the actual L&C route (Ohio River → Mississippi → Missouri River → Columbia River) in a Zlin Norden at roughly 85 kt cruise.

Given two airport codes, calculate **route distance** and **estimated flight time**.

---

## Data Sources

| File | Use |
|---|---|
| `legs-data.js` | **Primary source.** Look up `AIRPORT_CUM_NM[dep]` and `AIRPORT_CUM_NM[arr]` and subtract. Simple, cheap, authoritative. |
| `route_outbound.json` | **Fallback only** — used when an airport is *not yet in* `AIRPORT_CUM_NM`. Snap to segment 0 by haversine, compute cumulative NM, and add the new entry to the table before reporting results. |

**If `legs-data.js` is not attached to the conversation, ask for it before doing any calculations.** Do not fall back to `route_outbound.json` just because the file isn't there — the table is the authoritative source and the file is a one-message attachment.

**Distance calculation (when using fallback):** snap departure and arrival airports to nearest point on segment 0 by haversine, then sum haversine(seg[i], seg[i+1]) between those indices.

---

## Speed Baseline

| Leg | NM | Duration | kt |
|---|---|---|---|
| 1 (31D→1G8) | 51 | 0:45 | 68 |
| 2 (1G8→75D) | 67 | 0:46 | 87 |
| 3 (75D→I41) | 152 | 1:44 | 88 |
| 4 (I41→KLUK) | 125 | 1:35 | 79 |
| **Working avg** | | | **~85 kt** |

Leg 1 is an outlier (short hop, slow climb ratio). Weight toward longer legs.
**Update this table as new legs are flown.**

---

## Pre-Flight Checks

Before reporting results, perform these two checks on both airports:

### 1. Identify Airport Names
Always look up the full name for each airport code. Include the names in the output so the pilot can confirm the correct airports are being used.

### 2. Snap Distance Flag 🚩
This check applies whenever an airport is being added to `AIRPORT_CUM_NM` via the haversine fallback. After snapping each airport to its nearest point on the route polyline, check the snap distance:
- **≤ 10 NM** — proceed normally.
- **> 10 NM** — **stop and flag with 🚩 before reporting results.** Display the airport name, the snap distance, and ask the pilot to confirm the code is correct. Do not silently proceed with a bad snap.

> **Why this matters:** An incorrect airport code (e.g. Georgetown Scott County instead of Hancock Co-Lewis, both with similar codes) can snap 35+ NM off the route and produce wildly wrong distances. The flag catches this before it wastes a planning session.

---

## Output Format

### Normal (both airports within 10 NM of route)

```
## ✈ [DEP] → [ARR]
[Departure full name] → [Arrival full name]

| Route distance | X NM |
| Estimated time | H:MM |
```

### Flagged (either airport > 10 NM from route)

```
🚩 **Snap distance warning**

- **[CODE]** ([Full Airport Name]) is **XX NM** from the L&C route — expected ≤ 10 NM.

Please confirm this is the correct airport code before I calculate the route.
```

Do not report a distance or time until the pilot confirms the code is correct.