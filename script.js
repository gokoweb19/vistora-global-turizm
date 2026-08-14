const $ = (s, p = document) => p.querySelector(s);
const $$ = (s, p = document) => [...p.querySelectorAll(s)];

window.addEventListener('load', () => setTimeout(() => $('.loader').classList.add('hide'), 350));
requestAnimationFrame(() => $$('.hero .reveal').forEach(el => el.classList.add('visible')));

const menuButton = $('.menu-toggle');
const mobileMenu = $('.mobile-menu');
menuButton.addEventListener('click', () => {
  const open = mobileMenu.classList.toggle('open');
  document.body.classList.toggle('menu-open', open);
  menuButton.setAttribute('aria-expanded', open);
  mobileMenu.setAttribute('aria-hidden', !open);
});
$$('.mobile-menu a').forEach(a => a.addEventListener('click', () => {
  mobileMenu.classList.remove('open'); document.body.classList.remove('menu-open');
  menuButton.setAttribute('aria-expanded', 'false');
}));

const observer = new IntersectionObserver(entries => entries.forEach(entry => {
  if (entry.isIntersecting) entry.target.classList.add('visible');
}), { threshold: .12 });
$$('.reveal').forEach(el => observer.observe(el));

let counted = false;
const stats = $('.stats');
new IntersectionObserver(([entry]) => {
  if (!entry.isIntersecting || counted) return; counted = true;
  $$('[data-count]').forEach(el => {
    const target = +el.dataset.count; let value = 0; const duration = 1200; const start = performance.now();
    const tick = now => { value = Math.min(target, Math.round(target * (now - start) / duration)); el.textContent = value.toLocaleString('tr-TR') + (target === 2400 ? '+' : ''); if (value < target) requestAnimationFrame(tick); };
    requestAnimationFrame(tick);
  });
}, { threshold: .4 }).observe(stats);

const track = $('.destination-track');
const cards = $$('.destination-card');
let slide = 0;
function moveSlider(direction) {
  const mobile = innerWidth < 900; const visible = mobile ? 1 : 3;
  slide = Math.max(0, Math.min(slide + direction, cards.length - visible));
  const gap = 18; const cardWidth = cards[0].getBoundingClientRect().width;
  track.style.transform = `translateX(-${slide * (cardWidth + gap)}px)`;
}
$('.slide-next').addEventListener('click', () => moveSlider(1));
$('.slide-prev').addEventListener('click', () => moveSlider(-1));
window.addEventListener('resize', () => { slide = 0; track.style.transform = ''; });

const modal = $('.video-modal');
$('.play').addEventListener('click', () => { modal.classList.add('open'); modal.setAttribute('aria-hidden', 'false'); });
$('.video-modal button').addEventListener('click', () => { modal.classList.remove('open'); modal.setAttribute('aria-hidden', 'true'); });
modal.addEventListener('click', e => { if (e.target === modal) $('.video-modal button').click(); });
