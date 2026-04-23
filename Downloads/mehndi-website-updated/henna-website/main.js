/* ===========================
   HENNA BY FIDA — MAIN JS
   Mobile-First, Enhanced
   =========================== */

// ===== HENNA LEAF SVGs =====

const leafSVGs = [
  `<svg viewBox="0 0 30 44" xmlns="http://www.w3.org/2000/svg" fill="none"><path d="M15 2 C15 2, 28 16, 28 28 C28 37, 22 42, 15 42 C8 42, 2 37, 2 28 C2 16, 15 2, 15 2Z" fill="rgba(45,106,79,0.4)" stroke="rgba(201,168,76,0.7)" stroke-width="1"/><path d="M15 8 C15 8 22 20 22 28 C22 33 19 38 15 38" stroke="rgba(201,168,76,0.5)" stroke-width="0.8" fill="none"/><path d="M15 14 L15 38" stroke="rgba(45,106,79,0.4)" stroke-width="0.6"/><path d="M15 18 Q19 22 22 28" stroke="rgba(45,106,79,0.3)" stroke-width="0.5" fill="none"/><path d="M15 18 Q11 22 8 28" stroke="rgba(45,106,79,0.3)" stroke-width="0.5" fill="none"/></svg>`,
  `<svg viewBox="0 0 22 50" xmlns="http://www.w3.org/2000/svg" fill="none"><path d="M11 2 C18 10, 20 22, 18 34 C16 44, 11 48, 11 48 C11 48, 6 44, 4 34 C2 22, 4 10, 11 2Z" fill="rgba(82,183,136,0.3)" stroke="rgba(201,168,76,0.6)" stroke-width="0.9"/><line x1="11" y1="6" x2="11" y2="46" stroke="rgba(45,106,79,0.5)" stroke-width="0.7"/><path d="M11 14 Q15 18 17 26" stroke="rgba(45,106,79,0.3)" stroke-width="0.5" fill="none"/><path d="M11 22 Q7 26 5 32" stroke="rgba(45,106,79,0.3)" stroke-width="0.5" fill="none"/></svg>`,
  `<svg viewBox="0 0 34 38" xmlns="http://www.w3.org/2000/svg" fill="none"><path d="M17 2 C24 6, 32 14, 30 24 C28 32, 22 36, 17 36 C12 36, 6 32, 4 24 C2 14, 10 6, 17 2Z" fill="rgba(26,60,46,0.35)" stroke="rgba(201,168,76,0.65)" stroke-width="1"/><line x1="17" y1="5" x2="17" y2="35" stroke="rgba(45,106,79,0.45)" stroke-width="0.8"/><path d="M17 10 Q24 16 28 22" stroke="rgba(201,168,76,0.3)" stroke-width="0.6" fill="none"/><path d="M17 10 Q10 16 6 22" stroke="rgba(201,168,76,0.3)" stroke-width="0.6" fill="none"/></svg>`,
  `<svg viewBox="0 0 20 32" xmlns="http://www.w3.org/2000/svg" fill="none"><path d="M10 2 C16 8, 18 18, 16 26 C14 30, 10 30, 10 30 C10 30, 6 30, 4 26 C2 18, 4 8, 10 2Z" fill="rgba(82,183,136,0.4)" stroke="rgba(201,168,76,0.6)" stroke-width="0.9"/><line x1="10" y1="4" x2="10" y2="28" stroke="rgba(26,60,46,0.4)" stroke-width="0.65"/></svg>`,
];

