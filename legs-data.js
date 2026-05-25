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
    date: "May 20, 2026",
    thumb: "Expedition3/Legs/Leg13-Arch.png",
    post: "Expedition3/Legs/leg-13.html",
    slug: "leg-13",
    lcDates: "Dec 5, 1803 – May 14, 1804",
    nm: 46,
    duration: "0:40"
  },
  {
    lat: 38.7267,
    lng: -90.5083,
    label: "Leg 14: The Third River",
    location: "KCPS → 1H0 · Cahokia IL to Creve Coeur MO",
    date: "May 21, 2026",
    thumb: "Expedition3/Legs/Leg14-Confluence.png",
    post: "Expedition3/Legs/leg-14.html",
    slug: "leg-14",
    lcDates: "May 14–21, 1804",
    nm: 41,
    duration: "0:35"
  },
  {
    lat: 38.6689,
    lng: -91.536,
    label: "Leg 15: Beyond the Last Village",
    location: "1H0 → MU68 · Creve Coeur MO to Hermann MO",
    date: "May 22, 2026",
    thumb: "Expedition3/Legs/Leg15-Sunrise.png",
    post: "Expedition3/Legs/leg-15.html",
    slug: "leg-15",
    lcDates: "May 22–25, 1804",
    nm: 59,
    duration: "0:41"
  },
  {
    lat: 38.5911,
    lng: -92.1561,
    label: "Leg 16: The River of the Osage",
    location: "MU68 → KJEF · Hermann MO to Jefferson City MO",
    date: "May 23, 2026",
    thumb: "Expedition3/Legs/Leg16-Osage.png",
    post: "Expedition3/Legs/leg-16.html",
    slug: "leg-16",
    lcDates: "May 26 – June 3, 1804",
    nm: 31,
    duration: "0:25"
  },
  {
    lat: 39.27468,
    lng: -93.3552,
    label: "Leg 17: An Eventful Passage",
    location: "KJEF \u2192 71MO \u00b7 Jefferson City MO to Wakenda MO",
    date: "May 23, 2026",
    thumb: "Expedition3/Legs/Leg17-JeffersonCity.png",
    post: "Expedition3/Legs/leg-17.html",
    slug: "leg-17",
    lcDates: "June 4\u201315, 1804",
    nm: 103,
    duration: "1:12"
  },
  {
    lat: 39.12294,
    lng: -94.59283,
    label: "Leg 18: A Fine Place for a Fort",
    location: "71MO \u2192 KMKC \u00b7 Wakenda MO to Kansas City MO",
    date: "May 24, 2026",
    thumb: "Expedition3/Legs/Leg18-Sunrise.png",
    post: "Expedition3/Legs/leg-18.html",
    slug: "leg-18",
    lcDates: "June 16\u201329, 1804",
    nm: 81,
    duration: "0:52"
  }
];

