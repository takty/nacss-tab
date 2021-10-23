/**
 *
 * Utilities
 *
 * @author Takuto Yanagida
 * @version 2021-10-23
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

function onIntersect(fn, targets, threshold) {
	const vs = Array(targets.length).fill(false);
	const tm = new Map();
	targets.forEach((t, i) => tm.set(t, i));

	function init() {
		const io = new IntersectionObserver((es) => {
			for (const e of es) vs[tm.get(e.target)] = e.isIntersecting;
			fn(vs);
		}, { rootMargin: `${mt}px 0px 0px 0px`, threshold });
		for (const t of targets) io.observe(t);
		return io;
	}
	let mt = 0;
	let io = null;
	let st = null;
	onResize(() => {
		const s = getComputedStyle(document.getElementsByTagName('html')[0]);
		mt = -parseInt(s.scrollPaddingTop);
		if (st) clearTimeout(st);
		st = setTimeout(() => {
			if (io) io.disconnect();
			io = init();
		}, 100);
	}, true);
}
