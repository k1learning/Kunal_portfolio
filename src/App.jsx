import { createSignal, createMemo, createEffect, onMount, onCleanup, For } from 'solid-js';

/* ============================================================
   Kunal Sharma — portfolio
   Minimalist editorial. Grounded explorer voice.
   ============================================================ */

const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Hanken+Grotesk:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400;1,500&family=Josefin+Sans:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400;1,500&family=League+Spartan:wght@400;500;600;700&display=swap');

:root {
  --bg:           #FFFFFF;
  --bg-alt:       #FAFAFA;
  --bg-soft:      #F4F4F4;

  --fg:           #111111;
  --fg-soft:      #333333;
  --fg-muted:     #777777;
  --fg-faint:     #BBBBBB;

  --line:         #E8E8E8;
  --line-soft:    #F0F0F0;

  --accent:       #0099FF;
  --accent-soft:  #E5F2FF;

  --nav-bg:       rgba(248, 246, 241, 0.92);
  --shadow-deep:  rgba(26, 26, 26, 0.18);
  --shadow-soft:  rgba(26, 26, 26, 0.25);
  --portrait-glow: rgba(0, 153, 255, 0.06);

  --sans:    'Hanken Grotesk', ui-sans-serif, system-ui, -apple-system, sans-serif;
  --mono:    'League Spartan', 'Hanken Grotesk', ui-sans-serif, system-ui, sans-serif;
  --serif:   'Josefin Sans', 'Hanken Grotesk', ui-sans-serif, system-ui, sans-serif;
  --display: 'Josefin Sans', 'Hanken Grotesk', ui-sans-serif, system-ui, sans-serif;

  --max-w:        1120px;
  --max-w-read:   720px;
  --gutter:       clamp(1.25rem, 4vw, 2.5rem);

  --ease:   cubic-bezier(0.22, 0.68, 0.32, 1);

  color-scheme: light;
}

:root[data-theme='dark'] {
  --bg:           #0E0F11;
  --bg-alt:       #15171A;
  --bg-soft:      #1B1D21;

  --fg:           #F1F2F3;
  --fg-soft:      #C7C9CC;
  --fg-muted:     #8A8D92;
  --fg-faint:     #4E5158;

  --line:         #25272B;
  --line-soft:    #1D1F23;

  --accent:       #4DB8FF;
  --accent-soft:  rgba(77, 184, 255, 0.14);

  --nav-bg:       rgba(14, 15, 17, 0.78);
  --shadow-deep:  rgba(0, 0, 0, 0.55);
  --shadow-soft:  rgba(0, 0, 0, 0.4);
  --portrait-glow: rgba(77, 184, 255, 0.08);

  color-scheme: dark;
}

html, body, .nav, .btn, .work-item, .contact-row, .hero-portrait img, .about-avatar img {
  transition-property: background-color, color, border-color;
  transition-duration: 0.35s;
  transition-timing-function: var(--ease);
}

* { box-sizing: border-box; }

html, body {
  margin: 0;
  background: var(--bg);
  color: var(--fg);
  font-family: var(--sans);
  font-weight: 400;
  font-size: 16px;
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-rendering: optimizeLegibility;
}

::selection { background: var(--accent-soft); color: var(--fg); }

a { color: inherit; }

/* ============================================================
   LAYOUT
   ============================================================ */

.page { position: relative; min-height: 100vh; }

.container {
  max-width: var(--max-w);
  margin: 0 auto;
  padding: 0 var(--gutter);
  position: relative;
}
.container.read { max-width: var(--max-w-read); }

/* ============================================================
   NAV
   ============================================================ */

.nav {
  position: fixed; top: 0; left: 0; right: 0; z-index: 50;
  padding: 1.1rem var(--gutter);
  display: flex; align-items: center; justify-content: space-between;
  transition: background 0.3s var(--ease), border-color 0.3s var(--ease);
  border-bottom: 1px solid transparent;
}
.nav.scrolled {
  background: var(--nav-bg);
  backdrop-filter: blur(10px) saturate(120%);
  -webkit-backdrop-filter: blur(10px) saturate(120%);
  border-bottom-color: var(--line);
}

