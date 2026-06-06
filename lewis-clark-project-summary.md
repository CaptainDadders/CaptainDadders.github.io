# Captain Dadders — Lewis & Clark Flight Expedition Project Summary
*Process and architecture reference — update only when something structural changes, not each leg.*

---

## HOW TO START A NEW LEG SESSION

### Staged attachments (see `content-workflow.md`)
Content generation uses **staged attachments** to keep usage low: the pilot
attaches only the day-files at kickoff, and `legs-data.js` + `rss.xml` come in at
the **assembly** step, not the start. Claude drives this — it prompts for each
input when it's needed. Full sequence and the two pre-flight checks (a light one
at kickoff, the authoritative `DEPARTURE` = last-`FLIGHT_LEGS`-arrival check at
assembly) are in `content-workflow.md`.

The expedition runs in three workflow phases, each with its own doc:
- **Planning & research** (`planning-research-workflow.md`) — airports → geometry
  + `AIRPORT_PLAN`; date range → per-day research files. Done up front.
- **Flight planning** (`flight-planner-workflow.md`) — distance/time for a pair.
- **Content generation** (`content-workflow.md`) — the leg page + feed, after flying.

### Static project knowledge (rarely changes)
- `lewis-clark-project-summary.md` — this file (architecture & canonical rules)
- `planning-research-workflow.md` — up-front planning + research phase
- `flight-planner-workflow.md` — distance/time for an airport pair
- `content-workflow.md` — the after-flying content phase (staging + assembly)
- `build_leg.py` — assembles the three per-leg files from a payload
- `plan_airports.py` — planning-pass geometry + campsite lookup; emits `AIRPORT_CUM_NM` / `AIRPORT_PLAN`
- `leg-template.html` — the canonical leg page (placeholders only — see below)
- `route_outbound.json` — 5-segment L&C route polyline Pittsburgh→Pacific
- `camps_slim.json` — 450 outbound campsites
- `pivotal_slim.json` — 62 pivotal places (read for narrative context if leg passes one)

### Never goes in project knowledge
- Generated leg HTML files
- `index.html` (permanently static, never edited)

---

## Kickoff prompt format

The user pastes this when starting a leg session:

```
LEG N: DEP → ARR
Date flown: Month D, YYYY
Duration: H:MM
Title: [optional — Claude proposes if omitted]
Hero subtitle: [optional — Claude generates from DEP/ARR names if omitted]

JOURNAL:

[paragraph 1 of journal text]

[PHOTO: filename.png | caption text | primary]

[paragraph 2 of journal text]

[VIDEO: https://youtu.be/youtubeUrl | caption text]

[paragraph 3 of journal text]

[PHOTO: filename2.png | caption text]
```

### 🚫 Journal wording rule — CRITICAL
**The journal paragraphs are the user's own words. Claude must not change, rephrase, expand, or embellish them without explicit approval.**

- Copy the journal text verbatim into `JOURNAL_BODY`.
- **Claude fact-checks the journal automatically** — every factual claim in the
  journal (and in the historical section) is checked, every leg, without being
  asked. Anything uncertain or wrong gets the ⚠️ FLAG treatment and a proposed
  correction, but the wording is **not** changed until the user approves.
- The **only** edits Claude may make to the journal without asking are **typos
  and spelling errors.** Everything else — facts, phrasing, structure, tone —
  stays exactly as written unless the user explicitly approves a change.
- This rule applies even when Claude believes a rewrite would be more accurate, more vivid, or better style. It is not Claude's journal.
- **Voice note:** the journal is the pilot's own first-person words and stays
  that way. *Claude-written* prose (the historical section, any connective text)
  is third person and never addresses the pilot/reader as "you," and never
  spoils events past the leg's end date. See the two ⚠️ rules under **Historical
  section rules**.

