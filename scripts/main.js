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
