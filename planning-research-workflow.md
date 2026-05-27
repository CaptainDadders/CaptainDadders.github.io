# Planning & Research — Captain Dadders LECL Expedition

## What This Is

The **up-front** phase of the expedition workflow. It does all the heavy,
predictable work — geometry and bulk historical research — *ahead of time*, so
that the content-generation chat (run during the flying window, where usage
credits are tight) stays lean and never recomputes anything.

This phase runs in its **own chat(s)**, separate from content generation. It is
not time-pressured, so it is the right place for the expensive work.

There are two distinct activities here, and they can be **separate chats**:

1. **Airport planning** — turn a batch of candidate airport codes into stored
   geometry + campsite data (`plan_airports.py` → `legs-data.js`).
2. **Research** — fetch per-day historical material for a date range and save it
   as one file per day, plus scout candidate images.

Do airport planning first (it produces the dates research keys off), but they do
not have to be the same chat or the same sitting.

---

## Activity 1 — Airport Planning

### Input
The pilot gives a **batch of candidate airport codes** (the next stretch of
possible landing spots). `legs-data.js` must be attached — it is read and
extended here.

### Steps
1. **Resolve each code** to its full name and coordinates. Include names in the
   output so the pilot can confirm the right airports.
2. **Run `plan_airports.py`** with those coordinates and
   `prev_arrival_cum_nm` = the cumulative NM of the current last-flown airport.
   The script computes, per airport:
   - cumulative NM from Pittsburgh (→ `AIRPORT_CUM_NM`)
   - snap point + polyline index (→ green-line / `AIRPORT_PLAN`)
   - off-route distance, with a 🚩 flag if **> 10 NM** (likely wrong code)
   - nearest campsite **behind** and **ahead**, each with date + along-route gap
   - `deferredDateCall` = true when the camp ahead is closer than the one behind
3. **Surface flags.** If any airport snaps > 10 NM off-route, stop and ask the
   pilot to confirm the code before storing it — same rule as the flight planner.
4. **Paste the script's output into `legs-data.js`:**
   - new `AIRPORT_CUM_NM` lines (remember to add a comma after the current last
     entry)
   - new `AIRPORT_PLAN` entries (first batch: the whole block; later batches:
     just the entries before its closing `};`)
5. Hand back the updated `legs-data.js` for the pilot to commit.

### What planning does NOT decide
The camp-behind vs. camp-ahead choice (the "Kaw Point" call) is **not made
here.** The script stores both candidates and the `deferredDateCall` flag; the
actual choice is made at content time, after the pilot has flown and read the
material. See the deferred-date note under Research below.

### `AIRPORT_PLAN` entry shape (stored in `legs-data.js`)
```javascript
"KSTJ": {
  snap: [39.77228, -94.91517],   // green-line point; cumulative NM measured here
  snapIndex: 674,                // polyline vertex (rebuilds green line w/o re-snapping)
  offRouteNM: 0.25,
  campBehind: { date: "1804-07-06", place: "mouth of Walnut Creek, MO", gapNM: 8.2 },
  campAhead:  { date: "1804-07-07", place: "2 mi NW of St. Joseph, MO",  gapNM: 3.1 },
  deferredDateCall: true         // camp ahead closer than behind → decide at content time
}
```
`AIRPORT_CUM_NM` stays a plain `code → number` map (the live site reads it as a
number — do not change its shape). `AIRPORT_PLAN` is a separate parallel block
and only holds airports **ahead**; once a leg is flown, that entry has done its
job and can be left or dropped.

---

## Activity 2 — Research

### Input: a **date range**, not airports
Once airport planning is done, every airport's boundary date already lives in
`AIRPORT_PLAN`, so the pilot can read it off and give a plain date range. **Take
a date range directly** (e.g. "July 6 – July 18, 1804"). Do **not** ask for
airports here — that would force `legs-data.js` to be attached just to look up
two dates the pilot already has, which is the expensive thing we are avoiding.
`legs-data.js` does **not** need to be in the research chat at all.

The research range may be a **smaller subset** than the full batch of airports
planned — research only what the pilot asks for.

### Generous end boundary (deferred date call)
Because the camp-behind/ahead choice is deferred to content time, research a day
or two **past** the nearest-behind boundary — through any notable camp just
ahead — so that whichever way the pilot decides later, the day-file already
exists and nothing needs re-fetching.

### Steps
1. For **each day** in the range, fetch the historical material from **both**
   sources (see below) and write it to **its own file**, one file per day
   (e.g. `research-1804-07-06.md`). One file per day matters: at content time
   only the relevant days get attached, not a blob covering dates that aren't
   needed.
   - **Both sources are required for every day.** A search snippet is not a
     substitute for fetching the UNL journal page. Fetch both URLs directly.
2. **Resolve a candidate image** for each day (see Image sources and criteria
   below). This work is done here, not deferred to the content chat. For each
   day, work through the sources in order until a candidate is found or all
   sources are exhausted. Record the result — found or not found — in that
   day's file. It is fine if most days say "nothing found"; the point is that
   the search was done and the best available candidate for the span is
   identified.
3. Hand the day-files back for the pilot to **save locally** — these do **not**
   go into project knowledge (they are leg-specific clutter that doesn't belong
   in the always-on set).

