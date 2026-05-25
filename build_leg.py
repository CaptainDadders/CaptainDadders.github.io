#!/usr/bin/env python3
"""
build_leg.py  --  Captain Dadders leg assembler
================================================

Given a small JSON "payload" plus the three project files, this script produces
the three per-leg deliverables WITHOUT Claude having to re-emit any large file
into the chat:

    1. leg-NN.html   -- leg-template.html with all {{PLACEHOLDERS}} filled
    2. legs-data.js  -- a copy with the new FLIGHT_LEGS entry appended,
                        COMPLETED_COORDS extended, EXP3_STATS updated,
                        and a new LEG_NOTES entry appended
    3. rss.xml       -- a copy with the new <item> PREPENDED, all prior
                        items carried forward verbatim

Outputs are written to --outdir (default ./out); the input files are never
touched, so you can diff before publishing.

USAGE
-----
    python3 build_leg.py \
        --payload   payload.json \
        --template  /mnt/project/leg-template.html \
        --legs-data legs-data.js \
        --rss       rss.xml \
        --outdir    ./out

PAYLOAD SCHEMA  (this is the interface Claude generates at assembly time)
-------------------------------------------------------------------------
{
  "leg_num": 19,
  "leg_title": "Into the Setting Sun",
  "date_flown": "May 7, 2026",
  "dep": { "code": "KY8", "name": "Lewis Field",            "code_city": "KY8 — Lewisport, KY" },
  "arr": { "code": "KEHR","name": "Henderson City-County Airport","code_city": "KEHR — Henderson, KY" },
  "distance_nm": 49,
  "duration": "0:45",
  "cumulative_nm": 672,            # int -> auto comma-formatted, or pass a string
  "total_nm": "4,029",             # defaults to "4,029" if omitted
  "progress_pct": 17,
  "lc_dates": "Oct 30 - Nov 2, 1803",
  "historical_title": "A River Town Already Waiting",
  "historical_body": ["First paragraph...", "Second paragraph..."],
  "journal": [
    { "type": "para",  "text": "We lifted off just after dawn..." },
    { "type": "photo", "file": "Leg19-Departure.png", "caption": "Climbing out", "alt": "optional", "primary": true },
    { "type": "para",  "text": "..." },
    { "type": "video", "id": "abc123XYZ_0", "caption": "Short final", "title": "optional" }
  ],
  "nav": { "prev_num": 18, "next_num": 20 },   # optional; defaults to leg_num-1 / leg_num+1

  "legs_data": {
    "flight_leg": {                # one FLIGHT_LEGS entry, keys in canonical order
      "lat": 37.81, "lng": -87.68,
      "label": "Leg 19: Into the Setting Sun",
      "location": "KY8 -> KEHR · Lewisport to Henderson",
      "date": "May 7, 2026",
      "thumb": "Expedition3/Legs/Leg19-Departure.png",
      "post": "Expedition3/Legs/leg-19.html",
      "slug": "leg-19",
      "lcDates": "Oct 30 - Nov 2, 1803",
      "nm": 49,
      "duration": "0:45"
    },
    "completed_coords_append": [ [37.90, -87.50], [37.84, -87.59] ],
    "exp3_stats": {                # only the keys that change
      "legsFlown": 19, "distanceNM": 672, "progressPct": 17,
      "statusBadge": "En route", "updatedDate": "May 7, 2026 3:42 PM MT"
    },
    "leg_notes": { "slug": "leg-19", "facts": "Verified research...", "covered": "What the leg covered..." }
  },

  "rss_item": {
    "title": "Leg 19: Into the Setting Sun — KY8 to KEHR",
    "link": "https://captaindadders.com/#leg-19",
    "description": "One or two sentence summary.",
    "pubDate": "Thu, 07 May 2026 12:00:00 +0000",
    "guid": "https://captaindadders.com/#leg-19",
    "image_url": "https://captaindadders.com/Expedition3/Legs/Leg19-Departure.png"
  }
}

NOTE: the legs-data.js / rss.xml editing is anchor-based string surgery written
from the documented structure. It raises a clear error rather than guessing if
it can't find a section. Validate against a real file once before trusting it.
"""