### Inline media syntax
- **Photo:** `[PHOTO: filename.png | caption | primary]`
  - `primary` flag (optional) marks the thumbnail/RSS image. Default = first photo.
  - `filename.png` is the filename only — Claude prefixes `Expedition3/Legs/`.
- **Video:** `[VIDEO: youtubeUrl | caption]`
  - The pilot pastes the **shareable YouTube URL** (e.g. `https://youtu.be/abc123XYZ_0` or a `watch?v=` / `embed/` link). Claude extracts the 11-char ID from it — the pilot does not paste the bare ID.

Photos and videos render in the exact order they appear inline. Never reorder.

### What Claude calculates / fills automatically
- L&C dates: the boundary stored in `AIRPORT_PLAN[arr]`, resolved per the
  deferred-date-call rule in `content-workflow.md` (not a live campsite scan).
- Leg distance: `AIRPORT_CUM_NM[arr] - AIRPORT_CUM_NM[dep]` from legs-data.js
- Cumulative NM: previous `EXP3_STATS.distanceNM` + this leg's nm
- Progress %: `cumulative / EXP3_STATS.totalNM × 100`, rounded
- COMPLETED_COORDS: extend through the arrival's stored snap point
  (`AIRPORT_PLAN[arr].snap` / `plan_airports.py`); assembled by `build_leg.py`.
- **Airport pin coordinates (FLIGHT_LEGS `lat`/`lng`)** come from `AIRPORT_COORDS[arr]` in `legs-data.js` — populated during planning from AirNav. If `AIRPORT_COORDS[arr]` is missing (legacy gap), look up AirNav directly (`https://www.airnav.com/airport/[CODE]`) — the only authoritative source for a fresh lookup. Never substitute SkyVector, Great Circle Mapper, AOPA, FlightAware, Wikipedia, or a search snippet; they differ from FAA-of-record enough to misplace a pin. If AirNav can't be fetched, **stop and ask the pilot to paste the AirNav DMS** — do not fall back to another source.
- Title (if user omits) — proposed for confirmation

---

## Per-leg deliverables

Three files per leg, **assembled by `build_leg.py` from a payload** at the
assembly step and delivered as downloads — not hand-written into the chat. The
structure notes below describe what each file must contain:

1. **`leg-NN.html`** — fill `leg-template.html` placeholders. Never regenerate the CSS or structure; only the placeholders change.
2. **`legs-data.js`** — append new `FLIGHT_LEGS` entry, extend `COMPLETED_COORDS`, update `EXP3_STATS`, append to `LEG_NOTES` (`facts` from research, `covered` from the journal that was just written).
3. **`rss.xml`** — read existing rss.xml from the attachment, **prepend** the new entry, carry all previous entries forward verbatim. Never rebuild from scratch (confuses follow.it).

---

## Fact-check rule (automatic, in-draft flagging)

Claude **fact-checks every leg automatically** — it does not wait to be asked.
Every factual claim in the journal and the historical section is checked, and
anything Claude is not fully confident in is flagged **inline in the initial
draft** with a marker:

> ⚠️ FLAG: "specific claim" — uncertainty: [what's ambiguous]. Confirm / correct / drop.

User resolves all flags in one pass. No separate "now fact-check this" round-trip. Anything already verified in `LEG_NOTES[slug].facts` does not get re-flagged — only new claims for the new leg.

---

## Leg-data structures (canonical)

### FLIGHT_LEGS entry
```javascript
{
  lat: 39.1133,
  lng: -94.5910,
  label: "Leg N: [Title]",
  location: "DEP \u2192 ARR \u00b7 City A to City B",
  date: "Month D, YYYY",
  thumb: "Expedition3/Legs/LegNN-PrimaryPhoto.png",
  post: "Expedition3/Legs/leg-NN.html",
  slug: "leg-NN",
  lcDates: "Mon D\u2013Mon D, 1804",
  nm: 00,
  duration: "H:MM"
}
```
The `→` and `·` separators in `location`, and the `–` en-dash in `lcDates`, are
stored as escaped unicode (`\u2192`, `\u00b7`, `\u2013`) to match existing entries.

**⚠️ Marker vs snap — they are different points. This mistake has recurred; treat it as a hard checklist item, not a guideline.** `FLIGHT_LEGS` `lat`/`lng` is the
**map pin** and must be the airport's **actual AirNav coordinates** (so the pin sits on
the runway). The route *snap point* (`AIRPORT_PLAN[arr].snap`, where the airport
projects onto the river polyline) is a **different** point, used only for route
geometry — `COMPLETED_COORDS` and `AIRPORT_PLAN`. For an off-route airport these
can be over 1 NM apart.

