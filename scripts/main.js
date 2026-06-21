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

/* Verdico homepage global time strip: native IANA time-zone formatting. */
class GlobalTimeStrip extends HTMLElement {
  connectedCallback() {
    this.stopClock();

    this.timeElements = Array.from(this.querySelectorAll("[data-global-time]"));
    this.formatters = this.timeElements.map(function (element) {
      return new Intl.DateTimeFormat("en-GB", {
        timeZone: element.dataset.timeZone,
        hour: "2-digit",
        minute: "2-digit",
        hour12: false
      });
    });

    this.updateClock();

    var millisecondsUntilNextMinute = 60000 - (Date.now() % 60000);
    this.minuteBoundaryTimer = window.setTimeout(() => {
      this.updateClock();
      this.minuteTimer = window.setInterval(() => this.updateClock(), 60000);
    }, millisecondsUntilNextMinute);
  }

  disconnectedCallback() {
    this.stopClock();
  }

  updateClock() {
    var now = new Date();

    this.timeElements.forEach((element, index) => {
      element.textContent = this.formatters[index].format(now);
      element.dateTime = now.toISOString();
    });
  }

  stopClock() {
    window.clearTimeout(this.minuteBoundaryTimer);
    window.clearInterval(this.minuteTimer);
    this.minuteBoundaryTimer = null;
    this.minuteTimer = null;
  }
}

if (!customElements.get("global-time-strip")) {
  customElements.define("global-time-strip", GlobalTimeStrip);
}

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
