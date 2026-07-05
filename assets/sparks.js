/* Project Sparks — cursor comet.
   Intent: the cursor is a comet nucleus — gold, azure, and chrome sparks
   stream out behind its direction of travel, stretch with the motion,
   then slow and die like embers. */
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
    '<a class="sparks-donate-btn" href="https://rockysgallery.com" target="_blank" rel="noopener">Or buy artwork at Rocky’s Gallery →</a>';

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
