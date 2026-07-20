const body = document.body;
const header = document.querySelector("[data-header]");
const menuToggle = document.querySelector("[data-menu-toggle]");
const nav = document.querySelector("[data-nav]");
const revealItems = document.querySelectorAll(".reveal");

function syncHeader() {
  header.classList.toggle("is-sticky", window.scrollY > 18);
}

window.addEventListener("scroll", syncHeader, { passive: true });
syncHeader();

menuToggle.addEventListener("click", () => {
  const isOpen = nav.classList.toggle("is-open");
  menuToggle.classList.toggle("is-open", isOpen);
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  body.classList.toggle("menu-open", isOpen);
});

nav.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    nav.classList.remove("is-open");
    menuToggle.classList.remove("is-open");
    menuToggle.setAttribute("aria-expanded", "false");
    body.classList.remove("menu-open");
  });
});

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("is-visible");
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

revealItems.forEach((item) => revealObserver.observe(item));

document.querySelectorAll("[data-fallback]").forEach((img) => {
  const frame = img.closest(".image-placeholder");

  img.addEventListener("load", () => {
    if (img.naturalWidth > 0) {
      frame?.classList.add("has-image");
    }
  });

  img.addEventListener("error", () => {
    frame?.classList.remove("has-image");
  });
});

const resultTabs = [...document.querySelectorAll("[data-result-tab]")];
const resultPanels = [...document.querySelectorAll("[data-result-panel]")];

function showResult(index) {
  resultTabs.forEach((tab, tabIndex) => {
    tab.classList.toggle("is-active", tabIndex === index);
  });

  resultPanels.forEach((panel, panelIndex) => {
    panel.classList.toggle("is-active", panelIndex === index);
  });
}

resultTabs.forEach((tab, index) => {
  tab.addEventListener("click", () => showResult(index));
});

document.querySelectorAll("[data-compare]").forEach((compare) => {
  const compareRange = compare.querySelector("[data-compare-range]");

  compareRange.addEventListener("input", () => {
    compare.style.setProperty("--position", `${compareRange.value}%`);
  });

  compare.style.setProperty("--position", `${compareRange.value}%`);
});

const reviewCards = [...document.querySelectorAll("[data-review-card]")];
const reviewOrbit = document.querySelector("[data-reviews]");
const reviewPrev = document.querySelector("[data-review-prev]");
const reviewNext = document.querySelector("[data-review-next]");
const reviewDots = document.querySelector("[data-review-dots]");
let activeReview = 0;
let reviewTimer;
let reviewTouchStartX = 0;
let reviewTouchStartY = 0;

reviewCards.forEach((_, index) => {
  const dot = document.createElement("button");
  dot.type = "button";
  dot.setAttribute("aria-label", `Показать отзыв ${index + 1}`);
  dot.addEventListener("click", () => {
    showReview(index);
    restartReviewLoop();
  });
  reviewDots.append(dot);
});

function showReview(index) {
  activeReview = (index + reviewCards.length) % reviewCards.length;
  const previous = (activeReview - 1 + reviewCards.length) % reviewCards.length;
  const next = (activeReview + 1) % reviewCards.length;

  reviewCards.forEach((card, cardIndex) => {
    card.classList.toggle("is-active", cardIndex === activeReview);
    card.classList.toggle("is-prev", cardIndex === previous);
    card.classList.toggle("is-next", cardIndex === next);
  });

  reviewDots.querySelectorAll("button").forEach((dot, dotIndex) => {
    dot.classList.toggle("is-active", dotIndex === activeReview);
  });
}

function restartReviewLoop() {
  clearInterval(reviewTimer);
  reviewTimer = setInterval(() => showReview(activeReview + 1), 4200);
}

reviewPrev.addEventListener("click", () => {
  showReview(activeReview - 1);
  restartReviewLoop();
});

reviewNext.addEventListener("click", () => {
  showReview(activeReview + 1);
  restartReviewLoop();
});

reviewOrbit.addEventListener("touchstart", (event) => {
  const touch = event.changedTouches[0];
  reviewTouchStartX = touch.clientX;
  reviewTouchStartY = touch.clientY;
}, { passive: true });

reviewOrbit.addEventListener("touchend", (event) => {
  const touch = event.changedTouches[0];
  const deltaX = touch.clientX - reviewTouchStartX;
  const deltaY = touch.clientY - reviewTouchStartY;

  if (Math.abs(deltaX) < 45 || Math.abs(deltaX) < Math.abs(deltaY)) {
    return;
  }

  showReview(activeReview + (deltaX < 0 ? 1 : -1));
  restartReviewLoop();
}, { passive: true });

showReview(0);
restartReviewLoop();