.nav-mark {
  background: none; border: none; padding: 0;
  cursor: pointer; color: var(--fg);
  font-family: var(--sans);
  font-size: 0.95rem; font-weight: 600;
  letter-spacing: -0.01em;
  display: inline-flex; align-items: center; gap: 0.5rem;
  transition: opacity 0.2s var(--ease);
}
.nav-mark:hover { opacity: 0.7; }
.nav-mark .dot {
  width: 7px; height: 7px;
  background: var(--accent);
  border-radius: 50%;
  display: inline-block;
}

.nav-right { display: flex; align-items: center; gap: 1.75rem; }

.nav-link {
  background: none; border: none; padding: 0;
  font-family: var(--sans); font-size: 0.88rem; font-weight: 400;
  color: var(--fg-soft); cursor: pointer;
  transition: color 0.2s var(--ease);
}
.nav-link:hover { color: var(--fg); }

.nav-cv {
  font-family: var(--sans); font-size: 0.88rem; font-weight: 500;
  color: var(--fg); text-decoration: none;
  display: inline-flex; align-items: center; gap: 0.35rem;
  border-bottom: 1px solid var(--fg);
  padding-bottom: 1px;
  transition: opacity 0.2s var(--ease);
}
.nav-cv:hover { opacity: 0.6; }

.theme-toggle {
  width: 34px; height: 34px;
  display: inline-flex; align-items: center; justify-content: center;
  background: transparent;
  border: 1px solid var(--line);
  border-radius: 999px;
  color: var(--fg-soft);
  cursor: pointer;
  padding: 0;
  transition: color 0.2s var(--ease), border-color 0.2s var(--ease), background 0.2s var(--ease), transform 0.4s var(--ease);
}
.theme-toggle:hover {
  color: var(--fg);
  border-color: var(--fg);
}
.theme-toggle svg {
  width: 15px; height: 15px;
  display: block;
}
.theme-toggle .icon-sun { display: none; }
:root[data-theme='dark'] .theme-toggle .icon-sun { display: block; }
:root[data-theme='dark'] .theme-toggle .icon-moon { display: none; }

@media (max-width: 640px) {
  .nav-right { gap: 1rem; }
  .nav-link { display: none; }
}

:root[data-theme='dark'] .hero-portrait img,
:root[data-theme='dark'] .about-avatar img {
  filter: saturate(0.85) brightness(0.92);
}
:root[data-theme='dark'] ::selection { background: var(--accent-soft); color: var(--fg); }

/* ============================================================
   REVEAL
   ============================================================ */

.reveal {
  opacity: 0;
  transform: translateY(10px);
  transition: opacity 0.7s var(--ease), transform 0.7s var(--ease);
  will-change: opacity, transform;
}
.reveal.in { opacity: 1; transform: translateY(0); }
.d1 { transition-delay: 60ms; }
.d2 { transition-delay: 120ms; }
.d3 { transition-delay: 180ms; }
.d4 { transition-delay: 240ms; }
.d5 { transition-delay: 300ms; }
.d6 { transition-delay: 360ms; }

@media (prefers-reduced-motion: reduce) {
  .reveal { opacity: 1; transform: none; transition: none; }
}

/* ============================================================
   SHARED TYPE
   ============================================================ */

.section-label {
  display: inline-flex; align-items: center; gap: 0.6rem;
  font-family: var(--mono);
  font-size: 0.72rem;
  font-weight: 500;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--fg-muted);
  margin-bottom: 2rem;
}
.section-label .num {
  color: var(--accent);
  font-weight: 500;
}
.section-label .rule {
  width: 28px; height: 1px;
  background: var(--line);
  display: inline-block;
}

/* ============================================================
   HERO
   ============================================================ */

.hero {
  padding: clamp(7rem, 16vh, 10rem) 0 clamp(4rem, 8vh, 6rem);
  border-bottom: 1px solid var(--line);
}

.hero-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: clamp(2.5rem, 5vw, 4rem);
  align-items: center;
}
@media (min-width: 900px) {
  .hero-grid { grid-template-columns: 1.35fr 1fr; gap: 4rem; }
}

