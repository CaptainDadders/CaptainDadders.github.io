# Captain Dadders — Lewis & Clark Flight Expedition Project Summary
*Process and architecture reference — update only when something structural changes, not each leg.*

---

## HOW TO START A NEW LEG SESSION

### What the user attaches to the kickoff message
- `legs-data.js` (most recent, from Drive / live site)
- `rss.xml` (most recent, from Drive / live site)

These are **per-message attachments**, not project knowledge uploads. No "delete first" dance — attachments are scoped to one conversation.

### ⚠️ Pre-flight check — Claude does this BEFORE any work
1. Confirm both `legs-data.js` and `rss.xml` are attached.
2. If either is missing — **stop and tell the user what's missing.** Do not proceed with placeholder data or guesswork.
3. Confirm the kickoff prompt's `DEPARTURE` matches the last entry of `FLIGHT_LEGS` (= last arrival = required departure for next leg). If not, stop and report the discrepancy.

### Static project knowledge (rarely changes)
- `lewis-clark-project-summary.md` — this file
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

[VIDEO: youtubeVideoId | caption text]

[paragraph 3 of journal text]

[PHOTO: filename2.png | caption text]
```

### 🚫 Journal wording rule — CRITICAL
**The journal paragraphs are the user's own words. Claude must not change, rephrase, expand, or embellish them without explicit approval.**

- Copy the journal text verbatim into `JOURNAL_BODY`.
- Claude MAY flag factual errors inline (using the ⚠️ FLAG format) and propose corrected wording — but must wait for the user to approve before making any change.
- The only wording changes permitted in the HTML are those the user explicitly approves in a follow-up message.
- This rule applies even when Claude believes a rewrite would be more accurate, more vivid, or better style. It is not Claude's journal.

### Inline media syntax
- **Photo:** `[PHOTO: filename.png | caption | primary]`
  - `primary` flag (optional) marks the thumbnail/RSS image. Default = first photo.
  - `filename.png` is the filename only — Claude prefixes `Expedition3/Legs/`.
- **Video:** `[VIDEO: youtubeId | caption]`
  - `youtubeId` is the 11-char YouTube ID (the bit after `embed/` or `watch?v=`).

Photos and videos render in the exact order they appear inline. Never reorder.

### What Claude calculates / fills automatically
- L&C dates (from prior leg's end + pace, unless user provides)
- Leg distance: `AIRPORT_CUM_NM[arr] - AIRPORT_CUM_NM[dep]` from legs-data.js
- Cumulative NM: previous `EXP3_STATS.distanceNM` + this leg's nm
- Progress %: `cumulative / EXP3_STATS.totalNM × 100`, rounded
- COMPLETED_COORDS: extend through the new arrival's snap point
- Title (if user omits) — proposed for confirmation

---

## Per-leg deliverables

Three files per leg, generated from the template + legs-data.js:

1. **`leg-NN.html`** — fill `leg-template.html` placeholders. Never regenerate the CSS or structure; only the placeholders change.
2. **`legs-data.js`** — append new `FLIGHT_LEGS` entry, extend `COMPLETED_COORDS`, update `EXP3_STATS`, append to `LEG_NOTES` (`facts` from research, `covered` from the journal that was just written).
3. **`rss.xml`** — read existing rss.xml from the attachment, **prepend** the new entry, carry all previous entries forward verbatim. Never rebuild from scratch (confuses follow.it).

---

## Fact-check rule (in-draft flagging)

Claude flags any claim it is not fully confident in **inline in the initial draft** with a marker:

> ⚠️ FLAG: "specific claim" — uncertainty: [what's ambiguous]. Confirm / correct / drop.

User resolves all flags in one pass. No separate "now fact-check this" round-trip. Anything already verified in `LEG_NOTES[slug].facts` does not get re-flagged — only new claims for the new leg.

---

## Leg-data structures (canonical)

### FLIGHT_LEGS entry
```javascript
{
  lat, lng,
  label: "Leg N: [Title]",
  location: "DEP → ARR · City A to City B",
  date: "Month D, YYYY",
  thumb: "Expedition3/Legs/LegNN-PrimaryPhoto.png",
  post: "Expedition3/Legs/leg-NN.html",
  slug: "leg-NN",
  lcDates: "Mon D–Mon D, 1803",
  nm: 00,
  duration: "H:MM"
}
```

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
Cumulative NM from Pittsburgh per airport, snapped to the route polyline. New leg distance = `AIRPORT_CUM_NM[arr] - AIRPORT_CUM_NM[dep]`. To add a candidate airport, ask Claude to "add CODE to AIRPORT_CUM_NM" — Claude snaps it (flagging if >10 NM off-route per the flight-planner rule) and updates the block.

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
| `{{HISTORICAL_TITLE}}` / `{{HISTORICAL_BODY}}` | historical section h2 + paragraphs |
| `{{PREV_NUM}}` / `{{PREV_PAD}}` / `{{NEXT_NUM}}` / `{{NEXT_PAD}}` | leg-nav numbers |

Snippet patterns for journal body (paragraph, photo, video) are documented at the top of the template file.

### Historical section rules
- Third person only — never "you"/"your". Use "this leg" or "the Corps."
- Banner format: `What Lewis & Clark were doing at this same point — [LC_DATES]` (handled by template).
- Draw on `LEG_NOTES[slug].facts` for verified material.

### Historical research sources
Two background sources are available for every leg — fetch when they'd add useful detail or help verify a claim, but no need to cite them every time. Since most flights cover multiple L&C days, fetch the full date range (one request per day) rather than just a single entry:

1. **Primary journals** — `https://lewisandclarkjournals.unl.edu/item/lc.jrn.YYYY-MM-DD` (one page per day). Good for specific detail and anything Lewis/Clark actually wrote on a given date.

