/* ============================================================
   SFX — cartoon sound effects, synthesized in the browser.
   No audio files, no licensing, no extra requests.
   Web Audio API only. Degrades to silence if unsupported.

   window.SFX.ready()        resume the context (call on a gesture)
   window.SFX.play(name)     play a sound
   window.SFX.setMuted(bool)
   window.SFX.isMuted()
   ============================================================ */
(function () {
  "use strict";

  var ctx = null, master = null, noiseBuf = null;
  var muted = false;
  var lastName = "", lastAt = 0;

  try { muted = localStorage.getItem("troll-muted") === "1"; } catch (e) {}

  function init() {
    if (ctx) return ctx;
    var AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    try { ctx = new AC(); } catch (e) { return null; }

    master = ctx.createGain();
    master.gain.value = muted ? 0 : 0.85;
    master.connect(ctx.destination);

    var len = Math.floor(ctx.sampleRate * 1.5);
    noiseBuf = ctx.createBuffer(1, len, ctx.sampleRate);
    var d = noiseBuf.getChannelData(0);
    for (var i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;

    return ctx;
  }

  function resume() {
    if (!ctx || ctx.state !== "suspended") return;
    try {
      var p = ctx.resume();
      if (p && p.catch) p.catch(function () {});
    } catch (e) {}
  }

  // Browsers start the context suspended until a real user gesture.
  // iOS in particular wants an actual buffer played from inside that
  // gesture, so do both: resume and fire one silent sample.
  function ready() {
    init();
    if (!ctx) return;
    resume();
    try {
      var b = ctx.createBuffer(1, 1, ctx.sampleRate);
      var src = ctx.createBufferSource();
      src.buffer = b;
      src.connect(ctx.destination);
      src.start(0);
    } catch (e) {}
  }

  // Unlock on the earliest possible gesture, in the capture phase, so it
  // runs before any of the page's own handlers try to make a noise.
  var GESTURES = ["pointerdown", "touchstart", "mousedown", "keydown"];
  function onFirstGesture() {
    ready();
    if (ctx && ctx.state === "running") {
      for (var g = 0; g < GESTURES.length; g++) {
        window.removeEventListener(GESTURES[g], onFirstGesture, true);
      }
    }
  }
  for (var gi = 0; gi < GESTURES.length; gi++) {
    window.addEventListener(GESTURES[gi], onFirstGesture, true);
  }

  // coming back from a background tab can leave it suspended
  document.addEventListener("visibilitychange", function () {
    if (!document.hidden) resume();
  });

  /* ---------- building blocks ---------- */

  // a pitched tone with an optional glide and optional filter
  function tone(o) {
    var t0 = ctx.currentTime + (o.at || 0);
    var dur = o.dur;
    var osc = ctx.createOscillator();
    osc.type = o.type || "sine";
    osc.frequency.setValueAtTime(o.f0, t0);
    if (o.f1 != null) {
      osc.frequency.exponentialRampToValueAtTime(Math.max(1, o.f1), t0 + dur);
    }
    if (o.curve) {
      osc.frequency.cancelScheduledValues(t0);
      osc.frequency.setValueCurveAtTime(o.curve, t0, dur);
    }

    var g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(o.vol || 0.18, t0 + (o.atk || 0.008));
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);

    osc.connect(g);

    if (o.lp) {
      var f = ctx.createBiquadFilter();
      f.type = "lowpass";
      f.frequency.setValueAtTime(o.lp, t0);
      if (o.q) f.Q.value = o.q;
      g.connect(f); f.connect(master);
    } else {
      g.connect(master);
    }

    osc.start(t0);
    osc.stop(t0 + dur + 0.03);
  }

  // filtered noise burst
  function noise(o) {
    var t0 = ctx.currentTime + (o.at || 0);
    var dur = o.dur;
    var src = ctx.createBufferSource();
    src.buffer = noiseBuf;
    src.playbackRate.value = o.rate || 1;

    var f = ctx.createBiquadFilter();
    f.type = o.ftype || "lowpass";
    f.frequency.setValueAtTime(o.f0 || 1200, t0);
    if (o.f1 != null) f.frequency.exponentialRampToValueAtTime(Math.max(1, o.f1), t0 + dur);
    if (o.q) f.Q.value = o.q;

    var g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(o.vol || 0.18, t0 + (o.atk || 0.005));
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);

    src.connect(f); f.connect(g); g.connect(master);
    src.start(t0);
    src.stop(t0 + dur + 0.03);
  }

  function curveOf(n, fn) {
    var a = new Float32Array(n);
    for (var i = 0; i < n; i++) a[i] = Math.max(20, fn(i / (n - 1), i));
    return a;
  }

  /* ---------- the sounds ---------- */
  var SOUNDS = {

    // quiet click under every single tap
    tap: function () {
      tone({ type: "sine", f0: 1250, f1: 780, dur: 0.04, vol: 0.045 });
    },

    // little bubble pop
    pop: function () {
      tone({ type: "sine", f0: 420, f1: 1250, dur: 0.07, vol: 0.16 });
    },

    // cartoon spring
    boing: function () {
      tone({
        type: "sine", f0: 440, dur: 0.42, vol: 0.2,
        curve: curveOf(40, function (p, i) {
          return 430 * (1 + 0.55 * Math.sin(i * 0.85)) * (1 - p * 0.62);
        })
      });
    },

    // mario-ish pickup
    coin: function () {
      tone({ type: "square", f0: 987.8, dur: 0.07, vol: 0.13 });
      tone({ type: "square", f0: 1318.5, dur: 0.2, vol: 0.13, at: 0.07 });
    },

    // wrong answer buzzer
    buzz: function () {
      tone({ type: "sawtooth", f0: 98, dur: 0.3, vol: 0.14, lp: 720, q: 3 });
      tone({ type: "sawtooth", f0: 104, dur: 0.3, vol: 0.14, lp: 720, q: 3 });
    },

    // whack
    bonk: function () {
      tone({ type: "square", f0: 230, f1: 70, dur: 0.11, vol: 0.2 });
      noise({ f0: 900, f1: 200, dur: 0.05, vol: 0.16 });
    },

    // fist meets face
    punch: function () {
      noise({ f0: 1600, f1: 120, dur: 0.16, vol: 0.3 });
      tone({ type: "sine", f0: 170, f1: 45, dur: 0.19, vol: 0.28 });
    },

    // swipe / transition
    whoosh: function () {
      noise({ ftype: "bandpass", f0: 380, f1: 2800, q: 1.1, dur: 0.2, vol: 0.14 });
    },

    // slide whistle up
    slideUp: function () {
      tone({ type: "sine", f0: 260, f1: 1550, dur: 0.34, vol: 0.13 });
      tone({ type: "triangle", f0: 260, f1: 1550, dur: 0.34, vol: 0.04 });
    },

    // slide whistle down
    slideDown: function () {
      tone({ type: "sine", f0: 1550, f1: 250, dur: 0.38, vol: 0.13 });
      tone({ type: "triangle", f0: 1550, f1: 250, dur: 0.38, vol: 0.04 });
    },

    // wah wah waaah
    sadTrombone: function () {
      var notes = [392.0, 369.99, 349.23, 311.13];
      for (var i = 0; i < notes.length; i++) {
        var last = i === notes.length - 1;
        tone({
          type: "sawtooth", f0: notes[i], f1: last ? notes[i] * 0.86 : null,
          dur: last ? 0.55 : 0.26, at: i * 0.24, vol: 0.15, lp: 950, q: 1.2
        });
      }
    },

    // ta-daa
    fanfare: function () {
      var notes = [523.25, 659.25, 783.99, 1046.5];
      for (var i = 0; i < notes.length; i++) {
        tone({
          type: "square", f0: notes[i],
          dur: i === 3 ? 0.34 : 0.13, at: i * 0.09, vol: 0.12, lp: 3200
        });
      }
    },

    // twinkle
    sparkle: function () {
      var notes = [1318.5, 1760, 2093, 2637];
      for (var i = 0; i < notes.length; i++) {
        tone({ type: "sine", f0: notes[i], dur: 0.1, at: i * 0.045, vol: 0.1 });
      }
    },

    // mwah
    kiss: function () {
      noise({ ftype: "bandpass", f0: 2600, q: 6, dur: 0.045, vol: 0.16 });
      tone({ type: "sine", f0: 1300, f1: 620, dur: 0.09, at: 0.03, vol: 0.13 });
    },

    // notification ding
    notify: function () {
      tone({ type: "sine", f0: 880, dur: 0.1, vol: 0.1 });
      tone({ type: "sine", f0: 1174.7, dur: 0.17, at: 0.08, vol: 0.1 });
    },

    // yes, a fart
    fart: function () {
      tone({
        type: "sawtooth", f0: 110, dur: 0.45, vol: 0.22, lp: 480, q: 7,
        curve: curveOf(30, function (p) {
          return 112 - 58 * p + (Math.random() * 42 - 21);
        })
      });
    },

    // jumpscare
    scream: function () {
      tone({
        type: "sawtooth", f0: 900, dur: 0.6, vol: 0.2, lp: 2400,
        curve: curveOf(36, function (p, i) {
          return (900 - 740 * p) * (1 + 0.12 * Math.sin(i * 1.6));
        })
      });
      noise({ ftype: "highpass", f0: 800, dur: 0.6, vol: 0.1 });
    }
  };

  /* ---------- public ---------- */

  function play(name) {
    if (muted) return;
    if (!ctx) { init(); }
    if (!ctx || !SOUNDS[name]) return;
    // Do NOT bail while suspended. Nodes scheduled against a suspended
    // context still fire once it resumes (currentTime is frozen until
    // then), so kick off the resume and schedule the sound anyway -
    // otherwise the first sounds of the session are lost.
    resume();

    // don't let the same sound retrigger faster than 28ms
    var now = (window.performance && performance.now) ? performance.now() : Date.now();
    if (name === lastName && now - lastAt < 28) return;
    lastName = name; lastAt = now;

    try { SOUNDS[name](); } catch (e) {}
  }

  function setMuted(m) {
    muted = !!m;
    if (master) {
      master.gain.setTargetAtTime(muted ? 0 : 0.85, ctx.currentTime, 0.01);
    }
    try { localStorage.setItem("troll-muted", muted ? "1" : "0"); } catch (e) {}
  }

  window.SFX = {
    ready: ready,
    play: play,
    setMuted: setMuted,
    isMuted: function () { return muted; },
    state: function () { return ctx ? ctx.state : "none"; },
    names: Object.keys(SOUNDS)
  };
})();
