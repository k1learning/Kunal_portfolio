import { createSignal, createMemo, onMount, onCleanup, Show, Switch, Match } from 'solid-js';

/* ============================================================
   v8 — Kunal Sharma's portfolio
   Palette: Josh W. Comeau's actual brand colors
     • Hot pink/magenta primary (#EE3C95)
     • Sky cyan secondary (#3DD2EF)
     • Sunshine yellow (#FCC419)
     • Lavender purple (#A971E5)
     • Warm cream background (#FAF5E9)
     • Shadow hue 286° (his actual published value)
   Character: custom SVG portrait, placeholder until photos arrive.
   ============================================================ */

const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,500;0,9..144,600;0,9..144,700;1,9..144,400;1,9..144,500;1,9..144,600&family=Geist:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');

:root {
  /* ---- Cream foundation ---- */
  --bg:           #FAF5E9;
  --bg-soft:      #FCF8EE;
  --bg-warm:      #F5EFDF;
  --surface:      #FFFFFF;
  --surface-warm: #FEF9EC;

  /* ---- Text (deep cool ink, Josh-style) ---- */
  --fg:        #1F1A2E;
  --fg-soft:   #5C5969;
  --fg-muted:  #8C8898;
  --fg-faint:  #C4C0CE;

  /* ---- Josh's brand palette ---- */
  --pink:        #EE3C95;
  --pink-l:      #F47AB5;
  --pink-d:      #C2257A;
  --pink-bg:     #FCE0EE;

  --cyan:        #3DD2EF;
  --cyan-l:      #7AE2F4;
  --cyan-d:      #0FA8C5;
  --cyan-bg:     #DAF4FA;

  --yellow:      #FCC419;
  --yellow-l:    #FDD970;
  --yellow-d:    #E8A704;
  --yellow-bg:   #FFF4D0;

  --purple:      #A971E5;
  --purple-l:    #C9A4F0;
  --purple-d:    #7A4BB8;
  --purple-bg:   #ECDEFA;

  --green:       #3BB17F;
  --green-bg:    #DAF0E5;

  /* ---- Skin tones (for character) ---- */
  --skin:        #C99566;
  --skin-d:      #A87649;
  --hair:        #1E0F08;

  /* ---- Shadows: Josh's actual hue 286° ---- */
  --shadow-color: 286deg 36% 56%;
  --shadow-xs:
    0.3px 0.5px 0.7px hsl(var(--shadow-color) / 0.18),
    0.4px 0.8px 1px -1.2px hsl(var(--shadow-color) / 0.18);
  --shadow-sm:
    0.3px 0.5px 0.7px hsl(var(--shadow-color) / 0.22),
    1px 2px 2.5px -1px hsl(var(--shadow-color) / 0.22),
    2.5px 5px 6.3px -2.5px hsl(var(--shadow-color) / 0.22);
  --shadow-md:
    0.3px 0.5px 0.7px hsl(var(--shadow-color) / 0.28),
    1.5px 3px 3.8px -0.8px hsl(var(--shadow-color) / 0.28),
    5px 10px 12.6px -2.5px hsl(var(--shadow-color) / 0.28);
  --shadow-lg:
    0.3px 0.5px 0.7px hsl(var(--shadow-color) / 0.32),
    1.5px 2.9px 3.7px -0.4px hsl(var(--shadow-color) / 0.32),
    4.5px 8.9px 11.2px -1.1px hsl(var(--shadow-color) / 0.32),
    11.2px 22.3px 28.1px -1.8px hsl(var(--shadow-color) / 0.32),
    25px 50px 62.9px -2.5px hsl(var(--shadow-color) / 0.32);
  --shadow-pink:
    0 12px 32px -8px rgba(238, 60, 149, 0.35);
  --shadow-cyan:
    0 12px 32px -8px rgba(61, 210, 239, 0.32);

  /* ---- Type ---- */
  --serif: 'Fraunces', 'Georgia', serif;
  --sans:  'Geist', ui-sans-serif, system-ui, -apple-system, sans-serif;
  --mono:  'JetBrains Mono', ui-monospace, SFMono-Regular, monospace;

  /* ---- Layout ---- */
  --max-w:        1200px;
  --max-w-mid:    920px;
  --max-w-tight:  680px;
  --gutter:       clamp(1.25rem, 4vw, 2.5rem);

  /* ---- Motion ---- */
  --spring: cubic-bezier(0.34, 1.56, 0.64, 1);
  --ease:   cubic-bezier(0.22, 0.68, 0.32, 1);
}

* { box-sizing: border-box; }

html, body {
  margin: 0;
  background: var(--bg);
  color: var(--fg);
  font-family: var(--sans);
  font-weight: 400;
  font-feature-settings: 'ss01', 'cv11';
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  overflow-x: hidden;
}

::selection { background: var(--pink-l); color: var(--fg); }

/* ============================================================
   BACKGROUND ATMOSPHERE
   ============================================================ */

.bg-texture {
  position: fixed; inset: 0;
  pointer-events: none; z-index: 0;
  background-image: radial-gradient(rgba(122, 75, 184, 0.10) 0.7px, transparent 0.7px);
  background-size: 22px 22px;
  mask-image: radial-gradient(ellipse 80% 60% at 50% 30%, black 30%, transparent 90%);
  -webkit-mask-image: radial-gradient(ellipse 80% 60% at 50% 30%, black 30%, transparent 90%);
  opacity: 0.5;
}

.bg-glows {
  position: fixed; inset: 0;
  pointer-events: none; z-index: 0;
  background:
    radial-gradient(ellipse 65% 45% at 12% 5%, rgba(252, 196, 25, 0.18) 0%, transparent 55%),
    radial-gradient(ellipse 55% 40% at 92% 18%, rgba(238, 60, 149, 0.10) 0%, transparent 55%),
    radial-gradient(ellipse 60% 40% at 5% 75%, rgba(169, 113, 229, 0.08) 0%, transparent 55%),
    radial-gradient(ellipse 55% 35% at 88% 92%, rgba(61, 210, 239, 0.10) 0%, transparent 55%);
}

.grain-soft {
  position: fixed; inset: 0; pointer-events: none; z-index: 30;
  opacity: 0.04; mix-blend-mode: multiply;
  background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='180' height='180'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0.15  0 0 0 0 0.10  0 0 0 0 0.20  0 0 0 0.6 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>");
}

/* ============================================================
   LAYOUT
   ============================================================ */

.page { position: relative; min-height: 100vh; isolation: isolate; }
.content { position: relative; z-index: 2; }

.container {
  max-width: var(--max-w);
  margin: 0 auto;
  padding: 0 var(--gutter);
  position: relative;
}
.container.mid    { max-width: var(--max-w-mid); }
.container.tight  { max-width: var(--max-w-tight); }

/* ============================================================
   WAVY DIVIDER
   ============================================================ */

.wavy-divider {
  position: relative;
  width: 100%;
  height: 64px;
  margin: 0;
  display: block;
  overflow: hidden;
}
.wavy-divider svg { width: 100%; height: 100%; display: block; }

/* ============================================================
   ASTERISK MARK
   ============================================================ */

.asterisk {
  display: inline-block; flex-shrink: 0; vertical-align: middle;
  transition: transform 0.6s var(--spring);
}
.asterisk path { stroke: currentColor; stroke-width: 1.6; stroke-linecap: round; fill: none; }
.asterisk-wiggle:hover .asterisk { transform: rotate(60deg) scale(1.15); }

/* ============================================================
   NAV
   ============================================================ */

.nav {
  position: fixed; top: 0; left: 0; right: 0; z-index: 50;
  padding: 1.1rem var(--gutter);
  display: flex; align-items: center; justify-content: space-between;
  transition: background 0.4s var(--ease), backdrop-filter 0.4s var(--ease), box-shadow 0.4s var(--ease);
}
.nav.scrolled {
  background: rgba(250, 245, 233, 0.88);
  backdrop-filter: blur(14px) saturate(120%);
  -webkit-backdrop-filter: blur(14px) saturate(120%);
  box-shadow: 0 1px 0 rgba(122, 75, 184, 0.10);
}

.nav-mark {
  display: flex; align-items: center; gap: 0.6rem;
  background: none; border: none; padding: 0;
  cursor: pointer; color: var(--fg);
  font-family: var(--serif); font-size: 1.1rem;
  font-weight: 500; font-variation-settings: 'opsz' 14, 'SOFT' 100;
  letter-spacing: -0.005em;
  transition: opacity 0.3s var(--ease);
}
.nav-mark:hover { opacity: 0.8; }
.nav-mark .asterisk { color: var(--pink); }

.nav-right { display: flex; align-items: center; gap: 1.5rem; }

.nav-link {
  background: none; border: none; padding: 0;
  font-family: var(--sans); font-size: 0.92rem; font-weight: 500;
  color: var(--fg-soft); cursor: pointer;
  transition: color 0.3s var(--ease);
}
.nav-link:hover { color: var(--pink); }

.nav-cv {
  font-family: var(--sans); font-size: 0.92rem; font-weight: 500;
  color: var(--fg); text-decoration: none;
  padding: 0.55rem 1rem;
  background: var(--surface);
  border: 1px solid rgba(122, 75, 184, 0.18);
  border-radius: 999px;
  box-shadow: var(--shadow-sm);
  transition: all 0.4s var(--spring);
  display: inline-flex; align-items: center; gap: 0.4rem;
}
.nav-cv:hover {
  transform: translateY(-2px) rotate(-1deg);
  box-shadow: var(--shadow-md);
  color: var(--pink);
  border-color: var(--pink-l);
}

@media (max-width: 700px) {
  .nav-link { display: none; }
}

/* ============================================================
   REVEAL
   ============================================================ */

.reveal {
  opacity: 0;
  transform: translateY(14px);
  transition: opacity 0.9s var(--ease), transform 0.9s var(--spring);
  will-change: opacity, transform;
}
.reveal.in { opacity: 1; transform: translateY(0); }
.d1 { transition-delay: 80ms; }
.d2 { transition-delay: 180ms; }
.d3 { transition-delay: 280ms; }
.d4 { transition-delay: 380ms; }
.d5 { transition-delay: 480ms; }
.d6 { transition-delay: 580ms; }

@media (prefers-reduced-motion: reduce) {
  .reveal { opacity: 1; transform: none; transition: none; }
}

/* ============================================================
   HERO
   ============================================================ */

.hero {
  min-height: 100vh;
  padding: clamp(7rem, 14vh, 9rem) 0 clamp(4rem, 8vh, 6rem);
  display: flex; align-items: center;
}

.hero-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: clamp(2rem, 5vw, 4rem);
  align-items: center;
  width: 100%;
}
@media (min-width: 900px) {
  .hero-grid { grid-template-columns: 1.35fr 1fr; gap: 4rem; }
}

.hero-eyebrow {
  display: inline-flex; align-items: center; gap: 0.6rem;
  font-family: var(--sans); font-size: 0.95rem;
  color: var(--fg-soft);
  margin-bottom: 1.75rem;
}
.hero-eyebrow .wave {
  display: inline-block;
  font-size: 1.2rem;
  animation: wave 2.4s ease-in-out infinite;
  transform-origin: 70% 70%;
}
@keyframes wave {
  0%, 100% { transform: rotate(0); }
  20%, 60% { transform: rotate(14deg); }
  40%, 80% { transform: rotate(-8deg); }
}

.hero-headline {
  font-family: var(--serif); font-weight: 500;
  font-variation-settings: 'opsz' 144, 'SOFT' 100, 'WONK' 1;
  font-size: clamp(2.8rem, 7.5vw, 5.6rem);
  line-height: 1.02;
  letter-spacing: -0.025em;
  color: var(--fg);
  margin: 0 0 clamp(1.5rem, 3vh, 2rem) 0;
  max-width: 14ch;
}
.hero-headline em {
  font-style: italic;
  color: var(--pink);
  font-variation-settings: 'opsz' 144, 'SOFT' 100, 'WONK' 1;
}
.hero-headline .underline-soft {
  position: relative; display: inline-block;
}
.hero-headline .underline-soft::after {
  content: '';
  position: absolute;
  left: 0; right: 0; bottom: 0.06em;
  height: 0.32em;
  background: var(--yellow);
  z-index: -1;
  border-radius: 0.16em;
  transform: skewX(-3deg);
}

.hero-sub {
  font-family: var(--sans); font-weight: 400;
  font-size: clamp(1.05rem, 1.3vw, 1.18rem);
  line-height: 1.65;
  color: var(--fg-soft);
  max-width: 32rem;
  margin: 0 0 clamp(2rem, 4vh, 2.5rem) 0;
}
.hero-sub strong { color: var(--fg); font-weight: 600; }

