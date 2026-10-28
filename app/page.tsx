"use client";

import { useEffect, useRef, useState, type ReactNode, type RefObject } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Leaf,
  MapPin,
  Sparkles,
  BookOpen,
  Gamepad2,
  ChevronRight,
  ChevronDown,
  Navigation,
  Volume2,
  VolumeX,
  Scale,
  Flame,
  Droplets,
  Cookie,
  HandHeart,
  Gift,
  Cigarette,
  Store,
  Building2,
  Moon,
  Users,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/* Brand constants                                                     */
/* ------------------------------------------------------------------ */

const BRAND = "Rooftop 420";
const LOGO_SRC = "/rooftop420-logo.png";

const COLORS = {
  ink: "#0A0B0A",
  char: "#121412",
  gold: "#F4C430",
  red: "#E2231A",
  green: "#1F9D48",
  cream: "#F7F5EF",
};

const glass =
  "bg-white/[0.035] backdrop-blur-xl border border-white/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]";

const directionsUrl = (address: string) =>
  `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`;
const embedUrl = (address: string) =>
  `https://www.google.com/maps?q=${encodeURIComponent(address)}&output=embed`;

/* ------------------------------------------------------------------ */
/* Locations                                                           */
/* ------------------------------------------------------------------ */

interface Location {
  id: string;
  name: string;
  /** Trading name, when the branch runs under a different flag. */
  alias?: string;
  street: string;
  area: string;
  note: string;
  tags: string[];
}

interface Region {
  id: string;
  title: string;
  metro: string;
  locations: Location[];
}

const REGIONS: Region[] = [
  {
    id: "kzn",
    title: "KwaZulu-Natal",
    metro: "Greater Durban",
    locations: [
      {
        id: "berea",
        name: "Berea",
        street: "147 Problem Mkhize Road",
        area: "Essenwood, Berea, Durban",
        note: "One of our main members-only lounges, with a fully stocked bud shop.",
        tags: ["Members' lounge", "Bud shop"],
      },
      {
        id: "overport",
        name: "Overport",
        street: "Shop 7, Sunway Centre, 65 Overport Drive",
        area: "Overport, Durban",
        note: "A clean, bright retail dispensary in the Sunway Centre.",
        tags: ["Dispensary"],
      },
      {
        id: "windermere",
        name: "Windermere",
        alias: "Rooftop 420 Gordon",
        street: "196 Gordon Road",
        area: "Windermere, Durban",
        note: "A stylish lounge space on Gordon Road.",
        tags: ["Lounge"],
      },
      {
        id: "pinetown",
        name: "Pinetown",
        street: "48 Bartlett Road, Farningham Ridge",
        area: "Pinetown",
        note: "A relaxed, laid-back spot with one of our widest product selections.",
        tags: ["Bud shop", "Wide selection"],
      },
      {
        id: "isipingo",
        name: "Isipingo Beach",
        alias: "420 Rooftop",
        street: "3 Beach Road",
        area: "Isipingo Beach",
        note: "Open-air rooftop seating with views over the beach.",
        tags: ["Rooftop", "Sea views"],
      },
    ],
  },
  {
    id: "wc",
    title: "Western Cape",
    metro: "Greater Cape Town",
    locations: [
      {
        id: "seapoint",
        name: "Sea Point",
        street: "233 Main Road",
        area: "Sea Point, Cape Town",
        note: "A busy Main Road branch that stays open late.",
        tags: ["Late night"],
      },
      {
        id: "plumstead",
        name: "Plumstead",
        alias: "Studio 420",
        street: "126 Main Road",
        area: "Plumstead, Cape Town",
        note: "Our 24-hour flagship lounge, with pool tables and its own coffee bar.",
        tags: ["Flagship", "24 hours", "Coffee bar"],
      },
      {
        id: "newlands",
        name: "Newlands",
        alias: "Studio 420",
        street: "18 Wilkinson Street",
        area: "Newlands, Cape Town",
        note: "Trading as Studio 420, in leafy Newlands.",
        tags: ["Studio 420"],
      },
      {
        id: "claremont",
        name: "Claremont",
        street: "18 Imam Haron Road",
        area: "Claremont, Cape Town",
        note: "A rooftop oasis known for curated edibles and flower.",
        tags: ["Rooftop", "Edibles"],
      },
      {
        id: "houtbay",
        name: "Hout Bay",
        street: "Victoria Mall, 17A Victoria Road",
        area: "Hout Bay, Cape Town",
        note: "A welcoming boutique store close to the harbour.",
        tags: ["Boutique"],
      },
      {
        id: "wynberg",
        name: "Wynberg",
        street: "Wynberg Centre, 123 Main Road",
        area: "Wynberg, Cape Town",
        note: "Easy to reach in the Wynberg Centre on Main Road.",
        tags: ["Shop"],
      },
    ],
  },
];

const LOCATION_COUNT = REGIONS.reduce((n, r) => n + r.locations.length, 0);
const fullAddress = (l: Location) => `${l.street}, ${l.area}`;

/* ------------------------------------------------------------------ */
/* Menu data: product types only. Strains and prices are in store.     */
/* ------------------------------------------------------------------ */

interface MenuType {
  name: string;
  note: string;
}

interface MenuGroup {
  id: string;
  title: string;
  blurb: string;
  icon: ReactNode;
  types: MenuType[];
}

const MENU: MenuGroup[] = [
  {
    id: "flower",
    title: "Flower",
    blurb: "Graded by how it's grown. Ask at the counter to see and smell what's on the shelf.",
    icon: <Leaf className="h-4 w-4" />,
    types: [
      { name: "Tunnel", note: "Sun-grown under poly tunnels. Natural light, weather protection, everyday value." },
      { name: "Greenhouse", note: "Sun-fed with a controlled climate. Full-flavoured and well balanced." },
      { name: "Indoor", note: "Grown under lights in a fully controlled room. Dense, frosty, top shelf." },
      { name: "Hydro", note: "Soil-free hydroponic grows for a clean burn and strong potency." },
    ],
  },
  {
    id: "prerolls",
    title: "Pre-rolls",
    blurb: "Ready-rolled and ready for the rooftop, in the same grow classes as our flower.",
    icon: <Cigarette className="h-4 w-4" />,
    types: [
      { name: "Tunnel pre-rolls", note: "Easy-going everyday joints." },
      { name: "Greenhouse pre-rolls", note: "A step up in flavour and smoothness." },
      { name: "Indoor pre-rolls", note: "Top-shelf indoor flower, rolled for you." },
      { name: "Hydro pre-rolls", note: "Clean, potent hydro in a ready-to-go roll." },
    ],
  },
  {
    id: "dab",
    title: "Dab bar",
    blurb: "Concentrates served by staff who'll walk you through it.",
    icon: <Flame className="h-4 w-4" />,
    types: [
      { name: "Dab hits", note: "Single hits served in the lounge. First time? We'll start you small." },
      { name: "Concentrates", note: "Rosin, wax and shatter to take home, when available." },
    ],
  },
  {
    id: "edibles",
    title: "Edibles",
    blurb: "Slow and long-lasting. Wait two hours before having more.",
    icon: <Cookie className="h-4 w-4" />,
    types: [
      { name: "Gummies", note: "Pre-dosed pieces, easy to portion." },
      { name: "Chocolates & baked goods", note: "Infused treats, portioned for you." },
      { name: "Infused drinks", note: "Sip slowly and give it time to land." },
    ],
  },
  {
    id: "oils",
    title: "Oils & topicals",
    blurb: "Measured drops and smoke-free options.",
    icon: <Droplets className="h-4 w-4" />,
    types: [
      { name: "CBD oils", note: "Broad-spectrum CBD in a range of strengths." },
      { name: "THC:CBD tinctures", note: "Balanced and CBD-forward ratios for day or evening." },
      { name: "Balms & rubs", note: "Applied to the skin. Non-intoxicating." },
    ],
  },
  {
    id: "lounge",
    title: "Lounge",
    blurb: "Stay a while. What's on offer varies from store to store.",
    icon: <HandHeart className="h-4 w-4" />,
    types: [
      { name: "Lounge seating", note: "Comfortable indoor and rooftop spaces to sit back with friends." },
      { name: "Coffee bar", note: "Fresh coffee at our Plumstead flagship." },
      { name: "Games", note: "Pool tables and more at our Plumstead flagship." },
    ],
  },
  {
    id: "accessories",
    title: "Accessories",
    blurb: "Everything you need to roll, grind, smoke and gift.",
    icon: <Gift className="h-4 w-4" />,
    types: [
      { name: "Rolling papers & cones", note: "Unbleached, hemp and flavoured papers, tips and cones." },
      { name: "Herb grinders", note: "Pocket grinders to multi-chamber metal ones." },
      { name: "Pipes & glass", note: "Hand pipes, bongs and bubblers." },
      { name: "Merch & gifts", note: "Ashtrays, stash jars, lighters and gifts." },
    ],
  },
];


/* ------------------------------------------------------------------ */
/* Research data                                                       */
/* ------------------------------------------------------------------ */

