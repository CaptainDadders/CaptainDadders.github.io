# Flight Planner — Captain Dadders LECL Expedition

## What This Is

A flight planning tool for the Lewis & Clark (LECL) expedition in MSFS 2024. The pilot follows the actual L&C route (Ohio River → Mississippi → Missouri River → Columbia River) in a Zlin Norden at roughly 85 kt cruise.

Given two airport codes, calculate **route distance** and **estimated flight time**.

---

## Data Sources

| File | Use |
|---|---|
| `legs-data.js` | **Primary source.** Look up `AIRPORT_CUM_NM[dep]` and `AIRPORT_CUM_NM[arr]` and subtract. Simple, cheap, authoritative. |
| `route_outbound.json` | **Fallback, now rare.** Only when an airport isn't yet in `AIRPORT_CUM_NM`. Normally the **planning** phase (`plan_airports.py`) has already added every candidate, so this should seldom fire. If it does, snap to the polyline by haversine, compute cumulative NM, and add the entry before reporting. |

**Attaching `legs-data.js` — mind the staging:**
- In a **standalone** flight-planning chat (just deciding where to fly): attach `legs-data.js`; if it's missing, ask for it. Don't fall back to `route_outbound.json` just because it isn't there — the table is authoritative.
- If flight planning happens **in the same chat as content generation:** do **not** pull `legs-data.js` in early just for a distance check — that breaks the content workflow's staging (big files come in at assembly only). The cumulative NMs are already known from the planning phase; use those, or note that the distance lands automatically at assembly. See `content-workflow.md`.

Adding candidate airports is the **planning** phase's job, not this one — see `planning-research-workflow.md`.

**Distance calculation (when using the rare fallback):** snap departure and arrival airports to nearest point on the polyline by haversine, then sum haversine(seg[i], seg[i+1]) between those indices.

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

> **Note:** This same 10 NM check now runs in `plan_airports.py` during the planning phase, which is where airports normally get added — so it usually fires there, not here. This fallback flag remains as a safety net for the rare case of an airport reaching flight planning without having been planned.

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
