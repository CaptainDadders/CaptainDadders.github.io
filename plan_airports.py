#!/usr/bin/env python3
"""
plan_airports.py  --  Captain Dadders planning-pass geometry
=============================================================

Run this ONCE per batch of candidate airports, in the planning chat (not the
content chat). For each candidate it computes everything deterministic, so the
content chat never has to do geometry or scan the 450-entry campsite list:

  * along-route cumulative NM from Pittsburgh   (-> AIRPORT_CUM_NM)
  * snap point [lat, lng] and polyline index    (-> green-line extension)
  * off-route snap distance, with a >10 NM flag
  * the route vertices to APPEND to COMPLETED_COORDS when this airport is the
    new arrival (the vertices between the previous arrival's snap and this one)
  * nearest campsite BEHIND (or at) and the nearest campsite AHEAD, each with
    its date and along-route distance -- this is what powers the deferred
    "Kaw Point" date call at content time. The script does NOT choose; it
    surfaces both so the pilot decides after flying.

It does NOT do research, pick images, or resolve the date call -- those need
judgement and stay with Claude / the pilot.

INPUT  (a small JSON file; Claude fills the coords by resolving each code)
--------------------------------------------------------------------------
{
  "prev_arrival_cum_nm": 1282.8,        # optional: along-route NM of the last
                                        # flown arrival. If given, COMPLETED_COORDS
                                        # append lists only the NEW vertices past it.
  "airports": [
    { "code": "KSTJ", "lat": 39.7719, "lng": -94.9097 },
    { "code": "KMKC", "lat": 39.11326, "lng": -94.59099 }
  ]
}

USAGE
-----
    python3 plan_airports.py \
        --input    candidates.json \
        --route    /mnt/project/route_outbound.json \
        --camps    /mnt/project/camps_slim.json \
        [--json out.json]        # also write machine-readable results

OUTPUT
------
Prints a human-readable report and, per airport, a ready-to-paste
AIRPORT_CUM_NM line plus the stored planning fields. With --json it also writes
a structured file the content step can read from.

VALIDATED against legs-data.js: snap-to-nearest-vertex reproduces the stored
AIRPORT_CUM_NM values (KMKC 1282.8 exact, KEHR exact, 1G8 within rounding) and
the full polyline length is 4028.9 NM vs. the canonical 4029.
"""

import argparse
import json
import math
import sys
from pathlib import Path

R_NM = 3440.065  # mean earth radius in nautical miles


# --------------------------------------------------------------------------- #
#  Geometry
# --------------------------------------------------------------------------- #
def haversine(a, b):
    lat1, lon1, lat2, lon2 = map(math.radians, [a[0], a[1], b[0], b[1]])
    dlat = lat2 - lat1
    dlon = lon2 - lon1
    x = math.sin(dlat / 2) ** 2 + math.cos(lat1) * math.cos(lat2) * math.sin(dlon / 2) ** 2
    return 2 * R_NM * math.asin(math.sqrt(x))


def build_polyline(route):
    """Concatenate the 5 segments into one continuous polyline, dropping the
    duplicated seam vertex where a segment starts exactly where the prior ended."""
    poly = list(route[0])
    for seg in route[1:]:
        if poly[-1] == seg[0]:
            poly.extend(seg[1:])
        else:
            poly.extend(seg)
    return [(p[0], p[1]) for p in poly]


def cumulative(poly):
    cum = [0.0]
    for i in range(1, len(poly)):
        cum.append(cum[-1] + haversine(poly[i - 1], poly[i]))
    return cum


def snap_to_vertex(pt, poly):
    """Snap to the nearest polyline VERTEX (the documented method).
    Returns (index, off_route_nm)."""
    best_i, best_d = 0, float("inf")
    for i, v in enumerate(poly):
        d = haversine(pt, v)
        if d < best_d:
            best_i, best_d = i, d
    return best_i, best_d


