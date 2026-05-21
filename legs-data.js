// ── LEGS DATA — update this file each leg, never touch index.html ──────────
// legs-data.js — loaded by index.html before the main script block
//
// WHAT LIVES HERE (so the project summary never needs per-leg updates):
//   FLIGHT_LEGS      — all leg metadata including lcDates, nm, duration
//   COMPLETED_COORDS — route polyline through current arrival
//   EXP3_STATS       — live counters for the map/stats panel
//   LEG_NOTES        — { facts, covered } per leg (Claude reads these
//                      when writing historical sections + journal so the
//                      next leg doesn't repeat or contradict prior ones)
//   AIRPORT_CUM_NM   — cumulative NM from Pittsburgh per airport
//                      (snap+haversine along the full 5-segment polyline).
//                      Authoritative source for new-leg distances:
//                        leg.nm = AIRPORT_CUM_NM[arr] - AIRPORT_CUM_NM[dep]

const FLIGHT_LEGS = [
  {
    lat: 40.3334,
    lng: -79.7792,
    label: "Prologue: Preparing for Departure",
    location: "31D — Inter County Airport, Irwin, PA",
    date: "April 26, 2026",
    thumb: "Expedition3/images/Norden.png",
    post: "Expedition3/Legs/leg-00-prologue.html",
    slug: "leg-00",
    lcDates: null,
    nm: null,
    duration: null
  },
  {
    lat: 40.6383,
    lng: -80.6114,
    label: "Leg 1: Departing Pittsburgh",
    location: "31D → 1G8 · Irwin PA to Toronto OH",
    date: "April 28, 2026",
    thumb: "Expedition3/Legs/Leg01-ThePoint.png",
    post: "Expedition3/Legs/leg-01.html",
    slug: "leg-01",
    lcDates: "Aug 31–Sep 5, 1803",
    nm: 37,
    duration: "0:45"
  },
  {
    lat: 39.6448,
    lng: -80.8627,
    label: "Leg 2: Wheeling and the Mound",
    location: "1G8 → 75D · Toronto OH to New Martinsville WV",
    date: "May 1, 2026",
    thumb: "Expedition3/Legs/Leg02-Steelton.png",
    post: "Expedition3/Legs/leg-02.html",
    slug: "leg-02",
    lcDates: "Sep 6–11, 1803",
    nm: 71,
    duration: "0:46"
  },
  {
    lat: 38.4347,
    lng: -82.5543,
    label: "Leg 3: Above the Morning Fog",
    location: "75D → I41 · New Martinsville WV to Huntington WV",
    date: "May 2, 2026",
    thumb: "Expedition3/Legs/Leg03-Fog.png",
    post: "Expedition3/Legs/leg-03.html",
    slug: "leg-03",
    lcDates: "Sep 11–20, 1803",
    nm: 154,
    duration: "1:44"
  },
  {
    lat: 39.1006,
    lng: -84.4228,
    label: "Leg 4: River Highway to Cincinnati",
    location: "I41 → KLUK · Huntington WV to Cincinnati OH",
    date: "May 3, 2026",
    thumb: "Expedition3/Legs/Leg04-Barges.png",
    post: "Expedition3/Legs/leg-04.html",
    slug: "leg-04",
    lcDates: "Sep 20–Oct 4, 1803",
    nm: 125,
    duration: "1:35"
  },
  {
    lat: 38.853,
    lng: -84.79,
    label: "Leg 5: Queen City to the Fossil Lick",
    location: "KLUK → 4KT4 · Cincinnati OH to Warsaw KY",
    date: "May 4, 2026",
    thumb: "Expedition3/Legs/Leg05-Cincinnati.png",
    post: "Expedition3/Legs/leg-05.html",
    slug: "leg-05",
    lcDates: "Oct 1–5, 1803",
    nm: 42,
    duration: "0:37"
  },
  {
    lat: 38.3676,
    lng: -85.7431,
    label: "Leg 6: Clark's Country",
    location: "4KT4 → KJVY · Warsaw KY to Sellersburg IN",
    date: "May 5, 2026",
    thumb: "Expedition3/Legs/Leg06-Farmland.png",
    post: "Expedition3/Legs/leg-06.html",
    slug: "leg-06",
    lcDates: "Oct 5–12, 1803",
    nm: 66,
    duration: "1:07"
  },
  {
    lat: 37.8397,
    lng: -86.9461,
    label: "Leg 7: Below the Falls",
    location: "KJVY → KY8 · Sellersburg IN to Lewisport KY",
    date: "May 6, 2026",
    thumb: "Expedition3/Legs/Leg07-HorseshoeBend.png",
    post: "Expedition3/Legs/leg-07.html",
    slug: "leg-07",
    lcDates: "Oct 12–30, 1803",
    nm: 128,
    duration: "1:31"
  },
  {
    lat: 37.8089,
    lng: -87.6850,
    label: "Leg 8: Into the Setting Sun",
    location: "KY8 → KEHR · Lewisport KY to Henderson KY",
    date: "May 7, 2026",
    thumb: "Expedition3/Legs/Leg08-EllisIsland.png",
    post: "Expedition3/Legs/leg-08.html",
    slug: "leg-08",
    lcDates: "Oct 30–Nov 2, 1803",
    nm: 49,
    duration: "0:45"
  },
  {
    lat: 37.18300,
    lng: -88.75067,
    label: "Leg 9: Past Diamond Island",
    location: "KEHR → M30 · Henderson KY to Metropolis IL",
    date: "May 17, 2026",
    thumb: "Expedition3/Legs/Leg09-DiamondIsland.png",
    post: "Expedition3/Legs/leg-09.html",
    slug: "leg-09",
    lcDates: "Nov 2–11, 1803",
    nm: 116,
    duration: "1:24"
  }
,
  {
    lat: 37.0641,
    lng: -89.2195,
    label: "Leg 10: Reaching the Mississippi",
    location: "M30 → KCIR · Metropolis IL to Cairo IL",
    date: "May 17, 2026",
    thumb: "Expedition3/Legs/Leg10-Cairo.png",
    post: "Expedition3/Legs/leg-10.html",
    slug: "leg-10",
    lcDates: "Nov 13–14, 1803",
    nm: 33,
    duration: "0:33"
  }
,
  {
    lat: 37.5403,
    lng: -89.4864,
    label: "Leg 11: Past Cape Girardeau",
    location: "KCIR → 12LL · Cairo IL to Wolf Lake IL",
    date: "May 18, 2026",
    thumb: "Expedition3/Legs/Leg11-Islands.png",
    post: "Expedition3/Legs/leg-11.html",
    slug: "leg-11",
    lcDates: "Nov 20–24, 1803",
    nm: 53,
    duration: "0:33"
  }
,
  {
    lat: 37.9862,
    lng: -90.0334,
    label: "Leg 12: The Vanished Capital",
    location: "12LL → 6MO2 · Wolf Lake IL to Ste. Genevieve MO",
    date: "May 19, 2026",
    thumb: "Expedition3/Legs/Leg12-Rainbow.png",
    post: "Expedition3/Legs/leg-12.html",
    slug: "leg-12",
    lcDates: "Nov 25 – Dec 5, 1803",
    nm: 49,
    duration: "0:33"
  },
  {
    lat: 38.5706,
    lng: -90.1561,
    label: "Leg 13: At the Gateway",
    location: "6MO2 → KCPS · Ste. Genevieve MO to Cahokia IL",
    date: "May 30, 2026",
    thumb: "Expedition3/Legs/Leg13-Arch.png",
    post: "Expedition3/Legs/leg-13.html",
    slug: "leg-13",
    lcDates: "Dec 5, 1803 – May 14, 1804",
    nm: 46,
    duration: "0:40"
  }
];

