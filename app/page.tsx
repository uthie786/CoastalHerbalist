"use client";

import { useEffect, useRef, useState, type ReactNode, type RefObject } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Leaf,
  MapPin,
  Phone,
  Clock,
  Sparkles,
  BookOpen,
  Gamepad2,
  ChevronRight,
  ChevronDown,
  MessageCircle,
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
} from "lucide-react";

/* ------------------------------------------------------------------ */
/* Business constants                                                  */
/* ------------------------------------------------------------------ */

const PHONE_DISPLAY = "+27 82 605 2137";
const PHONE_TEL = "tel:+27826052137";
const WHATSAPP_NUMBER = "27826052137";
const ADDRESS = "99 Marine Dr, Oslo Beach, Margate, 4275";
// Google plus code pins the exact shopfront (Oasis Lodge building).
const MAPS_PLUS_CODE = "49M9+JP Margate";
const MAPS_DIRECTIONS = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(MAPS_PLUS_CODE)}`;
const MAPS_EMBED = `https://www.google.com/maps?q=${encodeURIComponent(MAPS_PLUS_CODE)}&output=embed`;
const OPEN_HOUR = 8;
const CLOSE_HOUR = 22;

const COLORS = {
  deep: "#0F291E",
  sage: "#52796F",
  char: "#1A1E1C",
  ochre: "#D4A373",
  cream: "#F8F9FA",
};

const waLink = (text: string) =>
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;

const glass =
  "bg-white/[0.035] backdrop-blur-xl border border-[#52796F]/30 shadow-[inset_0_1px_0_rgba(248,249,250,0.06)]";

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
    blurb: "Ready-rolled in unbleached paper, in the same four grow classes as our flower.",
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
    blurb: "Concentrates served at the counter by staff who'll walk you through it.",
    icon: <Flame className="h-4 w-4" />,
    types: [
      { name: "Dab hits", note: "Single hits served in store. First time? We'll start you small." },
      { name: "Concentrates", note: "Rosin, wax and shatter to take home, when available." },
    ],
  },
  {
    id: "oils",
    title: "Oils & tinctures",
    blurb: "Measured drops for steady, smoke-free dosing.",
    icon: <Droplets className="h-4 w-4" />,
    types: [
      { name: "CBD oils", note: "Broad-spectrum CBD in a range of strengths." },
      { name: "THC:CBD tinctures", note: "Balanced and CBD-forward ratios for day or evening." },
    ],
  },
  {
    id: "edibles",
    title: "Edibles & infusions",
    blurb: "Slow and long-lasting. Wait two hours before having more.",
    icon: <Cookie className="h-4 w-4" />,
    types: [
      { name: "Gummies", note: "Pre-dosed pieces, easy to portion." },
      { name: "Chocolates", note: "Infused bars, portioned by the square." },
      { name: "Teas & infusions", note: "Herbal blends with hemp-derived CBD." },
    ],
  },
  {
    id: "topicals",
    title: "Topicals & salves",
    blurb: "Applied to the skin. Non-intoxicating.",
    icon: <HandHeart className="h-4 w-4" />,
    types: [
      { name: "Balms & salves", note: "Rich balms for dry or overworked skin." },
      { name: "Muscle rubs", note: "Cooling rubs for after the surf or the gym." },
    ],
  },
  {
    id: "accessories",
    title: "Accessories & curios",
    blurb: "Everything you need to roll, grind, smoke and gift.",
    icon: <Gift className="h-4 w-4" />,
    types: [
      { name: "Rolling papers & cones", note: "Unbleached, hemp and flavoured papers, tips and cones." },
      { name: "Herb grinders", note: "Pocket grinders to multi-chamber metal ones." },
      { name: "Pipes & glass", note: "Hand pipes, bongs and bubblers." },
      { name: "Curios & gifts", note: "Ashtrays, stash jars, lighters and local keepsakes." },
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
        col: tint > 0.8 ? "212,163,115" : tint > 0.4 ? "140,170,160" : "230,236,233",
      });
    }
    if (!s.raf) s.raf = requestAnimationFrame(loop);
  };

  return { canvasRef, puff };
}

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
    title: "Local cultivation: why the KZN coast suits terpenes",
    body: [
      "Terpenes are volatile and break down with heat. The South Coast's mild, frost-free climate and cooling sea breezes avoid the heat spikes that strip aroma from a crop.",
      "Long, bright summer days support vigorous growth, and KZN has a long cannabis heritage: Durban Poison is one of the world's best-known landrace cultivars.",
      "The trade-off is humidity. Coastal growers need strong airflow and careful drying to prevent mould, and slow curing in cool, dark conditions keeps the terpene profile intact.",
    ],
  },
];

