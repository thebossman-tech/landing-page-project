# Understand and present your Velora project

## 1. Read the HTML first

Start with the header and follow the page down through `main` to the footer. HTML describes content and meaning. A `section` groups a topic; an `article` holds a self-contained feature or testimonial. There is one `h1`; section headings use `h2`.

Navigation links such as `href="#about"` match a section's `id="about"`. The browser scrolls to that element. Relative stylesheet/script paths also work when GitHub Pages hosts the page under a repository subpath.

Exercise: find the Services link, its matching section and the four feature articles.

## 2. Understand margins, padding and gap

- **Margin:** space outside an element.
- **Padding:** space between an element's content and its border.
- **Gap:** space between Flexbox or Grid children.
- **Border-box:** declared widths include padding and borders.

The shared container rule is:

```css
.container {
  width: min(calc(100% - 48px), var(--container));
  margin-inline: auto;
}
```

`--container` is 1180px. Subtracting 48px leaves 24px on each side until the width cap takes over. Automatic inline margins distribute remaining space equally. The mobile media query subtracts 32px instead, leaving 16px on each side.

These gutters were measured in Chromium:

| Viewport | Content width | Left/right margin |
| -------- | ------------- | ----------------- |
| 320px    | 288px         | 16px              |
| 375px    | 343px         | 16px              |
| 390px    | 358px         | 16px              |
| 768px    | 720px         | 24px              |
| 1024px   | 976px         | 24px              |
| 1440px   | 1180px        | 130px             |
| 1920px   | 1180px        | 370px             |

In DevTools, inspect `.container` and look at the box-model diagram. Try changing the subtraction to 64px, predict the resulting gutters and then restore it.

## 3. Understand the responsive layout

Grid arranges larger page areas. Flexbox aligns the navigation and buttons. `minmax(0, 1fr)` prevents a grid child from forcing a column wider than the available space. `min-width: 0` lets the hero's children shrink.

The hero stacks at 1024px and below. At 900px and below, the header uses a visible three-bar hamburger button. At 760px and below, service cards use one column. The desktop header uses independent 32px edge gutters so its logo and navigation sit near opposite ends of the viewport. `clamp()` prevents headings becoming too large or too small.

Exercise: resize through 1024px and 760px and explain exactly which rules change.

## 4. Trace a menu click

1. `querySelector()` finds the menu button and navigation.
2. The button's click listener checks `aria-expanded`.
3. `setMenu()` adds/removes classes, locks/unlocks body scrolling and updates accessible attributes together.
4. CSS responds to the `.open` class.
5. Escape closes the menu and returns focus to the button.
6. Tab/Shift+Tab loop between the button and the menu links while open.
7. Resizing across the breakpoint clears the open state.

Exercise: explain why a menu can look closed but still be broken if its hidden links remain keyboard-focusable.

## 5. Trace testimonials and search

`current` stores the selected quote's array index. Arrays start at zero. The modulo expression wraps the previous/next index at either end. Every change updates the card's `.active` class and the corresponding dot's `aria-pressed` value.

The search input listens for `input`, normalizes text with `trim().toLowerCase()` and hides actions that do not match. It shows an empty-state message when no actions match. Nothing is sent to a server.

Exercise: predict what happens when Previous is clicked on the first of three quotes, then verify it.

## 6. Explain motion and resilience

IntersectionObserver notices a section entering the viewport and starts a small one-time entrance animation. Reduced-motion users skip that animation, and CSS disables smooth scrolling for them.

Core text starts visible. Without JavaScript, navigation and every quote remain available. This is progressive enhancement: JavaScript adds useful behaviour without making the content depend on it.

## 7. Present the work honestly

A short presentation could follow this order:

1. Show the desktop hero and describe the fictional company's purpose.
2. Resize to a phone and demonstrate the menu.
3. Show the four services and change a testimonial.
4. Filter the command preview.
5. Explain container margins with the measured values above.
6. Explain keyboard support, contrast fixes and reduced-motion behaviour.
7. Show the README and browser checks.
8. State the limits: frontend only, illustrative data and demo contact/social destinations.

Practise explaining the code in your own words. Be ready to change a label, a gutter or a menu interaction during a review.

## 8. Before submission

Aim to finish the final review by **23 October 2026**, before the **24 October** deadline. Create the public repository, publish the page, check both URLs while signed out, and use the two correct submission fields. Do a final test on a real phone and another browser if available. The brief does not require additional frameworks or backend functionality.
