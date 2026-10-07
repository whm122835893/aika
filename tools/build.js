/**
 * Build the offline replica:
 *  - inject an API-replay shim into the app shell + every captured page
 *  - generate index.html (app entry) that boots fully offline
 */
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const ROOT = 'C:/Users/12283/WorkBuddy/2026-10-06-22-09-15';
const OUT = path.join(ROOT, 'output', 'h5.shenyuan.sc.cn');
const PAGES = path.join(OUT, 'pages');

const md5 = (s) => crypto.createHash('md5').update(s).digest('hex');

// Merge every crawl pass: anonymous, authenticated, deep-interaction.
// Later passes win, so an authenticated payload always replaces its 401 twin.
const MAP_FILES = ['asset-map.json', 'asset-map-auth.json', 'asset-map-deep.json', 'asset-map-params.json'];
const apiEntries = [];
for (const mf of MAP_FILES) {
  const p = path.join(ROOT, 'scrape-work', mf);
  if (!fs.existsSync(p)) continue;
  const m = JSON.parse(fs.readFileSync(p, 'utf8'));
  for (const e of (m.api || [])) apiEntries.push(e);
}

// --- build lookup tables -------------------------------------------------
// Key by raw request signature (method + url + post body) — no runtime hashing needed.
const MAP = {};
const BYURL = {}; // last captured response per URL (fallback for encrypted/random bodies)
const urlCode = {}; // url -> best (lowest) response code seen, to prefer real payloads
for (const [key, val] of apiEntries) {
  MAP[val.method + ' ' + val.url + ' ' + val.post] = '/' + val.rel;
  const f = path.join(OUT, val.rel);
  let code = null;
  try { code = JSON.parse(fs.readFileSync(f, 'utf8')).code; } catch (e) {}
  // prefer a successful payload over a 401/405 capture for the URL-level fallback
  if (code === 0 || urlCode[val.url] === undefined || (urlCode[val.url] !== 0 && code === 0)) {
    if (!(urlCode[val.url] === 0 && code !== 0)) { BYURL[val.url] = '/' + val.rel; urlCode[val.url] = code; }
  }
}

// --- rewrite absolute hosts inside cached API responses -------------------
// so the offline app requests local paths instead of the origin.
const HOST_REWRITES = [
  ['https://h5.shenyuan.sc.cn', ''],
  ['http://h5.shenyuan.sc.cn', ''],
  ['https://cdn.dcloud.net.cn', '/assets/ext/dcloud'],
  ['https://cstaticdun.126.net', '/assets/ext/netease'],
  ['https://o.alicdn.com', '/assets/ext/o.alicdn.com'],
  ['https://g.alicdn.com', '/assets/ext/g.alicdn.com'],
  ['https://at.alicdn.com', '/assets/ext/at.alicdn.com'],
  ['https://js.cdn.aliyun.dcloud.net.cn', '/assets/ext/js.cdn.aliyun.dcloud.net.cn'],
];
let rewrittenFiles = 0;
const apiDir = path.join(OUT, 'assets', 'api-cache');
if (fs.existsSync(apiDir)) {
  for (const f of fs.readdirSync(apiDir)) {
    if (!f.endsWith('.json')) continue;
    const abs = path.join(apiDir, f);
    let txt = fs.readFileSync(abs, 'utf8');
    let changed = false;
    for (const [host, repl] of HOST_REWRITES) {
      if (txt.includes(host)) { txt = txt.split(host).join(repl); changed = true; }
    }
    if (changed) { fs.writeFileSync(abs, txt, 'utf8'); rewrittenFiles++; }
  }
}

// --- rewrite hosts inside mirrored CSS (uni-app embeds dcloud URLs) -------
let cssRewritten = 0;
function walkCss(dir) {
  for (const f of fs.readdirSync(dir, { withFileTypes: true })) {
    const abs = path.join(dir, f.name);
    if (f.isDirectory()) walkCss(abs);
    else if (/\.(css|scss|less)$/i.test(f.name)) {
      let txt = fs.readFileSync(abs, 'utf8');
      let changed = false;
      for (const [host, repl] of HOST_REWRITES) {
        if (txt.includes(host)) { txt = txt.split(host).join(repl); changed = true; }
      }
      if (changed) { fs.writeFileSync(abs, txt, 'utf8'); cssRewritten++; }
    }
  }
}
walkCss(path.join(OUT, 'static'));

