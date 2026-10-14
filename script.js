const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");
const navAnchors = document.querySelectorAll(".nav-links a");

function closeMenu() {
  menuToggle.classList.remove("open");
  navLinks.classList.remove("open");
  document.body.classList.remove("menu-open");
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "Open menu");
}

document.addEventListener("keydown", function(event) {
  if (event.key === "Escape") {
    closeMenu();
  }
});

menuToggle?.addEventListener("click", () => {
  const isOpen = navLinks.classList.toggle("open");
  menuToggle.classList.toggle("open", isOpen);
  document.body.classList.toggle("menu-open", isOpen);
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
});

navAnchors.forEach((link) => link.addEventListener("click", closeMenu));

const revealItems = document.querySelectorAll(".reveal");
const observer = new IntersectionObserver(
  (entries, obs) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        obs.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);

revealItems.forEach((item) => observer.observe(item));

const cards = [...document.querySelectorAll(".testimonial-card")];
const dots = [...document.querySelectorAll(".dot")];
const prev = document.querySelector(".prev");
const next = document.querySelector(".next");
let current = 0;

function showTestimonial(index) {
  current = (index + cards.length) % cards.length;
  cards.forEach((card, i) => card.classList.toggle("active", i === current));
  dots.forEach((dot, i) => dot.classList.toggle("active", i === current));
}

prev?.addEventListener("click", () => showTestimonial(current - 1));
next?.addEventListener("click", () => showTestimonial(current + 1));
dots.forEach((dot, i) => dot.addEventListener("click", () => showTestimonial(i)));

let autoRotate = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? null : setInterval(() => {
  showTestimonial(current + 1);
}, 6000);

document.querySelector(".testimonial-track")?.addEventListener("mouseenter", () => {
  if (autoRotate) clearInterval(autoRotate);
});

document.querySelector(".testimonial-track")?.addEventListener("mouseleave", () => {
  if (!autoRotate) return;
  autoRotate = setInterval(() => showTestimonial(current + 1), 6000);
});