.hero-portrait {
  position: relative;
  width: 100%;
  max-width: 380px;
  margin: 0 auto;
  aspect-ratio: 4 / 5;
  overflow: hidden;
  border-radius: 2px;
  background: var(--bg-soft);
  border: 1px solid var(--line);
  box-shadow: 0 1px 0 var(--line), 0 30px 50px -30px var(--shadow-deep);
}
.hero-portrait img {
  width: 100%; height: 100%;
  object-fit: cover; object-position: 50% 25%;
  display: block;
  filter: saturate(0.95);
  transition: transform 0.6s var(--ease);
}
.hero-portrait:hover img { transform: scale(1.02); }
.hero-portrait::after {
  content: '';
  position: absolute; inset: 0;
  background: linear-gradient(180deg, transparent 60%, var(--portrait-glow));
  pointer-events: none;
}
.hero-portrait-cap {
  position: absolute;
  bottom: 0.75rem; left: 0.85rem; right: 0.85rem;
  display: flex; justify-content: space-between; align-items: center;
  font-family: var(--mono);
  font-size: 0.62rem;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.92);
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
  z-index: 1;
}

.hero-top {
  display: inline-flex; align-items: center; gap: 0.7rem;
  font-family: var(--mono);
  font-size: 0.72rem;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--fg-muted);
  margin-bottom: 2rem;
  padding: 0.4rem 0.75rem;
  border: 1px solid var(--line);
  border-radius: 999px;
  background: var(--bg-alt);
}
.hero-top .pulse {
  width: 6px; height: 6px;
  background: var(--accent);
  border-radius: 50%;
  display: inline-block;
  position: relative;
}
.hero-top .pulse::after {
  content: '';
  position: absolute; inset: -3px;
  border-radius: 50%;
  border: 1px solid var(--accent);
  opacity: 0.4;
  animation: pulse 2.8s ease-out infinite;
}
@keyframes pulse {
  0%   { transform: scale(0.6); opacity: 0.5; }
  100% { transform: scale(1.8); opacity: 0; }
}

.hero-headline {
  font-family: var(--sans);
  font-weight: 500;
  font-size: clamp(2rem, 4.6vw, 3.4rem);
  line-height: 1.18;
  letter-spacing: -0.022em;
  color: var(--fg);
  margin: 0 0 2rem 0;
  max-width: 26ch;
}
.hero-headline em {
  font-family: var(--serif);
  font-style: italic;
  font-weight: 400;
  color: var(--fg);
}

.hero-sub {
  font-family: var(--sans);
  font-size: 1.05rem; line-height: 1.7;
  color: var(--fg-soft);
  max-width: 38rem;
  margin: 0 0 2.5rem 0;
}
.hero-sub strong { color: var(--fg); font-weight: 600; }

.cta-row {
  display: flex; flex-wrap: wrap; align-items: center;
  gap: 0.6rem 1.25rem;
}

.btn {
  display: inline-flex; align-items: center; gap: 0.55rem;
  font-family: var(--sans);
  font-size: 0.92rem; font-weight: 500;
  letter-spacing: -0.005em;
  text-decoration: none; cursor: pointer;
  padding: 0.75rem 1.2rem;
  border-radius: 4px;
  border: 1px solid transparent;
  background: none;
  transition: background 0.2s var(--ease), color 0.2s var(--ease), border-color 0.2s var(--ease);
}
.btn-primary {
  color: var(--bg);
  background: var(--fg);
  border-color: var(--fg);
}
.btn-primary:hover {
  background: var(--accent);
  border-color: var(--accent);
  color: #FFFFFF;
}
.btn-ghost {
  color: var(--fg);
  background: transparent;
  border-color: var(--line);
}
.btn-ghost:hover {
  border-color: var(--fg);
}
.btn .arrow {
  display: inline-block;
  transition: transform 0.25s var(--ease);
}
.btn:hover .arrow { transform: translateX(3px); }

/* Hero meta strip */
.hero-meta {
  margin-top: clamp(3.5rem, 8vh, 5rem);
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
  border-top: 1px solid var(--line);
  padding-top: 2rem;
}
@media (min-width: 760px) {
  .hero-meta { grid-template-columns: 1fr 1fr 1fr; gap: 2.5rem; }
}
.hero-meta-item .label {
  font-family: var(--mono);
  font-size: 0.66rem;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--fg-muted);
  margin-bottom: 0.55rem;
}
.hero-meta-item .body {
  font-family: var(--sans);
  font-size: 0.94rem;
  line-height: 1.55;
  color: var(--fg);
}
.hero-meta-item .body .soft {
  display: block;
  color: var(--fg-soft);
  margin-top: 0.3rem;
  font-size: 0.88rem;
}

/* ============================================================
   GENERIC SECTION
   ============================================================ */