// --- generate shim -------------------------------------------------------
const shim = `(function () {
  'use strict';
  var MAP = ${JSON.stringify(MAP)};
  var BYURL = ${JSON.stringify(BYURL)};
  function abs(u) { try { return new URL(u, location.href).href; } catch (e) { return u; } }
  function lookup(method, url, body) {
    var b = body == null ? '' : String(body);
    var k = method + ' ' + url + ' ' + b;
    if (MAP[k]) return MAP[k];
    if (BYURL[url]) return BYURL[url];
    return null;
  }

  // ---- rewrite absolute origin URLs on dynamically created elements ----
  var REWRITE = ${JSON.stringify(Object.fromEntries(HOST_REWRITES.map(function (h) { return [h[0], h[1]]; })))};
  function rw(u) {
    u = String(u);
    for (var host in REWRITE) if (u.lastIndexOf(host, 0) === 0) return REWRITE[host] + u.slice(host.length);
    return u;
  }
  function rwAll(s) {
    s = String(s);
    for (var host in REWRITE) s = s.split(host).join(REWRITE[host]);
    return s;
  }
  ['HTMLScriptElement', 'HTMLImageElement', 'HTMLSourceElement', 'HTMLMediaElement', 'HTMLIFrameElement'].forEach(function (t) {
    var C = window[t];
    if (!C || !C.prototype) return;
    var d = Object.getOwnPropertyDescriptor(C.prototype, 'src');
    if (!d || !d.set) return;
    try {
      Object.defineProperty(C.prototype, 'src', {
        configurable: true,
        get: function () { return d.get.call(this); },
        set: function (v) { try { v = rw(v); } catch (e) {} d.set.call(this, v); },
      });
    } catch (e) {}
  });
  var linkDesc = Object.getOwnPropertyDescriptor(HTMLLinkElement.prototype, 'href');
  if (linkDesc && linkDesc.set) {
    try {
      Object.defineProperty(HTMLLinkElement.prototype, 'href', {
        configurable: true,
        get: function () { return linkDesc.get.call(this); },
        set: function (v) { try { v = rw(v); } catch (e) {} linkDesc.set.call(this, v); },
      });
    } catch (e) {}
  }
  var _setAttribute = Element.prototype.setAttribute;
  Element.prototype.setAttribute = function (name, value) {
    try {
      var n = String(name).toLowerCase();
      if (n === 'src' || n === 'href' || n === 'poster' || n === 'data-src') value = rw(value);
    } catch (e) {}
    return _setAttribute.call(this, name, value);
  };

  // uni-app sets its refresher placeholder via style.backgroundImage
  try {
    var bgDesc = Object.getOwnPropertyDescriptor(CSSStyleDeclaration.prototype, 'backgroundImage');
    if (bgDesc && bgDesc.set) {
      Object.defineProperty(CSSStyleDeclaration.prototype, 'backgroundImage', {
        configurable: true,
        get: function () { return bgDesc.get.call(this); },
        set: function (v) { try { v = rwAll(v); } catch (e) {} bgDesc.set.call(this, v); },
      });
    }
  } catch (e) {}

  // ---- fetch ----
  var _fetch = window.fetch;
  window.fetch = function (input, init) {
    try {
      var url = typeof input === 'string' ? input : (input && input.url) || '';
      var method = (init && init.method) || (input && input.method) || 'GET';
      var body = init && init.body ? (typeof init.body === 'string' ? init.body : JSON.stringify(init.body)) : '';
      var p = lookup(method, abs(url), body);
      if (p) return _fetch.call(window, p, { method: 'GET' }).then(function (r) {
        return r.json().then(function (j) {
          return new Response(JSON.stringify(j), { status: 200, headers: { 'content-type': 'application/json' } });
        }, function () { return r; });
      });
    } catch (e) {}
    return _fetch.apply(window, arguments);
  };

  // ---- XHR ----
  var XHR = window.XMLHttpRequest;
  var _open = XHR.prototype.open;
  var _send = XHR.prototype.send;
  XHR.prototype.open = function (m, u) {
    this.__pp_m = m; this.__pp_u = u;
    return _open.apply(this, arguments);
  };
  XHR.prototype.send = function (b) {
    var self = this;
    try {
      var p = lookup(this.__pp_m, abs(this.__pp_u), b);
      if (p) {
        _fetch.call(window, p, { method: 'GET' }).then(function (r) { return r.text(); }).then(function (t) {
          try {
            Object.defineProperty(self, 'readyState', { value: 4, configurable: true });
            Object.defineProperty(self, 'status', { value: 200, configurable: true });
            Object.defineProperty(self, 'responseText', { value: t, configurable: true });
            Object.defineProperty(self, 'response', { value: t, configurable: true });
            self.getAllResponseHeaders = function () { return 'content-type: application/json\\r\\n'; };
            self.getResponseHeader = function (n) { return String(n).toLowerCase() === 'content-type' ? 'application/json' : null; };
          } catch (e) {}
          ['readystatechange', 'progress', 'load', 'loadend'].forEach(function (ev) {
            try { self.dispatchEvent(new Event(ev)); } catch (e2) {}
          });
        });
        return;
      }
    } catch (e) {}
    return _send.apply(this, arguments);
  };
  window.__OFFLINE_REPLAY__ = true;
  console.log('[offline-replay] API replay shim active, ' + Object.keys(MAP).length + ' cached endpoints');
})();
`;