function createHennaLeaves(container, count) {
  for (let i = 0; i < count; i++) {
    const leaf = document.createElement('div');
    leaf.className = 'henna-leaf';
    leaf.innerHTML = leafSVGs[i % leafSVGs.length];
    leaf.setAttribute('aria-hidden', 'true');
    container.appendChild(leaf);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const leavesBg = document.querySelector('.henna-leaves-bg');
  if (leavesBg) {
    // Detect if mobile device
    const isMobile = window.innerWidth <= 768;
    const isSmallPhone = window.innerWidth <= 480;
    let count;
    
    if (leavesBg.classList.contains('home-leaves')) {
      count = isSmallPhone ? 4 : (isMobile ? 6 : 12);
    } else {
      count = isSmallPhone ? 2 : (isMobile ? 3 : 8);
    }
    
    createHennaLeaves(leavesBg, count);
    
    // Initialize leaves with random positions
    const leaves = leavesBg.querySelectorAll('.henna-leaf');
    const leafData = [];
    
    leaves.forEach((leaf, index) => {
      const randomLeft = Math.random() * 100;
      const randomTop = Math.random() * 150 - 50;
      const randomDelay = Math.random() * 2;
      const speed = 0.2 + Math.random() * 0.5;
      
      leafData.push({ speed, index });
      
      leaf.style.left = randomLeft + '%';
      leaf.style.top = randomTop + 'vh';
      leaf.style.setProperty('--speed', speed);
      leaf.style.animationDelay = randomDelay + 's';
    });
    
    // Optimize scroll animation with throttling
    let ticking = false;
    let lastScrollY = 0;
    
    const updateLeaves = () => {
      const scrollY = window.scrollY;
      const delta = Math.abs(scrollY - lastScrollY);
      
      // Only update if scroll delta is significant
      if (delta > 1 || lastScrollY === 0) {
        leaves.forEach((leaf, index) => {
          const speed = parseFloat(leaf.style.getPropertyValue('--speed')) || 0.3;
          const yOffset = scrollY * speed;
          const rotation = (scrollY + index * 30) * 0.08;
          const xWave = isSmallPhone 
            ? Math.sin((scrollY * 0.0005) + index) * 5
            : isMobile 
            ? Math.sin((scrollY * 0.001) + index) * 8
            : Math.sin((scrollY * 0.002) + index) * 15;
          
          leaf.style.transform = `translateX(${xWave}px) translateY(${yOffset}px) rotate(${rotation}deg)`;
        });
        lastScrollY = scrollY;
      }
      ticking = false;
    };
    
    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(updateLeaves);
        ticking = true;
      }
    }, { passive: true });
    
    // Handle window resize
    let resizeTimeout;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        const newIsMobile = window.innerWidth <= 768;
        if ((newIsMobile && !isMobile) || (!newIsMobile && isMobile)) {
          // Reload page on significant screen size change
          location.reload();
        }
      }, 250);
    }, { passive: true });
  }
});

// ===== NAVBAR =====

const navbar = document.getElementById('navbar');
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

window.addEventListener('scroll', () => {
  navbar && navbar.classList.toggle('scrolled', window.scrollY > 50);
}, { passive: true });

if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    const spans = navToggle.querySelectorAll('span');
    if (isOpen) {
      spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
      spans[1].style.opacity = '0';
      spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
      document.body.style.overflow = 'hidden';
    } else {
      spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
      document.body.style.overflow = '';
    }
  });

  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      navToggle.querySelectorAll('span').forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
      document.body.style.overflow = '';
    });
  });
}

// ===== GALLERY FILTER =====

const filterBtns = document.querySelectorAll('.filter-btn');
const galleryItems = document.querySelectorAll('.gallery-item');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;
    galleryItems.forEach(item => {
      item.classList.toggle('hidden', filter !== 'all' && item.dataset.category !== filter);
    });
  });
});

// ===== LIGHTBOX =====

const lightbox = document.getElementById('lightbox');
const lightboxClose = document.getElementById('lightboxClose');
const lightboxContent = document.getElementById('lightboxContent');

