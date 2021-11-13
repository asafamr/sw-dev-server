/// <reference no-default-lib="true"/>
/// <reference lib="es2020" />
/// <reference lib="WebWorker" />

const sw = (self as any) as ServiceWorkerGlobalScope & typeof globalThis;
declare var clients: Clients;
/**
 * service worker for dev server. anything directed to /dev/X should be fetched as compiled /X
 *
 */



async function getUrl(pathname: string) {
  pathname = pathname.replace(/^\/dep\//, "");
  let content = devPages[pathname];
  if (content) {
    const responseInit = {
      status: 200,
      statusText: "OK",
      headers: {
        "Cache-Control": "no-cache, no-store, must-revalidate",
        Pragma: "no-cache",
        Expires: "0",
        "Content-Type": content.type,
      },
    };
    console.log(content.type);
    return new Response(content, responseInit);
  } else {
    const responseInit = {
      status: 400,
      statusText: "Bad Request",
      headers: {
        "Cache-Control": "no-cache, no-store, must-revalidate",
        Pragma: "no-cache",
        Expires: "0",
        "Content-Type": "text/html",
      },
    };
    return new Response("could not find page", responseInit);
  }
}
const pages: Record<string, string> = {};
sw.addEventListener("fetch", async function (event: FetchEvent) {
    if(event.request.method === 'POST'){
        pages[event.request.url]= await event.request.text();
        return new Response("ok");
    }else if(event.request.method === 'GET' && Object.keys(pages).includes(event.request.url)){
        return new Response(pages[event.request.url],{
            status: 200,
            statusText: "OK",
            headers: {
              "Cache-Control": "no-cache, no-store, must-revalidate",
              Pragma: "no-cache",
              Expires: "0",
            //   "Content-Type": content.type,
            }});
    }
  return new Response('ERR', {status:404, statusText:"Not Found"})
});

sw.addEventListener("activate", (event) => {
  event.waitUntil(clients.claim());
  console.log("Now ready to handle fetches!");
});

sw.addEventListener("install", function (event) {
  // The promise that skipWaiting() returns can be safely ignored.
  console.log("Installing new version");
  event.waitUntil(sw.skipWaiting());

  // Perform any other actions required for your
  // service worker to install, potentially inside
  // of event.waitUntil();
});