// Completed route coordinates — updated through Leg 13 (KCPS)
const COMPLETED_COORDS = [[40.44314,-80.01276],[40.44789,-80.02704],[40.47595,-80.0492],[40.48886,-80.06692],[40.53125,-80.18042],[40.55829,-80.21523],[40.59423,-80.23745],[40.63747,-80.23632],[40.67938,-80.25531],[40.69438,-80.28367],[40.61874,-80.44544],[40.63608,-80.49155],[40.62982,-80.53399],[40.61554,-80.5796],[40.62351,-80.60076],[40.61863,-80.62227],[40.58978,-80.66209],[40.58038,-80.665],[40.53482,-80.62848],[40.47727,-80.59805],[40.40714,-80.61153],[40.39418,-80.62613],[40.38069,-80.61015],[40.35527,-80.61073],[40.32471,-80.60069],[40.27459,-80.61395],[40.25869,-80.62755],[40.24606,-80.65069],[40.20496,-80.66754],[40.14712,-80.70588],[40.11116,-80.70599],[40.0799,-80.73232],[40.05843,-80.72687],[39.97548,-80.73768],[39.96066,-80.75513],[39.94751,-80.76125],[39.91896,-80.75513],[39.91133,-80.75788],[39.90895,-80.76402],[39.9182,-80.78693],[39.9182,-80.80057],[39.90898,-80.80639],[39.86812,-80.79142],[39.85061,-80.81509],[39.83765,-80.82264],[39.80755,-80.82149],[39.76885,-80.86716],[39.71612,-80.83035],[39.69265,-80.85947],[39.62362,-80.87663],[39.61637,-80.91786],[39.59619,-80.95812],[39.55266,-81.02302],[39.50403,-81.07929],[39.44899,-81.12187],[39.43148,-81.17605],[39.38969,-81.21087],[39.37924,-81.2784],[39.34542,-81.34784],[39.344,-81.37545],[39.35665,-81.39441],[39.3829,-81.40885],[39.40744,-81.43022],[39.40672,-81.45934],[39.3647,-81.50995],[39.35488,-81.53822],[39.34077,-81.55025],[39.27054,-81.56185],[39.27481,-81.66826],[39.26084,-81.69317],[39.2331,-81.6965],[39.22391,-81.70347],[39.2025,-81.73596],[39.17322,-81.76405],[39.14529,-81.75084],[39.0932,-81.75367],[39.08144,-81.77521],[39.08344,-81.8042],[39.07478,-81.81417],[39.04773,-81.80824],[39.01589,-81.77518],[38.99091,-81.77243],[38.97485,-81.78576],[38.96198,-81.7894],[38.93768,-81.76221],[38.92781,-81.76019],[38.92249,-81.76805],[38.92384,-81.77977],[38.94377,-81.80702],[38.94529,-81.82799],[38.9293,-81.84537],[38.89173,-81.859],[38.88119,-81.8698],[38.87614,-81.88621],[38.87899,-81.91147],[38.88605,-81.92338],[38.90085,-81.92607],[38.92396,-81.90775],[38.93588,-81.90594],[38.95194,-81.91072],[38.99302,-81.9582],[38.99484,-81.97888],[39.02607,-82.00578],[39.02696,-82.02446],[39.01754,-82.03641],[38.97263,-82.08475],[38.89752,-82.13728],[38.83533,-82.14728],[38.80058,-82.20466],[38.78784,-82.21647],[38.77799,-82.21576],[38.75316,-82.19413],[38.7124,-82.18165],[38.68211,-82.18676],[38.63269,-82.17285],[38.61219,-82.1734],[38.59208,-82.19356],[38.59056,-82.27445],[38.57579,-82.2866],[38.46207,-82.31708],[38.43889,-82.34027],[38.43265,-82.42407],[38.40121,-82.53522],[38.40417,-82.56788],[38.41979,-82.59502],[38.46603,-82.61338],[38.49324,-82.6545],[38.54631,-82.70908],[38.56996,-82.81178],[38.58545,-82.83694],[38.68285,-82.87647],[38.72908,-82.87571],[38.74554,-82.89005],[38.75184,-82.91094],[38.72763,-82.97947],[38.7263,-83.02406],[38.68929,-83.06129],[38.66978,-83.1095],[38.62972,-83.14011],[38.61841,-83.15873],[38.61797,-83.19506],[38.62849,-83.22958],[38.61844,-83.2615],[38.59864,-83.28499],[38.60021,-83.29775],[38.63769,-83.33652],[38.64939,-83.35753],[38.6611,-83.39825],[38.66878,-83.45332],[38.696,-83.50072],[38.69931,-83.5212],[38.68173,-83.61367],[38.67316,-83.62423],[38.63148,-83.64866],[38.62817,-83.67506],[38.65072,-83.76142],[38.70287,-83.79976],[38.71245,-83.83389],[38.73643,-83.84719],[38.75515,-83.8664],[38.78434,-83.96084],[38.77077,-84.04955],[38.77218,-84.09223],[38.80983,-84.21902],[38.82544,-84.23016],[38.89125,-84.24053],[38.95295,-84.28747],[38.99463,-84.30384],[39.01474,-84.32173],[39.03073,-84.34933],[39.05136,-84.42044],[39.06498,-84.43418],[39.10733,-84.43916],[39.11775,-84.46426],[39.10994,-84.48564],[39.08921,-84.51774],[39.09296,-84.55289],[39.07765,-84.58313],[39.06967,-84.63052],[39.10207,-84.70212],[39.13662,-84.73409],[39.14108,-84.74926],[39.12024,-84.77971],[39.09844,-84.83514],[39.06246,-84.88908],[39.0535,-84.89384],[38.99669,-84.85098],[38.97141,-84.83956],[38.96096,-84.84062],[38.92952,-84.86909],[38.91153,-84.87677],[38.90253,-84.86517],[38.89921,-84.81634],[38.88615,-84.79292],[38.87129,-84.78671],[38.85629,-84.79],[38.83468,-84.8236],[38.79797,-84.81284],[38.78842,-84.82382],[38.79247,-84.87809],[38.77618,-84.93756],[38.77078,-84.99798],[38.68491,-85.16838],[38.68445,-85.19756],[38.69257,-85.21846],[38.7314,-85.25228],[38.73728,-85.28292],[38.72698,-85.37384],[38.73089,-85.41633],[38.72464,-85.43987],[38.71313,-85.44959],[38.69331,-85.45511],[38.65294,-85.43645],[38.61752,-85.44103],[38.56828,-85.4184],[38.5361,-85.41672],[38.52491,-85.42823],[38.50648,-85.46643],[38.46267,-85.50446],[38.44148,-85.59972],[38.41454,-85.62043],[38.33072,-85.64647],[38.3055,-85.66821],[38.28811,-85.69209],[38.26281,-85.74354],[38.28043,-85.78746],[38.27821,-85.816],[38.26573,-85.8362],[38.22797,-85.85015],[38.17445,-85.90321],[38.15278,-85.9093],[38.10239,-85.90909],[38.03532,-85.9218],[38.01256,-85.93771],[38.00553,-85.94963],[37.99354,-86.01924],[37.9804,-86.03223],[37.96008,-86.03586],[37.96176,-86.04991],[38.00022,-86.08501],[38.01151,-86.10647],[38.01496,-86.13251],[38.00926,-86.1821],[38.04988,-86.25929],[38.06818,-86.2738],[38.09599,-86.28129],[38.13578,-86.27428],[38.15066,-86.28433],[38.19608,-86.36145],[38.18964,-86.37281],[38.18064,-86.37648],[38.1662,-86.37092],[38.15583,-86.32705],[38.14491,-86.32156],[38.13564,-86.32632],[38.12902,-86.33875],[38.12479,-86.38042],[38.10675,-86.39328],[38.10483,-86.40427],[38.12407,-86.43794],[38.12072,-86.45857],[38.11409,-86.46455],[38.10884,-86.46308],[38.0877,-86.4326],[38.06972,-86.43005],[38.04987,-86.45205],[38.03788,-86.51614],[37.95718,-86.51974],[37.94479,-86.50717],[37.93225,-86.50335],[37.91692,-86.52406],[37.91885,-86.57198],[37.91344,-86.59101],[37.90214,-86.59594],[37.86966,-86.59667],[37.85932,-86.60394],[37.83997,-86.63078],[37.8373,-86.64452],[37.84599,-86.65921],[37.85507,-86.66194],[37.90487,-86.64755],[37.91106,-86.65596],[37.90927,-86.6783],[37.89154,-86.72466],[37.90718,-86.74741],[37.98659,-86.7959],[37.99756,-86.82141],[37.97533,-86.86572],[37.9396,-86.91391],[37.92559,-86.98703],[37.89378,-87.03621],[37.84431,-87.0449],[37.7992,-87.06343],[37.78045,-87.10792],[37.77926,-87.12632],[37.83193,-87.15628],[37.85808,-87.25066],[37.88244,-87.27686],[37.94155,-87.40305],[37.93824,-87.4379],[37.90536,-87.49738],[37.90684,-87.55331],[37.91183,-87.57043],[37.93009,-87.58418],[37.96696,-87.57679],[37.9727,-87.59479],[37.933,-87.61943],[37.92077,-87.62031],[37.90337,-87.61043],[37.88295,-87.58235],[37.85953,-87.58446],[37.8343,-87.60764],[37.82483,-87.62687],[37.82185,-87.66069],[37.82508,-87.67326],[37.84202,-87.68678],[37.88335,-87.66623],[37.8976,-87.67173],[37.89637,-87.69593],[37.87409,-87.76151],[37.87522,-87.82416],[37.92628,-87.89166],[37.92157,-87.90292],[37.89384,-87.92641],[37.88377,-87.92807],[37.81236,-87.90178],[37.79293,-87.92937],[37.77246,-87.94735],[37.79051,-87.99614],[37.7848,-88.02273],[37.72966,-88.06364],[37.71034,-88.10579],[37.67032,-88.14654],[37.64909,-88.15379],[37.57565,-88.12752],[37.53595,-88.07551],[37.50757,-88.05931],[37.48006,-88.07084],[37.47027,-88.09637],[37.44321,-88.29639],[37.42713,-88.32836],[37.40231,-88.35748],[37.42085,-88.41336],[37.39981,-88.45444],[37.38373,-88.47182],[37.33712,-88.48168],[37.27993,-88.50833],[37.24914,-88.49695],[37.22031,-88.45363],[37.1516,-88.41631],[37.12327,-88.42221],[37.07205,-88.46672],[37.05624,-88.50722],[37.06498,-88.55853],[37.1071,-88.61768],[37.13645,-88.70809],[37.1368,-88.72835],[37.18767,-88.81238],[37.22523,-88.95201],[37.21464,-89.0079],[37.16153,-89.07688],[37.11922,-89.0995],[37.09611,-89.13211],[37.05455,-89.16783],[37.01888,-89.17265],[36.98823,-89.13643],[36.97808,-89.17097],[36.98643,-89.18369],[37.01441,-89.1965],[37.03369,-89.22708],[37.0821,-89.26295],[37.08619,-89.28067],[37.08065,-89.29244],[37.06462,-89.30574],[37.04753,-89.3023],[37.02477,-89.26229],[37.00662,-89.25913],[36.99468,-89.28096],[37.0394,-89.37293],[37.05364,-89.38398],[37.08865,-89.37335],[37.19561,-89.4621],[37.24898,-89.45867],[37.25359,-89.49841],[37.28,-89.51589],[37.31712,-89.50511],[37.32933,-89.48092],[37.33733,-89.43412],[37.38249,-89.422],[37.45031,-89.4404],[37.49152,-89.48743],[37.52864,-89.50915],[37.58339,-89.52262],[37.62082,-89.50766],[37.69694,-89.51672],[37.75344,-89.66805],[37.79681,-89.67416],[37.81524,-89.70633],[37.85842,-89.74647],[37.88658,-89.81484],[37.9164,-89.86193],[37.8804,-89.90461],[37.88782,-89.93795],[37.92183,-89.97585],[37.94113,-89.97041],[37.96261,-89.94726],[37.96928,-89.95138],[37.96289,-89.96627],[37.96259,-89.98976],[38.00486,-90.04155],[38.023,-90.09886],[38.0666,-90.1284],[38.0684,-90.17188],[38.11689,-90.24389],[38.16815,-90.28701],[38.18476,-90.32203],[38.2268,-90.35582],[38.28974,-90.37138],[38.33033,-90.36543],[38.36977,-90.3494],[38.43153,-90.29079],[38.50703,-90.2667],[38.57265,-90.22253],[38.59584,-90.18943]];

