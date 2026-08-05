(function () {
  const TOTAL_FRAMES = 180;
  const ASSET_VERSION = "hq-v2";
  const framePath = (i) =>
    `scroll/ezgif-frame-${String(i).padStart(3, "0")}.jpg?v=${ASSET_VERSION}`;

  const canvas = document.getElementById("scrollCanvas");
  const ctx = canvas.getContext("2d");
  const loader = document.getElementById("loader");
  const loaderBar = document.getElementById("loaderBar");
  const pinWrap = document.querySelector(".hero-pin-wrap");
  const pin = document.querySelector(".hero-pin");

  const images = new Array(TOTAL_FRAMES);
  let loadedCount = 0;
  let currentFrame = 0;

  function resizeCanvas() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = pin.clientWidth;
    const h = pin.clientHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    // resizing the backing store resets these to defaults (quality "low"), so re-set every time
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
  }

  function drawFrame(index) {
    const img = images[index];
    if (!img || !img.complete || !img.naturalWidth) return;
    currentFrame = index;

    const w = pin.clientWidth;
    const h = pin.clientHeight;
    const canvasRatio = w / h;
    const imgRatio = img.naturalWidth / img.naturalHeight;

    let sx, sy, sw, sh;
    if (imgRatio > canvasRatio) {
      sh = img.naturalHeight;
      sw = sh * canvasRatio;
      sx = (img.naturalWidth - sw) / 2;
      sy = 0;
    } else {
      sw = img.naturalWidth;
      sh = sw / canvasRatio;
      sx = 0;
      sy = (img.naturalHeight - sh) / 2;
    }

    ctx.clearRect(0, 0, w, h);
    ctx.drawImage(img, sx, sy, sw, sh, 0, 0, w, h);
  }

  function preloadImages() {
    return new Promise((resolve) => {
      for (let i = 1; i <= TOTAL_FRAMES; i++) {
        const img = new Image();
        img.decoding = "async";
        img.onload = img.onerror = () => {
          loadedCount++;
          loaderBar.style.transform = `scaleX(${loadedCount / TOTAL_FRAMES})`;
          if (i === 1) drawFrame(0);
          if (loadedCount === TOTAL_FRAMES) resolve();
        };
        img.src = framePath(i);
        images[i - 1] = img;
      }
    });
  }

  function initScrub() {
    ScrollTrigger.create({
      trigger: pinWrap,
      start: "top top",
      end: "bottom bottom",
      pin: pin,
      scrub: 0.35,
      onUpdate: (self) => {
        const idx = Math.round(self.progress * (TOTAL_FRAMES - 1));
        if (idx !== currentFrame) drawFrame(idx);
      },
    });

    ScrollTrigger.refresh();
  }

  function initHeroEntrance() {
    gsap.timeline({ defaults: { ease: "power3.out", duration: 0.9 } })
      .to(".hero-nav", { opacity: 1, y: 0 }, 0)
      .to(".hero-eyebrow", { opacity: 1, y: 0 }, 0.12)
      .to(".hero-headline", { opacity: 1, y: 0 }, 0.22)
      .to(".hero-subhead", { opacity: 1, y: 0 }, 0.36)
      .to(".hero-ctas", { opacity: 1, y: 0 }, 0.46)
      .to(".hero-tools", { opacity: 1, y: 0 }, 0.56);
  }

  function initHeadlineRotation() {
    const el = document.getElementById("heroHeadline");
    const lines = [
      "We build AI-powered websites",
      "We build booking systems that convert",
      "We ship in weeks, not months",
      "We build the systems your business runs on",
    ];
    let idx = 0;
    const HOLD_SECONDS = 3.2;

    function cycle() {
      if (document.hidden) {
        gsap.delayedCall(HOLD_SECONDS, cycle);
        return;
      }
      const next = (idx + 1) % lines.length;
      gsap
        .timeline({
          onComplete: () => {
            idx = next;
            gsap.delayedCall(HOLD_SECONDS, cycle);
          },
        })
        .to(el, { yPercent: -30, opacity: 0, duration: 0.4, ease: "power2.in" })
        .call(() => {
          el.textContent = lines[next];
        })
        .fromTo(
          el,
          { yPercent: 30, opacity: 0 },
          { yPercent: 0, opacity: 1, duration: 0.5, ease: "power2.out" }
        );
    }

    gsap.delayedCall(HOLD_SECONDS, cycle);
  }

  function initScrollReveals() {
    document.body.classList.add("js-reveal-ready");

    document.querySelectorAll("section").forEach((section) => {
      const items = section.querySelectorAll(".reveal-up");
      if (!items.length) return;
      gsap.to(items, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power3.out",
        stagger: 0.1,
        scrollTrigger: {
          trigger: section,
          start: "top 75%",
          once: true,
        },
      });
    });
  }

  window.addEventListener("resize", () => {
    resizeCanvas();
    drawFrame(currentFrame);
    if (window.ScrollTrigger) ScrollTrigger.refresh();
  });

  // Card hover glow logic
  document.querySelectorAll(".stat-card").forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty("--x", `${x}px`);
      card.style.setProperty("--y", `${y}px`);
    });
  });

  function initScrollSpy() {
    const sections = document.querySelectorAll("section[id]");
    const navLinks = document.querySelectorAll(".hero-nav__links a");

    window.addEventListener("scroll", () => {
      let currentSection = "";
      const scrollPos = window.scrollY + 200;

      sections.forEach((section) => {
        const top = section.offsetTop;
        const height = section.offsetHeight;
        if (scrollPos >= top && scrollPos < top + height) {
          currentSection = section.getAttribute("id");
        }
      });

      navLinks.forEach((link) => {
        link.classList.remove("active");
        if (link.getAttribute("href") === `#${currentSection}`) {
          link.classList.add("active");
        }
      });
    });
  }

  initScrollSpy();

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const isMobileHero = window.matchMedia("(max-width: 760px)").matches;

  if (!reduceMotion) {
    gsap.registerPlugin(ScrollTrigger);
    initScrollReveals();
  }

  if (isMobileHero) {
    // Mobile uses a static hero image (see .hero-mobile-img in CSS) — skip
    // the 180-frame scroll-scrub preload and canvas pin entirely.
    loader.classList.add("loader--done");
    if (!reduceMotion) {
      initHeroEntrance();
      initHeadlineRotation();
    }
  } else {
    resizeCanvas();
    preloadImages().then(() => {
      loader.classList.add("loader--done");
      if (!reduceMotion) {
        initScrub();
        initHeroEntrance();
        initHeadlineRotation();
      }
    });
  }
})();