/* CTAs */
.cta-row {
  display: flex; flex-wrap: wrap; align-items: center;
  gap: 0.85rem;
}

.btn {
  display: inline-flex; align-items: center; gap: 0.55rem;
  padding: 0.85rem 1.3rem;
  border-radius: 14px;
  font-family: var(--sans);
  font-size: 0.95rem; font-weight: 500;
  letter-spacing: -0.005em;
  text-decoration: none; cursor: pointer;
  border: 2px solid transparent;
  transition: transform 0.4s var(--spring), background 0.3s var(--ease), border-color 0.3s var(--ease), box-shadow 0.4s var(--ease);
  background: none;
}
.btn-primary {
  color: #FFFFFF;
  background: var(--pink);
  border-color: var(--pink);
  box-shadow: var(--shadow-pink);
}
.btn-primary:hover {
  transform: translateY(-2px) rotate(-1deg);
  background: var(--pink-d);
  border-color: var(--pink-d);
  box-shadow: 0 18px 40px -10px rgba(194, 37, 122, 0.55);
}
.btn-ghost {
  color: var(--fg);
  background: var(--surface);
  border-color: rgba(122, 75, 184, 0.18);
  box-shadow: var(--shadow-sm);
}
.btn-ghost:hover {
  transform: translateY(-2px) rotate(1deg);
  border-color: var(--pink);
  color: var(--pink);
  box-shadow: var(--shadow-md);
}
.btn .arrow { display: inline-block; transition: transform 0.4s var(--spring); }
.btn:hover .arrow { transform: translate(3px, 0); }
.btn-primary:hover .arrow { transform: translate(2px, -2px); }

/* Character illustration container */
.character-wrap {
  position: relative;
  width: 100%; max-width: 400px;
  aspect-ratio: 1 / 1;
  margin: 0 auto;
}
.character-wrap svg { width: 100%; height: 100%; display: block; overflow: visible; }

/* Character animations */
.bob       { animation: bob 4.5s ease-in-out infinite; transform-origin: center; }
.float-1   { animation: float1 6s ease-in-out infinite; transform-origin: center; }
.float-2   { animation: float2 7.5s ease-in-out infinite; transform-origin: center; }
.float-3   { animation: float3 5.5s ease-in-out infinite; transform-origin: center; }
.float-4   { animation: float4 8s ease-in-out infinite; transform-origin: center; }
.spin-slow { animation: spinSlow 50s linear infinite; transform-origin: 50% 50%; }
.blink     { animation: blink 4.2s ease-in-out infinite; transform-origin: center; transform-box: fill-box; }

@keyframes bob {
  0%, 100% { transform: translateY(0); }
  50%      { transform: translateY(-6px); }
}
@keyframes float1 {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50%      { transform: translateY(-10px) rotate(6deg); }
}
@keyframes float2 {
  0%, 100% { transform: translate(0, 0) rotate(0deg); }
  50%      { transform: translate(8px, -12px) rotate(-5deg); }
}
@keyframes float3 {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50%      { transform: translateY(8px) rotate(8deg); }
}
@keyframes float4 {
  0%, 100% { transform: translate(0, 0); }
  50%      { transform: translate(-6px, 8px); }
}
@keyframes spinSlow {
  from { transform: rotate(0deg); } to { transform: rotate(360deg); }
}
@keyframes blink {
  0%, 92%, 100% { transform: scaleY(1); }
  94%, 96%      { transform: scaleY(0.05); }
}

@media (prefers-reduced-motion: reduce) {
  .bob, .float-1, .float-2, .float-3, .float-4, .spin-slow, .blink { animation: none; }
}

/* Notebook strip */
.notebook {
  margin-top: clamp(3.5rem, 7vh, 4.5rem);
  padding: 1.75rem 2rem;
  background: var(--surface);
  border: 1px solid rgba(122, 75, 184, 0.12);
  border-radius: 18px;
  box-shadow: var(--shadow-sm);
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
  position: relative;
}
@media (min-width: 720px) {
  .notebook { grid-template-columns: 1fr 1fr 1fr; gap: 2rem; padding: 2rem 2.25rem; }
}
.notebook::before {
  content: '';
  position: absolute;
  top: -10px; left: 28px;
  width: 64px; height: 18px;
  background: var(--yellow);
  border-radius: 4px;
  transform: rotate(-2deg);
  box-shadow: var(--shadow-xs);
  opacity: 0.9;
}
.nb-label {
  font-family: var(--mono); font-size: 0.66rem;
  letter-spacing: 0.16em; text-transform: uppercase;
  color: var(--pink-d);
  margin-bottom: 0.55rem;
}
.nb-body {
  font-family: var(--sans); font-weight: 400;
  font-size: 0.92rem; line-height: 1.55;
  color: var(--fg);
}
.nb-body .soft {
  display: block;
  margin-top: 0.3rem;
  color: var(--fg-soft);
  font-size: 0.84rem;
}

/* ============================================================
   GENERIC SECTION
   ============================================================ */

.section {
  padding: clamp(6rem, 12vh, 9rem) 0;
  position: relative;
}

.eyebrow {
  display: inline-flex; align-items: center; gap: 0.7rem;
  font-family: var(--mono); font-size: 0.7rem;
  letter-spacing: 0.18em; text-transform: uppercase;
  color: var(--pink);
  margin-bottom: 1.5rem;
}
.eyebrow .dot {
  width: 6px; height: 6px; border-radius: 50%;
  background: var(--pink);
}

.h-display {
  font-family: var(--serif); font-weight: 500;
  font-variation-settings: 'opsz' 144, 'SOFT' 100;
  font-size: clamp(2rem, 4.2vw, 3.2rem);
  line-height: 1.1;
  letter-spacing: -0.018em;
  color: var(--fg);
  margin: 0 0 1.75rem 0;
  max-width: 22ch;
}
.h-display em {
  font-style: italic;
  color: var(--pink);
}

.prose {
  font-family: var(--sans); font-weight: 400;
  font-size: 1.08rem; line-height: 1.75;
  color: var(--fg-soft);
  max-width: var(--max-w-tight);
}
.prose p { margin: 0 0 1.4rem 0; }
.prose p:last-child { margin-bottom: 0; }
.prose strong { color: var(--fg); font-weight: 600; }
.prose em {
  font-family: var(--serif); font-style: italic;
  color: var(--fg); font-size: 1.04em;
  font-variation-settings: 'opsz' 36, 'SOFT' 100;
}

.pullquote {
  font-family: var(--serif); font-style: italic; font-weight: 500;
  font-variation-settings: 'opsz' 72, 'SOFT' 100;
  font-size: clamp(1.5rem, 2.6vw, 1.95rem);
  line-height: 1.4;
  letter-spacing: -0.005em;
  color: var(--fg);
  margin: 2.5rem 0;
  padding: 1.25rem 1.5rem 1.25rem 1.75rem;
  background: var(--pink-bg);
  border-left: 4px solid var(--pink);
  border-radius: 0 16px 16px 0;
  max-width: 32rem;
}

/* About — two-column with character avatar */
.about-grid {
  display: grid; grid-template-columns: 1fr;
  gap: clamp(2rem, 4vw, 3rem);
  align-items: start;
}
@media (min-width: 880px) {
  .about-grid { grid-template-columns: 220px 1fr; gap: 4rem; }
}
.about-side { padding-top: 0.3rem; }
@media (min-width: 880px) {
  .about-side { position: sticky; top: 7rem; }
}

.avatar-wrap {
  width: 140px; height: 140px;
  position: relative;
  margin-bottom: 1.2rem;
  transition: transform 0.5s var(--spring);
  cursor: default;
}
.avatar-wrap:hover { transform: rotate(-6deg) scale(1.05); }
.avatar-wrap svg { width: 100%; height: 100%; display: block; }

.questions {
  margin-top: 3rem;
  padding: 1.75rem 2rem;
  background: var(--cyan-bg);
  border-radius: 20px;
  border: 1px solid rgba(15, 168, 197, 0.20);
  position: relative;
}
.questions::before {
  content: '?';
  position: absolute;
  top: -16px; right: 24px;
  width: 36px; height: 36px;
  background: var(--cyan);
  border-radius: 50%;
  color: var(--surface);
  display: grid; place-items: center;
  font-family: var(--serif); font-weight: 700;
  font-size: 1.4rem;
  box-shadow: var(--shadow-cyan);
}
.questions-label {
  font-family: var(--mono); font-size: 0.68rem;
  letter-spacing: 0.16em; text-transform: uppercase;
  color: var(--cyan-d);
  margin-bottom: 1.25rem;
}
.questions ul { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 0.95rem; }
.questions li {
  display: flex; gap: 0.85rem; align-items: baseline;
  font-family: var(--serif); font-style: italic;
  font-variation-settings: 'opsz' 36, 'SOFT' 100;
  font-size: 1.08rem; line-height: 1.55;
  color: var(--fg);
}
.questions li .num {
  font-family: var(--mono); font-style: normal;
  font-size: 0.7rem; letter-spacing: 0.12em;
  color: var(--cyan-d);
  flex-shrink: 0;
  padding-top: 0.4rem;
}

/* ============================================================
   TEARDOWN CARDS
   ============================================================ */

.doors {
  display: grid;
  grid-template-columns: 1fr;
  gap: clamp(1.5rem, 3vw, 2.25rem);
}
@media (min-width: 920px) {
  .doors { grid-template-columns: 1fr 1fr; }
}

.door {
  position: relative;
  display: flex; flex-direction: column;
  background: var(--surface);
  border: 1px solid rgba(122, 75, 184, 0.10);
  border-radius: 22px;
  overflow: hidden;
  text-align: left; text-decoration: none; color: inherit;
  cursor: pointer; padding: 0;
  box-shadow: var(--shadow-sm);
  transition: transform 0.5s var(--spring), box-shadow 0.5s var(--ease), border-color 0.4s var(--ease);
}
.door:hover {
  transform: translateY(-6px) rotate(-0.4deg);
  box-shadow: var(--shadow-lg);
  border-color: var(--pink-l);
}
.door.cyan:hover {
  transform: translateY(-6px) rotate(0.4deg);
  border-color: var(--cyan-l);
}

.door-visual {
  position: relative;
  aspect-ratio: 16 / 10;
  background: var(--pink-bg);
  overflow: hidden;
}
.door.cyan .door-visual { background: var(--cyan-bg); }

.door-meta {
  position: absolute; top: 0.95rem; left: 1.1rem;
  font-family: var(--mono); font-size: 0.62rem;
  letter-spacing: 0.16em; text-transform: uppercase;
  color: var(--fg-muted);
  z-index: 2;
}
.door-tag {
  position: absolute; top: 0.95rem; right: 1.1rem;
  font-family: var(--mono); font-size: 0.62rem;
  letter-spacing: 0.14em; text-transform: uppercase;
  color: var(--surface);
  background: var(--pink);
  padding: 0.3rem 0.7rem;
  border-radius: 999px;
  z-index: 2;
  font-weight: 500;
}
.door.cyan .door-tag { background: var(--cyan-d); }

.door-text {
  padding: 1.75rem 1.85rem 2rem;
  display: flex; flex-direction: column;
  gap: 1rem; flex: 1;
}
@media (min-width: 920px) {
  .door-text { padding: 2rem 2.1rem 2.25rem; }
}

.door-title {
  font-family: var(--serif); font-weight: 500;
  font-variation-settings: 'opsz' 72, 'SOFT' 100;
  font-size: clamp(1.4rem, 2.2vw, 1.7rem);
  line-height: 1.15;
  letter-spacing: -0.015em;
  color: var(--fg);
  margin: 0;
}
.door-title em { font-style: italic; color: var(--pink); }
.door.cyan .door-title em { color: var(--cyan-d); }

.door-sub {
  font-family: var(--sans); font-weight: 400;
  font-size: 0.96rem; line-height: 1.6;
  color: var(--fg-soft);
}

.door-foot {
  margin-top: auto; padding-top: 0.6rem;
  display: flex; align-items: center; justify-content: space-between;
  gap: 1rem; flex-wrap: wrap;
}
.door-chips { display: flex; flex-wrap: wrap; gap: 0.35rem; }
.chip {
  font-family: var(--sans); font-size: 0.72rem;
  font-weight: 500;
  padding: 0.28rem 0.65rem;
  border-radius: 999px;
}
.door:not(.cyan) .chip { background: var(--pink-bg); color: var(--pink-d); }
.door.cyan .chip { background: var(--cyan-bg); color: var(--cyan-d); }

.door-cta {
  font-family: var(--sans); font-size: 0.88rem;
  font-weight: 600;
  color: var(--pink);
  display: inline-flex; align-items: center; gap: 0.4rem;
  transition: gap 0.4s var(--spring);
}
.door.cyan .door-cta { color: var(--cyan-d); }
.door:hover .door-cta { gap: 0.7rem; }