const EXP3_STATS = {
  legsFlown:    13,
  distanceNM:   969,
  totalNM:      4029,    // canonical reference total (full polyline length)
  progressPct:  24,
  statusBadge:  "In Progress",
  updatedDate:  "May 20, 2026 11:49 PM MT"
};

// ── AIRPORT_CUM_NM — cumulative NM from Pittsburgh per airport ──
// Computed once via snap-to-nearest-vertex on the 5-segment route polyline,
// then sum of haversines from index 0 to that vertex. New leg's distance:
//   AIRPORT_CUM_NM[arr] - AIRPORT_CUM_NM[dep]
// To add a candidate airport, ask Claude to "add CODE to AIRPORT_CUM_NM"
// — Claude snaps it, flags if >10 NM off-route, and updates this block.
const AIRPORT_CUM_NM = {
  "31D":  0,    // off-route start (snap 12.5 NM); leg 1 distance is along-route only
  "1G8":  37,
  "75D":  108,
  "I41":  262,
  "KLUK": 387,
  "4KT4": 429,
  "KJVY": 495,
  "KY8":  623,
  "KEHR": 672,
  "M30":  788,
  "KCIR": 821,  // snap [37.03369, -89.22708], 1.86 NM off-route
  "12LL": 874.3,  // Lambdins Field, Wolf Lake IL; actual coords 37.5403, -89.4864; snap [37.52864, -89.50915], 1.29 NM off-route
  "KPCD": 909.8,  // Perryville Regional, MO
  "6MO2": 922.9,  // Ste. Genevieve Flying Club, MO
  "KFES": 943.9,  // Festus Memorial, MO
  "27LL": 952.7,  // Sullivan Field, Valmeyer IL
  "H49":  957.3,  // Sackman Field (IL91), Columbia IL
  "7IS9": 962.0,  // King Airport, IL
  "KCPS": 968.5,  // St. Louis Downtown (Cahokia), IL
  "1H0":  1009.3, // Creve Coeur, MO
  "02K":  1012.4, // Arrowhead, MO
  "KSUS": 1015.9, // Spirit of St. Louis, MO
  "KFYG": 1038.8  // Washington Regional, MO
};

