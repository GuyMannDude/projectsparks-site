/* Project Sparks — shared page script.
   1. Copy box: the "grab the stick" sentence with a fill-in blank, a Copy button and
      example chips (markup in assets/sparks.css under "copy box").
   2. Cursor comet: a small particle trail behind the pointer. Off for touch screens
      and for anyone who asked the OS for reduced motion. */

/* ---- 1. copy box ---- */
(function () {
  var boxes = document.querySelectorAll('.copy-box');
  if (!boxes.length) return;
  boxes.forEach(function (box) {
    var line = box.querySelector('.copy-line');
    var blank = box.querySelector('.copy-blank');
    var btn = box.querySelector('.copy-btn');
    var chips = box.parentNode.querySelectorAll('.copy-chips span');
    if (!line || !btn) return;
    var original = btn.textContent;
    function text() {
      // the sentence as a person would read it, with the blank filled in
      var clone = line.cloneNode(true);
      var input = clone.querySelector('.copy-blank');
      if (input) input.replaceWith(document.createTextNode(blank.value.trim() || blank.placeholder || ''));
      return clone.textContent.replace(/\s+/g, ' ').trim();
    }
    function done(ok) {
      btn.textContent = ok ? 'Copied. Now paste it to your AI.' : 'Select the sentence and copy it.';
      setTimeout(function () { btn.textContent = original; }, 4000);
    }
    btn.addEventListener('click', function () {
      var t = text();
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(t).then(function () { done(true); }, function () { done(false); });
      } else {
        var ta = document.createElement('textarea');
        ta.value = t; ta.setAttribute('readonly', ''); ta.style.position = 'fixed'; ta.style.left = '-9999px';
        document.body.appendChild(ta); ta.select();
        var ok = false; try { ok = document.execCommand('copy'); } catch (e) {}
        document.body.removeChild(ta); done(ok);
      }
    });
    chips.forEach(function (chip) {
      chip.setAttribute('role', 'button'); chip.setAttribute('tabindex', '0');
      function pick() { if (blank) { blank.value = chip.textContent; blank.focus(); } }
      chip.addEventListener('click', pick);
      chip.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); pick(); } });
    });
  });
})();

