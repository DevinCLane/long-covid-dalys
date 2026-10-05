import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

const chartTabs = [
  "Air Cleaning",
  "Prophylactic Medication",
  "Long COVID Medication",
  "Outcome breakdown",
];

async function expectAccessible(page: Page, scope?: string) {
  const download = page.getByRole("button", { name: /^Download image of/ });
  if (await download.isVisible()) await expect(download).toBeEnabled();
  await page.evaluate(async () => {
    await Promise.all(
      document
        .getAnimations()
        .filter(
          (animation) => animation.effect?.getTiming().iterations !== Infinity,
        )
        .map((animation) => animation.finished.catch(() => {})),
    );
  });
  const scanner = new AxeBuilder({ page });
  const { violations } = await (
    scope ? scanner.include(scope) : scanner
  ).analyze();
  if (violations.length)
    console.log(
      JSON.stringify(
        violations.map(({ id, nodes }) => ({
          id,
          nodes: nodes.map(({ html, failureSummary }) => ({
            html,
            failureSummary,
          })),
        })),
        null,
        2,
      ),
    );
  expect(
    violations.map(({ id, nodes }) => ({
      id,
      targets: nodes.map((node) => node.target),
    })),
  ).toEqual([]);
}

for (const tab of [...chartTabs, "About"]) {
  test(`${tab} has accessible structure and controls`, async ({
    page,
  }, testInfo) => {
    await page.goto("/");
    await page.getByRole("tab", { name: tab, exact: true }).click();
    await expect(page.getByRole("main")).toHaveCount(1);
    await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
    await expect(
      page.getByRole("tabpanel", { name: tab, exact: true }),
    ).toBeVisible();
    await expect(page.getByRole("table")).toHaveCount(0);
    await expectAccessible(page);
    if (tab !== "About") {
      await page
        .getByRole("button", { name: "Model Assumptions", exact: true })
        .click();
      await expectAccessible(page);
      const sliders = page.getByRole("slider");
      for (const slider of await sliders.all()) {
        await expect(slider).toHaveAccessibleName(/\S/);
        await expect(slider).toHaveAccessibleDescription(/Allowed range/);
        await expect(slider).toHaveAttribute("aria-valuetext", /\S/);
      }
      await expect(
        page.getByRole("textbox", { name: "Enter value", exact: true }),
      ).toHaveCount(0);
      for (const metric of ["DALYs per 1,000", "DALYs averted per 1,000"]) {
        const radio = page.getByRole("radio", { name: metric, exact: true });
        await radio.check();
        await expect(radio).toHaveAccessibleDescription(/5 years/);
        await expectAccessible(page);
      }
      if (tab === "Air Cleaning")
        await testInfo.attach("expanded chart and assumptions", {
          path: await page
            .screenshot({
              path: testInfo.outputPath("expanded.png"),
              fullPage: true,
            })
            .then(() => testInfo.outputPath("expanded.png")),
          contentType: "image/png",
        });
    }
  });
}

test("skip link and tab arrow navigation keep focus predictable", async ({
  page,
}) => {
  await page.goto("/");
  await page.keyboard.press("Tab");
  await expect(
    page.getByRole("link", { name: "Skip to simulator" }),
  ).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.getByRole("main")).toBeFocused();
  const air = page.getByRole("tab", { name: "Air Cleaning", exact: true });
  await air.focus();
  await page.keyboard.press("ArrowRight");
  const prophylaxis = page.getByRole("tab", {
    name: "Prophylactic Medication",
    exact: true,
  });
  await expect(prophylaxis).toBeFocused();
  await expect(prophylaxis).toHaveAttribute("aria-selected", "true");
  await page.keyboard.press("ArrowLeft");
  await expect(air).toBeFocused();
});

