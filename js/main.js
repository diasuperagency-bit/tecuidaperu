/* ==========================================================
   TeCuida · Landing — interacciones
   1) Configuración de WhatsApp y mensajes prellenados
   2) Palabra rotativa del H1 (bienestar → equilibrio → salud)
   3) Chat animado del hero
   4) Menú móvil, header, botón flotante
   5) Preguntas frecuentes (acordeón)
   6) Módulo "Arma tu mensaje"
   7) Reveal al hacer scroll
   8) Medición (dataLayer / Meta Pixel)
   ========================================================== */
(function () {
  'use strict';

  /* ---------- 1) CONFIGURACIÓN ---------- */
  // Reemplazar por el número real, con código de país y sin "+" ni espacios. Ej.: 51912345678
  var WHATSAPP_NUMBER = '51XXXXXXXXX';

  // Mensajes prellenados (sin términos vetados por las plataformas de anuncios)
  var MESSAGES = {
    default:   'Hola, quiero orientación médica con TeCuida.',
    dolor:     'Hola, quiero orientación sobre dolor y molestias.',
    estres:    'Hola, quiero orientación sobre estrés y tensión.',
    sueno:     'Hola, quiero orientación sobre descanso y sueño.',
    equilibrio:'Hola, quiero orientación sobre equilibrio físico.',
    empezar:   'Hola, quiero empezar mi consulta con TeCuida.',
    info:      'Hola, quiero más información sobre TeCuida.',
    duda:      'Hola, tengo una duda sobre la atención en TeCuida.'
  };

  function waLink(text) {
    return 'https://wa.me/' + WHATSAPP_NUMBER + '?text=' + encodeURIComponent(text);
  }

  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  // Enlaces de WhatsApp con mensaje por origen
  $$('[data-wa]').forEach(function (a) {
    a.href = waLink(MESSAGES[a.getAttribute('data-wa')] || MESSAGES.default);
    a.target = '_blank';
    a.rel = 'noopener';
  });

  /* ---------- 2) PALABRA ROTATIVA ---------- */
  var rot = $('#rot');
  if (rot && !reduce) {
    var words = $$('.rot__w', rot), i = 0;
    setInterval(function () {
      var cur = words[i];
      i = (i + 1) % words.length;
      var next = words[i];
      cur.classList.remove('is-on'); cur.classList.add('is-out');
      next.classList.remove('is-out'); next.classList.add('is-on');
      setTimeout(function () {
        cur.classList.remove('is-out');
        cur.style.transition = 'none';
        requestAnimationFrame(function () { cur.style.transition = ''; });
      }, 600);
    }, 2600);
  }

  /* ---------- 3) CHAT ANIMADO ---------- */
  var msgs = $$('#chatBody .msg'), typing = $('#typing');
  function showAll() { msgs.forEach(function (m) { m.classList.add('is-on'); }); }
  if (!reduce && msgs.length && typing) {
    var delays = [500, 1500, 1500, 1600]; // pausa antes de cada mensaje
    var k = 0;
    (function next() {
      if (k >= msgs.length) { typing.classList.remove('is-on'); return; }
      var isMe = msgs[k].classList.contains('msg--me');
      typing.classList.toggle('is-on', !isMe && k > 0);
      setTimeout(function () {
        typing.classList.remove('is-on');
        msgs[k].classList.add('is-on');
        // el indicador de escritura va siempre al final del chat
        typing.parentNode.appendChild(typing);
        k++;
        setTimeout(next, 350);
      }, delays[k] || 1200);
    })();
  } else { showAll(); }

  /* ---------- 4) MENÚ, HEADER, FLOTANTE ---------- */
  var burger = $('#burger'), nav = $('#nav'), header = $('.header'), fab = $('#fab');
  if (burger) {
    burger.addEventListener('click', function () {
      var open = nav.classList.toggle('is-open');
      burger.setAttribute('aria-expanded', open);
      burger.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
    });
    $$('a', nav).forEach(function (a) {
      a.addEventListener('click', function () {
        nav.classList.remove('is-open'); burger.setAttribute('aria-expanded', 'false');
      });
    });
  }
  function onScroll() {
    var y = window.scrollY || 0;
    header.classList.toggle('is-stuck', y > 8);
    fab.classList.toggle('is-on', y > 700);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- 5) ACORDEÓN ---------- */
  $$('.acc__b').forEach(function (b) {
    var item = b.closest('.acc__i');
    if (b.getAttribute('aria-expanded') === 'true') item.classList.add('is-open');
    b.addEventListener('click', function () {
      var wasOpen = b.getAttribute('aria-expanded') === 'true';
      $$('.acc__b').forEach(function (o) {   // una respuesta abierta a la vez
        o.setAttribute('aria-expanded', 'false');
        o.closest('.acc__i').classList.remove('is-open');
      });
      if (!wasOpen) {
        b.setAttribute('aria-expanded', 'true');
        item.classList.add('is-open');
        track('faq_open', { question: b.textContent.trim().slice(0, 80) });
      }
    });
  });

  /* ---------- 6) ARMA TU MENSAJE ---------- */
  var form = $('#builder'), preview = $('#preview'), send = $('#send');
  function build() {
    var v = function (n) { var c = $('input[name="' + n + '"]:checked', form); return c ? c.value : ''; };
    var text = 'Hola, quiero orientación sobre ' + v('need') + '. Prefiero atención ' + v('mode') + '. ' + v('rx') + ' indicación médica.';
    preview.textContent = text;
    send.href = waLink(text);
    send.target = '_blank'; send.rel = 'noopener';
    send.setAttribute('data-need', v('need'));
  }
  if (form) { form.addEventListener('change', build); build(); }

  /* ---------- 7) REVEAL ---------- */
  var rvs = $$('.rv');
  if ('IntersectionObserver' in window && !reduce) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    rvs.forEach(function (el, n) { el.style.transitionDelay = (n % 4) * 60 + 'ms'; io.observe(el); });
  } else { rvs.forEach(function (el) { el.classList.add('in'); }); }

  /* ---------- 8) MEDICIÓN ---------- */
  window.dataLayer = window.dataLayer || [];
  function track(event, data) {
    var payload = { event: event };
    for (var k in data) payload[k] = data[k];
    window.dataLayer.push(payload);
  }
  document.addEventListener('click', function (e) {
    var a = e.target.closest('a[data-section]');
    if (!a) return;
    var isWA = a.hasAttribute('data-wa') || a.id === 'send';
    if (isWA) {
      track('whatsapp_click', { section: a.getAttribute('data-section'), need: a.getAttribute('data-need') || a.getAttribute('data-wa') || '' });
      if (typeof window.fbq === 'function') window.fbq('track', 'Contact');
    }
  });

  var yr = $('#yr'); if (yr) yr.textContent = new Date().getFullYear();
  if (WHATSAPP_NUMBER.indexOf('X') > -1) console.warn('TeCuida: configura WHATSAPP_NUMBER en js/main.js');
})();
