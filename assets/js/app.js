/* ============================================================
   RENE BATERBONIA — troll site engine
   plain vanilla JS. no build step. GitHub Pages friendly.
   ============================================================ */
(function () {
  "use strict";

  /* ---------- DATA ---------- */
  var PHRASES = [
    "rene baterbonia", "ano jay?", "tara mamatron", "tara ya", "alpha bois",
    "rara sleepover", "ML ML", "Open Open", "Lose streak yarn", "galawgaw",
    "ano erp", "open erp", "suntukay", "tara gala", "bubuton kanak",
    "tara nomi", "tara nomihan", "grabehan ya"
  ];

  var IMGS = [
    "assets/img/pic01.webp", "assets/img/pic02.webp", "assets/img/pic03.webp",
    "assets/img/pic04.webp", "assets/img/pic05.webp", "assets/img/pic06.png",
    "assets/img/pic07.webp", "assets/img/pic08.webp", "assets/img/pic09.webp",
    "assets/img/pic10.webp", "assets/img/pic11.png", "assets/img/pic12.webp",
    "assets/img/pic13.webp", "assets/img/pic14.webp", "assets/img/pic15.webp",
    "assets/img/pic16.webp", "assets/img/pic17.webp", "assets/img/pic18.webp",
    "assets/img/pic19.webp", "assets/img/pic20.webp"
  ];

  var FACES = ["assets/img/pic03.webp", "assets/img/pic07.webp", "assets/img/pic09.webp",
               "assets/img/pic13.webp", "assets/img/pic05.webp", "assets/img/pic12.webp",
               "assets/img/pic17.webp", "assets/img/pic02.webp"];

  var CURSED = ["assets/img/pic04.webp", "assets/img/pic18.webp", "assets/img/pic19.webp"];

  var MOLES = ["assets/img/pic02.webp", "assets/img/pic05.webp", "assets/img/pic09.webp",
               "assets/img/pic10.webp", "assets/img/pic11.png", "assets/img/pic13.webp",
               "assets/img/pic07.webp", "assets/img/pic03.webp"];

  var STICKERS = ["assets/img/pic01.webp", "assets/img/pic08.webp", "assets/img/pic10.webp",
                  "assets/img/pic12.webp", "assets/img/pic17.webp", "assets/img/pic20.webp",
                  "assets/img/pic09.webp"];

  var DECK = [
    { img: "assets/img/pic03.webp", name: "rene", tag: "tara gala ka?" },
    { img: "assets/img/pic07.webp", name: "roller boi", tag: "kulot anay" },
    { img: "assets/img/pic13.webp", name: "news wall", tag: "galawgaw certified" },
    { img: "assets/img/pic05.webp", name: "shades", tag: "ML ML pero gab-i" },
    { img: "assets/img/pic09.webp", name: "thumbs up", tag: "open open ka?" },
    { img: "assets/img/pic20.webp", name: "tres marias", tag: "tara mamatron" }
  ];

  var HEARTS = ["💖", "💘", "💝", "💗", "💞", "✨", "💫", "🩷", "😻"];

  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var rand = function (a) { return a[Math.floor(Math.random() * a.length)]; };
  var ri = function (a, b) { return Math.floor(Math.random() * (b - a + 1)) + a; };

  /* ---------- FLOATERS (hearts + words) ---------- */
  var floatCount = 0;
  function floater(x, y, txt, isWord) {
    if (floatCount > 34) return;
    floatCount++;
    var el = document.createElement("div");
    el.className = "floater" + (isWord ? " word" : "");
    el.textContent = txt || rand(HEARTS);
    el.style.left = x + "px";
    el.style.top = y + "px";
    el.style.setProperty("--r", ri(-45, 45) + "deg");
    document.body.appendChild(el);
    setTimeout(function () { el.remove(); floatCount--; }, 1250);
  }
  function burst(x, y, n) {
    for (var i = 0; i < (n || 8); i++) {
      (function (i) {
        setTimeout(function () {
          floater(x + ri(-50, 50), y + ri(-30, 30));
        }, i * 55);
      })(i);
    }
  }
  function burstAt(el, n) {
    var r = el.getBoundingClientRect();
    burst(r.left + r.width / 2, r.top + r.height / 2, n);
  }

  document.addEventListener("pointerdown", function (e) {
    floater(e.clientX, e.clientY);
    if (Math.random() < 0.14) {
      floater(e.clientX + ri(-30, 30), e.clientY - 18, rand(PHRASES), true);
    }
  }, { passive: true });

  /* ---------- SPLASH ---------- */
  (function splash() {
    var wrap = $("#splash"), fill = $("#loadFill"), txt = $("#loadTxt"),
        btn = $("#enterBtn"), name = $("#splashName");

    // letter-by-letter title
    var words = ["RENE", "BATERBONIA"];
    words.forEach(function (w, wi) {
      if (wi) name.appendChild(document.createElement("br"));
      w.split("").forEach(function (ch, i) {
        var s = document.createElement("span");
        s.textContent = ch;
        s.style.animationDelay = (wi * 0.32 + i * 0.05) + "s";
        name.appendChild(s);
      });
    });

    document.body.style.overflow = "hidden";

    var steps = [
      [18, "loading galawgaw..."],
      [46, "warming up an ML ML..."],
      [72, "checking lose streak yarn..."],
      [99, "almost na... 99%"],
      [12, "ulol. balik kita 12% 😭"],
      [64, "tara ya, gutiay na la..."],
      [100, "OKAY NA. alpha bois assemble 💖"]
    ];
    var i = 0;
    (function tick() {
      if (i >= steps.length) {
        btn.hidden = false;
        return;
      }
      fill.style.width = steps[i][0] + "%";
      txt.textContent = steps[i][1];
      i++;
      setTimeout(tick, i === 5 ? 900 : 620);
    })();

    btn.addEventListener("click", function () {
      wrap.classList.add("gone");
      document.body.style.overflow = "";
      var r = btn.getBoundingClientRect();
      burst(r.left + r.width / 2, r.top, 14);
      setTimeout(function () { wrap.remove(); startToasts(); }, 600);
    });
  })();

  /* ---------- MARQUEE ---------- */
  (function marquee() {
    var t = $("#mqTrack"), html = "";
    for (var k = 0; k < 2; k++) {
      PHRASES.forEach(function (p) { html += "<span>" + p + " 💖</span>"; });
    }
    t.innerHTML = html;
  })();

  /* ---------- 1. HERO FACE SWAP ---------- */
  (function hero() {
    var frame = $("#heartFrame"), img = $("#heroImg"), c = $("#faceCount"), n = 0, idx = 0;
    frame.addEventListener("click", function (e) {
      idx = (idx + 1) % FACES.length;
      // every 6th tap: cursed face troll
      n++;
      img.src = (n % 6 === 0) ? rand(CURSED) : FACES[idx];
      c.textContent = n;
      burst(e.clientX, e.clientY, 7);
      if (n % 6 === 0) floater(e.clientX, e.clientY - 40, "ANO JAY?!", true);
    });
  })();

  /* ---------- 2. ANO JAY (whack-a-mole) ---------- */
  (function jay() {
    var grid = $("#moleGrid"), scoreEl = $("#jayScore"), timeEl = $("#jayTime"),
        startBtn = $("#jayStart"), say = $("#jaySay");
    var holes = [], running = false, score = 0, time = 15, popT = null, clockT = null;

    for (var i = 0; i < 9; i++) {
      var h = document.createElement("div");
      h.className = "hole";
      h.innerHTML = '<img alt=""><span class="hit"></span>';
      grid.appendChild(h);
      holes.push(h);
    }

    holes.forEach(function (h) {
      h.addEventListener("click", function (e) {
        if (!running || !h.classList.contains("up")) return;
        var trap = h.dataset.trap === "1";
        h.classList.remove("up");
        h.classList.add("bonk");
        var hit = $(".hit", h);
        if (trap) {
          score = Math.max(0, score - 2);
          hit.textContent = "-2";
          say.textContent = "ANO JAY?! 😭";
          document.body.animate(
            [{ transform: "translateX(0)" }, { transform: "translateX(-10px)" },
             { transform: "translateX(10px)" }, { transform: "translateX(0)" }],
            { duration: 220 }
          );
        } else {
          score++;
          hit.textContent = "+1";
          say.textContent = rand(PHRASES);
          burst(e.clientX, e.clientY, 5);
        }
        scoreEl.textContent = score;
        setTimeout(function () { h.classList.remove("bonk"); }, 320);
      });
    });

    function pop() {
      var free = holes.filter(function (h) { return !h.classList.contains("up"); });
      if (!free.length) return;
      var h = rand(free);
      var trap = Math.random() < 0.26;
      h.dataset.trap = trap ? "1" : "0";
      $("img", h).src = trap ? rand(CURSED) : rand(MOLES);
      h.classList.add("up");
      setTimeout(function () { h.classList.remove("up"); }, ri(650, 1150));
    }

    function stop() {
      running = false;
      clearInterval(popT); clearInterval(clockT);
      holes.forEach(function (h) { h.classList.remove("up"); });
      startBtn.hidden = false;
      startBtn.textContent = "LIWAT ✨";
      say.textContent = score >= 12 ? ("ALPHA BOIS! " + score + " 🏆")
                      : score >= 6 ? ("okay la... " + score + " 😌")
                      : ("Lose streak yarn (" + score + ") 💀");
      burstAt(say, 10);
    }

    startBtn.addEventListener("click", function () {
      if (running) return;
      running = true; score = 0; time = 15;
      scoreEl.textContent = 0; timeEl.textContent = 15;
      say.textContent = "tara ya! 🔥";
      startBtn.hidden = true;
      popT = setInterval(pop, 620);
      pop();
      clockT = setInterval(function () {
        time--;
        timeEl.textContent = time;
        if (time <= 0) stop();
      }, 1000);
    });
  })();

  /* ---------- 3. TARA MAMATRON (reels) ---------- */
  (function reels() {
    var box = $("#reels");
    var items = $$(".reel", box);

    if ("IntersectionObserver" in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          var v = en.target.querySelector("video");
          if (!v) return;
          if (en.isIntersecting && en.intersectionRatio > 0.55) {
            var p = v.play();
            if (p && p.catch) p.catch(function () {});
          } else {
            v.pause();
          }
        });
      }, { root: box, threshold: [0, 0.55, 1] });
      items.forEach(function (el) { io.observe(el); });
    }

    $$("[data-unmute]", box).forEach(function (btn) {
      btn.addEventListener("click", function (e) {
        e.stopPropagation();
        var v = btn.closest(".reel").querySelector("video");
        v.muted = !v.muted;
        btn.classList.toggle("on", !v.muted);
        btn.textContent = v.muted ? "🔇 tap para naay tingog" : "🔊 tingog on — tara ya";
        if (!v.muted) { var p = v.play(); if (p && p.catch) p.catch(function () {}); }
      });
    });

    $$("[data-like]", box).forEach(function (btn) {
      var i = btn.querySelector("i"), n = ri(12, 88);
      i.textContent = n;
      btn.addEventListener("click", function (e) {
        e.stopPropagation();
        n++;
        i.textContent = n;
        btn.classList.add("liked");
        setTimeout(function () { btn.classList.remove("liked"); }, 420);
        burst(e.clientX, e.clientY, 9);
      });
    });

    // double tap anywhere on a reel = hearts
    items.forEach(function (el) {
      var last = 0;
      el.addEventListener("pointerdown", function (e) {
        var t = Date.now();
        if (t - last < 380) {
          burst(e.clientX, e.clientY, 12);
          floater(e.clientX, e.clientY - 50, "tara mamatron", true);
        }
        last = t;
      });
    });
  })();

  /* ---------- 4. GALAWGAW (sticker board) ---------- */
  (function galawgaw() {
    var board = $("#board");
    var tags = ["galawgaw", "tara ya", "alpha bois", "ano jay?", "ML ML", "tara gala", "open open"];
    var nodes = [];

    STICKERS.forEach(function (src, i) {
      var el = document.createElement("div");
      el.className = "sticker";
      el.innerHTML = '<img src="' + src + '" alt="" loading="lazy"><b class="stag">' + tags[i % tags.length] + "</b>";
      board.appendChild(el);
      nodes.push(el);
    });

    function place(el, x, y, rot, anim) {
      el.style.transition = anim ? "left .5s cubic-bezier(.2,1.5,.4,1),top .5s cubic-bezier(.2,1.5,.4,1),transform .5s ease" : "none";
      el.style.left = x + "px";
      el.style.top = y + "px";
      el.dataset.rot = rot;
      el.style.transform = "rotate(" + rot + "deg)";
    }

    function scatter(anim) {
      var w = board.clientWidth, h = board.clientHeight;
      nodes.forEach(function (el) {
        var ew = el.offsetWidth || 84, eh = el.offsetHeight || 110;
        place(el, ri(4, Math.max(4, w - ew - 4)), ri(4, Math.max(4, h - eh - 4)), ri(-22, 22), anim);
      });
    }

    function tidy() {
      var w = board.clientWidth, cols = 3, pad = 8;
      var ew = 84, eh = 112;
      var gapX = (w - cols * ew - pad * 2) / (cols - 1);
      nodes.forEach(function (el, i) {
        var c = i % cols, r = Math.floor(i / cols);
        // the last one refuses to behave
        var naughty = (i === nodes.length - 1);
        place(el, pad + c * (ew + gapX), pad + r * (eh + 10), naughty ? ri(-28, 28) : 0, true);
      });
      setTimeout(function () {
        var last = nodes[nodes.length - 1];
        place(last, ri(10, board.clientWidth - 94), ri(10, board.clientHeight - 120), ri(-25, 25), true);
        burstAt(last, 5);
        toast("galawgaw", "may usa nga diri gud mapahilom 😭");
      }, 900);
    }

    // drag
    nodes.forEach(function (el) {
      var sx = 0, sy = 0, ox = 0, oy = 0, moved = false, lastTap = 0;
      el.addEventListener("pointerdown", function (e) {
        e.preventDefault();
        el.setPointerCapture(e.pointerId);
        el.classList.add("grab");
        el.style.transition = "none";
        sx = e.clientX; sy = e.clientY;
        ox = parseFloat(el.style.left) || 0;
        oy = parseFloat(el.style.top) || 0;
        moved = false;
      });
      el.addEventListener("pointermove", function (e) {
        if (!el.classList.contains("grab")) return;
        var dx = e.clientX - sx, dy = e.clientY - sy;
        if (Math.abs(dx) > 3 || Math.abs(dy) > 3) moved = true;
        var w = board.clientWidth - el.offsetWidth, h = board.clientHeight - el.offsetHeight;
        el.style.left = Math.min(Math.max(ox + dx, 0), w) + "px";
        el.style.top = Math.min(Math.max(oy + dy, 0), h) + "px";
      });
      function end(e) {
        if (!el.classList.contains("grab")) return;
        el.classList.remove("grab");
        if (!moved) {
          var t = Date.now();
          if (t - lastTap < 400) {
            var rot = (parseFloat(el.dataset.rot) || 0) + 720;
            el.style.transition = "transform .75s cubic-bezier(.2,1.2,.3,1)";
            el.dataset.rot = rot;
            el.style.transform = "rotate(" + rot + "deg)";
            burstAt(el, 6);
          }
          lastTap = t;
        }
      }
      el.addEventListener("pointerup", end);
      el.addEventListener("pointercancel", end);
    });

    $("#shuffleBtn").addEventListener("click", function () {
      scatter(true);
      toast("galawgaw", "ginraot mo na liwat 🌀");
    });
    $("#tidyBtn").addEventListener("click", tidy);

    // initial layout once sizes are known
    function init() { scatter(false); }
    if (document.readyState === "complete") init();
    else window.addEventListener("load", init);
    setTimeout(init, 400);
  })();

  /* ---------- 5. TARA GALA (swipe deck) ---------- */
  (function gala() {
    var deck = $("#deck"), empty = $("#deckEmpty");
    var cards = [];

    function build() {
      deck.innerHTML = "";
      cards = [];
      empty.hidden = true;
      DECK.slice().reverse().forEach(function (d, i) {
        var c = document.createElement("div");
        c.className = "card";
        c.innerHTML =
          '<img src="' + d.img + '" alt="" loading="lazy">' +
          '<span class="stampR">OPEN ERP</span><span class="stampL">ANO ERP</span>' +
          '<div class="card-name"><b>' + d.name + "</b><span>" + d.tag + "</span></div>";
        var depth = DECK.length - 1 - i;
        c.style.transform = "translateY(" + (depth * -6) + "px) scale(" + (1 - depth * 0.03) + ")";
        deck.appendChild(c);
        cards.push(c);
      });
      arm();
    }

    function top() { return cards[cards.length - 1]; }

    function fly(card, dir) {
      card.style.transition = "transform .45s ease, opacity .45s ease";
      card.style.transform = "translateX(" + (dir * 520) + "px) rotate(" + (dir * 34) + "deg)";
      card.style.opacity = "0";
      var r = card.getBoundingClientRect();
      if (dir > 0) burst(r.left + r.width / 2, r.top + r.height / 2, 10);
      setTimeout(function () {
        card.remove();
        cards.pop();
        if (!cards.length) {
          empty.hidden = false;
          var er = empty.getBoundingClientRect();
          burst(er.left + er.width / 2, er.top + er.height / 3, 16);
          toast("tara gala", "match na! rara sleepover 💘");
        } else {
          restack();
          arm();
        }
      }, 460);
    }

    function restack() {
      cards.forEach(function (c, i) {
        var depth = cards.length - 1 - i;
        c.style.transition = "transform .3s ease";
        c.style.transform = "translateY(" + (depth * -6) + "px) scale(" + (1 - depth * 0.03) + ")";
      });
    }

    function arm() {
      var card = top();
      if (!card || card.dataset.armed === "1") return;
      card.dataset.armed = "1";
      var sx = 0, sy = 0, dx = 0, dy = 0, dragging = false;
      var sR = card.querySelector(".stampR"), sL = card.querySelector(".stampL");

      card.addEventListener("pointerdown", function (e) {
        dragging = true;
        card.setPointerCapture(e.pointerId);
        card.style.transition = "none";
        sx = e.clientX; sy = e.clientY; dx = 0; dy = 0;
      });
      card.addEventListener("pointermove", function (e) {
        if (!dragging) return;
        dx = e.clientX - sx; dy = e.clientY - sy;
        card.style.transform = "translate(" + dx + "px," + dy * 0.35 + "px) rotate(" + (dx / 14) + "deg)";
        sR.style.opacity = Math.max(0, Math.min(1, dx / 90));
        sL.style.opacity = Math.max(0, Math.min(1, -dx / 90));
      });
      function up() {
        if (!dragging) return;
        dragging = false;
        sR.style.opacity = 0; sL.style.opacity = 0;
        if (Math.abs(dx) > 85) { fly(card, dx > 0 ? 1 : -1); }
        else {
          card.style.transition = "transform .35s cubic-bezier(.2,1.6,.4,1)";
          card.style.transform = "translateY(0) scale(1)";
        }
      }
      card.addEventListener("pointerup", up);
      card.addEventListener("pointercancel", up);
    }

    $$("[data-swipe]").forEach(function (b) {
      b.addEventListener("click", function () {
        var c = top();
        if (c) fly(c, b.dataset.swipe === "right" ? 1 : -1);
      });
    });
    $("#deckReset").addEventListener("click", build);

    build();
  })();

  /* ---------- 6. ML ML (lose streak) ---------- */
  (function mlml() {
    var btn = $("#openBtn"), zone = $("#openZone"), face = $("#mlFace"),
        winEl = $("#mlWin"), loseEl = $("#mlLose"), streakEl = $("#mlStreak"), tag = $("#mlTag");
    var win = 0, lose = 0, streak = 0, taps = 0;

    var LINES = [
      "lose streak yarn", "ML ML pero luya", "open open... sayop",
      "next game daog na (buwa)", "afk an alpha bois", "makusog an enemy, tara ya",
      "1 more game... galawgaw", "suntukay na la kita",
      "grabehan ya an lose", "tara nomi na la kita", "ayaw na, tara nomihan"
    ];

    btn.addEventListener("click", function (e) {
      taps++;
      lose++; streak++;
      // one fake win, once, then it gets taken back
      if (taps === 9) {
        win = 1;
        winEl.textContent = 1;
        tag.textContent = "DAOG?! 😳";
        setTimeout(function () {
          win = 0; winEl.textContent = 0;
          tag.textContent = "ulol. lose streak yarn 💀";
          face.src = rand(CURSED);
          face.parentElement.classList.add("shake");
          setTimeout(function () { face.parentElement.classList.remove("shake"); }, 400);
        }, 1400);
      } else {
        tag.textContent = rand(LINES);
      }
      loseEl.textContent = lose;
      streakEl.textContent = streak;
      face.src = rand(taps % 3 === 0 ? CURSED : FACES);
      face.parentElement.classList.add("shake");
      setTimeout(function () { face.parentElement.classList.remove("shake"); }, 400);
      burst(e.clientX, e.clientY, 6);

      // after a while the button starts dodging a bit
      if (taps > 6 && Math.random() < 0.55) {
        var w = zone.clientWidth, bw = btn.offsetWidth;
        var max = Math.max(0, (w - bw) / 2 - 6);
        btn.style.transform = "translate(" + ri(-max, max) + "px," + ri(-8, 8) + "px)";
      }
      if (lose === 15) toast("ML ML", "15 lose straight. legend 💀");
    });
  })();

  /* ---------- 7. SUNTUKAY ---------- */
  (function suntukay() {
    var btn = $("#punchBtn"), arena = $("#arena"), fx = $("#arenaFx"), ko = $("#koTxt");
    var hp = [100, 100];
    var bars = [$("#hp1"), $("#hp2")];
    var f = $$(".fighter", arena);
    var names = ["ano jay", "open erp"];
    var turn = 0, over = false;
    var WORDS = ["POW!", "BOG!", "AGI!", "ARAY!", "ML!", "YARN!", "TARA YA!",
                 "GALAWGAW!", "GRABEHAN YA!", "ULOL!", "TARA NOMI!"];

    function reset() {
      hp = [100, 100]; over = false; turn = 0;
      bars[0].style.width = "100%"; bars[1].style.width = "100%";
      ko.textContent = "";
    }

    btn.addEventListener("click", function (e) {
      if (over) { reset(); return; }
      var victim = turn;           // whoever is getting hit this tap
      turn = 1 - turn;
      hp[victim] = Math.max(0, hp[victim] - ri(4, 11));
      bars[victim].style.width = hp[victim] + "%";

      f[victim].classList.add("hurt");
      setTimeout(function () { f[victim].classList.remove("hurt"); }, 320);
      arena.classList.add("hit");
      setTimeout(function () { arena.classList.remove("hit"); }, 300);

      var w = document.createElement("span");
      w.className = "powtxt";
      w.textContent = rand(WORDS);
      w.style.left = ri(10, 60) + "%";
      w.style.top = ri(20, 60) + "%";
      fx.appendChild(w);
      setTimeout(function () { w.remove(); }, 620);

      burst(e.clientX, e.clientY, 4);

      if (hp[0] <= 0 || hp[1] <= 0) {
        over = true;
        var winner = hp[0] <= 0 ? names[1] : names[0];
        ko.textContent = "K.O! " + winner + " daog 🏆";
        burstAt(ko, 14);
        btn.textContent = "LIWAT 👊";
        toast("suntukay", winner + " daog. rematch?");
        setTimeout(function () { btn.textContent = "SUNTOK 👊"; }, 2600);
      }
    });
  })();

  /* ---------- 8. GALLERY + LIGHTBOX ---------- */
  (function gallery() {
    var g = $("#gallery"), lb = $("#lightbox"), lbImg = $("#lbImg"), lbCap = $("#lbCap");
    IMGS.forEach(function (src, i) {
      var c = document.createElement("button");
      c.className = "gcell";
      c.innerHTML = '<img src="' + src + '" alt="alpha bois ' + (i + 1) + '" loading="lazy">';
      c.addEventListener("click", function (e) {
        lbImg.src = src;
        lbCap.textContent = rand(PHRASES);
        lb.hidden = false;
        burst(e.clientX, e.clientY, 6);
      });
      g.appendChild(c);
    });
    function close() { lb.hidden = true; }
    $("#lbClose").addEventListener("click", close);
    lb.addEventListener("click", function (e) { if (e.target === lb || e.target === lbImg) close(); });
  })();

  /* ---------- FOOTER: chips, secret, runaway ---------- */
  (function foot() {
    var list = $("#phraseList");
    PHRASES.forEach(function (p, i) {
      var b = document.createElement("b");
      b.textContent = p;
      b.style.animationDelay = (i * 0.13) + "s";
      b.style.color = ["#ffe94a", "#25e7ff", "#c6ff3d", "#ff3ea5"][i % 4];
      b.addEventListener("click", function (e) {
        floater(e.clientX, e.clientY - 20, p, true);
        burst(e.clientX, e.clientY, 5);
      });
      list.appendChild(b);
    });

    // 16. ??? — jumpscare easter egg
    var js = $("#jumpscare"), secret = $("#secretBtn"), opened = false;
    secret.addEventListener("click", function () {
      js.hidden = false;
      setTimeout(function () {
        js.hidden = true;
        if (!opened) {
          opened = true;
          secret.textContent = "16. ano jay?? 💀";
          toast("no. 16", "waray man gali. tara ya na la 💖");
        }
        burstAt(secret, 12);
      }, 1100);
    });

    // bubuton kanak — the button that runs away
    var run = $("#runBtn"), dodges = 0;
    function dodge() {
      if (dodges >= 5) return;
      dodges++;
      run.style.transform = "translate(" + ri(-90, 90) + "px," + ri(-26, 26) + "px) rotate(" + ri(-14, 14) + "deg)";
      run.textContent = ["diri ko", "ayaw", "harayo ka", "hala", "sige na"][dodges - 1];
    }
    run.addEventListener("pointerenter", dodge);
    run.addEventListener("pointerdown", function (e) {
      if (dodges < 5) { dodge(); return; }
      e.stopPropagation();
      run.style.transform = "none";
      run.textContent = "nadakop na! 💖";
      burstAt(run, 18);
      toast("bubuton kanak", "nadakop gihapon ka 🥹");
      dodges = 0;
      setTimeout(function () { run.textContent = "bubuton kanak"; }, 2600);
    });
  })();

  /* ---------- ERP MODAL ---------- */
  (function erp() {
    var fab = $("#erpFab"), modal = $("#erpModal"), line = $("#erpLine"), img = $(".modal-card img", modal);
    var ASK = ["diri pa ka nag-open erp?", "ano erp?", "grades na ba?", "open erp na kuno",
               "diri ma-open an erp 😭", "erp down liwat"];
    var ANS = ["open erp... loading gihapon", "ERP: session expired 💀", "ano erp? amo gihap akon pakiana",
               "open open... error 404", "erp okay la, ikaw an down", "tara ya, buwas na la"];
    var n = 0;

    fab.addEventListener("click", function () {
      line.textContent = rand(ASK);
      img.src = rand(FACES);
      modal.hidden = false;
      n = 0;
    });
    $("#erpOpen").addEventListener("click", function (e) {
      n++;
      line.textContent = rand(ANS);
      img.src = rand(n >= 2 ? CURSED : FACES);
      burst(e.clientX, e.clientY, 8);
      if (n >= 3) {
        modal.hidden = true;
        toast("open erp", "ginclose ko na la para ha imo 💖");
      }
    });
    $("#erpClose").addEventListener("click", function () { modal.hidden = true; });
    modal.addEventListener("click", function (e) { if (e.target === modal) modal.hidden = true; });
  })();

  /* ---------- TOASTS ---------- */
  var toastWrap = $("#toastWrap");
  function toast(title, body) {
    if (toastWrap.children.length > 2) toastWrap.firstElementChild.remove();
    var t = document.createElement("div");
    t.className = "toast";
    t.innerHTML = '<img src="' + rand(IMGS) + '" alt=""><div><b>' + title + "</b><span>" + body + "</span></div>";
    toastWrap.appendChild(t);
    setTimeout(function () {
      t.classList.add("out");
      setTimeout(function () { t.remove(); }, 360);
    }, 4200);
  }

  var TOASTS = [
    ["rene baterbonia", "gin-mention ka ha gc 👀"],
    ["tara mamatron", "3 na an nag-react. tara na!"],
    ["ML ML", "waray ka? lose streak yarn gihapon"],
    ["rara sleepover", "hin-o an magdara hin pagkaon?"],
    ["ano jay?", "waray la, nag-chat la 😭"],
    ["tara gala", "gala kita buwas, bisan diin"],
    ["alpha bois", "online ngatanan gawas ha imo"],
    ["open open", "open open na kuno ha lobby"],
    ["galawgaw", "may bag-o nga galawgaw ha gc"],
    ["suntukay", "joke la, hug la 💖"],
    ["bubuton kanak", "ginbuton ka na. diri ka maaram"],
    ["ano erp", "erp down. as usual."],
    ["tara nomi", "may 4 na. ikaw na la an ginhuhulat 🍻"],
    ["tara nomihan", "gab-i ini. diri ka pwede mag-no 😤"],
    ["grabehan ya", "grabehan ya ka mag-seen. ulol 💀"]
  ];
  var ti = 0;
  function startToasts() {
    setTimeout(function pushOne() {
      var t = TOASTS[ti % TOASTS.length]; ti++;
      toast(t[0], t[1]);
      setTimeout(pushOne, ri(11000, 16000));
    }, 4000);
  }

  /* ---------- DOCK smooth scroll ---------- */
  $$("#dock a").forEach(function (a) {
    a.addEventListener("click", function (e) {
      e.preventDefault();
      var el = document.querySelector(a.getAttribute("href"));
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      burstAt(a, 5);
    });
  });

})();