test("chart keyboard tooltips expose values as live status", async ({
  page,
}) => {
  await page.goto("/");
  await expect(
    page.getByRole("button", { name: /^Download image of/ }),
  ).toBeEnabled();
  const chart = page.getByRole("application");
  await chart.focus();
  await chart.press("ArrowRight");
  const tooltip = page.locator('.recharts-tooltip-wrapper [role="status"]');
  await expect(tooltip).toBeVisible();
  await expect(tooltip).toHaveAttribute("aria-live", "polite");
  await expect(tooltip).toHaveAttribute("aria-atomic", "true");
  await expect(tooltip).toContainText("Total DALY reduction");
  const firstValue = await tooltip.innerText();
  await chart.press("ArrowRight");
  await expect(tooltip).not.toHaveText(firstValue);
  await expect(chart).toBeFocused();
});

test("chart filters, metrics, sorting and scenario navigation stay accessible", async ({
  page,
}) => {
  await page.goto("/");
  const details = page.getByRole("button", { name: /^View details for/ });
  await expect(details).toHaveCount(6);
  await page.getByRole("radio", { name: "HEPA filters", exact: true }).check();
  await expect(details).toHaveCount(3);
  await page
    .getByRole("button", { name: "Sort high to low", exact: true })
    .click();
  await expect(
    page.getByRole("button", { name: /^Download image of/ }),
  ).toBeEnabled();
  const labels = page.locator(".recharts-label-list text");
  await expect(labels).toHaveCount(3);
  const values = (await labels.allTextContents()).map((label) =>
    Number(label.replace(/[,%]/g, "")),
  );
  expect(values).toEqual([...values].sort((a, b) => b - a));
  await page
    .getByRole("radio", { name: "DALYs per 1,000", exact: true })
    .check();
  await expect(details).toHaveCount(4);
  await expect(
    page.getByRole("status").filter({ hasText: "Chart results updated" }),
  ).toContainText("DALYs per 1,000 people");
  await page
    .getByRole("radio", { name: "DALYs averted per 1,000", exact: true })
    .check();
  await expect(details).toHaveCount(3);
  await expect(
    page.getByRole("status").filter({ hasText: "Chart results updated" }),
  ).toContainText("DALYs averted per 1,000 people");
  const button = details.first();
  const label = (await button.getAttribute("aria-label"))!.replace(
    "View details for ",
    "",
  );
  await button.focus();
  await button.press("Enter");
  await expect(
    page.getByRole("tab", { name: "Outcome breakdown", exact: true }),
  ).toHaveAttribute("aria-selected", "true");
  await expect(
    page.getByRole("tabpanel", { name: "Outcome breakdown", exact: true }),
  ).toBeFocused();
  await expect(
    page.getByRole("combobox", { name: "Select scenario" }),
  ).toContainText(label);
});

test("assumption sliders, typed values and original values stay accessible", async ({
  page,
}) => {
  await page.goto("/");
  await page
    .getByRole("button", { name: "Model Assumptions", exact: true })
    .click();
  const slider = page.getByRole("slider", {
    name: "Annual COVID infection rate",
    exact: true,
  });
  const input = page.getByRole("textbox", {
    name: "Annual COVID infection rate",
    exact: true,
  });
  const initial = Number(await slider.getAttribute("aria-valuenow"));
  const initialInput = await input.inputValue();
  await slider.focus();
  await slider.press("ArrowRight");
  await expect(slider).toBeFocused();
  await expect
    .poll(async () => Number(await slider.getAttribute("aria-valuenow")))
    .toBeGreaterThan(initial);
  await expect(slider).toHaveAttribute("aria-valuetext", /percent/);
  await expect(
    page.getByRole("status").filter({ hasText: "Chart results updated" }),
  ).toContainText("Custom scenario. Not validated.");
  const chart = page.getByRole("application");
  await chart.focus();
  await chart.press("ArrowRight");
  const tooltip = page.locator('.recharts-tooltip-wrapper [role="status"]');
  await expect(tooltip).toContainText("Original value");
  await input.fill("150");
  await input.press("Enter");
  await expect(input).toHaveValue("100");
  await expect(
    page.getByRole("status").filter({ hasText: "Allowed range" }),
  ).toContainText("Value adjusted to 100");
  await input.fill("");
  await input.press("Enter");
  await expect(input).toHaveValue("100");
  await expect(
    page.getByRole("status").filter({ hasText: "Enter a number" }),
  ).toBeAttached();
  await expectAccessible(page);
  await page
    .getByRole("button", { name: "Reset assumptions", exact: true })
    .click();
  await expect(input).toHaveValue(initialInput);
  await expect(
    page.getByRole("status").filter({ hasText: "Chart results updated" }),
  ).toContainText("Default model assumptions.");
  await expect(
    page.getByRole("button", { name: /^Download image of/ }),
  ).toBeEnabled();
  await chart.focus();
  await chart.press("ArrowLeft");
  await expect(tooltip).toBeVisible();
  await expect(tooltip).not.toContainText("Original value");
  await expectAccessible(page);
});

