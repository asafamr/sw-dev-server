(() => {
  // src/sw.ts
  var sw = self;
  var pages = {};
  sw.addEventListener("fetch", function(event) {
    const base = self.location.pathname.slice(0, self.location.pathname.lastIndexOf("/"));
    if (!new URL(event.request.url).pathname.startsWith(base + "/dev"))
      return null;
    if (event.request.method === "GET" && Object.keys(pages).includes(event.request.url)) {
      return event.respondWith(new Response(pages[event.request.url].content, {
        status: 200,
        statusText: "OK",
        headers: {
          "Cache-Control": "no-cache, no-store, must-revalidate",
          Pragma: "no-cache",
          "Content-Type": pages[event.request.url].mime,
          Expires: "0"
        }
      }));
    }
  });
  sw.addEventListener("message", (msg) => {
    if (msg?.data?.type === "add") {
      const { url, content, mime } = msg.data;
      pages[url] = { content, mime };
      msg.ports[0].postMessage("ok");
    }
  });
  sw.addEventListener("activate", (event) => {
    event.waitUntil(clients.claim());
  });
  sw.addEventListener("install", function(event) {
    event.waitUntil(sw.skipWaiting());
  });
})();
