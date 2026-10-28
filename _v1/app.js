(function () {
  "use strict";

  var root = document.documentElement;
  root.classList.add("js");
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Tema ---------- */
  var stored = null;
  try { stored = localStorage.getItem("theme"); } catch (e) {}
  if (stored === "light" || stored === "dark") root.setAttribute("data-theme", stored);

  document.getElementById("themeToggle").addEventListener("click", function () {
    var current = root.getAttribute("data-theme") ||
      (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    var next = current === "dark" ? "light" : "dark";
    root.setAttribute("data-theme", next);
    try { localStorage.setItem("theme", next); } catch (e) {}
  });

  /* ---------- Índice móvil ---------- */
  var menuBtn = document.getElementById("menuToggle");
  function setMenu(open) {
    document.body.classList.toggle("toc-open", open);
    menuBtn.setAttribute("aria-expanded", String(open));
  }
  menuBtn.addEventListener("click", function () {
    setMenu(!document.body.classList.contains("toc-open"));
  });
  document.querySelectorAll(".toc a").forEach(function (a) {
    a.addEventListener("click", function () { setMenu(false); });
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") setMenu(false);
  });

  /* ---------- Sección activa en el índice ---------- */
  var tocLinks = {};
  document.querySelectorAll(".toc a").forEach(function (a) {
    tocLinks[a.getAttribute("href").slice(1)] = a;
  });
  var sectionObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      Object.keys(tocLinks).forEach(function (id) { tocLinks[id].classList.remove("active"); });
      var link = tocLinks[entry.target.id];
      if (link) link.classList.add("active");
    });
  }, { rootMargin: "-40% 0px -55% 0px" });
  document.querySelectorAll("main .section").forEach(function (s) { sectionObserver.observe(s); });

  /* ---------- Entrada al hacer scroll ---------- */
  if (!reduceMotion && "IntersectionObserver" in window) {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          revealObserver.unobserve(entry.target);
        }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    document.querySelectorAll(".section > *").forEach(function (el) {
      el.classList.add("reveal");
      revealObserver.observe(el);
    });
  }

  /* ---------- Hero: los dos mundos ---------- */
  (function drawWorlds() {
    var svg = document.getElementById("worlds");
    if (!svg) return;
    var NS = "http://www.w3.org/2000/svg";
    var seed = 20221130;
    function rand() {
      seed |= 0; seed = (seed + 0x6D2B79F5) | 0;
      var t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    }
    function el(name, attrs, text) {
      var node = document.createElementNS(NS, name);
      Object.keys(attrs).forEach(function (k) { node.setAttribute(k, attrs[k]); });
      if (text) node.textContent = text;
      svg.appendChild(node);
      return node;
    }
    var BREAK = 232;

    // Mundo A: pocos puntos, quietos
    for (var i = 0; i < 16; i++) {
      var a = el("circle", {
        cx: (28 + rand() * (BREAK - 60)).toFixed(1),
        cy: (60 + rand() * 340).toFixed(1),
        r: (2.5 + rand() * 2.5).toFixed(1),
        class: "w-dot w-dot-a"
      });
      a.style.setProperty("--o", "0.7");
      a.style.animationDelay = (i * 40) + "ms";
    }

    // Mundo B: densidad que crece hacia la derecha
    for (var j = 0; j < 190; j++) {
      var x = BREAK + 24 + Math.sqrt(rand()) * (572 - BREAK - 24);
      var o = (0.3 + rand() * 0.7).toFixed(2);
      var b = el("circle", {
        cx: x.toFixed(1),
        cy: (78 + rand() * 334).toFixed(1),
        r: (1.8 + rand() * 5).toFixed(1),
        class: "w-dot w-dot-b"
      });
      b.style.setProperty("--o", o);
      b.style.animationDelay = (700 + (x - BREAK) * 3.2 + rand() * 220).toFixed(0) + "ms";
    }

    el("line", { x1: BREAK, y1: 20, x2: BREAK, y2: 430, class: "w-line" });
    el("text", { x: BREAK + 12, y: 34, class: "w-date" }, "30 nov 2022");
    el("text", { x: BREAK + 12, y: 54, class: "w-label" }, "llega ChatGPT");
    el("text", { x: 28, y: 462, class: "w-name" }, "Mundo A");
    el("text", { x: 572, y: 462, class: "w-name", "text-anchor": "end" }, "Mundo B");
  })();

  /* ---------- Demo de próxima palabra ---------- */
  (function demo() {
    var textEl = document.getElementById("demoText");
    var optsEl = document.getElementById("demoOptions");
    var sampleBtn = document.getElementById("demoSample");
    var resetBtn = document.getElementById("demoReset");
    if (!textEl) return;

    var START = "Esta tarde voy a tomar un café con";
    var FIRST = [["mi", .34], ["amigos", .22], ["leche", .18], ["vos", .11], ["medialunas", .08], ["el", .07]];
    var SECOND = {
      "mi": [["hermana", .30], ["mamá", .24], ["jefe", .18], ["equipo", .13], ["novia", .09], ["perro", .06]],
      "amigos": [["del", .34], ["de", .26], ["en", .17], ["para", .13], ["que", .10]],
      "leche": [["y", .38], ["en", .21], ["porque", .16], ["antes", .13], ["fría", .12]],
      "vos": [["y", .33], ["si", .27], ["en", .18], ["para", .14], ["después", .08]],
      "medialunas": [["en", .36], ["y", .30], ["de", .17], ["antes", .10], ["calentitas", .07]],
      "el": [["equipo", .31], ["jefe", .25], ["cliente", .21], ["vecino", .14], ["abuelo", .09]]
    };

    var chosen = [];
    var current = FIRST;

    function temperature() {
      var r = document.querySelector('input[name="temp"]:checked');
      return r ? parseFloat(r.value) : 1;
    }
    function adjusted(list) {
      var t = temperature();
      var w = list.map(function (p) { return Math.pow(p[1], 1 / t); });
      var sum = w.reduce(function (s, v) { return s + v; }, 0);
      return list.map(function (p, i) { return [p[0], w[i] / sum]; });
    }
    function renderText() {
      textEl.innerHTML = "";
      textEl.appendChild(document.createTextNode(START));
      chosen.forEach(function (tok) {
        textEl.appendChild(document.createTextNode(" "));
        var s = document.createElement("span");
        s.className = "new";
        s.textContent = tok;
        textEl.appendChild(s);
      });
    }
    function renderOptions() {
      optsEl.innerHTML = "";
      var done = document.querySelector(".demo-done");
      if (done) done.remove();
      if (!current) {
        var p = document.createElement("p");
        p.className = "demo-done";
        p.textContent = "Y así sigue, un token por vez, hasta que el modelo predice que la respuesta terminó. Una respuesta larga son cientos o miles de estos pasos.";
        optsEl.after(p);
        sampleBtn.disabled = true;
        return;
      }
      sampleBtn.disabled = false;
      adjusted(current).forEach(function (pair) {
        var li = document.createElement("li");
        var btn = document.createElement("button");
        btn.type = "button";
        btn.className = "opt";
        btn.dataset.tok = pair[0];
        btn.setAttribute("aria-label", pair[0] + ", " + Math.round(pair[1] * 100) + " por ciento");
        btn.innerHTML = '<span class="opt-tok"></span><span class="opt-bar"></span><span class="opt-pct"></span>';
        btn.querySelector(".opt-tok").textContent = pair[0];
        btn.querySelector(".opt-pct").textContent = Math.round(pair[1] * 100) + "%";
        btn.addEventListener("click", function () { pick(pair[0], btn); });
        li.appendChild(btn);
        optsEl.appendChild(li);
        var bar = btn.querySelector(".opt-bar");
        requestAnimationFrame(function () { bar.style.width = (pair[1] * 100).toFixed(1) + "%"; });
      });
    }
    function pick(tok, btn) {
      if (!current) return;
      if (btn) btn.classList.add("picked");
      optsEl.querySelectorAll(".opt").forEach(function (b) { b.disabled = true; });
      setTimeout(function () {
        chosen.push(tok);
        current = chosen.length === 1 ? SECOND[tok] : null;
        renderText();
        renderOptions();
      }, reduceMotion ? 0 : 380);
    }
    function sample() {
      if (!current) return;
      var list = adjusted(current);
      var r = Math.random(), acc = 0, tok = list[list.length - 1][0];
      for (var i = 0; i < list.length; i++) {
        acc += list[i][1];
        if (r <= acc) { tok = list[i][0]; break; }
      }
      var btn = optsEl.querySelector('.opt[data-tok="' + tok + '"]');
      pick(tok, btn);
    }
    function reset() {
      chosen = [];
      current = FIRST;
      renderText();
      renderOptions();
    }

    document.querySelectorAll('input[name="temp"]').forEach(function (r) {
      r.addEventListener("change", renderOptions);
    });
    sampleBtn.addEventListener("click", sample);
    resetBtn.addEventListener("click", reset);
    reset();
  })();

  /* ---------- Tabs de profesiones ---------- */
  (function tabs() {
    var tabsEls = Array.prototype.slice.call(document.querySelectorAll('#roles [role="tab"]'));
    function select(tab) {
      tabsEls.forEach(function (t) {
        var on = t === tab;
        t.setAttribute("aria-selected", String(on));
        t.tabIndex = on ? 0 : -1;
        document.getElementById(t.getAttribute("aria-controls")).hidden = !on;
      });
    }
    tabsEls.forEach(function (t, i) {
      t.addEventListener("click", function () { select(t); });
      t.addEventListener("keydown", function (e) {
        var n = null;
        if (e.key === "ArrowRight") n = tabsEls[(i + 1) % tabsEls.length];
        if (e.key === "ArrowLeft") n = tabsEls[(i - 1 + tabsEls.length) % tabsEls.length];
        if (e.key === "Home") n = tabsEls[0];
        if (e.key === "End") n = tabsEls[tabsEls.length - 1];
        if (n) { e.preventDefault(); n.focus(); select(n); }
      });
    });
  })();

  /* ---------- Filtro del glosario ---------- */
  (function glossary() {
    var input = document.getElementById("glossFilter");
    var items = Array.prototype.slice.call(document.querySelectorAll("#gloss > div"));
    var empty = document.getElementById("glossEmpty");
    function norm(s) { return s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, ""); }
    var index = items.map(function (d) { return norm(d.textContent); });
    input.addEventListener("input", function () {
      var q = norm(input.value.trim());
      var shown = 0;
      items.forEach(function (d, i) {
        var ok = !q || index[i].indexOf(q) !== -1;
        d.hidden = !ok;
        if (ok) shown++;
      });
      empty.hidden = shown !== 0;
    });
  })();
})();
