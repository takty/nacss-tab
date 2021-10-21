/**
 *
 * Utilities
 *
 * @author Takuto Yanagida
 * @version 2021-10-21
 *
 */


function enableClass(enabled, tar, cls) {
	const key = cls.substr(1);
	if (cls.startsWith(':')) {
		if (enabled) {
			tar.dataset[key] = '';
		} else {
			delete tar.dataset[key];
		}
	} else {
		if (enabled) {
			tar.classList.add(key);
		} else {
			tar.classList.remove(key);
		}

	}
}

function throttle(fn) {
	let isRunning;
	return (...args) => {
		if (isRunning) return;
		isRunning = true;
		requestAnimationFrame(() => {
			isRunning = false;
			fn(...args);
		});
	};
}

const resizeListeners = [];

function onResize(fn, doFirst = false) {
	if (doFirst) fn();
	resizeListeners.push(throttle(fn));
}

document.addEventListener('DOMContentLoaded', () => {
	window.addEventListener('resize', () => {
		for (const l of resizeListeners) l();
	}, { passive: true });
});

function onIntersect(fn, doFirst = false, opts = {}) {
	// if (doFirst) fn();
	opts['targets']      = opts['targets']      ?? [];
	opts['marginTop']    = opts['marginTop']    ?? 0;
	opts['marginLeft']   = opts['marginLeft']   ?? 0;
	opts['marginRight']  = opts['marginRight']  ?? 0;
	opts['marginBottom'] = opts['marginBottom'] ?? 0;
	opts['threshold']    = opts['threshold']    ?? 1;

	observeIntersection(fn, opts, opts['targets'].concat());
}

function observeIntersection(fn, os, ts) {
	function init() {
		// for workaround of rootMargin bug on Android Chrome
		const r = 1;//(document.body.classList.contains('android') && NS.BROWSER === 'chrome') ? window.devicePixelRatio : 1;
		const rootMargin = (mt * r) + 'px ' + (os.marginRight * r) + 'px ' + (os.marginBottom * r) + 'px ' + (os.marginLeft * r) + 'px';
		const io = new IntersectionObserver((es) => {
			const vs = Array.from(prevVs);
			for (let i = 0; i < es.length; i += 1) vs[ts.indexOf(es[i].target)] = es[i].isIntersecting;
			if (!isMatch(vs, prevVs)) fn(vs);
			prevVs = vs;
		}, { rootMargin: rootMargin, threshold: os.threshold });
		for (let i = 0; i < ts.length; i += 1) io.observe(ts[i]);
		return io;
	}
	let prevVs = Array(ts.length).fill(false);
	let mt = os.marginTop;
	if (mt !== 'OFFSET') {
		init();
		return;
	}
	let io = null;
	let st = null;
	// const off = NS.makeOffsetFunction(true, true);  // Initialize here
	onResize(() => {
		mt = 0;//-off();
		if (st) clearTimeout(st);
		st = setTimeout(() => {
			if (io) io.disconnect();
			io = init();
		}, 100);
	}, true);
}

function isMatch(vs0, vs1) {
	if (vs1.length !== vs0.length) return false;
	for (let i = 0; i < vs0.length; i += 1) {
		if (vs0[i] !== vs1[i]) return false;
	}
	return true;
}