"use strict";

(function () {
  var root = document.documentElement;

  function safeGet(key) { try { return localStorage.getItem(key); } catch (e) { return null; } }
  function safeSet(key, value) { try { localStorage.setItem(key, value); } catch (e) { /* storage dimatikan: abaikan */ } }

  // ============================== Bahasa (ID / EN) ==============================
  var EN = (window.I18N && window.I18N.en) || {};
  var WA_BASE = "https://wa.me/6281329844484";
  var lang = "id";

  // Crawler tetap melihat bahasa Indonesia (bahasa utama situs), tidak ikut deteksi bahasa mesin.
  var isBot = /bot|crawl|spider|slurp|lighthouse|facebookexternalhit|preview/i.test(navigator.userAgent || "");

  function detectLang() {
    var param = new URLSearchParams(window.location.search).get("lang");
    if (param === "id" || param === "en") { return param; }
    var saved = safeGet("lang");
    if (saved === "id" || saved === "en") { return saved; }
    if (isBot) { return "id"; }
    var list = (navigator.languages && navigator.languages.length) ? navigator.languages : [navigator.language || "id"];
    return String(list[0] || "id").toLowerCase().indexOf("id") === 0 ? "id" : "en";
  }

  function tr(key, fallback) { return lang === "en" && EN[key] ? EN[key] : fallback; }

  function setMeta(selector, attr, value) {
    var el = document.querySelector(selector);
    if (el) { el.setAttribute(attr, value); }
  }

  function applyLang(next) {
    lang = next;
    root.setAttribute("lang", lang);

    document.querySelectorAll("[data-i18n]").forEach(function (el) {
      if (el.dataset.orig === undefined) { el.dataset.orig = el.innerHTML; }
      var en = EN[el.getAttribute("data-i18n")];
      el.innerHTML = lang === "en" && en ? en : el.dataset.orig;
    });
    [["data-i18n-ph", "placeholder"], ["data-i18n-aria", "aria-label"], ["data-i18n-alt", "alt"]].forEach(function (pair) {
      document.querySelectorAll("[" + pair[0] + "]").forEach(function (el) {
        var store = "data-orig-" + pair[1];
        if (!el.hasAttribute(store)) { el.setAttribute(store, el.getAttribute(pair[1]) || ""); }
        var en = EN[el.getAttribute(pair[0])];
        el.setAttribute(pair[1], lang === "en" && en ? en : el.getAttribute(store));
      });
    });

    var meta = { title: document.title, desc: "", ogTitle: "", ogDesc: "" };
    if (!applyLang.base) {
      applyLang.base = {
        title: document.title,
        desc: (document.querySelector('meta[name="description"]') || {}).content || "",
        ogTitle: (document.querySelector('meta[property="og:title"]') || {}).content || "",
        ogDesc: (document.querySelector('meta[property="og:description"]') || {}).content || ""
      };
    }
    meta = applyLang.base;
    document.title = tr("meta_title", meta.title);
    setMeta('meta[name="description"]', "content", tr("meta_desc", meta.desc));
    setMeta('meta[property="og:title"]', "content", tr("og_title", meta.ogTitle));
    setMeta('meta[property="og:description"]', "content", tr("og_desc", meta.ogDesc));
    setMeta('meta[property="og:locale"]', "content", lang === "en" ? "en_US" : "id_ID");

    // Tautan WhatsApp dengan teks salam siap pakai
    var hello = lang === "en" ? EN.wa_hello : "Halo Surya, saya ingin diskusi proyek.";
    document.querySelectorAll('a[href^="' + WA_BASE + '?text="]').forEach(function (a) {
      a.setAttribute("href", WA_BASE + "?text=" + encodeURIComponent(hello));
    });

    document.querySelectorAll("[data-lang]").forEach(function (btn) {
      var active = btn.getAttribute("data-lang") === lang;
      btn.classList.toggle("is-active", active);
      btn.setAttribute("aria-pressed", String(active));
    });
  }

  document.querySelectorAll("[data-lang]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var next = btn.getAttribute("data-lang");
      applyLang(next);
      safeSet("lang", next);
    });
  });

  // ============================== Tema (terang/gelap) ==============================
  var savedTheme = safeGet("theme");
  var prefersLight = window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches;
  applyTheme(savedTheme || (prefersLight ? "light" : "dark"));

  function applyTheme(theme) {
    root.setAttribute("data-theme", theme);
    var icon = document.querySelector("[data-theme-icon]");
    if (icon) { icon.textContent = theme === "dark" ? "☾" : "☀"; }
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) { meta.setAttribute("content", theme === "dark" ? "#0b1020" : "#f6f8ff"); }
  }

  var themeBtn = document.querySelector("[data-theme-toggle]");
  if (themeBtn) {
    themeBtn.addEventListener("click", function () {
      var next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
      applyTheme(next);
      safeSet("theme", next);
    });
  }

  // ============================== Navigasi ==============================
  var nav = document.querySelector("[data-nav]");
  function onScroll() { if (nav) { nav.classList.toggle("is-scrolled", window.scrollY > 8); } }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  var menu = document.getElementById("menu");
  var menuBtn = document.querySelector("[data-menu-toggle]");
  if (menu && menuBtn) {
    menuBtn.addEventListener("click", function () {
      var open = menu.classList.toggle("open");
      menuBtn.setAttribute("aria-expanded", String(open));
    });
    menu.addEventListener("click", function (e) {
      if (e.target.tagName === "A") { menu.classList.remove("open"); menuBtn.setAttribute("aria-expanded", "false"); }
    });
  }

  // ============================== Filter proyek ==============================
  var chips = document.querySelectorAll("[data-filter]");
  var projects = document.querySelectorAll("[data-projects] .project");
  chips.forEach(function (chip) {
    chip.addEventListener("click", function () {
      var filter = chip.getAttribute("data-filter");
      chips.forEach(function (c) { c.classList.toggle("is-active", c === chip); });
      projects.forEach(function (p) {
        p.hidden = !(filter === "all" || p.getAttribute("data-cat") === filter);
      });
    });
  });

  // ============================== Animasi ==============================
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { entry.target.classList.add("in"); io.unobserve(entry.target); }
      });
    }, { threshold: 0.12 });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("in"); });
  }

  var counters = document.querySelectorAll("[data-count]");
  function runCount(el) {
    var target = parseInt(el.getAttribute("data-count"), 10);
    var suffix = el.getAttribute("data-suffix") || "";
    var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce || target > 1900) { el.textContent = target + suffix; return; } // tahun: tampil langsung
    var start = null;
    function step(ts) {
      if (start === null) { start = ts; }
      var progress = Math.min((ts - start) / 1100, 1);
      el.textContent = Math.round(target * (1 - Math.pow(1 - progress, 3))) + suffix;
      if (progress < 1) { requestAnimationFrame(step); }
    }
    requestAnimationFrame(step);
  }
  if ("IntersectionObserver" in window) {
    var co = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { runCount(entry.target); co.unobserve(entry.target); }
      });
    }, { threshold: 0.5 });
    counters.forEach(function (el) { co.observe(el); });
  } else {
    counters.forEach(runCount);
  }

  // ============================== Form → WhatsApp ==============================
  var form = document.querySelector("[data-wa-form]");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var nama = form.elements.nama.value.trim();
      var pesan = form.elements.pesan.value.trim();
      var select = form.elements.jenis;
      var jenis = select.options[select.selectedIndex].textContent.trim();
      form.elements.nama.classList.toggle("invalid", !nama);
      form.elements.pesan.classList.toggle("invalid", !pesan);
      if (!nama || !pesan) { return; }
      var template = lang === "en" ? EN.wa_form : "Halo Surya, saya {nama}.\nJenis proyek: {jenis}\n\n{pesan}";
      var text = template.replace("{nama}", nama).replace("{jenis}", jenis).replace("{pesan}", pesan);
      window.open(WA_BASE + "?text=" + encodeURIComponent(text), "_blank", "noopener");
    });
  }

  var year = document.querySelector("[data-year]");
  if (year) { year.textContent = String(new Date().getFullYear()); }

  // Terakhir: terapkan bahasa (setelah semua elemen siap)
  applyLang(detectLang());
})();
