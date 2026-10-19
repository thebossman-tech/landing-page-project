# Velora — Work, without the chaos

A responsive landing page for **Velora**, a fictional company offering a team workflow platform. Built with semantic HTML, CSS and vanilla JavaScript for the `landing-page-project` internship assignment.

The page presents a clear value proposition, an HTML/CSS product illustration, four services, three sample customer stories and contact information. The visual system uses generous spacing, restrained purple accents and alternating light/dark sections.

## Live Demo

https://thebossman-tech.github.io/landing-page-project/

## Author

Ogundijo Olatunbosun

[thebossman-tech](https://github.com/thebossman-tech)

## Requirements covered

| Internship requirement                             | Implementation                                                              |
| -------------------------------------------------- | --------------------------------------------------------------------------- |
| Logo and Home, About, Services, Contact navigation | Fixed header with anchor links                                              |
| Hero headline, subtext and CTA                     | Two-line desktop headline, supporting copy and contact/features actions     |
| At least three service cards                       | Plan, Align, Measure and Automate cards                                     |
| Two to three testimonials                          | Three fictional customer quotes with manual arrow/dot navigation            |
| Footer contact information and social links        | Example email, remote-first information and LinkedIn, X and Instagram links |
| Mobile, tablet and desktop layouts                 | Fluid containers, Flexbox, Grid and responsive breakpoints                  |
| Smooth scrolling and animations                    | CSS scroll behaviour, hover effects and entrance animations                 |
| Hamburger menu                                     | Accessible state, Escape close, keyboard focus loop and resize cleanup      |
| Commented, organized code                          | Explanatory comments in HTML, CSS, JavaScript and browser checks            |
| README                                             | This file                                                                   |
| Public repository and live demo                    | Public repository and live assets verified; see links above                 |

## Technology

- **HTML:** semantic landmarks, descriptive headings and accessible control labels.
- **CSS:** design tokens, centered containers, Grid/Flexbox, responsive type and reduced-motion support.
- **JavaScript:** menu state, testimonial selection, local search filtering and IntersectionObserver.
- **Development-only checks:** Playwright and axe-core. They are not loaded by the landing page.

## Run the page

Open `index.html` directly in a modern browser, or use VS Code Live Server. Keep the HTML, stylesheet, script and favicon together. No build step or production dependencies are required.

Google Fonts is optional: system fonts are used if the external font service cannot load. All product illustrations are drawn locally in HTML/CSS/SVG.

## Project files

| File                      | Purpose                                                      |
| ------------------------- | ------------------------------------------------------------ |
| `index.html`              | Page content, navigation and semantic structure              |
| `styles.css`              | Tokens, component styles, spacing and responsive rules       |
| `script.js`               | Menu, carousel, search and entrance animations               |
| `favicon.svg`             | Small scalable brand mark                                    |
| `tests/browser-check.cjs` | Browser regression and accessibility checks                  |
| `package-lock.json`       | Locks the development dependencies for reproducible installs |
| `QA.md`                   | Dated audit evidence, fixes and testing limits               |
| `package.json`            | Development-only verification commands                       |
| `.gitignore`              | Excludes local dependencies and environment files            |
| `.nojekyll`               | Keeps GitHub Pages deployment as a plain static site         |
| `WALKTHROUGH.md`          | Step-by-step explanation and presentation preparation        |

## Design and accessibility decisions

The content rail is capped at 1180px. It has 24px gutters on tablet/smaller desktop screens and 16px on phones. This keeps the hero and main sections aligned. The header has its own wider edge spacing. `minmax(0, 1fr)` lets grid content shrink within those edges.

The feature cards form two columns on larger screens and one column on phones. The hero stacks below 1024px. Headlines use `clamp()` to scale between readable minimum and maximum sizes.

The header spans the viewport with 32px desktop edge spacing and 16px on smaller screens. Its visible three-bar, 44px menu button appears at 900px and below. The mobile menu synchronizes its visual class with `aria-expanded`, supports Escape and resets when the viewport crosses the mobile breakpoint. Closed links cannot receive keyboard focus. A skip link lets keyboard users bypass the header.

Testimonials change only when the reader chooses an arrow or dot. Dot state is exposed with `aria-pressed`; the current quote is announced through a polite live region. Content and navigation remain available without JavaScript. Motion respects the system's reduced-motion preference.

## Verification — 19 October 2026

Automated Chromium checks passed for:

- Layouts at 320, 375, 390, 768, 1024, 1440 and 1920px, with equal measured side margins and no horizontal document overflow.
- Major headings, cards, CTA buttons and contact information staying inside the viewport.
- Menu open/close, keyboard focus loop, Escape, anchor selection and resize cleanup.
- Testimonial arrows, dots, wraparound and one visible quote at phone, tablet and desktop sizes.
- Search results, empty state and resetting the filter.
- Smooth scroll and reduced-motion preferences.
- Navigation and all three quotes remaining visible when JavaScript is disabled.
- Font-service failure without horizontal overflow on mobile.
- No JavaScript runtime errors during those checks.
- axe-core WCAG A/AA scans at 375 and 1440px with **zero detected violations**.

Desktop and phone screenshots of the published source were visually inspected. The public HTML, CSS, JavaScript and favicon returned HTTP 200 and matched the repository files. Browser checks run against local copies of those same published files: direct live-browser navigation was limited by this test environment’s certificate trust configuration. Automated checks do not replace a real-phone, screen-reader or Safari/Firefox/Edge review; those checks remain recommended before submission. External social destinations are configured but were not exercised as part of the local test suite. Deployment status and public asset responses are checked separately after publishing changes.

### Reproduce checks

Install Node.js and run from the project root:

```bash
npm ci
npx playwright install chromium
npm run check
npm test
```

The tests save temporary screenshots and JSON diagnostics to the operating system's temporary folder. They do not modify the website. `BASE_URL` can point the same checks to a live deployment; `CHROMIUM_EXECUTABLE_PATH` optionally selects an existing Chromium executable.

## Publish with GitHub Pages

1. Create a **public** GitHub repository named **`landing-page-project`**.
2. Upload the contents of this project folder to the repository root. `index.html` must be at the root, not inside another nested project folder.
3. Commit to `main`.
4. In repository **Settings → Pages**, select **Deploy from a branch**, choose **main** and **/(root)**, then save.
5. Wait for GitHub's deployment to finish, then copy the URL shown in Pages settings.
6. Open both the repository and demo URLs in a signed-out/private browser window. Check styles, script, favicon and menu on the deployed page.
7. Submit the repository URL in **Submission URL** and the deployed page URL in **Live / Demo URL**. Copy actual working URLs; do not submit template addresses.

GitHub's official instructions: [Configuring a publishing source](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site).

## Fictional content and scope

Velora, the sample customers, testimonials, dashboard data and metrics are invented for demonstration. `hello@velora.example` uses a reserved example domain and is not a working mailbox. Social links intentionally open platform homepages; they do not represent real Velora profiles. Replace these destinations if genuine company details are supplied.

This is a frontend landing page. It does not implement a working SaaS product, backend, authentication or email delivery. The contact CTA opens the visitor's email application. Command search filters the visual preview only; its shortcut badges are illustrative.
