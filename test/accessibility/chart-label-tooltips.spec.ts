import { expect, test } from "@playwright/test";

const charts = [
  { tab: "Home", count: 4 },
  { tab: "Air Cleaning", count: 7 },
  { tab: "Prophylactic Medication", count: 3 },
  { tab: "Long COVID Medication", count: 5 },
  { tab: "Outcome breakdown", count: 4 },
];

test("every chart label exposes a succinct definition on focus", async ({
  page,
}) => {
  await page.goto("/");
  for (const { tab, count } of charts) {
    await page.getByRole("tab", { name: tab, exact: true }).click();
    if (tab !== "Home") {
      await page
        .getByRole("radio", { name: "DALYs per 1,000", exact: true })
        .check();
    }
    const labels = page.locator(
      '.recharts-yAxis-tick-labels [data-slot="tooltip-trigger"]',
    );
    await expect(labels).toHaveCount(count);
    for (const label of await labels.all()) {
      await label.focus();
      const tooltip = page.getByRole("tooltip");
      await expect(tooltip).toBeVisible();
      const description = await tooltip.innerText();
      expect(description.length).toBeGreaterThan(20);
      expect(description.split(/\s+/).length).toBeLessThanOrEqual(25);
      await expect(label).toHaveAccessibleDescription(description);
      await expect
        .poll(async () => {
          const bounds = await page
            .locator('[data-slot="tooltip-content"]')
            .boundingBox();
          return Boolean(
            bounds &&
            bounds.x >= 0 &&
            bounds.x + bounds.width <= page.viewportSize()!.width,
          );
        })
        .toBe(true);
      await label.press("Escape");
      await expect(tooltip).toHaveCount(0);
      await expect(label).toBeFocused();
      await expect(label).toHaveAttribute("role", "img");
      await label.click();
      await label.press("Enter");
      await label.press("Space");
      await expect(
        page.getByRole("tab", { name: tab, exact: true }),
      ).toHaveAttribute("aria-selected", "true");
      await page.mouse.move(0, 0);
      await label.evaluate((element: SVGGElement) => element.blur());
      await expect(tooltip).toHaveCount(0);
    }
  }
});

test("label hover explains the intervention without opening its outcomes", async ({
  page,
  isMobile,
}, testInfo) => {
  test.skip(isMobile, "Hover requires a mouse.");
  await page.goto("/");
  await page.getByRole("tab", { name: "Air Cleaning", exact: true }).click();
  const label = page.getByRole("img", {
    name: "HEPA schools and daycares",
    exact: true,
  });
  await label.hover();
  await expect(page.getByRole("tooltip")).toHaveText(
    "HEPA filtration captures very small airborne particles in all indoor spaces in schools and daycares.",
  );
  await page
    .locator('[data-slot="tooltip-content"]')
    .evaluate(async (content) => {
      await Promise.all(
        content.getAnimations().map((animation) => animation.finished),
      );
    });
  await testInfo.attach("Intervention tooltip", {
    path: await page
      .screenshot({ path: testInfo.outputPath("tooltip.png") })
      .then(() => testInfo.outputPath("tooltip.png")),
    contentType: "image/png",
  });
  await label.click();
  await expect(
    page.getByRole("tab", { name: "Air Cleaning", exact: true }),
  ).toHaveAttribute("aria-selected", "true");
});