const RESEARCH = [
  {
    title: "Terpene science: myrcene, limonene and caryophyllene",
    body: [
      "Terpenes are the aromatic compounds that give each cultivar its scent. They are found across the plant world, in mangoes, citrus peel and black pepper.",
      "Myrcene is the most common terpene in cannabis. Animal studies link it to sedative and muscle-relaxing effects, which is why myrcene-heavy flower is often chosen for evenings.",
      "Limonene, also found in citrus peel, has shown mood-lifting and anti-anxiety effects in early animal and small human studies.",
      "Beta-caryophyllene is unusual: it binds directly to the body's CB2 receptors, which are involved in inflammation. Most evidence so far comes from lab and animal research.",
    ],
  },
  {
    title: "The endocannabinoid system: pain, sleep and stress",
    body: [
      "The endocannabinoid system (ECS) is a signalling network of receptors (CB1 and CB2) and the body's own cannabinoids, such as anandamide and 2-AG. It helps regulate pain, sleep, appetite, mood and immune response.",
      "Chronic pain has the strongest evidence. A 2017 review by the US National Academies found substantial evidence that cannabis is effective for chronic pain in adults.",
      "For insomnia and stress the evidence is more limited. Some studies report shorter time to fall asleep and lower anxiety, while regular high-THC use can disrupt sleep quality.",
      "Responses vary between people. Anyone on prescription medication, pregnant or breastfeeding should speak to a doctor first, since CBD and THC can interact with some medicines.",
    ],
  },
  {
    title: "Homegrown: South Africa's cannabis heritage",
    body: [
      "South Africa has one of the world's oldest cannabis cultures. Durban Poison, a landrace sativa from KwaZulu-Natal, is among the best-known cultivars anywhere.",
      "Long, bright summers suit the plant on both coasts. KZN's warm, humid climate means growers need strong airflow and careful drying to keep mould away.",
      "The Western Cape's winter-rainfall climate gives drier summers, but terpenes are volatile and break down with heat, so a slow cure in cool, dark conditions matters wherever it's grown.",
    ],
  },
];

/* ------------------------------------------------------------------ */
/* Smoke burst (used to reveal the menu)                               */
/* ------------------------------------------------------------------ */

function useSmokeBurst() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef<{
    ps: { x: number; y: number; vx: number; vy: number; r: number; gr: number; a: number; life: number; max: number; col: string }[];
    raf: number;
  }>({ ps: [], raf: 0 });

  useEffect(() => {
    const s = stateRef.current;
    return () => cancelAnimationFrame(s.raf);
  }, []);

  const loop = () => {
    const canvas = canvasRef.current;
    const s = stateRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    if (canvas.width !== Math.floor(w * dpr) || canvas.height !== Math.floor(h * dpr)) {
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
    }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, w, h);

    for (const p of s.ps) {
      p.life += 1 / 60;
      p.x += p.vx;
      p.y += p.vy;
      p.vx *= 0.97;
      p.vy = p.vy * 0.97 - 0.02;
      p.r += p.gr;
      const k = p.life / p.max;
      const a = p.a * (k < 0.15 ? k / 0.15 : 1 - (k - 0.15) / 0.85);
      if (a <= 0) continue;
      const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r);
      g.addColorStop(0, `rgba(${p.col},${a})`);
      g.addColorStop(0.55, `rgba(${p.col},${a * 0.45})`);
      g.addColorStop(1, `rgba(${p.col},0)`);
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
    }
    s.ps = s.ps.filter((p) => p.life < p.max);
    s.raf = s.ps.length ? requestAnimationFrame(loop) : 0;
  };

  /** Releases a cloud of smoke around (x, y), in canvas CSS pixels, spread across `spread` × `ySpread` px. */
  const puff = (x: number, y: number, count = 70, spread = 600, ySpread = 40) => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const s = stateRef.current;
    for (let i = 0; i < count; i++) {
      const tint = Math.random();
      const ang = Math.random() * Math.PI * 2;
      const speed = 0.6 + Math.random() * 2.6;
      s.ps.push({
        x: x + (Math.random() - 0.5) * spread,
        y: y + (Math.random() - 0.5) * ySpread,
        vx: Math.cos(ang) * speed,
        vy: Math.sin(ang) * speed * 0.6 - 0.8,
        r: 30 + Math.random() * 50,
        gr: 0.6 + Math.random() * 1.2,
        a: 0.12 + Math.random() * 0.16,
        life: 0,
        max: 1.4 + Math.random() * 1.3,
        col: tint > 0.8 ? "244,196,48" : tint > 0.4 ? "190,196,188" : "236,236,230",
      });
    }
    if (!s.raf) s.raf = requestAnimationFrame(loop);
  };

  return { canvasRef, puff };
}

/* ------------------------------------------------------------------ */
/* Small components                                                    */
/* ------------------------------------------------------------------ */

function Logo({ height = 36, className = "" }: { height?: number; className?: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={LOGO_SRC}
      alt={BRAND}
      height={height}
      className={`w-auto select-none ${className}`}
      style={{ height }}
      draggable={false}
    />
  );
}

/** The red, gold and green stripe from the "420" in the logo. */
function TriStripe({ className = "" }: { className?: string }) {
  return (
    <span className={`flex h-[3px] w-12 overflow-hidden rounded-full ${className}`} aria-hidden="true">
      <span className="flex-1 bg-[#E2231A]" />
      <span className="flex-1 bg-[#F4C430]" />
      <span className="flex-1 bg-[#1F9D48]" />
    </span>
  );
}

/** A deterministic city skyline silhouette, drawn as one SVG path. */
function Skyline({ className = "", windows = true }: { className?: string; windows?: boolean }) {
  const W = 1440;
  const H = 220;
  const rand = (n: number) => {
    const x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
    return x - Math.floor(x);
  };
  const blocks: { x: number; w: number; h: number }[] = [];
  for (let x = 0, i = 0; x < W; i++) {
    const w = 38 + Math.round(rand(i) * 70);
    const h = 50 + Math.round(rand(i + 50) * 140);
    blocks.push({ x, w, h });
    x += w + Math.round(rand(i + 99) * 6);
  }
  const path = blocks.map((b) => `M${b.x} ${H}V${H - b.h}h${b.w}V${H}Z`).join("");
  const lights: { x: number; y: number }[] = [];
  if (windows) {
    blocks.forEach((b, bi) => {
      for (let wy = H - b.h + 14; wy < H - 10; wy += 16) {
        for (let wx = b.x + 8; wx < b.x + b.w - 10; wx += 13) {
          if (rand(bi * 31 + wx * 0.7 + wy * 1.3) > 0.86) lights.push({ x: wx, y: wy });
        }
      }
    });
  }
  return (
    <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMax slice" className={className} aria-hidden="true">
      <path d={path} fill="currentColor" />
      {lights.map((l, i) => (
        <rect key={i} x={l.x} y={l.y} width="4" height="6" rx="1" fill="#F4C430" fillOpacity={0.25 + (i % 4) * 0.12} />
      ))}
    </svg>
  );
}

