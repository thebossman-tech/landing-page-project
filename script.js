/* Add an enhancement marker: base HTML/CSS remains usable without JavaScript. */
document.documentElement.classList.add("js");

// Cache the DOM elements used by the mobile navigation.
const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");
const mobileViewport = window.matchMedia("(max-width: 900px)");

// Keep appearance, scroll locking, and screen-reader state in sync.
function setMenu(open, restoreFocus = false) {
  menuToggle?.classList.toggle("open", open);
  navLinks?.classList.toggle("open", open);
  document.body.classList.toggle("menu-open", open);
  menuToggle?.setAttribute("aria-expanded", String(open));
  menuToggle?.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  if (restoreFocus) menuToggle?.focus();
}
menuToggle?.addEventListener("click", () => {
  setMenu(menuToggle.getAttribute("aria-expanded") !== "true");
});
document.querySelectorAll(".nav-links a").forEach((link) => {
  link.addEventListener("click", () => setMenu(false));
});
// Reset the menu when resizing so a desktop page never keeps scroll locked.
mobileViewport.addEventListener("change", () => setMenu(false));
document.addEventListener("keydown", (event) => {
  if (!navLinks?.classList.contains("open")) return;
  if (event.key === "Escape") setMenu(false, true);
  // Loop keyboard focus within the open navigation and its close button.
  if (event.key === "Tab" && mobileViewport.matches) {
    const lastLink = navLinks.querySelector("a:last-child");
    if (event.shiftKey && document.activeElement === menuToggle) {
      event.preventDefault();
      lastLink?.focus();
    } else if (!event.shiftKey && document.activeElement === lastLink) {
      event.preventDefault();
      menuToggle?.focus();
    }
  }
});

// Animate only elements already entering the viewport; never hide unread content.
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
if ("IntersectionObserver" in window && !reducedMotion.matches) {
  const observer = new IntersectionObserver(
    (entries, instance) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.animate(
          [{ transform: "translateY(16px)" }, { transform: "translateY(0)" }],
          { duration: 550, easing: "ease-out" },
        );
        instance.unobserve(entry.target); // Animate each section only once.
      });
    },
    { threshold: 0.12 },
  );
  document
    .querySelectorAll(".reveal")
    .forEach((item) => observer.observe(item));
}

// A manual carousel avoids unexpected motion and lets readers choose their pace.
const cards = [...document.querySelectorAll(".testimonial-card")];
const dots = [...document.querySelectorAll(".dot")];
let current = 0;
function showTestimonial(index) {
  if (!cards.length) return;
  // Modulo wraps the previous/next index at either end of the list.
  current = (index + cards.length) % cards.length;
  cards.forEach((card, i) => {
    card.classList.toggle("active", i === current);
    card.setAttribute("aria-hidden", String(i !== current));
  });
  dots.forEach((dot, i) => {
    dot.classList.toggle("active", i === current);
    dot.setAttribute("aria-pressed", String(i === current));
  });
}
document
  .querySelector(".prev")
  ?.addEventListener("click", () => showTestimonial(current - 1));
document
  .querySelector(".next")
  ?.addEventListener("click", () => showTestimonial(current + 1));
dots.forEach((dot, i) =>
  dot.addEventListener("click", () => showTestimonial(i)),
);
showTestimonial(0); // Initialize accessible state to match the visible first card.

// Filter the command preview locally; no user input is sent to a server.
const commandSearch = document.querySelector(".command-top input");
const commands = [...document.querySelectorAll(".command-item")];
if (commandSearch) {
  const emptyMessage = document.createElement("p");
  emptyMessage.className = "command-empty";
  emptyMessage.textContent =
    "No matching actions. Try project, workspace, or activity.";
  emptyMessage.hidden = true;
  emptyMessage.setAttribute("role", "status");
  document.querySelector(".command-footer")?.before(emptyMessage);
  commandSearch.addEventListener("input", () => {
    const query = commandSearch.value.trim().toLowerCase();
    commands.forEach((command) => {
      command.hidden = !command.textContent.toLowerCase().includes(query);
    });
    emptyMessage.hidden = commands.some((command) => !command.hidden);
  });
}