function openLightbox(imgSrc, imgAlt, label) {
  if (!lightbox || !lightboxContent) return;
  if (imgSrc && imgSrc.indexOf('undefined') === -1) {
    lightboxContent.innerHTML = `<img src="${imgSrc}" alt="${imgAlt || label || 'Henna Design'}" style="max-width:90vw;max-height:82vh;object-fit:contain;border-radius:12px;display:block;">`;
  } else {
    lightboxContent.innerHTML = `<div style="background:#1e2e25;width:min(300px,88vw);border-radius:14px;padding:2rem;display:flex;flex-direction:column;align-items:center;gap:1rem;"><svg viewBox="0 0 200 260" width="140" xmlns="http://www.w3.org/2000/svg"><circle cx="100" cy="110" r="55" fill="none" stroke="#c9a84c" stroke-width="0.8" opacity="0.5"/><circle cx="100" cy="110" r="40" fill="none" stroke="#c9a84c" stroke-width="0.6" opacity="0.4"/><circle cx="100" cy="110" r="6" fill="#c9a84c" opacity="0.55"/><g opacity="0.5" stroke="#c9a84c" stroke-width="0.9" fill="none"><path d="M100 55 Q112 80 100 105 Q88 80 100 55"/><path d="M100 55 Q112 80 100 105 Q88 80 100 55" transform="rotate(60,100,110)"/><path d="M100 55 Q112 80 100 105 Q88 80 100 55" transform="rotate(120,100,110)"/><path d="M100 55 Q112 80 100 105 Q88 80 100 55" transform="rotate(180,100,110)"/><path d="M100 55 Q112 80 100 105 Q88 80 100 55" transform="rotate(240,100,110)"/><path d="M100 55 Q112 80 100 105 Q88 80 100 55" transform="rotate(300,100,110)"/></g></svg><p style="color:#c9a84c;font-family:'Cormorant Garamond',serif;font-size:1rem;text-align:center;opacity:0.9;">${label || 'Henna Design'}</p><p style="color:rgba(255,255,255,0.3);font-size:0.7rem;font-family:'Jost',sans-serif;">Add your photo here</p></div>`;
  }
  lightbox.classList.add('active');
  document.body.style.overflow = 'hidden';
}

galleryItems.forEach(item => {
  item.addEventListener('click', () => {
    const img = item.querySelector('img.gallery-image');
    const label = item.querySelector('.gallery-overlay')?.textContent?.trim() || 'Henna Design';
    openLightbox(img?.src, img?.alt, label);
  });
});

document.querySelectorAll('.gp-item').forEach(item => {
  item.style.cursor = 'pointer';
  item.addEventListener('click', () => {
    const img = item.querySelector('img');
    if (img) openLightbox(img.src, img.alt, img.alt || 'Henna Design');
  });
});

if (lightboxClose) {
  lightboxClose.addEventListener('click', () => {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  });
}
if (lightbox) {
  lightbox.addEventListener('click', e => {
    if (e.target === lightbox) { lightbox.classList.remove('active'); document.body.style.overflow = ''; }
  });
}

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    lightbox?.classList.remove('active');
    document.getElementById('orderModal')?.classList.remove('active');
    document.body.style.overflow = '';
  }
});

// ===== BOOKING FORM → WHATSAPP =====

const bookingForm = document.getElementById('bookingForm');

if (bookingForm) {
  bookingForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const name    = document.getElementById('name')?.value.trim();
    const phone   = document.getElementById('phone')?.value.trim();
    const address = document.getElementById('address')?.value.trim();
    const date    = document.getElementById('date')?.value;
    const time    = document.getElementById('time')?.value;
    const service = document.getElementById('service')?.value;
    const people  = document.getElementById('people')?.value;
    const notes   = document.getElementById('notes')?.value.trim();

    if (!name || !phone || !address || !date || !time || !service || !people) {
      showFormError('Please fill in all required fields before proceeding.');
      return;
    }
    if (phone.replace(/\D/g,'').length < 10) {
      showFormError('Please enter a valid phone number (at least 10 digits).');
      return;
    }

    const dateObj = new Date(date + 'T12:00:00');
    const formattedDate = dateObj.toLocaleDateString('en-IN', { weekday:'long', year:'numeric', month:'long', day:'numeric' });

    const message =
      `🌿 *APPOINTMENT REQUEST — Henna by Fida*\n\n` +
      `👤 *Name:* ${name}\n📱 *Phone:* ${phone}\n📍 *Location:* ${address}\n\n` +
      `📅 *Date:* ${formattedDate}\n🕐 *Time:* ${time}\n💅 *Service:* ${service}\n👥 *No. of People:* ${people}\n` +
      (notes ? `\n📝 *Notes:* ${notes}\n` : '') +
      `\nPlease confirm my appointment. Thank you! 🙏`;

    const waNumber = '919999999999';
    window.open(`https://wa.me/${waNumber}?text=${encodeURIComponent(message)}`, '_blank');
  });
}

