class ScriptCache {
  constructor(scripts) {
    this.loaded = [];
    this.failed = [];
    this.pending = [];
    this.load(scripts);
  }

  onLoad(success, reject) {
    this.cb_success = success;
    this.cb_reject = reject;
  }

  load(scripts) {
    scripts.forEach( src => this.loadSrc(src) );
  }

  loadSrc(src) {
    if (this.loaded.indexOf(src) >= 0) {
      return Promise.resolve(src);
    }

    this.pending.push(src);
    return this.scriptTag(src)
      .then(() => {
        if (this.cb_success) {
          this.cb_success();
        }
      })
      .catch(() => {
        if (this.cb_reject) {
          this.cb_reject();
        }
      })
  }

  scriptTag(src, cb) {
    return new Promise((resolve, reject) => {
      // let resolved = false,
      //     errored = false;
      let body = document.getElementsByTagName('body')[0],
          tag = document.createElement('script');

      tag.type = 'text/javascript';
      tag.async = false; // Load in order

      // const handleCallback = tag.onreadystatechange = function() {
      //   if (resolved) return handleLoad();
      //   if (errored) return handleReject();
      //   const state = tag.readyState;
      //   if (state === 'complete') {
      //     handleLoad()
      //   } else if (state === 'error') {
      //     handleReject()
      //   }
      // }

      const handleLoad = (evt) => { resolve(src); }
      const handleReject = (evt) => { reject(src); }

      tag.addEventListener('load', handleLoad);
      tag.addEventListener('error', handleReject);
      tag.src = src;
      body.appendChild(tag);
      return tag;
    });
  }
}

export default ScriptCache;
