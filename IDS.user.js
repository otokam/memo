// ==UserScript==
// @name        IDS
// @namespace   http://ng.bluemix.net
// @include     https://hub.jazz.net/
// @version     1
// @grant       none
// ==/UserScript==
(function() {
	css = document.styleSheets.item(document.styleSheets.length - 1);
	var idx = document.styleSheets[0].cssRules.length;
	css.insertRule(".project-tile.lightTile.f_left.mam.large-tile.with-footer, .darkTile.f_left.mam.large-tile.title-only { height:60px;width:calc(50% - 4px); margin:2px 2px;border-width:0px;}", idx++);
	css.insertRule(".project-tile.lightTile.f_left.mam.large-tile.with-footer:hover { box-shadow:none;}", idx++);
	css.insertRule(".project-tile.lightTile.f_left.mam.large-tile.with-footer div.footer {width:auto; top:12px; left:auto; right:35px;}", idx++);
	css.insertRule(".project-tile.lightTile.f_left.mam.large-tile.with-footer div.settings {top:18px;}", idx++);
	css.insertRule(".project-tile.lightTile.f_left.mam.large-tile.with-footer div.avatar {left:5px;top:5px;}", idx++);
	css.insertRule(".project-tile.lightTile.f_left.mam.large-tile.with-footer div.large-tile {height:60px;}", idx++);
	css.insertRule(".project-tile.lightTile.f_left.mam.large-tile.with-footer div.content.project-tile-content {height:100%; padding:0px 60px; line-height:60px;}", idx++);
	css.insertRule(".project-tile.lightTile.f_left.mam.large-tile.with-footer div.info {position:relative;}", idx++);
})();