/* ============================================================
   INTERLUDE
   ============================================================ */

.interlude {
  padding: clamp(6rem, 12vh, 10rem) 0;
  text-align: center;
}

.interlude-mark-wrap { display: inline-block; margin-bottom: 2.5rem; }
.interlude-mark {
  color: var(--pink);
  animation: markFloat 6s ease-in-out infinite;
  display: inline-block;
}
@keyframes markFloat {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50%      { transform: translateY(-6px) rotate(8deg); }
}

.interlude-text {
  font-family: var(--serif); font-weight: 500;
  font-variation-settings: 'opsz' 144, 'SOFT' 100, 'WONK' 1;
  font-size: clamp(1.6rem, 3vw, 2.3rem);
  line-height: 1.4;
  letter-spacing: -0.012em;
  color: var(--fg);
  max-width: 28rem;
  margin: 0 auto;
}
.interlude-text em { font-style: italic; color: var(--pink); }

.interlude-sig {
  font-family: var(--serif); font-style: italic; font-weight: 400;
  font-variation-settings: 'opsz' 36, 'SOFT' 100;
  font-size: 1.1rem;
  color: var(--fg-muted);
  display: block; margin-top: 2.25rem;
}

/* ============================================================
   CONTACT
   ============================================================ */

.contact-card {
  position: relative;
  padding: clamp(2rem, 4vw, 3.25rem);
  background: var(--surface);
  border: 1px solid rgba(122, 75, 184, 0.12);
  border-radius: 26px;
  box-shadow: var(--shadow-md);
  overflow: hidden;
}
.contact-card::before {
  content: '';
  position: absolute;
  top: -100px; right: -80px;
  width: 280px; height: 280px;
  background: radial-gradient(circle, var(--pink-bg) 0%, transparent 70%);
  pointer-events: none;
}
.contact-card::after {
  content: '';
  position: absolute;
  bottom: -120px; left: -80px;
  width: 260px; height: 260px;
  background: radial-gradient(circle, var(--cyan-bg) 0%, transparent 70%);
  pointer-events: none;
}
.contact-card > * { position: relative; z-index: 1; }

.contact-headline {
  font-family: var(--serif); font-weight: 500;
  font-variation-settings: 'opsz' 144, 'SOFT' 100;
  font-size: clamp(1.85rem, 3.6vw, 2.7rem);
  line-height: 1.1;
  letter-spacing: -0.022em;
  color: var(--fg);
  max-width: 22ch;
  margin: 0 0 1.25rem 0;
}
.contact-headline em { font-style: italic; color: var(--pink); }

.contact-lede {
  font-family: var(--sans); font-weight: 400;
  font-size: 1rem; line-height: 1.7;
  color: var(--fg-soft);
  max-width: 36rem;
  margin: 0 0 2rem 0;
}

.contact-rows {
  display: flex; flex-direction: column;
  max-width: 32rem;
}

.contact-row {
  display: flex; justify-content: space-between; align-items: center;
  padding: 1rem 0;
  border-top: 1px dashed rgba(122, 75, 184, 0.20);
  text-decoration: none; color: var(--fg);
  font-size: 0.95rem;
  transition: color 0.3s var(--ease), padding-left 0.4s var(--spring);
}
.contact-row:last-of-type { border-bottom: 1px dashed rgba(122, 75, 184, 0.20); }
.contact-row:hover { color: var(--pink); padding-left: 0.5rem; }
.contact-row .ckey {
  font-family: var(--mono); font-size: 0.68rem;
  letter-spacing: 0.16em; text-transform: uppercase;
  color: var(--fg-muted);
}
.contact-row .cval {
  display: flex; align-items: center; gap: 0.6rem;
  font-family: var(--sans); font-weight: 500;
}
.contact-row .carr {
  color: var(--fg-faint);
  transition: color 0.3s var(--ease), transform 0.4s var(--spring);
}
.contact-row:hover .carr { color: var(--pink); transform: translateX(4px); }

/* ============================================================
   FOOTER
   ============================================================ */

.footer {
  padding: 2.5rem var(--gutter) 3rem;
  margin-top: 3rem;
  border-top: 1px solid rgba(122, 75, 184, 0.10);
  display: flex; justify-content: space-between;
  align-items: center; flex-wrap: wrap; gap: 1rem;
  font-family: var(--sans); font-size: 0.84rem;
  color: var(--fg-muted);
}
.footer-mark { display: flex; align-items: center; gap: 0.55rem; color: var(--pink); }
.footer em { font-family: var(--serif); font-style: italic; font-variation-settings: 'opsz' 36, 'SOFT' 100; }

/* ============================================================
   TEARDOWN PAGES
   ============================================================ */

.td-page { position: relative; padding-top: clamp(6rem, 11vh, 9rem); }

.td-back-row { margin-bottom: clamp(2.5rem, 5vh, 3.5rem); }
.td-back {
  font-family: var(--sans); font-size: 0.92rem; font-weight: 500;
  color: var(--fg-soft);
  background: none; border: none; padding: 0; cursor: pointer;
  display: inline-flex; align-items: center; gap: 0.55rem;
  transition: color 0.3s var(--ease), gap 0.4s var(--spring);
}
.td-back:hover { color: var(--pink); gap: 0.85rem; }

.td-hero {
  padding: clamp(2.5rem, 5vh, 3.5rem) 0 clamp(3.5rem, 7vh, 5rem);
  border-bottom: 2px dashed rgba(122, 75, 184, 0.15);
  margin-bottom: clamp(3.5rem, 7vw, 5rem);
}

.td-eyebrow {
  font-family: var(--mono); font-size: 0.7rem;
  letter-spacing: 0.2em; text-transform: uppercase;
  color: var(--pink);
  display: inline-flex; align-items: center; gap: 0.6rem;
  margin-bottom: 1.5rem;
}
.td-eyebrow .dot { width: 6px; height: 6px; border-radius: 50%; background: var(--pink); }

.td-title {
  font-family: var(--serif); font-weight: 500;
  font-variation-settings: 'opsz' 144, 'SOFT' 100, 'WONK' 1;
  font-size: clamp(2.3rem, 5.5vw, 3.8rem);
  line-height: 1.04;
  letter-spacing: -0.028em;
  color: var(--fg);
  margin: 0 0 1.5rem 0;
  max-width: 22ch;
}
.td-title em { font-style: italic; color: var(--pink); }

.td-subtitle {
  font-family: var(--sans); font-weight: 400;
  font-size: clamp(1.05rem, 1.4vw, 1.2rem);
  line-height: 1.6;
  color: var(--fg-soft);
  max-width: 38rem;
  margin: 0 0 2.25rem 0;
}

.td-meta {
  display: flex; flex-wrap: wrap; align-items: center;
  gap: 1rem;
  font-family: var(--sans); font-size: 0.85rem;
  color: var(--fg-muted);
}
.td-meta .sep { width: 4px; height: 4px; border-radius: 50%; background: var(--fg-faint); }
.td-meta .pdf-link {
  margin-left: auto;
  padding: 0.55rem 1rem; border-radius: 999px;
  border: 1.5px solid var(--pink);
  color: var(--pink); text-decoration: none;
  font-weight: 500;
  display: inline-flex; align-items: center; gap: 0.5rem;
  background: var(--surface);
  transition: all 0.4s var(--spring);
}
.td-meta .pdf-link:hover {
  background: var(--pink);
  color: var(--surface);
  transform: translateY(-2px) rotate(-1deg);
  box-shadow: var(--shadow-pink);
}

.td-section { margin-bottom: clamp(3.5rem, 7vw, 5.5rem); }

.td-mark {
  display: inline-flex; align-items: center; gap: 0.65rem;
  font-family: var(--mono); font-size: 0.7rem;
  letter-spacing: 0.2em; text-transform: uppercase;
  color: var(--pink);
  margin-bottom: 1.5rem;
}
.td-mark .dot { width: 5px; height: 5px; border-radius: 50%; background: var(--pink); }
.td-mark .line {
  display: inline-block; width: 32px; height: 1px;
  background: linear-gradient(90deg, var(--pink), transparent);
  margin-left: 0.4rem;
}

.td-h2 {
  font-family: var(--serif); font-weight: 500;
  font-variation-settings: 'opsz' 144, 'SOFT' 100;
  font-size: clamp(1.7rem, 3vw, 2.3rem);
  line-height: 1.15;
  letter-spacing: -0.02em;
  color: var(--fg);
  margin: 0 0 1.75rem 0;
  max-width: 26ch;
}
.td-h2 em { font-style: italic; color: var(--pink); }

.td-p {
  font-family: var(--sans); font-weight: 400;
  font-size: 1.05rem; line-height: 1.78;
  color: var(--fg-soft);
  margin: 0 0 1.4rem 0;
  max-width: 38rem;
}
.td-p strong { color: var(--fg); font-weight: 600; }
.td-p em {
  font-family: var(--serif); font-style: italic; color: var(--fg);
  font-size: 1.05em;
  font-variation-settings: 'opsz' 36, 'SOFT' 100;
}

.td-pull {
  font-family: var(--serif); font-style: italic; font-weight: 500;
  font-variation-settings: 'opsz' 72, 'SOFT' 100;
  font-size: clamp(1.45rem, 2.6vw, 1.95rem);
  line-height: 1.42;
  letter-spacing: -0.005em;
  color: var(--fg);
  margin: 2.5rem 0;
  padding: 1.5rem 1.75rem;
  background: var(--pink-bg);
  border-left: 4px solid var(--pink);
  border-radius: 0 16px 16px 0;
}
.td-pull-attr {
  display: block;
  font-family: var(--sans); font-style: normal;
  font-size: 0.85rem;
  color: var(--fg-muted);
  margin-top: 0.85rem;
  font-weight: 500;
}

.td-big {
  font-family: var(--serif); font-weight: 500;
  font-variation-settings: 'opsz' 144, 'SOFT' 100, 'WONK' 1;
  font-size: clamp(1.85rem, 3.4vw, 2.5rem);
  line-height: 1.25;
  letter-spacing: -0.018em;
  color: var(--fg);
  text-align: center;
  margin: 3rem auto;
  max-width: 30ch;
}
.td-big em { font-style: italic; color: var(--pink); }

.td-soft {
  display: grid; gap: 1rem;
  margin: 2rem 0;
  grid-template-columns: 1fr;
}
@media (min-width: 720px) { .td-soft.cols-2 { grid-template-columns: 1fr 1fr; } }
.td-soft-item {
  padding: 1.4rem 1.5rem;
  background: var(--surface);
  border: 1px solid rgba(122, 75, 184, 0.08);
  border-radius: 16px;
  box-shadow: var(--shadow-xs);
  transition: transform 0.4s var(--spring), box-shadow 0.4s var(--ease);
}
.td-soft-item:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-sm);
}
.td-soft-num {
  font-family: var(--mono); font-size: 0.64rem;
  letter-spacing: 0.16em; text-transform: uppercase;
  color: var(--pink);
  font-weight: 500;
  margin-bottom: 0.55rem;
}
.td-soft-title {
  font-family: var(--serif); font-weight: 500;
  font-variation-settings: 'opsz' 36, 'SOFT' 100;
  font-size: 1.1rem; line-height: 1.3;
  color: var(--fg);
  margin-bottom: 0.5rem;
  letter-spacing: -0.005em;
}
.td-soft-body {
  font-family: var(--sans); font-weight: 400;
  font-size: 0.93rem; line-height: 1.65;
  color: var(--fg-soft);
}

.td-steps {
  display: grid; gap: 0.7rem;
  grid-template-columns: repeat(2, 1fr);
  margin: 2rem 0;
}
@media (min-width: 700px) { .td-steps { grid-template-columns: repeat(3, 1fr); } }
@media (min-width: 980px) { .td-steps { grid-template-columns: repeat(6, 1fr); gap: 0.85rem; } }
.td-step {
  padding: 0.9rem 1rem;
  background: var(--yellow-bg);
  border-radius: 12px;
  border: 1px solid rgba(252, 196, 25, 0.42);
}
.td-step-n {
  font-family: var(--mono); font-size: 0.62rem;
  letter-spacing: 0.14em; color: var(--pink);
  font-weight: 600;
  margin-bottom: 0.3rem;
}
.td-step-t {
  font-family: var(--sans); font-size: 0.86rem;
  font-weight: 500;
  line-height: 1.4; color: var(--fg);
}