// Completed route coordinates — updated through Leg 18 (KMKC)
const COMPLETED_COORDS = [[40.44314,-80.01276],[40.44789,-80.02704],[40.47595,-80.0492],[40.48886,-80.06692],[40.53125,-80.18042],[40.55829,-80.21523],[40.59423,-80.23745],[40.63747,-80.23632],[40.67938,-80.25531],[40.69438,-80.28367],[40.61874,-80.44544],[40.63608,-80.49155],[40.62982,-80.53399],[40.61554,-80.5796],[40.62351,-80.60076],[40.61863,-80.62227],[40.58978,-80.66209],[40.58038,-80.665],[40.53482,-80.62848],[40.47727,-80.59805],[40.40714,-80.61153],[40.39418,-80.62613],[40.38069,-80.61015],[40.35527,-80.61073],[40.32471,-80.60069],[40.27459,-80.61395],[40.25869,-80.62755],[40.24606,-80.65069],[40.20496,-80.66754],[40.14712,-80.70588],[40.11116,-80.70599],[40.0799,-80.73232],[40.05843,-80.72687],[39.97548,-80.73768],[39.96066,-80.75513],[39.94751,-80.76125],[39.91896,-80.75513],[39.91133,-80.75788],[39.90895,-80.76402],[39.9182,-80.78693],[39.9182,-80.80057],[39.90898,-80.80639],[39.86812,-80.79142],[39.85061,-80.81509],[39.83765,-80.82264],[39.80755,-80.82149],[39.76885,-80.86716],[39.71612,-80.83035],[39.69265,-80.85947],[39.62362,-80.87663],[39.61637,-80.91786],[39.59619,-80.95812],[39.55266,-81.02302],[39.50403,-81.07929],[39.44899,-81.12187],[39.43148,-81.17605],[39.38969,-81.21087],[39.37924,-81.2784],[39.34542,-81.34784],[39.344,-81.37545],[39.35665,-81.39441],[39.3829,-81.40885],[39.40744,-81.43022],[39.40672,-81.45934],[39.3647,-81.50995],[39.35488,-81.53822],[39.34077,-81.55025],[39.27054,-81.56185],[39.27481,-81.66826],[39.26084,-81.69317],[39.2331,-81.6965],[39.22391,-81.70347],[39.2025,-81.73596],[39.17322,-81.76405],[39.14529,-81.75084],[39.0932,-81.75367],[39.08144,-81.77521],[39.08344,-81.8042],[39.07478,-81.81417],[39.04773,-81.80824],[39.01589,-81.77518],[38.99091,-81.77243],[38.97485,-81.78576],[38.96198,-81.7894],[38.93768,-81.76221],[38.92781,-81.76019],[38.92249,-81.76805],[38.92384,-81.77977],[38.94377,-81.80702],[38.94529,-81.82799],[38.9293,-81.84537],[38.89173,-81.859],[38.88119,-81.8698],[38.87614,-81.88621],[38.87899,-81.91147],[38.88605,-81.92338],[38.90085,-81.92607],[38.92396,-81.90775],[38.93588,-81.90594],[38.95194,-81.91072],[38.99302,-81.9582],[38.99484,-81.97888],[39.02607,-82.00578],[39.02696,-82.02446],[39.01754,-82.03641],[38.97263,-82.08475],[38.89752,-82.13728],[38.83533,-82.14728],[38.80058,-82.20466],[38.78784,-82.21647],[38.77799,-82.21576],[38.75316,-82.19413],[38.7124,-82.18165],[38.68211,-82.18676],[38.63269,-82.17285],[38.61219,-82.1734],[38.59208,-82.19356],[38.59056,-82.27445],[38.57579,-82.2866],[38.46207,-82.31708],[38.43889,-82.34027],[38.43265,-82.42407],[38.40121,-82.53522],[38.40417,-82.56788],[38.41979,-82.59502],[38.46603,-82.61338],[38.49324,-82.6545],[38.54631,-82.70908],[38.56996,-82.81178],[38.58545,-82.83694],[38.68285,-82.87647],[38.72908,-82.87571],[38.74554,-82.89005],[38.75184,-82.91094],[38.72763,-82.97947],[38.7263,-83.02406],[38.68929,-83.06129],[38.66978,-83.1095],[38.62972,-83.14011],[38.61841,-83.15873],[38.61797,-83.19506],[38.62849,-83.22958],[38.61844,-83.2615],[38.59864,-83.28499],[38.60021,-83.29775],[38.63769,-83.33652],[38.64939,-83.35753],[38.6611,-83.39825],[38.66878,-83.45332],[38.696,-83.50072],[38.69931,-83.5212],[38.68173,-83.61367],[38.67316,-83.62423],[38.63148,-83.64866],[38.62817,-83.67506],[38.65072,-83.76142],[38.70287,-83.79976],[38.71245,-83.83389],[38.73643,-83.84719],[38.75515,-83.8664],[38.78434,-83.96084],[38.77077,-84.04955],[38.77218,-84.09223],[38.80983,-84.21902],[38.82544,-84.23016],[38.89125,-84.24053],[38.95295,-84.28747],[38.99463,-84.30384],[39.01474,-84.32173],[39.03073,-84.34933],[39.05136,-84.42044],[39.06498,-84.43418],[39.10733,-84.43916],[39.11775,-84.46426],[39.10994,-84.48564],[39.08921,-84.51774],[39.09296,-84.55289],[39.07765,-84.58313],[39.06967,-84.63052],[39.10207,-84.70212],[39.13662,-84.73409],[39.14108,-84.74926],[39.12024,-84.77971],[39.09844,-84.83514],[39.06246,-84.88908],[39.0535,-84.89384],[38.99669,-84.85098],[38.97141,-84.83956],[38.96096,-84.84062],[38.92952,-84.86909],[38.91153,-84.87677],[38.90253,-84.86517],[38.89921,-84.81634],[38.88615,-84.79292],[38.87129,-84.78671],[38.85629,-84.79],[38.83468,-84.8236],[38.79797,-84.81284],[38.78842,-84.82382],[38.79247,-84.87809],[38.77618,-84.93756],[38.77078,-84.99798],[38.68491,-85.16838],[38.68445,-85.19756],[38.69257,-85.21846],[38.7314,-85.25228],[38.73728,-85.28292],[38.72698,-85.37384],[38.73089,-85.41633],[38.72464,-85.43987],[38.71313,-85.44959],[38.69331,-85.45511],[38.65294,-85.43645],[38.61752,-85.44103],[38.56828,-85.4184],[38.5361,-85.41672],[38.52491,-85.42823],[38.50648,-85.46643],[38.46267,-85.50446],[38.44148,-85.59972],[38.41454,-85.62043],[38.33072,-85.64647],[38.3055,-85.66821],[38.28811,-85.69209],[38.26281,-85.74354],[38.28043,-85.78746],[38.27821,-85.816],[38.26573,-85.8362],[38.22797,-85.85015],[38.17445,-85.90321],[38.15278,-85.9093],[38.10239,-85.90909],[38.03532,-85.9218],[38.01256,-85.93771],[38.00553,-85.94963],[37.99354,-86.01924],[37.9804,-86.03223],[37.96008,-86.03586],[37.96176,-86.04991],[38.00022,-86.08501],[38.01151,-86.10647],[38.01496,-86.13251],[38.00926,-86.1821],[38.04988,-86.25929],[38.06818,-86.2738],[38.09599,-86.28129],[38.13578,-86.27428],[38.15066,-86.28433],[38.19608,-86.36145],[38.18964,-86.37281],[38.18064,-86.37648],[38.1662,-86.37092],[38.15583,-86.32705],[38.14491,-86.32156],[38.13564,-86.32632],[38.12902,-86.33875],[38.12479,-86.38042],[38.10675,-86.39328],[38.10483,-86.40427],[38.12407,-86.43794],[38.12072,-86.45857],[38.11409,-86.46455],[38.10884,-86.46308],[38.0877,-86.4326],[38.06972,-86.43005],[38.04987,-86.45205],[38.03788,-86.51614],[37.95718,-86.51974],[37.94479,-86.50717],[37.93225,-86.50335],[37.91692,-86.52406],[37.91885,-86.57198],[37.91344,-86.59101],[37.90214,-86.59594],[37.86966,-86.59667],[37.85932,-86.60394],[37.83997,-86.63078],[37.8373,-86.64452],[37.84599,-86.65921],[37.85507,-86.66194],[37.90487,-86.64755],[37.91106,-86.65596],[37.90927,-86.6783],[37.89154,-86.72466],[37.90718,-86.74741],[37.98659,-86.7959],[37.99756,-86.82141],[37.97533,-86.86572],[37.9396,-86.91391],[37.92559,-86.98703],[37.89378,-87.03621],[37.84431,-87.0449],[37.7992,-87.06343],[37.78045,-87.10792],[37.77926,-87.12632],[37.83193,-87.15628],[37.85808,-87.25066],[37.88244,-87.27686],[37.94155,-87.40305],[37.93824,-87.4379],[37.90536,-87.49738],[37.90684,-87.55331],[37.91183,-87.57043],[37.93009,-87.58418],[37.96696,-87.57679],[37.9727,-87.59479],[37.933,-87.61943],[37.92077,-87.62031],[37.90337,-87.61043],[37.88295,-87.58235],[37.85953,-87.58446],[37.8343,-87.60764],[37.82483,-87.62687],[37.82185,-87.66069],[37.82508,-87.67326],[37.84202,-87.68678],[37.88335,-87.66623],[37.8976,-87.67173],[37.89637,-87.69593],[37.87409,-87.76151],[37.87522,-87.82416],[37.92628,-87.89166],[37.92157,-87.90292],[37.89384,-87.92641],[37.88377,-87.92807],[37.81236,-87.90178],[37.79293,-87.92937],[37.77246,-87.94735],[37.79051,-87.99614],[37.7848,-88.02273],[37.72966,-88.06364],[37.71034,-88.10579],[37.67032,-88.14654],[37.64909,-88.15379],[37.57565,-88.12752],[37.53595,-88.07551],[37.50757,-88.05931],[37.48006,-88.07084],[37.47027,-88.09637],[37.44321,-88.29639],[37.42713,-88.32836],[37.40231,-88.35748],[37.42085,-88.41336],[37.39981,-88.45444],[37.38373,-88.47182],[37.33712,-88.48168],[37.27993,-88.50833],[37.24914,-88.49695],[37.22031,-88.45363],[37.1516,-88.41631],[37.12327,-88.42221],[37.07205,-88.46672],[37.05624,-88.50722],[37.06498,-88.55853],[37.1071,-88.61768],[37.13645,-88.70809],[37.1368,-88.72835],[37.18767,-88.81238],[37.22523,-88.95201],[37.21464,-89.0079],[37.16153,-89.07688],[37.11922,-89.0995],[37.09611,-89.13211],[37.05455,-89.16783],[37.01888,-89.17265],[36.98823,-89.13643],[36.97808,-89.17097],[36.98643,-89.18369],[37.01441,-89.1965],[37.03369,-89.22708],[37.0821,-89.26295],[37.08619,-89.28067],[37.08065,-89.29244],[37.06462,-89.30574],[37.04753,-89.3023],[37.02477,-89.26229],[37.00662,-89.25913],[36.99468,-89.28096],[37.0394,-89.37293],[37.05364,-89.38398],[37.08865,-89.37335],[37.19561,-89.4621],[37.24898,-89.45867],[37.25359,-89.49841],[37.28,-89.51589],[37.31712,-89.50511],[37.32933,-89.48092],[37.33733,-89.43412],[37.38249,-89.422],[37.45031,-89.4404],[37.49152,-89.48743],[37.52864,-89.50915],[37.58339,-89.52262],[37.62082,-89.50766],[37.69694,-89.51672],[37.75344,-89.66805],[37.79681,-89.67416],[37.81524,-89.70633],[37.85842,-89.74647],[37.88658,-89.81484],[37.9164,-89.86193],[37.8804,-89.90461],[37.88782,-89.93795],[37.92183,-89.97585],[37.94113,-89.97041],[37.96261,-89.94726],[37.96928,-89.95138],[37.96289,-89.96627],[37.96259,-89.98976],[38.00486,-90.04155],[38.023,-90.09886],[38.0666,-90.1284],[38.0684,-90.17188],[38.11689,-90.24389],[38.16815,-90.28701],[38.18476,-90.32203],[38.2268,-90.35582],[38.28974,-90.37138],[38.33033,-90.36543],[38.36977,-90.3494],[38.43153,-90.29079],[38.50703,-90.2667],[38.57265,-90.22253],[38.59584,-90.18943],[38.63805,-90.17806],[38.66763,-90.18499],[38.70648,-90.20571],[38.72844,-90.20429],[38.74624,-90.17984],[38.76654,-90.16732],[38.79313,-90.12302],[38.81567,-90.11489],[38.83327,-90.11973],[38.83336,-90.11948],[38.84448,-90.12503],[38.84638,-90.13683],[38.83534,-90.17281],[38.83458,-90.20269],[38.85228,-90.25485],[38.87494,-90.28816],[38.87912,-90.31101],[38.87646,-90.33290],[38.84181,-90.37421],[38.82164,-90.38715],[38.80336,-90.42541],[38.79251,-90.46938],[38.75063,-90.49032],[38.73293,-90.52554],[38.73255,-90.52585],[38.68915,-90.56152],[38.68534,-90.6034],[38.6941,-90.63404],[38.67316,-90.71152],[38.6644,-90.72484],[38.59035,-90.77243],[38.55799,-90.81165],[38.55285,-90.83392],[38.56599,-90.85885],[38.56656,-90.87256],[38.55628,-90.91406],[38.53819,-90.93214],[38.54257,-90.95746],[38.56332,-91.01],[38.58198,-91.0376],[38.60368,-91.05264],[38.60958,-91.06558],[38.60368,-91.12002],[38.61986,-91.15905],[38.62043,-91.20987],[38.63033,-91.2449],[38.66859,-91.27193],[38.70761,-91.32999],[38.71009,-91.35093],[38.70609,-91.38253],[38.71161,-91.40956],[38.70685,-91.46533],[38.67734,-91.5508],[38.68858,-91.60125],[38.70114,-91.6239],[38.70438,-91.64027],[38.69372,-91.76077],[38.68534,-91.77828],[38.66935,-91.84643],[38.66059,-91.84947],[38.64137,-91.88754],[38.60139,-91.94351],[38.59054,-91.97796],[38.56618,-92.01527],[38.5578,-92.06172],[38.55913,-92.09465],[38.57284,-92.14567],[38.59454,-92.18964],[38.66364,-92.26883],[38.65774,-92.29167],[38.65888,-92.30937],[38.68667,-92.3583],[38.72684,-92.39161],[38.74549,-92.38913],[38.77595,-92.3977],[38.80945,-92.39789],[38.83591,-92.41122],[38.85837,-92.43406],[38.86389,-92.45976],[38.87341,-92.47308],[38.8974,-92.48203],[38.90539,-92.50563],[38.9151,-92.51877],[38.94575,-92.52771],[38.97183,-92.56217],[38.98154,-92.59738],[38.97411,-92.63298],[38.9783,-92.68666],[38.98648,-92.69675],[38.98915,-92.71426],[38.97221,-92.78527],[38.97868,-92.83476],[38.99391,-92.87416],[39.01142,-92.88311],[39.02208,-92.89263],[39.02779,-92.90576],[39.075,-92.93908],[39.09004,-92.92118],[39.1007,-92.91566],[39.11764,-92.91528],[39.13782,-92.93241],[39.1519,-92.93013],[39.1658,-92.90348],[39.20768,-92.86179],[39.21986,-92.85227],[39.24213,-92.85303],[39.24423,-92.86446],[39.23528,-92.8755],[39.23585,-92.88692],[39.24918,-92.90748],[39.25603,-92.93546],[39.26517,-92.94498],[39.29562,-92.95316],[39.31371,-92.99961],[39.33465,-93.02816],[39.36682,-93.04206],[39.36396,-93.05329],[39.34778,-93.06852],[39.34759,-93.09346],[39.37081,-93.10583],[39.38642,-93.12601],[39.40851,-93.13248],[39.41574,-93.13952],[39.41212,-93.15285],[39.3988,-93.16065],[39.39004,-93.19796],[39.38147,-93.21281],[39.36701,-93.22004],[39.33598,-93.22423],[39.32399,-93.23432],[39.30476,-93.2958],[39.27811,-93.32836],[39.27468,-93.3552],[39.25394,-93.36605],[39.23795,-93.38185],[39.23737,-93.39631],[39.25356,-93.4203],[39.26669,-93.46846],[39.26231,-93.48806],[39.23623,-93.50501],[39.21796,-93.53927],[39.23604,-93.64321],[39.23166,-93.67519],[39.2113,-93.71002],[39.2092,-93.73819],[39.20273,-93.7559],[39.20254,-93.79016],[39.21358,-93.84898],[39.20768,-93.86745],[39.18465,-93.89809],[39.18274,-93.9335],[39.14848,-93.95844],[39.13953,-93.98813],[39.14315,-94.0085],[39.14867,-94.00869],[39.15666,-93.99403],[39.17018,-93.98642],[39.1896,-93.99384],[39.1955,-94.00546],[39.19321,-94.02563],[39.18769,-94.03134],[39.16218,-94.03686],[39.13382,-94.07513],[39.1401,-94.09626],[39.16656,-94.12652],[39.18693,-94.18515],[39.19569,-94.18953],[39.20977,-94.17716],[39.22005,-94.18706],[39.21948,-94.25463],[39.23509,-94.2988],[39.22862,-94.3106],[39.1993,-94.32145],[39.16808,-94.35857],[39.16409,-94.37913],[39.18807,-94.3955],[39.19112,-94.42348],[39.18636,-94.42862],[39.17037,-94.42919],[39.15076,-94.42005],[39.13058,-94.43985],[39.12963,-94.49182],[39.14429,-94.53084],[39.14372,-94.54854],[39.11973,-94.56853],[39.11326,-94.59099]];

