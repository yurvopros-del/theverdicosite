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
})();