.td-stats {
  display: grid; gap: 1rem;
  grid-template-columns: 1fr;
  margin: 2rem 0;
}
@media (min-width: 720px) { .td-stats { grid-template-columns: repeat(3, 1fr); } }
.td-stat {
  padding: 1.6rem 1.6rem;
  background: var(--cyan-bg);
  border: 1px solid rgba(15, 168, 197, 0.20);
  border-radius: 16px;
}
.td-stat-n {
  font-family: var(--serif); font-weight: 600;
  font-variation-settings: 'opsz' 144, 'SOFT' 100;
  font-size: clamp(2rem, 3.6vw, 2.7rem);
  line-height: 1; letter-spacing: -0.028em;
  color: var(--cyan-d);
  margin-bottom: 0.5rem;
}
.td-stat-l {
  font-family: var(--sans); font-weight: 400;
  font-size: 0.92rem; line-height: 1.55;
  color: var(--fg-soft);
}

.td-compare {
  margin: 2rem 0;
  border: 1px solid rgba(122, 75, 184, 0.10);
  border-radius: 18px;
  overflow: hidden;
  background: var(--surface);
}
.td-cr {
  display: grid; grid-template-columns: 1fr 30px 1fr;
  align-items: center;
  padding: 1.1rem 1.4rem;
  border-bottom: 1px solid rgba(122, 75, 184, 0.08);
}
.td-cr:last-child { border-bottom: none; }
.td-cr.head {
  background: var(--bg-warm);
  font-family: var(--mono); font-size: 0.64rem;
  letter-spacing: 0.18em; text-transform: uppercase;
  color: var(--fg-muted);
  font-weight: 500;
}
.td-cr .arr {
  text-align: center; color: var(--pink);
  font-family: var(--sans); font-size: 1rem; font-weight: 600;
}
.td-cr .l {
  color: var(--fg-soft); font-weight: 400;
  font-size: 0.95rem; line-height: 1.45;
}
.td-cr .r {
  color: var(--fg); font-weight: 500;
  font-family: var(--serif); font-variation-settings: 'opsz' 36, 'SOFT' 100;
  font-style: italic; font-size: 1.05rem; line-height: 1.45;
}

.td-quest {
  display: flex; flex-direction: column; gap: 1rem;
  margin: 2rem 0;
}
.td-q {
  padding: 1.35rem 1.6rem;
  background: var(--cyan-bg);
  border-radius: 14px;
  border-left: 4px solid var(--cyan);
}
.td-q-tag {
  font-family: var(--mono); font-size: 0.62rem;
  letter-spacing: 0.16em; text-transform: uppercase;
  color: var(--cyan-d);
  font-weight: 600;
  margin-bottom: 0.6rem;
}
.td-q-text {
  font-family: var(--serif); font-style: italic; font-weight: 500;
  font-variation-settings: 'opsz' 36, 'SOFT' 100;
  font-size: 1.08rem; line-height: 1.5;
  color: var(--fg);
}

.td-callout {
  margin: 1.75rem 0;
  padding: 1.5rem 1.7rem;
  background: var(--purple-bg);
  border-radius: 14px;
  border-left: 4px solid var(--purple);
}
.td-callout-tag {
  font-family: var(--mono); font-size: 0.62rem;
  letter-spacing: 0.16em; text-transform: uppercase;
  color: var(--purple-d);
  font-weight: 600;
  margin-bottom: 0.7rem;
  display: block;
}
.td-callout-body {
  font-family: var(--sans); font-weight: 400;
  font-size: 1rem; line-height: 1.7;
  color: var(--fg-soft);
}
.td-callout-body strong { color: var(--fg); font-weight: 600; }

.td-symptoms {
  display: grid; gap: 0.65rem;
  grid-template-columns: 1fr;
  margin: 2rem 0;
}
@media (min-width: 700px) { .td-symptoms { grid-template-columns: 1fr 1fr; } }
.td-symp {
  padding: 0.95rem 1.2rem;
  background: var(--pink-bg);
  border-radius: 12px;
  font-family: var(--sans); font-weight: 500;
  font-size: 0.94rem; line-height: 1.5;
  color: var(--fg);
  display: flex; gap: 0.65rem; align-items: baseline;
}
.td-symp::before { content: '·'; color: var(--pink); font-weight: 700; font-size: 1.2rem; }

.td-big-stat {
  margin: 3rem 0;
  padding: 2.5rem 2rem;
  text-align: center;
  background: var(--yellow-bg);
  border-radius: 24px;
  position: relative;
}
.td-big-stat::before {
  content: '✦';
  position: absolute;
  top: 18px; right: 22px;
  font-size: 1.3rem;
  color: var(--yellow-d);
  opacity: 0.7;
}
.td-big-stat-n {
  font-family: var(--serif); font-weight: 600;
  font-variation-settings: 'opsz' 144, 'SOFT' 100, 'WONK' 1;
  font-size: clamp(3.5rem, 8vw, 5.5rem);
  line-height: 1; letter-spacing: -0.04em;
  color: var(--pink);
  margin-bottom: 0.6rem;
}
.td-big-stat-l {
  font-family: var(--sans); font-weight: 400;
  font-size: 1.05rem; line-height: 1.55;
  color: var(--fg-soft);
  max-width: 32ch; margin: 0 auto;
}
.td-big-stat-l strong { color: var(--fg); font-weight: 600; }

.td-end {
  margin-top: clamp(5rem, 10vw, 7rem);
  padding-top: clamp(2.5rem, 5vw, 3.5rem);
  border-top: 2px dashed rgba(122, 75, 184, 0.15);
  text-align: center;
}
.td-end-text {
  font-family: var(--serif); font-style: italic; font-weight: 500;
  font-variation-settings: 'opsz' 36, 'SOFT' 100;
  font-size: 1.2rem; color: var(--fg-soft);
  margin: 0 0 2rem 0;
}
.td-end-row { display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap; }

