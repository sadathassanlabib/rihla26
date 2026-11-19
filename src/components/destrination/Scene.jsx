"use client";

/* Animated SVG scenes. Each one matches the context of a spot
   (beach, mangrove, village, sunset, estuary). They are used as a
   fallback when a real photo is missing, so the page never looks empty. */

const Birds = ({ y = 90, delay = 0 }) => (
  <g className="dx-bird" style={{ animationDelay: `${delay}s` }} fill="none" stroke="#1D423A" strokeWidth="2" strokeLinecap="round">
    <path d={`M0 ${y} q10 -10 20 0 q10 -10 20 0`} />
    <path d={`M60 ${y + 18} q8 -8 16 0 q8 -8 16 0`} />
    <path d={`M30 ${y + 40} q7 -7 14 0 q7 -7 14 0`} />
  </g>
);

const Waves = ({ top = 290, c1 = "#246A73", c2 = "#1D423A" }) => (
  <>
    <g className="dx-wave-a" opacity="0.9">
      <path d={`M0 ${top} q100 -22 200 0 t200 0 t200 0 t200 0 t200 0 t200 0 t200 0 t200 0 V450 H0Z`} fill={c1} />
    </g>
    <g className="dx-wave-b">
      <path d={`M0 ${top + 34} q100 -22 200 0 t200 0 t200 0 t200 0 t200 0 t200 0 t200 0 t200 0 V450 H0Z`} fill={c2} opacity="0.85" />
    </g>
  </>
);

function Beach() {
  return (
    <svg viewBox="0 0 800 450" className="h-full w-full" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        <linearGradient id="sk-beach" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#6BA39E" />
          <stop offset="1" stopColor="#F3E3CB" />
        </linearGradient>
      </defs>
      <rect width="800" height="450" fill="url(#sk-beach)" />
      <circle className="dx-glow" cx="590" cy="130" r="70" fill="#F7C873" opacity="0.35" />
      <circle cx="590" cy="130" r="40" fill="#F7C873" />
      <Birds y={80} />
      <Waves />
      <g className="dx-bob">
        <path d="M200 285 h70 l-10 18 h-50z" fill="#1D423A" />
        <path d="M235 285 v-48 l28 40z" fill="#DFC5A6" />
      </g>
      <path d="M0 395 q200 -35 420 -10 t380 -15 V450 H0Z" fill="#DFC5A6" />
    </svg>
  );
}

function Mangrove() {
  const tree = (x, s, d) => (
    <g className="dx-sway" style={{ animationDelay: `${d}s`, transformOrigin: `${x}px 400px` }} transform={`translate(${x} 0) scale(${s})`}>
      <path d="M0 400 q-6 -70 0 -130 M0 340 q-30 -20 -48 -50 M0 330 q28 -22 46 -52" stroke="#4A3B2A" strokeWidth="8" fill="none" strokeLinecap="round" />
      <circle cx="0" cy="250" r="55" fill="#1D5B4A" />
      <circle cx="-48" cy="285" r="38" fill="#246A73" />
      <circle cx="46" cy="275" r="40" fill="#2F7D5B" />
    </g>
  );
  return (
    <svg viewBox="0 0 800 450" className="h-full w-full" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        <linearGradient id="sk-mg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#A7CFC7" />
          <stop offset="1" stopColor="#DDEBD9" />
        </linearGradient>
      </defs>
      <rect width="800" height="450" fill="url(#sk-mg)" />
      <Birds y={70} delay={1} />
      {tree(150, 0.9, 0)}
      {tree(400, 1.15, 0.8)}
      {tree(650, 0.95, 1.6)}
      <rect y="395" width="800" height="55" fill="#246A73" />
      <g className="dx-wave-b" opacity="0.5">
        <path d="M0 410 q100 -10 200 0 t200 0 t200 0 t200 0 t200 0 t200 0 t200 0 t200 0" stroke="#DFC5A6" strokeWidth="3" fill="none" />
      </g>
    </svg>
  );
}

