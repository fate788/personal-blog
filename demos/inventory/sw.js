const cachePrefix="mobile-inventory-";
const cacheScope=self.registration.scope;
const cacheName=cachePrefix+"v1.1:"+cacheScope;
const shell="./index.html";
const common=["./manifest.webmanifest","./icon-192.png","./icon-512.png","./hero.webp","./scan-station.webp"];
const modules=["./styles.css","./app.mjs","./offline.mjs","./storage.mjs","./transport.mjs"];
const files=[shell,...common,...modules];
self.addEventListener("install",event=>{
  event.waitUntil((async()=>{
    const cache=await caches.open(cacheName);
    const entry=new URL(shell,self.registration.scope);
    const response=await fetch(entry,{cache:"reload"});
    if(!response.ok)throw new Error("Unable to cache offline workspace.");
    const isPublic=(await response.clone().text()).includes('data-edition="public"');
    await cache.addAll((isPublic?common:[...common,...modules]).map(path=>new URL(path,self.registration.scope)));
    await cache.put(entry,response);
    await self.skipWaiting();
  })());
});
self.addEventListener("activate",event=>{
  event.waitUntil((async()=>{
    const keys=await caches.keys();
    const previous=keys.filter(key=>key!==cacheName&&key.startsWith(cachePrefix)&&key.slice(key.indexOf(":")+1)===cacheScope);
    await Promise.all(previous.map(key=>caches.delete(key)));
    await self.clients.claim();
  })());
});
self.addEventListener("fetch",event=>{
  const url=new URL(event.request.url);
  const scope=new URL(self.registration.scope);
  if(event.request.method!=="GET" || url.origin!==scope.origin || !url.pathname.startsWith(scope.pathname))return;
  const resource=url.pathname.slice(scope.pathname.length);
  if(resource.startsWith("api/"))return;
  const navigation=event.request.mode==="navigate";
  if(!navigation&&!files.some(file=>resource===file.slice(2)))return;
  event.respondWith((async()=>{
    const cache=await caches.open(cacheName);
    const path=new URL(navigation?"./index.html":"./"+resource,scope);
    try{
      const response=await fetch(event.request);
      if(!response.ok)return response;
      const type=response.headers.get("Content-Type") || "";
      if(navigation && !type.startsWith("text/html"))return response;
      await cache.put(path,response.clone());
      return response;
    }catch(error){
      return await cache.match(path) || Response.error();
    }
  })());
});
