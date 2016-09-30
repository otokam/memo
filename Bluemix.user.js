// ==UserScript==
// @name        Bluemix
// @namespace   http://ng.bluemix.net
// @include     https://new-console.ng.bluemix.net/
// @include     https://new-console.ng.bluemix.net/#overview
// @include     https://new-console.ng.bluemix.net/#all-items
// @include     https://new-console.ng.bluemix.net/dashboard/*
// @include     https://new-console.eu-gb.bluemix.net/
// @include     https://new-console.eu-gb.bluemix.net/#overview
// @include     https://new-console.eu-gb.bluemix.net/#all-items
// @include     https://new-console.eu-gb.bluemix.net/dashboard/*
// @include     https://new-console.au-syd.bluemix.net/
// @include     https://new-console.au-syd.bluemix.net/#overview
// @include     https://new-console.au-syd.bluemix.net/#all-items
// @include     https://new-console.au-syd.bluemix.net/dashboard/*
// @version     1
// @grant       none
// ==/UserScript==
(function() {
	$(window).load(function() {
		var observer = new MutationObserver(function(mutations) {
			mutations.forEach(function(mutation, index, array) {
				var addedNodes = mutation.addedNodes;
				for (var i = 0; i < addedNodes.length; i++) {
					var node = addedNodes.item(i);
					var str = "" + node.tagName;
					if (str != "undefined") {
						node.parentNode.removeChild(node);
					}
				}
			});
		});
		observer.observe(document.getElementById("body"), {
			childList: true
		});
	});
})();
