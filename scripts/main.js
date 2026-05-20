(function () {
  document.body.classList.add("is-loaded");

  var navToggle = document.querySelector("[data-nav-toggle]");
  var nav = document.querySelector("[data-nav]");

  if (navToggle && nav) {
    navToggle.addEventListener("click", function () {
      var open = nav.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
  }

  var revealItems = document.querySelectorAll("[data-reveal]");
  if (!("IntersectionObserver" in window)) {
    revealItems.forEach(function (el) { el.classList.add("reveal"); });
    return;
  }

  revealItems.forEach(function (el) { el.classList.add("reveal"); });

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        entry.target.style.opacity = "1";
        entry.target.style.transform = "none";
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  revealItems.forEach(function (el) { observer.observe(el); });
  var heroVideos = document.querySelectorAll(".hero-media");

  function activateHeroVideo(video) {
    video.muted = true;
    video.playsInline = true;
    video.setAttribute("muted", "");
    video.setAttribute("playsinline", "");
    video.setAttribute("webkit-playsinline", "");

    try {
      var playAttempt = video.play();
      if (playAttempt && typeof playAttempt.catch === "function") {
        playAttempt.catch(function () {
          video.controls = false;
        });
      }
    } catch (error) {
      video.controls = false;
    }
  }

  heroVideos.forEach(function (video) {
    activateHeroVideo(video);

    video.addEventListener("loadeddata", function () {
      activateHeroVideo(video);
    }, { once: true });

    video.addEventListener("canplay", function () {
      activateHeroVideo(video);
    }, { once: true });

    document.addEventListener("visibilitychange", function () {
      if (!document.hidden && video.paused) {
        activateHeroVideo(video);
      }
    });
  });
})();

/* Verdico hero video runtime: prove and start page-embedded hero videos. */
(function () {
  function startVerdicoHeroVideos() {
    var videos = document.querySelectorAll(".hero-media video, .hero--with-video video");

    videos.forEach(function (video) {
      video.muted = true;
      video.defaultMuted = true;
      video.autoplay = true;
      video.loop = true;
      video.playsInline = true;
      video.setAttribute("muted", "");
      video.setAttribute("autoplay", "");
      video.setAttribute("loop", "");
      video.setAttribute("playsinline", "");
      video.setAttribute("preload", "auto");

      try {
        var result = video.play();
        if (result && typeof result.catch === "function") {
          result.catch(function () {});
        }
      } catch (e) {}
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", startVerdicoHeroVideos);
  } else {
    startVerdicoHeroVideos();
  }

  window.addEventListener("pageshow", startVerdicoHeroVideos);
  document.addEventListener("visibilitychange", function () {
    if (!document.hidden) startVerdicoHeroVideos();
  });
  document.addEventListener("pointerdown", startVerdicoHeroVideos, { once: true });
})();

/* Verdico footer LinkedIn reveal observer: production owner. */
(() => {
  document.documentElement.classList.add("js");

  const links = Array.from(document.querySelectorAll(".footer-linkedin"));
  if (!links.length) return;

  const reveal = (link) => {
    link.classList.add("is-visible");
  };

  if (!("IntersectionObserver" in window)) {
    links.forEach(reveal);
    return;
  }

  const viewportHeight = () =>
    window.innerHeight || document.documentElement.clientHeight || 0;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      reveal(entry.target);
      observer.unobserve(entry.target);
    });
  }, {
    threshold: 0.35,
    rootMargin: "0px 0px -6% 0px"
  });

  links.forEach((link) => {
    const rect = link.getBoundingClientRect();
    if (rect.top < viewportHeight() && rect.bottom > 0) {
      reveal(link);
    } else {
      observer.observe(link);
    }
  });
})();

/* Verdico Energy footprint controls: production owner. */
(function () {
  var buttons = document.querySelectorAll("[data-energy-region]");
  if (!buttons.length) return;

  var shell = document.querySelector(".energy-globe-shell");
  var panel = document.querySelector(".energy-region-focus");
  var rubric = panel && panel.querySelector(".energy-region-focus__rubric");
  var nameEl = panel && panel.querySelector(".energy-region-focus__name");
  var bodyEl = panel && panel.querySelector(".energy-region-focus__body");
  if (!shell || !panel || !nameEl || !bodyEl) return;

  var regions = {
    europe: { name: "Europe", body: "Renewable power, storage and digital infrastructure origination." },
    latam: { name: "LATAM", body: "Energy and data-centre related opportunities across selected markets." },
    us: { name: "United States", body: "Data-centre and digital infrastructure capital alignment." },
    apac: { name: "APAC", body: "Expansion interest across power-led digital infrastructure." },
    emea: { name: "EMEA", body: "Core advisory corridor across power, capital and digital infrastructure." },
    poland: { name: "Poland", body: "Active expansion interest across power and data-centre infrastructure." },
    france: { name: "France", body: "Active expansion interest across energy and digital infrastructure." }
  };

  function activate(region) {
    var data = regions[region];
    if (!data) return;
    buttons.forEach(function (btn) {
      var on = btn.dataset.energyRegion === region;
      btn.setAttribute("aria-pressed", on ? "true" : "false");
    });
    shell.setAttribute("data-active-region", region);
    shell.classList.add("is-focusing");
    panel.classList.add("is-active");
    if (rubric) rubric.textContent = "Active focus";
    nameEl.textContent = data.name;
    bodyEl.textContent = data.body;
  }

  buttons.forEach(function (btn) {
    btn.addEventListener("click", function () {
      activate(btn.dataset.energyRegion);
    });
  });
})();

/* Verdico Real Estate hero slider: production owner. */
(function () {
  var slides = document.querySelectorAll(".hero--realestate .hero-slide");
  if (!slides.length) return;

  var total = slides.length;
  var current = 0;
  var INTERVAL = 5200;
  var timer = null;

  /* Lazy-load slides 2–10 via data-src */
  slides.forEach(function (slide, i) {
    if (i === 0) return;
    var src = slide.dataset.src;
    if (!src) return;
    var img = new Image();
    img.onload = function () {
      slide.style.backgroundImage = "url('" + src + "')";
    };
    img.src = src;
  });

  function goTo(idx) {
    slides[current].classList.remove("is-active");
    current = ((idx % total) + total) % total;
    slides[current].classList.add("is-active");
  }

  function tick() { goTo(current + 1); }

  function start() {
    if (timer) return;
    timer = setInterval(tick, INTERVAL);
  }

  function stop() {
    clearInterval(timer);
    timer = null;
  }

  /* Respect prefers-reduced-motion: hold first slide */
  var mq = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)");
  if (mq && mq.matches) return;

  start();

  /* Pause on hover */
  var section = document.querySelector(".hero--realestate");
  if (section) {
    section.addEventListener("mouseenter", stop);
    section.addEventListener("mouseleave", start);
  }
})();
