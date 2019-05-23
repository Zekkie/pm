    
var cache_name = "zekkie-cache-1";
var urls = [
	"/css/vendor.css",
	"/js/script.js"
];




self.addEventListener("install",function(event) {
	event.waitUntil(
		caches.open(cache_name).then(function(cache){
			return cache.addAll(urls);
		})
	);
});

self.addEventListener("fetch", function(event){

	event.respondWith(
		caches.match(event.request).then(function(response) {
			if(response) {
				console.log(response)
				return response
			}
			return fetch(event.request);
		})
	);
});

//tset