# --------------------------------------------------------------------------- #
#  Campsite lookup
# --------------------------------------------------------------------------- #
def campsite_positions(camps, poly, cum):
    """Along-route NM of each campsite (snapped to the polyline)."""
    pos = []
    for x in camps:
        i, _ = snap_to_vertex((x["lat"], x["lng"]), poly)
        pos.append(cum[i])
    return pos


def nearest_camps(target_cum, camps, camp_pos):
    """Nearest campsite at-or-behind the target, and the true nearest ahead.

    Returns (behind, ahead, deferred) where `deferred` is True when the camp
    AHEAD is closer to the landing point than the camp BEHIND -- i.e. the
    nearest campsite is actually just past where you landed (the Kaw Point
    case). That's the only time a date call needs deferring to content time."""
    behind, ahead = None, None
    for i, p in enumerate(camp_pos):
        if p <= target_cum:
            if behind is None or p > camp_pos[behind]:
                behind = i
        else:
            if ahead is None or p < camp_pos[ahead]:
                ahead = i

    def pack(i, signed_gap):
        if i is None:
            return None
        return {
            "index": i,
            "date": camps[i]["date"],
            "place": camps[i]["place"],
            "along_route_nm": round(camp_pos[i], 1),
            "gap_nm": round(abs(signed_gap), 1),
        }

    behind_gap = (target_cum - camp_pos[behind]) if behind is not None else None
    ahead_gap = (camp_pos[ahead] - target_cum) if ahead is not None else None
    deferred = ahead is not None and (behind is None or ahead_gap < behind_gap)

    behind_d = pack(behind, behind_gap) if behind is not None else None
    ahead_d = pack(ahead, ahead_gap) if ahead is not None else None
    return behind_d, ahead_d, deferred


# --------------------------------------------------------------------------- #
#  Main
# --------------------------------------------------------------------------- #
def main():
    ap = argparse.ArgumentParser(description="Captain Dadders planning-pass geometry.")
    ap.add_argument("--input", required=True, help="candidates JSON")
    ap.add_argument("--route", default="/mnt/project/route_outbound.json")
    ap.add_argument("--camps", default="/mnt/project/camps_slim.json")
    ap.add_argument("--off-route-flag", type=float, default=10.0,
                    help="flag airports snapping more than this many NM off-route (default 10)")
    ap.add_argument("--json", help="optional path to write structured results")
    args = ap.parse_args()

    spec = json.loads(Path(args.input).read_text(encoding="utf-8"))
    route = json.loads(Path(args.route).read_text(encoding="utf-8"))
    camps = json.loads(Path(args.camps).read_text(encoding="utf-8"))

    poly = build_polyline(route)
    cum = cumulative(poly)
    camp_pos = campsite_positions(camps, poly, cum)

    prev_cum = spec.get("prev_arrival_cum_nm")
    results = []

    print(f"Route polyline: {len(poly)} vertices, total {cum[-1]:.1f} NM")
    if prev_cum is not None:
        print(f"Previous arrival at {prev_cum:.1f} NM (COMPLETED_COORDS append lists only newer vertices)")
    print("=" * 70)

    for ap_spec in spec["airports"]:
        code = ap_spec["code"]
        pt = (ap_spec["lat"], ap_spec["lng"])
        idx, off = snap_to_vertex(pt, poly)
        snap_cum = cum[idx]
        snap_pt = [round(poly[idx][0], 5), round(poly[idx][1], 5)]
        flagged = off > args.off_route_flag

        behind, ahead, deferred = nearest_camps(snap_cum, camps, camp_pos)

        # COMPLETED_COORDS append: route vertices from just-after prev arrival
        # through this airport's snap vertex, then the snap point itself.
        coords_append = []
        if prev_cum is not None:
            start_i = next((j for j in range(len(cum)) if cum[j] > prev_cum), idx)
            coords_append = [[round(poly[j][0], 5), round(poly[j][1], 5)]
                             for j in range(start_i, idx + 1)]

        rec = {
            "code": code,
            "cum_nm": round(snap_cum, 1),
            "snap_point": snap_pt,
            "snap_index": idx,
            "off_route_nm": round(off, 2),
            "off_route_flag": flagged,
            "nearest_camp_behind": behind,
            "nearest_camp_ahead": ahead,
            "deferred_date_call": deferred,
            "completed_coords_append": coords_append,
        }
        results.append(rec)

        # ---- human-readable report ----
        flag = "  🚩 OFF-ROUTE" if flagged else ""
        print(f"\n{code}{flag}")
        print(f"  cum NM:        {snap_cum:.1f}")
        print(f"  snap point:    {snap_pt}   (vertex #{idx})")
        print(f"  off-route:     {off:.2f} NM"
              + ("   >>> EXCEEDS {:.0f} NM — confirm the code is correct".format(args.off_route_flag)
                 if flagged else ""))
        if behind:
            print(f"  camp behind:   {behind['date']:18} {behind['gap_nm']:>5} NM back   {behind['place']}")
        else:
            print("  camp behind:   (none — before the first campsite)")
        if ahead:
            print(f"  camp ahead:    {ahead['date']:18} {ahead['gap_nm']:>5} NM fwd    {ahead['place']}")
            if deferred:
                print("                 🚩 closer than the camp behind — DEFERRED DATE CALL (decide at content time)")
        else:
            print("  camp ahead:    (none)")
        print(f'  AIRPORT_CUM_NM line:   "{code}": {snap_cum:.1f},')

    print("\n" + "=" * 70)
    print("Default boundary = the camp BEHIND. A 🚩 deferred date call means the camp")
    print("AHEAD is closer than the one behind — surface it at content time and let the")
    print("pilot choose. The script never makes the call itself.")

    # ----- paste-ready legs-data.js output -----
    emit_legs_data(results)

    if args.json:
        out = {"prev_arrival_cum_nm": prev_cum, "airports": results}
        Path(args.json).write_text(json.dumps(out, indent=2, ensure_ascii=False), encoding="utf-8")
        print(f"\nStructured results written to {args.json}")