import argparse
import json
import re
import sys
from pathlib import Path


# --------------------------------------------------------------------------- #
#  Small JS / XML value helpers
# --------------------------------------------------------------------------- #
def js_value(v):
    """Render a Python value as a JS literal."""
    if isinstance(v, bool):
        return "true" if v else "false"
    if isinstance(v, (int, float)):
        return str(v)
    if v is None:
        return "null"
    return json.dumps(v, ensure_ascii=False)  # quoted + escaped string


def js_object(d, base_indent):
    """Render a dict as a multi-line JS object literal (unquoted keys)."""
    inner = base_indent + "  "
    lines = [f"{inner}{k}: {js_value(v)}" for k, v in d.items()]
    return "{\n" + ",\n".join(lines) + "\n" + base_indent + "}"


def xml_escape(s):
    return (str(s).replace("&", "&amp;")
                  .replace("<", "&lt;")
                  .replace(">", "&gt;"))


def attr_escape(s):
    return str(s).replace('"', "&quot;")


def fmt_num(v):
    """Comma-format an int; pass strings through untouched."""
    if isinstance(v, int):
        return f"{v:,}"
    return str(v)


# --------------------------------------------------------------------------- #
#  Bracket-aware string surgery for legs-data.js
# --------------------------------------------------------------------------- #
def find_open(text, var_name, open_ch):
    """Index of the first `open_ch` after the declaration of `var_name`."""
    m = re.search(r"\b" + re.escape(var_name) + r"\b", text)
    if not m:
        raise ValueError(f"Could not find declaration of '{var_name}' in legs-data.js")
    try:
        return text.index(open_ch, m.end())
    except ValueError:
        raise ValueError(f"Could not find '{open_ch}' after '{var_name}'")


def find_matching(text, open_idx, open_ch, close_ch):
    """Index of the matching close bracket, skipping string contents."""
    depth = 0
    i = open_idx
    n = len(text)
    quote = None
    while i < n:
        c = text[i]
        if quote:
            if c == "\\":
                i += 2
                continue
            if c == quote:
                quote = None
        else:
            if c in ('"', "'", "`"):
                quote = c
            elif c == open_ch:
                depth += 1
            elif c == close_ch:
                depth -= 1
                if depth == 0:
                    return i
        i += 1
    raise ValueError(f"Unbalanced {open_ch}{close_ch} starting at index {open_idx}")


def child_indent_for(text, close_idx):
    """Indentation to use for a newly inserted child element."""
    line_start = text.rfind("\n", 0, close_idx) + 1
    close_indent = text[line_start:close_idx]
    # close_indent is whitespace before the closing bracket; go one level deeper.
    return close_indent + "  ", close_indent


def append_before_close(text, open_idx, close_idx, element):
    """Insert `element` as the last item before the close bracket at close_idx."""
    inner = text[open_idx + 1:close_idx]
    child_ind, close_ind = child_indent_for(text, close_idx)
    body = inner.rstrip()
    if body.strip() == "":
        new_inner = "\n" + child_ind + element + "\n" + close_ind
    else:
        sep = "" if body.endswith(",") else ","
        new_inner = body + sep + "\n" + child_ind + element + "\n" + close_ind
    return text[:open_idx + 1] + new_inner + text[close_idx:]


def append_array_element(text, var_name, element):
    open_idx = find_open(text, var_name, "[")
    close_idx = find_matching(text, open_idx, "[", "]")
    return append_before_close(text, open_idx, close_idx, element)


def append_object_entry(text, var_name, entry):
    open_idx = find_open(text, var_name, "{")
    close_idx = find_matching(text, open_idx, "{", "}")
    return append_before_close(text, open_idx, close_idx, entry)