// ── LEG_NOTES — verified facts + summary of what the leg post covered ──
// For each leg slug:
//   facts:   verified historical research used in the historical section.
//            Add new entries when researching a new leg so they don't need
//            re-researching next session.
//   covered: 1–2 sentences on what the journal + photos + historical
//            narrative ACTUALLY SAID. Read by Claude before writing the
//            next leg to avoid repetition and enable callbacks.
const LEG_NOTES = {
  "leg-01": {
    facts: "Lewis departs Pittsburgh Aug 31 1803; river at 4-year low; Brunot Island air gun incident (woman's hat, not killed); horses/oxen to drag boat over ripples; Georgetown PA pirogue leaked, bought canoe $11 (it also leaked); State line PA/Virginia marked by 60ft felled timber corridor; Sep 5 camped Brown's Island opposite Weirton WV (= Toronto OH = 1G8).",
    covered: ""
  },
  "leg-02": {
    facts: "Grave Creek Mound at Moundsville WV — largest surviving Adena burial mound in the US, ~69ft tall, ~295ft diameter, built 250-150 BCE; Wheeling WV was a significant river town by 1803; Steubenville OH across river. Lewis passed this stretch early September 1803.",
    covered: ""
  },
  "leg-03": {
    facts: "Ohio River valley fog common in autumn mornings; Lewis traveling Sept 11-20 1803; West Virginia ends, Kentucky begins on left bank; Huntington WV area — river widens; Corps making steady progress downstream.",
    covered: ""
  },
  "leg-04": {
    facts: "Lewis arrived Cincinnati Sep 28 1803; stayed ~1 week; sent crew by boat Oct 1; rode overland ~17 miles to Big Bone Lick Oct 4; fossils were mastodon/mammoth (Ice Age mammals) NOT dinosaurs; owner David Ross halted collection; Dr. Goforth provided specimens; fossils shipped downriver but boat sank in Mississippi at Natchez — Jefferson never received them; Clark returned 1807 for formal excavation. 1812 Cincinnati-from-Newport image: https://upload.wikimedia.org/wikipedia/commons/5/53/Cincinnati_I.jpg",
    covered: ""
  },
  "leg-05": {
    facts: "Big Bone Lick near Warsaw KY — where Lewis collected mastodon fossils for Jefferson Oct 4 1803. Warsaw KY / Steele's Bottom area. Ohio River bends sharply southward here.",
    covered: ""
  },
  "leg-06": {
    facts: "Clark's Grant — 150,000 acres on north side of Ohio below the Falls, granted by Virginia in 1781 to Brig. Gen. George Rogers Clark and his Illinois Regiment for capturing Kaskaskia and Vincennes; Clarksville reserved as 1,000-acre town — one of first American settlements north of the Ohio; George Rogers Clark was William Clark's older brother (born 1752, 18 years senior); by 1803 GRC living near the Falls running a gristmill, never compensated for campaign debts; Lewis arrived mid-October 1803, met Clark + nine Kentucky recruits + York (Clark's enslaved manservant); Corps of Discovery took final shape at Clarksville; Falls of the Ohio = ~2 miles of limestone rapids, ~26ft drop, required local pilot or portage; Louisville on KY side, Clarksville on IN side.",
    covered: ""
  },
  "leg-07": {
    facts: "Horseshoe Bend near Leavenworth IN is on-route; Cannelton Hydroelectric Plant at Cannelton Locks and Dam (Army Corps, 1960s), 88 MW; Clark's Cabin replica at Old Clarksville Site burned May 2021 — site still open as Falls of the Ohio State Park; Lewisport KY named after settler John Lewis (not Meriwether); airport officially 'Hancock County / Ron Lewis Field' (named after Congressman Ron Lewis, not Meriwether Lewis); Corps departed Clarksville Oct 26 1803; York joined as full expedition participant; 'Little Yellow Banks' = historic name for the Lewisport area; Oct 29-30 the Corps was passing through present-day Lewisport stretch.",
    covered: ""
  },
  "leg-08": {
    facts: "Ellis Island (near Owensboro) and French Island No. 1 & No. 2 are real Ohio River islands between Lewisport and Henderson — popular boating spots; pilot uses 'Lewis Field' as intentional expedition flavor (airport is officially Ron Lewis Field, named after Congressman Ron Lewis); Owensboro = 'Yellow Banks,' settled in the 1790s, not a town in 1803; Evansville IN not founded until 1812 (Hugh McGary Jr. purchased land March 27 1812); Henderson KY founded 1797 — WAS an established town when L&C passed through, laid out April 6 1797 by Gen. Samuel Hopkins for the Transylvania Company, named for Col. Richard Henderson; Oct 30-Nov 2 1803 timeframe for this stretch.",
    covered: "Calm-evening departure from Lewis Field; flyover of Ellis Island and French Islands as river-island flavor; passed Owensboro and Evansville with note that neither were towns in 1803 (Yellow Banks settlers only, Evansville not founded until 1812); landing video at Henderson. Historical section: contrasted Owensboro/Evansville (barely settled or nonexistent) with Henderson (already 6 years old in 1803), traced Henderson naming through Col. Richard Henderson and the Transylvania Co. / Daniel Boone Wilderness Road connection."
  },
  "leg-09": {
    facts: "Diamond Island, Henderson County KY (37.880, -87.764) — late-1700s river-pirate hideout. Most notorious: Samuel Mason's gang (1797) and the Harpe Brothers (serial killers). 1803 Diamond Island Massacre — Barnard family from Virginia ambushed by ten Native Americans hidden in canebrake after son James shot a deer; parents killed, three younger children disappeared, James escaped. Samuel Mason was captured early 1803 and died before trial. Lewis & Clark camped at Diamond Island Nov 5, 1803 per ArcGIS L&C campsite dataset; no journal entry (Lewis silent Sept 18–Nov 11 1803). Fort Massac, IL — Lewis & Clark arrived Nov 11 1803, departed Nov 13. Recruited THREE: George Drouillard (civilian interpreter/hunter, French-Canadian & Shawnee parentage, became most-relied-on Corps member after captains, hired at $25/mo); Joseph Whitehouse (enlisted soldier, made full round trip, kept an enlisted-man journal); John Newman (enlisted soldier, later court-martialed at Fort Mandan fall 1804 and sent back with the keelboat spring 1805). Slavery context for 1803: Kentucky a slave state since 1792 (15th state); right bank in 1803 was Indiana Territory (Illinois Territory not created until 1809; Illinois statehood 1818 as free state); Northwest Ordinance of 1787 banned slavery north of the Ohio but Territorial Gov. William Henry Harrison was openly campaigning to legalize it, and a system of 'indentured servitude' kept de facto enslaved labor in much of the territory; Louisiana Purchase finalized 1803 — the slave/free question of new western land would dominate US politics until the Civil War; York (William Clark's enslaved man) was on the expedition, first known African American to reach the Pacific. Wabash River = lower stretch is the IN/IL boundary. M30 = Metropolis Municipal Airport, dedicated 1947. Keelboat/flatboat image: https://upload.wikimedia.org/wikipedia/commons/b/b2/Keelboat_and_flatboat.jpg . 1800 slave/free map: https://upload.wikimedia.org/wikipedia/commons/0/0a/US_SlaveFree1800.gif",
    covered: "Re-entry from family-visit layover at Henderson; Diamond Island flyover with river-pirate history and the Nov 5, 1803 L&C campsite; Wabash River crossing into Illinois; reflection on the Ohio as the slave/free boundary in 1803 with a Wikimedia map of 1800 state/territory status; landing at Metropolis (near Fort Massac). Historical section: Diamond Island pirate history (Mason, Harpe Brothers, 1803 Barnard family massacre) with Wikimedia keelboat-and-flatboat image; Fort Massac recruits — Drouillard, Whitehouse, Newman, with the note that Newman was later court-martialed; slavery context for 1803 covering Kentucky's slave-state status, Indiana Territory and the Northwest Ordinance, Harrison's pro-slavery campaign and indentured servitude, the Louisiana Purchase, and York's presence on the Corps."
  },
  "leg-10": {
    facts:   "Corps departed Fort Massac Nov 13, 1803; arrived mouth of Ohio (Cairo confluence) Nov 14; camped Nov 14–19 (nearly a week) taking celestial observations and fixing position; Cairo, IL sits on peninsula between Ohio and Mississippi Rivers; Corps faced upstream Mississippi travel from here north to St. Louis; this area marks entry into Louisiana Purchase territory (Mississippi River was the eastern boundary); Huck Finn connection: Cairo is where Huck and Jim planned to transfer to Ohio River steamboat to reach a free state, but missed it in a foggy night. KCIR actual coords 37.0641, -89.2195; snap vertex [37.03369, -89.22708], 1.86 NM off-route.",
    covered: "Short evening hop from Metropolis to Cairo; first photo shows Ohio/Mississippi confluence with Cairo to the right; Huck Finn connection — Huck and Jim planned to stop at Cairo and catch an Ohio River steamboat to freedom but missed it in fog; second photo shows Mississippi River and KCIR; Lewis and Clark note on the shift from downstream Ohio to upstream Mississippi travel, with St. Louis and the Missouri River as the next milestone; rough landing account — headwind, slow approach, crosswind, rudder losing effectiveness, drift off runway, stall and bounce, nearly clipped wing, kept aircraft in one piece; landing video at KCIR."
  },
  "leg-11": {
    facts:   "Corps departed Cairo confluence Nov 20, 1803 — first upstream travel of the expedition; took 4 hard days fighting Mississippi current to reach Cape Girardeau on Nov 23; camps along the way: Nov 20 left shore ~6 mi up Mississippi IL; Nov 21 island, ~3 mi SE of Lusk; Nov 22 left bank ~3 mi S of Thebes IL; Nov 23 right bank at Old Cape Girardeau (Cape Rock); Nov 24 right bank S of Neelys Landing MO. Cape Girardeau in 1803: Spanish military district run by Commandant Louis Lorimier (French-Canadian, b. Montreal March 1748). Name origin: French soldier Ensign/Sgt Jean Baptiste de Girardot established a short-lived trading post on the rocky promontory above the river around 1733 — the 'cape' was later destroyed by railroad construction. Lorimier received 6,000-acre Spanish land grant 1793 just south of Girardot's original site; established 'Old Cape Girardeau' c.1793 then moved 2 mi downriver to 'New Cape Girardeau'; large band of Shawnee followed him from Ohio. Town not formally incorporated until 1808. Lorimier's 'Red House' trading post was reputed to be the largest between St. Louis and Memphis; replica rebuilt 2003 as Red House Interpretive Center, downtown Cape Girardeau (original destroyed by 1850 tornado). Lewis's Nov 23 1803 journal entry is one of his longest of the downriver passage: describes Lorimier ~60 yrs old, ~5'8\", dark hair worn in a single braid 'nearly as low as his knees' confined by a leather girdle at the waist; wife Charlotte Pemanpieh Bougainville was Shawnee, 'dresses after the Shawnee manner'; daughter was 'much the most descent looking feemale' Lewis had seen since leaving Kentucky 'a little below Louisville.' Lorimier was at a horse race when Lewis arrived. Big backstory: in the early 1780s (Revolutionary War, ~1782) William Clark's older brother Gen. George Rogers Clark led the raid that burned Lorimier's Ohio trading post (Loramie's Station on a branch of the Great Miami River) — Lorimier estimated his losses at $20,000. Despite this Lorimier 'treated me with much politeness in his way.' Clark was ill on Nov 23 and took the boats upriver to camp at Old Cape Girardeau (today Cape Rock Park) while Lewis visited Lorimier's home; one of Lorimier's sons later escorted Lewis on horseback to rejoin Clark. Lewis later secured West Point appointments for two of Lorimier's sons. Cape Girardeau modern population ~40,344 (2024 estimate, US Census) / ~41,334 (2026 World Population Review). Louisiana Purchase context: signed April 30 1803, US Senate ratified Oct 20 1803, formal New Orleans handover Dec 20 1803, upper Louisiana / St. Louis handover March 9-10 1804 — so when L&C reached Cape Girardeau on Nov 23 1803, the territory had been purchased on paper but Lorimier was still operating under Spanish authority. 12LL = Lambdins Field, grass strip near Wolf Lake IL on the Illinois (left) bank; AIRPORT_CUM_NM[12LL] = 874.3.",
    covered: "Continued up the Mississippi River with a tailwind, contrasting the pilot's easy flight with the Corps's hard upstream pull; many river islands visible from the air with rain clouds in the distance (primary photo); passed only a few small towns, the largest by far being Cape Girardeau MO (~40,000 today vs. only a handful of settlers in 1803); landing at Lambdins Field, a grass strip next to a farm on the Illinois side, with continued imperfect landing (bouncing and ground looping) captured in a video. Historical section: framed the upstream pivot from Cairo on Nov 20 1803 and the 4-day pull to Cape Girardeau; first non-American settlement of the expedition; origin of the name from Jean Baptiste de Girardot's c.1733 trading post; Commandant Louis Lorimier and the Red House; Lewis's detailed Nov 23 journal portrait of Lorimier (knee-length braided hair, Shawnee wife Charlotte, the horse race scene); the awkward backstory that William Clark's older brother George Rogers Clark had burned Lorimier's Ohio post during the Revolutionary War; St. Louis still about three weeks upstream."
  },
  "leg-12": {
    facts:   "Leg arrives Ste. Genevieve (6MO2, actual coords 37.9862,-90.0334; route snap [38.00486,-90.04155], cum 922.9). L&C dates Nov 25–Dec 5 1803. Corps turned up the Mississippi at the Ohio's mouth Nov 20 1803 — first upstream travel — and fought the current. Camps this stretch: Nov 25 opposite Grand Tower MO; Nov 26 ~2 mi NW of Seventysix MO; Nov 27 Horse Island near Chester IL; Nov 28 old Ste. Genevieve MO; Nov 29–Dec 5 Old Kaskaskia IL. GRAND TOWER / TOWER ROCK: ~90 ft limestone pillar; Marquette & Joliet raised a cross atop it in 1673 to ward off the whirlpool said to lurk at its base — one of the few genuinely treacherous spots on this stretch. FORT KASKASKIA: new American post built 1803 (Army leased 150 acres from Gen. John Edgar Sept 1803, 3-yr lease) to support the Louisiana handover; probably still under construction in Nov 1803. Garrison = Capt. Russell Bissell's infantry (1st, formerly 2nd, Inf. Regt.) + Capt. Amos Stoddard's artillery (~40 men). Lewis recruited ~11–12 enlisted men to complete the permanent party, incl. Patrick Gass (later sergeant; first to publish a journal of the expedition), John Ordway, and John Collins; Lewis wrote Jefferson he made 'a selection of a sufficient number of men… to complete my party.' KASKASKIA TOWN: political & commercial heart of the Illinois country, pop ~7,000 at 18th-c. peak (only ~467 by 1800); founded 1703 by Kaskaskia tribe + French Jesuits (Mission of the Immaculate Conception); territorial capital 1809; first Illinois STATE capital 1818 until capital moved to Vandalia 1819–20; captured July 4 1778 by George Rogers Clark (William Clark's older brother). CAPTAINS DIVIDE (first time): Clark took the boats upriver Dec 3; Lewis stayed at Kaskaskia until Dec 5 (astronomical obs Dec 2–3), left the boat in Clark's charge (start of Lewis's known daily-journal gap until Apr 1805), rode horseback to Cahokia (arr Dec 7), called on Spanish lt. gov. Delassus at St. Louis Dec 8, rejoined Clark at Cahokia Dec 9. Spain refused to permit ascent of the Missouri until spring → Corps wintered at the mouth of Wood River (Camp River Dubois) opposite the Missouri's mouth (camp begun Dec 12 1803). RIVER COURSE CHANGE: Kaskaskia originally sat on the EAST (Illinois) bank on a neck of land between the Mississippi and the Kaskaskia (Okaw) River. Floods 1785, 1844; river began shifting late 1860s and ate through the neck in the 1870s; great flood Apr 1881 broke across the neck and the Mississippi seized the lower ~10 mi of the Kaskaskia River, jumping >2 mi east and stranding the town on the WEST bank — the only part of Illinois west of the Mississippi (accessible only via Missouri, bridge near St. Mary MO / Chester IL). Primary cause per Wikipedia/NPS: 19th-c. deforestation of banks (wood cut to fuel steamboats & railroads) → erosion, widening/shoaling, channel jump. 2020 census pop 21 (3rd-least populous incorporated community in IL). Survivors: Immaculate Conception Church + Kaskaskia Bell ('Liberty Bell of the West,' gift of Louis XV 1741). STE. GENEVIEVE: oldest permanent European settlement in Missouri (French, c.1735); old Ste. Genevieve ~3 mi below modern town, relocated after the 1785 flood; pop ~1,000 by L&C time. HISTORICAL IMAGE: 'View of Kaskaskia, 1841' lithograph by J. C. Wild (public domain; from Wild & Thomas, The Valley of the Mississippi Illustrated, St. Louis: Chambers and Knapp, 1841) — embedded in historical section as local asset Expedition3/Legs/Leg12-KaskaskiaHistorical.jpg (user supplies the file).",
    covered: "Continued up the Mississippi with storms nearby and a rainbow behind the aircraft (primary photo), over nondescript farmland and river islands; centerpiece is Kaskaskia (photo, on the left wing west of the river) and how the L&C river route ran west of today's channel — the 1881 flood, driven by steamboat-era deforestation, shifted the Mississippi east and stranded Kaskaskia on the Missouri side. Recapped Kaskaskia as the first Illinois capital (~7,000 at peak → 21 in the 2020 census), the recruiting of 10+ men, and Lewis leaving the boat to Clark before catching up by horseback; landing at the Ste. Genevieve grass strip with a smooth-by-my-standards touchdown (landing video). Historical section ('A Week at the Lost Capital'): the upstream fight from the Ohio's mouth past Grand Tower/Tower Rock; Fort Kaskaskia (Bissell + Stoddard companies) and the ~11–12 recruits incl. Gass, Ordway, and Collins; the captains' first division (Clark upriver Dec 3, Lewis overland Dec 5 to Cahokia/St. Louis, Spain's 'not until spring,' winter at Camp Dubois, reunion Dec 9); and the river that later moved — deforestation, the 1881 channel jump, and the contrast between the wild braided 1803 river and today's engineered, dredged channel. Used the 1841 J. C. Wild lithograph of Kaskaskia."
  },
  "leg-13": {
    facts:   "Leg 13: 6MO2 → KCPS, 46 NM, May 30 2026, 0:40. Limestone quarries: Ste. Genevieve Limestone formation named for this area; US gov operated one of Missouri's largest quarries 2 mi north of Ste. Genevieve; 'St. Louis Limestone' extensively quarried in bluffs along the river; Jefferson Barracks had a quarry east of the Old Ordnance Room used to build its limestone buildings (Bussen Quarry just south, opened 1882). Lead smelter: Herculaneum MO (St. Joe Lead Co. / Doe Run) ~15 miles north of Ste. Genevieve — Missouri's lead smelting tradition dates to French colonial era; NOT 'just north' but directionally correct. KLUK (Lunken Airport, Leg 4) is a towered airport (Tower 118.7) — KCPS is not pilot's first towered landing. Camp Dubois: Clark established Dec 12, 1803 at Wood River mouth on Illinois side near Hartford IL; site chosen to remain in US territory — Upper Louisiana still Spanish until March 9, 1804 (Spain→France), then France→US March 10, 1804; exact camp location unknown due to river shifts. Cahokia Courthouse: built c. 1740, oldest building in Illinois; 107 Elm St Cahokia IL; Lewis used as headquarters Dec 1803–May 1804 for gathering information, meeting territorial leaders, corresponding with Jefferson, compiling maps; NPS significance: 'headquarters of Lewis & Clark from winter 1803 to spring 1804.' Nicholas Jarrot (Cahokia landowner) granted permission to camp on Wood River land. Camp Dubois departure May 14, 1804 — Lewis: 'The mouth of the River Dubois is to be considered as the point of departure.' Louisiana Purchase transfer document: 3 witnesses signed — Meriwether Lewis (US), Antoine Soulard (Spain), Charles Gratiot (France). Capt. Amos Stoddard represented France (and then US) at the ceremony. Historical image: LOC/Wikimedia transfer ceremony illustration LCCN2016648616 (public domain, 1904 photogravure of a painting, 'No known restrictions on publication'). St. Louis population 1804: ~1,000, mostly French-speaking Creole; became US territorial capital after transfer.",
    covered: "Evening departure from Ste. Genevieve up the Mississippi; observed limestone quarries in the bluffs (Ste. Genevieve Limestone formation, US government quarry north of town) and noted Herculaneum lead smelter to the north; photo of Jefferson Barracks limestone quarry; landed KCPS (Cahokia IL). Primary photo: Gateway Arch flyby before landing. Noted ground looping on landing. Videos: landing at KCPS and bonus St. Louis flyby. Historical section ('The Winter That Opened the West'): Clark establishes Camp Dubois Dec 12 1803 on Illinois side to remain in US territory; Louisiana Purchase context — signed April 1803, New Orleans transferred Dec 1803, Upper Louisiana transferred March 9–10 1804 in St. Louis ceremony; Lewis as witness/signatory on transfer document (with Soulard and Gratiot); Lewis's role at Cahokia Courthouse as HQ — gathering intelligence, meeting traders, writing Jefferson; Clark's role training and organizing at Camp Dubois; LOC transfer ceremony illustration (LCCN2016648616); departure May 14 1804 up the Missouri."
  }
};
