/**
 * Tab Stack
 *
 * @author Takuto Yanagida
 * @version 2021-12-26
 */

'use strict';

window['NACSS']        = window['NACSS']        || {};
window['NACSS']['tab'] = window['NACSS']['tab'] || {};

((NS) => {

	// @include __style-class.js
	// @include __utility.js

	// @include _stack.js
	NS.applyStack = apply;

	// @include _common.js

})(window['NACSS']['tab']);
