/* Project Sparks — the memory game on the home page.
   Built here, no libraries. Everything it remembers lives in this browser's
   localStorage and nowhere else. Keys: sparks.pet, sparks.scores.

   Round 1: "What's your pet's name?" Remembered across the page and on return visits.
   Play more: numbers, sequence, pairs, words, chimp — each ends with three scores
   (You / a plain AI: 0 / an AI with Mnemo: everything) and a one-line share. */
(function () {
  var PET = 'sparks.pet', SCORES = 'sparks.scores';
  var $ = function (id) { return document.getElementById(id); };
  var store = {
    get: function (k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set: function (k, v) { try { localStorage.setItem(k, v); } catch (e) {} },
    del: function (k) { try { localStorage.removeItem(k); } catch (e) {} }
  };
  var scores = {};
  try { scores = JSON.parse(store.get(SCORES) || '{}') || {}; } catch (e) { scores = {}; }

  var ask = $('ask'), form = $('form'), fine = $('fine'), more = $('more'), arena = $('arena');
  if (!ask || !form) return;

  /* ---------- round 1: the pet ---------- */
  var q = new URLSearchParams(location.search), seed = q.get('name');
  var pet = seed || store.get(PET);

  function usePet(name) {
    var go = document.querySelector('[data-go]');
    if (go) go.textContent = 'So your AI remembers ' + name + ' too';
    var foot = $('footline');
    if (foot) foot.textContent = 'Guy Hutchins and his AI team, Half Moon Bay. Give ' + name + ' a scratch from us.';
  }
  function remembered(name, fresh) {
    ask.textContent = fresh
      ? "Got it. I'll remember " + name + '. Now scroll, and watch me use it.'
      : 'Welcome back. Is ' + name + ' still keeping you company?';
    form.innerHTML = '<a class="btn btn-ghost" href="#doors">Pick your door</a>' +
      '<button class="btn btn-ghost" type="button" id="playmore">Play more</button>' +
      '<a class="btn link" id="forget" href="#">Forget ' + name + '</a>';
    fine.textContent = fresh
      ? "I'll still know " + name + ' tomorrow. Your AI should remember you like that too.'
      : 'I remembered that from last time. Your AI should too.';
    usePet(name);
    $('forget').onclick = function (e) {
      e.preventDefault(); store.del(PET); store.del(SCORES); location.href = location.pathname;
    };
    $('playmore').onclick = function () {
      more.hidden = false; this.setAttribute('aria-expanded', 'true');
      more.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    };
  }
  if (pet) remembered(pet, !!seed);
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var v = ($('pet').value || '').trim().slice(0, 40);
    if (!v) return;
    pet = v; store.set(PET, v); remembered(v, true);
  });

  /* ---------- helpers ---------- */
  function h(tag, attrs, kids) {
    var el = document.createElement(tag);
    for (var k in attrs || {}) {
      if (k === 'text') el.textContent = attrs[k];
      else if (k === 'html') el.innerHTML = attrs[k];
      else if (k.slice(0, 2) === 'on') el.addEventListener(k.slice(2), attrs[k]);
      else el.setAttribute(k, attrs[k]);
    }
    (kids || []).forEach(function (c) { el.appendChild(c); });
    return el;
  }
  function clear(el) { while (el.firstChild) el.removeChild(el.firstChild); }
  function shuffle(a) { for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  function wait(ms) { return new Promise(function (r) { setTimeout(r, ms); }); }
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- scoreboard ---------- */
  function finish(game, you, unit, share) {
    var best = scores[game];
    var num = parseFloat(you);
    if (best === undefined || num > parseFloat(best)) { scores[game] = you; store.set(SCORES, JSON.stringify(scores)); }
    var line = share || ('I scored ' + you + ' ' + unit + ' on the ' + game + ' game at projectsparks.ai. A plain AI scored 0. An AI with Mnemo remembers everything.');
    var board = h('div', { class: 'scores' }, [
      h('div', { class: 'line you' }, [h('span', { html: '<b>You</b>' }), h('span', { text: you + ' ' + unit })]),
      h('div', { class: 'line' }, [h('span', { html: '<b>A plain AI</b>' }), h('span', { text: '0 (forgets when the chat ends)' })]),
      h('div', { class: 'line' }, [h('span', { html: '<b>An AI with Mnemo</b>' }), h('span', { text: 'everything' })])
    ]);
    var copy = h('button', { class: 'btn btn-primary', type: 'button', text: 'Copy my score' });
    copy.onclick = function () {
      var self = this;
      function ok() { self.textContent = 'Copied. Paste it anywhere.'; setTimeout(function () { self.textContent = 'Copy my score'; }, 4000); }
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(line).then(ok, ok); else ok();
    };
    var again = h('button', { class: 'btn btn-ghost', type: 'button', text: 'Play again' });
    again.onclick = function () { start(game); };
    var share = h('div', { class: 'share' }, [copy, again]);
    board.appendChild(share);
    board.appendChild(h('p', { class: 'fine', text: line }));
    if (pet) board.appendChild(h('p', { class: 'fine', text: 'Still remembering ' + pet + ', by the way.' }));
    arena.appendChild(board);
  }

  /* ---------- game 1: number memory ---------- */
  function numbers() {
    var n = 3;
    function round() {
      clear(arena);
      var digits = ''; for (var i = 0; i < n; i++) digits += Math.floor(Math.random() * 10);
      var say = h('p', { class: 'say', text: 'Remember this number.' });
      var show = h('div', { class: 'digits', text: digits });
      arena.appendChild(say); arena.appendChild(show);
      wait(reduced ? 2000 : 1000 + n * 450).then(function () {
        clear(arena);
        var inp = h('input', { type: 'text', inputmode: 'numeric', autocomplete: 'off', 'aria-label': 'The number you saw' });
        var f = h('form', { class: 'row' }, [inp, h('button', { class: 'btn btn-primary', type: 'submit', text: 'That was it' })]);
        arena.appendChild(h('p', { class: 'say', text: 'What was the number?' })); arena.appendChild(f);
        inp.focus();
        f.onsubmit = function (e) {
          e.preventDefault();
          if (inp.value.trim() === digits) {
            n++; clear(arena); arena.appendChild(h('p', { class: 'say', text: 'Right. Next one is ' + n + ' digits.' }));
            wait(900).then(round);
          } else {
            clear(arena);
            arena.appendChild(h('p', { class: 'say', text: 'It was ' + digits + '. You typed ' + (inp.value.trim() || 'nothing') + '.' }));
            finish('numbers', String(n - 1), 'digits in a row', 'I remembered a ' + (n - 1) + '-digit number at projectsparks.ai. A plain AI remembered 0 digits. An AI with Mnemo remembers everything.');
          }
        };
      });
    }
    round();
  }

  /* ---------- game 2: sequence memory ---------- */
  function sequence() {
    var seq = [], level = 0, tiles = [];
    function grid() {
      clear(arena);
      arena.appendChild(h('p', { class: 'say', text: 'Watch the tiles light up, then tap them in the same order.' }));
      var g = h('div', { class: 'tiles', style: 'grid-template-columns: repeat(3, 1fr); max-width: 300px;' });
      tiles = [];
      for (var i = 0; i < 9; i++) {
        (function (i) {
          var b = h('button', { type: 'button', 'aria-label': 'Tile ' + (i + 1), disabled: '' });
          b.onclick = function () { tap(i); };
          tiles.push(b); g.appendChild(b);
        })(i);
      }
      arena.appendChild(g);
    }
    var at = 0;
    function play() {
      level++; seq.push(Math.floor(Math.random() * 9)); at = 0;
      grid();
      arena.firstChild.textContent = 'Level ' + level + '. Watch.';
      var p = wait(500);
      seq.forEach(function (t) {
        p = p.then(function () { tiles[t].classList.add('lit'); return wait(reduced ? 700 : 450); })
             .then(function () { tiles[t].classList.remove('lit'); return wait(200); });
      });
      p.then(function () {
        arena.firstChild.textContent = 'Your turn.';
        tiles.forEach(function (b) { b.removeAttribute('disabled'); });
      });
    }
    function tap(i) {
      if (i === seq[at]) {
        tiles[i].classList.add('good'); setTimeout(function () { tiles[i].classList.remove('good'); }, 200);
        at++;
        if (at === seq.length) { tiles.forEach(function (b) { b.setAttribute('disabled', ''); }); wait(600).then(play); }
      } else {
        tiles[i].classList.add('bad'); tiles.forEach(function (b) { b.setAttribute('disabled', ''); });
        arena.firstChild.textContent = 'Not that one. You repeated ' + (level - 1) + ' in a row.';
        finish('sequence', String(level - 1), 'tiles in a row', 'I repeated a ' + (level - 1) + '-tile sequence at projectsparks.ai. A plain AI repeated 0. An AI with Mnemo remembers everything.');
      }
    }
    play();
  }

  /* ---------- game 3: pairs ---------- */
  function pairs() {
    var faces = shuffle(['🐕', '🐈', '🦜', '🐠', '🐢', '🐇', '🐝', '🦋'].concat(['🐕', '🐈', '🦜', '🐠', '🐢', '🐇', '🐝', '🦋']));
    var open = [], found = 0, flips = 0, lock = false;
    clear(arena);
    var say = h('p', { class: 'say', text: 'Find the eight pairs. Fewer flips is better.' });
    var g = h('div', { class: 'tiles', style: 'grid-template-columns: repeat(4, 1fr); max-width: 340px;' });
    arena.appendChild(say); arena.appendChild(g);
    faces.forEach(function (f, i) {
      var b = h('button', { type: 'button', class: 'blank', 'aria-label': 'Card ' + (i + 1), text: f });
      b.onclick = function () {
        if (lock || b.classList.contains('face') || open.indexOf(b) !== -1) return;
        b.classList.remove('blank'); b.classList.add('face'); open.push(b); flips++;
        say.textContent = 'Flips: ' + flips;
        if (open.length === 2) {
          lock = true;
          var a = open[0], c = open[1];
          if (a.textContent === c.textContent) {
            found++; a.classList.add('good'); c.classList.add('good'); open = []; lock = false;
            if (found === 8) {
              say.textContent = 'All eight pairs in ' + flips + ' flips.';
              finish('pairs', String(flips), 'flips for 8 pairs', 'I matched 8 pairs in ' + flips + ' flips at projectsparks.ai. A plain AI matched 0. An AI with Mnemo remembers everything.');
            }
          } else {
            setTimeout(function () {
              a.classList.remove('face'); c.classList.remove('face'); a.classList.add('blank'); c.classList.add('blank');
              open = []; lock = false;
            }, reduced ? 1200 : 800);
          }
        }
      };
      g.appendChild(b);
    });
  }

  /* ---------- game 4: word list ---------- */
  function words() {
    var bank = ['anchor', 'lantern', 'violin', 'cactus', 'harbor', 'pepper', 'meadow', 'rocket', 'saddle', 'marble', 'feather', 'copper', 'thunder', 'ribbon', 'walnut', 'compass', 'barn', 'kettle', 'ladder', 'orchard'];
    var list = shuffle(bank.slice()).slice(0, 8);
    if (pet) list[Math.floor(Math.random() * 8)] = pet;
    clear(arena);
    var say = h('p', { class: 'say', text: 'Read these eight words. You have ten seconds.' });
    arena.appendChild(say);
    arena.appendChild(h('p', { class: 'words', text: list.join(' · ') }));
    var left = 10, count = h('span', { class: 'count', text: '10' });
    say.appendChild(count);
    var tick = setInterval(function () { left--; count.textContent = String(left); if (left <= 0) { clearInterval(tick); delay(); } }, 1000);
    function delay() {
      clear(arena);
      var d = reduced ? 5 : 8;
      var s = h('p', { class: 'say', text: 'Now wait. The words are hidden for ' + d + ' seconds, like a chat that ended.' });
      arena.appendChild(s);
      var t2 = setInterval(function () { d--; if (d <= 0) { clearInterval(t2); recall(); } else s.textContent = 'Now wait. ' + d + ' seconds.'; }, 1000);
    }
    function recall() {
      clear(arena);
      var ta = h('textarea', { 'aria-label': 'The words you remember', placeholder: 'Type the words you remember, any order, separated by spaces or commas' });
      var f = h('form', {}, [ta, h('div', { class: 'row', style: 'margin-top:10px' }, [h('button', { class: 'btn btn-primary', type: 'submit', text: "That's all I remember" })])]);
      arena.appendChild(h('p', { class: 'say', text: 'Which words were they?' })); arena.appendChild(f); ta.focus();
      f.onsubmit = function (e) {
        e.preventDefault();
        var typed = ta.value.toLowerCase().split(/[\s,;]+/).filter(Boolean);
        var got = list.filter(function (w) { return typed.indexOf(w.toLowerCase()) !== -1; });
        clear(arena);
        arena.appendChild(h('p', { class: 'say', text: 'You got ' + got.length + ' of 8. The list was: ' + list.join(', ') + '.' }));
        finish('words', String(got.length), 'of 8 words after a delay', 'I remembered ' + got.length + ' of 8 words after a delay at projectsparks.ai. A plain AI remembered 0. An AI with Mnemo remembers everything.');
      };
    }
  }

  /* ---------- game 5: chimp test ---------- */
  function chimp() {
    var n = 4;
    function round() {
      clear(arena);
      arena.appendChild(h('p', { class: 'say', text: 'Tap the numbers in order, 1 first. After you tap 1, the rest go blank.' }));
      var cells = 20, spots = shuffle(Array.apply(null, Array(cells)).map(function (_, i) { return i; })).slice(0, n);
      var g = h('div', { class: 'tiles', style: 'grid-template-columns: repeat(5, 1fr); max-width: 420px;' });
      var next = 1, btns = {};
      for (var i = 0; i < cells; i++) {
        var k = spots.indexOf(i);
        if (k === -1) { g.appendChild(h('span', {})); continue; }
        (function (num) {
          var b = h('button', { type: 'button', text: String(num), 'aria-label': 'Number ' + num });
          b.onclick = function () {
            if (num !== next) {
              b.classList.add('bad');
              Object.keys(btns).forEach(function (x) { btns[x].setAttribute('disabled', ''); btns[x].classList.remove('blank'); });
              arena.firstChild.textContent = 'That was ' + num + ', not ' + next + '. You handled ' + (n - 1) + ' numbers.';
              finish('chimp', String(n - 1), 'numbers in order', 'I tapped ' + (n - 1) + ' hidden numbers in order at projectsparks.ai. A plain AI tapped 0. An AI with Mnemo remembers everything.');
              return;
            }
            b.classList.add('good'); b.setAttribute('disabled', '');
            if (num === 1) Object.keys(btns).forEach(function (x) { if (x !== '1') btns[x].classList.add('blank'); });
            next++;
            if (next > n) { n++; arena.firstChild.textContent = 'Right. Now ' + n + '.'; wait(800).then(round); }
          };
          btns[num] = b; g.appendChild(b);
        })(k + 1);
      }
      arena.appendChild(g);
    }
    round();
  }

  /* ---------- the "play more" panel ---------- */
  var GAMES = { numbers: ['Numbers', numbers], sequence: ['Sequence', sequence], pairs: ['Pairs', pairs], words: ['Word list', words], chimp: ['Chimp test', chimp] };
  var picks = $('picks');
  function start(name) {
    Array.prototype.forEach.call(picks.children, function (b) { b.setAttribute('aria-pressed', b.dataset.game === name ? 'true' : 'false'); });
    GAMES[name][1]();
  }
  Object.keys(GAMES).forEach(function (name) {
    var b = h('button', { type: 'button', 'data-game': name, 'aria-pressed': 'false', text: GAMES[name][0] + (scores[name] ? ' · best ' + scores[name] : '') });
    b.onclick = function () { start(name); };
    picks.appendChild(b);
  });
})();
