/// <reference no-default-lib="true"/>
/// <reference lib="es2020" />
/// <reference lib="WebWorker" />

import localforage, { driver } from "localforage"
const sw = (self as any) as ServiceWorkerGlobalScope & typeof globalThis;
declare var clients: Clients;
/**
 * service worker for dev server. anything directed to /dev/X should be fetched as compiled /X
 *
 */
 var store = localforage.createInstance({
  name: "sw-dev-server",
  driver:localforage.INDEXEDDB
});


sw.addEventListener("fetch", function (event: FetchEvent) {
  const base = self.location.pathname.slice(0,self.location.pathname.lastIndexOf('/'))
  if (!new URL(event.request.url).pathname.startsWith(base+"/dev")) return null;
  else if(event.request.method === "GET"){
    return event.respondWith(Promise.resolve().then(async ()=>{
      try{
       const got = await store.getItem(event.request.url) as any
       return new Response(got.content, {
        status: 200,
        statusText: "OK",
        headers: {
          "Cache-Control": "no-cache, no-store, must-revalidate",
          Pragma: "no-cache",
          "Content-Type": got.mime,
          Expires: "0",
        },
      })
      }catch(e){
        console.debug("localforage error", e)
      }

      return new Response("404 - Not Found", {
        status: 404,
        statusText: "Not Found",
        headers: {
          "Cache-Control": "no-cache, no-store, must-revalidate",
          Pragma: "no-cache",
          "Content-Type": 'text/plain',
          Expires: "0",
        },
      })
    }))
  }
  
});
sw.addEventListener("message", async msg=>{
  if(msg?.data?.type==="add"){
    const {url, content, mime} = msg.data;
    await store.setItem(new URL(url, (msg.source as Client).url).toString(), {content,mime});
    msg.ports[0].postMessage('ok');
  }
})
sw.addEventListener("activate", (event) => {
  event.waitUntil(clients.claim());
  // console.log("Now ready to handle fetches!");
});

sw.addEventListener("install", function (event) {
  // console.log("Installing new version");
  event.waitUntil(sw.skipWaiting());

});