fs.mkdirSync(path.join(OUT, 'assets'), { recursive: true });
fs.writeFileSync(path.join(OUT, 'assets', 'offline-shim.js'), shim, 'utf8');

// --- inject shim into shell + all captured pages -------------------------
const SHIM_TAG = '<script src="/assets/offline-shim.js"></script>';

function inject(html) {
  if (html.includes('offline-shim.js')) return html;
  // insert before first <script
  const i = html.indexOf('<script');
  if (i === -1) return html + SHIM_TAG;
  return html.slice(0, i) + SHIM_TAG + html.slice(i);
}

// regenerate the app entry from the original shell
const shell = `<!DOCTYPE html><html lang=zh-CN><head><meta charset=utf-8><meta http-equiv=X-UA-Compatible content="IE=edge"><title>ICARD 爱卡集市</title><script>var coverSupport = 'CSS' in window && typeof CSS.supports === 'function' && (CSS.supports('top: env(a)') || CSS.supports('top: constant(a)'))
            document.write('<meta name="viewport" content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0' + (coverSupport ? ', viewport-fit=cover' : '') + '" />')</script><link rel=stylesheet href=/static/index.149e085d.css>${SHIM_TAG}</head><body><noscript><strong>Please enable JavaScript to continue.</strong></noscript><div id=app></div><script src=/static/js/chunk-vendors.2a78a84d.js></script><script src=/static/js/index.0dd47030.js></script></body></html>`;
fs.writeFileSync(path.join(OUT, 'index.html'), shell, 'utf8');

// Aggressive rewrite for pages that inject scripts via innerHTML/document.write.
// Only applied to blank-ish utility pages — this patching style breaks uni-app mounting.
const AGGRESSIVE_PAGES = ['pages-common-aliyunCaptcha.html'];
const aggressiveTag = `<script>(function(){var R=${JSON.stringify(Object.fromEntries(HOST_REWRITES))};function rw(s){s=String(s);for(var h in R)s=s.split(h).join(R[h]);return s}try{var d=Object.getOwnPropertyDescriptor(Element.prototype,'innerHTML');Object.defineProperty(Element.prototype,'innerHTML',{configurable:true,get:function(){return d.get.call(this)},set:function(v){d.set.call(this,rw(v))}})}catch(e){}try{var w=Document.prototype.write;Document.prototype.write=function(){return w.apply(this,Array.prototype.map.call(arguments,rw))}}catch(e){}try{var c=Object.getOwnPropertyDescriptor(CSSStyleDeclaration.prototype,'cssText');Object.defineProperty(CSSStyleDeclaration.prototype,'cssText',{configurable:true,get:function(){return c.get.call(this)},set:function(v){c.set.call(this,rw(v))}})}catch(e){}})();</script>`;

// inject into every captured page snapshot + rewrite absolute hosts to local paths
let injected = 0;
for (const f of fs.readdirSync(PAGES)) {
  if (!f.endsWith('.html')) continue;
  const p = path.join(PAGES, f);
  let before = fs.readFileSync(p, 'utf8');
  let after = inject(before);
  for (const [host, repl] of HOST_REWRITES) after = after.split(host).join(repl);
  if (AGGRESSIVE_PAGES.includes(f) && !after.includes('innerHTML')) {
    after = after.replace(SHIM_TAG, SHIM_TAG + aggressiveTag);
  }
  if (after !== before) { fs.writeFileSync(p, after, 'utf8'); injected++; }
}

console.log('shim endpoints: ' + Object.keys(MAP).length + ' (distinct URLs: ' + Object.keys(BYURL).length + ')');
console.log('api-cache host rewrites: ' + rewrittenFiles + ' files');
console.log('index.html written; injected into ' + injected + ' page snapshots');
