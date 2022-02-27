importScripts('proxify.js')

var urlRewriter = new Rewriter({prefix: '/service/',encode: 'plain',version: '1.0.0'})

self.addEventListener("install", event => {
  self.skipWaiting();
  console.log('Dynamic Interception Proxy v1.0.1 Installed: /service/');
});

self.addEventListener('activate', event => {event.waitUntil(clients.claim());console.log('v1.0.1')});

var count = 0;

self.addEventListener( "fetch", async event => {
  event.preventDefault();
  count++
  if (count==1) {
    urlRewriter.config.url = new URL(event.request.url.replace(location.origin, '').replace('/service/','').replace('https://','https:/').replace('https:/','https://'))
  };

  event.respondWith(fetchProxier(event))
});

async function fetchProxier(event) {
  var rewritten = urlRewriter.encode(event.request.url)
  console.log(event.request.url+'=>'+rewritten)
  var headers = new Headers(event.request.headers)
  var options = {
    method: event.request.method,
    headers: headers,
  }
  if (event.request.method=='post') options.body = await event.request.body()
  const request = await fetch(rewritten)
  event.request.body = await request.blob()
  console.log(event.request.body)
  if (event.request.mode=='navigate') return new Response(event.request.body.toString(), {headers: headers})
  if (event.request.destination=='script') {
    /*return new Response(`
${event.request.body.toString().replace(/(,| |=|\()document.location(,| |=|\)|\.)/gi, str => { return str.replace('.location', `.__DIP.location`); }).replace(/(,| |=|\()window.location(,| |=|\)|\.)/gi, str => { return str.replace('.location', `.__DIP.location`); })}
`, {headers: headers})*/
  }
  return new Response(event.request.body, {headers: headers})
}