.section {
  padding: clamp(5rem, 10vh, 7rem) 0;
  border-bottom: 1px solid var(--line);
}

.section-head { margin-bottom: clamp(2.5rem, 5vh, 3.5rem); }

.h-display {
  font-family: var(--sans);
  font-weight: 500;
  font-size: clamp(1.6rem, 3vw, 2.2rem);
  line-height: 1.25;
  letter-spacing: -0.018em;
  color: var(--fg);
  margin: 0 0 1.25rem 0;
  max-width: 30ch;
}
.h-display em {
  font-family: var(--serif);
  font-style: italic;
  font-weight: 400;
}

.section-lede {
  font-family: var(--sans);
  font-size: 1rem;
  line-height: 1.7;
  color: var(--fg-soft);
  max-width: 42rem;
  margin: 0;
}

.prose {
  font-family: var(--sans);
  font-size: 1.02rem;
  line-height: 1.78;
  color: var(--fg-soft);
  max-width: var(--max-w-read);
}
.prose p { margin: 0 0 1.4rem 0; }
.prose p:last-child { margin-bottom: 0; }
.prose strong { color: var(--fg); font-weight: 600; }
.prose em {
  font-family: var(--serif);
  font-style: italic;
  color: var(--fg);
  font-size: 1.05em;
}

.pullquote {
  font-family: var(--serif);
  font-style: italic;
  font-weight: 400;
  font-size: clamp(1.3rem, 2.2vw, 1.65rem);
  line-height: 1.5;
  color: var(--fg);
  margin: 2.5rem 0;
  padding-left: 1.5rem;
  border-left: 2px solid var(--accent);
  max-width: 38rem;
}
.pullquote em {
  font-style: italic;
  color: var(--accent);
}

/* ============================================================
   ABOUT
   ============================================================ */

.about-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: clamp(2.5rem, 5vh, 3.5rem);
  align-items: start;
}
@media (min-width: 900px) {
  .about-grid { grid-template-columns: 200px 1fr; gap: 5rem; }
}
.about-side { padding-top: 0.3rem; }
@media (min-width: 900px) {
  .about-side { position: sticky; top: 6rem; }
}

.about-avatar {
  width: 92px; height: 92px;
  border-radius: 50%;
  overflow: hidden;
  border: 1px solid var(--line);
  background: var(--bg-soft);
  margin-bottom: 1.25rem;
  box-shadow: 0 8px 20px -12px var(--shadow-soft);
}
.about-avatar img {
  width: 100%; height: 100%;
  object-fit: cover;
  object-position: 50% 30%;
  display: block;
  filter: saturate(0.9);
}

.about-meta {
  font-family: var(--mono);
  font-size: 0.7rem;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--fg-muted);
  display: flex; flex-direction: column; gap: 0.6rem;
}
.about-meta .kv {
  display: grid; grid-template-columns: 1fr;
  gap: 0.2rem;
}
.about-meta .kv .k { color: var(--fg-faint); }
.about-meta .kv .v { color: var(--fg); }

.questions {
  margin-top: 3rem;
  padding: 1.75rem 0 0;
  border-top: 1px solid var(--line);
}
.questions-label {
  font-family: var(--mono);
  font-size: 0.7rem;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--fg-muted);
  margin-bottom: 1.5rem;
}
.questions ul { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 1.25rem; }
.questions li {
  display: grid;
  grid-template-columns: 2.5rem 1fr;
  gap: 0.5rem;
  align-items: baseline;
  font-family: var(--serif);
  font-style: italic;
  font-weight: 400;
  font-size: 1.1rem;
  line-height: 1.55;
  color: var(--fg);
}
.questions li .num {
  font-family: var(--mono);
  font-style: normal;
  font-size: 0.7rem;
  letter-spacing: 0.12em;
  color: var(--accent);
}

/* ============================================================
   PROJECTS
   ============================================================ */

.work-list {
  display: flex; flex-direction: column;
  border-top: 1px solid var(--line);
}

.work-item {
  display: block;
  text-align: left;
  width: 100%;
  background: none;
  border: none;
  border-bottom: 1px solid var(--line);
  padding: 2rem 0;
  color: var(--fg);
  font-family: var(--sans);
  transition: background 0.3s var(--ease);
  position: relative;
}

.work-row {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.25rem;
  align-items: start;
}
@media (min-width: 760px) {
  .work-row { grid-template-columns: 100px 1fr auto; gap: 2.5rem; }
}

