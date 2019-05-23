if("serviceWorker" in navigator) {
	window.onload = function() {
		navigator.serviceWorker.register("/sw.js").then(function(reg) {
			console.log(reg.scope)
		}, function(err) {
			console.log(err)
		})
	}
}