`;

/* ============================================================
   Hooks
   ============================================================ */

function useReveal() {
  onMount(() => {
    const els = document.querySelectorAll('.reveal');
    if (!('IntersectionObserver' in window)) {
      els.forEach((el) => el.classList.add('in'));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      }),
      { threshold: 0.10, rootMargin: '0px 0px -6% 0px' }
    );
    els.forEach((el) => io.observe(el));
    onCleanup(() => io.disconnect());
  });
}

function useScrolled() {
  const [scrolled, setScrolled] = createSignal(false);
  onMount(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    onCleanup(() => window.removeEventListener('scroll', onScroll));
  });
  return scrolled;
}

function useLiveTime() {
  const [now, setNow] = createSignal(new Date());
  onMount(() => {
    const id = setInterval(() => setNow(new Date()), 30_000);
    onCleanup(() => clearInterval(id));
  });
  return createMemo(() => {
    const n = now();
    try {
      const t = new Intl.DateTimeFormat('en-GB', {
        hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'Asia/Kolkata',
      }).format(n);
      return `${t} IST`;
    } catch {
      return n.toTimeString().slice(0, 5);
    }
  });
}

function useHashRoute() {
  const [route, setRoute] = createSignal(
    typeof window === 'undefined' ? '/' : (window.location.hash.replace(/^#/, '') || '/')
  );
  onMount(() => {
    const onHashChange = () => {
      const r = window.location.hash.replace(/^#/, '') || '/';
      setRoute(r);
      window.scrollTo(0, 0);
    };
    window.addEventListener('hashchange', onHashChange);
    onCleanup(() => window.removeEventListener('hashchange', onHashChange));
  });
  return route;
}

function useNoIndex() {
  onMount(() => {
    const meta = document.createElement('meta');
    meta.name = 'robots';
    meta.content = 'noindex, nofollow';
    document.head.appendChild(meta);
    onCleanup(() => { try { document.head.removeChild(meta); } catch {} });
  });
}

function go(path) { window.location.hash = path; }

/* ============================================================
   Mark
   ============================================================ */

function AsteriskMark({ size = 16, extraClass = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24"
         class={`asterisk ${extraClass}`} xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M12.1 3.4 C 11.9 8 12.2 14 11.9 20.6" />
      <path d="M4.8 7.5 C 8 9.6 16 14.4 19.3 16.4" />
      <path d="M5.1 16.6 C 9 14.5 14.9 9.6 19 7.4" />
    </svg>
  );
}

/* ============================================================
   CHARACTER — Kunal's placeholder portrait
   TODO[KUNAL]: send photos and I'll iterate on features
   (hair style, glasses, skin tone, anything distinguishing).
   Currently: dark hair, warm tan skin, casual cyan tee, no glasses.
   ============================================================ */

function CharacterFace({ size = 360, withBody = true, withDecor = true }) {
  return (
    <svg viewBox="0 0 360 360" xmlns="http://www.w3.org/2000/svg"
         style={{ width: '100%', height: '100%', display: 'block', overflow: 'visible' }}>
      <defs>
        <radialGradient id="bgRing" cx="50%" cy="50%" r="50%">
          <stop offset="0%"  stopColor="#FFF4D0" />
          <stop offset="70%" stopColor="#FFF4D0" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#FFF4D0" stopOpacity="0" />
        </radialGradient>
        <clipPath id="shirtClipHero">
          <path d="M 105 270 Q 100 240, 130 226 L 230 226 Q 260 240, 255 270 L 255 295 L 105 295 Z" />
        </clipPath>
      </defs>

      {/* Soft yellow halo */}
      {withDecor && (
        <circle cx="180" cy="180" r="160" fill="url(#bgRing)" />
      )}

      {/* Slow-spinning dashed orbit */}
      {withDecor && (
        <g class="spin-slow">
          <ellipse cx="180" cy="180" rx="135" ry="38" fill="none"
                   stroke="#EE3C95" strokeOpacity="0.30" strokeWidth="1.4"
                   strokeDasharray="3 7" />
        </g>
      )}

      {/* Inner pink circle backdrop */}
      <circle cx="180" cy="180" r="120" fill="#FCE0EE" />
      <circle cx="180" cy="180" r="120" fill="none" stroke="#EE3C95" strokeOpacity="0.20" strokeWidth="1.5" />

      {/* Character group */}
      <g class="bob">
        {/* T-shirt: black/white color-block (matches Kunal's actual style) */}
        {withBody && (
          <>
            <rect x="100" y="220" width="80" height="80" fill="#1F1A2E" clipPath="url(#shirtClipHero)" />
            <rect x="180" y="220" width="80" height="80" fill="#FFFFFF" clipPath="url(#shirtClipHero)" />
            <line x1="180" y1="226" x2="180" y2="295" stroke="#5C5969" strokeWidth="0.6" strokeOpacity="0.4" />
            <path d="M 105 270 Q 100 240, 130 226 L 230 226 Q 260 240, 255 270 L 255 295 L 105 295 Z"
                  fill="none" stroke="#1F1A2E" strokeWidth="1.8" strokeLinejoin="round" />
            <path d="M 158 226 Q 180 245, 202 226"
                  fill="#FCE0EE" stroke="#1F1A2E" strokeWidth="1.8" strokeLinecap="round" />
            <rect x="167" y="215" width="26" height="22" fill="#B57F4A" />
            <line x1="167" y1="216" x2="167" y2="235" stroke="#8B5E32" strokeWidth="1.2" strokeOpacity="0.5" />
            <line x1="193" y1="216" x2="193" y2="235" stroke="#8B5E32" strokeWidth="1.2" strokeOpacity="0.5" />
          </>
        )}

        {/* Head */}
        <ellipse cx="180" cy="170" rx="65" ry="70" fill="#B57F4A" />
        <path d="M 235 145 Q 247 200, 222 235"
              stroke="#8B5E32" strokeOpacity="0.30" strokeWidth="3" fill="none" strokeLinecap="round" />

        {/* Full beard */}
        <path d="M 122 180 C 115 215, 128 250, 158 258 C 175 264, 185 264, 202 258 C 232 250, 245 215, 238 180 C 232 188, 222 192, 208 192 C 198 192, 192 192, 180 192 C 168 192, 162 192, 152 192 C 138 192, 128 188, 122 180 Z"
              fill="#1E0F08" />
        <path d="M 138 220 Q 142 232, 140 240" stroke="#000" strokeOpacity="0.3" strokeWidth="0.8" fill="none" />
        <path d="M 168 240 Q 172 248, 170 254" stroke="#000" strokeOpacity="0.3" strokeWidth="0.8" fill="none" />
        <path d="M 192 240 Q 196 248, 194 254" stroke="#000" strokeOpacity="0.3" strokeWidth="0.8" fill="none" />
        <path d="M 218 218 Q 222 228, 220 236" stroke="#000" strokeOpacity="0.3" strokeWidth="0.8" fill="none" />

        {/* Mustache */}
        <path d="M 152 195 Q 162 188, 175 193 Q 180 195, 185 193 Q 198 188, 208 195 L 205 204 Q 196 199, 188 202 Q 180 204, 172 202 Q 164 199, 155 204 Z"
              fill="#1E0F08" />

        {/* Hair — curly bumpy silhouette */}
        <path d="M 120 140 C 100 115, 105 70, 140 65 Q 150 50, 170 60 Q 180 46, 195 60 Q 212 50, 232 65 C 265 70, 260 115, 240 140 C 232 134, 222 130, 212 135 C 200 128, 188 128, 178 132 C 168 128, 156 130, 148 135 C 138 132, 128 134, 120 140 Z"
              fill="#1E0F08" />
        <path d="M 155 70 Q 160 62, 168 68" stroke="#000" strokeOpacity="0.4" strokeWidth="2" strokeLinecap="round" fill="none" />
        <path d="M 195 65 Q 202 58, 212 64" stroke="#000" strokeOpacity="0.4" strokeWidth="2" strokeLinecap="round" fill="none" />
        <path d="M 175 85 Q 182 78, 192 84" stroke="#000" strokeOpacity="0.4" strokeWidth="2" strokeLinecap="round" fill="none" />

        {/* Eyebrows */}
        <path d="M 145 158 Q 158 150, 172 156" stroke="#1E0F08" strokeWidth="4.5" strokeLinecap="round" fill="none" />
        <path d="M 188 156 Q 202 150, 215 158" stroke="#1E0F08" strokeWidth="4.5" strokeLinecap="round" fill="none" />

        {/* Eyes with blink */}
        <g class="blink">
          <ellipse cx="159" cy="175" rx="3.5" ry="4.8" fill="#1F1A2E" />
          <ellipse cx="201" cy="175" rx="3.5" ry="4.8" fill="#1F1A2E" />
          <circle cx="160" cy="174" r="1.3" fill="#FFFFFF" />
          <circle cx="202" cy="174" r="1.3" fill="#FFFFFF" />
        </g>

        {/* Nose */}
        <path d="M 180 178 Q 177 188, 182 192"
              stroke="#8B5E32" strokeOpacity="0.55" strokeWidth="1.5" strokeLinecap="round" fill="none" />

        {/* Cheek warmth */}
        <ellipse cx="148" cy="183" rx="6" ry="3" fill="#EE3C95" opacity="0.20" />
        <ellipse cx="212" cy="183" rx="6" ry="3" fill="#EE3C95" opacity="0.20" />

        {/* Smile peeking through beard */}
        <path d="M 170 213 Q 180 218, 190 213"
              stroke="#1F1A2E" strokeWidth="2.2" strokeLinecap="round" fill="none" />
      </g>

      {/* Floating decorations */}
      {withDecor && (
        <>
          <g transform="translate(70, 90)" class="float-1">
            <path d="M 0 4 C -4 -2, -10 -2, -10 4 C -10 10, 0 14, 0 14 C 0 14, 10 10, 10 4 C 10 -2, 4 -2, 0 4 Z" fill="#EE3C95" />
          </g>
          <g transform="translate(285, 80)" class="float-2">
            <path d="M 0 -10 L 3 -3 L 10 -3 L 4 2 L 7 10 L 0 5 L -7 10 L -4 2 L -10 -3 L -3 -3 Z"
                  fill="#FCC419" stroke="#E8A704" strokeWidth="1.2" strokeLinejoin="round" />
          </g>
          <g transform="translate(310, 200)" class="float-3">
            <path d="M -18 0 Q -9 -8, 0 0 T 18 0" stroke="#3DD2EF" strokeWidth="3" strokeLinecap="round" fill="none" />
          </g>
          <g transform="translate(60, 235)" class="float-4">
            <circle cx="0" cy="0" r="4" fill="#A971E5" />
            <circle cx="12" cy="-5" r="3" fill="#A971E5" opacity="0.7" />
            <circle cx="10" cy="6" r="2.5" fill="#A971E5" opacity="0.55" />
          </g>
          <g transform="translate(305, 265)" class="float-1">
            <circle cx="0" cy="0" r="3" fill="#0FA8C5" />
            <circle cx="-6" cy="-3" r="2.2" fill="#0FA8C5" opacity="0.7" />
            <circle cx="-10" cy="2" r="1.8" fill="#0FA8C5" opacity="0.5" />
          </g>
          <g transform="translate(95, 175)" class="float-3">
            <path d="M 0 -5 L 0 5 M -5 0 L 5 0" stroke="#EE3C95" strokeWidth="1.6" strokeLinecap="round" />
          </g>
          <g transform="translate(280, 305)" class="float-2">
            <path d="M 0 -4 L 0 4 M -4 0 L 4 0" stroke="#FCC419" strokeWidth="1.5" strokeLinecap="round" />
          </g>
          <g transform="translate(110, 295)" class="float-4">
            <path d="M 0 -3 L 0 3 M -3 0 L 3 0" stroke="#A971E5" strokeWidth="1.4" strokeLinecap="round" />
          </g>
        </>
      )}
    </svg>
  );
}

/* Avatar (smaller, no body/decor) for About sidebar */
function CharacterAvatar() {
  return (
    <div class="avatar-wrap" aria-label="Portrait of Kunal">
      <svg viewBox="80 80 200 240" xmlns="http://www.w3.org/2000/svg"
           style={{ width: '100%', height: '100%', display: 'block' }}>
        <defs>
          <clipPath id="shirtClipAvatar">
            <path d="M 125 285 Q 120 260, 145 250 L 215 250 Q 240 260, 235 285 L 235 320 L 125 320 Z" />
          </clipPath>
        </defs>

        {/* Pink backdrop */}
        <circle cx="180" cy="200" r="92" fill="#FCE0EE" />
        <circle cx="180" cy="200" r="92" fill="none" stroke="#EE3C95" strokeOpacity="0.22" strokeWidth="1.5" />

        {/* T-shirt color-block */}
        <rect x="120" y="246" width="60" height="80" fill="#1F1A2E" clipPath="url(#shirtClipAvatar)" />
        <rect x="180" y="246" width="60" height="80" fill="#FFFFFF" clipPath="url(#shirtClipAvatar)" />
        <path d="M 125 285 Q 120 260, 145 250 L 215 250 Q 240 260, 235 285 L 235 320 L 125 320 Z"
              fill="none" stroke="#1F1A2E" strokeWidth="1.8" strokeLinejoin="round" />
        <path d="M 158 250 Q 180 268, 202 250"
              fill="#FCE0EE" stroke="#1F1A2E" strokeWidth="1.8" strokeLinecap="round" />
        <rect x="167" y="240" width="26" height="22" fill="#B57F4A" />

        {/* Head */}
        <ellipse cx="180" cy="190" rx="62" ry="65" fill="#B57F4A" />
        <path d="M 234 168 Q 244 215, 220 245"
              stroke="#8B5E32" strokeOpacity="0.30" strokeWidth="3" fill="none" strokeLinecap="round" />

        {/* Beard */}
        <path d="M 124 198 C 117 230, 130 260, 156 270 C 175 276, 185 276, 204 270 C 230 260, 243 230, 236 198 C 230 206, 220 210, 208 210 C 198 210, 192 210, 180 210 C 168 210, 162 210, 152 210 C 140 210, 130 206, 124 198 Z"
              fill="#1E0F08" />

        {/* Mustache */}
        <path d="M 154 213 Q 164 206, 175 211 Q 180 213, 185 211 Q 196 206, 206 213 L 203 222 Q 195 217, 187 220 Q 180 222, 173 220 Q 165 217, 157 222 Z"
              fill="#1E0F08" />

        {/* Curly hair */}
        <path d="M 122 158 C 102 133, 107 88, 142 83 Q 152 68, 172 78 Q 182 64, 197 78 Q 214 68, 234 83 C 269 88, 264 133, 244 158 C 236 152, 224 148, 214 153 C 202 146, 188 146, 180 150 C 168 146, 156 148, 148 153 C 138 150, 128 152, 122 158 Z"
              fill="#1E0F08" />
        <path d="M 157 88 Q 162 80, 170 86" stroke="#000" strokeOpacity="0.4" strokeWidth="2" strokeLinecap="round" fill="none" />
        <path d="M 197 83 Q 204 76, 214 82" stroke="#000" strokeOpacity="0.4" strokeWidth="2" strokeLinecap="round" fill="none" />
        <path d="M 177 103 Q 184 96, 194 102" stroke="#000" strokeOpacity="0.4" strokeWidth="2" strokeLinecap="round" fill="none" />

        {/* Eyebrows */}
        <path d="M 145 178 Q 158 170, 172 176" stroke="#1E0F08" strokeWidth="4" strokeLinecap="round" fill="none" />
        <path d="M 188 176 Q 202 170, 215 178" stroke="#1E0F08" strokeWidth="4" strokeLinecap="round" fill="none" />

        {/* Eyes */}
        <ellipse cx="159" cy="195" rx="3.5" ry="4.5" fill="#1F1A2E" />
        <ellipse cx="201" cy="195" rx="3.5" ry="4.5" fill="#1F1A2E" />
        <circle cx="160" cy="194" r="1.2" fill="#FFFFFF" />
        <circle cx="202" cy="194" r="1.2" fill="#FFFFFF" />

        {/* Nose */}
        <path d="M 180 198 Q 177 208, 182 213" stroke="#8B5E32" strokeOpacity="0.55" strokeWidth="1.5" strokeLinecap="round" fill="none" />

        {/* Cheeks */}
        <ellipse cx="148" cy="203" rx="6" ry="3" fill="#EE3C95" opacity="0.20" />
        <ellipse cx="212" cy="203" rx="6" ry="3" fill="#EE3C95" opacity="0.20" />

        {/* Smile */}
        <path d="M 170 232 Q 180 237, 190 232" stroke="#1F1A2E" strokeWidth="2.2" strokeLinecap="round" fill="none" />
      </svg>
    </div>
  );
}

/* Wavy divider */
function WavyDivider({ color = 'var(--pink)', flip = false }) {
  return (
    <div class="wavy-divider" aria-hidden="true">
      <svg viewBox="0 0 1200 64" preserveAspectRatio="none">
        <path
          d={flip
            ? "M 0 32 Q 150 8, 300 32 T 600 32 T 900 32 T 1200 32"
            : "M 0 32 Q 150 56, 300 32 T 600 32 T 900 32 T 1200 32"}
          stroke={color} strokeWidth="2" fill="none" strokeLinecap="round"
          strokeOpacity="0.45"
        />
      </svg>
    </div>
  );
}

/* Teardown card visuals */
function DoorVisualValorant() {
  return (
    <svg viewBox="0 0 480 300" xmlns="http://www.w3.org/2000/svg"
         style={{ width: '100%', height: '100%', display: 'block' }}
         preserveAspectRatio="xMidYMid meet">
      <path d="M 40 230 Q 130 220, 180 195 T 280 165 Q 340 145, 440 95"
            stroke="#EE3C95" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <path d="M 40 230 Q 80 228, 110 226"
            stroke="#EE3C95" strokeOpacity="0.4" strokeWidth="2" fill="none"
            strokeDasharray="3 5" strokeLinecap="round" />
      <circle cx="280" cy="165" r="22" fill="#FCE0EE" />
      <circle cx="280" cy="165" r="12" fill="#EE3C95" />
      <circle cx="280" cy="165" r="5"  fill="#FFFFFF" />
      <circle cx="370" cy="100" r="4" fill="#FCC419" />
      <circle cx="400" cy="140" r="3.5" fill="#3DD2EF" />
      <circle cx="420" cy="80"  r="3" fill="#A971E5" />
      <circle cx="395" cy="180" r="3" fill="#FCC419" />
      <path d="M 370 100 Q 320 130, 280 165" stroke="#EE3C95" strokeOpacity="0.4" strokeWidth="1.5" strokeDasharray="2 4" fill="none" />
      <path d="M 400 140 Q 340 152, 280 165" stroke="#EE3C95" strokeOpacity="0.35" strokeWidth="1.5" strokeDasharray="2 4" fill="none" />
      <path d="M 420 80  Q 350 120, 280 165" stroke="#EE3C95" strokeOpacity="0.3" strokeWidth="1.5" strokeDasharray="2 4" fill="none" />
      <path d="M 70 130 L 70 138 M 66 134 L 74 134" stroke="#EE3C95" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M 160 90 L 160 96 M 157 93 L 163 93" stroke="#FCC419" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M 340 220 L 340 226 M 337 223 L 343 223" stroke="#A971E5" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function DoorVisualSlack() {
  return (
    <svg viewBox="0 0 480 300" xmlns="http://www.w3.org/2000/svg"
         style={{ width: '100%', height: '100%', display: 'block' }}
         preserveAspectRatio="xMidYMid meet">
      {[
        [50,70,'#A971E5'],[70,105,'#3DD2EF'],[55,145,'#EE3C95'],[90,175,'#FCC419'],[75,215,'#3BB17F'],
        [100,90,'#3DD2EF'],[120,130,'#A971E5'],[105,170,'#EE3C95'],[140,205,'#3BB17F'],[115,240,'#3DD2EF'],
        [160,70,'#FCC419'],[175,110,'#3BB17F'],[155,150,'#A971E5'],[190,185,'#3DD2EF'],[170,225,'#EE3C95'],
        [210,95,'#3BB17F'],[225,140,'#3DD2EF'],[205,180,'#FCC419'],[240,215,'#A971E5'],
      ].map(([x, y, c], i) => (
        <circle key={i} cx={x} cy={y} r={3 + (i % 3) * 0.5} fill={c} opacity={0.75} />
      ))}
      <path d="M 80 150 Q 220 150, 365 150" stroke="#0FA8C5" strokeOpacity="0.4" strokeWidth="2" fill="none" strokeLinecap="round" />
      <path d="M 80 100 Q 220 130, 365 150" stroke="#0FA8C5" strokeOpacity="0.25" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      <path d="M 80 200 Q 220 170, 365 150" stroke="#0FA8C5" strokeOpacity="0.25" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      <circle cx="370" cy="150" r="28" fill="#DAF4FA" />
      <circle cx="370" cy="150" r="15" fill="#3DD2EF" />
      <circle cx="370" cy="150" r="6"  fill="#FFFFFF" />
      <circle cx="370" cy="150" r="44" fill="none" stroke="#3DD2EF" strokeOpacity="0.30" strokeWidth="1.5" strokeDasharray="3 4" />
      <circle cx="370" cy="150" r="62" fill="none" stroke="#3DD2EF" strokeOpacity="0.15" strokeWidth="1" strokeDasharray="3 5" />
      <path d="M 430 100 L 430 108 M 426 104 L 434 104" stroke="#EE3C95" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M 410 220 L 410 226 M 407 223 L 413 223" stroke="#FCC419" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

/* ============================================================
   Common UI
   ============================================================ */

function Nav() {
  const scrolled = useScrolled();
  return (
    <nav class="nav" classList={{ scrolled: scrolled() }}>
      <button class="nav-mark asterisk-wiggle" onClick={() => go('/')}>
        <AsteriskMark size={15} />
        <span>Kunal</span>
      </button>
      <div class="nav-right">
        <button class="nav-link" onClick={() => {
          go('/');
          setTimeout(() => document.getElementById('work')?.scrollIntoView({ behavior: 'smooth' }), 80);
        }}>Teardowns</button>
        <button class="nav-link" onClick={() => {
          go('/');
          setTimeout(() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' }), 80);
        }}>About</button>
        <button class="nav-link" onClick={() => {
          go('/');
          setTimeout(() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' }), 80);
        }}>Say hi</button>
        {/* TODO[KUNAL]: real CV link */}
        <a class="nav-cv" href="/cv.pdf" target="_blank" rel="noreferrer">
          CV <span>↗</span>
        </a>
      </div>
    </nav>
  );
}

function Footer() {
  return (
    <div class="container">
      <div class="footer">
        <span class="footer-mark">
          <AsteriskMark size={11} />
          <span>Made with <em>curiosity</em>, in Roorkee.</span>
        </span>
        <span>© 2026 — Kunal Sharma</span>
      </div>
    </div>
  );
}

/* ============================================================
   HOME — Hero
   ============================================================ */

function Hero() {
  const t = useLiveTime();
  return (
    <section class="hero" id="top">
      <div class="container">
        <div class="hero-grid">
          <div>
            <div class="hero-eyebrow reveal">
              <span class="wave">👋</span>
              <span>Hi, I'm Kunal — physics undergrad, product nerd.</span>
            </div>

            <h1 class="hero-headline reveal d1">
              I take things apart to figure out how they <span class="underline-soft">actually</span> <em>work</em>.
            </h1>

            <p class="hero-sub reveal d2">
              Currently in <strong>Founder's Office at Recepto.ai</strong> while finishing
              physics at IIT Roorkee. I write long-form teardowns about products and GTM —
              the kind of analysis I wish more PMs and founders did out loud.
            </p>

            <div class="cta-row reveal d3">
              <button class="btn btn-primary" onClick={() => document.getElementById('work')?.scrollIntoView({ behavior: 'smooth' })}>
                <span>Read the teardowns</span>
                <span class="arrow">→</span>
              </button>
              <button class="btn btn-ghost" onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}>
                <span>Say hi</span>
                <span class="arrow">↓</span>
              </button>
            </div>
          </div>

          <div class="reveal d4">
            <div class="character-wrap">
              <CharacterFace />
            </div>
          </div>
        </div>

        <div class="notebook reveal d5">
          <div>
            <div class="nb-label">On my desk</div>
            <div class="nb-body">
              {/* TODO[KUNAL]: swap for what's actually on your desk */}
              Working Backwards · the Slack S-1 · three tabs on AI defensibility
            </div>
          </div>
          <div>
            <div class="nb-label">In my head</div>
            <div class="nb-body">
              Which AI products survive as foundation models keep improving
              <span class="soft">— and which ones are wrappers waiting to be replaced.</span>
            </div>
          </div>
          <div>
            <div class="nb-label">Right now</div>
            <div class="nb-body">
              Roorkee, IN · {t()}
              <span class="soft">Looking for: Founder's Office, founding PM, founding GTM at an early-stage AI startup.</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   HOME — About
   ============================================================ */

const QUESTIONS = [
  'Which AI products survive as foundation models keep improving — and which are wrappers waiting to be replaced?',
  'Where\u2019s the defensible edge for early-stage B2B AI when the data layer commoditizes?',
  'Is product taste a discipline you can practice, or a personality trait you can\u2019t?',
];

function About() {
  return (
    <section class="section" id="about">
      <div class="container">
        <div class="about-grid">
          <div class="about-side reveal">
            <CharacterAvatar />
            <span class="eyebrow">
              <span class="dot" />
              <span>About me</span>
            </span>
          </div>

          <div>
            <h2 class="h-display reveal d1">
              I tend to notice the systems behind things — and the small details <em>inside them</em>.
            </h2>

            <div class="prose">
              <p class="reveal d2">
                I'm finishing a BS-MS in Physics at IIT Roorkee this month. For the last
                four months, I've been in <strong>Founder's Office at Recepto.ai</strong> —
                a B2B AI tool building intent-signal infrastructure for revenue teams.
                I work mostly on GTM, market analysis, and product.
              </p>

              <p class="reveal d3">
                The questions I'm most drawn to sit between disciplines. How does a piece
                of software shape attention? Why does one product feel inevitable and
                another feel improvised? What's the difference between a buyer signal and
                a real moment of pain? I do my best thinking when I'm allowed to wander —
                pulling from physics, design, psychology, and whatever I happened to read
                last Tuesday.
              </p>

              <div class="pullquote reveal d4">
                The internet rewards confidence. I'm more interested in being <em>curious</em> and honest.
              </div>

              <p class="reveal d5">
                The teardowns on this site are the closest version of how I actually
                think — pulling apart products I find interesting, finding the patterns
                underneath, and asking the questions that follow. They're also the best
                read on what working with me feels like.
              </p>
            </div>

            <div class="questions reveal d6">
              <div class="questions-label">Things I'm currently unsure about</div>
              <ul>
                <For each={QUESTIONS}>{(q, i) => (
                  <li>
                    <span class="num">0{i() + 1}</span>
                    <span>{q}</span>
                  </li>
                )}</For>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   HOME — Teardowns
   ============================================================ */

function Teardowns() {
  return (
    <section class="section" id="work">
      <div class="container">
        <div class="reveal">
          <span class="eyebrow">
            <span class="dot" />
            <span>Teardowns</span>
          </span>
        </div>

        <h2 class="h-display reveal d1">
          Two long-form analyses I've been <em>working through</em>.
        </h2>

        <p class="prose reveal d2" style={{ marginBottom: '3rem' }}>
          Both started as personal curiosity — pulling apart a product I found interesting
          until I could see what was actually happening underneath. They're closer to how I
          think than anything that'd fit on a résumé.
        </p>

        <div class="doors">
          <button class="door reveal d3" onClick={() => go('/teardowns/valorant')}>
            <div class="door-visual">
              <div class="door-meta">01 · Product teardown</div>
              <span class="door-tag">8 min read</span>
              <DoorVisualValorant />
            </div>
            <div class="door-text">
              <h3 class="door-title">
                Valorant didn't just update. It re-engineered its <em>users</em>.
              </h3>
              <p class="door-sub">
                Seven months of behavioral product design hiding inside a tactical shooter.
                How Riot designs re-entry as carefully as onboarding, uses graphics exploits as
                cover for balance changes, and builds retention around friend groups instead
                of individuals.
              </p>
              <div class="door-foot">
                <div class="door-chips">
                  <span class="chip">Retention</span>
                  <span class="chip">Behavioral systems</span>
                </div>
                <span class="door-cta">
                  <span>Read it</span><span>→</span>
                </span>
              </div>
            </div>
          </button>

          <button class="door cyan reveal d4" onClick={() => go('/teardowns/slack')}>
            <div class="door-visual">
              <div class="door-meta">02 · GTM teardown</div>
              <span class="door-tag">10 min read</span>
              <DoorVisualSlack />
            </div>
            <div class="door-text">
              <h3 class="door-title">
                Chaos was the <em>signal</em>.
              </h3>
              <p class="door-sub">
                How Slack grew not by finding the right buyer — but by arriving at the right
                moment. A breakdown of why timing beats targeting in B2B GTM, what the real
                intent signal looks like, and how chaos itself became the trigger Slack
                engineered around.
              </p>
              <div class="door-foot">
                <div class="door-chips">
                  <span class="chip">B2B GTM</span>
                  <span class="chip">Intent signals</span>
                </div>
                <span class="door-cta">
                  <span>Read it</span><span>→</span>
                </span>
              </div>
            </div>
          </button>
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   HOME — Interlude
   ============================================================ */

function Interlude() {
  return (
    <section class="interlude">
      <div class="container tight">
        <div class="reveal">
          <span class="interlude-mark-wrap">
            <span class="interlude-mark">
              <AsteriskMark size={28} />
            </span>
          </span>
        </div>
        {/* TODO[KUNAL]: replace with your real working thesis when ready. */}
        <p class="interlude-text reveal d1">
          The next decade will reward people who pay attention to the <em>workarounds</em>.
          The best products aren't invented — they're observed.
        </p>
        <span class="interlude-sig reveal d2">— K.</span>
      </div>
    </section>
  );
}

/* ============================================================
   HOME — Contact
   ============================================================ */

function Contact() {
  return (
    <section class="section" id="contact">
      <div class="container mid">
        <div class="contact-card reveal">
          <h2 class="contact-headline">
            If you're <em>building something</em> in AI and looking for an early hire — let's talk.
          </h2>
          <p class="contact-lede">
            I'm looking for my next move at an early-stage AI startup — Founder's Office,
            founding PM, founding GTM, or anywhere I'd be useful early. Open to roles in
            India, Europe, or the US. Reply is usually within a day or two.
          </p>

          <div class="contact-rows">
            {/* TODO[KUNAL]: replace placeholders with real handles */}
            <a class="contact-row" href="mailto:hello@kunalsharma.xyz">
              <span class="ckey">Email</span>
              <span class="cval">hello@kunalsharma.xyz <span class="carr">↗</span></span>
            </a>
            <a class="contact-row" href="#" target="_blank" rel="noreferrer">
              <span class="ckey">LinkedIn</span>
              <span class="cval">linkedin.com/in/kunalsharma-iitr <span class="carr">↗</span></span>
            </a>
            <a class="contact-row" href="#" target="_blank" rel="noreferrer">
              <span class="ckey">X / Twitter</span>
              <span class="cval">@kunalsharma <span class="carr">↗</span></span>
            </a>
            <a class="contact-row" href="/cv.pdf" target="_blank" rel="noreferrer">
              <span class="ckey">CV (PDF)</span>
              <span class="cval">Download <span class="carr">↗</span></span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   HomePage
   ============================================================ */

function HomePage() {
  useReveal();
  return (
    <>
      <Hero />
      <WavyDivider color="var(--pink)" />
      <About />
      <WavyDivider color="var(--cyan)" flip />
      <Teardowns />
      <WavyDivider color="var(--yellow)" />
      <Interlude />
      <WavyDivider color="var(--purple)" flip />
      <Contact />
      <Footer />
    </>
  );
}

/* ============================================================
   VALORANT TEARDOWN
   ============================================================ */

function ValorantTeardown() {
  useReveal();
  return (
    <div class="td-page">
      <div class="container tight">
        <div class="td-back-row reveal">
          <button class="td-back" onClick={() => go('/')}>
            <span>←</span><span>Back home</span>
          </button>
        </div>

        <div class="td-hero">
          <div class="td-eyebrow reveal">
            <span class="dot" />
            <span>Product teardown · Behavioral systems</span>
          </div>
          <h1 class="td-title reveal d1">
            Valorant didn't just update. It re-engineered its <em>users</em>.
          </h1>
          <p class="td-subtitle reveal d2">
            A PM analysis of seven months of behavioral product design hiding inside a tactical shooter.
          </p>
          <div class="td-meta reveal d3">
            <span>By Kunal Sharma</span>
            <span class="sep" />
            <span>2026</span>
            <span class="sep" />
            <span>8 min read</span>
            <a class="pdf-link" href="/valorant-teardown.pdf" target="_blank" rel="noreferrer">
              <span>PDF</span><span>↓</span>
            </a>
          </div>
        </div>

        <section class="td-section reveal">
          <div class="td-mark"><span class="dot" />The trigger<span class="line" /></div>
          <blockquote class="td-pull">
            "We miss you in the game. And your humour."
            <span class="td-pull-attr">— my friends. Six months after I stopped playing.</span>
          </blockquote>
          <p class="td-p">
            That line isn't just nostalgia. It's a <strong>product mechanic Riot engineers deliberately</strong>.
          </p>
          <div class="td-soft cols-2">
            <div class="td-soft-item">
              <div class="td-soft-num">6 months earlier</div>
              <div class="td-soft-title">Stopped playing</div>
              <div class="td-soft-body">Life, exams, distractions. Classic lapsed user.</div>
            </div>
            <div class="td-soft-item">
              <div class="td-soft-num">Reactivation trigger</div>
              <div class="td-soft-title">A friend's invite</div>
              <div class="td-soft-body">Not a notification. Not a discount. A human pull.</div>
            </div>
            <div class="td-soft-item">
              <div class="td-soft-num">Re-entry moment</div>
              <div class="td-soft-title">Opened the game</div>
              <div class="td-soft-body">New UI. New modes. New meta. Everything had moved.</div>
            </div>
            <div class="td-soft-item">
              <div class="td-soft-num">The insight</div>
              <div class="td-soft-title">Re-entry is engineered</div>
              <div class="td-soft-body">Riot designs the re-entry experience as carefully as onboarding.</div>
            </div>
          </div>
        </section>

        <section class="td-section reveal">
          <div class="td-mark"><span class="dot" />Seven months of product moves<span class="line" /></div>
          <h2 class="td-h2">Everything changed.</h2>
          <p class="td-p">Major product moves that shipped while you weren't looking:</p>
          <div class="td-soft cols-2">
            <div class="td-soft-item">
              <div class="td-soft-num">// MODE</div>
              <div class="td-soft-title">Skirmish — ranked 2v2 + 1v1</div>
              <div class="td-soft-body">Matchmade ranked mode for duos — separate leaderboard, own rewards. Not custom lobbies. Real competition for small groups.</div>
            </div>
            <div class="td-soft-item">
              <div class="td-soft-num">// AGENT</div>
              <div class="td-soft-title">Miks — a Controller who heals</div>
              <div class="td-soft-body">Agent 30. The only Controller with a healing ability in game history. Sound-based kit, team stim buffs. Meta-altering role design.</div>
            </div>
            <div class="td-soft-item">
              <div class="td-soft-num">// BALANCE</div>
              <div class="td-soft-title">Neon disabled, then nerfed</div>
              <div class="td-soft-body">Pulled for a graphics exploit (invisible walls via NVIDIA settings). Nerfs shipped alongside the fix. Community had been asking for months.</div>
            </div>
            <div class="td-soft-item">
              <div class="td-soft-num">// PLATFORM</div>
              <div class="td-soft-title">UI overhaul, UE5, Discord</div>
              <div class="td-soft-body">Complete UI redesign, Unreal Engine 5 upgrade, Discord integration, gifting system. The shell changed as much as the game.</div>
            </div>
          </div>
        </section>

        <section class="td-section reveal">
          <div class="td-mark"><span class="dot" />Behavior → Feature<span class="line" /></div>
          <h2 class="td-h2">Why Riot built a social mode.</h2>
          <p class="td-p">The 2v2 decision wasn't a creative leap. It was <strong>behavioral observation made official</strong>.</p>
          <p class="td-p">People were already playing 2v2 — in custom lobbies, no matchmaking, no rewards. Riot watched Instagram posts and community threads, then built the real version. <em>The best features don't get invented. They get observed.</em></p>
          <div class="td-stats">
            <div class="td-stat">
              <div class="td-stat-n">2v2</div>
              <div class="td-stat-l">Already happening in customs before Riot shipped it as a feature</div>
            </div>
            <div class="td-stat">
              <div class="td-stat-n">3×</div>
              <div class="td-stat-l">Player types served — competitive climbers, casual friends, lapsed returners</div>
            </div>
            <div class="td-stat">
              <div class="td-stat-n">↓ 80%</div>
              <div class="td-stat-l">Re-entry barrier reduction — 40-min 5v5 replaced by 8-min 2v2</div>
            </div>
          </div>
        </section>

        <section class="td-section reveal">
          <div class="td-mark"><span class="dot" />The engagement loop<span class="line" /></div>
          <h2 class="td-h2">Behavior-driven product design.</h2>
          <p class="td-p">The loop Riot engineered — and why it works specifically on returning users:</p>
          <div class="td-steps">
            <div class="td-step"><div class="td-step-n">01</div><div class="td-step-t">Friend pulls you back</div></div>
            <div class="td-step"><div class="td-step-n">02</div><div class="td-step-t">New UI feels fresh</div></div>
            <div class="td-step"><div class="td-step-n">03</div><div class="td-step-t">Short mode lowers cost</div></div>
            <div class="td-step"><div class="td-step-n">04</div><div class="td-step-t">Win → Rank → Reward</div></div>
            <div class="td-step"><div class="td-step-n">05</div><div class="td-step-t">Rematch pulls into 5v5</div></div>
            <div class="td-step"><div class="td-step-n">06</div><div class="td-step-t">Schedule next session</div></div>
          </div>
        </section>

        <section class="td-section reveal">
          <div class="td-mark"><span class="dot" />Why it stays sticky<span class="line" /></div>
          <h2 class="td-h2">Retention psychology, made operational.</h2>
          <div class="td-soft cols-2">
            <div class="td-soft-item">
              <div class="td-soft-num">01 — Identity investment</div>
              <div class="td-soft-body">Rank, agent mains, skins, playstyle — players invest identity into the game. Leaving feels like losing a version of yourself.</div>
            </div>
            <div class="td-soft-item">
              <div class="td-soft-num">02 — Social obligation loop</div>
              <div class="td-soft-body">"We miss you" is the most powerful re-engagement signal that doesn't come from the app. Riot engineers the conditions for it.</div>
            </div>
            <div class="td-soft-item">
              <div class="td-soft-num">03 — Variable reward, compressed</div>
              <div class="td-soft-body">2v2 gives faster rank feedback. Shorter sessions = more reward cycles per hour. Classic variable schedule, compressed for casual play.</div>
            </div>
            <div class="td-soft-item">
              <div class="td-soft-num">04 — Recency as urgency</div>
              <div class="td-soft-body">New UI + new meta = you're behind. FOMO as a re-engagement engine for lapsed users.</div>
            </div>
          </div>
          <blockquote class="td-pull">
            Riot doesn't retain players. It retains <em>friend groups</em>.
          </blockquote>
          <p class="td-p">The unit of retention isn't the individual player. It's the 5-stack. When one person leaves, the social system pulls them back. Discord integration, gifting, and 2v2 modes all exist to deepen the social graph inside the product.</p>
        </section>

        <section class="td-section reveal">
          <div class="td-mark"><span class="dot" />Case study<span class="line" /></div>
          <h2 class="td-h2">The Neon situation.</h2>
          <p class="td-p">What looked like a ban was actually <strong>operational product strategy</strong>. Patch 12.08 to 12.09 — Neon disabled on PC. Reason: Fast Lane graphics exploit (NVIDIA setting).</p>
          <p class="td-p"><strong>The exploit:</strong> An NVIDIA graphics setting made Neon's Fast Lane walls fully transparent — effectively a one-way wall hack. Competitive integrity broken. Emergency disable issued.</p>
          <p class="td-p"><strong>The meta problem:</strong> ~45% pick rate across all VCT regions. Dominant in pro play for months. Community frustration was loudly documented. Nerfs had been in development for weeks.</p>
          <div class="td-callout">
            <span class="td-callout-tag">The PM move</span>
            <div class="td-callout-body">
              Riot <strong>bundled the exploit fix with balance nerfs they'd been sitting on</strong>. The bug gave them permission to ship both in one patch — absorbing community backlash under a single event.
            </div>
          </div>
          <div class="td-callout">
            <span class="td-callout-tag">The lesson</span>
            <div class="td-callout-body">
              When your product forces you into an emergency action, look for the strategic decision you can bundle with it. <strong>Forced actions = cover for brave decisions.</strong>
            </div>
          </div>
        </section>

        <section class="td-section reveal">
          <div class="td-mark"><span class="dot" />Takeaways<span class="line" /></div>
          <h2 class="td-h2">Four PM lessons.</h2>
          <div class="td-soft">
            <div class="td-soft-item">
              <div class="td-soft-num">01</div>
              <div class="td-soft-title">Observe the workaround. Then build the feature.</div>
              <div class="td-soft-body">Users were playing 2v2 in customs without rewards or matchmaking. Riot formalized it. Your users are already showing you what they want — they're building it with duct tape.</div>
            </div>
            <div class="td-soft-item">
              <div class="td-soft-num">02</div>
              <div class="td-soft-title">The re-entry moment is as sacred as onboarding.</div>
              <div class="td-soft-body">New UI, new modes, new meta — all timed to make returning feel like discovery. If lapsed users open your app and see nothing new, they close it in 10 seconds.</div>
            </div>
            <div class="td-soft-item">
              <div class="td-soft-num">03</div>
              <div class="td-soft-title">Make the thankless role desirable.</div>
              <div class="td-soft-body">Miks solved a matchmaking problem (nobody queues Controller) through product design, not coercion. If a role in your product feels unrewarding, redesign it — don't punish users for avoiding it.</div>
            </div>
            <div class="td-soft-item">
              <div class="td-soft-num">04</div>
              <div class="td-soft-title">Bundle forced actions with strategic ones.</div>
              <div class="td-soft-body">The Neon exploit forced a disable. Riot used it to ship pre-built nerfs. When crisis gives you cover — use it. One patch, two problems, one backlash event.</div>
            </div>
          </div>
        </section>

        <section class="td-section reveal">
          <div class="td-mark"><span class="dot" />Bigger pattern<span class="line" /></div>
          <p class="td-big">
            The best products aren't just fun to use.<br />They're <em>engineered to be missed</em>.
          </p>
          <div class="td-quest">
            <div class="td-q">
              <div class="td-q-tag">→ Ask yourself</div>
              <div class="td-q-text">What are your users doing in workarounds that you haven't officially supported yet?</div>
            </div>
            <div class="td-q">
              <div class="td-q-tag">→ Ask yourself</div>
              <div class="td-q-text">When a lapsed user opens your app after 6 months — what do they feel in the first 30 seconds?</div>
            </div>
            <div class="td-q">
              <div class="td-q-tag">→ Ask yourself</div>
              <div class="td-q-text">What role in your product feels thankless — and how do you make it feel rewarding?</div>
            </div>
          </div>
        </section>

        <section class="td-section reveal">
          <p class="td-big">
            Valorant isn't just a game.<br />It's one of the most sophisticated behavioral retention systems ever built.
          </p>
          <p class="td-p" style={{ textAlign: 'center', maxWidth: 'none' }}>
            My friends didn't miss me. They were the trigger Riot designed.
          </p>
        </section>

        <div class="td-end">
          <p class="td-end-text">If this resonated, you'll probably like the other one.</p>
          <div class="td-end-row">
            <button class="btn btn-primary" onClick={() => go('/teardowns/slack')}>
              <span>Read: Chaos was the signal</span>
              <span class="arrow">→</span>
            </button>
            <button class="btn btn-ghost" onClick={() => go('/')}>
              <span>← Back home</span>
            </button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

/* ============================================================
   SLACK TEARDOWN
   ============================================================ */

function SlackTeardown() {
  useReveal();
  return (
    <div class="td-page">
      <div class="container tight">
        <div class="td-back-row reveal">
          <button class="td-back" onClick={() => go('/')}>
            <span>←</span><span>Back home</span>
          </button>
        </div>

        <div class="td-hero">
          <div class="td-eyebrow reveal">
            <span class="dot" />
            <span>GTM teardown · B2B case study</span>
          </div>
          <h1 class="td-title reveal d1">
            Chaos was the <em>signal</em>.
          </h1>
          <p class="td-subtitle reveal d2">
            How Slack grew not by finding the right buyer — but by arriving at the right moment.
          </p>
          <div class="td-meta reveal d3">
            <span>By Kunal Sharma</span>
            <span class="sep" />
            <span>2026</span>
            <span class="sep" />
            <span>10 min read</span>
            <a class="pdf-link" href="/slack-teardown.pdf" target="_blank" rel="noreferrer">
              <span>PDF</span><span>↓</span>
            </a>
          </div>
        </div>

        <section class="td-section reveal">
          <div class="td-mark"><span class="dot" />The common belief<span class="line" /></div>
          <h2 class="td-h2">Most teams think outbound is a <em>targeting</em> problem.</h2>
          <p class="td-p">The playbook teams swear by:</p>
          <div class="td-soft cols-2">
            <div class="td-soft-item"><div class="td-soft-body" style={{ color: 'var(--fg)', fontSize: '0.97rem', fontWeight: 500 }}>→ Find the "perfect" ICP</div></div>
            <div class="td-soft-item"><div class="td-soft-body" style={{ color: 'var(--fg)', fontSize: '0.97rem', fontWeight: 500 }}>→ Score leads by firmographics</div></div>
            <div class="td-soft-item"><div class="td-soft-body" style={{ color: 'var(--fg)', fontSize: '0.97rem', fontWeight: 500 }}>→ Trigger on hiring signals</div></div>
            <div class="td-soft-item"><div class="td-soft-body" style={{ color: 'var(--fg)', fontSize: '0.97rem', fontWeight: 500 }}>→ Target recent funding rounds</div></div>
            <div class="td-soft-item"><div class="td-soft-body" style={{ color: 'var(--fg)', fontSize: '0.97rem', fontWeight: 500 }}>→ Blast the right job title</div></div>
            <div class="td-soft-item"><div class="td-soft-body" style={{ fontFamily: 'var(--serif)', fontStyle: 'italic', color: 'var(--fg)', fontSize: '1.08rem', fontVariationSettings: "'opsz' 36, 'SOFT' 100" }}>"Get the signal. Build the list. Hit send."</div></div>
          </div>
        </section>

        <section class="td-section reveal">
          <div class="td-mark"><span class="dot" />The reality<span class="line" /></div>
          <blockquote class="td-pull">
            Targeting tells you <em>who</em>.<br />It doesn't tell you <em>when</em>.
          </blockquote>
          <div class="td-soft cols-2">
            <div class="td-soft-item">
              <div class="td-soft-num">✗ ICP ≠ Readiness</div>
              <div class="td-soft-body">A perfect-fit company with no pain right now will ignore you — forever.</div>
            </div>
            <div class="td-soft-item">
              <div class="td-soft-num">✗ Signals ≠ Intent</div>
              <div class="td-soft-body">Hiring a DevOps engineer isn't intent. It's a data point. Context is everything.</div>
            </div>
            <div class="td-soft-item">
              <div class="td-soft-num">✗ Timing beats targeting</div>
              <div class="td-soft-body">The same message to the same person, six months later — completely different result.</div>
            </div>
          </div>
        </section>

        <section class="td-section reveal">
          <div class="td-mark"><span class="dot" />Company context<span class="line" /></div>
          <h2 class="td-h2">Slack entered a market that didn't know it was broken.</h2>
          <div class="td-soft cols-2">
            <div class="td-soft-item">
              <div class="td-soft-num">2013</div>
              <div class="td-soft-body">Launched as a side project from a failed game studio (Glitch).</div>
            </div>
            <div class="td-soft-item">
              <div class="td-soft-num">The market</div>
              <div class="td-soft-body">Enterprise already had email, Yammer, HipChat, Basecamp.</div>
            </div>
            <div class="td-soft-item">
              <div class="td-soft-num">The window</div>
              <div class="td-soft-body">Remote work was accelerating. Tool sprawl was exploding.</div>
            </div>
            <div class="td-soft-item">
              <div class="td-soft-num">The insight</div>
              <div class="td-soft-body">The problem wasn't communication — it was coordination collapse.</div>
            </div>
          </div>
        </section>

        <section class="td-section reveal">
          <div class="td-mark"><span class="dot" />The hidden problem<span class="line" /></div>
          <blockquote class="td-pull">
            Teams weren't failing at communication.<br />They were drowning in <em>coordination</em>.
          </blockquote>
          <p class="td-p" style={{ marginTop: '2rem' }}>The symptoms nobody named:</p>
          <div class="td-symptoms">
            <div class="td-symp">10+ tools, none connected</div>
            <div class="td-symp">Context scattered across email threads</div>
            <div class="td-symp">"Did you see my message?" became a job</div>
            <div class="td-symp">New hires took weeks to onboard</div>
            <div class="td-symp">Remote teams felt invisible</div>
            <div class="td-symp">Projects stalled at handoffs</div>
          </div>
          <p class="td-p" style={{ marginTop: '2rem', fontFamily: 'var(--serif)', fontStyle: 'italic', color: 'var(--fg)', fontVariationSettings: "'opsz' 36, 'SOFT' 100" }}>
            This wasn't a software problem. It was an organizational nervous system failure.
          </p>
        </section>

        <section class="td-section reveal">
          <div class="td-mark"><span class="dot" />The real intent signal<span class="line" /></div>
          <h2 class="td-h2">Not who they are.<br />What's <em>breaking</em> inside them.</h2>
          <div class="td-compare">
            <div class="td-cr head">
              <div class="l">Surface signal</div>
              <div class="arr">→</div>
              <div class="r" style={{ fontFamily: 'var(--mono)', fontStyle: 'normal', fontSize: '0.64rem', letterSpacing: '0.18em', color: 'var(--fg-muted)', textTransform: 'uppercase', fontWeight: 500 }}>Real signal</div>
            </div>
            <div class="td-cr">
              <div class="l">Hired 5 engineers last month</div>
              <div class="arr">→</div>
              <div class="r">Team doubled — no coordination layer exists</div>
            </div>
            <div class="td-cr">
              <div class="l">Raised Series A</div>
              <div class="arr">→</div>
              <div class="r">Managing cross-functional chaos at speed</div>
            </div>
            <div class="td-cr">
              <div class="l">Uses 6+ productivity tools</div>
              <div class="arr">→</div>
              <div class="r">Information is hemorrhaging between silos</div>
            </div>
          </div>
        </section>

        <section class="td-section reveal">
          <div class="td-mark"><span class="dot" />What Slack did differently<span class="line" /></div>
          <h2 class="td-h2">They didn't sell to companies.<br />They <em>infiltrated broken teams</em>.</h2>
          <div class="td-soft cols-2">
            <div class="td-soft-item">
              <div class="td-soft-num">01 — Bottom-up entry</div>
              <div class="td-soft-body">One team member signs up. No sales call. No procurement. No permission.</div>
            </div>
            <div class="td-soft-item">
              <div class="td-soft-num">02 — Free tier as Trojan horse</div>
              <div class="td-soft-body">Zero friction to start. Let the chaos do the selling. Product earns the budget conversation.</div>
            </div>
            <div class="td-soft-item">
              <div class="td-soft-num">03 — Network effects by design</div>
              <div class="td-soft-body">Every invite pulled another teammate in. The product was the outbound.</div>
            </div>
            <div class="td-soft-item">
              <div class="td-soft-num">04 — Chaos was the trigger</div>
              <div class="td-soft-body">Not ICP match. Not intent score. The moment a team hit coordination failure — Slack showed up.</div>
            </div>
          </div>
        </section>

        <section class="td-section reveal">
          <div class="td-mark"><span class="dot" />Why it worked<span class="line" /></div>
          <h2 class="td-h2">People buy relief, not features.</h2>
          <div class="td-soft">
            <div class="td-soft-item">
              <div class="td-soft-num">Pain-first adoption</div>
              <div class="td-soft-body">Users weren't evaluating software. They were escaping chaos. The bar was: anything better than this.</div>
            </div>
            <div class="td-soft-item">
              <div class="td-soft-num">Identity match</div>
              <div class="td-soft-body">"We use Slack" signaled modern, async, remote-ready culture. The tool became a team identity marker.</div>
            </div>
            <div class="td-soft-item">
              <div class="td-soft-num">Virality embedded in workflow</div>
              <div class="td-soft-body">You can't use Slack alone. Every message invited another person. Growth was structurally unavoidable.</div>
            </div>
          </div>
          <div class="td-big-stat">
            <div class="td-big-stat-n">$7.1B</div>
            <div class="td-big-stat-l">
              valuation at IPO (2019), <strong>without a single cold call</strong> to land its first 8,000 teams.
            </div>
          </div>
        </section>

        <section class="td-section reveal">
          <p class="td-big">
            Timing &gt; <em>Targeting</em>.
          </p>
          <p class="td-p" style={{ textAlign: 'center', maxWidth: 'none' }}>
            The best-fit company at the wrong moment = lost deal. The right moment at any company = your fastest close.
          </p>
          <p class="td-p" style={{ textAlign: 'center', maxWidth: 'none', marginTop: '1.5rem', color: 'var(--fg)', fontFamily: 'var(--serif)', fontStyle: 'italic', fontVariationSettings: "'opsz' 36, 'SOFT' 100" }}>
            Slack didn't have a better targeting model. It had a better timing model.
          </p>
        </section>

        <section class="td-section reveal">
          <div class="td-mark"><span class="dot" />The broader takeaway<span class="line" /></div>
          <blockquote class="td-pull">
            Your buyers aren't evaluating you.<br />They're <em>surviving</em> something.
          </blockquote>
          <div class="td-soft">
            <div class="td-soft-item">
              <div class="td-soft-num">For outbound teams</div>
              <div class="td-soft-body">Stop optimizing your ICP filter. Start identifying internal inflection points — the moment a team's current setup stops working.</div>
            </div>
            <div class="td-soft-item">
              <div class="td-soft-num">For PLG companies</div>
              <div class="td-soft-body">Your product's job is to show up when the pain is acute. Distribution is a timing problem as much as a channel problem.</div>
            </div>
            <div class="td-soft-item">
              <div class="td-soft-num">For GTM leaders</div>
              <div class="td-soft-body">Intent data is only useful when you can read the internal context behind it. Data ≠ signal. Context = signal.</div>
            </div>
          </div>
        </section>

        <section class="td-section reveal">
          <div class="td-mark"><span class="dot" />Application<span class="line" /></div>
          <h2 class="td-h2">Stop building lists.<br />Start mapping moments of <em>chaos</em>.</h2>
          <div class="td-soft">
            <div class="td-soft-item">
              <div class="td-soft-num">01 — Identify your chaos triggers</div>
              <div class="td-soft-body">What internal failure mode does your product solve? Name the exact moment of breakdown.</div>
            </div>
            <div class="td-soft-item">
              <div class="td-soft-num">02 — Find the signals of that breakdown</div>
              <div class="td-soft-body">Rapid headcount growth, tool sprawl, leadership change, new GTM motion — what precedes the pain?</div>
            </div>
            <div class="td-soft-item">
              <div class="td-soft-num">03 — Build entry at the individual level</div>
              <div class="td-soft-body">Don't pitch the company. Find the one person in pain right now and give them instant relief.</div>
            </div>
            <div class="td-soft-item">
              <div class="td-soft-num">04 — Design for spread</div>
              <div class="td-soft-body">The second user should be easier than the first. If your product doesn't pull teammates in — redesign it.</div>
            </div>
          </div>
        </section>

        <section class="td-section reveal">
          <p class="td-big">
            The best GTM motion isn't <em>louder outreach</em>.<br />It's arriving at the exact moment your buyer stops being able to cope.
          </p>
        </section>

        <div class="td-end">
          <p class="td-end-text">If this resonated, you'll probably like the other one.</p>
          <div class="td-end-row">
            <button class="btn btn-primary" onClick={() => go('/teardowns/valorant')}>
              <span>Read: Valorant teardown</span>
              <span class="arrow">→</span>
            </button>
            <button class="btn btn-ghost" onClick={() => go('/')}>
              <span>← Back home</span>
            </button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

/* ============================================================
   ROOT
   ============================================================ */

export default function App() {
  useNoIndex();
  const route = useHashRoute();

  return (
    <>
      <style>{STYLES}</style>
      <div class="page">
        <div class="bg-glows" />
        <div class="bg-texture" />
        <div class="grain-soft" />
        <Nav />
        <div class="content">
          <Switch fallback={<HomePage />}>
            <Match when={route() === '/teardowns/valorant'}>
              <ValorantTeardown />
            </Match>
            <Match when={route() === '/teardowns/slack'}>
              <SlackTeardown />
            </Match>
          </Switch>
        </div>
      </div>
    </>
  );
}