.work-num {
  font-family: var(--mono);
  font-size: 0.72rem;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--fg-muted);
  padding-top: 0.4rem;
}
.work-num .accent { color: var(--accent); font-weight: 500; }

.work-body { display: flex; flex-direction: column; gap: 0.6rem; }
.work-title {
  font-family: var(--sans);
  font-weight: 500;
  font-size: clamp(1.15rem, 1.8vw, 1.4rem);
  line-height: 1.3;
  letter-spacing: -0.018em;
  color: var(--fg);
  margin: 0;
  max-width: 36ch;
}
.work-title em {
  font-family: var(--serif);
  font-style: italic;
  font-weight: 400;
}
.work-sub {
  font-family: var(--sans);
  font-size: 0.95rem;
  line-height: 1.65;
  color: var(--fg-soft);
  margin: 0;
  max-width: 56ch;
}

.work-status {
  font-family: var(--mono);
  font-size: 0.7rem;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--fg-muted);
  display: inline-flex; align-items: center; gap: 0.5rem;
  padding-top: 0.4rem;
  white-space: nowrap;
}
.work-status .ring {
  width: 8px; height: 8px;
  border: 1.5px solid var(--accent);
  border-radius: 50%;
  display: inline-block;
}

/* ============================================================
   INTERLUDE
   ============================================================ */

.interlude {
  padding: clamp(5rem, 11vh, 8rem) 0;
  text-align: center;
  border-bottom: 1px solid var(--line);
}
.interlude-mark {
  display: inline-block;
  font-family: var(--mono);
  font-size: 0.72rem;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--accent);
  margin-bottom: 2rem;
}
.interlude-mark::before,
.interlude-mark::after {
  content: '';
  display: inline-block;
  width: 24px; height: 1px;
  background: var(--accent);
  margin: 0 0.85rem;
  vertical-align: middle;
}
.interlude-text {
  font-family: var(--serif);
  font-style: italic;
  font-weight: 400;
  font-size: clamp(1.4rem, 2.6vw, 1.95rem);
  line-height: 1.45;
  letter-spacing: -0.005em;
  color: var(--fg);
  max-width: 32rem;
  margin: 0 auto;
}
.interlude-text em { color: var(--accent); }
.interlude-sig {
  font-family: var(--mono);
  font-size: 0.74rem;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--fg-muted);
  display: block;
  margin-top: 2.5rem;
}

/* ============================================================
   CONTACT
   ============================================================ */

.contact {
  padding: clamp(5rem, 10vh, 7rem) 0;
}

.contact-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: clamp(2.5rem, 5vh, 3.5rem);
  align-items: start;
}
@media (min-width: 900px) {
  .contact-grid { grid-template-columns: 1fr 1fr; gap: 5rem; }
}

.contact-headline {
  font-family: var(--sans);
  font-weight: 500;
  font-size: clamp(1.6rem, 3vw, 2.1rem);
  line-height: 1.25;
  letter-spacing: -0.018em;
  color: var(--fg);
  margin: 0 0 1.5rem 0;
  max-width: 22ch;
}
.contact-headline em {
  font-family: var(--serif);
  font-style: italic;
  font-weight: 400;
}

.contact-lede {
  font-family: var(--sans);
  font-size: 1rem;
  line-height: 1.7;
  color: var(--fg-soft);
  margin: 0;
  max-width: 36rem;
}

.contact-rows {
  display: flex; flex-direction: column;
  border-top: 1px solid var(--line);
}
.contact-row {
  display: flex; justify-content: space-between; align-items: center;
  padding: 1.1rem 0;
  border-bottom: 1px solid var(--line);
  text-decoration: none; color: var(--fg);
  font-size: 0.95rem;
  transition: color 0.2s var(--ease), padding-left 0.25s var(--ease);
}
.contact-row:hover { color: var(--accent); padding-left: 0.4rem; }
.contact-row .ckey {
  font-family: var(--mono);
  font-size: 0.7rem;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--fg-muted);
}
.contact-row .cval {
  display: flex; align-items: center; gap: 0.55rem;
  font-family: var(--sans);
  font-weight: 500;
}
.contact-row .carr {
  color: var(--fg-faint);
  transition: color 0.2s var(--ease), transform 0.25s var(--ease);
}
.contact-row:hover .carr { color: var(--accent); transform: translateX(3px); }