**At assembly, before running `build_leg.py`, verify the payload `flight_leg.lat/lng`:**
- It must equal `AIRPORT_COORDS[arr]` (or, if that's missing, a fresh AirNav lookup — the same values as planning resolved).
- It must **NOT** equal `AIRPORT_PLAN[arr].snap`. If the two are equal (or you copied the snap from the planner output by reflex), it is wrong — replace with the AirNav airport coords.
- `completed_coords_append` ends at the snap; the pin does not. Two different fields, two different points.

**This has now gone wrong twice — Leg 21 and Leg 22** — both times by putting the snap point in the marker so the pin landed off the runway. The planner output puts the snap right in front of you at assembly, which is the trap. Pull the pin coords from `AIRPORT_COORDS[arr]` in legs-data.js, never from the snap.

### LEG_NOTES entry
```javascript
"leg-NN": {
  facts:   "Verified historical research used in the historical section.",
  covered: "1–2 sentences on what the journal+photos+historical narrative actually said."
}
```

### EXP3_STATS
- `legsFlown`, `distanceNM`, `totalNM` (canonical = 4029), `progressPct`, `statusBadge`, `updatedDate`
- `updatedDate` must be a real timestamp from the system clock — `"Month D, YYYY H:MM AM/PM MT"`. Never noon, never a placeholder.

### AIRPORT_CUM_NM
Cumulative NM from Pittsburgh per airport, snapped to the route polyline. New leg distance = `AIRPORT_CUM_NM[arr] - AIRPORT_CUM_NM[dep]`. Stays a plain `code → number` map (the live site reads it as a number — do not change its shape).

To add candidate airports, the pilot says something like *"add these to the
potential landing sites"* with a batch of codes. This happens in the **planning**
phase: `plan_airports.py` snaps each one (flagging >10 NM off-route), and emits
both the new `AIRPORT_CUM_NM` lines and the matching `AIRPORT_PLAN` entries to
paste in. See `planning-research-workflow.md`.

### AIRPORT_PLAN
Parallel block (separate from `AIRPORT_CUM_NM`) holding planning-pass data for
airports **ahead**: `snap`, `snapIndex`, `offRouteNM`, `campBehind`, `campAhead`,
`deferredDateCall`. Written by `plan_airports.py`; read at content time so the
content chat never recomputes geometry or scans the campsite list. Past airports
don't need entries. Full shape in `planning-research-workflow.md`.

**Reference total:** 4,029 NM (full polyline length). The earlier "~4,900 NM" figure was an estimate of the true L&C river distance; the polyline is RDP-simplified, so it's slightly shorter. Progress % is computed against 4,029 going forward.

---

## Leg page structure (handled by template)

The template (`leg-template.html`) handles all CSS, fonts, color variables, dark-section wrappers, leg-nav JS, and responsive breakpoints. **Do not regenerate any of that.** Fill placeholders only:

| Placeholder | What goes there |
|---|---|
| `{{LEG_NUM}}` / `{{LEG_NUM_PADDED}}` | bare number / zero-padded |
| `{{LEG_TITLE}}` | the leg's title |
| `{{DATE_FLOWN}}` | e.g. `May 7, 2026` |
| `{{LC_DATES}}` | e.g. `Oct 30 – Nov 2, 1803` |
| `{{DEP_NAME}}` / `{{DEP_CODE}}` / `{{DEP_CODE_CITY}}` | departure parts |
| `{{ARR_NAME}}` / `{{ARR_CODE}}` / `{{ARR_CODE_CITY}}` | arrival parts |
| `{{DISTANCE_NM}}` / `{{DURATION}}` | leg distance / time |
| `{{CUMULATIVE_NM}}` / `{{TOTAL_NM}}` / `{{PROGRESS_PCT}}` | progress bar values |
| `{{JOURNAL_BODY}}` | assembled paragraphs/photos/videos in order |
| `{{HISTORICAL_TITLE}}` / `{{HISTORICAL_BODY}}` | historical section h2 + body (paragraph strings and/or `{"type":"photo"}` items — see Historical section images) |
| `{{PREV_NUM}}` / `{{PREV_PAD}}` / `{{NEXT_NUM}}` / `{{NEXT_PAD}}` | leg-nav numbers |

Snippet patterns for journal body (paragraph, photo, video) are documented at the top of the template file.

### Historical section rules
- **⚠️ Third person only — never second person, anywhere in the published page.**
  Never "you"/"your" — and this means never addressing the *pilot/reader* either.
  The blog is written for an audience to read; the pilot is not the "you" of the
  text. Use "this leg," "the Corps," "the captains," or name the pilot's craft
  ("the Norden," "from the cockpit") rather than "you." This applies to the
  historical section *and* to any Claude-written connective prose — the journal
  paragraphs themselves are the pilot's verbatim words and are never altered (see
  the journal wording rule). **Leg 26 drafted "struck you from the cockpit" in
  the historical section — a second-person violation; rephrased before assembly.**
