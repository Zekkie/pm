window.onload = function() {

	if("serviceWorker" in navigator) {
		navigator.serviceWorker.register("/sw.js").then(function(reg) {
			console.log(reg.scope)
		}, function(err) {
			console.log(err)
		})
	}

	if(window.location.href.indexOf("source") >= 0) {
		var img = document.querySelectorAll("img");
		for(var i = 0; i < img.length; i++) {
			img[i].src = img[i].dataset.src;
			img[i].onload = function() {
				var section = this.parentNode.parentNode;

				section.removeChild(section.querySelector(".skeleton"));
			}
		}
	}
}