test("chart image download announces completion", async ({ page }) => {
  await page.goto("/");
  const button = page.getByRole("button", { name: /^Download image of/ });
  await expect(button).toBeEnabled();
  await button.focus();
  const downloadPromise = page.waitForEvent("download");
  await button.press("Enter");
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toMatch(/air-cleaning.*\.png$/);
  await expect(
    page
      .getByRole("status")
      .filter({ hasText: "Chart image download started" }),
  ).toBeAttached();
});

test("scenario selector supports keyboard selection and zero results", async ({
  page,
}) => {
  await page.goto("/");
  await page
    .getByRole("tab", { name: "Outcome breakdown", exact: true })
    .click();
  const select = page.getByRole("combobox", { name: "Select scenario" });
  await select.focus();
  await select.press("Space");
  await expect(page.getByRole("listbox")).toBeVisible();
  // Radix hides the background while its modal listbox is open. Audit the
  // popup here and the complete document after it closes.
  await expectAccessible(page, '[role="listbox"]');
  await page.keyboard.press("Tab");
  await expect(page.getByRole("listbox")).toContainText(
    await page.locator(":focus").innerText(),
  );
  await page.keyboard.press("Home");
  await expect(
    page.getByRole("option", { name: "Status quo", exact: true }),
  ).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(select).toBeFocused();
  await expect(select).toContainText("Status quo");
  const chart = page.getByRole("application");
  await chart.focus();
  await chart.press("ArrowRight");
  await expect(
    page.locator('.recharts-tooltip-wrapper [role="status"]'),
  ).toContainText("0%");
  await expectAccessible(page);
});

test("sharing reports copy success and failure and restores focus", async ({
  page,
}) => {
  await page.goto("/");
  const share = page.getByRole("button", {
    name: "Share options",
    exact: true,
  });
  await share.focus();
  await share.press("Enter");
  await expect(
    page.getByRole("dialog", { name: "Share simulator" }),
  ).toBeVisible();
  await expectAccessible(page);
  await page.evaluate(() =>
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: { writeText: () => Promise.resolve() },
    }),
  );
  const copyUrl = page.getByRole("button", {
    name: "Copy url to clipboard",
    exact: true,
  });
  await copyUrl.focus();
  await copyUrl.press("Enter");
  await expect(
    page.getByRole("status").filter({ hasText: "url copied to clipboard" }),
  ).toBeVisible();
  await expect(copyUrl).toBeFocused();
  await page.evaluate(() =>
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: {
        writeText: () => Promise.reject(new Error("Clipboard unavailable")),
      },
    }),
  );
  await page
    .getByRole("button", { name: "Copy citation to clipboard", exact: true })
    .click();
  await expect(
    page.getByRole("status").filter({ hasText: "Couldn't copy citation" }),
  ).toBeVisible();
  await page.keyboard.press("Escape");
  // A focused copy button can have an open tooltip. Escape dismisses the
  // innermost layer first; a second Escape closes the Share popover.
  if (await page.getByRole("dialog", { name: "Share simulator" }).isVisible()) {
    await expect(page.getByRole("tooltip")).toHaveCount(0);
    await page.keyboard.press("Escape");
  }
  await expect(
    page.getByRole("dialog", { name: "Share simulator" }),
  ).toHaveCount(0);
  await expect(share).toBeFocused();
});
