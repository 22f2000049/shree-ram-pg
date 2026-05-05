/* ============================================================
   SHREE RAM PG & HOSPITALITY — main.js
   Shared interactivity for all pages
   ============================================================ */

document.addEventListener('DOMContentLoaded', function () {

  /* ── 1. NAVBAR SCROLL EFFECT ─────────────────────────────── */
  const navbar = document.getElementById('mainNavbar');
  function handleNavScroll() {
    if (!navbar) return;
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }
  window.addEventListener('scroll', handleNavScroll, { passive: true });
  handleNavScroll();

  /* ── 2. SMOOTH SCROLL FOR ANCHOR LINKS ───────────────────── */
  document.querySelectorAll('a[href*="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      // Only handle same-page anchors
      if (href.startsWith('#') || href.includes(window.location.pathname.split('/').pop() + '#')) {
        const hash = '#' + href.split('#')[1];
        const target = document.querySelector(hash);
        if (target) {
          e.preventDefault();
          const offset = 80;
          const top = target.getBoundingClientRect().top + window.scrollY - offset;
          window.scrollTo({ top, behavior: 'smooth' });
        }
      }
    });
  });

  /* ── 3. SCROLL-TO-TOP BUTTON ─────────────────────────────── */
  const scrollBtn = document.getElementById('scrollToTop');
  if (scrollBtn) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 400) {
        scrollBtn.classList.add('visible');
      } else {
        scrollBtn.classList.remove('visible');
      }
    }, { passive: true });

    scrollBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ── 4. FADE-UP SCROLL ANIMATIONS ───────────────────────── */
  const fadeEls = document.querySelectorAll('.fade-up');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    fadeEls.forEach(el => observer.observe(el));
  } else {
    fadeEls.forEach(el => el.classList.add('visible'));
  }

  /* ── 5. COUNTER ANIMATION ───────────────────────────────── */
  function animateCounter(el, target, duration = 1800) {
    let start = 0;
    const step = Math.ceil(target / (duration / 16));
    const timer = setInterval(() => {
      start += step;
      if (start >= target) {
        start = target;
        clearInterval(timer);
      }
      el.textContent = start + (el.dataset.suffix || '');
    }, 16);
  }

  const counters = document.querySelectorAll('[data-target]');
  if (counters.length && 'IntersectionObserver' in window) {
    const cObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target, parseInt(entry.target.dataset.target));
          cObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    counters.forEach(c => cObserver.observe(c));
  }

  /* ── 6. NAVBAR ACTIVE LINK ───────────────────────────────── */
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.navbar-main .nav-link').forEach(link => {
    const linkPage = link.getAttribute('href').split('/').pop();
    if (linkPage === currentPage) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });

  /* ── 7. INQUIRY FORM SUBMIT (mock) ──────────────────────── */
  const inquiryForm = document.getElementById('inquiryForm');
  if (inquiryForm) {
    inquiryForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const btn = inquiryForm.querySelector('[type="submit"]');
      const original = btn.innerHTML;
      btn.innerHTML = '<i class="bi bi-hourglass-split me-2"></i>Sending…';
      btn.disabled = true;

      setTimeout(() => {
        btn.innerHTML = '<i class="bi bi-check-circle-fill me-2"></i>Sent! We\'ll call you soon.';
        btn.style.background = 'linear-gradient(135deg,#22c55e,#16a34a)';
        setTimeout(() => {
          btn.innerHTML = original;
          btn.style.background = '';
          btn.disabled = false;
          inquiryForm.reset();
        }, 3500);
      }, 1800);
    });
  }

  /* ── 8. STICKY HEADER HIDE ON MOBILE SCROLL DOWN ─────────── */
  let lastScrollY = window.scrollY;
  window.addEventListener('scroll', () => {
    if (!navbar) return;
    const current = window.scrollY;
    if (current > lastScrollY && current > 200) {
      navbar.style.transform = 'translateY(-100%)';
    } else {
      navbar.style.transform = 'translateY(0)';
    }
    lastScrollY = current;
  }, { passive: true });
  if (navbar) navbar.style.transition = 'transform 0.4s ease, background 0.4s ease, box-shadow 0.4s ease';

  /* ── 9. ROOM FILTER (pg-rooms page) ─────────────────────── */
  const filterBtns = document.querySelectorAll('[data-filter]');
  if (filterBtns.length) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', function () {
        filterBtns.forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        const filter = this.dataset.filter;
        document.querySelectorAll('[data-wing]').forEach(card => {
          if (filter === 'all' || card.dataset.wing === filter) {
            card.closest('.room-col').style.display = '';
            setTimeout(() => card.closest('.room-col').style.opacity = '1', 10);
          } else {
            card.closest('.room-col').style.opacity = '0';
            setTimeout(() => card.closest('.room-col').style.display = 'none', 300);
          }
        });
      });
    });
  }

  /* ── 10. MODAL TRIGGER FROM CTA BUTTONS ─────────────────── */
  document.querySelectorAll('[data-open-inquiry]').forEach(btn => {
    btn.addEventListener('click', () => {
      const modal = document.getElementById('inquiryModal');
      if (modal) {
        new bootstrap.Modal(modal).show();
      }
    });
  });

});