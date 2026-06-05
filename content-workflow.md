# Content Generation — Captain Dadders LECL Expedition

## What This Is

The phase run **after a leg is flown**, where the leg page and feed entries are
produced. This is the chat where usage credits are tight, so the guiding rule is:

> **Keep the heavy files out of context until the last moment, and let the
> planning phase have already done all the geometry and bulk research.**

This doc covers *sequencing and staging* for the content chat. The canonical
rules it relies on — the verbatim journal rule, inline media syntax, historical
third-person voice, the ⚠️ FLAG format, RSS item shape, and the
`FLIGHT_LEGS` / `LEG_NOTES` / `EXP3_STATS` structures — live in
`lewis-clark-project-summary.md` and are unchanged. This doc does not repeat
them; it changes only *what comes in when* and *how the files get assembled*.

Prerequisite: the leg's airports were processed in the **planning** phase, so
`legs-data.js` already contains `AIRPORT_CUM_NM` + `AIRPORT_PLAN` for them, and
the per-day **research files** exist on the pilot's laptop. See
`planning-research-workflow.md`.

---

## The core change — staged attachments

Big files are re-read on every turn of a chat, so the cost is *how long they sit
in the chat*, not whether they're used. Therefore:

| Phase | Pilot attaches | Why |
|---|---|---|
| **Kickoff / drafting** | the day-files for this leg's dates, nothing heavy | needed to write the historical section |
| **Assembly only** | `legs-data.js` + `rss.xml` | needed to build the three output files — and only then |

`legs-data.js` and `rss.xml` must **not** be attached at kickoff. They enter the
chat only once the content is locked and Claude is ready to assemble.

**Claude drives this.** Don't expect the pilot to remember the staging — Claude
prompts for each input exactly when it's needed (day-files at kickoff,
`legs-data.js` + `rss.xml` at assembly).

---

## Sequence

### 1. Kickoff

The pilot provides a short note plus the journal — **no heavy files yet.**

```
LEG N: DEP → ARR
Date flown: Month D, YYYY
Duration: H:MM
[optional: "landed right by <place>" if the pilot noticed something]

JOURNAL:
[journal text + inline [PHOTO:]/[VIDEO:] markers, per the summary's syntax]
```

Claude then:
- **Light pre-flight check:** confirm `DEP` is where the pilot last landed (from
  the note — the authoritative check against `FLIGHT_LEGS` happens at assembly,
  when `legs-data.js` is present). A gap here is rare since the pilot just took
  off from there.
- **Names the day-files to attach.** From the leg's date range (see the deferred
  date call below), tell the pilot which per-day research files to attach, e.g.
  *"attach research-1804-07-06 through 07-12."*

### 2. Draft

- Assemble the journal **verbatim** (summary's CRITICAL journal rule).
- Write the historical section from the attached day-files (third-person voice,
  summary's rules). Pre-research is the **floor, not the ceiling** — see below.
- Flag uncertain claims **inline** with the ⚠️ FLAG format (summary's fact-check
  rule — unchanged; flagging still happens here, after the writing exists).

### 3. Resolve

- Pilot resolves all flags in one pass and approves the content.
- If there's a **deferred date call**, resolve it here (see below).
- Nothing heavy is in the chat yet — all of step 2–3 happens on small content.

### 4. Assembly (only after content is locked)

- Claude prompts the pilot to **attach `legs-data.js` + `rss.xml` now.**
- **Authoritative pre-flight check:** confirm `DEP` matches the last
  `FLIGHT_LEGS` entry. If not, stop and report.
- Claude builds the `build_leg.py` **payload** (see below) and runs the script.
- Output: `leg-NN.html`, updated `legs-data.js`, updated `rss.xml` — delivered as
  **downloads**, never pasted into the chat as text.

---

## The deferred date call (the "Kaw Point" decision)

The L&C end date is **not** "nearest campsite to the arrival" anymore. Planning
already stored both candidates in `AIRPORT_PLAN[arr]`:

- `campBehind` — the default boundary (narrative never runs ahead of the landing)
- `campAhead` — the next camp, with its date and gap
- `deferredDateCall` — true when `campAhead` is closer than `campBehind`

At content time:
- **`deferredDateCall` is false** → use `campBehind.date` as `lcDates`. No prompt.
- **`deferredDateCall` is true** → surface both to the pilot (e.g. *"You landed
  0.8 NM short of Kaw Point, June 26–28. Stop at June 25, or include Kaw Point?"*)
  and let the pilot choose, now that they've flown it. Set `lcDates` to the chosen
  boundary.

The narrative still must not run past the chosen end date (the Leg 17 overreach
rule in the summary still applies — just decided here instead of guessed).

---

## Research: floor, not ceiling

The per-day files cover the **bulk, predictable** history. They are the baseline,
not a limit. When the pilot — having flown the leg and looked around — asks the
historical section to cover a **specific theme** (e.g. the demise of the prairie,
the early history of Kansas City):

- If it **is** in the day-files → write from them, no fetching.
- If it's **new** → do a **targeted live fetch** for just that topic, here in the
  content chat. One or two focused lookups, not the whole leg's research again.

The window stays lean because the every-time research is already done; a couple
of thematic lookups on top won't blow it. Live-fetched claims still get the
⚠️ FLAG treatment.

---

## The build_leg.py payload

At assembly Claude generates a small JSON payload and runs `build_leg.py`
(`--payload` + `--template` + `--legs-data` + `--rss`). The script fills the
template, appends to `legs-data.js`, and prepends to `rss.xml`. The full payload
schema is documented at the top of `build_leg.py`; the values come from:

| Payload field | Source |
|---|---|
| distance (`distance_nm`) | `AIRPORT_CUM_NM[arr] − AIRPORT_CUM_NM[dep]` |
| `flight_leg.lat/lng` (pin) | `AIRPORT_COORDS[arr]` — the AirNav pin, stored at planning time so AirNav doesn't have to be re-fetched. Fallback: AirNav direct (`https://www.airnav.com/airport/[ARR]`) if `AIRPORT_COORDS[arr]` is missing. **Never** the snap. |
| `cumulative_nm`, `progress_pct` | prior `EXP3_STATS.distanceNM` + this leg; ÷ 4029 |
| `lc_dates` | the resolved boundary (deferred call above) |
| `completed_coords_append` | green-line extension (see next) |
| journal / historical bodies | the locked draft |
| `leg_notes.facts` / `.covered` | research used / what the leg covered |
| `rss_item` | summary's RSS shape |

**Green-line extension:** `build_leg.py` needs `completed_coords_append` (the
route vertices from the last arrival through this arrival's snap point). Generate
it at assembly by running `plan_airports.py` for the **arrival** airport with
`prev_arrival_cum_nm = AIRPORT_CUM_NM[dep]`; its `completed_coords_append` output
is exactly the list to pass through. (Deterministic, one quick run — fine at
assembly.)

---

## What did NOT change

- Verbatim journal rule, inline media syntax, photo/video ordering
- Historical section voice and the "don't write past the end date" rule
- ⚠️ FLAG fact-check format, resolved in one pass, here in the content chat
- RSS item shape and the prepend-don't-rebuild rule
- `FLIGHT_LEGS`, `LEG_NOTES`, `EXP3_STATS`, `AIRPORT_CUM_NM` definitions
- Publishing: save downloads to Drive → GH Desktop → push

All of the above are in `lewis-clark-project-summary.md`.
