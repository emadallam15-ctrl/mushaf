const V="mushaf-v1"; /* نفس اسم الذاكرة كي لا تضيع الصفحات المحمّلة */
const SHELL=["./","index.html","manifest.webmanifest","icon-192.png","icon-512.png","apple-touch-icon.png","map.js"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(V).then(c=>Promise.all(SHELL.map(u=>fetch(u,{cache:"reload"}).then(r=>{if(r.ok)return c.put(u,r)}).catch(()=>{})))).then(()=>self.skipWaiting()))});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==V&&!k.startsWith("mushaf-audio")).map(k=>caches.delete(k)))).then(()=>self.clients.claim()).then(()=>self.clients.matchAll({type:"window"})).then(cs=>cs.forEach(c=>{try{c.navigate(c.url)}catch(x){}})))});
self.addEventListener("fetch",e=>{
 const rq=e.request;if(rq.method!=="GET")return;
 const u=new URL(rq.url);if(u.origin!==location.origin)return;const page=rq.mode==="navigate"||u.pathname.endsWith("/index.html")||u.pathname.endsWith("/");
 if(page){e.respondWith(fetch(rq,{cache:"no-cache"}).then(res=>{if(res.ok&&u.origin===location.origin){const cp=res.clone();caches.open(V).then(c=>c.put(rq,cp))}return res}).catch(()=>caches.match(rq,{ignoreSearch:true}).then(r=>r||caches.match("index.html")||caches.match("./"))));return}
 e.respondWith(caches.match(rq,{ignoreSearch:true}).then(r=>r||fetch(rq).then(res=>{if(res.ok&&u.origin===location.origin){const cp=res.clone();caches.open(V).then(c=>c.put(rq,cp))}return res})));
});
