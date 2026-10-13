import { readFileSync } from "node:fs";
import { expect, test, type Frame, type Page } from "@playwright/test";

// The parent is fulfilled in memory; allow its iframe to reach the local dev server.
test.use({
  launchOptions: { args: ["--disable-features=LocalNetworkAccessChecks"] },
});

async function chartSnapshot(surface: Page | Frame) {
  return {
    labels: await surface
      .locator(".recharts-label-list text")
      .allTextContents(),
    outcomes: await surface
      .locator(".recharts-yAxis-tick-labels text")
      .evaluateAll((labels) =>
        labels.map((label) =>
          Array.from(
            label.querySelectorAll("tspan"),
            (line) => line.textContent,
          ).join(" "),
        ),
      ),
    bars: await surface
      .locator(".recharts-bar-rectangle path")
      .evaluateAll((bars) =>
        bars.map((bar) => ({
          shape: bar.getAttribute("d"),
          fill: bar.getAttribute("fill"),
        })),
      ),
    axis: await surface.locator(".recharts-label").textContent(),
  };
}

test("Home shows the description and the Status quo chart without controls", async ({
  page,
}, testInfo) => {
  await page.goto("/");
  await expect(
    page.getByRole("tab", { name: "Home", exact: true }),
  ).toHaveAttribute("aria-selected", "true");
  const home = page.getByRole("tabpanel", { name: "Home", exact: true });
  await expect(
    home.getByText(/Welcome to the COVID-19 DALYs simulator/),
  ).toBeVisible();
  await expect(
    home.getByText(/On this first page, users can view estimates/),
  ).toBeVisible();
  await expect(
    home.getByRole("heading", { name: "Status quo: 5-year DALYs by outcome" }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Share options", exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Reset view to default", exact: true }),
  ).toBeVisible();
  await expect(home.getByRole("button")).toHaveCount(0);
  await expect(home.getByRole("radio")).toHaveCount(0);
  await expect(home.getByRole("combobox")).toHaveCount(0);
  await expect(home.getByRole("slider")).toHaveCount(0);
  await expect(page.locator(".recharts-label-list text")).toHaveCount(4);
  const landing = await chartSnapshot(page);
  const values = landing.labels.map((label) =>
    Number(label.replaceAll(",", "")),
  );
  expect(values).toEqual([...values].sort((a, b) => b - a));
  expect(landing.outcomes).toHaveLength(4);
  expect(landing.bars).toHaveLength(4);
  expect(landing.outcomes[0]).toBe("Total");
  expect(landing.outcomes).toEqual(
    expect.arrayContaining([
      "Total",
      "Long COVID",
      "Other sequelae",
      "Acute COVID",
    ]),
  );
  expect(landing.axis).toContain("DALYs per 1,000 people");
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await testInfo.attach("Home", {
    path: await page
      .screenshot({ path: testInfo.outputPath("home.png"), fullPage: true })
      .then(() => testInfo.outputPath("home.png")),
    contentType: "image/png",
  });

  await page
    .getByRole("tab", { name: "Outcome breakdown", exact: true })
    .click();
  await page.getByRole("combobox", { name: "Select scenario" }).click();
  await page.getByRole("option", { name: "Status quo", exact: true }).click();
  await page
    .getByRole("radio", { name: "DALYs per 1,000", exact: true })
    .check();
  await page
    .getByRole("button", { name: "Sort high to low", exact: true })
    .click();
  await expect(
    page.getByRole("button", { name: /^Download image of/ }),
  ).toBeEnabled();
  expect(await chartSnapshot(page)).toEqual(landing);

  // Other charts' selections must not change Home's fixed metric or ordering.
  await page
    .getByRole("radio", { name: "DALYs averted per 1,000", exact: true })
    .check();
  await page
    .getByRole("button", { name: "Sort low to high", exact: true })
    .click();
  await page.getByRole("tab", { name: "Home", exact: true }).click();
  await expect.poll(() => chartSnapshot(page)).toEqual(landing);
  await expect(
    page.getByRole("button", { name: "Share options", exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Reset view to default", exact: true }),
  ).toBeVisible();
  await expect(home.getByRole("button")).toHaveCount(0);
});

test("Home postMessages restore URLs, navigate history, resize, and reset", async ({
  page,
  baseURL,
}) => {
  const parentOrigin = "http://127.0.0.1:57391";
  const script = readFileSync(
    "iframe-code/iframe-parent.js",
    "utf8",
  ).replaceAll("http://localhost:5173", baseURL!);
  await page.route(`${parentOrigin}/**`, (route) =>
    route.fulfill({
      contentType: "text/html",
      body: `<iframe id="dalys" title="Simulator" src="${baseURL}" style="width:100%;border:0"></iframe><script>${script}</script>`,
    }),
  );
  await page.goto(
    `${parentOrigin}/?tab=home&metric=averted&outcomeBreakdownScenarioId=hepa_all_public&outcomeBreakdownSortOrder=ascending&keep=1#chart`,
  );
  const simulator = page.frameLocator("#dalys");
  const homeTab = simulator.getByRole("tab", { name: "Home", exact: true });
  await expect(homeTab).toHaveAttribute("aria-selected", "true");
  await expect(
    simulator.getByRole("heading", {
      name: "Status quo: 5-year DALYs by outcome",
    }),
  ).toBeVisible();
  await expect(
    simulator.getByRole("button", { name: "Share options", exact: true }),
  ).toBeVisible();
  await expect(
    simulator.getByRole("button", {
      name: "Reset view to default",
      exact: true,
    }),
  ).toBeVisible();
  await expect(
    simulator
      .getByRole("tabpanel", { name: "Home", exact: true })
      .getByRole("button"),
  ).toHaveCount(0);
  await expect
    .poll(() =>
      page
        .locator("#dalys")
        .evaluate((iframe) =>
          parseFloat((iframe as HTMLIFrameElement).style.height),
        ),
    )
    .toBeGreaterThan(400);
  await simulator
    .getByRole("tab", { name: "Outcome breakdown", exact: true })
    .click();
  await expect(page).toHaveURL(/tab=outcomeBreakdown/);
  await expect(
    simulator.getByRole("radio", {
      name: "DALYs averted per 1,000",
      exact: true,
    }),
  ).toBeChecked();
  await expect(
    simulator.getByRole("combobox", { name: "Select scenario" }),
  ).not.toContainText("Status quo");
  await homeTab.click();
  await expect(page).toHaveURL(/tab=home/);
  await page.goBack();
  await expect(
    simulator.getByRole("tab", { name: "Outcome breakdown", exact: true }),
  ).toHaveAttribute("aria-selected", "true");
  await page.goBack();
  await expect(homeTab).toHaveAttribute("aria-selected", "true");
  await page.goForward();
  await expect(
    simulator.getByRole("tab", { name: "Outcome breakdown", exact: true }),
  ).toHaveAttribute("aria-selected", "true");
  await page.reload();
  await expect(
    simulator.getByRole("radio", {
      name: "DALYs averted per 1,000",
      exact: true,
    }),
  ).toBeChecked();
  await simulator
    .getByRole("button", { name: "Reset view to default", exact: true })
    .click();
  await expect(page).toHaveURL(`${parentOrigin}/?keep=1#chart`);
  await expect(homeTab).toHaveAttribute("aria-selected", "true");
  await page.reload();
  await expect(homeTab).toHaveAttribute("aria-selected", "true");
});