function SectionHeading({
  icon,
  title,
  intro,
}: {
  icon: ReactNode;
  title: string;
  intro: string;
}) {
  return (
    <div className="max-w-2xl">
      <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-[#F4C430]">
        {icon}
      </div>
      <h2 className="font-display text-3xl font-semibold leading-tight tracking-tight text-[#F7F5EF] sm:text-4xl">
        {title}
      </h2>
      <TriStripe className="mt-4" />
      <p className="mt-4 text-base leading-relaxed text-[#F7F5EF]/65">{intro}</p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Age gate                                                            */
/* ------------------------------------------------------------------ */

function AgeGate() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    try {
      if (sessionStorage.getItem("r420-age-ok") !== "1") setShow(true);
    } catch {
      setShow(true);
    }
  }, []);

  const confirm = () => {
    try {
      sessionStorage.setItem("r420-age-ok", "1");
    } catch {
      /* storage unavailable: gate simply shows again next visit */
    }
    setShow(false);
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-[60] grid place-items-center bg-[#0A0B0A]/85 p-6 backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="age-title"
        >
          <div className={`${glass} w-full max-w-sm rounded-3xl p-8 text-center`}>
            <Logo height={64} className="mx-auto mb-5" />
            <TriStripe className="mx-auto mb-5" />
            <h2 id="age-title" className="font-display text-2xl font-semibold">
              Are you 18 or older?
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-[#F7F5EF]/65">
              This site includes cannabis products and is for adults only.
            </p>
            <div className="mt-6 flex flex-col gap-3">
              <button
                onClick={confirm}
                className="rounded-full bg-[#F4C430] px-6 py-3 text-sm font-semibold text-[#0A0B0A] transition hover:bg-[#f7d35c]"
              >
                Yes, enter the site
              </button>
              <a
                href="https://www.google.com"
                className="rounded-full border border-white/15 px-6 py-3 text-sm text-[#F7F5EF]/75 transition hover:border-[#F4C430]/60"
              >
                No, leave
              </a>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ------------------------------------------------------------------ */
/* Navigation                                                          */
/* ------------------------------------------------------------------ */

function Nav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links: [string, string][] = [
    ["Locations", "#locations"],
    ["Menu", "#menu"],
    ["Learn", "#knowledge"],
    ["Play", "#play"],
  ];

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 transition-colors duration-300 ${
        scrolled ? "border-b border-white/10 bg-[#0A0B0A]/80 backdrop-blur-xl" : "bg-transparent"
      }`}
    >
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3">
        <a href="#top" className="flex items-center" aria-label={`${BRAND} home`}>
          <Logo height={38} />
        </a>
        <div className="hidden items-center gap-8 md:flex">
          {links.map(([label, href]) => (
            <a
              key={href}
              href={href}
              className="text-sm text-[#F7F5EF]/70 transition-colors hover:text-[#F4C430]"
            >
              {label}
            </a>
          ))}
        </div>
        <a
          href="#locations"
          className="inline-flex items-center gap-2 rounded-full border border-[#F4C430]/50 px-4 py-2 text-sm text-[#F4C430] transition-colors hover:bg-[#F4C430] hover:text-[#0A0B0A]"
        >
          <MapPin className="h-4 w-4" />
          <span className="hidden sm:inline">Find a store</span>
        </a>
      </nav>
    </header>
  );
}

/* ------------------------------------------------------------------ */
/* Hero with interactive fluid smoke                                   */
/* ------------------------------------------------------------------ */

/**
 * A small stable-fluids solver (Stam 1999) on a coarse grid. The canvas is drawn at grid
 * resolution and stretched by CSS, which gives the smoke its soft edges for free.
 * Moving the pointer pushes and seeds smoke; tapping or clicking releases a puff.
 */
function FluidSmoke({ targetRef }: { targetRef: RefObject<HTMLElement> }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const target = targetRef.current;
    if (!canvas || !target) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let NX = 0;
    let NY = 0;
    let S = 0; // row stride including the 1-cell border
    let u = new Float32Array(0);
    let v = new Float32Array(0);
    let u0 = new Float32Array(0);
    let v0 = new Float32Array(0);
    let d = new Float32Array(0); // smoke density
    let d0 = new Float32Array(0);
    let k = new Float32Array(0); // warm (ochre) share of the smoke
    let k0 = new Float32Array(0);
    let curl = new Float32Array(0);
    let img: ImageData | null = null;
    let scale = 1;

    const IX = (i: number, j: number) => i + j * S;

    const resize = () => {
      const w = target.clientWidth;
      const h = target.clientHeight;
      NX = Math.max(40, Math.min(150, Math.round(w / 9)));
      scale = w / NX;
      NY = Math.max(30, Math.round(h / scale));
      S = NX + 2;
      const n = S * (NY + 2);
      [u, v, u0, v0, d, d0, k, k0, curl] = Array.from({ length: 9 }, () => new Float32Array(n));
      canvas.width = NX;
      canvas.height = NY;
      img = ctx.createImageData(NX, NY);
    };

    // b: 0 = scalar, 1 = horizontal velocity, 2 = vertical velocity
    const bound = (b: number, x: Float32Array) => {
      for (let i = 1; i <= NX; i++) {
        x[IX(i, 0)] = b === 2 ? -x[IX(i, 1)] : x[IX(i, 1)];
        x[IX(i, NY + 1)] = b === 2 ? -x[IX(i, NY)] : x[IX(i, NY)];
      }
      for (let j = 1; j <= NY; j++) {
        x[IX(0, j)] = b === 1 ? -x[IX(1, j)] : x[IX(1, j)];
        x[IX(NX + 1, j)] = b === 1 ? -x[IX(NX, j)] : x[IX(NX, j)];
      }
    };

    const advect = (b: number, dst: Float32Array, src: Float32Array, dt: number) => {
      for (let j = 1; j <= NY; j++) {
        for (let i = 1; i <= NX; i++) {
          const id = IX(i, j);
          let x = i - dt * u[id];
          let y = j - dt * v[id];
          x = Math.max(0.5, Math.min(NX + 0.5, x));
          y = Math.max(0.5, Math.min(NY + 0.5, y));
          const i0 = x | 0;
          const j0 = y | 0;
          const s1 = x - i0;
          const t1 = y - j0;
          const a = IX(i0, j0);
          dst[id] =
            (1 - s1) * ((1 - t1) * src[a] + t1 * src[a + S]) +
            s1 * ((1 - t1) * src[a + 1] + t1 * src[a + S + 1]);
        }
      }
      bound(b, dst);
    };

    const project = () => {
      const p = u0;
      const div = v0;
      for (let j = 1; j <= NY; j++) {
        for (let i = 1; i <= NX; i++) {
          const id = IX(i, j);
          div[id] = -0.5 * (u[id + 1] - u[id - 1] + v[id + S] - v[id - S]);
          p[id] = 0;
        }
      }
      bound(0, div);
      bound(0, p);
      for (let it = 0; it < 14; it++) {
        for (let j = 1; j <= NY; j++) {
          for (let i = 1; i <= NX; i++) {
            const id = IX(i, j);
            p[id] = (div[id] + p[id - 1] + p[id + 1] + p[id - S] + p[id + S]) / 4;
          }
        }
        bound(0, p);
      }
      for (let j = 1; j <= NY; j++) {
        for (let i = 1; i <= NX; i++) {
          const id = IX(i, j);
          u[id] -= 0.5 * (p[id + 1] - p[id - 1]);
          v[id] -= 0.5 * (p[id + S] - p[id - S]);
        }
      }
      bound(1, u);
      bound(2, v);
    };

    // Vorticity confinement keeps the small swirls that make it read as smoke.
    const confine = (eps: number) => {
      for (let j = 1; j <= NY; j++) {
        for (let i = 1; i <= NX; i++) {
          const id = IX(i, j);
          curl[id] = 0.5 * (v[id + 1] - v[id - 1] - (u[id + S] - u[id - S]));
        }
      }
      for (let j = 2; j < NY; j++) {
        for (let i = 2; i < NX; i++) {
          const id = IX(i, j);
          const gx = 0.5 * (Math.abs(curl[id + 1]) - Math.abs(curl[id - 1]));
          const gy = 0.5 * (Math.abs(curl[id + S]) - Math.abs(curl[id - S]));
          const len = Math.hypot(gx, gy) + 1e-5;
          u[id] += eps * (gy / len) * curl[id];
          v[id] -= eps * (gx / len) * curl[id];
        }
      }
    };

    const splat = (cx: number, cy: number, fx: number, fy: number, amount: number, warm: number, radius: number) => {
      const r = Math.ceil(radius * 2.5);
      const ci = Math.round(cx);
      const cj = Math.round(cy);
      for (let j = Math.max(1, cj - r); j <= Math.min(NY, cj + r); j++) {
        for (let i = Math.max(1, ci - r); i <= Math.min(NX, ci + r); i++) {
          const dx = i - cx;
          const dy = j - cy;
          const g = Math.exp(-(dx * dx + dy * dy) / (radius * radius));
          if (g < 0.01) continue;
          const id = IX(i, j);
          u[id] += fx * g;
          v[id] += fy * g;
          const add = amount * g;
          k[id] = (k[id] * d[id] + warm * add) / (d[id] + add + 1e-6);
          d[id] = Math.min(3, d[id] + add);
        }
      }
    };

    /* ---------- input ---------- */
    const pointer = { x: -1, y: -1, px: -1, py: -1, moved: false };
    const toGrid = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      return { x: ((e.clientX - r.left) / r.width) * NX + 0.5, y: ((e.clientY - r.top) / r.height) * NY + 0.5 };
    };
    const onMove = (e: PointerEvent) => {
      const g = toGrid(e);
      if (pointer.x < 0) {
        pointer.px = g.x;
        pointer.py = g.y;
      }
      pointer.x = g.x;
      pointer.y = g.y;
      pointer.moved = true;
    };
    const onLeave = () => {
      pointer.x = -1;
      pointer.moved = false;
    };
    const onDown = (e: PointerEvent) => {
      const g = toGrid(e);
      for (let a = 0; a < 8; a++) {
        const ang = (a / 8) * Math.PI * 2;
        splat(g.x, g.y, Math.cos(ang) * 6, Math.sin(ang) * 6 - 1, 0.5, Math.random(), 2.4);
      }
    };
    target.addEventListener("pointermove", onMove, { passive: true });
    target.addEventListener("pointerdown", onDown, { passive: true });
    target.addEventListener("pointerleave", onLeave);

    /* ---------- step & render ---------- */
    let t = 0;
    const step = () => {
      t += 1 / 60;
      const dt = 1;

      // Slow ambient wisps rising from the bottom so the hero is never empty.
      for (let e = 0; e < 3; e++) {
        const ex = NX * (0.18 + e * 0.32) + Math.sin(t * 0.4 + e * 2.1) * NX * 0.08;
        splat(ex, NY - 2, Math.sin(t * 0.9 + e) * 0.3, -0.5, 0.035, e === 1 ? 0.9 : 0.1, 2.2);
      }

      if (pointer.moved && pointer.x >= 0) {
        const dx = pointer.x - pointer.px;
        const dy = pointer.y - pointer.py;
        const dist = Math.hypot(dx, dy);
        const steps = Math.max(1, Math.ceil(dist / 1.5));
        const warm = 0.5 + 0.5 * Math.sin(t * 0.7);
        for (let s = 1; s <= steps; s++) {
          const f = s / steps;
          splat(pointer.px + dx * f, pointer.py + dy * f, (dx / steps) * 1.6, (dy / steps) * 1.6, 0.22 / steps + 0.06, warm, 2.2);
        }
        pointer.px = pointer.x;
        pointer.py = pointer.y;
        pointer.moved = false;
      }

      // Buoyancy: denser smoke rises.
      for (let id = 0; id < d.length; id++) v[id] -= 0.012 * d[id];

      confine(0.35);
      project();
      u0.set(u);
      v0.set(v);
      const tu = u0;
      const tv = v0;
      // Advect velocity through itself using copies of the current field.
      for (let j = 1; j <= NY; j++) {
        for (let i = 1; i <= NX; i++) {
          const id = IX(i, j);
          let x = i - dt * tu[id];
          let y = j - dt * tv[id];
          x = Math.max(0.5, Math.min(NX + 0.5, x));
          y = Math.max(0.5, Math.min(NY + 0.5, y));
          const i0 = x | 0;
          const j0 = y | 0;
          const s1 = x - i0;
          const t1 = y - j0;
          const a = IX(i0, j0);
          u[id] = (1 - s1) * ((1 - t1) * tu[a] + t1 * tu[a + S]) + s1 * ((1 - t1) * tu[a + 1] + t1 * tu[a + S + 1]);
          v[id] = (1 - s1) * ((1 - t1) * tv[a] + t1 * tv[a + S]) + s1 * ((1 - t1) * tv[a + 1] + t1 * tv[a + S + 1]);
        }
      }
      bound(1, u);
      bound(2, v);
      project();

      d0.set(d);
      k0.set(k);
      advect(0, d, d0, dt);
      advect(0, k, k0, dt);

      for (let id = 0; id < d.length; id++) {
        d[id] *= 0.986;
        u[id] *= 0.995;
        v[id] *= 0.995;
      }
    };

    const render = () => {
      if (!img) return;
      const px = img.data;
      let o = 0;
      for (let j = 1; j <= NY; j++) {
        for (let i = 1; i <= NX; i++) {
          const id = IX(i, j);
          const a = Math.min(1, d[id]);
          const w = k[id];
          // smoky white mixed toward warm gold
          px[o] = 222 + (240 - 222) * w;
          px[o + 1] = 224 + (196 - 224) * w;
          px[o + 2] = 218 + (110 - 218) * w;
          px[o + 3] = a * 170;
          o += 4;
        }
      }
      ctx.putImageData(img, 0, 0);
    };

    let visible = true;
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
    io.observe(target);

    let raf = 0;
    const loop = () => {
      if (visible) {
        step();
        render();
      }
      raf = requestAnimationFrame(loop);
    };

    resize();
    let ro: ResizeObserver | null = null;
    let lastW = target.clientWidth;
    ro = new ResizeObserver(() => {
      // Ignore height-only jitter (mobile URL bar) to avoid wiping the smoke.
      if (Math.abs(target.clientWidth - lastW) < 2) return;
      lastW = target.clientWidth;
      resize();
    });
    ro.observe(target);

    if (reduce) {
      // A single still frame of soft haze instead of animation.
      for (let n = 0; n < 160; n++) step();
      render();
    } else {
      raf = requestAnimationFrame(loop);
    }

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro?.disconnect();
      target.removeEventListener("pointermove", onMove);
      target.removeEventListener("pointerdown", onDown);
      target.removeEventListener("pointerleave", onLeave);
    };
  }, [targetRef]);

  return (
    <canvas
      ref={ref}
      className="pointer-events-none absolute inset-0 h-full w-full"
      style={{ filter: "blur(6px)", imageRendering: "auto" }}
      aria-hidden="true"
    />
  );
}

function HeroEmblem({ className = "" }: { className?: string }) {
  return (
    <div className={`relative ${className}`} aria-hidden="true">
      <div
        className="absolute -inset-[30%] rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(244,196,48,0.16) 0%, rgba(31,157,72,0.08) 40%, rgba(10,11,10,0) 70%)",
        }}
      />
      <motion.div
        className="relative"
        initial={{ opacity: 0, scale: 0.92, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 1.1, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={LOGO_SRC}
          alt=""
          className="h-auto w-full drop-shadow-[0_24px_60px_rgba(0,0,0,0.7)]"
          draggable={false}
        />
      </motion.div>
    </div>
  );
}

function Hero() {
  const heroRef = useRef<HTMLElement>(null);

  const stats: [string, string][] = [
    [String(LOCATION_COUNT), "Locations"],
    [String(REGIONS.length), "Provinces"],
    ["24h", "Plumstead flagship"],
  ];

  return (
    <section ref={heroRef} id="top" className="relative flex min-h-[100svh] items-center overflow-hidden bg-[#0A0B0A]">
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 15% 0%, rgba(31,157,72,0.22), transparent 55%), radial-gradient(ellipse at 85% 10%, rgba(244,196,48,0.12), transparent 50%), radial-gradient(ellipse at 50% 120%, rgba(226,35,26,0.14), transparent 55%)",
        }}
      />
      <FluidSmoke targetRef={heroRef} />
      {/* After the smoke so the buildings sit in front of it. */}
      <Skyline className="pointer-events-none absolute inset-x-0 bottom-0 h-40 w-full text-[#141614] sm:h-56" />

      <div className="relative z-10 mx-auto grid w-full max-w-6xl items-center gap-12 px-5 pb-28 pt-32 lg:grid-cols-[1.35fr_1fr]">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-3xl"
        >
          <HeroEmblem className="mb-10 w-56 sm:w-64 lg:hidden" />
          <p className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-[#0A0B0A]/40 px-4 py-1.5 text-sm text-[#F7F5EF]/75 backdrop-blur">
            <MapPin className="h-4 w-4 text-[#F4C430]" />
            Durban &middot; Cape Town
          </p>
          <h1 className="font-display text-5xl font-semibold leading-[1.02] tracking-tight text-[#F7F5EF] sm:text-6xl lg:text-[4.5rem]">
            Rise above
            <br />
            the <span className="text-[#F4C430]">city.</span>
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-[#F7F5EF]/70">
            Members&apos; lounges, bud shops and rooftop spaces across KwaZulu-Natal and the Western
            Cape. Pull up a seat, take in the view and let the evening slow down.
          </p>

          <div className="mt-10 flex flex-wrap gap-3">
            <a
              href="#locations"
              className="inline-flex items-center gap-2 rounded-full bg-[#F4C430] px-6 py-3.5 text-sm font-semibold text-[#0A0B0A] transition-colors hover:bg-[#f7d35c]"
            >
              <MapPin className="h-4 w-4" />
              Find your nearest
            </a>
            <a
              href="#menu"
              className={`${glass} inline-flex items-center gap-2 rounded-full px-6 py-3.5 text-sm font-medium text-[#F7F5EF] transition-colors hover:border-[#F4C430]/60`}
            >
              <Leaf className="h-4 w-4 text-[#F4C430]" />
              Explore menu
            </a>
          </div>

          <dl className="mt-12 flex flex-wrap gap-x-10 gap-y-4">
            {stats.map(([value, label]) => (
              <div key={label}>
                <dt className="sr-only">{label}</dt>
                <dd>
                  <span className="block font-display text-3xl font-semibold text-[#F7F5EF]">{value}</span>
                  <span className="text-xs uppercase tracking-[0.18em] text-[#F7F5EF]/50">{label}</span>
                </dd>
              </div>
            ))}
          </dl>
          <p className="mt-8 hidden text-xs text-[#F7F5EF]/40 motion-reduce:hidden md:block">
            Move your cursor to stir the smoke. Click for a puff.
          </p>
        </motion.div>

        <HeroEmblem className="mx-auto hidden w-full max-w-[26rem] lg:block" />
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-b from-transparent to-[#121412]" />
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Locations                                                           */
/* ------------------------------------------------------------------ */

function LocationsSection() {
  const [regionId, setRegionId] = useState(REGIONS[0].id);
  const region = REGIONS.find((r) => r.id === regionId) ?? REGIONS[0];
  const [selectedId, setSelectedId] = useState(region.locations[0].id);
  const selected = region.locations.find((l) => l.id === selectedId) ?? region.locations[0];

  const pickRegion = (id: string) => {
    const next = REGIONS.find((r) => r.id === id) ?? REGIONS[0];
    setRegionId(next.id);
    setSelectedId(next.locations[0].id);
  };

  const features = [
    {
      icon: <Users className="h-5 w-5" />,
      title: "Members' lounges",
      text: "Comfortable, private spaces to sit back with friends. Ask staff about joining.",
    },
    {
      icon: <Building2 className="h-5 w-5" />,
      title: "Rooftop sessions",
      text: "Open-air seating above the street at Isipingo Beach and Claremont.",
    },
    {
      icon: <Moon className="h-5 w-5" />,
      title: "Open late",
      text: "Sea Point keeps late hours, and our Plumstead flagship never closes.",
    },
  ];

  return (
    <section id="locations" className="scroll-mt-20 bg-[#121412] py-24">
      <div className="mx-auto max-w-6xl px-5">
        <SectionHeading
          icon={<MapPin className="h-5 w-5" />}
          title={`${LOCATION_COUNT} spots, two coasts`}
          intro="From the Durban beachfront to the Cape Town southern suburbs. Every store has its own personality, so find the one that suits your evening."
        />

        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          {features.map((f) => (
            <div key={f.title} className={`${glass} rounded-2xl p-6`}>
              <span className="text-[#F4C430]">{f.icon}</span>
              <p className="mt-4 font-display text-lg font-semibold text-[#F7F5EF]">{f.title}</p>
              <p className="mt-1 text-sm leading-relaxed text-[#F7F5EF]/60">{f.text}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-wrap gap-2" role="tablist" aria-label="Regions">
          {REGIONS.map((r) => {
            const on = r.id === regionId;
            return (
              <button
                key={r.id}
                role="tab"
                aria-selected={on}
                onClick={() => pickRegion(r.id)}
                className={`rounded-full border px-5 py-2.5 text-left text-sm transition-colors ${
                  on
                    ? "border-[#F4C430] bg-[#F4C430] text-[#0A0B0A]"
                    : "border-white/15 text-[#F7F5EF]/70 hover:border-white/30 hover:text-[#F7F5EF]"
                }`}
              >
                <span className="font-semibold">{r.title}</span>
                <span className={on ? "text-[#0A0B0A]/70" : "text-[#F7F5EF]/45"}>
                  {" "}
                  &middot; {r.metro} &middot; {r.locations.length}
                </span>
              </button>
            );
          })}
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_1.15fr]">
          <AnimatePresence mode="wait">
            <motion.ul
              key={region.id}
              role="tabpanel"
              initial={{ opacity: 0, filter: "blur(8px)" }}
              animate={{ opacity: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, filter: "blur(8px)" }}
              transition={{ duration: 0.3 }}
              className="space-y-3"
            >
              {region.locations.map((l, i) => {
                const on = l.id === selected.id;
                return (
                  <motion.li
                    key={l.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, delay: 0.04 * i }}
                  >
                    <button
                      onClick={() => setSelectedId(l.id)}
                      aria-pressed={on}
                      className={`w-full rounded-2xl border p-5 text-left transition-colors ${
                        on
                          ? "border-[#F4C430]/70 bg-[#F4C430]/[0.06]"
                          : "border-white/10 bg-white/[0.02] hover:border-white/25"
                      }`}
                    >
                      <span className="flex items-start justify-between gap-4">
                        <span>
                          <span className="block font-display text-xl font-semibold text-[#F7F5EF]">
                            {l.name}
                            {l.alias && (
                              <span className="ml-2 align-middle text-xs font-normal uppercase tracking-[0.14em] text-[#F4C430]/80">
                                {l.alias}
                              </span>
                            )}
                          </span>
                          <span className="mt-1 block text-sm text-[#F7F5EF]/60">{fullAddress(l)}</span>
                        </span>
                        <span
                          className={`mt-1 grid h-8 w-8 shrink-0 place-items-center rounded-full border transition-colors ${
                            on ? "border-[#F4C430] bg-[#F4C430] text-[#0A0B0A]" : "border-white/15 text-[#F7F5EF]/50"
                          }`}
                        >
                          <MapPin className="h-3.5 w-3.5" />
                        </span>
                      </span>
                      <span className="mt-3 flex flex-wrap gap-1.5">
                        {l.tags.map((t) => (
                          <span
                            key={t}
                            className="rounded-full border border-white/10 px-2.5 py-0.5 text-xs text-[#F7F5EF]/65"
                          >
                            {t}
                          </span>
                        ))}
                      </span>
                    </button>
                  </motion.li>
                );
              })}
            </motion.ul>
          </AnimatePresence>

          <div className={`${glass} flex flex-col overflow-hidden rounded-3xl lg:sticky lg:top-24 lg:self-start`}>
            <div className="relative h-72 sm:h-80">
              <iframe
                key={selected.id}
                title={`Map to ${BRAND} ${selected.name}`}
                src={embedUrl(fullAddress(selected))}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="absolute inset-0 h-full w-full"
                style={{ border: 0, filter: "grayscale(0.55) contrast(1.05) brightness(0.85)" }}
              />
            </div>
            <AnimatePresence mode="wait">
              <motion.div
                key={selected.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="space-y-4 p-7"
              >
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-[#F7F5EF]/45">
                    {region.title} &middot; {region.metro}
                  </p>
                  <h3 className="mt-2 font-display text-2xl font-semibold text-[#F7F5EF]">
                    {BRAND} {selected.name}
                  </h3>
                  {selected.alias && (
                    <p className="mt-1 text-sm text-[#F4C430]">Trading as {selected.alias}</p>
                  )}
                </div>
                <p className="text-sm leading-relaxed text-[#F7F5EF]/70">{selected.note}</p>
                <p className="flex gap-3 text-sm text-[#F7F5EF]">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#F4C430]" />
                  {fullAddress(selected)}
                </p>
                <a
                  href={directionsUrl(fullAddress(selected))}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-[#F4C430] px-5 py-3 text-sm font-semibold text-[#0A0B0A] transition-colors hover:bg-[#f7d35c]"
                >
                  <Navigation className="h-4 w-4" />
                  Get directions
                  <ChevronRight className="h-4 w-4" />
                </a>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        <p className="mt-8 text-sm text-[#F7F5EF]/45">
          Hours and offerings vary by store. Adults 18+ only.
        </p>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Menu                                                                */
/* ------------------------------------------------------------------ */

function MenuSection() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(MENU[0].id);
  const panelRef = useRef<HTMLDivElement>(null);
  const { canvasRef, puff } = useSmokeBurst();
  const group = MENU.find((g) => g.id === active) ?? MENU[0];

  const puffFrom = (el: HTMLElement | null, count?: number, spread?: number) => {
    const panel = panelRef.current;
    if (!panel || !el) return;
    const p = panel.getBoundingClientRect();
    const r = el.getBoundingClientRect();
    puff(r.left + r.width / 2 - p.left, r.top + r.height / 2 - p.top, count, spread ?? p.width * 0.8);
  };

  const toggle = (e: { currentTarget: HTMLElement }) => {
    puffFrom(e.currentTarget, open ? 40 : 60);
    if (!open) {
      // Follow the panel down as it expands so the smoke clears over the whole menu.
      for (let i = 1; i <= 4; i++) {
        setTimeout(() => {
          const panel = panelRef.current;
          if (!panel) return;
          const h = panel.clientHeight;
          puff(panel.clientWidth / 2, h * 0.6, 26, panel.clientWidth * 0.9, h * 0.7);
        }, i * 140);
      }
    }
    setOpen((o) => !o);
  };

  return (
    <section id="menu" className="scroll-mt-20 bg-[#121412] py-24">
      <div className="mx-auto max-w-6xl px-5">
        <SectionHeading
          icon={<Leaf className="h-5 w-5" />}
          title="What's on the shelf"
          intro="An overview of what we carry. Exact strains, stock and prices change often, so come in and see the shelf for yourself."
        />

        <div ref={panelRef} className={`${glass} relative mt-10 overflow-hidden rounded-3xl`}>
          <button
            onClick={toggle}
            aria-expanded={open}
            aria-controls="menu-panel"
            className="group flex w-full items-center justify-between gap-6 px-6 py-6 text-left sm:px-8"
          >
            <span>
              <span className="block font-display font-semibold text-2xl text-[#F7F5EF]">
                {open ? "The menu" : "Open the menu"}
              </span>
              <span className="mt-1 block text-sm text-[#F7F5EF]/55">
                {MENU.map((g) => g.title).join(" · ")}
              </span>
            </span>
            <span
              className={`grid h-11 w-11 shrink-0 place-items-center rounded-full border border-[#F4C430]/50 text-[#F4C430] transition-all duration-500 group-hover:bg-[#F4C430] group-hover:text-[#0A0B0A] ${
                open ? "rotate-180" : ""
              }`}
            >
              <ChevronDown className="h-5 w-5" />
            </span>
          </button>

          <AnimatePresence initial={false}>
            {open && (
              <motion.div
                id="menu-panel"
                key="panel"
                initial={{ height: 0 }}
                animate={{ height: "auto" }}
                exit={{ height: 0 }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                className="overflow-hidden"
              >
                <motion.div
                  initial={{ opacity: 0, filter: "blur(14px)", y: 12 }}
                  animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
                  exit={{ opacity: 0, filter: "blur(14px)" }}
                  transition={{ duration: 1, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
                  className="border-t border-white/10 px-6 pb-8 pt-6 sm:px-8"
                >
                  <div className="-mx-6 overflow-x-auto px-6 pb-2 sm:-mx-8 sm:px-8">
                    <div className="flex w-max gap-2" role="tablist" aria-label="Menu categories">
                      {MENU.map((g) => {
                        const on = g.id === active;
                        return (
                          <button
                            key={g.id}
                            role="tab"
                            aria-selected={on}
                            onClick={(e) => {
                              if (!on) puffFrom(e.currentTarget, 18, 120);
                              setActive(g.id);
                            }}
                            className={`inline-flex items-center gap-2 whitespace-nowrap rounded-full border px-4 py-2 text-sm transition-colors ${
                              on
                                ? "border-[#F4C430] bg-[#F4C430] text-[#0A0B0A]"
                                : "border-white/10 text-[#F7F5EF]/70 hover:border-white/30 hover:text-[#F7F5EF]"
                            }`}
                          >
                            {g.icon}
                            {g.title}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <AnimatePresence mode="wait">
                    <motion.div
                      key={group.id}
                      role="tabpanel"
                      initial={{ opacity: 0, filter: "blur(8px)" }}
                      animate={{ opacity: 1, filter: "blur(0px)" }}
                      exit={{ opacity: 0, filter: "blur(8px)" }}
                      transition={{ duration: 0.35 }}
                      className="mt-6"
                    >
                      <p className="max-w-2xl text-sm leading-relaxed text-[#F7F5EF]/60">{group.blurb}</p>
                      <ul className="mt-5 grid gap-3 sm:grid-cols-2">
                        {group.types.map((t, i) => (
                          <motion.li
                            key={t.name}
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.35, delay: 0.05 * i }}
                            className="flex gap-4 rounded-2xl bg-[#0A0B0A]/55 p-4"
                          >
                            <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-full border border-white/10 text-[#F4C430]">
                              <Sparkles className="h-3.5 w-3.5" />
                            </span>
                            <span>
                              <span className="block font-display font-semibold text-lg text-[#F7F5EF]">{t.name}</span>
                              <span className="mt-0.5 block text-sm leading-relaxed text-[#F7F5EF]/60">
                                {t.note}
                              </span>
                            </span>
                          </motion.li>
                        ))}
                      </ul>
                    </motion.div>
                  </AnimatePresence>

                  <div className="mt-8 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-white/10 px-5 py-4">
                    <p className="flex items-center gap-3 text-sm text-[#F7F5EF]/70">
                      <Store className="h-4 w-4 shrink-0 text-[#F4C430]" />
                      Strains, stock and prices vary by store and are available in store only.
                    </p>
                    <a
                      href="#locations"
                      className="inline-flex items-center gap-2 rounded-full bg-[#1F9D48] px-4 py-2.5 text-sm font-medium text-[#F7F5EF] transition-colors hover:bg-[#25b553]"
                    >
                      Find a store
                      <ChevronRight className="h-4 w-4" />
                    </a>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          <canvas
            ref={canvasRef}
            className="pointer-events-none absolute inset-0 z-10 h-full w-full"
            aria-hidden="true"
          />
        </div>

        <p className="mt-8 text-sm text-[#F7F5EF]/45">Adults 18+ only. Please use responsibly.</p>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Knowledge & research                                                */
/* ------------------------------------------------------------------ */

function Accordion() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="space-y-3">
      {RESEARCH.map((r, i) => {
        const isOpen = open === i;
        const panelId = `research-panel-${i}`;
        return (
          <div key={r.title} className={`${glass} overflow-hidden rounded-2xl`}>
            <button
              onClick={() => setOpen(isOpen ? null : i)}
              aria-expanded={isOpen}
              aria-controls={panelId}
              className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
            >
              <span className="font-medium text-[#F7F5EF]">{r.title}</span>
              <ChevronDown
                className={`h-5 w-5 shrink-0 text-[#F4C430] transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
              />
            </button>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  id={panelId}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                >
                  <div className="space-y-3 px-6 pb-6 text-sm leading-relaxed text-[#F7F5EF]/70">
                    {r.body.map((p) => (
                      <p key={p}>{p}</p>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}

function KnowledgeSection() {
  const legalPoints = [
    {
      title: "2018: private use decriminalised",
      text: "In Minister of Justice v Prince, the Constitutional Court ruled that adults may use, possess and grow cannabis in private.",
    },
    {
      title: "2024: Cannabis for Private Purposes Act",
      text: "Signed into law in May 2024, the Act puts that ruling into legislation. It regulates adult private possession and cultivation and provides for expunging some past cannabis convictions.",
    },
    {
      title: "What it does not cover",
      text: "The Act does not create a legal framework for buying or selling cannabis. Public use, use around children and supplying minors remain offences, and possession limits are set by regulation.",
    },
    {
      title: "Medicinal products",
      text: "Medicinal cannabis and higher-dose CBD products are regulated separately by SAHPRA.",
    },
  ];

  return (
    <section id="knowledge" className="scroll-mt-20 bg-[#0A0B0A] py-24">
      <div className="mx-auto max-w-6xl px-5">
        <SectionHeading
          icon={<BookOpen className="h-5 w-5" />}
          title="South African cannabis law and research"
          intro="Plain-language background on the law and the science, so you can make informed choices."
        />

        <div className="mt-12 grid gap-8 lg:grid-cols-5">
          <div className={`${glass} rounded-3xl p-7 lg:col-span-2`}>
            <div className="flex items-center gap-3">
              <Scale className="h-5 w-5 text-[#F4C430]" />
              <h3 className="font-display font-semibold text-xl">The legal framework</h3>
            </div>
            <ol className="mt-6 space-y-5 border-l border-white/10 pl-5">
              {legalPoints.map((p) => (
                <li key={p.title} className="relative">
                  <span className="absolute -left-[25px] top-1.5 h-2 w-2 rounded-full bg-[#F4C430]" />
                  <p className="text-sm font-semibold text-[#F7F5EF]">{p.title}</p>
                  <p className="mt-1 text-sm leading-relaxed text-[#F7F5EF]/65">{p.text}</p>
                </li>
              ))}
            </ol>
            <p className="mt-6 text-xs leading-relaxed text-[#F7F5EF]/45">
              General information, not legal advice. Regulations are still being finalised, so check
              current rules before relying on them.
            </p>
          </div>

          <div className="lg:col-span-3">
            <Accordion />
            <p className="mt-5 text-xs leading-relaxed text-[#F7F5EF]/45">
              Research summaries are educational and not medical advice. Speak to a healthcare
              professional before using cannabis for a health condition.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}


/* ------------------------------------------------------------------ */
/* Leaf Runner (canvas mini-game)                                      */
/* ------------------------------------------------------------------ */

type ObstacleKind = "gust" | "scissors" | "jar";
interface Obstacle {
  kind: ObstacleKind;
  x: number;
  y: number;
  w: number;
  h: number;
  wob: number;
}
interface Dust {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
}
type Mode = "ready" | "running" | "over";

const GW = 720;
const GH = 280;
const GROUND = GH - 48;
const PX = 84;
const PW = 34;
const PH = 34;
const GRAVITY = 2400;
const JUMP_V = -780;
const HI_KEY = "r420-leaf-runner-hi";
const OB_SPECS: Record<ObstacleKind, { w: number; h: number }> = {
  gust: { w: 52, h: 26 },
  scissors: { w: 36, h: 32 },
  jar: { w: 28, h: 40 },
};

function LeafRunner() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const actionRef = useRef<() => void>(() => {});
  const mutedRef = useRef(false);
  const [mode, setMode] = useState<Mode>("ready");
  const [finalScore, setFinalScore] = useState(0);
  const [hi, setHi] = useState(0);
  const [muted, setMuted] = useState(false);

  useEffect(() => {
    mutedRef.current = muted;
  }, [muted]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const section = sectionRef.current;
    if (!canvas || !section) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = GW * dpr;
    canvas.height = GH * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const s = {
      mode: "ready" as Mode,
      y: GROUND - PH,
      vy: 0,
      onGround: true,
      squash: 0,
      obstacles: [] as Obstacle[],
      dust: [] as Dust[],
      speed: 380,
      score: 0,
      spawnIn: 1,
      t: 0,
      bgX: 0,
      hi: 0,
      milestone: 0,
      flash: 0,
      overAt: 0,
    };

    try {
      s.hi = Number(localStorage.getItem(HI_KEY) || 0) || 0;
      setHi(s.hi);
    } catch {
      /* storage unavailable */
    }

    let visible = false;
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting), { threshold: 0.35 });
    io.observe(section);

    /* ---------- sound ---------- */
    let audio: AudioContext | null = null;
    const tone = (from: number, to: number, dur: number, type: OscillatorType, vol: number) => {
      if (mutedRef.current) return;
      try {
        const AC =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        if (!audio) audio = new AC();
        if (audio.state === "suspended") void audio.resume();
        const now = audio.currentTime;
        const osc = audio.createOscillator();
        const gain = audio.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(from, now);
        osc.frequency.exponentialRampToValueAtTime(to, now + dur);
        gain.gain.setValueAtTime(vol, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + dur);
        osc.connect(gain).connect(audio.destination);
        osc.start(now);
        osc.stop(now + dur + 0.02);
      } catch {
        /* audio unavailable */
      }
    };

    /* ---------- game actions ---------- */
    const puff = (n: number) => {
      for (let i = 0; i < n; i++) {
        s.dust.push({
          x: PX + PW / 2 + (Math.random() - 0.5) * 16,
          y: GROUND - 2,
          vx: -60 - Math.random() * 90,
          vy: -30 - Math.random() * 60,
          life: 0.5,
        });
      }
    };

    const jump = () => {
      if (!s.onGround) return;
      s.vy = JUMP_V;
      s.onGround = false;
      s.squash = -0.28;
      puff(5);
      tone(420, 880, 0.14, "triangle", 0.06);
    };

    const start = () => {
      s.mode = "running";
      s.y = GROUND - PH;
      s.vy = 0;
      s.onGround = true;
      s.obstacles = [];
      s.dust = [];
      s.speed = 380;
      s.score = 0;
      s.spawnIn = 1;
      s.milestone = 0;
      setMode("running");
      jump();
    };

    const gameOver = () => {
      s.mode = "over";
      s.overAt = performance.now();
      tone(240, 70, 0.4, "sawtooth", 0.07);
      if (navigator.vibrate) navigator.vibrate(60);
      const final = Math.floor(s.score);
      if (final > s.hi) {
        s.hi = final;
        setHi(final);
        try {
          localStorage.setItem(HI_KEY, String(final));
        } catch {
          /* storage unavailable */
        }
      }
      setFinalScore(final);
      setMode("over");
    };

    actionRef.current = () => {
      if (s.mode === "running") jump();
      else if (s.mode === "over" && performance.now() - s.overAt < 450) return;
      else start();
    };

    const spawnObstacle = () => {
      const r = Math.random();
      const kind: ObstacleKind = r < 0.34 ? "gust" : r < 0.67 ? "scissors" : "jar";
      const { w, h } = OB_SPECS[kind];
      const lift = kind === "gust" ? Math.random() * 18 : 0;
      s.obstacles.push({ kind, x: GW + 20, y: GROUND - h - lift, w, h, wob: Math.random() * 6 });
    };

    /* ---------- update ---------- */
    const update = (dt: number) => {
      s.t += dt;
      if (s.mode === "running") {
        s.speed = Math.min(920, s.speed + 9 * dt);
        s.score += s.speed * dt * 0.025;
        s.bgX += s.speed * dt;

        s.vy += GRAVITY * dt;
        s.y += s.vy * dt;
        if (s.y >= GROUND - PH) {
          if (!s.onGround) {
            s.squash = 0.3;
            puff(3);
          }
          s.y = GROUND - PH;
          s.vy = 0;
          s.onGround = true;
        }

        s.spawnIn -= dt;
        if (s.spawnIn <= 0) {
          spawnObstacle();
          const tighten = Math.min(0.35, (s.speed - 380) / 1500);
          s.spawnIn = 0.8 + Math.random() * 0.95 * (1 - tighten);
        }

        for (const o of s.obstacles) {
          o.x -= s.speed * dt;
          o.wob += dt;
        }
        s.obstacles = s.obstacles.filter((o) => o.x + o.w > -30);

        const px = PX + 7;
        const py = s.y + 7;
        const pw = PW - 14;
        const ph = PH - 11;
        for (const o of s.obstacles) {
          const ox = o.x + 5;
          const oy = o.y + 5;
          const ow = o.w - 10;
          const oh = o.h - 8;
          if (px < ox + ow && px + pw > ox && py < oy + oh && py + ph > oy) {
            gameOver();
            break;
          }
        }

        const sc = Math.floor(s.score);
        if (sc >= s.milestone + 100) {
          s.milestone = sc - (sc % 100);
          s.flash = 0.8;
          tone(880, 1320, 0.2, "sine", 0.05);
        }
      } else if (s.mode === "ready") {
        s.bgX += 40 * dt;
      }

      s.squash += (0 - s.squash) * Math.min(1, dt * 12);
      s.flash = Math.max(0, s.flash - dt);
      for (const d of s.dust) {
        d.x += d.vx * dt;
        d.y += d.vy * dt;
        d.vy += 200 * dt;
        d.life -= dt;
      }
      s.dust = s.dust.filter((d) => d.life > 0);
    };

    /* ---------- drawing helpers ---------- */
    const mod = (a: number, n: number) => ((a % n) + n) % n;

    const roundRect = (x: number, y: number, w: number, h: number, r: number) => {
      ctx.beginPath();
      ctx.moveTo(x + r, y);
      ctx.arcTo(x + w, y, x + w, y + h, r);
      ctx.arcTo(x + w, y + h, x, y + h, r);
      ctx.arcTo(x, y + h, x, y, r);
      ctx.arcTo(x, y, x + w, y, r);
      ctx.closePath();
    };

    // Repeating city skyline; `seed` varies the building heights per layer.
    const hash = (n: number) => {
      const x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
      return x - Math.floor(x);
    };
    const skyline = (base: number, offset: number, seed: number, maxH: number, color: string, lit: boolean) => {
      const slot = 64;
      const count = 16;
      const span = slot * count;
      for (let i = 0; i < count; i++) {
        const w = 36 + hash(i + seed) * 26;
        const h = 24 + hash(i + seed * 7) * maxH;
        const x = mod(i * slot - offset, span) - slot;
        if (x > GW) continue;
        ctx.fillStyle = color;
        ctx.fillRect(x, base - h, w, h);
        if (!lit) continue;
        for (let wy = base - h + 8; wy < base - 6; wy += 10) {
          for (let wx = 6; wx < w - 6; wx += 9) {
            if (hash(i * 13 + wx + wy * 3 + seed) > 0.82) {
              ctx.fillStyle = "rgba(244,196,48,0.35)";
              ctx.fillRect(x + wx, wy, 3, 4);
            }
          }
        }
      }
    };

    const drawLeaf = () => {
      const cx = PX + PW / 2;
      const cy = s.y + PH / 2;
      const airborne = !s.onGround;
      const rot = airborne
        ? Math.max(-0.5, Math.min(0.5, s.vy / 1600))
        : Math.sin(s.t * (s.mode === "running" ? 18 : 3)) * 0.06;

      // ground shadow
      const heightAbove = GROUND - (s.y + PH);
      const shadowW = Math.max(8, 20 - heightAbove * 0.08);
      ctx.fillStyle = "rgba(10,11,10,0.35)";
      ctx.beginPath();
      ctx.ellipse(cx, GROUND + 3, shadowW, 3.5, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.save();
      ctx.translate(cx, cy);
      ctx.scale(1 + s.squash * 0.6, 1 - s.squash * 0.6);
      ctx.rotate(0.55 + rot);

      // stem
      ctx.strokeStyle = COLORS.gold;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, 18);
      ctx.quadraticCurveTo(2, 24, -2, 27);
      ctx.stroke();

      // blade
      const grad = ctx.createLinearGradient(-14, -20, 14, 20);
      grad.addColorStop(0, "#5fd17f");
      grad.addColorStop(1, COLORS.green);
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.moveTo(0, -21);
      ctx.bezierCurveTo(17, -10, 16, 10, 0, 19);
      ctx.bezierCurveTo(-16, 10, -17, -10, 0, -21);
      ctx.fill();
      ctx.strokeStyle = "rgba(247,245,239,0.35)";
      ctx.lineWidth = 1;
      ctx.stroke();

      // veins
      ctx.strokeStyle = "rgba(10,11,10,0.45)";
      ctx.beginPath();
      ctx.moveTo(0, -17);
      ctx.lineTo(0, 17);
      for (const vy of [-8, 0, 8]) {
        ctx.moveTo(0, vy + 4);
        ctx.lineTo(8, vy - 2);
        ctx.moveTo(0, vy + 4);
        ctx.lineTo(-8, vy - 2);
      }
      ctx.stroke();

      // eye
      ctx.rotate(-0.55 - rot);
      ctx.fillStyle = COLORS.cream;
      ctx.beginPath();
      ctx.arc(6, -5, 3.6, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = COLORS.ink;
      ctx.beginPath();
      if (s.mode === "over") {
        ctx.fillRect(4, -5.6, 5, 1.4);
      } else {
        ctx.arc(7, -5, 1.8, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    };

    const drawObstacle = (o: Obstacle) => {
      if (o.kind === "jar") {
        roundRect(o.x, o.y + 8, o.w, o.h - 8, 6);
        ctx.fillStyle = "rgba(247,245,239,0.14)";
        ctx.fill();
        ctx.strokeStyle = "rgba(247,245,239,0.55)";
        ctx.lineWidth = 1.5;
        ctx.stroke();
        roundRect(o.x - 2, o.y, o.w + 4, 9, 3);
        ctx.fillStyle = COLORS.gold;
        ctx.fill();
        ctx.fillStyle = COLORS.green;
        ctx.fillRect(o.x + 3, o.y + 20, o.w - 6, 9);
        ctx.fillStyle = "rgba(247,245,239,0.35)";
        ctx.fillRect(o.x + 4, o.y + 12, 3, o.h - 18);
      } else if (o.kind === "scissors") {
        const open = Math.sin(o.wob * 10) * 3;
        const hx1 = o.x + 9;
        const hx2 = o.x + o.w - 9;
        const hy = o.y + o.h - 7;
        ctx.strokeStyle = "#cdd6d2";
        ctx.lineWidth = 3;
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.moveTo(hx1, hy - 4);
        ctx.lineTo(o.x + o.w - 6 + open, o.y + 2);
        ctx.moveTo(hx2, hy - 4);
        ctx.lineTo(o.x + 6 - open, o.y + 2);
        ctx.stroke();
        ctx.strokeStyle = COLORS.gold;
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.arc(hx1, hy, 5.5, 0, Math.PI * 2);
        ctx.moveTo(hx2 + 5.5, hy);
        ctx.arc(hx2, hy, 5.5, 0, Math.PI * 2);
        ctx.stroke();
        ctx.fillStyle = COLORS.gold;
        ctx.beginPath();
        ctx.arc(o.x + o.w / 2, o.y + o.h / 2 + 1, 2.2, 0, Math.PI * 2);
        ctx.fill();
        ctx.lineCap = "butt";
      } else {
        ctx.strokeStyle = "rgba(247,245,239,0.75)";
        ctx.lineWidth = 2.4;
        ctx.lineCap = "round";
        for (let i = 0; i < 3; i++) {
          const ly = o.y + 5 + i * 8;
          const shift = Math.sin(o.wob * 8 + i) * 3;
          const x0 = o.x + i * 4;
          const x1 = o.x + o.w - 10 + shift;
          ctx.beginPath();
          ctx.moveTo(x0, ly);
          for (let x = x0; x <= x1; x += 4) {
            ctx.lineTo(x, ly + Math.sin(x * 0.35 + o.wob * 12) * 1.5);
          }
          ctx.arc(x1, ly - 4, 4, Math.PI / 2, -Math.PI, true);
          ctx.stroke();
        }
        ctx.lineCap = "butt";
      }
    };

    const pad = (n: number) => String(Math.floor(n)).padStart(5, "0");

    /* ---------- draw ---------- */
    const draw = () => {
      const sky = ctx.createLinearGradient(0, 0, 0, GH);
      sky.addColorStop(0, COLORS.ink);
      sky.addColorStop(1, COLORS.char);
      ctx.fillStyle = sky;
      ctx.fillRect(0, 0, GW, GH);

      // stars
      ctx.fillStyle = "rgba(247,245,239,0.5)";
      for (let i = 0; i < 40; i++) {
        const x = mod(i * 151 - s.bgX * 0.03, GW);
        const y = 10 + ((i * 67) % 120);
        const tw = 0.6 + 0.4 * Math.sin(s.t * 2 + i);
        ctx.globalAlpha = tw;
        ctx.fillRect(x, y, 1.4, 1.4);
      }
      ctx.globalAlpha = 1;

      // moon
      const glow = ctx.createRadialGradient(GW - 110, 62, 0, GW - 110, 62, 110);
      glow.addColorStop(0, "rgba(247,245,239,0.22)");
      glow.addColorStop(1, "rgba(247,245,239,0)");
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, GW, GH);
      ctx.fillStyle = "rgba(247,245,239,0.88)";
      ctx.beginPath();
      ctx.arc(GW - 110, 62, 16, 0, Math.PI * 2);
      ctx.fill();

      skyline(GROUND, s.bgX * 0.15, 3, 110, "#191c19", false);
      skyline(GROUND, s.bgX * 0.35, 11, 70, "#222622", true);

      // rooftop deck with a parapet stripe in the brand colours
      const deck = ctx.createLinearGradient(0, GROUND, 0, GH);
      deck.addColorStop(0, "#2a2e2a");
      deck.addColorStop(1, "#151715");
      ctx.fillStyle = deck;
      ctx.fillRect(0, GROUND, GW, GH - GROUND);
      const third = GW / 3;
      [COLORS.red, COLORS.gold, COLORS.green].forEach((c, i) => {
        ctx.fillStyle = c;
        ctx.fillRect(i * third, GROUND, third, 2);
      });
      ctx.fillStyle = "rgba(247,245,239,0.08)";
      for (let i = 0; i < 12; i++) {
        const x = mod(i * 80 - s.bgX, GW + 80) - 40;
        ctx.fillRect(x, GROUND + 2, 1.5, GH - GROUND);
      }

      for (const o of s.obstacles) drawObstacle(o);

      for (const d of s.dust) {
        ctx.fillStyle = `rgba(244,196,48,${Math.max(0, d.life * 1.6)})`;
        ctx.beginPath();
        ctx.arc(d.x, d.y, 2.2, 0, Math.PI * 2);
        ctx.fill();
      }

      drawLeaf();

      const blink = s.flash > 0 && Math.floor(s.flash * 10) % 2 === 0;
      ctx.font = "600 15px 'Plus Jakarta Sans', system-ui, sans-serif";
      ctx.textAlign = "right";
      ctx.fillStyle = "rgba(247,245,239,0.5)";
      ctx.fillText(`HI ${pad(s.hi)}`, GW - 110, 30);
      ctx.fillStyle = blink ? COLORS.gold : "rgba(247,245,239,0.9)";
      ctx.fillText(pad(s.score), GW - 24, 30);
      ctx.textAlign = "left";
    };

    /* ---------- loop ---------- */
    let raf = 0;
    let last = performance.now();
    const loop = (now: number) => {
      const dt = Math.min(0.033, (now - last) / 1000);
      last = now;
      if (visible || s.mode === "running") {
        update(dt);
        draw();
      }
      raf = requestAnimationFrame(loop);
    };
    draw();
    raf = requestAnimationFrame(loop);

    /* ---------- keyboard ---------- */
    const onKey = (e: KeyboardEvent) => {
      if (!["Space", "ArrowUp", "KeyW"].includes(e.code)) return;
      if (!visible) return;
      const tag = (e.target as HTMLElement | null)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "BUTTON" || tag === "A") return;
      e.preventDefault();
      if (!e.repeat) actionRef.current();
    };
    window.addEventListener("keydown", onKey);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener("keydown", onKey);
      if (audio) void audio.close();
    };
  }, []);

  return (
    <section id="play" ref={sectionRef} className="scroll-mt-20 bg-[#0A0B0A] py-24">
      <div className="mx-auto max-w-6xl px-5">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading
            icon={<Gamepad2 className="h-5 w-5" />}
            title="Leaf Runner"
            intro="Help the leaf run the rooftops, dodging wind gusts, trimming scissors and jars. Press Space or tap the game to jump."
          />
          <div className="flex items-center gap-3">
            <p className={`${glass} rounded-full px-4 py-2 text-sm text-[#F7F5EF]/75`}>
              Best: <span className="font-semibold text-[#F4C430]">{hi}</span>
            </p>
            <button
              onClick={() => setMuted((m) => !m)}
              aria-label={muted ? "Turn sound on" : "Mute sound"}
              className={`${glass} grid h-10 w-10 place-items-center rounded-full text-[#F7F5EF]/80 transition-colors hover:text-[#F4C430]`}
            >
              {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
            </button>
          </div>
        </div>

        <div
          className={`${glass} relative mt-10 cursor-pointer select-none overflow-hidden rounded-3xl`}
          style={{ touchAction: "manipulation" }}
          onPointerDown={(e) => {
            e.preventDefault();
            actionRef.current();
          }}
          role="application"
          aria-label="Leaf Runner game. Press Space or tap to jump."
        >
          <canvas
            ref={canvasRef}
            width={GW}
            height={GH}
            className="block h-auto w-full"
            style={{ aspectRatio: `${GW} / ${GH}` }}
          />

          <AnimatePresence>
            {mode !== "running" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="absolute inset-0 grid place-items-center bg-[#0A0B0A]/50 backdrop-blur-[2px]"
              >
                <div className="px-6 text-center">
                  {mode === "over" ? (
                    <>
                      <p className="font-display font-semibold text-2xl text-[#F7F5EF] sm:text-3xl">Blown off the roof</p>
                      <p className="mt-1 text-sm text-[#F7F5EF]/70">
                        Score {finalScore}
                        {finalScore > 0 && finalScore >= hi ? ", a new best" : ""}
                      </p>
                    </>
                  ) : (
                    <p className="font-display font-semibold text-2xl text-[#F7F5EF] sm:text-3xl">Ready to run?</p>
                  )}
                  <span className="mt-4 inline-flex items-center gap-2 rounded-full bg-[#F4C430] px-5 py-2.5 text-sm font-semibold text-[#0A0B0A]">
                    {mode === "over" ? "Play again" : "Start game"}
                    <ChevronRight className="h-4 w-4" />
                  </span>
                  <p className="mt-3 hidden text-xs text-[#F7F5EF]/55 sm:block">or press Space</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}


/* ------------------------------------------------------------------ */
/* Footer & page                                                       */
/* ------------------------------------------------------------------ */

function Footer() {
  return (
    <footer className="relative border-t border-white/10 bg-[#0A0B0A] pt-14">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 pb-12 md:grid-cols-[1.2fr_2fr]">
        <div>
          <Logo height={56} />
          <TriStripe className="mt-5" />
          <p className="mt-5 max-w-xs text-sm leading-relaxed text-[#F7F5EF]/55">
            Lounges, bud shops and rooftop spaces across KwaZulu-Natal and the Western Cape.
          </p>
        </div>
        <div className="grid gap-8 sm:grid-cols-2">
          {REGIONS.map((r) => (
            <div key={r.id}>
              <p className="text-xs uppercase tracking-[0.18em] text-[#F4C430]">{r.title}</p>
              <ul className="mt-4 space-y-2">
                {r.locations.map((l) => (
                  <li key={l.id}>
                    <a
                      href={directionsUrl(fullAddress(l))}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-[#F7F5EF]/60 transition-colors hover:text-[#F7F5EF]"
                    >
                      {l.name}
                      <span className="text-[#F7F5EF]/35"> &middot; {l.street}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-5 py-6 text-sm text-[#F7F5EF]/45 sm:flex-row sm:justify-between">
          <p>For adults 18 and older. Please use responsibly.</p>
          <p>
            &copy; {new Date().getFullYear()} {BRAND}
          </p>
        </div>
      </div>
    </footer>
  );
}

export default function Page() {
  return (
    <main className="min-h-screen bg-[#121412] text-[#F7F5EF]">
      <AgeGate />
      <Nav />
      <Hero />
      <LocationsSection />
      <MenuSection />
      <KnowledgeSection />
      <LeafRunner />
      <Footer />
    </main>
  );
}
