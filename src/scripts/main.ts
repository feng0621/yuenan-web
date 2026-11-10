import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Flip } from 'gsap/Flip';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger, Flip);

const motion = document.documentElement.classList.contains('motion');
const $$ = <T extends Element = HTMLElement>(sel: string, root: ParentNode = document) => Array.from(root.querySelectorAll<T>(sel));
const $ = <T extends Element = HTMLElement>(sel: string, root: ParentNode = document) => root.querySelector<T>(sel);

let lenis: Lenis | null = null;

function initSmoothScroll() {
  if (!motion || matchMedia('(pointer: coarse)').matches) return;
  lenis = new Lenis({ duration: 1.1, easing: (t) => 1 - Math.pow(1 - t, 3) });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => lenis?.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);
}

function scrollToTarget(target: number | HTMLElement) {
  if (lenis) lenis.scrollTo(target, { offset: typeof target === 'number' ? 0 : -60 });
  else if (typeof target === 'number') window.scrollTo({ top: target, behavior: motion ? 'smooth' : 'auto' });
  else target.scrollIntoView({ behavior: motion ? 'smooth' : 'auto' });
}

function initHeader() {
  const header = $('[data-header]');
  if (!header) return;
  let last = window.scrollY;
  const update = () => {
    const y = window.scrollY;
    header.classList.toggle('is-scrolled', y > 80);
    if (y > 480 && y > last + 2 && !header.classList.contains('is-menu-open')) header.classList.add('is-hidden');
    if (y <= 480 || y < last - 2) header.classList.remove('is-hidden');
    last = y;
  };
  update();
  window.addEventListener('scroll', update, { passive: true });
  if (motion) gsap.from(header, { yPercent: -100, duration: 0.9, ease: 'power3.out', clearProps: 'transform' });

  const toggle = $<HTMLButtonElement>('[data-menu-toggle]');
  const drawer = $('[data-mobile-nav]');
  toggle?.addEventListener('click', () => {
    const open = !drawer?.classList.contains('is-open');
    drawer?.classList.toggle('is-open', open);
    header.classList.toggle('is-menu-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? toggle.dataset.labelClose || '' : toggle.dataset.labelOpen || '');
    drawer?.setAttribute('aria-hidden', String(!open));
    document.documentElement.style.overflow = open ? 'hidden' : '';
    if (open) lenis?.stop(); else lenis?.start();
    if (open && motion) gsap.from($$('.mobile-nav__link', drawer!), { x: 28, opacity: 0, duration: 0.5, delay: 0.12, stagger: 0.05, ease: 'power3.out', clearProps: 'all' });
  });

  const lang = $('[data-lang]');
  const langToggle = $<HTMLButtonElement>('[data-lang-toggle]');
  langToggle?.addEventListener('click', (e) => {
    e.stopPropagation();
    const open = !lang?.classList.contains('is-open');
    lang?.classList.toggle('is-open', open);
    langToggle.setAttribute('aria-expanded', String(open));
  });
  $('[data-lang-menu]')?.addEventListener('click', (e) => e.stopPropagation());
  document.addEventListener('click', () => { lang?.classList.remove('is-open'); langToggle?.setAttribute('aria-expanded', 'false'); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') lang?.classList.remove('is-open'); });
}

function initHeroIntro() {
  const lines = $$('[data-hero-line]');
  if (!lines.length || !motion) return;
  gsap.to(lines, { y: 0, duration: 1.1, ease: 'power4.out', stagger: 0.14, delay: 0.2 });
  const hero = $('[data-home-hero], [data-page-hero]');
  const media = $('[data-parallax-media]', hero!);
  const copy = $('[data-hero-copy]', hero!);
  if (!hero || !media) return;
  gsap.fromTo(media, { yPercent: -3 }, { yPercent: 5, ease: 'none', scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true } });
  gsap.from(media, { scale: 1.1, duration: 1.8, ease: 'power3.out' });
  if (copy) gsap.to(copy, { yPercent: 22, opacity: 0.1, ease: 'none', scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom 15%', scrub: true } });
}

function initHeroSlider() {
  const slides = $$('[data-hero-slide]');
  if (slides.length < 2) return;
  const dots = $$('[data-hero-dot] i');
  const hold = 6;
  let index = 0;
  let progress: gsap.core.Tween | null = null;

  const startProgress = () => {
    progress?.kill();
    dots.forEach((dot, i) => gsap.set(dot, { scaleX: i < index ? 1 : 0 }));
    if (!motion) return;
    progress = gsap.to(dots[index], { scaleX: 1, duration: hold, ease: 'none', onComplete: () => go(index + 1) });
  };

  function go(next: number) {
    const to = (next + slides.length) % slides.length;
    if (to === index) return;
    const from = slides[index];
    const incoming = slides[to];
    const img = $('img', incoming);
    gsap.killTweensOf([from, incoming, img]);
    if (img?.loading === 'lazy') img.loading = 'eager';
    gsap.set(incoming, { zIndex: 2, opacity: 0 });
    gsap.set(from, { zIndex: 1 });
    index = to;
    startProgress();
    if (motion) {
      gsap.to(incoming, { opacity: 1, duration: 1.3, ease: 'power2.inOut', onComplete: () => { gsap.set(from, { opacity: 0 }); from.classList.remove('is-active'); incoming.classList.add('is-active'); } });
      gsap.fromTo(img, { scale: 1.1 }, { scale: 1, duration: hold + 1.5, ease: 'none' });
    } else {
      gsap.set(incoming, { opacity: 1 });
      gsap.set(from, { opacity: 0 });
    }
  }

  $('[data-hero-prev]')?.addEventListener('click', () => go(index - 1));
  $('[data-hero-next]')?.addEventListener('click', () => go(index + 1));
  dots.forEach((dot, i) => gsap.set(dot, { scaleX: 0 }));
  if (motion) gsap.fromTo($('img', slides[0]), { scale: 1.1 }, { scale: 1, duration: hold + 2, ease: 'none' });
  startProgress();
  document.addEventListener('visibilitychange', () => { if (document.hidden) progress?.pause(); else progress?.resume(); });
}

function initReveals() {
  if (!motion) return;
  const reveals = $$('[data-reveal]');
  gsap.set(reveals, { y: 36 });
  ScrollTrigger.batch(reveals, {
    start: 'top 90%',
    once: true,
    onEnter: (batch) => gsap.to(batch, { y: 0, opacity: 1, duration: 1, ease: 'power3.out', stagger: 0.09, overwrite: true, clearProps: 'transform' }),
  });

  $$('[data-stagger]').forEach((group) => {
    const cards = $$('[data-card]', group);
    gsap.set(cards, { y: 56 });
    ScrollTrigger.batch(cards, {
      start: 'top 92%',
      once: true,
      onEnter: (batch) => gsap.to(batch, { y: 0, opacity: 1, duration: 1, ease: 'power3.out', stagger: 0.08, overwrite: true, clearProps: 'transform' }),
    });
  });

  $$('[data-img-reveal]').forEach((frame) => {
    const img = $('img', frame);
    const tl = gsap.timeline({ scrollTrigger: { trigger: frame, start: 'top 88%', once: true } });
    tl.to(frame, { clipPath: 'inset(0% 0 0 0)', duration: 1.2, ease: 'power4.inOut' });
    if (img) tl.from(img, { scale: 1.22, duration: 1.5, ease: 'power3.out', clearProps: 'transform,scale' }, 0);
  });

  $$('[data-rule]').forEach((rule) => {
    gsap.to(rule, { scaleX: 1, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: rule, start: 'top 90%', once: true } });
  });

  $$('[data-watermark]').forEach((mark) => {
    gsap.fromTo(mark, { y: -40, rotate: -6 }, { y: 90, rotate: 6, ease: 'none', scrollTrigger: { trigger: mark.parentElement, start: 'top bottom', end: 'bottom top', scrub: 1 } });
  });

  $$('[data-count]').forEach((el) => {
    const target = Number(el.dataset.count);
    const value = { n: target - 40 };
    el.textContent = String(value.n);
    gsap.to(value, { n: target, duration: 1.6, ease: 'power2.out', onUpdate: () => { el.textContent = String(Math.round(value.n)); }, scrollTrigger: { trigger: el, start: 'top 90%', once: true } });
  });

  $$('.team-card__photo img').forEach((img) => {
    gsap.from(img, { yPercent: 8, duration: 1.4, ease: 'power3.out', clearProps: 'transform', scrollTrigger: { trigger: img.closest('.team-card'), start: 'top 92%', once: true } });
  });
}

function initGoldGroups() {
  // Which card shows the hover style at rest, matching the design frames.
  const rules: [string, string, number][] = [
    ['.values-track__inner', '.value-card', 1],
    ['.numbered-grid', '.numbered-card', 1],
    ['.news-grid', '.news-card', 0],
    ['.team-grid', '.team-card', 0],
    ['.benefit-grid', '.benefit-card', 0],
    ['.project-grid', '.project-card', 1],
    ['.row-list', '.row-card', 1],
  ];
  rules.forEach(([groupSel, cardSel, featured]) => {
    $$(groupSel).forEach((group) => {
      group.setAttribute('data-gold-group', '');
      const cards = $$(cardSel, group);
      cards.forEach((card, i) => {
        if (!card.classList.contains('team-card')) card.classList.add('goldable');
        card.classList.toggle('is-featured', i === featured);
      });
    });
  });
}

function initDragScroll() {
  $$('[data-drag-scroll]').forEach((track) => {
    let down = false;
    let startX = 0;
    let startLeft = 0;
    let velocity = 0;
    let lastX = 0;
    track.addEventListener('pointerdown', (e) => {
      if (e.pointerType !== 'mouse') return;
      down = true;
      startX = lastX = e.clientX;
      startLeft = track.scrollLeft;
      gsap.killTweensOf(track);
      track.setPointerCapture(e.pointerId);
    });
    track.addEventListener('pointermove', (e) => {
      if (!down) return;
      const dx = e.clientX - startX;
      if (Math.abs(dx) > 4) track.classList.add('is-dragging');
      velocity = e.clientX - lastX;
      lastX = e.clientX;
      track.scrollLeft = startLeft - dx;
    });
    const end = () => {
      if (!down) return;
      down = false;
      track.classList.remove('is-dragging');
      if (motion) gsap.to(track, { scrollLeft: track.scrollLeft - velocity * 14, duration: 0.9, ease: 'power3.out' });
    };
    track.addEventListener('pointerup', end);
    track.addEventListener('pointercancel', end);
    track.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight') track.scrollLeft += 200;
      if (e.key === 'ArrowLeft') track.scrollLeft -= 200;
    });
  });
}

function initMarquee() {
  const rows = $$('[data-marquee]');
  if (!rows.length) return;
  const states = rows.map((row) => {
    const track = $('[data-marquee-track]', row)!;
    const originals = Array.from(track.children);
    // Two extra copies so the loop still covers very wide screens.
    for (let i = 0; i < 2; i++) originals.forEach((el) => {
      const clone = el.cloneNode(true) as HTMLElement;
      clone.setAttribute('aria-hidden', 'true');
      track.appendChild(clone);
    });
    const dir = Number(row.dataset.direction) || -1;
    const state = { row, track, dir, x: 0, speed: 1, target: 1, period: 0, count: originals.length };
    row.addEventListener('mouseenter', () => { state.target = 0.12; });
    row.addEventListener('mouseleave', () => { state.target = 1; });
    return state;
  });
  const measure = () => states.forEach((s) => {
    const kids = s.track.children;
    s.period = (kids[s.count] as HTMLElement).offsetLeft - (kids[0] as HTMLElement).offsetLeft;
  });
  measure();
  window.addEventListener('resize', measure);
  window.addEventListener('load', measure);
  if (!motion) return;

  let boost = 0;
  ScrollTrigger.create({
    trigger: rows[0].parentElement,
    start: 'top bottom',
    end: 'bottom top',
    onUpdate: (self) => { boost = gsap.utils.clamp(-5, 5, self.getVelocity() / 350); },
  });
  gsap.ticker.add((_t, delta) => {
    const step = delta / 16.67;
    boost *= 0.94;
    states.forEach((s) => {
      s.speed += (s.target - s.speed) * 0.08;
      s.x += s.dir * (0.7 * s.speed + Math.abs(boost)) * step;
      if (s.period) s.x = gsap.utils.wrap(-s.period, 0, s.x);
      s.track.style.transform = `translate3d(${s.x}px,0,0)`;
    });
  });
}

function initTimeline() {
  const root = $('[data-timeline]');
  if (!root) return;
  const slides = $$('[data-timeline-slide]', root);
  const tabs = $$('[data-timeline-tab]', root);
  const line = $('[data-timeline-line]', root);
  let index = 0;

  const paintLine = () => {
    if (!line) return;
    const scale = (index + 0.08) / tabs.length;
    if (motion) gsap.to(line, { scaleX: scale, duration: 0.9, ease: 'power3.inOut' });
    else line.style.transform = `scaleX(${scale})`;
  };

  const go = (next: number) => {
    const to = (next + slides.length) % slides.length;
    if (to === index) return;
    const dir = next > index ? 1 : -1;
    const from = slides[index];
    const incoming = slides[to];
    tabs[index].classList.remove('is-active');
    tabs[to].classList.add('is-active');
    tabs[to].scrollIntoView({ inline: 'center', block: 'nearest', behavior: motion ? 'smooth' : 'auto' });
    index = to;
    paintLine();
    if (!motion) {
      from.classList.remove('is-active');
      incoming.classList.add('is-active');
      from.setAttribute('aria-hidden', 'true');
      incoming.setAttribute('aria-hidden', 'false');
      return;
    }
    const copy = $$('.chamber__copy > *', incoming);
    const disc = $('.year-disc', incoming);
    gsap.killTweensOf([from, incoming, disc, ...copy]);
    from.classList.remove('is-active');
    from.setAttribute('aria-hidden', 'true');
    gsap.set(from, { clearProps: 'all' });
    incoming.classList.add('is-active');
    incoming.setAttribute('aria-hidden', 'false');
    incoming.scrollTop = 0;
    const text = $('.chamber__text', incoming);
    if (text) text.scrollTop = 0;
    gsap.from(disc, { scale: 0.82, rotate: dir * 10, opacity: 0, duration: 0.8, ease: 'back.out(1.5)', clearProps: 'all' });
    gsap.from(copy, { x: dir * 40, opacity: 0, duration: 0.7, stagger: 0.07, ease: 'power3.out', clearProps: 'all' });
    ScrollTrigger.refresh();
  };

  tabs.forEach((tab, i) => tab.addEventListener('click', () => go(i)));
  $('[data-timeline-prev]', root)?.addEventListener('click', () => go(index - 1));
  $('[data-timeline-next]', root)?.addEventListener('click', () => go(index + 1));

  if (motion && line) {
    gsap.fromTo(line, { scaleX: 0 }, { scaleX: 0.08 / tabs.length, duration: 1.2, ease: 'power3.out', scrollTrigger: { trigger: line, start: 'top 85%', once: true } });
    gsap.from($$('.timeline__item', root), { y: 24, opacity: 0, duration: 0.8, stagger: 0.08, ease: 'power3.out', clearProps: 'all', scrollTrigger: { trigger: line, start: 'top 90%', once: true } });
  } else paintLine();
}

function initFilters() {
  $$('[data-filter-list]').forEach((list) => {
    const section = list.closest('.container');
    if (!section) return;
    const cards = $$('[data-category]', list);
    const chips = $$<HTMLButtonElement>('[data-filter]', section);
    const pagesEl = $('[data-pagination-pages]', section);
    const next = $<HTMLButtonElement>('[data-pagination-next]', section);
    const pageSize = Number(list.dataset.pageSize) || 5;
    let filter = '*';
    let page = 0;

    const matching = () => cards.filter((c) => filter === '*' || c.dataset.category === filter);

    const apply = (animate: boolean) => {
      const items = matching();
      const pageCount = Math.max(1, Math.ceil(items.length / pageSize));
      page = Math.min(page, pageCount - 1);
      const visible = new Set(items.slice(page * pageSize, (page + 1) * pageSize));
      // A card may still be waiting for its scroll reveal when the list changes.
      if (animate && motion) gsap.set(cards, { opacity: 1, y: 0 });
      const state = animate && motion ? Flip.getState(cards) : null;
      cards.forEach((card) => { card.hidden = !visible.has(card); });

      if (pagesEl) {
        pagesEl.replaceChildren(...Array.from({ length: pageCount }, (_, i) => {
          const b = document.createElement('button');
          b.type = 'button';
          b.className = `pagination__page${i === page ? ' is-active' : ''}`;
          b.textContent = String(i + 1);
          const template = pagesEl.closest('[data-pagination]')?.getAttribute('data-page-label') || 'Page {n}';
          b.setAttribute('aria-label', template.replace('{n}', String(i + 1)));
          if (i === page) b.setAttribute('aria-current', 'page');
          b.addEventListener('click', () => { if (i !== page) { page = i; apply(true); } });
          return b;
        }));
      }
      if (next) next.disabled = page >= pageCount - 1;

      if (state) {
        Flip.from(state, {
          duration: 0.6,
          ease: 'power3.inOut',
          stagger: 0.03,
          absolute: false,
          onEnter: (els) => gsap.fromTo(els, { opacity: 0, y: 28 }, { opacity: 1, y: 0, duration: 0.55, ease: 'power3.out', clearProps: 'transform' }),
          onLeave: (els) => gsap.to(els, { opacity: 0, duration: 0.25 }),
          onComplete: () => { ScrollTrigger.refresh(); },
        });
      } else ScrollTrigger.refresh();
    };

    chips.forEach((chip) => chip.addEventListener('click', () => {
      if (chip.dataset.filter === filter) return;
      filter = chip.dataset.filter || '*';
      page = 0;
      chips.forEach((c) => {
        const on = c === chip;
        c.classList.toggle('is-active', on);
        c.setAttribute('aria-pressed', String(on));
      });
      apply(true);
    }));
    next?.addEventListener('click', () => { page += 1; apply(true); });
    apply(false);
  });
}

function initLinks() {
  $$('[data-to-top]').forEach((b) => b.addEventListener('click', () => scrollToTarget(0)));
  $$<HTMLAnchorElement>('[data-scroll-link]').forEach((a) => a.addEventListener('click', (e) => {
    const target = $(a.getAttribute('href') || '');
    if (!target) return;
    e.preventDefault();
    scrollToTarget(target);
  }));
}

initGoldGroups();
initSmoothScroll();
initHeader();
initHeroIntro();
initHeroSlider();
initFilters();
initReveals();
initDragScroll();
initMarquee();
initTimeline();
initLinks();
(window as unknown as { __motionReady: boolean }).__motionReady = true;
window.addEventListener('load', () => ScrollTrigger.refresh());