/* ------------------------------------------------------------------ */
/* Hooks & small components                                            */
/* ------------------------------------------------------------------ */

function useOpenStatus() {
  const [status, setStatus] = useState<{ open: boolean; label: string } | null>(null);

  useEffect(() => {
    const check = () => {
      const parts = new Intl.DateTimeFormat("en-GB", {
        timeZone: "Africa/Johannesburg",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      }).formatToParts(new Date());
      const h = Number(parts.find((p) => p.type === "hour")?.value ?? 0) % 24;
      const m = Number(parts.find((p) => p.type === "minute")?.value ?? 0);
      const open = h >= OPEN_HOUR && h < CLOSE_HOUR;
      let label: string;
      if (open) {
        const minsLeft = (CLOSE_HOUR - h) * 60 - m;
        label = minsLeft <= 60 ? `Open now, closes in ${minsLeft} min` : "Open now until 10:00 PM";
      } else {
        label = "Closed, opens at 8:00 AM";
      }
      setStatus({ open, label });
    };
    check();
    const id = setInterval(check, 60_000);
    return () => clearInterval(id);
  }, []);

  return status;
}

function StatusDot({ open }: { open: boolean }) {
  return (
    <span className="relative flex h-2.5 w-2.5">
      {open && (
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#8fd1a8] opacity-60 motion-reduce:animate-none" />
      )}
      <span
        className={`relative inline-flex h-2.5 w-2.5 rounded-full ${open ? "bg-[#8fd1a8]" : "bg-[#D4A373]"}`}
      />
    </span>
  );
}

function Logo({ size = 40 }: { size?: number }) {
  const [ok, setOk] = useState(true);
  const ref = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const img = ref.current;
    if (img && img.complete && img.naturalWidth === 0) setOk(false);
  }, []);

  if (!ok) {
    return (
      <span
        className="grid place-items-center rounded-full bg-[#0F291E] ring-1 ring-[#52796F]/60"
        style={{ width: size, height: size }}
      >
        <Leaf className="h-1/2 w-1/2 text-[#D4A373]" />
      </span>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      ref={ref}
      src="/logo.png"
      alt="Coastal Herbalist logo"
      width={size}
      height={size}
      onError={() => setOk(false)}
      className="rounded-full object-cover ring-1 ring-[#52796F]/50 shadow-[0_0_0_3px_rgba(15,41,30,0.85),0_6px_24px_-6px_rgba(82,121,111,0.6)]"
      style={{ width: size, height: size }}
    />
  );
}

