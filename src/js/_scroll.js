/**
 *
 * Tab - Scroll (JS)
 *
 * @author Takuto Yanagida
 * @version 2021-10-22
 *
 */


function initialize(cs, opts = {}) {
	if (cs.length === 0) return;

	opts = Object.assign({
		styleBar    : ':ncTabBar',
		styleCurrent: ':ncCurrent',
		styleActive : ':ncActive',
		hashPrefix  : 'tsc:',
	}, opts);
	for (let i = 0; i < cs.length; i += 1) {
		create(cs[i], i + 1, opts);
	}
}

function create(cont, cid, opts) {
	const inst = {
		opts,
		vs    : null,
		uls   : [],
		active: null,
	}
	const hs = extractHeaders(cont, cid, opts.hashPrefix);
	if (hs.length === 0) return false;

	const bars = [];
	for (const h of hs) {
		const bar = createBar(hs, h, opts);
		cont.insertBefore(bar.ul, h.elm);
		bars.push(bar);
		inst.uls.push(bar.ul);
	}
	assignEvent(inst, bars);
}


// -------------------------------------------------------------------------


function extractHeaders(cont, cid, prefix) {
	const fh = getFirstHeading(cont);
	if (!fh) return [];
	const tn = fh.tagName;
	const hs = [];

	for (const elm of Array.from(cont.children)) {
		if (elm.tagName === tn) {
			const id = `${prefix}${cid}-${hs.length + 1}`;
			hs.push({ elm, id });
		}
	}
	return hs;
}

function createBar(hs, curH, opts) {
	const ul = document.createElement('ul');
	ul.id = curH.id;
	ul.className = '';  // for Dummy
	enableClass(true, ul, opts.styleBar);
	const as = [];

	for (const h of hs) {
		const a = createAnchor(h);
		const li = document.createElement('li');
		if (h === curH) enableClass(true, li, opts.styleCurrent);
		li.appendChild(a);
		ul.appendChild(li);
		as.push(a);
	}
	return { ul, as };
}

function createAnchor(h) {
	const a = document.createElement('a');
	a.href = '#' + h.id;
	a.innerHTML = h.elm.innerHTML;
	for (const ss of a.querySelectorAll('small')) ss.remove();
	for (const ss of a.querySelectorAll('a')) ss.remove();
	a.title = a.innerText;
	return a;
}


// -------------------------------------------------------------------------


function assignEvent(inst, bars) {
	for (const bar of bars) {
		bar.as.forEach((a, i) => {
			a.addEventListener('click', () => onClick(inst, bars[i].ul));
		});
	}
	onIntersect((vs) => {
		inst.vs = vs;
		update(inst);
	}, true, { targets: inst.uls, marginTop: 'OFFSET', threshold: 0 });

	const h = location.hash;
	if (h.indexOf('#') !== -1) {
		const id = h.replace('#', '');
		if (!id) return;
		const tar = document.getElementById(id);
		if (inst.uls.indexOf(tar) !== 0) {
			inst.active = tar;
		}
	}
	setTimeout(() => update(inst), 10);
}

function onClick(inst, clicked) {
	inst.active = clicked;
	setTimeout(() => update(inst), 10);
	setTimeout(() => {
		if (inst.active) {
			const y = inst.active.getBoundingClientRect().top;
			inst.active = null;
			if (window.innerHeight < y) update(inst);
		}
	}, 1000);
}

function update(inst) {
	const tar = inst.active ? inst.active : getFirstVisible(inst);
	for (const ul of inst.uls) {
		enableClass(ul === tar, ul, inst.opts.styleActive);
	}
}

function getFirstVisible(inst) {
	if (!inst.vs) return null;
	return inst.uls.find((ul, i) => inst.vs[i]);
}
