/**
 *
 * Tab Style (JS)
 *
 * @author Takuto Yanagida
 * @version 2021-11-11
 *
 */


window['NACSS'] = window['NACSS'] || {};


(function (NS) {

	(function () {
		// @include _scroll.js
		NS.tabScroll = initialize;
	})();

	(function () {
		// @include _stack.js
		NS.tabStack = initialize;
	})();

	// @include _style-class.js
	// @include _common.js
	// @include _utilities.js

})(window['NACSS']);
