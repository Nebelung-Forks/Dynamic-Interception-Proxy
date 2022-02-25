var app = require('express')()
var fetch = require('node-fetch')
var fs = require('fs')

app.use(require('express').static('./'))

app.use('/service/', async (req, res) => {
  const request = await fetch(req.url.replace(/^\//g,'').replace('https://', 'https:/').replace('https:/','https://'))
  var response = await request.buffer()
  switch((headers(request.headers)||'text/plain').split('; ')[0]) {
    case "text/html":
      response = `
<script type="module">
const config = {
  prefix: '/service/',
  encode: 'plain',
  version: '1.0.0'
}
if ('serviceWorker' in navigator) {
  var worker = navigator.serviceWorker.register(location.origin+'/sw.js', {
    scope: config.prefix,
    config: config,
  }).then(e => {

  });
${fs.readFileSync('./inject.js')}
} else {
  document.write('Your Browser is Unsupported')
}</script>
${response}
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