(function () {
  'use strict';
  var C = window.SR || {};
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  // Mobile nav
  var btn = $('.menu-btn'), nav = $('#nav');
  if (btn && nav) btn.addEventListener('click', function () {
    var open = nav.classList.toggle('open');
    btn.setAttribute('aria-expanded', open);
  });

  // UTM / referrer capture (kept for the session, sent with every lead)
  try {
    var q = new URLSearchParams(location.search), utm = {};
    ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'gclid', 'fbclid'].forEach(function (k) { if (q.get(k)) utm[k] = q.get(k); });
    if (Object.keys(utm).length) sessionStorage.setItem('sr_utm', JSON.stringify(utm));
    if (!sessionStorage.getItem('sr_ref')) sessionStorage.setItem('sr_ref', document.referrer || 'direct');
  } catch (e) {}

  // Date inputs: no past dates
  $$('input[type=date]').forEach(function (i) { i.min = new Date().toISOString().slice(0, 10); });

  // Prefill project from ?project=
  try {
    var pp = new URLSearchParams(location.search).get('project');
    if (pp) $$('select[name=project]').forEach(function (s) {
      $$('option', s).forEach(function (o) { if (o.value === pp || o.textContent === pp) s.value = o.value; });
    });
  } catch (e) {}

  // Lead forms
  var LABELS = { enquiry: 'Enquiry', visit: 'Property visit request', sell: 'Seller callback request', property: 'Property details request', callback: 'Callback request' };
  $$('form[data-lead]').forEach(function (f) {
    f.addEventListener('submit', function (ev) {
      ev.preventDefault();
      var msg = $('.form-msg', f);
      if (!f.checkValidity()) { f.reportValidity(); return; }
      var fd = new FormData(f);
      if (fd.get('company')) return; // honeypot
      var data = {};
      fd.forEach(function (v, k) { if (k !== 'company' && v !== '') data[k] = v; });
      var phone = String(data.phone || '').replace(/[^\d+]/g, '');
      if (phone.replace(/\D/g, '').length < 10) { show(msg, 'err', 'Please enter a valid 10-digit phone number.'); return; }
      data.phone = phone;
      data.whatsapp_consent = !!fd.get('whatsapp_consent');
      data.form_type = f.dataset.lead;
      data.source = 'Website — sobharesales';
      data.page_url = location.href;
      data.page_title = document.title;
      data.submitted_at = new Date().toISOString();
      try { data.utm = JSON.parse(sessionStorage.getItem('sr_utm') || '{}'); data.referrer = sessionStorage.getItem('sr_ref'); } catch (e) {}

      var b = $('button[type=submit]', f); b.disabled = true;
      track(data.form_type);

      var done = function () {
        b.disabled = false; f.reset();
        show(msg, 'ok', 'Thank you, ' + (data.full_name || '').split(' ')[0] + '! Our team will contact you shortly to confirm the details.');
      };
      if (C.endpoint) {
        fetch(C.endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) })
          .then(function (r) { if (!r.ok) throw new Error(r.status); done(); })
          .catch(function () { b.disabled = false; toWhatsApp(data); show(msg, 'ok', 'Opening WhatsApp to send your request to our team…'); });
      } else {
        toWhatsApp(data); done();
      }
    });
  });

  function toWhatsApp(d) {
    var lines = ['*' + (LABELS[d.form_type] || 'Enquiry') + '* — Sobha Resales website', 'Name: ' + (d.full_name || '')];
    if (d.phone) lines.push('Phone: ' + d.phone);
    if (d.email) lines.push('Email: ' + d.email);
    if (d.project) lines.push('Project: ' + d.project);
    if (d.location) lines.push('Location: ' + d.location);
    if (d.interest) lines.push('Interested in: ' + d.interest);
    if (d.preferred_date) lines.push('Preferred date: ' + d.preferred_date + (d.preferred_time ? ' (' + d.preferred_time + ')' : ''));
    if (d.message) lines.push('Note: ' + d.message);
    var url = 'https://wa.me/' + C.wa + '?text=' + encodeURIComponent(lines.join('\n'));
    window.open(url, '_blank', 'noopener');
  }
  function show(el, cls, t) { if (!el) return; el.className = 'form-msg ' + cls; el.textContent = t; el.setAttribute('role', 'status'); }
  function track(type) {
    try {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({ event: 'generate_lead', form_type: type });
      if (window.gtag) window.gtag('event', 'generate_lead', { form_type: type });
    } catch (e) {}
  }
  // Track call / WhatsApp clicks as conversions
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[href^="tel:"],a[href*="wa.me"]');
    if (a && window.gtag) window.gtag('event', a.href.indexOf('tel:') === 0 ? 'click_call' : 'click_whatsapp');
  });

  // Finder (home + properties)
  $$('form[data-finder]').forEach(function (f) {
    f.addEventListener('submit', function (e) {
      e.preventDefault();
      var p = f.project.value, l = f.location.value;
      if (p) location.href = '/properties/' + p + '/';
      else if (l) location.href = '/locations/' + l + '/';
      else location.href = '/properties/';
    });
  });

  // Property chips filter
  var chips = $('[data-filter-chips]');
  if (chips) {
    var cards = $$('[data-area]');
    var apply = function (a) {
      $$('button', chips).forEach(function (b) { b.classList.toggle('on', b.dataset.v === a); b.setAttribute('aria-pressed', b.dataset.v === a); });
      cards.forEach(function (c) { c.hidden = a !== 'all' && c.dataset.area !== a; });
    };
    chips.addEventListener('click', function (e) { var b = e.target.closest('button'); if (b) apply(b.dataset.v); });
    var lq = new URLSearchParams(location.search).get('loc'); if (lq) apply(lq);
  }

  // FAQ tabs + search
  var tabs = $('[data-faq-tabs]');
  if (tabs) {
    var groups = $$('[data-faq-group]');
    tabs.addEventListener('click', function (e) {
      var b = e.target.closest('button'); if (!b) return;
      $$('button', tabs).forEach(function (x) { x.setAttribute('aria-selected', x === b); });
      groups.forEach(function (g) { g.hidden = b.dataset.v !== 'all' && g.dataset.faqGroup !== b.dataset.v; });
    });
    var s = $('#faq-search');
    if (s) s.addEventListener('input', function () {
      var t = s.value.trim().toLowerCase();
      groups.forEach(function (g) { g.hidden = false; });
      $$('button', tabs).forEach(function (x) { x.setAttribute('aria-selected', x.dataset.v === 'all'); });
      $$('details.acc', $('#faqs')).forEach(function (d) {
        var hit = !t || d.textContent.toLowerCase().indexOf(t) > -1;
        d.hidden = !hit; if (t && hit) d.open = true;
      });
    });
  }

  // Gallery filter + lightbox
  var gal = $('.gal');
  if (gal) {
    var figs = $$('figure', gal), cat = 'all', proj = '';
    var run = function () { figs.forEach(function (f) { f.hidden = (cat !== 'all' && f.dataset.cat !== cat); }); };
    var gt = $('[data-gal-tabs]');
    if (gt) gt.addEventListener('click', function (e) {
      var b = e.target.closest('button'); if (!b) return;
      cat = b.dataset.v; $$('button', gt).forEach(function (x) { x.setAttribute('aria-selected', x === b); }); run();
    });
    var gp = $('#gal-project');
    if (gp) gp.addEventListener('change', function () { if (gp.value) location.href = '/properties/' + gp.value + '/#gallery'; });
    var lb = $('.lb'), lbi = lb && $('img', lb);
    figs.forEach(function (f) {
      f.tabIndex = 0;
      var open = function () { var i = $('img', f); lbi.src = i.currentSrc || i.src; lbi.alt = i.alt; lb.classList.add('on'); $('button', lb).focus(); };
      f.addEventListener('click', open);
      f.addEventListener('keydown', function (e) { if (e.key === 'Enter') open(); });
    });
    if (lb) {
      var close = function () { lb.classList.remove('on'); };
      lb.addEventListener('click', function (e) { if (e.target !== lbi) close(); });
      document.addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); });
    }
  }
})();
