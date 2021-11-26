import { test, expect } from "@playwright/test";
test("basic test", async ({ page }) => {
  await page.goto(`http://localhost:${process.env.port || 9898}/`);
  await page.waitForEvent("console", { predicate: (x) => x.text().includes("dev server service worker ready"), timeout: 1000 });
  await page.evaluate(()=>{
    const rnd = (Math.random() + 1).toString(36).substring(7);
    postMessage({ type: "add", content: "awsome!", url: "./dev/" + rnd, mime: "text/html" })
  });
  await page.waitForEvent("console", { predicate: (x) => x.text().includes("dev server synced"), timeout: 1000 });
  await page.frame({
    name: 'main-view'
  }).click('text=awsome!')
});
