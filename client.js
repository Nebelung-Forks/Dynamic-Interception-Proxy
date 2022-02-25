const config = {
  prefix: '/service/',
  encode: 'plain',
  version: '1.0.0'
}

document.querySelector('form').addEventListener('submit', (e) => {
  e.preventDefault();
  if ('serviceWorker' in navigator) {
    var worker = navigator.serviceWorker.register(location.origin+'/sw.js', {
      scope: config.prefix,
      config: config,
      updateViaCache: 'none',
    }).then(e => {
      var url = location.origin+config.prefix
      var val = document.querySelector('input').value
      if (!val.startsWith('http')) val = 'https://'+val
      url+=val
      history.pushState(null, null, url)
      location.reload()
    })
  }
})