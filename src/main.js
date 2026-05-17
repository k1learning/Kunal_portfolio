/* ----------------------------------------------------------
   THEME
   ---------------------------------------------------------- */
const root = document.documentElement;
const toggleBtn = document.getElementById('theme-toggle');

const currentTheme = () => (root.getAttribute('data-theme') === 'dark' ? 'dark' : 'light');

const applyTheme = (t) => {
  root.setAttribute('data-theme', t);
  try { localStorage.setItem('theme', t); } catch {}
  const label = t === 'dark' ? 'Switch to light mode' : 'Switch to dark mode';
  toggleBtn?.setAttribute('aria-label', label);
  toggleBtn?.setAttribute('title', label);
};

applyTheme(currentTheme());

toggleBtn?.addEventListener('click', () => {
  applyTheme(currentTheme() === 'dark' ? 'light' : 'dark');
});

window.matchMedia?.('(prefers-color-scheme: dark)').addEventListener?.('change', (e) => {
  try { if (localStorage.getItem('theme')) return; } catch {}
  applyTheme(e.matches ? 'dark' : 'light');
});

/* ----------------------------------------------------------
   NAV scrolled state
   ---------------------------------------------------------- */
const nav = document.getElementById('nav');
if (nav) {
  const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 12);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
}

/* ----------------------------------------------------------
   REVEAL on intersection
   ---------------------------------------------------------- */
const revealEls = document.querySelectorAll('.reveal');
if (!('IntersectionObserver' in window)) {
  revealEls.forEach((el) => el.classList.add('in'));
} else {
  const io = new IntersectionObserver(
    (entries) => entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add('in');
        io.unobserve(e.target);
      }
    }),
    { threshold: 0.10, rootMargin: '0px 0px -6% 0px' }
  );
  revealEls.forEach((el) => io.observe(el));
}

/* ----------------------------------------------------------
   LIVE TIME (IST)
   ---------------------------------------------------------- */
const timeEl = document.getElementById('live-time');
if (timeEl) {
  const fmt = () => {
    const n = new Date();
    try {
      const t = new Intl.DateTimeFormat('en-GB', {
        hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'Asia/Kolkata',
      }).format(n);
      return t + ' IST';
    } catch {
      return n.toTimeString().slice(0, 5);
    }
  };
  timeEl.textContent = fmt();
  setInterval(() => { timeEl.textContent = fmt(); }, 30000);
}