function Village() {
  const hut = (x) => (
    <g transform={`translate(${x} 0)`}>
      <rect x="0" y="300" width="90" height="70" fill="#C9A57A" />
      <path d="M-12 302 L45 250 L102 302Z" fill="#6B4E32" />
      <rect x="36" y="328" width="18" height="42" fill="#3B2A1A" />
    </g>
  );
  return (
    <svg viewBox="0 0 800 450" className="h-full w-full" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        <linearGradient id="sk-vl" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#F2B27A" />
          <stop offset="1" stopColor="#F8E3C3" />
        </linearGradient>
      </defs>
      <rect width="800" height="450" fill="url(#sk-vl)" />
      <rect y="370" width="800" height="80" fill="#DFC5A6" />
      {hut(120)}
      {hut(300)}
      <g className="dx-sway" style={{ transformOrigin: "640px 380px" }}>
        <path d="M640 380 q8 -90 -4 -160" stroke="#4A3B2A" strokeWidth="9" fill="none" />
        <path d="M636 220 q-50 -10 -70 30 M636 220 q40 -30 80 0 M636 220 q-10 -40 -50 -50 M636 220 q30 -45 70 -35" stroke="#2F7D5B" strokeWidth="9" fill="none" strokeLinecap="round" />
      </g>
      <path d="M450 345 h80 l-12 20 h-56z" fill="#1D423A" />
      <path d="M455 300 q40 -20 80 0 M455 312 q40 -16 80 0" stroke="#6B4E32" strokeWidth="2" fill="none" />
      <path className="dx-fish" d="M0 0 q16 -18 32 0 q-16 6 -32 0 M32 0 l10 -6 v12z" fill="#246A73" transform="translate(120 395)" />
      <Birds y={60} delay={2} />
    </svg>
  );
}

function Sunset() {
  return (
    <svg viewBox="0 0 800 450" className="h-full w-full" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        <linearGradient id="sk-ss" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#1D423A" />
          <stop offset="0.5" stopColor="#E07A3E" />
          <stop offset="1" stopColor="#F7C873" />
        </linearGradient>
      </defs>
      <rect width="800" height="450" fill="url(#sk-ss)" />
      <g className="dx-sunset">
        <circle cx="400" cy="250" r="90" fill="#F7C873" opacity="0.3" />
        <circle cx="400" cy="250" r="58" fill="#FFE2A8" />
      </g>
      <rect y="300" width="800" height="150" fill="#1D423A" opacity="0.92" />
      <g className="dx-shimmer" stroke="#FFE2A8" strokeLinecap="round" strokeWidth="4">
        <path d="M350 330 h100" /><path d="M365 350 h70" /><path d="M378 370 h44" /><path d="M388 390 h24" />
      </g>
      <g className="dx-bob" fill="#0F2420">
        <path d="M120 300 h90 l-12 20 h-66z" />
        <path d="M165 300 v-50 l30 44z" />
      </g>
      <Birds y={110} delay={0.5} />
    </svg>
  );
}

function Estuary() {
  return (
    <svg viewBox="0 0 800 450" className="h-full w-full" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        <linearGradient id="sk-es" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#9DB9BC" />
          <stop offset="1" stopColor="#E9DCC6" />
        </linearGradient>
      </defs>
      <rect width="800" height="450" fill="url(#sk-es)" />
      <g className="dx-cloud" fill="#fff" opacity="0.75">
        <ellipse cx="180" cy="90" rx="70" ry="20" /><ellipse cx="225" cy="80" rx="45" ry="18" />
        <ellipse cx="560" cy="130" rx="80" ry="20" /><ellipse cx="610" cy="118" rx="45" ry="16" />
      </g>
      <Birds y={160} />
      <Birds y={210} delay={3} />
      <Waves top={270} c1="#6BA39E" c2="#246A73" />
      <path d="M0 400 q150 -50 330 -20 t300 -10 t170 10 V450 H0Z" fill="#DFC5A6" />
      <path d="M220 420 q60 -16 120 0" stroke="#C9A57A" strokeWidth="3" fill="none" />
    </svg>
  );
}

const SCENES = { beach: Beach, mangrove: Mangrove, village: Village, sunset: Sunset, estuary: Estuary };

export default function Scene({ kind }) {
  const C = SCENES[kind] || Beach;
  return <C />;
}