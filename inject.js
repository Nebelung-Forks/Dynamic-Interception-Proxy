window.__DIP = config
delete window.config

__DIP.Rewriter = class {
  constructor(config = {}) {
    if (config.url) config.url = new URL(config.url)
    this.config = config
  }
  encode(url) {
    console.log(url)
    url = url.replace(/^\/\//g, 'https://')
    var config = this.config
    if (url.includes(location.origin+config.prefix)||url.includes(config.prefix)) return url
    if (url.startsWith(location.origin)) url = location.origin+config.prefix+url.replace(location.origin, config.url.origin)
    else if (url.startsWith('/')&&!url.startsWith('//')) url = config.prefix+config.url.origin+url
    else url = config.prefix+url
    return url
  } 
  decode(url) {
    return url
  }
}

__DIP.Url = new __DIP.Rewriter(__DIP)

window.history.pushState = new Proxy(window.history.pushState, {
  apply(t, g, a) {
    if (a[2]) a[2] = __DIP.Url.encode(a[2])
    return Reflect.apply(t, g, a)
  }
})

window.history.replaceState = new Proxy(window.history.replaceState, {
  apply(t, g, a) {
    if (a[2]) a[2] = __DIP.Url.encode(a[2])
    return Reflect.apply(t, g, a)
  }
});

window.Worker = new Proxy(window.Worker, {
  construct(t, a) {
    if (a[0]) a[0] = __DIP.Url.encode(a[0])
    return Reflect.construct(t, a)
  }
})

__DIP.Observer = function (mutationList, observer) {
  mutationList.forEach( (mutation) => {
    switch(mutation.type) {
      case 'childList':
        /* One or more children have been added to and/or removed
           from the tree.
           (See mutation.addedNodes and mutation.removedNodes.) */
        break;
      case 'attributes':
        /* An attribute value changed on the element in
           mutation.target.
           The attribute name is in mutation.attributeName, and
           its previous value is in mutation.oldValue. */
        break;
    }
  });
}


/*const observer = new MutationObserver(__DIP.Observer);
observer.observe(document, {
  childList: true,
  attributes: true,
  subtree: true
});*/