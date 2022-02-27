var app = require('express')()
var fetch = require('node-fetch')
var fs = require('fs')

app.use(require('express').static('./'))

app.use('/service/', async (req, res) => {
  console.log(req.url)
  var url = req.url.replace(/^\//g,'').replace('https://', 'https:/').replace('https:/','https://')
  try {new URL(url)} catch(e) {return res.writeHead(200,{}).end(e)}
  const request = await fetch(url).catch(e=>{return res.end(e.toString())})
  if (res.headersSent) return ''
  var response = await request.buffer()
  switch((headers(request.headers)||'text/plain').split('; ')[0]) {
    case "text/html":
      response = `
<script>
window.config = {
  prefix: '/service/',
  encode: 'plain',
  version: '1.0.0', 
  url: '${req.url.replace(/^\//g,'').replace('https://', 'https:/').replace('https:/','https://')}'
}
${fs.readFileSync('./inject.js')}
if ('serviceWorker' in navigator) {
  __DIP.worker = navigator.serviceWorker.register(location.origin+'/sw.js', {
    scope: __DIP.prefix,
    config: __DIP,
  }).then(e => {

  });
} else {
  document.write('Your Browser is Unsupported')
}</script>
${response.toString()}
`
      break;
    case "text/javascript":
    case "text/js":
    case "application/javascript":
      response = response.toString()
  }
  res.send(response)
})

function headers(header) {
  for(const val of header){
    if (val[0]=='content-type') return val[1]
  }
}

app.listen(8080)