- **⚠️ NO FUTURE SPOILERS — foreshadow only, never narrate ahead.** The blog
  tracks the expedition in real time (the pilot is reading *Undaunted Courage* in
  sync), so the historical section must not reveal what happens after the leg's
  end date. Foreshadowing is allowed and encouraged — naming a tension, a
  warning, an open thread ("a caution from a man who knew the river ahead far
  better than the captains did"). Narrating the *outcome* is forbidden ("three
  weeks later the Teton encounter would be the most dangerous of the trip"; "they
  wouldn't meet a grizzly until October 20"; "Shannon rejoined on September 11").
  If a thread opens before the end date, leave it open. This is stricter than,
  but points the same way as, the DATE BOUNDARY rule below — when in doubt, say
  less about the future. **Leg 26 first draft narrated the Shannon reunion, the
  Teton outcome, and the October grizzly as "context"; all three were cut.**
- Banner format: `What Lewis & Clark were doing at this same point — [LC_DATES]` (handled by template).
- Draw on `LEG_NOTES[slug].facts` for verified material.
- **⚠️ DATE BOUNDARY:** the L&C end date is the boundary stored in
  `AIRPORT_PLAN[arr]`, resolved per the deferred-date-call rule in
  `content-workflow.md`:
  1. Default = `campBehind.date` (the camp at or behind the landing point).
  2. If `deferredDateCall` is true (a notable camp sits *just ahead*), surface
     both candidates and let the pilot choose after flying. Set `lcDates` to the
     chosen boundary.
  3. Write nothing in the historical section that happened after the chosen end
     date — even if nearby, interesting, or a better narrative arc.
  - **Leg 17 was wrong on this** — `lcDates` set to June 18 with June 16–18
    events included; correct cutoff was June 15. The stored `AIRPORT_PLAN`
    candidates + deferred call exist to prevent repeating it.

### Historical research sources
Routine "what happened on these dates" research is now done **up front** and
attached as per-day files — see `planning-research-workflow.md` for the sources
and method. At content time Claude writes from those day-files. Pre-research is
the **floor, not the ceiling**: if the pilot asks the historical section to cover
a specific theme that wasn't pre-researched, Claude does a **targeted live fetch**
for just that topic in the content chat. Live-fetched claims still get the
⚠️ FLAG treatment.

### Historical section images
A period image can strengthen the historical section, but **only when it genuinely fits and adds to the narrative** — not every leg needs one. Candidate images are scouted during planning (noted in the day-files); Claude proposes the image + source at content time. Two approved sources:

1. **Public domain images** — Library of Congress, Wikimedia Commons, NPS, public-domain paintings/engravings (e.g. Karl Bodmer, George Catlin), period maps and lithographs. Confirm the work is genuinely public domain (pre-1929 / artist died long enough ago). Caption with the work's title, artist/date, and holding institution.

2. **Michael Haynes paintings** — the pilot has the artist's **permission** to use his Lewis & Clark artwork on the site. Many of his paintings depict specific dated expedition moments. Some appear on the lewis-clark.org day-by-day pages, but **not all of them are there — always also check his gallery directly:** `https://www.mhaynesart.com/lewisandclark`.
   - **Attribution is required.** Per the artist: *"Please do credit me; Michael Haynes — www.mhaynesart.com."* Any caption using a Haynes image must credit `Michael Haynes — www.mhaynesart.com`.

As with prior legs, historical-section images are embedded as **local assets** (`Expedition3/Legs/LegNN-Name.jpg`) that the pilot saves and uploads; Claude proposes the image + source and references the local path in the HTML.

**⚠️ Image markup rule — every image on the page, no exceptions.** An image is passed to `build_leg.py` as a structured payload item, NEVER as a bare `<img>` or as raw HTML inside a paragraph:
- Journal photo → a `{"type":"photo", "file":..., "caption":..., "alt":...}` item in `journal`.
- Historical-section image → the **same** `{"type":"photo", ...}` item placed in `historical_body` (which now accepts structured items as well as plain paragraph strings). The build emits the standard `.leg-photo` wrapper as a sibling of the paragraphs.
- The `.leg-photo img { width:100% }` rule is the **only** thing constraining image width to the column. A bare `<img>` has no width limit, renders at native pixel size, overflows the viewport, and breaks the whole page layout — title shoved off-center, hero map overflowing. **Leg 21 was wrong on this:** the Catlin image was first embedded as a bare `<img>` in the historical body and broke the page on the live site. Fixed by teaching `build_historical_body` to accept `photo` items so a `<div class="leg-photo">` is never wrapped in a `<p>` (invalid) and never unconstrained.

### Prologue exception
`leg-00-prologue.html` does NOT use the template — it has its own structure (`display:inline-flex` flight strip, no progress bar, no leg-nav). Don't try to retro-fit the template to it.

---

## RSS

- Feed: `https://captaindadders.com/rss.xml`
- Verification meta tag in index.html (do not remove): `<meta name="follow.it-verification-code" content="X1Zq9u16SatSeTrMbZ7g"/>`
- Publisher page: `https://follow.it/captain-dadders-flight-expeditions`

### RSS item template (prepend, do not rebuild)
```xml
<item>
  <title>Leg N: [Title] — [DEP] to [ARR]</title>
  <link>https://captaindadders.com/#leg-0N</link>
  <description>[1-2 sentence summary]</description>
  <pubDate>[Day], [DD Mon YYYY] 12:00:00 +0000</pubDate>
  <guid>https://captaindadders.com/#leg-0N</guid>
  <enclosure url="https://captaindadders.com/Expedition3/Legs/[primary-photo].png" type="image/png" length="0"/>
  <media:content url="https://captaindadders.com/Expedition3/Legs/[primary-photo].png" medium="image"/>
</item>
```
`pubDate` = date flown at noon UTC, RFC 822 format. Verify day-of-week matches the date.

---

## Hosting & publishing

- **GitHub Pages** at `https://captaindadders.com` (custom domain via Namecheap)
- Repo: `CaptainDadders/captaindadders.github.io`
- Email: captaindadders@gmail.com
- Workflow: Claude generates files → user saves to Google Drive → GH Desktop syncs → push → live in ~60s

### Site structure
```
captaindadders.github.io/
├── index.html              ← main SPA (permanently static)
├── 404.html                ← custom 404 (Meigs Field image)
├── og-image.png
├── rss.xml
├── legs-data.js
├── CNAME
└── Expedition3/
    ├── images/Norden.png   ← aircraft photo (3840x2160)
    └── Legs/
        ├── leg-template.html      ← canonical template
        ├── leg-00-prologue.html
        ├── leg-01.html, leg-02.html … (one per leg)
        └── [photo PNGs]
```

---

## The Concept
MSFS 2024 expedition following Lewis & Clark route Pittsburgh → Fort Clatsop OR. Anonymous blog under pseudonym **Captain Dadders**. Reading **Undaunted Courage** by Stephen Ambrose in sync with flying — no spoilers beyond what has been read.

## Aircraft
**Zlin Norden** — blue/black livery, N2370. Rotax 915iS, ~100kt cruise, electric retractable slats. Landing technique: full flaps (2 notches/40°) + slats on short final, wheeler landing, neutral stick after touchdown.
- Photo: `Expedition3/images/Norden.png` (3840x2160)

## The Route
Pittsburgh → Ohio River → Mississippi → Camp Dubois/St. Louis → Missouri River → Great Falls MT → Lemhi Pass → Lolo Trail → Columbia River → Fort Clatsop OR. **Lewis departed Pittsburgh: August 31, 1803.**

The route polyline lives in `route_outbound.json` as 5 sequential segments:
- Seg 0: Pittsburgh → St. Louis (Ohio + upper Mississippi)
- Seg 1: St. Louis → North Dakota (Missouri)
- Seg 2: North Dakota → Great Falls MT
- Seg 3: Great Falls → Lemhi Pass
- Seg 4: Lemhi → Pacific (Lolo + Columbia)

For airport snapping, concatenate all 5 segments into one continuous polyline.

---

## Historical Resources
- **Undaunted Courage** by Stephen Ambrose — reading in sync with flying
- Research sources (primary journals, day-by-day log) and image sources (public
  domain, Michael Haynes gallery) are documented in
  `planning-research-workflow.md`, where the up-front research happens.
- Image rule of thumb: only include a historical image when it fits well and adds to the narrative — never force one.

---

## Pending Items

### External
- [ ] Hear back from Robert Griffing re: keelboat image for Prologue

### Site Polish
- [ ] Fix campsite color conflict — ⛺ renders green on desktop (conflicts with green completed route) and orange on mobile (conflicts with amber dashed remaining route)
- [ ] Fix "directly below your flight path" → "directly below the flight path for this leg" in leg-01.html historical section
- [ ] Backfill `LEG_NOTES[*].covered` for legs 1–7 (currently empty; fill if/when bored — not blocking)
- [ ] Optional: backfill `FLIGHT_LEGS[*].nm` historical values into the per-leg HTML pages for legs 1–7 (current legs-data.js values are correct; published HTML pages still show old values)
- [ ] **Leg 17 historical overreach (known issue, already published):** `lcDates` was corrected to June 4–15 but the narrative still references June 16–18 events (Rope Walk Camp, new towline, new oars). Published as-is, will not be rewritten. Root cause: Claude set the wrong end date and then researched and wrote past it.
- [ ] Historical map overlay toggle (1803 vs modern) — David Rumsey — backlog
- [ ] Aircraft easter egg for Exp I (Bonanza) and Exp II (PC-12) — needs screenshots — backlog

---

## Previous Expeditions
- Archive blog: https://719simpilot.wordpress.com
- All 68 Exp I legs + 81 Exp II flights listed on site with correct URLs