def update_object_values(text, var_name, updates):
    """Replace `key: value` pairs inside the named object (scoped, first match)."""
    open_idx = find_open(text, var_name, "{")
    close_idx = find_matching(text, open_idx, "{", "}")
    obj = text[open_idx:close_idx + 1]
    for k, v in updates.items():
        lit = js_value(v)
        pat = re.compile(
            r"(" + re.escape(k) + r"\s*:\s*)"
            r'("(?:[^"\\]|\\.)*"|\'(?:[^\'\\]|\\.)*\'|[^,}\n]+)'
        )
        new_obj, count = pat.subn(lambda m: m.group(1) + lit, obj, count=1)
        if count == 0:
            raise ValueError(f"Key '{k}' not found in {var_name}")
        obj = new_obj
    return text[:open_idx] + obj + text[close_idx + 1:]


# --------------------------------------------------------------------------- #
#  Builders
# --------------------------------------------------------------------------- #
def build_journal_body(items):
    blocks = []
    for it in items:
        t = it.get("type")
        if t == "para":
            blocks.append(f'<p class="journal-para">{it["text"]}</p>')
        elif t == "photo":
            alt = it.get("alt") or it.get("caption", "")
            blocks.append(
                '<div class="leg-photo">\n'
                f'  <img src="Expedition3/Legs/{it["file"]}" alt="{attr_escape(alt)}">\n'
                f'  <div class="photo-caption">{it["caption"]}</div>\n'
                "</div>"
            )
        elif t == "video":
            title = it.get("title") or it.get("caption", "")
            blocks.append(
                '<div class="leg-video">\n'
                f'  <iframe src="https://www.youtube.com/embed/{it["id"]}" '
                f'title="{attr_escape(title)}" frameborder="0" allowfullscreen></iframe>\n'
                f'  <div class="video-caption">{it["caption"]}</div>\n'
                "</div>"
            )
        else:
            raise ValueError(f"Unknown journal item type: {t!r}")
    return "\n\n".join(blocks)


def build_historical_body(paragraphs):
    return "\n".join(f"<p>{p}</p>" for p in paragraphs)


def render_html(payload, template):
    n = payload["leg_num"]
    nav = payload.get("nav", {})
    prev_num = nav.get("prev_num", n - 1)
    next_num = nav.get("next_num", n + 1)

    ph = {
        "LEG_NUM": n,
        "LEG_NUM_PADDED": f"{n:02d}",
        "LEG_TITLE": payload["leg_title"],
        "DATE_FLOWN": payload["date_flown"],
        "DEP_NAME": payload["dep"]["name"],
        "DEP_CODE": payload["dep"]["code"],
        "DEP_CODE_CITY": payload["dep"]["code_city"],
        "ARR_NAME": payload["arr"]["name"],
        "ARR_CODE": payload["arr"]["code"],
        "ARR_CODE_CITY": payload["arr"]["code_city"],
        "DISTANCE_NM": payload["distance_nm"],
        "DURATION": payload["duration"],
        "CUMULATIVE_NM": fmt_num(payload["cumulative_nm"]),
        "TOTAL_NM": fmt_num(payload.get("total_nm", "4,029")),
        "PROGRESS_PCT": payload["progress_pct"],
        "LC_DATES": payload["lc_dates"],
        "JOURNAL_BODY": build_journal_body(payload["journal"]),
        "HISTORICAL_TITLE": payload["historical_title"],
        "HISTORICAL_BODY": build_historical_body(payload["historical_body"]),
        "PREV_NUM": prev_num,
        "PREV_PAD": f"{prev_num:02d}",
        "NEXT_NUM": next_num,
        "NEXT_PAD": f"{next_num:02d}",
    }

    out = template
    for key, val in ph.items():
        out = out.replace("{{" + key + "}}", str(val))

    leftover = sorted(set(re.findall(r"\{\{([A-Z_]+)\}\}", out)))
    if leftover:
        print(f"  ! WARNING: unresolved placeholders: {', '.join(leftover)}", file=sys.stderr)
    return out


