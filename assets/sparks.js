/* Project Sparks — cursor swirl.
   Intent: metal filings caught in a magnetic spark — the cursor drags a
   small vortex of gold, azure, and chrome filings that spin off and fade. */
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

  // palette tuned for the light porcelain background
  var COLORS = [
    [11, 107, 221],   // azure
    [11, 107, 221],
    [0, 144, 178],    // cyan
    [143, 162, 184],  // chrome gray
    [201, 140, 0],    // gold
    [201, 140, 0]
  ];

  var MAX = 130;
  var particles = [];
  var mouse = { x: -1000, y: -1000 };
  var anchor = { x: -1000, y: -1000 }; // smoothed vortex center
  var emit = 0;

  window.addEventListener('mousemove', function (e) {
    if (mouse.x < -500) { anchor.x = e.clientX; anchor.y = e.clientY; }
    mouse.x = e.clientX;
    mouse.y = e.clientY;
    emit = Math.min(emit + 2, 6);
  }, { passive: true });

  function spawn() {
    if (particles.length >= MAX) return;
    var c = COLORS[(Math.random() * COLORS.length) | 0];
    particles.push({
      a: Math.random() * Math.PI * 2,          // orbit angle
      r: 3 + Math.random() * 9,                // orbit radius
      spin: (Math.random() < 0.5 ? -1 : 1) * (0.10 + Math.random() * 0.10),
      grow: 0.55 + Math.random() * 0.75,       // radius growth / frame
      len: 2.5 + Math.random() * 4,            // filing length
      life: 1,
      decay: 0.018 + Math.random() * 0.02,
      cx: anchor.x, cy: anchor.y,              // frozen center drifts with anchor briefly
      drift: 0.18 + Math.random() * 0.25,      // how much it follows the anchor
      col: c
    });
  }

  function frame() {
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

    // vortex center eases after the cursor
    anchor.x += (mouse.x - anchor.x) * 0.22;
    anchor.y += (mouse.y - anchor.y) * 0.22;

    while (emit > 0) { spawn(); emit--; }

    for (var i = particles.length - 1; i >= 0; i--) {
      var p = particles[i];
      p.a += p.spin;
      p.r += p.grow;
      p.life -= p.decay;
      p.cx += (anchor.x - p.cx) * p.drift;
      p.cy += (anchor.y - p.cy) * p.drift;
      if (p.life <= 0) { particles.splice(i, 1); continue; }

      var x = p.cx + Math.cos(p.a) * p.r;
      var y = p.cy + Math.sin(p.a) * p.r * 0.82; // slight ellipse, like a tilted disc
      // filing oriented along its orbital tangent
      var tx = -Math.sin(p.a) * p.len * p.life;
      var ty = Math.cos(p.a) * 0.82 * p.len * p.life;

      ctx.strokeStyle = 'rgba(' + p.col[0] + ',' + p.col[1] + ',' + p.col[2] + ',' + (0.5 * p.life * p.life).toFixed(3) + ')';
      ctx.lineWidth = 1.4 * p.life;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(x - tx, y - ty);
      ctx.lineTo(x + tx, y + ty);
      ctx.stroke();
    }

    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
})();

/* --- Donate float: bottom-left, opposite Rocky/Peter's chat bubble --- */
(function () {
  var PAYPAL = 'https://www.paypal.com/donate/?business=RHYJXYA2B877E&no_recurring=0&item_name=Support+Mnemo+Cortex+%E2%80%94+open-source+AI+memory.+Funded+entirely+by+donations+and+art+sales+at+Rocky%27s+Gallery.&currency_code=USD';
  var style = document.createElement('style');
  style.textContent = [
    '#sparks-donate-bubble{position:fixed;bottom:24px;left:24px;z-index:99999;',
    'width:64px;height:64px;border-radius:50%;border:none;cursor:pointer;',
    'background:linear-gradient(135deg,#d4a82a,#9c7514);color:#14100a;font-size:26px;',
    'display:flex;align-items:center;justify-content:center;',
    'box-shadow:0 4px 20px rgba(212,168,42,.4),0 0 0 3px rgba(212,168,42,.3);',
    'transition:transform .2s,box-shadow .2s;}',
    '#sparks-donate-bubble:hover{transform:scale(1.1);',
    'box-shadow:0 4px 28px rgba(212,168,42,.6),0 0 0 4px rgba(212,168,42,.4);}',
    '#sparks-donate-card{position:fixed;bottom:100px;left:24px;z-index:99998;',
    'width:320px;max-width:calc(100vw - 32px);background:#0c0c18;',
    'border:1px solid rgba(212,168,42,.3);border-radius:16px;padding:18px;display:none;',
    'box-shadow:0 8px 40px rgba(0,0,0,.6),0 0 0 1px rgba(212,168,42,.15);',
    'font-family:Inter,-apple-system,BlinkMacSystemFont,sans-serif;}',
    '#sparks-donate-card.open{display:block;}',
    '#sparks-donate-card h3{margin:0 0 8px;color:#d4a82a;font-size:15px;font-weight:600;}',
    '#sparks-donate-card p{margin:0 0 14px;color:#c9c9d4;font-size:13px;line-height:1.55;}',
    '#sparks-donate-card p a{color:#d4a82a;text-decoration:none;font-weight:600;}',
    '.sparks-donate-btn{display:block;text-align:center;margin-top:8px;padding:10px 12px;',
    'border-radius:8px;font-size:13px;font-weight:600;text-decoration:none;',
    'border:1px solid rgba(212,168,42,.45);color:#d4a82a;}',
    '.sparks-donate-btn:hover{background:rgba(212,168,42,.12);}',
    '.sparks-donate-btn--primary{background:linear-gradient(135deg,#d4a82a,#9c7514);',
    'color:#14100a;border:none;}',
    '.sparks-donate-btn--primary:hover{filter:brightness(1.08);background:linear-gradient(135deg,#d4a82a,#9c7514);}'
  ].join('');
  document.head.appendChild(style);

  var bubble = document.createElement('button');
  bubble.id = 'sparks-donate-bubble';
  bubble.setAttribute('aria-label', 'Donate to Mnemo Cortex');
  bubble.textContent = '♥';

  var card = document.createElement('div');
  card.id = 'sparks-donate-card';
  card.innerHTML =
    '<h3>Keep Mnemo alive</h3>' +
    '<p>Mnemo Cortex is funded entirely by donations and art sales at ' +
    '<a href="https://rockysgallery.com" target="_blank" rel="noopener">Rocky’s Gallery</a>. ' +
    'No sponsors, no VC — one maker and his agents.</p>' +
    '<a class="sparks-donate-btn sparks-donate-btn--primary" href="' + PAYPAL + '" target="_blank" rel="noopener">♥ Donate with PayPal</a>' +
    '<a class="sparks-donate-btn" href="https://github.com/sponsors/GuyMannDude" target="_blank" rel="noopener">GitHub Sponsors</a>' +
    '<a class="sparks-donate-btn" href="https://rockysgallery.com" target="_blank" rel="noopener">Or buy a 1-of-1 at Rocky’s Gallery →</a>';

  document.body.appendChild(bubble);
  document.body.appendChild(card);

  bubble.addEventListener('click', function (e) {
    e.stopPropagation();
    card.classList.toggle('open');
  });
  document.addEventListener('click', function (e) {
    if (card.classList.contains('open') && !card.contains(e.target)) card.classList.remove('open');
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') card.classList.remove('open');
  });
})();
