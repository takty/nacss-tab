/**
 *
 * Tab
 *
 * @author Takuto Yanagida
 * @version 2021-12-07
 *
 */


'use strict';

window['NACSS'] = window['NACSS'] || {};


(function (NS) {

	{
		// @include _scroll.js
		NS.tabScroll = initialize;
	}

	{
		// @include _stack.js
		NS.tabStack = initialize;
	}

	// @include _common.js
	// @include _style-class.js
	// @include _utility.js

})(window['NACSS']);
