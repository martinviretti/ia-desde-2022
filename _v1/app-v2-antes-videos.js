(function () {
  "use strict";

  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var root = document.documentElement;

  if (!(window.gsap && window.ScrollTrigger)) root.classList.remove("motion");
  var MOTION = root.classList.contains("motion");

  /* =========================================================
     Funciones que andan con o sin animación
     ========================================================= */

  // Menú
  var menu = $("#menu"), menuBtn = $("#menuBtn");
  function setMenu(open) {
    menu.hidden = !open;
    menuBtn.setAttribute("aria-expanded", String(open));
    menuBtn.textContent = open ? "Cerrar" : "Índice";
    document.body.classList.toggle("menu-open", open);
  }
  menuBtn.addEventListener("click", function () { setMenu(menu.hidden); });
  $$("#menu a").forEach(function (a) { a.addEventListener("click", function () { setMenu(false); }); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") setMenu(false); });

  // Capítulo actual en la barra
  var chapterEl = $("#chapter");
  var chapterIO = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (en.isIntersecting && en.target.id !== "top") chapterEl.textContent = en.target.dataset.chapter;
      if (en.isIntersecting && en.target.id === "top" && !MOTION) chapterEl.textContent = "2022";
    });
  }, { rootMargin: "-45% 0px -50% 0px" });
  $$("[data-chapter]").forEach(function (s) { chapterIO.observe(s); });

  // Tu día: control 2022 / hoy
  var moments = $("#moments"), split = $("#split"), userDragged = false;
  var momentEls = $$(".moment", moments);
  function setSplit(v) {
    var n = momentEls.length;
    momentEls.forEach(function (m, k) { m.classList.toggle("is-b", v >= ((k + 0.5) / n) * 100); });
    split.value = v;
  }
  split.addEventListener("input", function () { userDragged = true; setSplit(+split.value); });

  // Demo interactiva de próxima palabra
  (function demo() {
    var textEl = $("#demoText"), optsEl = $("#demoOptions"), sampleBtn = $("#demoSample"), resetBtn = $("#demoReset");
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
    var chosen = [], current = FIRST;
    function temperature() { var r = $('input[name="temp"]:checked'); return r ? parseFloat(r.value) : 1; }
    function adjusted(list) {
      var t = temperature();
      var w = list.map(function (p) { return Math.pow(p[1], 1 / t); });
      var sum = w.reduce(function (s, v) { return s + v; }, 0);
      return list.map(function (p, i) { return [p[0], w[i] / sum]; });
    }
    function renderText() {
      textEl.textContent = START;
      chosen.forEach(function (tok) {
        textEl.appendChild(document.createTextNode(" "));
        var s = document.createElement("span"); s.className = "new"; s.textContent = tok; textEl.appendChild(s);
      });
    }
    function renderOptions() {
      optsEl.innerHTML = "";
      var done = $(".demo-done"); if (done) done.remove();
      if (!current) {
        var p = document.createElement("p");
        p.className = "demo-done";
        p.textContent = "Y así sigue, un token por vez, hasta que el modelo predice que la respuesta terminó. Una respuesta larga son miles de estos pasos.";
        optsEl.after(p);
        sampleBtn.disabled = true;
        return;
      }
      sampleBtn.disabled = false;
      adjusted(current).forEach(function (pair) {
        var li = document.createElement("li"), btn = document.createElement("button");
        btn.type = "button"; btn.className = "opt"; btn.dataset.tok = pair[0];
        btn.setAttribute("aria-label", pair[0] + ", " + Math.round(pair[1] * 100) + " por ciento");
        btn.innerHTML = '<span class="opt-tok"></span><span class="opt-bar"></span><span class="opt-pct"></span>';
        btn.querySelector(".opt-tok").textContent = pair[0];
        btn.querySelector(".opt-pct").textContent = Math.round(pair[1] * 100) + "%";
        btn.addEventListener("click", function () { pick(pair[0], btn); });
        li.appendChild(btn); optsEl.appendChild(li);
        var bar = btn.querySelector(".opt-bar");
        requestAnimationFrame(function () { bar.style.width = (pair[1] * 100).toFixed(1) + "%"; });
      });
    }
    function pick(tok, btn) {
      if (!current) return;
      if (btn) btn.classList.add("picked");
      $$(".opt", optsEl).forEach(function (b) { b.disabled = true; });
      setTimeout(function () {
        chosen.push(tok);
        current = chosen.length === 1 ? SECOND[tok] : null;
        renderText(); renderOptions();
      }, 380);
    }
    function sample() {
      if (!current) return;
      var list = adjusted(current), r = Math.random(), acc = 0, tok = list[list.length - 1][0];
      for (var i = 0; i < list.length; i++) { acc += list[i][1]; if (r <= acc) { tok = list[i][0]; break; } }
      pick(tok, $('.opt[data-tok="' + tok + '"]', optsEl));
    }
    $$('input[name="temp"]').forEach(function (r) { r.addEventListener("change", renderOptions); });
    sampleBtn.addEventListener("click", sample);
    resetBtn.addEventListener("click", function () { chosen = []; current = FIRST; renderText(); renderOptions(); });
    renderText(); renderOptions();
  })();

  // Tabs de profesiones
  (function tabs() {
    var tabsEls = $$('#roles [role="tab"]');
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
        if (n) { e.preventDefault(); n.focus(); select(n); }
      });
    });
  })();

  // Glosario
  (function glossary() {
    var input = $("#glossFilter"), items = $$("#gloss > div"), empty = $("#glossEmpty");
    function norm(s) { return s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, ""); }
    var index = items.map(function (d) { return norm(d.textContent); });
    input.addEventListener("input", function () {
      var q = norm(input.value.trim()), shown = 0;
      items.forEach(function (d, i) { var ok = !q || index[i].indexOf(q) !== -1; d.hidden = !ok; if (ok) shown++; });
      empty.hidden = shown !== 0;
    });
  })();

  // Datos de las escenas
  var GEN = [
    { opts: [["es", .46], ["me", .21], ["siempre", .14], ["con", .11], ["de", .08]], pick: 0,
      cap: "Mira todo el texto anterior y calcula una probabilidad para cada palabra que podría venir." },
    { opts: [["sagrado", .31], ["lo", .24], ["mi", .19], ["el", .15], ["un", .11]], pick: 0,
      cap: "Elige una, la suma al texto y vuelve a calcular, ahora con una palabra más." },
    { opts: [[".", .38], [",", .22], ["para", .18], ["en", .13], ["y", .09]], pick: 2,
      cap: "No siempre elige la más probable: un poco de azar hace que suene natural. Acá eligió \"para\"." },
    { opts: [["mí", .52], ["muchos", .21], ["los", .14], ["todos", .08], ["cualquiera", .05]], pick: 0,
      cap: "Palabra por palabra. Ese es todo el truco. Lo asombroso es lo que aparece cuando lo hace un modelo gigante, entrenado con casi todo lo escrito." }
  ];
  var genBars = $("#genBars"), genOut = $("#genOut"), genCap = $("#genCap");
  for (var g = 0; g < 5; g++) {
    var li = document.createElement("li");
    li.innerHTML = '<span class="gb-tok"></span><span class="gb-bar"></span><span class="gb-pct"></span>';
    genBars.appendChild(li);
  }
  var genRows = $$("li", genBars);
  function renderGen(p) {
    var total = GEN.length, x = Math.min(p * total, total - 0.0001);
    var i = Math.floor(x), f = x - i, step = GEN[i];
    var grow = Math.min(f / 0.35, 1);
    genRows.forEach(function (row, k) {
      var o = step.opts[k];
      row.querySelector(".gb-tok").textContent = o[0];
      row.querySelector(".gb-pct").textContent = Math.round(o[1] * 100) + "%";
      row.querySelector(".gb-bar").style.transform = "scaleX(" + (o[1] * grow).toFixed(3) + ")";
      row.classList.toggle("pick", f > 0.5 && k === step.pick);
    });
    var words = [];
    for (var s = 0; s < total; s++) {
      if (s < i || (s === i && f > 0.75)) words.push(GEN[s].opts[GEN[s].pick][0]);
    }
    var html = "";
    words.forEach(function (w) { html += (w === "." || w === "," ? "" : " ") + '<span class="tk">' + w + "</span>"; });
    if (p > 0.985) html += '<span class="tk">.</span>';
    genOut.innerHTML = html;
    if (genCap.textContent !== step.cap) genCap.textContent = step.cap;
  }

  var logs = $$("#agentLog li"), phases = $$(".ring .ph"), ringProg = $("#ringProg"), agentTime = $("#agentTime");
  var RING = 653.5;
  function renderAgent(p) {
    var N = logs.length, x = p * (N + 0.8), cur = -1;
    logs.forEach(function (li, k) {
      var show = x > k + 0.15;
      if (show) { li.setAttribute("data-show", ""); cur = k; } else li.removeAttribute("data-show");
    });
    logs.forEach(function (li, k) { li.classList.toggle("cur", k === cur); li.classList.toggle("old", k < cur - 3); });
    var ph = cur >= 0 ? logs[cur].dataset.ph : "";
    phases.forEach(function (g) { g.classList.toggle("on", g.dataset.ph === ph); });
    var done = Math.min(x / N, 1);
    ringProg.style.strokeDashoffset = (RING * (1 - done)).toFixed(1);
    var secs = Math.round(done * 252);
    agentTime.textContent = String(Math.floor(secs / 60)).padStart(2, "0") + ":" + String(secs % 60).padStart(2, "0");
  }

  function formatNum(v, dec) {
    return dec ? v.toFixed(dec).replace(".", ",") : String(Math.round(v)).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  }
  function setStat(el, v) {
    el.textContent = (el.dataset.pre || "") + formatNum(v, +el.dataset.dec || 0) + (el.dataset.suf || "");
  }

  /* =========================================================
     Sin animación: estado final estático
     ========================================================= */
  if (!MOTION) {
    split.closest(".day-control").hidden = true;
    renderGen(1);
    renderAgent(1);
    $("#inject").classList.add("revealed");
    $$(".d-agent li").forEach(function (li) { li.setAttribute("data-done", "1"); });
    $$(".stat-num").forEach(function (el) { setStat(el, +el.dataset.to); });
    $("#raceMonth").textContent = "2";
    $("#raceUnit").textContent = "meses le alcanzaron a ChatGPT";
    return;
  }

  /* =========================================================
     Con animación (GSAP + ScrollTrigger)
     ========================================================= */
  gsap.registerPlugin(ScrollTrigger);

  // Barra de progreso general
  gsap.to(".progress span", { scaleX: 1, ease: "none", scrollTrigger: { start: 0, end: "max", scrub: true } });

  /* ---------- Escena 1: el quiebre ---------- */
  (function intro() {
    var q = $("#q"), qText = q.textContent; q.textContent = "";
    var ans = $("#ans"), ansWords = ans.textContent.split(" "); ans.textContent = "";
    var qp = { n: 0 }, ap = { n: 0 };
    var agentItems = $$(".d-agent li");

    gsap.set(".d-results li", { autoAlpha: 0, y: 12 });
    gsap.set(".bubble.user", { autoAlpha: 0, y: 16 });
    gsap.set(agentItems, { autoAlpha: 0, x: -18 });

    var tl = gsap.timeline({
      defaults: { ease: "none" },
      scrollTrigger: {
        trigger: "#top", start: "top top", end: "+=650%", scrub: 0.8, pin: true, anticipatePin: 1, invalidateOnRefresh: true,
        onUpdate: function (self) { chapterEl.textContent = self.progress > 0.27 ? "2026" : "2022"; }
      }
    });

    // 2022: la foto del escritorio se acerca despacio
    tl.fromTo(".intro-photo img", { scale: 1.04 }, { scale: 1.16, duration: 2.8 }, 0);
    // Se escribe la búsqueda
    tl.to(".d-ph-a", { autoAlpha: 0, duration: 0.1 }, 0.25);
    tl.to(qp, { n: qText.length, duration: 1, onUpdate: function () { q.textContent = qText.slice(0, Math.round(qp.n)); } }, 0.3);
    // Diez links
    tl.to(".intro-head", { autoAlpha: 0, y: -24, duration: 0.4 }, 1.35);
    tl.to(".d-results li", { autoAlpha: 1, y: 0, stagger: 0.12, duration: 0.4, ease: "power2.out" }, 1.4);
    tl.fromTo(".c1", { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, duration: 0.4 }, 1.6);

    // El quiebre
    tl.to(".c1", { autoAlpha: 0, duration: 0.3 }, 2.7);
    tl.to([".d-results", ".d-search"], { autoAlpha: 0, y: 24, duration: 0.4 }, 2.7);
    tl.to(".intro-dark", { clipPath: "circle(150% at 50% 58%)", duration: 1.1, ease: "power2.in" }, 2.8);
    tl.to(".intro-pin", { "--i-fg": "#ededee", "--i-muted": "#a0a0aa", duration: 0.5 }, 3.2);
    tl.to(".date-slam", { autoAlpha: 1, duration: 0.15 }, 3.2);
    tl.fromTo(".ds-num", { scale: 1.9, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: 0.8, ease: "power3.out" }, 3.2);
    tl.fromTo(".ds-txt", { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, duration: 0.4 }, 3.7);
    tl.fromTo(".c2", { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, duration: 0.4 }, 3.9);

    // El buscador se vuelve chat
    tl.to(".date-slam", { autoAlpha: 0, scale: 0.92, duration: 0.4 }, 4.7);
    tl.to(".c2", { autoAlpha: 0, duration: 0.3 }, 4.7);
    tl.to([".d-q", ".d-search .caret"], { autoAlpha: 0, duration: 0.1 }, 4.8);
    tl.to(".d-frame", { autoAlpha: 1, duration: 0.4 }, 4.9);
    tl.to(".intro-glow", { autoAlpha: 1, duration: 0.6 }, 4.9);
    tl.to(".d-search", { autoAlpha: 1, y: 0, top: function () { return $(".device").offsetHeight - 56; }, backgroundColor: "#1e1e23", borderColor: "#2a2a30", boxShadow: "0 0 0 rgba(0,0,0,0)", duration: 0.5 }, 4.9);
    tl.to(".d-ph-b", { autoAlpha: 1, duration: 0.3 }, 5.1);
    tl.to(".d-chat", { autoAlpha: 1, duration: 0.2 }, 5.2);
    tl.to(".bubble.user", { autoAlpha: 1, y: 0, duration: 0.4, ease: "power2.out" }, 5.25);
    tl.fromTo(".c3", { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, duration: 0.4 }, 5.3);
    tl.to(ap, { n: ansWords.length, duration: 1.5, onUpdate: function () { ans.textContent = ansWords.slice(0, Math.round(ap.n)).join(" "); } }, 5.7);

    // El chat se vuelve agente
    tl.to(".d-chat", { autoAlpha: 0, y: -24, duration: 0.4 }, 7.5);
    tl.to(".c3", { autoAlpha: 0, duration: 0.3 }, 7.5);
    tl.to([".d-search", ".d-ph-b"], { autoAlpha: 0, duration: 0.3 }, 7.5);
    tl.fromTo(".c4", { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, duration: 0.4 }, 7.7);
    tl.to(".d-agent", { autoAlpha: 1, duration: 0.2 }, 7.7);
    agentItems.forEach(function (li, i) {
      var t = 7.8 + i * 0.45;
      tl.to(li, { autoAlpha: 1, x: 0, duration: 0.25, ease: "power2.out" }, t);
      if (!li.classList.contains("wait")) tl.set(li, { attr: { "data-done": "1" } }, t + 0.3);
    });

    // Volviste a otro mundo
    tl.to(".device", { autoAlpha: 0, scale: 0.92, duration: 0.5 }, 10.6);
    tl.to(".intro-glow", { autoAlpha: 0, duration: 0.4 }, 10.6);
    tl.fromTo(".ie-photo img", { scale: 1.3 }, { scale: 1.04, duration: 1.6, ease: "power2.out" }, 10.9);
    tl.to(".c4", { autoAlpha: 0, duration: 0.3 }, 10.6);
    tl.to(".intro-end", { autoAlpha: 1, duration: 0.2 }, 10.9);
    tl.fromTo(".ie-big", { autoAlpha: 0, y: 50, scale: 0.96 }, { autoAlpha: 1, y: 0, scale: 1, duration: 0.6, ease: "power3.out" }, 10.9);
    tl.fromTo(".ie-sub", { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, duration: 0.4 }, 11.3);
    tl.to({}, { duration: 0.8 }, 11.7);
  })();

  /* ---------- Escena 2: la carrera ---------- */
  (function race() {
    var lanes = $$(".lane").map(function (el) {
      return { target: +el.dataset.target, bar: $(".lane-bar", el), tag: $(".lane-tag", el) };
    });
    var monthEl = $("#raceMonth"), unitEl = $("#raceUnit"), weekly = $("#weekly");
    var st = { m: 0 }, wk = { v: 0 };
    function render() {
      var m = st.m;
      monthEl.textContent = m < 1 ? formatNum(m, 1) : String(Math.floor(m));
      unitEl.textContent = Math.floor(m) === 1 ? "mes" : "meses";
      lanes.forEach(function (l) {
        var p = Math.min(m / l.target, 1);
        l.bar.style.width = (p * 100).toFixed(2) + "%";
        gsap.set(l.tag, { autoAlpha: p >= 1 ? 1 : 0 });
      });
    }
    render();
    gsap.set(".race-after", { autoAlpha: 0, y: 30 });
    weekly.textContent = "0";
    var tl = gsap.timeline({ scrollTrigger: { trigger: "#carrera", start: "top top", end: "+=260%", scrub: 0.6, pin: true, anticipatePin: 1 } });
    tl.to(st, { m: 30, duration: 3, ease: "power1.in", onUpdate: render });
    tl.to(".race-after", { autoAlpha: 1, y: 0, duration: 0.5, ease: "power2.out" }, 3.1);
    tl.to(wk, { v: 800, duration: 0.8, ease: "power2.out", onUpdate: function () { weekly.textContent = Math.round(wk.v); } }, 3.15);
    tl.to({}, { duration: 0.6 });
  })();

  /* ---------- Escena 3: línea de tiempo horizontal (desktop) ---------- */
  var mm = gsap.matchMedia();
  mm.add("(min-width: 900px)", function () {
    var track = $(".h-track");
    var dist = function () { return track.scrollWidth - window.innerWidth; };
    var pan = gsap.to(track, {
      x: function () { return -dist(); }, ease: "none",
      scrollTrigger: { trigger: "#timeline", start: "top top", end: function () { return "+=" + dist(); }, pin: true, scrub: 1, invalidateOnRefresh: true, anticipatePin: 1 }
    });
    gsap.to(".hp-bar", { scaleX: 1, ease: "none", scrollTrigger: { trigger: "#timeline", start: "top top", end: function () { return "+=" + dist(); }, scrub: true, invalidateOnRefresh: true } });
    $$(".year").forEach(function (year) {
      gsap.fromTo($(".year-big", year), { xPercent: 25 }, { xPercent: -25, ease: "none", scrollTrigger: { trigger: year, containerAnimation: pan, start: "left right", end: "right left", scrub: true } });
      gsap.fromTo($(".year-media img", year), { xPercent: -14 }, { xPercent: 0, ease: "none", scrollTrigger: { trigger: year, containerAnimation: pan, start: "left right", end: "right left", scrub: true } });
      gsap.fromTo($$("li, h3, .year-num", year), { autoAlpha: 0, y: 26 }, { autoAlpha: 1, y: 0, stagger: 0.07, duration: 0.6, ease: "power3.out", scrollTrigger: { trigger: year, containerAnimation: pan, start: "left 70%", toggleActions: "play none none reverse" } });
    });
  });

  /* ---------- Escena 4: tu día (el control avanza con el scroll) ---------- */
  setSplit(0);
  ScrollTrigger.create({
    trigger: "#moments", start: "top 70%", end: "bottom 65%",
    onUpdate: function (self) { if (!userDragged) setSplit(Math.round(self.progress * 100)); }
  });

  /* ---------- Escena 5: generación palabra por palabra ---------- */
  renderGen(0);
  ScrollTrigger.create({
    trigger: "#gen", start: "top top", end: "+=320%", pin: true, scrub: true, anticipatePin: 1,
    onUpdate: function (self) { renderGen(self.progress); }
  });

  /* ---------- Escena 6: capas que se apilan ---------- */
  gsap.fromTo(".layer", { y: 70, autoAlpha: 0 }, {
    y: 0, autoAlpha: 1, stagger: { each: 0.15, from: "end" }, ease: "power2.out",
    scrollTrigger: { trigger: "#stack", start: "top 80%", end: "bottom 65%", scrub: 0.6 }
  });

  /* ---------- Escena 7: agente en vivo ---------- */
  renderAgent(0);
  ScrollTrigger.create({
    trigger: "#agent", start: "top top", end: "+=340%", pin: true, scrub: true, anticipatePin: 1,
    onUpdate: function (self) { renderAgent(self.progress); }
  });

  /* ---------- Escena 8: prompt injection ---------- */
  ScrollTrigger.create({
    trigger: "#inject", start: "top 62%",
    onEnter: function () { $("#inject").classList.add("revealed"); },
    onLeaveBack: function () { $("#inject").classList.remove("revealed"); }
  });

  /* ---------- Escena 9: números y línea regulatoria ---------- */
  $$(".stat-num").forEach(function (el) {
    var o = { v: 0 }, to = +el.dataset.to;
    setStat(el, 0);
    gsap.to(o, { v: to, duration: 1.6, ease: "power2.out", onUpdate: function () { setStat(el, o.v); }, onComplete: function () { setStat(el, to); }, scrollTrigger: { trigger: el, start: "top 85%", once: true } });
  });
  gsap.fromTo("#regLine", { "--draw": 0 }, { "--draw": 1, ease: "none", scrollTrigger: { trigger: "#regLine", start: "top 85%", end: "top 45%", scrub: true } });

  /* ---------- Imágenes: parallax y reveals ---------- */
  gsap.fromTo(".band-img", { yPercent: -7 }, { yPercent: 7, ease: "none", scrollTrigger: { trigger: ".band", start: "top bottom", end: "bottom top", scrub: true } });
  gsap.fromTo(".band-img img", { scale: 1.15 }, { scale: 1, ease: "none", scrollTrigger: { trigger: ".band", start: "top bottom", end: "center center", scrub: true } });
  gsap.fromTo([".band-big", ".band-sub"], { autoAlpha: 0, y: 50 }, { autoAlpha: 1, y: 0, stagger: 0.15, duration: 1, ease: "power3.out", scrollTrigger: { trigger: ".band", start: "top 45%" } });
  $$(".reveal-img").forEach(function (fig) {
    var box = $(".duo", fig), img = $("img", fig);
    gsap.to(box, { clipPath: "inset(0% 0% 0% 0% round 16px)", duration: 1.3, ease: "power3.inOut", scrollTrigger: { trigger: fig, start: "top 82%" } });
    gsap.fromTo(img, { scale: 1.25 }, { scale: 1, duration: 1.8, ease: "power3.out", scrollTrigger: { trigger: fig, start: "top 82%" } });
  });
  gsap.fromTo(".ib-img img", { yPercent: -6, scale: 1.12 }, { yPercent: 6, scale: 1.12, ease: "none", scrollTrigger: { trigger: ".impact-band", start: "top bottom", end: "bottom top", scrub: true } });
  gsap.fromTo(".outro-photo img", { scale: 1.2 }, { scale: 1, ease: "none", scrollTrigger: { trigger: "#seguir", start: "top bottom", end: "top top", scrub: true } });

  /* ---------- Títulos palabra por palabra y reveals ---------- */
  $$(".split").forEach(function (el) {
    el.innerHTML = el.textContent.trim().split(/\s+/).map(function (w) { return '<span class="w"><span>' + w + "</span></span>"; }).join(" ");
    gsap.fromTo($$(".w > span", el), { y: 0, yPercent: 105 }, {
      yPercent: 0, duration: 0.9, ease: "power4.out", stagger: 0.06,
      scrollTrigger: { trigger: el, start: "top 85%", toggleActions: "play none none none" }
    });
  });
  var rvIO = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (!en.isIntersecting) return;
      gsap.fromTo(en.target, { autoAlpha: 0, y: 32 }, { autoAlpha: 1, y: 0, duration: 0.9, ease: "power3.out" });
      rvIO.unobserve(en.target);
    });
  }, { rootMargin: "0px 0px -8% 0px" });
  $$(".rv").forEach(function (el) { rvIO.observe(el); });

  // Recalcular cuando cargan las fuentes (cambian las alturas)
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { ScrollTrigger.refresh(); });
  window.addEventListener("load", function () { ScrollTrigger.refresh(); });
})();
