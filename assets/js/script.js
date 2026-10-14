"use strict";

(function () {
  var root = document.documentElement;

  // ----- Tema (terang/gelap): ikut sistem, bisa diganti, diingat bila storage tersedia -----
  var saved = null;
  try { saved = localStorage.getItem("theme"); } catch (e) { /* storage dimatikan: abaikan */ }
  var prefersLight = window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches;
  applyTheme(saved || (prefersLight ? "light" : "dark"));

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
      try { localStorage.setItem("theme", next); } catch (e) { /* abaikan */ }
    });
  }

  // ----- Navigasi: bayangan saat scroll + menu ponsel -----
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

  // ----- Filter proyek -----
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

  // ----- Muncul saat scroll -----
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

  // ----- Hitung naik untuk angka ringkas -----
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

  // ----- Form: susun pesan lalu buka WhatsApp (tidak ada data yang dikirim ke server) -----
  var form = document.querySelector("[data-wa-form]");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var nama = form.elements.nama.value.trim();
      var pesan = form.elements.pesan.value.trim();
      var jenis = form.elements.jenis.value;
      form.elements.nama.classList.toggle("invalid", !nama);
      form.elements.pesan.classList.toggle("invalid", !pesan);
      if (!nama || !pesan) { return; }
      var text = "Halo Surya, saya " + nama + ".\nJenis proyek: " + jenis + "\n\n" + pesan;
      window.open("https://wa.me/6281329844484?text=" + encodeURIComponent(text), "_blank", "noopener");
    });
  }

  var year = document.querySelector("[data-year]");
  if (year) { year.textContent = String(new Date().getFullYear()); }
})();