/* ============================================================
   FOOTER
   ============================================================ */

.footer {
  padding: 2.5rem var(--gutter) 3rem;
  border-top: 1px solid var(--line);
  display: flex; justify-content: space-between;
  align-items: center; flex-wrap: wrap; gap: 1rem;
  font-family: var(--mono);
  font-size: 0.72rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--fg-muted);
}
.footer-mark { display: flex; align-items: center; gap: 0.55rem; color: var(--fg); }
.footer-mark .dot {
  width: 6px; height: 6px;
  background: var(--accent);
  border-radius: 50%;
  display: inline-block;
}
`;

/* ============================================================
   HOOKS
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

function useTheme() {
  const getInitial = () => {
    try {
      const stored = localStorage.getItem('theme');
      if (stored === 'light' || stored === 'dark') return stored;
    } catch {}
    if (typeof window !== 'undefined' && window.matchMedia?.('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  };

  const [theme, setTheme] = createSignal(getInitial());

  createEffect(() => {
    const t = theme();
    document.documentElement.setAttribute('data-theme', t);
    try { localStorage.setItem('theme', t); } catch {}
  });

  onMount(() => {
    const mq = window.matchMedia?.('(prefers-color-scheme: dark)');
    if (!mq) return;
    const onChange = (e) => {
      try {
        if (localStorage.getItem('theme')) return;
      } catch {}
      setTheme(e.matches ? 'dark' : 'light');
    };
    mq.addEventListener?.('change', onChange);
    onCleanup(() => mq.removeEventListener?.('change', onChange));
  });

  const toggle = () => setTheme((t) => (t === 'dark' ? 'light' : 'dark'));
  return [theme, toggle];
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

function scrollToId(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
}

/* ============================================================
   NAV / FOOTER
   ============================================================ */

function Nav(props) {
  const scrolled = useScrolled();
  return (
    <nav class="nav" classList={{ scrolled: scrolled() }}>
      <button class="nav-mark" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
        <span class="dot" />
        <span>Kunal Sharma</span>
      </button>
      <div class="nav-right">
        <button class="nav-link" onClick={() => scrollToId('about')}>About</button>
        <button class="nav-link" onClick={() => scrollToId('projects')}>Projects</button>
        <button class="nav-link" onClick={() => scrollToId('contact')}>Contact</button>
        <button
          class="theme-toggle"
          onClick={props.onToggleTheme}
          aria-label={props.theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          title={props.theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          <svg class="icon-moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
          </svg>
          <svg class="icon-sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
          </svg>
        </button>
      </div>
    </nav>
  );
}

function Footer() {
  return (
    <div class="container">
      <div class="footer">
        <span class="footer-mark">
          <span class="dot" />
          <span>Roorkee, IN</span>
        </span>
        <span>© 2026 Kunal Sharma</span>
      </div>
    </div>
  );
}

/* ============================================================
   HERO
   ============================================================ */

function Hero() {
  const t = useLiveTime();
  return (
    <section class="hero" id="top">
      <div class="container">
        <div class="hero-grid">
          <div>
            <div class="hero-top reveal">
              <span class="pulse" />
              <span>Currently exploring</span>
            </div>

            <h1 class="hero-headline reveal d1">
              I take things apart to figure out how they actually <em>work</em>.
            </h1>

            <p class="hero-sub reveal d2">
              Most of what I think about sits between disciplines — <strong>AI, systems,
              product, and the small details that make digital tools feel considered</strong>.
              I'm interested in how good things actually get built, how workflows shape
              the way people think, and what changes when you take something apart
              carefully. Most of what's here is in progress.
            </p>

            <div class="cta-row reveal d3">
              <button class="btn btn-primary" onClick={() => scrollToId('projects')}>
                <span>See what I'm exploring</span>
                <span class="arrow">→</span>
              </button>
              <button class="btn btn-ghost" onClick={() => scrollToId('contact')}>
                <span>Say hi</span>
                <span class="arrow">↓</span>
              </button>
            </div>
          </div>

          <div class="reveal d4">
            <figure class="hero-portrait">
              <img src="/kunal.jpg" alt="Kunal Sharma" loading="eager" />
              <figcaption class="hero-portrait-cap">
                <span>Kunal Sharma</span>
                <span>Roorkee · 2026</span>
              </figcaption>
            </figure>
          </div>
        </div>

        <div class="hero-meta reveal d5">
          <div class="hero-meta-item">
            <div class="label">Currently reading</div>
            <div class="body">
              {/* TODO[KUNAL]: swap for what you're actually reading right now */}
              Whatever I have open in tabs — usually some mix of essays on product,
              AI write-ups, and a book I'm only halfway through.
            </div>
          </div>
          <div class="hero-meta-item">
            <div class="label">Thinking about</div>
            <div class="body">
              What it actually takes to <em>think with</em> AI
              <span class="soft">— rather than just produce faster with it.</span>
            </div>
          </div>
          <div class="hero-meta-item">
            <div class="label">Right now</div>
            <div class="body">
              Roorkee, IN · {t()}
              <span class="soft">Reading, writing, tinkering. Open to interesting conversations.</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   ABOUT
   ============================================================ */

const QUESTIONS = [
  'What makes a digital product feel considered — versus one that just functions?',
  'What does it actually take to think with AI, rather than just produce faster with it?',
  'Is taste something you can practice, or just something you slowly notice in yourself?',
];

function About() {
  return (
    <section class="section" id="about">
      <div class="container">
        <div class="about-grid">
          <div class="about-side reveal">
            <div class="about-avatar">
              <img src="/kunal-avatar.jpg" alt="Kunal Sharma" loading="lazy" />
            </div>
            <div class="section-label">
              <span class="num">01</span>
              <span class="rule" />
              <span>About</span>
            </div>
            <div class="about-meta">
              <div class="kv"><span class="k">Focus</span><span class="v">AI · systems · product</span></div>
              <div class="kv"><span class="k">Approach</span><span class="v">Reading, taking things apart, writing notes</span></div>
              <div class="kv"><span class="k">Based in</span><span class="v">Roorkee, India</span></div>
            </div>
          </div>

          <div>
            <h2 class="h-display reveal d1">
              I tend to notice the systems behind things — and the small details <em>inside them</em>.
            </h2>

            <div class="prose">
              <p class="reveal d2">
                I come from a technical, research-leaning background, but most of what I
                actually spend my time on sits between disciplines: AI, systems,
                workflows, design, psychology, and how products end up <em>feeling</em> the
                way they feel. I'm trying to learn how good digital products actually
                get built — by reading, taking things apart, and looking closely enough
                to understand <em>why</em> something works.
              </p>

              <p class="reveal d3">
                I'm not a senior PM, a founder, or an "AI expert." I'm someone in the
                middle of figuring all of that out — reading a lot, taking small things
                apart, writing notes I rarely publish. The questions I'm most drawn to
                are the boring-sounding ones: why does this feel good to use? what's the
                hidden workflow underneath this product? what changed in me when I
                started using this tool?
              </p>

              <div class="pullquote reveal d4">
                The internet rewards confidence. I'm more interested in being <em>curious</em> and honest.
              </div>

              <p class="reveal d5">
                The projects on this site are mostly explorations in progress. They're
                closer to how I actually think than anything that'd fit on a résumé —
                and most of them aren't finished. I'd rather show what I'm working
                through than wait until everything looks polished.
              </p>
            </div>

            <div class="questions reveal d6">
              <div class="questions-label">Questions I'm sitting with right now</div>
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
   PROJECTS
   ============================================================ */

const PROJECTS = [
  {
    num: '01',
    category: 'Workflow',
    title: 'Reading & note-taking workflow',
    sub: 'A small ongoing experiment in reducing friction between reading PDFs, organising notes, and the moment those notes actually turn into a thought. Less about a perfect tool — more about understanding what breaks when you try to think with what you read.',
  },
  {
    num: '02',
    category: 'Product · Behavioral',
    title: 'Valorant — ranked & retention teardown',
    sub: "Working through what's actually happening inside Valorant's progression and ranking systems — and why the behavioural design feels more deliberate than most competitive games admit. Notes in progress, not a polished thesis yet.",
  },
  {
    num: '03',
    category: 'GTM · Product strategy',
    title: 'Slack — positioning & adoption case study',
    sub: 'A slow-built case study on how Slack got adopted, positioned, and grew — focused on the parts most teardowns skip: communication norms, internal momentum, and what “good timing” actually means in B2B.',
  },
  {
    num: '04',
    category: 'AI · Writing',
    title: 'AI workflow & writing experiments',
    sub: 'Notes from using Claude and GPT as actual thinking partners — for research, drafting, and developing ideas. Trying to figure out where AI genuinely changes how I think, and where it just makes me feel productive.',
  },
  {
    num: '05',
    category: 'Workflow',
    title: 'Legal internship discovery — workflow experiment',
    sub: 'A small product experiment for a specific friction: how fragmented opportunity discovery is for legal internships. Aggregating listings, surfacing relevant firms, and trying to reduce the anxiety of always feeling like you’re missing something.',
  },
  {
    num: '06',
    category: 'Notes',
    title: 'Reflections — philosophy, systems, technology',
    sub: "An ongoing journal of short notes — what I notice using AI tools, why one product feels considered and another doesn't, what changes in me when I adopt a new workflow. Mostly thinking out loud. Some of these may show up here as proper writing later.",
  },
];

function Projects() {
  return (
    <section class="section" id="projects">
      <div class="container">
        <div class="section-head">
          <div class="reveal">
            <div class="section-label">
              <span class="num">02</span>
              <span class="rule" />
              <span>Currently exploring</span>
            </div>
          </div>

          <h2 class="h-display reveal d1">
            A few things I'm <em>working through</em> — slowly.
          </h2>

          <p class="section-lede reveal d2">
            None of these are finished. Most are open notebooks: a workflow I'm tinkering
            with, a product I'm taking apart, an experiment I haven't shipped. I'd rather
            show what I'm actually thinking about than a polished case study I only
            half-believe.
          </p>
        </div>

        <div class="work-list reveal d3">
          <For each={PROJECTS}>{(p) => (
            <div class="work-item">
              <div class="work-row">
                <div class="work-num"><span class="accent">{p.num}</span> · {p.category}</div>
                <div class="work-body">
                  <h3 class="work-title">{p.title}</h3>
                  <p class="work-sub">{p.sub}</p>
                </div>
                <span class="work-status">
                  <span class="ring" />
                  <span>Coming soon</span>
                </span>
              </div>
            </div>
          )}</For>
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   INTERLUDE
   ============================================================ */

function Interlude() {
  return (
    <section class="interlude">
      <div class="container read">
        <div class="reveal">
          <span class="interlude-mark">Note</span>
        </div>
        <p class="interlude-text reveal d1">
          Most of what's here is mid-thought. I'd rather show <em>that</em> — than wait
          until everything looks finished.
        </p>
        <span class="interlude-sig reveal d2">— K.</span>
      </div>
    </section>
  );
}

/* ============================================================
   CONTACT
   ============================================================ */

function Contact() {
  return (
    <section class="contact" id="contact">
      <div class="container">
        <div class="section-head reveal">
          <div class="section-label">
            <span class="num">03</span>
            <span class="rule" />
            <span>Contact</span>
          </div>
        </div>

        <div class="contact-grid">
          <div class="reveal">
            <h2 class="contact-headline">
              If something here <em>resonated</em> — or you're poking at similar things — I'd love to talk.
            </h2>
            <p class="contact-lede">
              I'm not selling anything. Mostly just curious about people thinking about
              the same questions — AI, product, systems, how good digital experiences get
              built. Happy to compare notes, share what's in progress, or just say hi.
            </p>
          </div>

          <div class="contact-rows reveal d1">
            <a class="contact-row" href="mailto:KunalSharmakv4@gmail.com">
              <span class="ckey">Email</span>
              <span class="cval">KunalSharmakv4@gmail.com <span class="carr">↗</span></span>
            </a>
            <a class="contact-row" href="https://www.linkedin.com/in/kunal-sharma-k21" target="_blank" rel="noreferrer">
              <span class="ckey">LinkedIn</span>
              <span class="cval">linkedin.com/in/kunal-sharma-k21 <span class="carr">↗</span></span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   ROOT
   ============================================================ */

function HomePage() {
  useReveal();
  return (
    <>
      <Hero />
      <About />
      <Projects />
      <Interlude />
      <Contact />
      <Footer />
    </>
  );
}

export default function App() {
  useNoIndex();
  const [theme, toggleTheme] = useTheme();
  return (
    <>
      <style>{STYLES}</style>
      <div class="page">
        <Nav theme={theme()} onToggleTheme={toggleTheme} />
        <div class="content">
          <HomePage />
        </div>
      </div>
    </>
  );
}