const EXP3_STATS = {
  legsFlown:    18,
  distanceNM:   1283,
  totalNM:      4029,    // canonical reference total (full polyline length)
  progressPct:  32,
  statusBadge:  "In Progress",
  updatedDate:  "May 24, 2026 10:48 PM MT"
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
  "KFYG": 1038.8,  // Washington Regional, MO
  "3MO2": 1057.7,  // Ultra Flight Airpark, Berger MO; snap [38.70761,-91.32999], 1.1 NM off-route
  "63M":  1064.1,  // Hermann Municipal; snap [38.70685,-91.46533], 1.2 NM off-route
  "MU68": 1068.5,  // Eu-Wish Airport, Hermann MO; snap [38.67734,-91.55080], 0.9 NM off-route
  "KJEF": 1099.6,  // Jefferson City Memorial; snap [38.57284,-92.14567], 1.2 NM off-route
  "KVER": 1139.4,  // Jesse Viertel Memorial, Boonville MO; snap [38.97830,-92.68666], 1.9 NM off-route
  "71MO": 1202.1,  // Famuliner Farms, Wakenda MO; snap [39.27468,-93.35520], 1.7 NM off-route
  "K26":  1210.1,  // Carrollton Memorial; snap [39.26231,-93.48806], 3.1 NM off-route
  "4K3":  1233.5,  // Lexington Municipal; snap [39.18274,-93.93350], 1.6 NM off-route
  "4MO8": 1259.3,  // Martens Airport; snap [39.21948,-94.25463], 1.0 NM off-route
  "4MO4": 1264.1,  // Liberty Landing Airport; snap [39.19930,-94.32145], 1.2 NM off-route
  "KMKC": 1282.8   // Kansas City Downtown / Wheeler; snap [39.11326,-94.59099], 0.6 NM off-route
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
  },
  "leg-14": {
    facts:   "Leg 14: KCPS → 1H0, 41 NM, May 21 2026, 0:35. 1H0 = Creve Coeur Airport (FAA LID 1H0), in Maryland Heights / St. Louis County MO, 38.72667,-90.50833, elev 463 ft; named for Creve Coeur Lake; home of the Historic Aircraft Restoration Museum; sits essentially on the Missouri River route (snap [38.73255,-90.52585], cum 1009.3, ~1.3 NM off-route). DEPARTURE UP THE MISSOURI: Corps left Camp River Dubois (mouth of Wood River, opposite the Missouri's mouth near Hartford IL) ~4 pm May 14 1804, swivel gun fired; Clark in command (~40 men), Lewis stayed in St. Louis. Lewis's business there included dispatching an Osage chiefs delegation to Washington under Pierre Chouteau (Clark's May 21 journal: waiting for Lewis 'to fix off the Osage Chiefs'). Reached St. Charles May 16 — French-Canadian town 'Petite Cote', ~450 inhabitants, last established town for 2+ years; hired French boatmen (incl. Pierre Cruzatte, Francois Labiche), rebalanced the loaded keelboat/pirogues, attended dances/dinners/church. Lewis rode ~24-25 mi overland from St. Louis, arrived ~6:30 pm May 20. Set out from St. Charles ~3:30 pm May 21 into a strong headwind and heavy rain; made only ~3 mi, camped on the north shore, storms overnight. La Charrette (near present Marthasville, ~7 French families, ~40-50 river mi above St. Charles) was the last white settlement on the Missouri, passed May 25 1804 (Charles Floyd: 'the last settlement of whites on this river'); met trader Regis Loisel there. Upper Louisiana formally transferred to the US March 9-10 1804. Lewis later designated the mouth of Wood River the official 'point of departure.' GEOGRAPHIC NOTE: the May 21 night-camp was ~3 mi UPSTREAM (NW) of St. Charles — the far side of town from Creve Coeur; the Corps passed the Creve Coeur / Howard Bend vicinity ~May 14-15 on the run up to St. Charles.",
    covered: "Up the Missouri at last — the third river of the trip. Flew up the Mississippi past an industrial-looking St. Louis (Gateway Arch, stadiums, modest skyscrapers; photo 'Downtown St. Louis'), reached the Mississippi/Missouri confluence (noting the Illinois side as L&C's winter quarters), turned up the Missouri (primary photo 'Reaching the Missouri River where it meets the Mississippi'), and continued just past St. Charles to Creve Coeur (1H0) — ~18 NM straight-line / ~41 NM by river from KCPS — tied to L&C's position '222 years ago today.' A crosswind over 10 kt forced a touchdown in the grass beside the asphalt before regaining the runway (landing video). Historical section ('The Point of Departure'): the May 14 1804 departure from Camp Dubois with Clark in command and Lewis finishing the Osage delegation business in St. Louis; the run up to St. Charles (arr May 16, 'Petite Cote', ~450 people, last established town); hiring boatmen and rebalancing loads; Lewis rejoining May 20; the wet, headwind-bound May 21 departure (~3 mi to the first camp); and La Charrette (May 25) as the true last white settlement."
  },
  "leg-15": {
    facts:   "Leg 15: 1H0 → MU68, 59 NM (1068.5−1009.3), May 22 2026, 0:41. MU68 = Eu-Wish Airport, Hermann MO (Gasconade County), actual coords 38.668934,-91.535999, elev ~920 ft, private grass strip ~4 mi W of Hermann; route snap [38.67734,-91.5508], cum 1068.5, ~0.9 NM off-route. Leg passes 3MO2 (snap [38.70761,-91.32999], cum 1057.7) and 63M/Hermann Muni (snap [38.70685,-91.46533], cum 1064.1). L&C dates May 22–25 1804 (picks up morning after the rain-soaked May 21 first camp above St. Charles; ends at La Charette May 25). MAY 22: set out ~6 am after violent overnight rain; passed Bonhomme Creek, small farms, a Kickapoo hunting camp who gave 4 deer (got 2 qts whiskey); camped at mouth of a small creek near Femme Osage; ~18 mi; 'hard water.' WASHINGTON, MO (south bank, Franklin Co.): pop 14,500 (2020 census) / ~15,900 (2026 est); largest city in Franklin Co.; 'corncob pipe capital of the world' (Missouri Meerschaum). First settled under Spanish rule 1796 — site of Spanish post San Juan del Misuri ('St. John's of the Missouri'), existed 1796–1803; locally remembered as 'St. John Meyer's Settlement' / 'St. John's Settlement.' Renamed for George Washington after US control; 'Washington Landing' once a ferry was licensed 1814; platted/founded as a town 1839 (Lucinda Owens, widow of William G. Owens who was murdered 1834). MAY 23 (TAVERN CAVE / LEWIS'S NEAR-FATAL FALL): near mouth of Femme Osage ('Osage Woman's River'), passed Tavern Cave — Clark measured it ~120 ft wide, 40 ft deep, 20 ft high; walls covered with names/images left by French & Indian travelers ('the Inds & French pay omage'); Clark wrote his own name among them. Pinnacles rise ~300 ft above the river; Lewis climbed to view the country, slipped near the summit and nearly fell to his death, saving himself 'by the assistance of his Knife' (Clark) — nine days into the expedition proper. Lewis also collected plant Specimen No. 3 (false indigo, Amorpha fruticosa; later lost). Arms inspection that evening (Whitehouse). MAY 24 (DEVIL'S RACE GROUND): the barge ('keelboat') nearly lost — collapsing bank + shifting sandbars, tow rope snapped, boat wheeled broadside and nearly capsized; saved by men jumping out / swimming a line ashore; forced to drop back 2 mi and try another channel; camped at 'Retrograde Bend.' MAY 25 (LA CHARETTE): reached La Charette (also called Saint John's / St. Johns, near mouth of Charette Creek), ~seven small log houses, the LAST white settlement the Corps would see until their 1806 return (Whitehouse: 'last settlement of white people on this River'); villagers French-speaking and poor, shared milk & eggs; met trader Régis Loisel just down from Cedar Island in Sioux country (gave river/peoples intel, letters); Lewis collected cottonwood (Populus deltoides) Specimen No. 4; weather diary noted ripe wild strawberries. Charette Creek named after Joseph Chorette, drowned there ~1795 (Trudeau party). Founding families incl. the Cardinal brothers (Métis). DANIEL BOONE: came west to Spanish Louisiana ~1799 (Femme Osage valley, land grant); 'Boone settlement' extended along the river, with La Charette in its western part; no record of L&C meeting Boone. Boone died Sept 26 1820 near Marthasville/Femme Osage; the only portrait of Boone painted from life — Chester Harding's June 1820 oil sketch (Massachusetts Historical Society, PUBLIC DOMAIN) — was made while Boone lived with daughter Jemima Boone Callaway near Marthasville, a few months before his death. LA CHARETTE'S END: washed away by the Missouri in the floods of 1842–43; located south of present-day Marthasville (oldest town in Warren Co., named by Dr. John Young for his wife Martha; succeeded La Charette) on the north bank. HISTORICAL IMAGE USED: Chester Harding 1820 Daniel Boone portrait (PD), local asset Expedition3/Legs/Leg15-DanielBoone.jpg (user supplies file from Wikimedia: File:Unfinished_portrait_of_Daniel_Boone_by_Chester_Harding_1820.jpg).",
    covered: "Early-morning departure up the Missouri to beat incoming IFR weather, rewarded with sunrise over the river (primary photo, Veterans Memorial Bridge behind); the stretch still feels remote. Passed Washington MO on the south bank (~15,000 today; in 1804 the Spanish-era 'St. John Meyer's Settlement,' newly American via the Louisiana Purchase) with Daniel Boone having settled across the river ~1799 (unknown whether L&C met him); photo of Washington and its bridge. Noted La Charette a couple miles on, across the river — the Corps's last white settlement (one night, May 25 1804), since erased by the 1842–43 floods. Landed at Eu-Wish (MU68), a grass strip near the Gasconade River, with a satisfying landing (video). Historical section ('A Knife's Edge, and the Last Village'): the May 22–25 upstream fight against 'hard water'; Tavern Cave and Lewis's near-fatal cliff fall on May 23 (saved by his knife) plus Clark adding his name to the cave graffiti; the May 24 near-loss of the barge at the Devil's Race Ground (Retrograde Bend); La Charette as the last white settlement, the villagers' milk and eggs, and trader Régis Loisel; aging Daniel Boone living nearby (died 1820, the year of Harding's from-life portrait near Marthasville); and La Charette's disappearance in the 1842–43 floods, with Marthasville succeeding it. Used the public-domain Chester Harding 1820 Daniel Boone portrait."
  },
  "leg-16": {
    facts:   "Leg 16: MU68 → KJEF, 31 NM (1099.6-1068.5), May 23 2026, 0:25. KJEF = Jefferson City Memorial Airport, Jefferson City MO; north bank of the Missouri, downstream (E/NE) of the city; snap [38.57284,-92.14567], cum 1099.6, 1.2 NM off-route. Leg runs from the Gasconade (MU68/Hermann) up past Chamois MO (small Osage County river town) to just upstream (W) of the Osage River mouth. L&C dates May 26–June 3 1804. TIMELINE: May 26 Drouillard & Shields sent ahead with the expedition's TWO HORSES to hunt ('proceed one day, hunt the next'); missed rendezvous, absent 7 days, rejoined at the Osage June 2 'much worsted' with a 'flattering account of the Countrey' (30-40 mi parallel to river, N side). May 27 camped at mouth of the GASCONADE River. May 30 Deer Creek. May 31 strong winds kept them in camp; traders drifting downriver brought first news of the Osage. JUNE 1: struggled against strong/rising Missouri current; reached mouth of the OSAGE RIVER at 4 p.m., 'one of the major Indian trail intersections on the lower Missouri'; Clark from the point: 'I had a delightfull prospect of the Missouries up & down, also the Osage R. up.' Lewis collected wild ginger (Asarum canadense), Specimen No. 10 (lost; received by John Vaughn 1805). JUNE 2: remained at the Osage; Lewis celestial obs until midnight (men 'felled all the Trees in the point'); Clark measured widths — Missouri 875 yds, Osage 397 yds; latitude N 38°31'6.9\". JUNE 3: Lewis walked a short way up the Osage; camp at mouth of Moreau River. OSAGE PEOPLE: river named for the Osage / Wahzhazhe (French 'Ausages'; Lewis spelled 'Osarges'). Sgt. Patrick Gass: 'of a large size and well proportioned, and a very warlike people.' Villages near the THREE FORKS, >100 mi upstream (now beyond Lake of the Ozarks). Captains met NO Osage on the river; detailed tribal descriptions (50+ nations; Grand Osages FIRST, Little Osages second) compiled the next winter at Fort Mandan via the Chouteau brothers (Auguste & Pierre), Osage traders since the 1770s. INDIAN ENCOUNTERS THUS FAR: essentially none face-to-face — only friendly/brief contact (Kickapoo party gave 4 deer for 2 qts whiskey May 22; downbound French traders; Osage chiefs delegation dispatched from St. Louis). First councils/tensions weeks ahead (Oto/Missouri, Council Bluff, early Aug). OSAGE RIVER NOW vs 1804: 1804 free-flowing, 397 yds at mouth; today dammed — BAGNELL DAM (completed 1931, Union Electric/Ameren) = Lake of the Ozarks; TRUMAN DAM (completed 1979, USACE) = Truman Reservoir upstream. Three-forks village sites now beyond/beneath the reservoirs. Osage MOUTH shifted ~6 mi downstream since Clark's viewpoint (Clark's Hill/Norton State Historic Site preserves the overlook). PRIMARY PHOTO: Leg16-Osage.png 'The Osage River meets the Missouri', placed at the top of the journal body. No historical-section image (the Osage-chief portrait was considered and dropped — the Corps had not yet seen any Osage, so a chief's portrait was not apt). No video. LOST HUNTER (verified, lewis-clark.org 29-may-1804): pilot's 'wait for a lost hunter' is CORRECT — on May 29 the party spent most of the day at the Gasconade mouth drying goods and waiting for Pvt. Joseph Whitehouse to return from hunting; set out ~4:30 pm without him, left a pirogue to wait, camped at Deer Creek, then heard his guns downriver and answered with the swivel gun (Lewis prepared Golden Seal, Specimen No. 8, that day). Separately, Drouillard & Shields (sent ahead with the horses May 26) were absent 7 days and rejoined June 2 — a distinct episode, not the wait. Other pace factors: strong current + wind-bound May 31 + 2-day Osage observation stop.",
    covered: "Quick 25-min hop from the Gasconade (MU68/Hermann) past an unnoticed Chamois to just beyond the Osage River, landing at Jefferson City Memorial (KJEF) downstream of the unseen city; a ground-loop on touchdown, no video. Noted the same stretch took L&C six days. Primary photo (top of journal): 'The Osage River meets the Missouri.' Historical section ('A Warlike People, Not Yet Seen'): the late-May current fight; the May 29 day lost at the Gasconade mouth WAITING FOR THE LOST HUNTER Pvt. Joseph Whitehouse (gave him up ~4:30 pm, left a pirogue, camped at Deer Creek, heard his guns and answered with the swivel gun) — explicitly distinguished from the separate Drouillard & Shields horse episode (sent ahead May 26, missed rendezvous); the May 31 wind-bound camp where traders brought first word of the Osage; arrival at the Osage mouth 4 p.m. June 1 1804 and Clark's 'delightfull prospect'; the two-day stop for Lewis's midnight celestial observations and Clark's river measurements (Missouri 875 yds / Osage 397 yds), wild-ginger Specimen No. 10, and Drouillard & Shields rejoining 'much worsted' after seven days with the horses; the Osage/Wahzhazhe as Gass's 'large...well proportioned...very warlike people' what the captains had learned of them over the winter in St. Louis from the Chouteau brothers (Grand & Little Osages; villages past the three forks), and none of them appearing at the mouth (told in the moment — NO flash-forward to Fort Mandan, per pilot); the near-total absence of any Indian encounters so far (only the friendly Kickapoo deer-for-whiskey trade and downbound French traders); and the contrast with today's dammed Osage — Bagnell Dam (1931, Lake of the Ozarks) and Truman Dam (1979) — plus the mouth's ~6-mile downstream shift since 1804."
  },
  "leg-17": {
    facts:   "Leg 17: KJEF → 71MO, 103 NM (1202.1−1099.6=102.5), May 23 2026, 1:12. 71MO = Famuliner Farms, private grass strip near Wakenda, Carroll County MO (N bank), snap [39.27468,-93.35520], cum 1202.1, 1.7 NM off-route; lands at the Malta Bend/Waverly reach. DEP KJEF = Jefferson City Memorial. L&C dates June 4–15 1804 (picks up the day after the June 3 Moreau camp that closed Leg 16). JEFFERSON CITY MONUMENT (verified): Sabra Tull Meyer bronze 'Corps of Discovery' / Lewis & Clark Monument, dedicated 2008, on Missouri State Capitol grounds at the Lewis & Clark KATY Trailhead Plaza (corner Capitol Ave & Jefferson St, ~half-block E of the Capitol); five figures — York, Lewis, Seaman (Lewis's Newfoundland), Clark, George Drouillard; commemorates the June 4 1804 encampment where the capitol now stands. MAST BROKE (verified): June 4 1804 near present Jefferson City (mouth of Gray's Creek), the barge ran under a leaning sycamore; Sgt Ordway at the helm took the blame ('the mast got fast in a limb of a sycamore tree & broke it very easy'); Clark: 'Our mast broke by the bout running under a tree'; Clark named a small tributary 'Mast Creek'; delay for repairs; camped at Sugar Loaf Rock / 'Mine Hill' where Clark searched (unsuccessfully) for rumored lead ore. Keelboat = a galley/'barge', 55 ft, ~32 ft at the mast, 1 sail + 20 oars, the largest boat taken up the Missouri to that time. JUNE 5: a fine wind but they couldn't sail (mast broken); quicksand/uncertain water; scouts found fresh sign of ~10 Indians (Clark guessed Sauks heading to war on the Osage); jerked surplus venison; met two French fur traders ~11 a.m. returning from up the Kansas R.; made 12.5 mi from Sugar Loaf Rock. BOAT HAZARDS / ARROW ROCK: June 9 the barge, in a ~300-yd-wide swift current past the wooded bluff Arrow Rock, struck a drifting log then caught on a cluster of them — 'a disagreeable and Dangerous situation' (Clark); men leapt in, swam a line ashore, hauled it clear; Clark: 'our party not inferior to any that was ever on the waters of the Missoppie.' Sawyers (submerged snags), shifting sandbars and quicksand throughout; June 13 the boat nearly turned over striking/turning on sand; June 15 it 'wheeled on a Sawyer.' CAVING BANKS: undercut banks collapsing into the river a constant danger (esp. June 15 — submerged logs + crumbling banks). DORION (verified June 12, near present Dalton MO / Bowling Green Bend): met 2 canoes coming downriver, one loaded with furs/peltries, the other ~300 lb buffalo grease/tallow; party included 'old Mr. Dorion' (Pierre Dorion Sr., b. Quebec 1740, ~20 yrs among the Yankton Sioux); questioned him so long it was 'too late to Go further'; bought 300 lb grease (~$5/hundredweight); prevailed on Dorion to turn around and return upriver as Sioux interpreter; one enlisted man (Robinson, Tuttle, or White) sent back downriver with the traders. EVIDENCE OF INDIANS: June 13 above the Grand R. passed the ancient village of the Missouri (Missouria) Indians — once 'the most noumerous nation' on this part of the continent, where ~300 (Clark; NB note '200') were killed by the Sauks, now reduced to ~80 living under the Otoe on the Platte (Utz / Gumbo Point sites, Saline Co.); June 16 Clark walked a 'butifull extensive Prarie' searching for the site of an old French fort shown on Evans's map (Bourgmont's Fort Orleans, built near the Grand R. ~1723, 'more than eighty years earlier'). GRAND RIVER: camped at its mouth (N side) June 13; Gass: 'as handsome a place as I ever saw in an uncultivated state'; lunar obs to 11:30 pm. HUNTING/BEAR + MOSQUITOES + CLARK SICK: deer abundant throughout; bears appear at the Waverly reach — June 17 hunters brought in one bear, June 18 five deer and a bear; men greased themselves with bear grease to deter mosquitoes; ticks + mosquitoes a growing torment (everyone 'had had enough' by ~June 19). Worn cordelle (tow rope) failing → June 16–18 'Rope Walk Camp' near present Waverly: made 600 ft of new rope (from the cable Lewis bought at Pittsburgh) + 20 new oars; French engages (used to eating 5–6x/day) asked for more food and were sharply rebuked; party 'much aflicted with Boils and Several have the Decissentary' (Clark blamed the river water); Clark nursing a bad cold since the Osage — 'my Cold Continues verry bad.' BOONVILLE (pilot journal, verified): named for Daniel Boone's sons Nathan & Daniel Morgan Boone, who ran the Boone's Lick salt works ~13 mi NW (Howard Co., across the river, ~1805–1810); first settlers Hannah Cole & family ~1810; platted 1817 — nothing there in 1804, correct. HISTORICAL IMAGE USED: Michael Haynes painting 'Ordway's Mast, 1804' (the barge running under a sycamore as the mast breaks near Jefferson City), placed immediately after the broken-mast paragraph; local asset Expedition3/Legs/Leg17-OrdwaysMast.png (pilot saves from https://www.mhaynesart.com/lewisandclark/jcnh09d0ygw1x1khf6w9456wuar26y ; source PNG at images.squarespace-cdn.com/.../OrdwaysMast.png). Used WITH PERMISSION; REQUIRED credit in caption: 'Michael Haynes — www.mhaynesart.com'. Two journal VIDEOS embedded: thunderstorms = YouTube Rk1ihoR3q90; landing = YouTube VPNpVr0jIvA.",
    covered: "An eventful 1:12 from Jefferson City to Famuliner Farms (71MO), a building-less grass strip near Wakenda — fair skies giving way to rain and thunderstorms most of the flight at 2,000 ft (thunderstorm video), past Boonville (named for Boone's sons' salt works, unsettled until ~1810 so empty in 1804; photo), a treacherous wind-tossed approach ('a barf bag might have been useful'), and the usual ground-loop landing with nobody to greet him and a sleeping bag for the night (landing video). Primary photo: the Missouri State Capitol; noted the Sabra Tull Meyer Lewis & Clark monument on the Capitol grounds (incl. Seaman) which he couldn't spot from the air. Historical section ('A Broken Mast and Hard Water'): the June 4 1804 broken mast near Jefferson City (barge ran under a sycamore; Ordway blamed himself; Clark named 'Mast Creek'; camp at Sugar Loaf Rock where Clark chased rumored lead) — the same June 4 camp the Capitol monument commemorates; the dangerous river of sawyers, sandbars and quicksand, the broken mast forcing them to pole and tow into a fine June-5 wind, and the June 9 Arrow Rock near-disaster (barge swung broadside, men swam a line ashore); the caving/undercut banks collapsing into the current; the people of the river — two French traders down from the Kansas (June 5) and, June 12 near Dalton, old Pierre Dorion Sr. with his furs and 300 lb of buffalo grease, persuaded to turn back upriver as Sioux interpreter (one man sent home); the evidence of vanished and warring nations — fresh sign of a ~10-man (Sauk?) war party June 5, the ancient Missouri village above the Grand River where ~300 had been killed by the Sauks (the nation now reduced to ~80 under the Otoe), and Clark's June 16 prairie walk hunting for the site of the old French Fort Orleans on Evans's map; and the grind at Rope Walk Camp near Waverly (June 16–18) — deer everywhere and the first bears, men greasing up against the mosquitoes and ticks, 600 ft of new rope and 20 oars, the engages rebuked for wanting more food, boils and dysentery from the water, and Clark's bad cold that 'continues verry bad.' Historical image: Michael Haynes's painting 'Ordway's Mast, 1804' (used with permission, credited 'Michael Haynes — www.mhaynesart.com'), placed beside the broken-mast paragraph. Thunderstorm and landing videos embedded (YouTube Rk1ihoR3q90 and VPNpVr0jIvA)."
  },
  "leg-18": {
    facts:   "Leg 18: 71MO \u2192 KMKC, 81 NM (1282.8-1202.1=80.7), May 24 2026, 0:52. KMKC = Charles B. Wheeler Downtown Airport, Kansas City MO; snap [39.11326,-94.59099], cum 1282.8, 0.6 NM off-route. DEP 71MO = Famuliner Farms, Wakenda MO. L&C dates June 16-29 1804 \u2014 picks up after Leg 17's June 15 boundary (Leg 17 narrative already covered June 16-18 Rope Walk Camp near Waverly); ends at the June 29 Kaw Point departure per pilot's explicit 'up until they left Kaw Point.' Nearest camp to KMKC = Kaw Point camp June 26-28 (0.9 NM). PRAIRIE/BUFFALO: tallgrass prairie once ~170M acres of N. America; only ~1-4% remains (commonly cited 'less than 4%'); Missouri <1% (~0.5%); the 0.1% figure is the per-state remnant for IL & IA, not continent-wide. Largest surviving tallgrass remnant = Flint Hills of Kansas (rock too near surface to plow); Tallgrass Prairie National Preserve there (est. 1996). BUFFALO: Clark 'Some buffalow Sign' June 6 1804 near Boonville; Corps' hunters caught their FIRST SIGHT of buffalo at the mouth of the Kansas River June 28 1804 (vicinity of present KC) but could not get close enough to shoot; first buffalo KILLED Aug 23 1804 by Joseph Field near present Vermillion SD \u2014 Clark 'this was the first I ever Saw & as great a curiosity to me.' (Source: lewis-clark.org bison-encounters; franceshunter blog.) KANSA/KAW: river/state/city named for the Kansa (Kaw), Siouan, name often glossed 'people of the south wind.' June 28 Clark: Kansa 'not verry noumerous at this time, reduced by war,' once numerous when the French first settled Illinois, 'a fierce & warlike people,' badly supplied with firearms, easily conquered by the Iowa & Sauk/Fox, 'now out in the plains hunting the Buffalow.' Villages ~60 & ~120 mi up the Kansas (engage info). Osage to the south; remnant Missouria nearby. Post-1830 Indian Removal brought Shawnee, Delaware, Wyandot, Kickapoo to the lower Kansas valley. WHITE PRESENCE PRE-L&C: first written description of the confluence by French officer Etienne de Veniard, Sieur de Bourgmont, journal 1713 (first white man to explore lower Missouri); French traders through the 1700s; Spain 1763 (licensed trade); back to France then US via Louisiana Purchase 1803; NO permanent settlement at the river junction before L&C. KAW POINT EVENTS: June 26 reached the point after hauling past the Blue River; towrope broke twice on a sandbar; killed a large rattlesnake; Clark recorded 'a great number of Parrot queets' = first notice of Carolina parakeet (now extinct) W of the Mississippi. June 26-28 three-day stay: felled trees on the point, built a 6-ft redoubt/breastwork of logs & brush from one river to the other (guard vs. Kansa), dried/repaired a pirogue, hunted, took observations. River widths: Kansas 230-1/4 yds, Missouri ~500 yds. Clark 'the Countrey about the mouth of this river is verry fine'; a high point a mile up the W bank of the Kansas 'a butifull place for a fort, good landing place'; Kansas water 'verry disigreeably tasted.' (Basis for pilot's journal 'fine place for a fort' \u2014 actually Clark's words, not an anonymous crewman.) June 29 court-martial: Pvts John Collins (sentinel, drunk on post) & Hugh Hall tried for tapping the whiskey barrel; Collins 100 lashes, Hall 50; departed that evening; keelboat stern swung within 6 inches of a large sawyer; camped near present Riverside KS. Confluence has shifted ~1/4 mi upstream since 1804. KANSAS CITY FOUNDING: Francois Chouteau (St. Louis) set up first permanent Euro-American settlement (Chouteau's Landing, American Fur Co.) 1821, trading w/ Kansa, Osage, Shawnee, Kickapoo; warehouse flooded 1826, relocated. Westport founded 1833 by John Calvin McCoy; Westport Landing 1834. Town Company 1838; incorporated Town of Kansas 1850; City of Kansas 1853 (first mayor Wm. S. Gregory); renamed Kansas City 1889. Railroads (1860s) + stockyards (1870) made it a metropolis. ~half a century from L&C (1804) to city (1850s). DECLINED IMAGE: pilot's requested lewis-clark.org Kaw Point image (media/lctoday/kaw_point_104.jpg) is a photo by Kristopher K. Townsend OF an interpretive-sign painting \u2014 no free license stated, copyright on both the painting & the photo \u2192 NOT used. (A separate Townsend Kaw Point landscape photo, kaw_point_113.jpg, IS CC BY-SA 4.0 but modern.) FACT FLAGS RESOLVED: (1) journal '0.1%' corrected to 'Less than 1% of the original tallgrass prairie land in Missouri remains.' (Missouri <1% well-sourced). (2) stray dangling word 'Eventually' after the Kansas City photo \u2014 omitted pending pilot confirmation. (3) journal 'one of the crew remarked' re: fort \u2014 was actually Capt. Clark; left verbatim. KMKC already in AIRPORT_CUM_NM (1282.8). VIDEO: landing = YouTube J1XM-QO-Sn4.",
    covered: "A perfect-weather sunrise hop (0:52) from Famuliner Farms (71MO) up a peaceful, farm-and-forest Missouri to Charles B. Wheeler Downtown Airport (KMKC), the farmland once tallgrass prairie (primary photo: sunrise over the river; photo of former prairie/farmland); approach right into downtown Kansas City over the Missouri to one of the pilot's best landings (KC photo w/ the Christopher S. Bond Bridge; landing video J1XM-QO-Sn4). Noted L&C camped at Kaw Point and that 'one of the crew' called it a fine place for a fort. Historical section ('Buffalo Country, and the City to Come'): the vanished tallgrass prairie (~170M acres -> a few percent; Flint Hills the largest remnant); the buffalo thread \u2014 Clark's June 6 'buffalow Sign,' the hunters' FIRST SIGHT of buffalo at the mouth of the Kansas June 28 1804, and the first kill not until Aug 23 (Joseph Field, SD); the Kansa/Kaw ('people of the south wind') described by Clark as a warlike, war-reduced nation 'out in the plains hunting the Buffalow,' with the Osage and remnant Missouria nearby and removal-era tribes to come; pre-L&C European presence (Bourgmont's 1713 journal; French/Spanish trade; no permanent settlement); the June 26-29 Kaw Point stay \u2014 towrope breaking, the rattlesnake, Clark's first Carolina-parakeet record W of the Mississippi, the 6-ft redoubt vs. the Kansa, river measurements, Clark's 'verry fine' country and 'butifull place for a fort,' the June 29 Collins/Hall whiskey court-martial (100 & 50 lashes) and the six-inch sawyer near-miss on departure; and Kansas City's slow birth \u2014 Chouteau's 1821 landing, Westport 1833, Town of Kansas 1850, City of Kansas 1853, ~half a century after Clark's fort sketch. No historical image (lewis-clark.org Kaw Point image declined — interpretive-sign painting photographed by Townsend, no free license; Catlin replacement rejected by pilot)."
  }
};