def render_plan_entry(rec):
    """One AIRPORT_PLAN entry as JS (quoted code key, unquoted field keys)."""
    ii = "    "
    snap = rec["snap_point"]

    def camp_js(c):
        if not c:
            return "null"
        return (f'{{ date: {json.dumps(c["date"])}, '
                f'place: {json.dumps(c["place"])}, gapNM: {c["gap_nm"]} }}')

    lines = [
        f'  {json.dumps(rec["code"])}: {{',
        f'{ii}snap: [{snap[0]}, {snap[1]}],',
        f'{ii}snapIndex: {rec["snap_index"]},',
        f'{ii}offRouteNM: {rec["off_route_nm"]},',
        f'{ii}campBehind: {camp_js(rec["nearest_camp_behind"])},',
        f'{ii}campAhead: {camp_js(rec["nearest_camp_ahead"])},',
        f'{ii}deferredDateCall: {"true" if rec["deferred_date_call"] else "false"}',
        "  },",
    ]
    return "\n".join(lines)


def emit_legs_data(results):
    """Print copy-paste-ready blocks for legs-data.js."""
    print("\n" + "=" * 70)
    print("PASTE INTO legs-data.js")
    print("=" * 70)

    print("\n--- 1) Add to the AIRPORT_CUM_NM map (before its closing `};`).")
    print("       NOTE: add a comma after the current last entry first. ---\n")
    for rec in results:
        print(f'  {json.dumps(rec["code"])}: {rec["cum_nm"]},'
              f'   // snap {rec["snap_point"]}, {rec["off_route_nm"]} NM off-route')

    print("\n--- 2) AIRPORT_PLAN block.")
    print("       First batch: paste the whole block. Later batches: paste just the")
    print("       entries (lines between the braces) before AIRPORT_PLAN's `};`. ---\n")
    print("const AIRPORT_PLAN = {")
    for rec in results:
        print(render_plan_entry(rec))
    print("};")


if __name__ == "__main__":
    main()
