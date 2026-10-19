/* Browser checks focus on user-visible behaviour and responsive regressions.
   Run npm install, npx playwright install chromium, then npm test.
   Optional: BASE_URL tests a deployed site; CHROMIUM_EXECUTABLE_PATH selects a local browser.
   Screenshots and JSON diagnostics are temporary files, not public website assets. */
const { chromium } = require("playwright");
const assert = require("node:assert/strict");
const fs = require("node:fs");
// Test local files by default; BASE_URL can point to the deployed page.
const { pathToFileURL } = require("node:url");
const path = require("node:path");
const os = require("node:os");
const url =
  process.env.BASE_URL ||
  pathToFileURL(path.join(__dirname, "..", "index.html")).href;
(async () => {
  const browser = await chromium.launch({
    executablePath: process.env.CHROMIUM_EXECUTABLE_PATH || undefined,
    args: ["--no-sandbox", "--disable-dev-shm-usage"],
    headless: true,
  });
  const context = await browser.newContext({ reducedMotion: "reduce" });
  const page = await context.newPage();
  const jsErrors = [];
  page.on("pageerror", (e) => jsErrors.push(e.message));
  const report = { viewports: [], checks: [], accessibility: [] };
  await page.goto(url, { waitUntil: "networkidle" });
  // Verify required content and that every in-page link resolves.
  const structure = await page.evaluate(() => {
    const ids = [...document.querySelectorAll("[id]")].map((e) => e.id);
    return {
      mainHeadings: document.querySelectorAll("h1").length,
      cards: document.querySelectorAll(".feature-card").length,
      testimonials: document.querySelectorAll(".testimonial-card").length,
      duplicateIds: ids.length - new Set(ids).size,
      brokenAnchors: [...document.querySelectorAll('a[href^="#"]')].filter(
        (a) => !document.getElementById(a.getAttribute("href").slice(1)),
      ).length,
      contact: document.querySelectorAll('.footer a[href^="mailto:"]').length,
      social: document.querySelectorAll('.footer a[href^="https://"]').length,
    };
  });
  assert.equal(structure.mainHeadings, 1);
  assert.ok(structure.cards >= 3);
  assert.ok(structure.testimonials >= 2 && structure.testimonials <= 3);
  assert.equal(structure.duplicateIds, 0);
  assert.equal(structure.brokenAnchors, 0);
  assert.ok(structure.contact >= 1 && structure.social >= 3);
  report.checks.push(
    "Required content, unique IDs and valid internal anchor targets",
  );
  for (const width of [320, 375, 390, 768, 1024, 1440, 1920]) {
    await page.setViewportSize({ width, height: 900 });
    await page.waitForFunction(() => {
      const r = document.querySelector(".hero-grid").getBoundingClientRect();
      const expected =
        innerWidth <= 760
          ? 16
          : innerWidth <= 1228
            ? 24
            : (innerWidth - 1180) / 2;
      return Math.abs(r.left - expected) < 0.5;
    });
    const layout = await page.evaluate(() => {
      const rail = document.querySelector(".hero-grid").getBoundingClientRect();
      const targets = [
        ...document.querySelectorAll(
          "h1,h2,.feature-card,.button,.footer-contact",
        ),
      ];
      return {
        width: innerWidth,
        scroll: document.documentElement.scrollWidth,
        left: rail.left,
        right: innerWidth - rail.right,
        overflow: targets
          .filter((e) => {
            let r = e.getBoundingClientRect();
            return r.left < -1 || r.right > innerWidth + 1;
          })
          .map((e) => e.className || e.tagName),
        featureColumns: getComputedStyle(
          document.querySelector(".feature-grid"),
        ).gridTemplateColumns,
      };
    });
    assert.equal(
      layout.scroll,
      width,
      "No horizontal document overflow at " + width,
    );
    assert.ok(
      Math.abs(layout.left - layout.right) < 1,
      "Equal content margins",
    );
    assert.equal(
      layout.overflow.length,
      0,
      "Content stays inside viewport: " + JSON.stringify(layout),
    );
    assert.equal(
      layout.left,
      width <= 760 ? 16 : width <= 1228 ? 24 : (width - 1180) / 2,
      JSON.stringify(layout),
    );
    report.viewports.push(layout);
    if ([375, 768, 1440].includes(width))
      await page.screenshot({
        path: path.join(os.tmpdir(), `velora-${width}.png`),
        fullPage: true,
      });
  }
  report.checks.push(
    "Equal measured gutters, no horizontal document overflow, and major content fits at all seven widths",
  );
  // Header edges intentionally differ from the centered page-content rail.
  for (const width of [375, 768, 900, 901, 1440, 1920]) {
    await page.setViewportSize({ width, height: 900 });
    await page.waitForFunction(() => {
      const r = document.querySelector(".nav").getBoundingClientRect();
      return Math.abs(r.left - (innerWidth <= 900 ? 16 : 32)) < 0.5;
    });
    const nav = await page.locator(".nav").boundingBox();
    const gutter = width <= 900 ? 16 : 32;
    assert.equal(nav.x, gutter);
    assert.equal(width - nav.x - nav.width, gutter);
    assert.equal(await page.locator(".menu-toggle").isVisible(), width <= 900);
    if (width <= 900) {
      const toggle = await page.locator(".menu-toggle").boundingBox();
      assert.equal(toggle.width, 44);
      assert.equal(toggle.height, 44);
      assert.equal(await page.locator(".menu-toggle span").count(), 3);
      await page.locator(".menu-toggle").click();
      assert.equal(await page.locator(".nav-links").isVisible(), true);
      await page.waitForFunction(
        () =>
          getComputedStyle(
            document.querySelector(".menu-toggle span:nth-child(2)"),
          ).opacity === "0",
      );
      assert.equal(
        await page
          .locator(".menu-toggle span")
          .nth(1)
          .evaluate((e) => getComputedStyle(e).opacity),
        "0",
      );
      await page.keyboard.press("Escape");
    }
  }
  report.checks.push(
    "Visible 44px three-bar menu through 900px, open/close, and independent 32px desktop header edges",
  );
  await page.setViewportSize({ width: 375, height: 900 });
  assert.equal(await page.locator(".nav-links a").first().isVisible(), false);
  await page.getByRole("button", { name: "Open menu", exact: true }).click();
  assert.equal(
    await page.locator(".menu-toggle").getAttribute("aria-expanded"),
    "true",
  );
  await page.locator(".menu-toggle").press("Shift+Tab");
  assert.equal(
    await page.evaluate(() => document.activeElement.className),
    "nav-cta",
  );
  await page.locator(".nav-cta").press("Tab");
  assert.equal(
    await page.evaluate(() => document.activeElement.className),
    "menu-toggle open",
  );
  await page.keyboard.press("Escape");
  assert.equal(
    await page.locator(".menu-toggle").getAttribute("aria-expanded"),
    "false",
  );
  await page.locator(".menu-toggle").click();
  await page
    .locator(".nav-links")
    .getByRole("link", { name: "About", exact: true })
    .click();
  assert.equal(
    await page.locator(".menu-toggle").getAttribute("aria-expanded"),
    "false",
  );
  await page.locator(".menu-toggle").click();
  await page.setViewportSize({ width: 1024, height: 900 });
  await page.waitForFunction(
    () => !document.body.classList.contains("menu-open"),
  );
  report.checks.push(
    "Mobile menu open/close, focus loop, Escape, anchor selection, resize cleanup",
  );
  for (const width of [375, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.waitForFunction(() => {
      const r = document.querySelector(".hero-grid").getBoundingClientRect();
      const expected =
        innerWidth <= 760
          ? 16
          : innerWidth <= 1228
            ? 24
            : (innerWidth - 1180) / 2;
      return Math.abs(r.left - expected) < 0.5;
    });
    await page.locator(".next").click();
    assert.equal(
      await page.locator(".testimonial-card.active .person b").innerText(),
      "Daniel Kim",
    );
    await page.locator(".prev").click();
    assert.equal(
      await page.locator(".testimonial-card.active .person b").innerText(),
      "Amara Mensah",
    );
    await page.locator(".dot").nth(2).click();
    assert.equal(
      await page.locator(".testimonial-card.active .person b").innerText(),
      "Nia Stone",
    );
    assert.equal(
      await page.locator(".testimonial-card").filter({ visible: true }).count(),
      1,
    );
    await page.locator(".next").click();
    assert.equal(
      await page.locator(".dot").first().getAttribute("aria-pressed"),
      "true",
    );
  }
  report.checks.push(
    "Testimonial arrows, dots, wraparound and one visible card at phone/tablet/desktop",
  );
  await page.locator(".command-top input").fill("project");
  assert.equal(await page.locator(".command-item:visible").count(), 1);
  await page.locator(".command-top input").fill("nonsense");
  assert.equal(await page.locator(".command-empty").isVisible(), true);
  await page.locator(".command-top input").fill("");
  assert.equal(await page.locator(".command-item:visible").count(), 4);
  report.checks.push("Command search matching, empty and reset states");
  assert.equal(
    await page.evaluate(
      () => getComputedStyle(document.documentElement).scrollBehavior,
    ),
    "auto",
  );
  await page.emulateMedia({ reducedMotion: "no-preference" });
  assert.equal(
    await page.evaluate(
      () => getComputedStyle(document.documentElement).scrollBehavior,
    ),
    "smooth",
  );
  await page.emulateMedia({ reducedMotion: "reduce" });
  report.checks.push("Smooth scrolling and reduced-motion preference");
  const axe = fs.readFileSync(require.resolve("axe-core/axe.min.js"), "utf8");
  for (const width of [375, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.waitForFunction(() => {
      const r = document.querySelector(".hero-grid").getBoundingClientRect();
      const expected =
        innerWidth <= 760
          ? 16
          : innerWidth <= 1228
            ? 24
            : (innerWidth - 1180) / 2;
      return Math.abs(r.left - expected) < 0.5;
    });
    await page.addScriptTag({ content: axe });
    const results = await page.evaluate(async () => {
      const r = await axe.run(document, {
        runOnly: { type: "tag", values: ["wcag2a", "wcag2aa", "wcag21aa"] },
      });
      return r.violations.map((v) => ({
        id: v.id,
        impact: v.impact,
        nodes: v.nodes.map((n) => ({
          target: n.target,
          summary: n.failureSummary,
        })),
      }));
    });
    report.accessibility.push({ width, violations: results });
  }
  const nojs = await browser.newContext({
    javaScriptEnabled: false,
    viewport: { width: 375, height: 900 },
  });
  const plain = await nojs.newPage();
  await plain.goto(url);
  assert.equal(await plain.locator(".nav-links").isVisible(), true);
  assert.equal(await plain.locator(".testimonial-card:visible").count(), 3);
  report.checks.push(
    "Without JavaScript, navigation and all three testimonials remain available",
  );
  const offline = await browser.newContext({
    viewport: { width: 375, height: 900 },
  });
  await offline.route("https://fonts.googleapis.com/**", (r) => r.abort());
  const fallback = await offline.newPage();
  await fallback.goto(url);
  assert.equal(
    await fallback.evaluate(() => document.documentElement.scrollWidth),
    375,
  );
  assert.equal(await fallback.locator("h1").isVisible(), true);
  report.checks.push(
    "Readable content and no horizontal overflow when Google Fonts is unavailable",
  );
  assert.deepEqual(jsErrors, []);
  report.checks.push("No JavaScript runtime errors");
  // Save diagnostics outside the repository and fail if the accessibility scan finds issues.
  fs.writeFileSync(
    path.join(os.tmpdir(), "velora-qa-results.json"),
    JSON.stringify(report, null, 2),
  );
  await browser.close();
  assert.ok(
    report.accessibility.every((a) => a.violations.length === 0),
    JSON.stringify(report.accessibility),
  );
  console.log(
    "PASS: 7 viewport layouts; menu; carousel; search; motion; no-JS; font fallback; no JS errors; axe scans.",
  );
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