function LeafSilhouette({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 240" className={className} fill="none" aria-hidden="true">
      <path
        d="M60 4 C 110 62, 112 150, 60 236 C 8 150, 10 62, 60 4 Z"
        fill="currentColor"
        fillOpacity="0.28"
        stroke="currentColor"
        strokeOpacity="0.5"
      />
      <path d="M60 16 V 232" stroke="currentColor" strokeOpacity="0.6" strokeWidth="1.2" />
      {[48, 78, 108, 138, 168].map((y) => (
        <g key={y} stroke="currentColor" strokeOpacity="0.45" strokeWidth="1">
          <path d={`M60 ${y + 22} Q 80 ${y + 6} 94 ${y - 8}`} />
          <path d={`M60 ${y + 22} Q 40 ${y + 6} 26 ${y - 8}`} />
        </g>
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
      <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#52796F]/40 text-[#D4A373]">
        {icon}
      </div>
      <h2 className="font-display text-3xl leading-tight text-[#F8F9FA] sm:text-4xl">{title}</h2>
      <p className="mt-3 text-base leading-relaxed text-[#F8F9FA]/65">{intro}</p>
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
      if (sessionStorage.getItem("ch-age-ok") !== "1") setShow(true);
    } catch {
      setShow(true);
    }
  }, []);

  const confirm = () => {
    try {
      sessionStorage.setItem("ch-age-ok", "1");
    } catch {
      /* storage unavailable: gate simply shows again next visit */
    }
    setShow(false);
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-[60] grid place-items-center bg-[#0F291E]/85 p-6 backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="age-title"
        >
          <div className={`${glass} w-full max-w-sm rounded-3xl p-8 text-center`}>
            <div className="mx-auto mb-5 w-fit">
              <Logo size={72} />
            </div>
            <h2 id="age-title" className="font-display text-2xl">
              Are you 18 or older?
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-[#F8F9FA]/65">
              This site includes cannabis products and is for adults only.
            </p>
            <div className="mt-6 flex flex-col gap-3">
              <button
                onClick={confirm}
                className="rounded-full bg-[#D4A373] px-6 py-3 text-sm font-semibold text-[#0F291E] transition hover:bg-[#e0b68b]"
              >
                Yes, enter the site
              </button>
              <a
                href="https://www.google.com"
                className="rounded-full border border-[#52796F]/50 px-6 py-3 text-sm text-[#F8F9FA]/75 transition hover:border-[#D4A373]/60"
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
    ["Menu", "#menu"],
    ["Learn", "#knowledge"],
    ["Visit", "#visit"],
    ["Play", "#play"],
  ];

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 transition-colors duration-300 ${
        scrolled ? "border-b border-[#52796F]/25 bg-[#0F291E]/80 backdrop-blur-xl" : "bg-transparent"
      }`}
    >
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3">
        <a href="#top" className="flex items-center gap-3">
          <Logo size={40} />
          <span className="font-display text-lg text-[#F8F9FA]">Coastal Herbalist</span>
        </a>
        <div className="hidden items-center gap-8 md:flex">
          {links.map(([label, href]) => (
            <a
              key={href}
              href={href}
              className="text-sm text-[#F8F9FA]/70 transition-colors hover:text-[#D4A373]"
            >
              {label}
            </a>
          ))}
        </div>
        <a
          href={PHONE_TEL}
          className="inline-flex items-center gap-2 rounded-full border border-[#D4A373]/50 px-4 py-2 text-sm text-[#D4A373] transition-colors hover:bg-[#D4A373] hover:text-[#0F291E]"
        >
          <Phone className="h-4 w-4" />
          <span className="hidden sm:inline">Call store</span>
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
          // cool sage-white mixed toward ochre
          px[o] = 196 + (212 - 196) * w;
          px[o + 1] = 214 + (163 - 214) * w;
          px[o + 2] = 206 + (115 - 206) * w;
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
    <div className={`relative aspect-square ${className}`} aria-hidden="true">
      <div
        className="absolute -inset-[12%] rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(82,121,111,0.5) 0%, rgba(82,121,111,0.12) 45%, rgba(15,41,30,0) 70%)",
        }}
      />
      <div className="absolute inset-0 rounded-full border border-[#52796F]/25" />
      <div className="absolute inset-0 animate-[spin_80s_linear_infinite] motion-reduce:animate-none">
        <span className="absolute left-1/2 top-0 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#D4A373] shadow-[0_0_12px_rgba(212,163,115,0.8)]" />
      </div>
      <div className="absolute inset-[8%] rounded-full border border-[#D4A373]/20" />
      <motion.div
        className="absolute inset-[15%]"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.1, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/logo.png"
          alt=""
          className="h-full w-full rounded-full object-cover shadow-[0_0_0_6px_rgba(15,41,30,0.9),0_0_0_7px_rgba(82,121,111,0.45),0_30px_80px_-20px_rgba(0,0,0,0.8),0_0_90px_-10px_rgba(82,121,111,0.55)]"
        />
      </motion.div>
    </div>
  );
}

function Hero({ status }: { status: { open: boolean; label: string } | null }) {
  const heroRef = useRef<HTMLElement>(null);

  return (
    <section ref={heroRef} id="top" className="relative flex min-h-[100svh] items-center overflow-hidden bg-[#0F291E]">
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 20% 0%, rgba(82,121,111,0.38), transparent 60%), radial-gradient(ellipse at 90% 100%, rgba(212,163,115,0.14), transparent 55%)",
        }}
      />
      <FluidSmoke targetRef={heroRef} />
      <LeafSilhouette className="pointer-events-none absolute -right-10 top-24 h-80 w-40 rotate-[24deg] text-[#52796F]/50 sm:h-[26rem] sm:w-52 lg:hidden" />
      <LeafSilhouette className="pointer-events-none absolute -left-12 bottom-10 h-64 w-32 -rotate-[32deg] text-[#52796F]/30" />

      <div className="relative z-10 mx-auto grid w-full max-w-6xl items-center gap-12 px-5 pb-24 pt-32 lg:grid-cols-[1.35fr_1fr]">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-3xl"
        >
          <HeroEmblem className="mb-8 w-28 sm:w-32 lg:hidden" />
          <p className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#52796F]/40 bg-[#0F291E]/40 px-4 py-1.5 text-sm text-[#F8F9FA]/75 backdrop-blur">
            <MapPin className="h-4 w-4 text-[#D4A373]" />
            Marine Drive, Margate
          </p>
          <h1 className="font-display text-5xl leading-[1.05] text-[#F8F9FA] sm:text-6xl lg:text-[4.25rem]">
            Elevated Coastal Wellness &amp; Botanical Craft
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-[#F8F9FA]/70">
            Herbal remedies, artisanal teas, topicals and curated cannabis, chosen by people who know
            the plants. Five minutes from the Lawrence Rocks tidal pools.
          </p>

          <div className="mt-10 flex flex-wrap gap-3">
            <a
              href="#menu"
              className="inline-flex items-center gap-2 rounded-full bg-[#D4A373] px-6 py-3.5 text-sm font-semibold text-[#0F291E] transition-colors hover:bg-[#e0b68b]"
            >
              <Leaf className="h-4 w-4" />
              Explore menu
            </a>
            <a
              href={MAPS_DIRECTIONS}
              target="_blank"
              rel="noopener noreferrer"
              className={`${glass} inline-flex items-center gap-2 rounded-full px-6 py-3.5 text-sm font-medium text-[#F8F9FA] transition-colors hover:border-[#D4A373]/60`}
            >
              <Navigation className="h-4 w-4 text-[#D4A373]" />
              Get directions
            </a>
            <a
              href={PHONE_TEL}
              className={`${glass} inline-flex items-center gap-2 rounded-full px-6 py-3.5 text-sm font-medium text-[#F8F9FA] transition-colors hover:border-[#D4A373]/60`}
            >
              <Phone className="h-4 w-4 text-[#D4A373]" />
              Call store
            </a>
          </div>

          <div className="mt-10 flex items-center gap-3 text-sm text-[#F8F9FA]/65">
            <Clock className="h-4 w-4 text-[#52796F]" />
            {status ? (
              <span className="inline-flex items-center gap-2">
                <StatusDot open={status.open} />
                {status.label}
              </span>
            ) : (
              <span>Open daily, 8:00 AM to 10:00 PM</span>
            )}
          </div>
          <p className="mt-4 hidden text-xs text-[#F8F9FA]/40 motion-reduce:hidden md:block">
            Move your cursor to stir the smoke. Click for a puff.
          </p>
        </motion.div>

        <HeroEmblem className="mx-auto hidden w-full max-w-[24rem] lg:block" />
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-b from-transparent to-[#1A1E1C]" />
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
    <section id="menu" className="scroll-mt-20 bg-[#1A1E1C] py-24">
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
              <span className="block font-display text-2xl text-[#F8F9FA]">
                {open ? "The menu" : "Open the menu"}
              </span>
              <span className="mt-1 block text-sm text-[#F8F9FA]/55">
                {MENU.map((g) => g.title).join(" · ")}
              </span>
            </span>
            <span
              className={`grid h-11 w-11 shrink-0 place-items-center rounded-full border border-[#D4A373]/50 text-[#D4A373] transition-all duration-500 group-hover:bg-[#D4A373] group-hover:text-[#0F291E] ${
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
                  className="border-t border-[#52796F]/25 px-6 pb-8 pt-6 sm:px-8"
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
                                ? "border-[#D4A373] bg-[#D4A373] text-[#0F291E]"
                                : "border-[#52796F]/40 text-[#F8F9FA]/70 hover:border-[#52796F] hover:text-[#F8F9FA]"
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
                      <p className="max-w-2xl text-sm leading-relaxed text-[#F8F9FA]/60">{group.blurb}</p>
                      <ul className="mt-5 grid gap-3 sm:grid-cols-2">
                        {group.types.map((t, i) => (
                          <motion.li
                            key={t.name}
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.35, delay: 0.05 * i }}
                            className="flex gap-4 rounded-2xl bg-[#0F291E]/55 p-4"
                          >
                            <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-full border border-[#52796F]/40 text-[#D4A373]">
                              <Sparkles className="h-3.5 w-3.5" />
                            </span>
                            <span>
                              <span className="block font-display text-lg text-[#F8F9FA]">{t.name}</span>
                              <span className="mt-0.5 block text-sm leading-relaxed text-[#F8F9FA]/60">
                                {t.note}
                              </span>
                            </span>
                          </motion.li>
                        ))}
                      </ul>
                    </motion.div>
                  </AnimatePresence>

                  <div className="mt-8 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-[#52796F]/30 px-5 py-4">
                    <p className="flex items-center gap-3 text-sm text-[#F8F9FA]/70">
                      <Store className="h-4 w-4 shrink-0 text-[#D4A373]" />
                      Strains, stock and prices are available in store only.
                    </p>
                    <a
                      href="#visit"
                      className="inline-flex items-center gap-2 rounded-full bg-[#52796F] px-4 py-2.5 text-sm font-medium text-[#F8F9FA] transition-colors hover:bg-[#5f8b80]"
                    >
                      Visit the shop
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

        <p className="mt-8 text-sm text-[#F8F9FA]/45">Adults 18+ only. Please use responsibly.</p>
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
              <span className="font-medium text-[#F8F9FA]">{r.title}</span>
              <ChevronDown
                className={`h-5 w-5 shrink-0 text-[#D4A373] transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
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
                  <div className="space-y-3 px-6 pb-6 text-sm leading-relaxed text-[#F8F9FA]/70">
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
    <section id="knowledge" className="scroll-mt-20 bg-[#0F291E] py-24">
      <div className="mx-auto max-w-6xl px-5">
        <SectionHeading
          icon={<BookOpen className="h-5 w-5" />}
          title="South African cannabis law and research"
          intro="Plain-language background on the law and the science, so you can make informed choices."
        />

        <div className="mt-12 grid gap-8 lg:grid-cols-5">
          <div className={`${glass} rounded-3xl p-7 lg:col-span-2`}>
            <div className="flex items-center gap-3">
              <Scale className="h-5 w-5 text-[#D4A373]" />
              <h3 className="font-display text-xl">The legal framework</h3>
            </div>
            <ol className="mt-6 space-y-5 border-l border-[#52796F]/40 pl-5">
              {legalPoints.map((p) => (
                <li key={p.title} className="relative">
                  <span className="absolute -left-[25px] top-1.5 h-2 w-2 rounded-full bg-[#D4A373]" />
                  <p className="text-sm font-semibold text-[#F8F9FA]">{p.title}</p>
                  <p className="mt-1 text-sm leading-relaxed text-[#F8F9FA]/65">{p.text}</p>
                </li>
              ))}
            </ol>
            <p className="mt-6 text-xs leading-relaxed text-[#F8F9FA]/45">
              General information, not legal advice. Regulations are still being finalised, so check
              current rules before relying on them.
            </p>
          </div>

          <div className="lg:col-span-3">
            <Accordion />
            <p className="mt-5 text-xs leading-relaxed text-[#F8F9FA]/45">
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
/* Store info                                                          */
/* ------------------------------------------------------------------ */

function StoreInfo({ status }: { status: { open: boolean; label: string } | null }) {
  return (
    <section id="visit" className="scroll-mt-20 bg-[#1A1E1C] py-24">
      <div className="mx-auto max-w-6xl px-5">
        <SectionHeading
          icon={<MapPin className="h-5 w-5" />}
          title="Visit the shop"
          intro="On Marine Drive at Oslo Beach, open every day of the week."
        />

        <div className={`${glass} mt-10 grid overflow-hidden rounded-3xl lg:grid-cols-2`}>
          <div className="space-y-7 p-8">
            <div className="flex gap-4">
              <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-[#D4A373]" />
              <div>
                <p className="text-sm text-[#F8F9FA]/50">Address</p>
                <p className="mt-1 text-[#F8F9FA]">
                  99 Marine Dr, Oslo Beach
                  <br />
                  Margate, 4275
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <Clock className="mt-0.5 h-5 w-5 shrink-0 text-[#D4A373]" />
              <div>
                <p className="text-sm text-[#F8F9FA]/50">Hours</p>
                <p className="mt-1 text-[#F8F9FA]">Monday to Sunday, 8:00 AM to 10:00 PM</p>
                {status && (
                  <p className="mt-2 inline-flex items-center gap-2 text-sm text-[#F8F9FA]/70">
                    <StatusDot open={status.open} />
                    {status.label}
                  </p>
                )}
              </div>
            </div>
            <div className="flex gap-4">
              <Phone className="mt-0.5 h-5 w-5 shrink-0 text-[#D4A373]" />
              <div>
                <p className="text-sm text-[#F8F9FA]/50">Phone and WhatsApp</p>
                <a href={PHONE_TEL} className="mt-1 block text-[#F8F9FA] hover:text-[#D4A373]">
                  {PHONE_DISPLAY}
                </a>
              </div>
            </div>
            <div className="flex flex-wrap gap-3 pt-2">
              <a
                href={MAPS_DIRECTIONS}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-[#D4A373] px-5 py-3 text-sm font-semibold text-[#0F291E] transition-colors hover:bg-[#e0b68b]"
              >
                <Navigation className="h-4 w-4" />
                Open in Google Maps
                <ChevronRight className="h-4 w-4" />
              </a>
              <a
                href={waLink("Hi Coastal Herbalist, I have a question.")}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-[#52796F]/50 px-5 py-3 text-sm text-[#F8F9FA] transition-colors hover:border-[#D4A373]/60"
              >
                <MessageCircle className="h-4 w-4 text-[#D4A373]" />
                Message us
              </a>
            </div>
          </div>
          <div className="relative min-h-[300px] border-t border-[#52796F]/30 lg:border-l lg:border-t-0">
            <iframe
              title="Map to Coastal Herbalist"
              src={MAPS_EMBED}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="absolute inset-0 h-full w-full"
              style={{ border: 0, filter: "grayscale(0.4) contrast(1.05) brightness(0.9)" }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Coastal Leaf Runner (canvas mini-game)                              */
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
const HI_KEY = "ch-leaf-runner-hi";
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

    const wave = (base: number, amp: number, freq: number, offset: number, color: string) => {
      ctx.beginPath();
      ctx.moveTo(0, GH);
      for (let x = 0; x <= GW; x += 8) {
        ctx.lineTo(x, base + Math.sin((x + offset) * freq + s.t * 1.2) * amp);
      }
      ctx.lineTo(GW, GH);
      ctx.closePath();
      ctx.fillStyle = color;
      ctx.fill();
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
      ctx.fillStyle = "rgba(15,41,30,0.35)";
      ctx.beginPath();
      ctx.ellipse(cx, GROUND + 3, shadowW, 3.5, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.save();
      ctx.translate(cx, cy);
      ctx.scale(1 + s.squash * 0.6, 1 - s.squash * 0.6);
      ctx.rotate(0.55 + rot);

      // stem
      ctx.strokeStyle = COLORS.ochre;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, 18);
      ctx.quadraticCurveTo(2, 24, -2, 27);
      ctx.stroke();

      // blade
      const grad = ctx.createLinearGradient(-14, -20, 14, 20);
      grad.addColorStop(0, "#7fa89c");
      grad.addColorStop(1, COLORS.sage);
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.moveTo(0, -21);
      ctx.bezierCurveTo(17, -10, 16, 10, 0, 19);
      ctx.bezierCurveTo(-16, 10, -17, -10, 0, -21);
      ctx.fill();
      ctx.strokeStyle = "rgba(248,249,250,0.35)";
      ctx.lineWidth = 1;
      ctx.stroke();

      // veins
      ctx.strokeStyle = "rgba(15,41,30,0.45)";
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
      ctx.fillStyle = COLORS.deep;
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
        ctx.fillStyle = "rgba(248,249,250,0.14)";
        ctx.fill();
        ctx.strokeStyle = "rgba(248,249,250,0.55)";
        ctx.lineWidth = 1.5;
        ctx.stroke();
        roundRect(o.x - 2, o.y, o.w + 4, 9, 3);
        ctx.fillStyle = COLORS.ochre;
        ctx.fill();
        ctx.fillStyle = COLORS.sage;
        ctx.fillRect(o.x + 3, o.y + 20, o.w - 6, 9);
        ctx.fillStyle = "rgba(248,249,250,0.35)";
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
        ctx.strokeStyle = COLORS.ochre;
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.arc(hx1, hy, 5.5, 0, Math.PI * 2);
        ctx.moveTo(hx2 + 5.5, hy);
        ctx.arc(hx2, hy, 5.5, 0, Math.PI * 2);
        ctx.stroke();
        ctx.fillStyle = COLORS.ochre;
        ctx.beginPath();
        ctx.arc(o.x + o.w / 2, o.y + o.h / 2 + 1, 2.2, 0, Math.PI * 2);
        ctx.fill();
        ctx.lineCap = "butt";
      } else {
        ctx.strokeStyle = "rgba(248,249,250,0.75)";
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
      sky.addColorStop(0, COLORS.deep);
      sky.addColorStop(1, COLORS.char);
      ctx.fillStyle = sky;
      ctx.fillRect(0, 0, GW, GH);

      const glow = ctx.createRadialGradient(GW - 110, 62, 0, GW - 110, 62, 120);
      glow.addColorStop(0, "rgba(212,163,115,0.35)");
      glow.addColorStop(1, "rgba(212,163,115,0)");
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, GW, GH);
      ctx.fillStyle = "rgba(212,163,115,0.8)";
      ctx.beginPath();
      ctx.arc(GW - 110, 62, 16, 0, Math.PI * 2);
      ctx.fill();

      wave(GROUND - 46, 7, 0.012, s.bgX * 0.15, "rgba(82,121,111,0.2)");
      wave(GROUND - 26, 5, 0.02, s.bgX * 0.35, "rgba(82,121,111,0.32)");

      const sand = ctx.createLinearGradient(0, GROUND, 0, GH);
      sand.addColorStop(0, "rgba(212,163,115,0.55)");
      sand.addColorStop(1, "rgba(212,163,115,0.2)");
      ctx.fillStyle = sand;
      ctx.fillRect(0, GROUND, GW, GH - GROUND);
      ctx.fillStyle = "rgba(248,249,250,0.35)";
      ctx.fillRect(0, GROUND, GW, 1.5);
      ctx.fillStyle = "rgba(26,30,28,0.35)";
      for (let i = 0; i < 36; i++) {
        const x = mod(i * 97 - s.bgX, GW + 40) - 20;
        const y = GROUND + 8 + ((i * 53) % (GH - GROUND - 14));
        ctx.fillRect(x, y, i % 3 === 0 ? 6 : 3, 1.5);
      }

      for (const o of s.obstacles) drawObstacle(o);

      for (const d of s.dust) {
        ctx.fillStyle = `rgba(212,163,115,${Math.max(0, d.life * 1.6)})`;
        ctx.beginPath();
        ctx.arc(d.x, d.y, 2.2, 0, Math.PI * 2);
        ctx.fill();
      }

      drawLeaf();

      const blink = s.flash > 0 && Math.floor(s.flash * 10) % 2 === 0;
      ctx.font = "600 15px 'Plus Jakarta Sans', system-ui, sans-serif";
      ctx.textAlign = "right";
      ctx.fillStyle = "rgba(248,249,250,0.5)";
      ctx.fillText(`HI ${pad(s.hi)}`, GW - 110, 30);
      ctx.fillStyle = blink ? COLORS.ochre : "rgba(248,249,250,0.9)";
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
    <section id="play" ref={sectionRef} className="scroll-mt-20 bg-[#0F291E] py-24">
      <div className="mx-auto max-w-6xl px-5">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading
            icon={<Gamepad2 className="h-5 w-5" />}
            title="Coastal Leaf Runner"
            intro="Help the leaf dodge sea breeze gusts, trimming scissors and jars. Press Space or tap the game to jump."
          />
          <div className="flex items-center gap-3">
            <p className={`${glass} rounded-full px-4 py-2 text-sm text-[#F8F9FA]/75`}>
              Best: <span className="font-semibold text-[#D4A373]">{hi}</span>
            </p>
            <button
              onClick={() => setMuted((m) => !m)}
              aria-label={muted ? "Turn sound on" : "Mute sound"}
              className={`${glass} grid h-10 w-10 place-items-center rounded-full text-[#F8F9FA]/80 transition-colors hover:text-[#D4A373]`}
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
          aria-label="Coastal Leaf Runner game. Press Space or tap to jump."
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
                className="absolute inset-0 grid place-items-center bg-[#0F291E]/50 backdrop-blur-[2px]"
              >
                <div className="px-6 text-center">
                  {mode === "over" ? (
                    <>
                      <p className="font-display text-2xl text-[#F8F9FA] sm:text-3xl">Blown off course</p>
                      <p className="mt-1 text-sm text-[#F8F9FA]/70">
                        Score {finalScore}
                        {finalScore > 0 && finalScore >= hi ? ", a new best" : ""}
                      </p>
                    </>
                  ) : (
                    <p className="font-display text-2xl text-[#F8F9FA] sm:text-3xl">Ready to run?</p>
                  )}
                  <span className="mt-4 inline-flex items-center gap-2 rounded-full bg-[#D4A373] px-5 py-2.5 text-sm font-semibold text-[#0F291E]">
                    {mode === "over" ? "Play again" : "Start game"}
                    <ChevronRight className="h-4 w-4" />
                  </span>
                  <p className="mt-3 hidden text-xs text-[#F8F9FA]/55 sm:block">or press Space</p>
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
    <footer className="border-t border-[#52796F]/25 bg-[#1A1E1C] py-12">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Logo size={44} />
          <div>
            <p className="font-display text-lg">Coastal Herbalist</p>
            <p className="text-sm text-[#F8F9FA]/50">{ADDRESS}</p>
          </div>
        </div>
        <div className="text-sm text-[#F8F9FA]/50 sm:text-right">
          <p>For adults 18 and older. Please use responsibly.</p>
          <p className="mt-1">© {new Date().getFullYear()} Coastal Herbalist, Margate</p>
        </div>
      </div>
    </footer>
  );
}

export default function Page() {
  const status = useOpenStatus();

  return (
    <main className="min-h-screen bg-[#1A1E1C] text-[#F8F9FA]">
      <AgeGate />
      <Nav />
      <Hero status={status} />
      <MenuSection />
      <KnowledgeSection />
      <StoreInfo status={status} />
      <LeafRunner />
      <Footer />
    </main>
  );
}
