import { test, expect } from "@playwright/test";
test("basic test", async ({ page }) => {
  await page.goto(`http://localhost:${process.env.port || 9898}/_example.html`);
  await page.waitForEvent("console", { predicate: (x) => x.text().includes("inner swready"), timeout: 1000 });
  await page.waitForEvent("console", { predicate: (x) => x.text().includes("inner synced"), timeout: 1000 });
  await page.frame({
    name: 'ifrm-viewport'
  }).click('text=awsome!')
});
