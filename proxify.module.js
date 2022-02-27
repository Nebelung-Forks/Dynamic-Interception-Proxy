class Rewriter {
  constructor(config = {}) {
    this.config = config
  }
  encode(url) {
    url = url.replace(/^\/\//g, 'https://')
    var config = this.config
    config.op = '/v1/'
    if (url.includes(location.origin+config.prefix)||url.includes(config.prefix)||url.startsWith(location.origin+config.op)||url.includes(config.op)) return url
    if (url.startsWith(location.origin)) url = location.origin+config.op+url.replace(location.origin, config.url.origin)
    else url = config.op+url
    return url
  } 
  decode(url) {
    return url
  }
}

export default Rewriter