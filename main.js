/* ===========================
   MEHNDI BY NOOR — MAIN JS
   =========================== */

// ===== NAVBAR =====

const navbar = document.getElementById('navbar');
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});

if (navToggle) {
  navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    // Animate hamburger to X
    const spans = navToggle.querySelectorAll('span');
    const isOpen = navLinks.classList.contains('open');
    if (isOpen) {
      spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
      spans[1].style.opacity = '0';
      spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
    } else {
      spans[0].style.transform = '';
      spans[1].style.opacity = '';
      spans[2].style.transform = '';
    }
  });

  // Close nav on link click
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      const spans = navToggle.querySelectorAll('span');
      spans[0].style.transform = '';
      spans[1].style.opacity = '';
      spans[2].style.transform = '';
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
      if (filter === 'all' || item.dataset.category === filter) {
        item.classList.remove('hidden');
      } else {
        item.classList.add('hidden');
      }
    });
  });
});

// ===== LIGHTBOX (Gallery) =====

const lightbox = document.getElementById('lightbox');
const lightboxClose = document.getElementById('lightboxClose');
const lightboxContent = document.getElementById('lightboxContent');

galleryItems.forEach(item => {
  item.addEventListener('click', () => {
    const label = item.querySelector('.gallery-overlay')?.textContent || 'Henna Design';
    lightboxContent.innerHTML = `
      <div style="background:#1e1e1e;width:360px;height:480px;border-radius:12px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px;">
        <svg viewBox="0 0 300 400" width="180" xmlns="http://www.w3.org/2000/svg">
          <circle cx="150" cy="160" r="60" fill="none" stroke="#c9a84c" stroke-width="1" opacity="0.6"/>
          <circle cx="150" cy="160" r="45" fill="none" stroke="#c9a84c" stroke-width="0.8" opacity="0.5"/>
          <circle cx="150" cy="160" r="8" fill="#c9a84c" opacity="0.6"/>
          <g opacity="0.55" stroke="#c9a84c" stroke-width="1" fill="none">
            <path d="M150 100 Q165 130 150 155 Q135 130 150 100"/>
            <path d="M150 100 Q165 130 150 155 Q135 130 150 100" transform="rotate(45,150,160)"/>
            <path d="M150 100 Q165 130 150 155 Q135 130 150 100" transform="rotate(90,150,160)"/>
            <path d="M150 100 Q165 130 150 155 Q135 130 150 100" transform="rotate(135,150,160)"/>
            <path d="M150 100 Q165 130 150 155 Q135 130 150 100" transform="rotate(180,150,160)"/>
            <path d="M150 100 Q165 130 150 155 Q135 130 150 100" transform="rotate(225,150,160)"/>
            <path d="M150 100 Q165 130 150 155 Q135 130 150 100" transform="rotate(270,150,160)"/>
            <path d="M150 100 Q165 130 150 155 Q135 130 150 100" transform="rotate(315,150,160)"/>
          </g>
        </svg>
        <p style="color:#c9a84c;font-family:'Cormorant Garamond',serif;font-size:1rem;opacity:0.8;">Add Your Real Photo Here</p>
        <p style="color:rgba(255,255,255,0.4);font-size:0.78rem;font-family:'Jost',sans-serif;">${label}</p>
      </div>
    `;
    lightbox.classList.add('active');
  });
});

if (lightboxClose) {
  lightboxClose.addEventListener('click', () => lightbox.classList.remove('active'));
}

if (lightbox) {
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) lightbox.classList.remove('active');
  });
}

// ===== BOOKING FORM → WHATSAPP =====

const bookingForm = document.getElementById('bookingForm');

if (bookingForm) {
  bookingForm.addEventListener('submit', function(e) {
    e.preventDefault();

    const name = document.getElementById('name').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const address = document.getElementById('address').value.trim();
    const date = document.getElementById('date').value;
    const time = document.getElementById('time').value;
    const service = document.getElementById('service').value;
    const people = document.getElementById('people').value;
    const notes = document.getElementById('notes').value.trim();

    // Basic validation
    if (!name || !phone || !address || !date || !time || !service || !people) {
      showFormError('Please fill in all required fields before proceeding.');
      return;
    }

    // Format date nicely
    const dateObj = new Date(date + 'T12:00:00');
    const formattedDate = dateObj.toLocaleDateString('en-IN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    // Build WhatsApp message
    const message =
      `🌿 *APPOINTMENT REQUEST — Henna by Fida*\n\n` +
      `👤 *Name:* ${name}\n` +
      `📱 *Phone:* ${phone}\n` +
      `📍 *Location:* ${address}\n\n` +
      `📅 *Date:* ${formattedDate}\n` +
      `🕐 *Time:* ${time}\n` +
      `💅 *Service:* ${service}\n` +
      `👥 *Number of People:* ${people}\n` +
      (notes ? `\n📝 *Notes:* ${notes}\n` : '') +
      `\nPlease confirm my appointment. Thank you! 🙏`;

    const waNumber = '919999999999'; // CHANGE THIS to client's actual WhatsApp number
    const waURL = `https://wa.me/${waNumber}?text=${encodeURIComponent(message)}`;

    // Open WhatsApp
    window.open(waURL, '_blank');
  });
}

function showFormError(msg) {
  let existing = document.querySelector('.form-error-msg');
  if (existing) existing.remove();

  const err = document.createElement('div');
  err.className = 'form-error-msg';
  err.style.cssText = 'background:#fff3f3;border:1px solid #e57373;color:#c62828;padding:0.875rem 1.25rem;border-radius:8px;font-size:0.875rem;margin-top:-0.5rem;';
  err.textContent = msg;

  const form = document.getElementById('bookingForm');
  form.insertBefore(err, form.querySelector('button[type="submit"]'));

  setTimeout(() => err.remove(), 5000);
}

// ===== SCROLL REVEAL ANIMATION =====

const reveals = document.querySelectorAll('.service-card, .product-card, .gp-item, .why-img-box');

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }, i * 80);
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

reveals.forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(20px)';
  el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
  observer.observe(el);
});

// ===== SET MIN DATE for booking form =====

const dateInput = document.getElementById('date');
if (dateInput) {
  const today = new Date();
  today.setDate(today.getDate() + 1); // Minimum tomorrow
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const dd = String(today.getDate()).padStart(2, '0');
  dateInput.min = `${yyyy}-${mm}-${dd}`;
}
