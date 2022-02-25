importScripts('proxify.js')

var urlRewriter = new Rewriter({prefix: '/service/',encode: 'plain',version: '1.0.0'})

self.addEventListener("install", event => {
  self.skipWaiting();
  console.log('Dynamic Interception Proxy v1.0.1 Installed: /service/')
});

self.addEventListener('activate', event => {event.waitUntil(clients.claim());console.log('v1.0.1')});

var count = 0;

self.addEventListener( "fetch", event => {
  count++
  if (count==1) {
    urlRewriter.config.url = new URL(event.request.url.replace(location.origin, '').replace('/service/','').replace('https://','https:/').replace('https:/','https://'))
  }
  event.preventDefault()
  const headers = [
    
  ]
  const rewritten = urlRewriter.encode(event.request.url)
  console.log(event.request.url+' => ', rewritten)
  event.respondWith(fetch(rewritten))
})