/* ---- 2. cursor comet ---- */
(function () {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (window.matchMedia('(hover: none)').matches) return; // touch devices

  var canvas = document.createElement('canvas');
  canvas.id = 'spark-swirl';
  document.body.appendChild(canvas);
  var ctx = canvas.getContext('2d');

  var dpr = Math.min(window.devicePixelRatio || 1, 2);
  function resize() {
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    canvas.style.width = window.innerWidth + 'px';
    canvas.style.height = window.innerHeight + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  resize();
  window.addEventListener('resize', resize);

  // Night Flag palette: white, two blues, one red
  var COLORS = [
    [245, 247, 250],  // white ink
    [143, 163, 245],  // soft blue
    [67, 94, 206],    // blue
    [143, 163, 245],
    [200, 50, 62],    // red, rarely
    [245, 247, 250]
  ];

  var MAX = 130;
  var particles = [];
  var mouse = { x: -1000, y: -1000 };
  var vel = { x: 0, y: 0 };  // smoothed cursor velocity — the comet's axis
  var emit = 0;

  window.addEventListener('mousemove', function (e) {
    if (mouse.x > -500) {
      var dx = e.clientX - mouse.x, dy = e.clientY - mouse.y;
      vel.x = vel.x * 0.6 + dx * 0.4;
      vel.y = vel.y * 0.6 + dy * 0.4;
      // faster sweep = denser tail
      emit = Math.min(emit + Math.max(1, Math.sqrt(dx * dx + dy * dy) / 4), 9);
    }
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  }, { passive: true });

  function spawn() {
    if (particles.length >= MAX) return;
    var c = COLORS[(Math.random() * COLORS.length) | 0];
    var sp = Math.sqrt(vel.x * vel.x + vel.y * vel.y) || 1;
    var nx = vel.x / sp, ny = vel.y / sp;   // travel direction
    var px = -ny, py = nx;                  // perpendicular scatter axis
    var scatter = (Math.random() - 0.5) * (1.4 + sp * 0.05);
    var back = 0.6 + Math.random() * 1.8;   // how hard it falls behind the nucleus
    particles.push({
      x: mouse.x + px * scatter * 2,
      y: mouse.y + py * scatter * 2,
      vx: -nx * back * (1 + sp * 0.10) + px * scatter,
      vy: -ny * back * (1 + sp * 0.10) + py * scatter,
      life: 1,
      decay: 0.02 + Math.random() * 0.025,
      w: 0.9 + Math.random() * 1.3,
      col: c
    });
  }

  function frame() {
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

    while (emit >= 1) { spawn(); emit -= 1; }

    for (var i = particles.length - 1; i >= 0; i--) {
      var p = particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vx *= 0.93;
      p.vy *= 0.93;
      p.life -= p.decay;
      if (p.life <= 0) { particles.splice(i, 1); continue; }

      // streak stretched along its own motion: long near the nucleus,
      // shrinking to an ember as it slows and dies
      var k = 2.6 * p.life + 0.4;

      ctx.strokeStyle = 'rgba(' + p.col[0] + ',' + p.col[1] + ',' + p.col[2] + ',' + (0.55 * p.life * p.life).toFixed(3) + ')';
      ctx.lineWidth = p.w * p.life;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(p.x, p.y);
      ctx.lineTo(p.x - p.vx * k, p.y - p.vy * k);
      ctx.stroke();
    }

    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
})();

/* --- Donate float: bottom-left, opposite the chat bubble. Night Flag colours. --- */
(function () {
  var PAYPAL = 'https://www.paypal.com/donate/?business=RHYJXYA2B877E&no_recurring=0&item_name=Support+Mnemo+Cortex+%E2%80%94+open-source+AI+memory%2C+funded+entirely+by+donations.&currency_code=USD';
  var style = document.createElement('style');
  style.textContent = [
    '#sparks-donate-bubble{position:fixed;bottom:24px;left:16px;z-index:99999;',
    'height:48px;padding:0 18px;border-radius:999px;cursor:pointer;',
    'background:#435ECE;color:#fff;border:1px solid rgba(255,255,255,.65);',
    'font-family:"Public Sans",-apple-system,BlinkMacSystemFont,sans-serif;',
    'font-size:15px;font-weight:600;white-space:nowrap;',
    'display:flex;align-items:center;justify-content:center;gap:8px;',
    'box-shadow:0 6px 24px rgba(0,0,0,.5),inset 0 1px 0 rgba(255,255,255,.25);',
    'transition:transform .2s,box-shadow .2s;}',
    '#sparks-donate-bubble:hover{transform:translateY(-2px);box-shadow:0 10px 30px rgba(0,0,0,.6),inset 0 1px 0 rgba(255,255,255,.25);}',
    '#sparks-donate-card{position:fixed;bottom:84px;left:16px;z-index:99998;',
    'width:320px;max-width:calc(100vw - 32px);background:linear-gradient(180deg,#151C2C,#0F1420);',
    'border:1px solid rgba(255,255,255,.14);border-radius:18px;padding:18px;display:none;',
    'box-shadow:0 18px 50px rgba(0,0,0,.55),inset 0 1px 0 rgba(255,255,255,.08);',
    'font-family:"Public Sans",-apple-system,BlinkMacSystemFont,sans-serif;color:#F5F7FA;}',
    '#sparks-donate-card.open{display:block;}',
    '#sparks-donate-card h3{margin:0 0 8px;color:#F5F7FA;font-family:"Bricolage Grotesque","Public Sans",sans-serif;font-size:18px;font-weight:700;}',
    '#sparks-donate-card p{margin:0 0 14px;color:#B9C6D6;font-size:14px;line-height:1.55;}',
    '.sparks-donate-btn{display:block;text-align:center;margin-top:8px;padding:10px 12px;',
    'border-radius:10px;font-size:14px;font-weight:600;text-decoration:none;',
    'border:1px solid rgba(255,255,255,.18);color:#F5F7FA;}',
    '.sparks-donate-btn:hover{background:rgba(255,255,255,.07);color:#fff;}',
    '.sparks-donate-btn--primary{background:#C8323E;color:#fff;border-color:transparent;box-shadow:0 8px 24px rgba(200,50,62,.28);}',
    '.sparks-donate-btn--primary:hover{background:#D63A47;}'
  ].join('');
  document.head.appendChild(style);

  var bubble = document.createElement('button');
  bubble.id = 'sparks-donate-bubble';
  bubble.setAttribute('aria-label', 'Open the tip jar');
  bubble.setAttribute('aria-expanded', 'false');
  bubble.textContent = '\u2665 Tip jar';

  var card = document.createElement('div');
  card.id = 'sparks-donate-card';
  card.innerHTML =
    '<h3>The tip jar is the funding round</h3>' +
    '<p>No investors, no ads, no premium tier. Every dollar in the jar comes from someone whose AI finally remembered them. ' +
    'It all goes to keeping AI memory free and open source.</p>' +
    '<a class="sparks-donate-btn sparks-donate-btn--primary" href="' + PAYPAL + '" target="_blank" rel="noopener">Toss a few bucks in the jar (PayPal)</a>' +
    '<a class="sparks-donate-btn" href="https://ko-fi.com/guysparks" target="_blank" rel="noopener">Buy the maker a coffee (Ko-fi)</a>' +
    '<a class="sparks-donate-btn" href="https://github.com/sponsors/GuyMannDude" target="_blank" rel="noopener">Sponsor monthly on GitHub</a>' +
    '<a class="sparks-donate-btn" href="https://rockysgallery.com" target="_blank" rel="noopener">Free art at Rocky\u2019s Gallery</a>';

  document.body.appendChild(bubble);
  document.body.appendChild(card);

  bubble.addEventListener('click', function (e) {
    e.stopPropagation();
    var open = card.classList.toggle('open');
    bubble.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
  document.addEventListener('click', function (e) {
    if (card.classList.contains('open') && !card.contains(e.target)) { card.classList.remove('open'); bubble.setAttribute('aria-expanded', 'false'); }
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') { card.classList.remove('open'); bubble.setAttribute('aria-expanded', 'false'); }
  });
})();
