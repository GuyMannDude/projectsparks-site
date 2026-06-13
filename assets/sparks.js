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
