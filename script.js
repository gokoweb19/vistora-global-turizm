const $ = (selector, parent = document) => parent.querySelector(selector);
const $$ = (selector, parent = document) => [...parent.querySelectorAll(selector)];

const menuButton = $('.menu-toggle');
const mobileMenu = $('.mobile-menu');
const setMenu = open => {
  mobileMenu.classList.toggle('open', open);
  document.body.classList.toggle('menu-open', open);
  mobileMenu.setAttribute('aria-hidden', String(!open));
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.setAttribute('aria-label', open ? 'Menüyü kapat' : 'Menüyü aç');
};
menuButton.addEventListener('click', () => setMenu(!mobileMenu.classList.contains('open')));
$$('.mobile-menu a').forEach(link => link.addEventListener('click', () => setMenu(false)));

const revealObserver = new IntersectionObserver(entries => entries.forEach(entry => {
  if (entry.isIntersecting) {
    entry.target.classList.add('visible');
    revealObserver.unobserve(entry.target);
  }
}), { threshold: .12 });
$$('.reveal').forEach(element => revealObserver.observe(element));

const aboutCopies = {
  otel: 'Operasyonel süreçleri iyileştirir, hizmet standardını yükseltir ve misafir memnuniyetini sürdürülebilir biçimde artırırız.',
  yatirim: 'Lokasyon, fizibilite ve konumlandırma verilerini birlikte değerlendirerek turizm yatırımlarına sağlam ve ölçeklenebilir bir yol haritası çizeriz.',
  marka: 'Hedef kitleye uygun konsept, hizmet dili ve marka deneyimi geliştirerek projelerin pazardaki ayrışmasını güçlendiririz.'
};
$$('.about-list button').forEach(button => button.addEventListener('click', () => {
  $$('.about-list button').forEach(item => item.classList.remove('active'));
  button.classList.add('active');
  $('#about-copy').textContent = aboutCopies[button.dataset.about];
}));

const rooms = [
  { title: '1+1 Standart', label: 'FERAH YAŞAM ALANI', image: 'assets/spa-1.jpg', copy: 'Yatak odası, salon, mutfak, geniş balkon, termal küvet ve çift lavabo ile fonksiyonel çözüm.' },
  { title: '2+1 Standart', label: 'GENİŞ AİLE DOSTU', image: 'assets/spa-2.jpg', copy: 'Yatak odası, çocuk odası, salon, mutfak, üç balkon ve termal duşakabin ile aile boyu konfor.' },
  { title: '2+1 VIP Oda', label: 'VIP JAKUZİ & HAMAM', image: 'assets/hotel-6.jpg', copy: 'Özel hamam, çift kişilik masajlı jakuzi, salon, mutfak ve termal küvet ile en üst düzey konaklama deneyimi.' }
];
$$('.room-tab').forEach(button => button.addEventListener('click', () => {
  $$('.room-tab').forEach(item => {
    const active = item === button;
    item.classList.toggle('active', active);
    item.setAttribute('aria-selected', String(active));
  });
  const room = rooms[Number(button.dataset.room)];
  const image = $('#room-image');
  image.style.opacity = '0';
  setTimeout(() => {
    image.src = room.image;
    image.alt = room.title;
    image.style.opacity = '1';
  }, 180);
  $('#room-label').textContent = room.label;
  $('#room-title').textContent = room.title;
  $('#room-copy').textContent = room.copy;
}));

const galleryItems = [
  ['assets/spa-1.jpg', 'Valide Sultan Termal Otel · Lobi'],
  ['assets/spa-2.jpg', 'Valide Sultan Termal Otel · Açık Havuz'],
  ['assets/spa-3.jpg', 'Termal SPA · Bakım Ritüeli'],
  ['assets/spa-4.jpg', 'SPA · Sıcak Taş Masajı'],
  ['assets/spa-5.jpg', 'Wellness · Yenilenme'],
  ['assets/spa-6.jpg', 'SPA · Profesyonel Masaj'],
  ['assets/hotel-6.jpg', 'Havuz Başı · Gastronomi']
];
const lightbox = $('.lightbox');
let galleryIndex = 0;
let lastFocused = null;
const renderGallery = () => {
  const item = galleryItems[galleryIndex];
  $('#lightbox-image').src = item[0];
  $('#lightbox-image').alt = item[1];
  $('#lightbox-title').textContent = item[1];
  $('#lightbox-count').textContent = `${String(galleryIndex + 1).padStart(2, '0')} / ${String(galleryItems.length).padStart(2, '0')}`;
};
const openGallery = index => {
  lastFocused = document.activeElement;
  galleryIndex = index;
  renderGallery();
  lightbox.classList.add('open');
  lightbox.setAttribute('aria-hidden', 'false');
  document.body.classList.add('gallery-open');
  $('.lightbox-close').focus();
};
const closeGallery = () => {
  lightbox.classList.remove('open');
  lightbox.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('gallery-open');
  lastFocused?.focus();
};
const moveGallery = direction => {
  galleryIndex = (galleryIndex + direction + galleryItems.length) % galleryItems.length;
  renderGallery();
};
$$('.js-gallery').forEach(button => button.addEventListener('click', () => openGallery(Number(button.dataset.image))));
$$('[data-close-gallery]').forEach(element => element.addEventListener('click', closeGallery));
$('.gallery-prev').addEventListener('click', () => moveGallery(-1));
$('.gallery-next').addEventListener('click', () => moveGallery(1));
document.addEventListener('keydown', event => {
  if (!lightbox.classList.contains('open')) return;
  if (event.key === 'Escape') closeGallery();
  if (event.key === 'ArrowLeft') moveGallery(-1);
  if (event.key === 'ArrowRight') moveGallery(1);
});

$$('.js-book').forEach(button => button.addEventListener('click', () => $('#iletisim').scrollIntoView({ behavior: 'smooth' })));
$('.booking-form').addEventListener('submit', event => {
  event.preventDefault();
  const data = new FormData(event.currentTarget);
  const message = `Merhaba, ben ${data.get('name')}. ${data.get('interest')} için ${data.get('guests')} bilgi almak istiyorum. ${data.get('message') || ''}`;
  const link = `https://wa.me/905015365345?text=${encodeURIComponent(message)}`;
  $('.form-result').innerHTML = `Talebiniz hazırlandı. <a href="${link}" target="_blank" rel="noopener">WhatsApp üzerinden iletin →</a>`;
});