def update_legs_data(payload, js_text):
    ld = payload["legs_data"]

    # FLIGHT_LEGS: append new entry
    open_idx = find_open(js_text, "FLIGHT_LEGS", "[")
    close_idx = find_matching(js_text, open_idx, "[", "]")
    child_ind, _ = child_indent_for(js_text, close_idx)
    entry = js_object(ld["flight_leg"], child_ind)
    js_text = append_array_element(js_text, "FLIGHT_LEGS", entry)

    # COMPLETED_COORDS: append each coordinate pair
    for lat, lng in ld.get("completed_coords_append", []):
        js_text = append_array_element(js_text, "COMPLETED_COORDS", f"[{lat}, {lng}]")

    # EXP3_STATS: update changed keys
    if ld.get("exp3_stats"):
        js_text = update_object_values(js_text, "EXP3_STATS", ld["exp3_stats"])

    # LEG_NOTES: append new slug entry
    note = ld["leg_notes"]
    open_idx = find_open(js_text, "LEG_NOTES", "{")
    close_idx = find_matching(js_text, open_idx, "{", "}")
    child_ind, _ = child_indent_for(js_text, close_idx)
    body = js_object({"facts": note["facts"], "covered": note["covered"]}, child_ind)
    entry = f'{js_value(note["slug"])}: {body}'
    js_text = append_object_entry(js_text, "LEG_NOTES", entry)

    return js_text


def build_rss_item(item, indent):
    img = item["image_url"]
    lines = [
        f"{indent}<item>",
        f'{indent}  <title>{xml_escape(item["title"])}</title>',
        f'{indent}  <link>{item["link"]}</link>',
        f'{indent}  <description>{xml_escape(item["description"])}</description>',
        f'{indent}  <pubDate>{item["pubDate"]}</pubDate>',
        f'{indent}  <guid>{item["guid"]}</guid>',
        f'{indent}  <enclosure url="{img}" type="image/png" length="0"/>',
        f'{indent}  <media:content url="{img}" medium="image"/>',
        f"{indent}</item>",
    ]
    return "\n".join(lines)


def update_rss(payload, rss_text):
    item = payload["rss_item"]
    m = re.search(r"([ \t]*)<item>", rss_text)
    if m:
        indent = m.group(1)
        block = build_rss_item(item, indent)
        pos = m.start()
        return rss_text[:pos] + block + "\n" + rss_text[pos:]
    # No existing items: insert before </channel>
    m2 = re.search(r"([ \t]*)</channel>", rss_text)
    if not m2:
        raise ValueError("Could not find <item> or </channel> in rss.xml")
    indent = m2.group(1) + "  "
    block = build_rss_item(item, indent)
    pos = m2.start()
    return rss_text[:pos] + block + "\n" + rss_text[pos:]


# --------------------------------------------------------------------------- #
#  Main
# --------------------------------------------------------------------------- #
def main():
    ap = argparse.ArgumentParser(description="Assemble a Captain Dadders leg.")
    ap.add_argument("--payload", required=True)
    ap.add_argument("--template", default="/mnt/project/leg-template.html")
    ap.add_argument("--legs-data", required=True)
    ap.add_argument("--rss", required=True)
    ap.add_argument("--outdir", default="./out")
    args = ap.parse_args()

    payload = json.loads(Path(args.payload).read_text(encoding="utf-8"))
    template = Path(args.template).read_text(encoding="utf-8")
    legs_data = Path(args.legs_data).read_text(encoding="utf-8")
    rss = Path(args.rss).read_text(encoding="utf-8")

    n = payload["leg_num"]
    outdir = Path(args.outdir)
    outdir.mkdir(parents=True, exist_ok=True)

    html_out = render_html(payload, template)
    legs_out = update_legs_data(payload, legs_data)
    rss_out = update_rss(payload, rss)

    html_path = outdir / f"leg-{n:02d}.html"
    legs_path = outdir / "legs-data.js"
    rss_path = outdir / "rss.xml"

    html_path.write_text(html_out, encoding="utf-8")
    legs_path.write_text(legs_out, encoding="utf-8")
    rss_path.write_text(rss_out, encoding="utf-8")

    print(f"Leg {n} assembled:")
    print(f"  {html_path}")
    print(f"  {legs_path}   (FLIGHT_LEGS + COMPLETED_COORDS + EXP3_STATS + LEG_NOTES updated)")
    print(f"  {rss_path}    (new item prepended)")


if __name__ == "__main__":
    main()