2. **Day-by-day log** — individual day pages at `https://lewis-clark.org/1804/05/21/` (substitute date); calendar index at `https://lewis-clark.org/day-by-day/calendar/`. Good for narrative context and cross-checking events.

Anything drawn from these that Claude is uncertain about still gets the ⚠️ FLAG treatment.

### Historical section images
A period image can strengthen the historical section, but **only when it genuinely fits and adds to the narrative** — not every leg needs one. When researching a leg, check for a suitable image; if nothing fits well, skip it. Two approved sources:

1. **Public domain images** — Library of Congress, Wikimedia Commons, NPS, public-domain paintings/engravings (e.g. Karl Bodmer, George Catlin), period maps and lithographs. Confirm the work is genuinely public domain (pre-1929 / artist died long enough ago). Caption with the work's title, artist/date, and holding institution.

2. **Michael Haynes paintings** — the pilot has the artist's **permission** to use his Lewis & Clark artwork on the site. Many of his paintings depict specific dated expedition moments, several of them right on this route (e.g. *Ordway's Mast, 1804* near Jefferson City; *Near Miss, 1804*, the keelboat nearly capsizing on a sandbar). Some appear on the lewis-clark.org day-by-day pages, but **not all of them are there — always also check his gallery directly:** `https://www.mhaynesart.com/lewisandclark`.
   - **Attribution is required.** Per the artist: *"Please do credit me; Michael Haynes — www.mhaynesart.com."* Any caption using a Haynes image must credit `Michael Haynes — www.mhaynesart.com`.

**Earmarked image** (use when the matching leg comes up): `https://www.mhaynesart.com/lewisandclark/jcnh09d0ygw1x1khf6w9456wuar26y` — the link resolves to his L&C gallery, so confirm the exact painting/leg with the pilot when planning that leg.

As with prior legs, historical-section images are embedded as **local assets** (`Expedition3/Legs/LegNN-Name.jpg`) that the pilot saves and uploads; Claude proposes the image + source and references the local path in the HTML.

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
MSFS 2024 expedition following Lewis & Clark route Pittsburgh → Fort Clatsop OR. Anonymous blog under pseudonym **Captain Dadders**. Currently reading **Undaunted Courage** by Stephen Ambrose — no spoilers beyond what has been read (currently in the Ohio River section).

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
- **Primary journals** (check every leg): `https://lewisandclarkjournals.unl.edu/item/lc.jrn.YYYY-MM-DD`
- **Day-by-day log** (check every leg): `https://lewis-clark.org/1803/08/31/` — replace date for each day of interest; calendar index at `https://lewis-clark.org/day-by-day/calendar/`
- **Michael Haynes L&C gallery** (check every leg for a fitting image): `https://www.mhaynesart.com/lewisandclark` — usable with permission; **must credit** `Michael Haynes — www.mhaynesart.com`. See "Historical section images" above.
- Public domain images: Karl Bodmer, George Catlin, Library of Congress, NPS, Wikimedia Commons
- 1812 Cincinnati image: https://upload.wikimedia.org/wikipedia/commons/5/53/Cincinnati_I.jpg
- 1817 Pittsburgh image: https://upload.wikimedia.org/wikipedia/commons/0/06/View_of_the_City_of_Pittsburgh_in_1817.jpg
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
- [ ] Historical map overlay toggle (1803 vs modern) — David Rumsey — backlog
- [ ] Aircraft easter egg for Exp I (Bonanza) and Exp II (PC-12) — needs screenshots — backlog

---

## Previous Expeditions
- Archive blog: https://719simpilot.wordpress.com
- All 68 Exp I legs + 81 Exp II flights listed on site with correct URLs