function showFormError(msg) {
  document.querySelector('.form-error-msg')?.remove();
  const err = document.createElement('div');
  err.className = 'form-error-msg';
  Object.assign(err.style, { background:'#fff3f3', border:'1px solid #e57373', color:'#c62828', padding:'0.85rem 1rem', borderRadius:'8px', fontSize:'0.83rem', marginTop:'-0.2rem', lineHeight:'1.5' });
  err.textContent = msg;
  const form = document.getElementById('bookingForm');
  const btn = form?.querySelector('button[type="submit"]');
  if (btn) form.insertBefore(err, btn);
  setTimeout(() => err.remove(), 5000);
}

const dateInput = document.getElementById('date');
if (dateInput) {
  const t = new Date();
  t.setDate(t.getDate() + 1);
  dateInput.min = `${t.getFullYear()}-${String(t.getMonth()+1).padStart(2,'0')}-${String(t.getDate()).padStart(2,'0')}`;
}

// ===== SCROLL REVEAL =====

const revealEls = document.querySelectorAll('.service-card, .product-card, .gp-item, .why-img-box, .sidebar-card, .trust-badge, .step, .gallery-item');
const revealObs = new IntersectionObserver((entries) => {
  entries.forEach((entry, idx) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), idx * 55);
      revealObs.unobserve(entry.target);
    }
  });
}, { threshold: 0.06, rootMargin: '0px 0px -20px 0px' });

revealEls.forEach(el => {
  el.classList.add('reveal');
  revealObs.observe(el);
});

// ===== SHOP ORDER MODAL =====

let currentProduct = '';

window.orderProduct = function(name, price) {
  currentProduct = `${name} (${price})`;
  const el = document.getElementById('modalProductName');
  if (el) el.textContent = `Ordering: ${name} — ${price}`;
  const modal = document.getElementById('orderModal');
  if (modal) { modal.classList.add('active'); document.body.style.overflow = 'hidden'; }
};

const modalClose = document.getElementById('modalClose');
const orderModal = document.getElementById('orderModal');
if (modalClose) modalClose.addEventListener('click', () => { orderModal?.classList.remove('active'); document.body.style.overflow = ''; });
if (orderModal) orderModal.addEventListener('click', e => { if (e.target === orderModal) { orderModal.classList.remove('active'); document.body.style.overflow = ''; } });

const orderForm = document.getElementById('orderForm');
if (orderForm) {
  orderForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const name    = document.getElementById('oName')?.value.trim();
    const phone   = document.getElementById('oPhone')?.value.trim();
    const address = document.getElementById('oAddress')?.value.trim();
    const qty     = document.getElementById('oQty')?.value || '1';
    const payment = document.getElementById('oPayment')?.value || 'Cash on Delivery';

    if (!name || !phone || !address) { alert('Please fill name, phone and address.'); return; }

    const msg =
      `🛒 *NEW ORDER — Henna by Fida*\n\n` +
      `📦 *Product:* ${currentProduct}\n🔢 *Quantity:* ${qty}\n💳 *Payment:* ${payment}\n\n` +
      `👤 *Name:* ${name}\n📱 *Phone:* ${phone}\n🏠 *Address:* ${address}\n\nPlease confirm my order. Thank you! 🙏`;

    const waNumber = '919999999999';
    window.open(`https://wa.me/${waNumber}?text=${encodeURIComponent(msg)}`, '_blank');
    orderModal?.classList.remove('active');
    document.body.style.overflow = '';
  });
}
