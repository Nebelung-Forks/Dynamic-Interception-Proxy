import('/proxify.module.js').then(Rewriter => {
  Rewriter = Rewriter.default
  var rewriteURL = new Rewriter(config)
  
  window.history.pushState = new Proxy(window.history.pushState, {
    apply(t, g, a) {
      if (a[2]) a[2] = rewriteURL.encode(a[2])
      return Reflect.apply(t, g, a)
    }
  })
  
  window.history.replaceState = new Proxy(window.history.replaceState, {
    apply(t, g, a) {
      if (a[2]) a[2] = rewriteURL.encode(a[2])
      return Reflect.apply(t, g, a)
    }
  })
  console.log(history.pushState)
})