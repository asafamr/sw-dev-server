(() => {
  // src/sw.ts
  var sw = self;
  var pages = {};
  sw.addEventListener("fetch", function(event) {
    const base = self.location.pathname.slice(0, self.location.pathname.lastIndexOf("/"));
    if (!new URL(event.request.url).pathname.startsWith(base + "/dev"))
      return null;
    if (event.request.method === "POST") {
      return event.respondWith(Promise.resolve().then(async () => {
        pages[event.request.url] = await event.request.text();
        return new Response("OK", { status: 200, statusText: "OK" });
      }));
    } else if (event.request.method === "GET" && Object.keys(pages).includes(event.request.url)) {
      return event.respondWith(new Response(pages[event.request.url], {
        status: 200,
        statusText: "OK",
        headers: {
          "Cache-Control": "no-cache, no-store, must-revalidate",
          Pragma: "no-cache",
          Expires: "0"
        }
      }));
    }
  });
  sw.addEventListener("activate", (event) => {
    event.waitUntil(clients.claim());
    console.log("Now ready to handle fetches!");
  });
  sw.addEventListener("install", function(event) {
    console.log("Installing new version");
    event.waitUntil(sw.skipWaiting());
  });
})();
