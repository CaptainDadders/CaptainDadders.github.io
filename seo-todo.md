# Captain Dadders — Site Infrastructure & SEO To-Do

Ordered simplest-first. You may or may not do all of it. Items 1–3 are easy,
standalone, and worth doing. The real cliff is item 6 (hash-routing) — items 4,
5, and 7 are mostly wasted effort until that's solved.

**Recommended plan:** Do 1–3 now (about an hour, all easy). Then stop and look at
what Google Search Console tells you before deciding whether item 6 is worth it.

---

## 1. Web app manifest
- **Effort:** ~5 min
- **Payoff:** Low but real; basically free
- **What:** Add a `site.webmanifest` file in root + one `<link>` line in `<head>`.
- **Why:** Activates the `icon-192.png` / `icon-512.png` files already sitting in
  root (used when someone "adds to home screen" on a phone). Also clears a browser
  console warning.
- **Decisions:** None. Just needs the app name and theme color (navy `#22485c` /
  gold `#c9a44c` to match the favicon).

## 2. robots.txt
- **Effort:** ~5 min
- **Payoff:** Trivial, but a prerequisite courtesy for everything else
- **What:** A two-line file in root allowing crawlers and pointing to the sitemap.
- **Decisions:** None.

## 3. Google Search Console
- **Effort:** ~15 min, one-time, no code
- **Payoff:** High value as *information* — tells you what search terms surface
  the site, which informs whether the harder steps below are worth doing.
- **What:** Verify the domain (via meta tag or DNS record), then watch the data.
- **Note:** Do this early, even before the sitemap exists.
- **Decisions:** Verification method — meta tag (easy, add to `<head>`) vs DNS
  record (cleaner but needs registrar access).

---

### ⬇️ Stop here and review Search Console data before continuing. ⬇️

---

## 4. sitemap.xml
- **Effort:** ~30 min
- **Payoff:** Currently LOW — blocked by item 6
- **What:** Same generation pattern as the existing `rss.xml`.
- **The catch:** Only as good as the URLs it lists. Because legs currently load via
  hash fragments (`#slug`) into a single page, a sitemap can really only list the
  homepage. Thin until item 6 is resolved.
- **Decisions:** Gated on the item 6 decision below.

## 5. Per-page title + meta description
- **Effort:** Moderate
- **Payoff:** HIGHEST of anything on the list — but runs straight into the
  hash-routing problem
- **What:** Unique `<title>` and `<meta name="description">` per leg.
- **The catch:** Easy to improve the single homepage's title/description. Making
  *each leg* have its own is the hard part, because they aren't separate pages.
- **Decisions:** Gated on item 6.

## 6. ⭐ KEY DECISION — Fix hash-routing so legs are real crawlable URLs
- **Effort:** HIGH (changes how the site loads content)
- **Payoff:** This is the unlock. Items 4, 5, and 7 only become genuinely useful
  once this is done.
- **The problem:** The site is a single-page app. Legs load dynamically into
  `index.html` via hash routing (`#slug`). Search engines mostly see one page, so
  individual legs can't rank on their own.
- **THE DECISION TO MAKE:** Do you want each leg to be a real, crawlable URL?
  - **If NO:** Skip items 4, 5, 7 entirely. The site stays one page in Google's
    eyes. That's a legitimate choice for a niche personal blog — accept it and stop
    after item 3.
  - **If YES:** This is a real architectural change (e.g. real paths like
    `/expedition3/leg-21/` with actual HTML per leg, or static pre-rendering, or a
    routing approach that GitHub Pages supports). Bigger project — worth scoping
    separately.

## 7. JSON-LD structured data
- **Effort:** Moderate
- **Payoff:** Marginal; also depends on item 6
- **What:** `BlogPosting` schema per leg, templated into the build.
- **Decisions:** Gated on item 6. Save for last.

---

## Already done
- ✅ Favicon (compass rose + aircraft-needle design; simplified compass star for
  16px). Files in root: `favicon.ico`, `favicon.svg`, `icon-180/192/512.png`.
- ✅ Favicon `<link>` tags added to `index.html` `<head>`.
- ⚠️ Note: hard-refresh (or private window) to see the favicon after pushing —
  browsers cache favicons aggressively.

## The honest summary
The simple stuff (1–3) is genuinely worth doing and takes about an hour total.
The high-payoff SEO stuff (4, 5) is unfortunately also gated behind the
high-effort architectural change (6), with little in between. Decide on item 6
before sinking time into 4, 5, or 7.
