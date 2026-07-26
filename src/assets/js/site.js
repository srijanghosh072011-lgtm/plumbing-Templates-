/**
 * Site behaviour. ~4KB, no dependencies, no inline handlers anywhere so the CSP
 * can stay `script-src 'self'` with no unsafe-inline.
 *
 * Everything here degrades: with JS off you still get a fully readable page,
 * working nav links (the sheet is CSS-driven off a data attribute), native
 * <details> FAQs, and a form that posts normally.
 */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ------------------------------------------------------------------ reveal */
  // IntersectionObserver, never a scroll listener — a scroll handler forces
  // continuous reflow and is the fastest way to wreck INP on mid-range Android.
  function initReveal() {
    var targets = document.querySelectorAll('[data-reveal]');
    if (!targets.length) return;

    if (reduceMotion || !('IntersectionObserver' in window)) {
      targets.forEach(function (el) { el.classList.add('is-revealed'); });
      return;
    }

    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          var el = entry.target;
          var delay = parseInt(el.getAttribute('data-reveal-delay') || '0', 10);
          setTimeout(function () { el.classList.add('is-revealed'); }, delay);
          io.unobserve(el);
        });
      },
      { rootMargin: '0px 0px -12% 0px', threshold: 0.08 }
    );

    targets.forEach(function (el) { io.observe(el); });
  }

  /* -------------------------------------------------------------- stat count */
  function initCounters() {
    var els = document.querySelectorAll('[data-count-to]');
    if (!els.length) return;

    if (reduceMotion || !('IntersectionObserver' in window)) {
      els.forEach(function (el) { el.textContent = el.getAttribute('data-count-to'); });
      return;
    }

    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          var el = entry.target;
          io.unobserve(el);

          var target = parseFloat(el.getAttribute('data-count-to'));
          var decimals = (el.getAttribute('data-count-to').split('.')[1] || '').length;
          var start = performance.now();
          var DURATION = 1600;

          function frame(now) {
            var t = Math.min((now - start) / DURATION, 1);
            // easeOutExpo — matches the CSS motion language
            var eased = t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
            el.textContent = (target * eased).toFixed(decimals);
            if (t < 1) requestAnimationFrame(frame);
            else el.textContent = target.toFixed(decimals);
          }
          requestAnimationFrame(frame);
        });
      },
      { threshold: 0.5 }
    );

    els.forEach(function (el) { io.observe(el); });
  }

  /* -------------------------------------------------------------------- menu */
  function initMenu() {
    var toggle = document.querySelector('[data-menu-toggle]');
    var sheet = document.querySelector('[data-menu-sheet]');
    if (!toggle || !sheet) return;

    var lastFocused = null;

    function focusables() {
      return Array.prototype.slice.call(
        sheet.querySelectorAll('a[href], button:not([disabled])')
      );
    }

    function setOpen(open) {
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Close navigation menu' : 'Open navigation menu');
      sheet.setAttribute('data-open', String(open));
      sheet.setAttribute('aria-hidden', String(!open));
      document.documentElement.style.overflow = open ? 'hidden' : '';

      if (open) {
        lastFocused = document.activeElement;
        // The sheet is visibility:hidden until the attribute flip is applied,
        // and a hidden element cannot take focus. Reading offsetWidth forces a
        // synchronous style flush so the first link is focusable right now —
        // rAF would also work but leaves a frame where focus sits on <body>.
        void sheet.offsetWidth;
        var f = focusables();
        if (f.length) f[0].focus();
      } else if (lastFocused) {
        lastFocused.focus();
      }
    }

    toggle.addEventListener('click', function () {
      setOpen(toggle.getAttribute('aria-expanded') !== 'true');
    });

    // Close on navigation so the sheet never survives a same-page anchor jump
    sheet.addEventListener('click', function (e) {
      if (e.target.closest('a')) setOpen(false);
    });

    document.addEventListener('keydown', function (e) {
      if (toggle.getAttribute('aria-expanded') !== 'true') return;

      if (e.key === 'Escape') {
        setOpen(false);
        return;
      }
      // Trap focus inside the open sheet — WCAG 2.4.3 / 2.1.2
      if (e.key === 'Tab') {
        var f = focusables();
        if (!f.length) return;
        var first = f[0];
        var last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    });

    // Reset when crossing to desktop so a sheet left open cannot lock scroll
    window.matchMedia('(min-width: 1024px)').addEventListener('change', function (e) {
      if (e.matches && toggle.getAttribute('aria-expanded') === 'true') setOpen(false);
    });
  }

  /* ---------------------------------------------------------- rail controls */
  function initRails() {
    document.querySelectorAll('[data-rail]').forEach(function (rail) {
      var group = rail.closest('[data-rail-group]');
      if (!group) return;
      group.querySelectorAll('[data-rail-prev],[data-rail-next]').forEach(function (btn) {
        btn.addEventListener('click', function () {
          var dir = btn.hasAttribute('data-rail-next') ? 1 : -1;
          var card = rail.firstElementChild;
          var step = card ? card.getBoundingClientRect().width + 24 : rail.clientWidth * 0.8;
          rail.scrollBy({ left: dir * step, behavior: reduceMotion ? 'auto' : 'smooth' });
        });
      });
    });
  }

  /* ------------------------------------------------------------- conversions */
  // GA4 key events for a lead-gen trades site. Enhanced measurement does NOT
  // auto-track tel: clicks, and phone calls are the majority of conversions here,
  // so the trigger is wired explicitly. No-ops cleanly when no tag is installed.
  function initTracking() {
    document.addEventListener('click', function (e) {
      var el = e.target.closest('[data-track]');
      if (!el) return;
      var name = el.getAttribute('data-track');
      var payload = {
        link_location: el.getAttribute('data-location') || 'unknown',
        link_url: el.getAttribute('href') || '',
      };
      if (typeof window.gtag === 'function') window.gtag('event', name, payload);
      if (Array.isArray(window.dataLayer)) window.dataLayer.push(Object.assign({ event: name }, payload));
    });
  }

  /* ------------------------------------------------------------------- forms */
  function initForms() {
    document.querySelectorAll('form[data-form]').forEach(function (form) {
      var status = form.querySelector('[data-form-status]');
      var submit = form.querySelector('button[type="submit"]');

      form.addEventListener('submit', function (e) {
        // Honeypot: a real user never fills a field they cannot see.
        var trap = form.querySelector('[name="company_website"]');
        if (trap && trap.value !== '') {
          e.preventDefault();
          return;
        }

        // Timing check: sub-3-second submissions are almost always scripted.
        var started = parseInt(form.getAttribute('data-started') || '0', 10);
        if (started && Date.now() - started < 3000) {
          e.preventDefault();
          if (status) {
            status.textContent = 'Please take a moment to review your details, then submit again.';
            status.setAttribute('data-state', 'error');
          }
          return;
        }

        if (!form.checkValidity()) return; // let the browser report it natively

        if (submit) {
          submit.setAttribute('aria-busy', 'true');
          submit.disabled = true;
          var label = submit.querySelector('[data-label]');
          if (label) label.textContent = 'Sending…';
        }
        if (status) {
          status.textContent = 'Sending your request…';
          status.setAttribute('data-state', 'pending');
        }
      });

      form.setAttribute('data-started', String(Date.now()));
    });
  }

  /* -------------------------------------------------------------------- boot */
  function boot() {
    initReveal();
    initCounters();
    initMenu();
    initRails();
    initTracking();
    initForms();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
