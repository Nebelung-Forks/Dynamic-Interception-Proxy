class Rewriter {
  constructor(config = {}) {
    this.config = config
  }
  encode(url) {
    url = url.replace(/^\/\//g, 'https://')
    var config = this.config
    if (url.includes(location.origin+config.prefix)||url.includes(config.prefix)) return url
    if (url.startsWith(location.origin)) url = location.origin+config.prefix+url.replace(location.origin, config.url.origin)
    else url = config.prefix+url
    return url
  } 
  decode(url) {
    return url
  }
}

export default Rewriter