### Per-day file contents (suggested)
- Key events / what the journals record for that date (paraphrased, with the
  source link)
- Anything noteworthy for the historical narrative
- Candidate image entry, which must include:
  - **URL** of the image (direct image URL, not just a page link)
  - **License / attribution** (e.g. CC BY-SA 4.0 © Name, or "public domain,
    held by [institution]", or "© Michael Haynes — www.mhaynesart.com, used
    with permission")
  - **One-line description** of what the image depicts
  - If nothing suitable was found after searching all sources: note
    "Searched [sources checked], no suitable image found" — never leave this
    section blank or defer to the content phase.

### Historical research sources
Both of the following must be fetched for every day in the range:

1. **Primary journals** — `https://lewisandclarkjournals.unl.edu/item/lc.jrn.YYYY-MM-DD`
   (one page per day; contains all journal keepers — Clark's field notes and
   Codex, Lewis, Ordway, Floyd, Gass, Whitehouse — plus editorial footnotes
   identifying places, species, and people).
2. **Day-by-day log** — `https://lewis-clark.org/day-by-day/D-mon-YYYY/`
   e.g. `https://lewis-clark.org/day-by-day/6-jul-1804/`; calendar index at
   `https://lewis-clark.org/day-by-day/calendar/`.

### Image sources and criteria
A period image can strengthen the historical section, but **only when it
genuinely fits** — not every leg needs one.

**What makes a good candidate:**
- Anything **Lewis & Clark–specific** is an automatic contender: the keelboat,
  the men, Seaman, a court martial, a named geographic event from the journals.
- **Monuments or trail markers** along the route (e.g. a Corps of Discovery
  sculpture the pilot passes) are good candidates.
- **Period images of places they passed** work when the place existed and would
  have looked roughly similar — e.g. a Cincinnati streetscape from 1812 is
  close enough; a Kansas City scene from 1820 is not (the city didn't exist).
- **Public-domain photographs** of the modern landscape at a key journal site
  (a river bend, a confluence) can work when they carry a note about what has
  changed since 1804.

**What to avoid:**
- Generic objects with only loose thematic relevance (a cup, a compass, a
  generic prairie).
- Any image of a place or thing that postdates or misrepresents the expedition's
  encounter with it.

**Source order — work through these in sequence:**
1. **Michael Haynes paintings** — consult `haynes-gallery.md` (project file,
   one-time catalog of the full gallery). Look up the dates in the span and
   check whether any painting's described event matches. Both the 16 paintings
   on the artist's own gallery page and the additional works on lewis-clark.org
   are cataloged there, with direct image URLs and source page links. Do **not**
   fetch the live gallery (`https://www.mhaynesart.com/lewisandclark`) on every
   research session — use the catalog instead. If the catalog seems incomplete
   or a candidate can't be confirmed from it, then fetch the gallery directly.
   **Attribution required:** `© Michael Haynes — www.mhaynesart.com, used with
   permission`.
2. **lewis-clark.org day page photos** — the day-by-day pages often include
   trail photos (river views, interpretive signs, monuments) with CC licenses.
   Check the page fetched in Step 1 above.
3. **Public domain** — consult `bodmer-catlin-gallery.md` (project file,
   pre-cataloged) for Karl Bodmer and George Catlin works first. Both
   collections are pre-mapped to expedition date ranges and river segments;
   check the Quick-Reference table at the bottom of that file. Key caveat for
   both: they painted the same locations and tribes ~28–30 years after the
   expedition — always caption with the artist's travel dates, not 1804–06.
   For anything not covered by the catalog (Library of Congress, Wikimedia
   Commons, NPS, period maps, other public-domain engravings), search actively.
   Confirm the work is genuinely public domain (pre-1929 publication, or artist
   died long enough ago). Caption with title, artist/date, and holding
   institution.

---

## Pre-research is the FLOOR, not the ceiling

The point of front-loading research is to get the **bulk, predictable** work —
the per-day journal pages needed on every leg — out of the tight content window.
It is **not** meant to lock the historical section to only what was pre-fetched.

At content time the pilot will have flown the leg, read journal entries or
day-by-day pages, looked at the map, and may ask the historical section to cover
a **specific theme that was not pre-researched** (e.g. the demise of the prairie,
the early history of Kansas City). That is expected and allowed:

- If the topic **is** in the pre-done day-files → write from them (no fetching).
- If it is **new** → do a **targeted live fetch** for just that topic, in the
  content chat. One or two focused lookups for the specific thing asked — not the
  whole leg's research over again.

The window stays lean because the heavy every-time research is already done; a
couple of targeted thematic lookups on top will not blow it.

---

## How this hands off to content generation

Planning and research produce three things the content chat uses:

| Produced here | Lives in | Used at content time for |
|---|---|---|
| `AIRPORT_CUM_NM` + `AIRPORT_PLAN` | `legs-data.js` (committed) | distance, green line, camp dates — read at assembly |
| Per-day research files | pilot's laptop | the historical section — attached for the leg's dates |
| Candidate image(s) | noted in day-files | optional period image in the historical section |

The content chat attaches only the **relevant day-files** at the start, and
`legs-data.js` only at the **final assembly step**. See the content-generation
workflow for that side.
