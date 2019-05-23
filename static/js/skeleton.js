window.onload = function() {
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