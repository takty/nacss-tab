/**
 *
 * Stack (JS)
 *
 * @author Takuto Yanagida
 * @version 2021-10-21
 *
 */


const PAGE_WINDOW_HEIGHT_RATIO = 0.8;

// let noFocus;

function initialize(cs, opts = {}) {
	if (cs.length === 0) return;

	opts = Object.assign({
		styleBar    : ':ncTabBar',
		styleCurrent: ':ncCurrent',
		styleActive : ':ncActive',
		hashPrefix  : 'tst:',
	}, opts);


	const tabPages = [];
	for (let i = 0; i < cs.length; i += 1) {
		tabPages.push(create(cs[i], i + 1, opts));
	}

	onResize(() => onResizeAll(tabPages, opts), true);
	setTimeout(() => {  // Delay
		onResizeAll(tabPages, opts);
		// onHash(tabPages, opts);
	}, 200);
	// window.addEventListener('hashchange', () => { onHash(tabPages, opts); });

	const pn = window.location.pathname;
	for (let i = 0; i < tabPages.length; i += 1) {
		const cs = tabPages[i].tabs;
		for (const c of cs) {
			addAnchorJumpEvent(tabPages, c.dataset['id'] ? c.dataset['id'] : c.id, pn);
		}
	}

	const h = location.hash;
	if (h.indexOf('#') !== -1) {
		const id = h.replace('#', '');
		if (!id) return;
		console.log(id);
		// const tar = document.getElementById(id);
		// if (inst.uls.indexOf(tar) !== 0) {
		// 	inst.active = tar;
		// }
	}

}

function addAnchorJumpEvent(tps, id, pn) {
	const as = document.querySelectorAll('a[href $= "#' + id + '"]');
	console.log(as);
	for (let i = 0; i < as.length; i += 1) {
		const href = as[i].getAttribute('href');
		if (href[0] !== '#') {
			const url = href.substr(0, href.lastIndexOf('#'));
			if (url.lastIndexOf(pn) !== url.length - pn.length) continue;
		}
		// as[i].addEventListener('click', () => { setTimeout(() => { onHash(tps, opts); }, 0); });
	}
}

function create(container, contIdx, opts) {
	const fh = getFirstHeading(container);
	if (!fh) return false;
	const tabH = fh.tagName;

	const pages = [], htmls = [];
	const cs = [].slice.call(container.children);
	let curPage = null;

	for (let i = 0; i < cs.length; i += 1) {
		const c = cs[i];
		if (c.tagName === tabH) {
			if (curPage) pages.push(curPage);
			curPage = document.createElement('div');
			container.removeChild(c);
			htmls.push(c.innerHTML);
		} else {
			if (curPage) curPage.appendChild(c);
		}
	}
	if (curPage) pages.push(curPage);

	const tp = { pages, container, currentIdx: 0, isAccordion: false, contIdx };
	createTab(htmls, tp, opts);

	container.insertBefore(tp.tabUl, container.firstChild);
	for (const p of pages) container.appendChild(p);
	container.appendChild(tp.tabUl2);

	return tp;
}

function createTab(htmls, tp, opts) {
	tp.tabUl = document.createElement('ul');
	for (let i = 0; i < htmls.length; i += 1) {
		const a = createAnchor(opts.hashPrefix + (tp.contIdx) + '-' + (i + 1), htmls[i]);
		const li = document.createElement('li');
		li.appendChild(a);
		tp.tabUl.appendChild(li);
	}
	enableClass(true, tp.tabUl, opts.styleBar);
	tp.tabs = [].slice.call(tp.tabUl.children);

	tp.tabUl2 = tp.tabUl.cloneNode(true);
	enableClass(true, tp.tabUl2, opts.styleBar);
	tp.tabs2 = [].slice.call(tp.tabUl2.children);
	addTabEvent(tp, opts);

	setTimeout(() => {
		tp.isAccordion = getComputedStyle(tp.tabUl).flexDirection === 'column';
		update(tp, tp.isAccordion ? -1 : 0, opts);
	}, 10);
}

function createAnchor(id, html) {
	const a = document.createElement('a');
	a.href = '#' + id;
	a.innerHTML = html;
	for (const ss of a.querySelectorAll('small')) ss.remove();
	for (const ss of a.querySelectorAll('a')) ss.remove();
	return a;
}

function addTabEvent(tp, opts) {
	const ts  = tp.tabs;
	const ts2 = tp.tabs2;

	for (let i = 0; i < ts.length; i += 1) {
		const f = (function (idx) {
			return (e) => {
				onClick(e, tp, idx, opts);
			};
		})(i);
		ts[i].addEventListener('click', f);
		ts2[i].addEventListener('click', f);
		// ts[i].addEventListener('keypress',  (e) => { if (e.keyCode === 13) f(e); });
		// ts2[i].addEventListener('keypress', (e) => { if (e.keyCode === 13) f(e); });
	}
}

// function onHash(tps, opts) {
// 	// console.log(window.location.hash);
// 	const [hCont, hPage] = extractIndexFromHash(window.location.hash, opts);
// 	if (hCont === null) {
// 		for (let i = 0; i < tps.length; i += 1) {
// 			if (!tps[i]) continue;
// 			update(tps[i], tps[i].isAccordion ? -1 : 0, opts);
// 		}
// 	} else {
// 		update(tps[hCont], hPage, opts);
// 	}
// }

function onClick(e, tp, idx, opts) {
	// e.preventDefault();
	// if (!tp.isAccordion && tp.currentIdx === idx) {
	// 	window.location.hash = null;
	// 	return;
	// }
	e.preventDefault();
	e.stopPropagation();
	if (getComputedStyle(e.target.parentElement).pointerEvents === 'none') return;
	if (tp.currentIdx === idx) {
		// console.log('close');
		// window.location.hash = '';
		// history.pushState({}, null, '');
		idx = -1;
		// return;
	}
	const hash = opts.hashPrefix + (tp.contIdx) + '-' + (idx + 1);
	const url = '#' + (idx === -1 ? '' : (opts.hashPrefix + hash));
	history.pushState({}, null, url);

	update(tp, idx, opts);
	// scrollToTab(tp);
	// // pushTabState(tp, opts);
	// if (!tp.isAccordion) resizeTab(tp, true, opts);
}

function scrollToTab(tp) {
	if (tp.currentIdx === -1) return;
	setTimeout(() => {
		const bcr  = tp.tabUl.getBoundingClientRect();
		if (0 <= bcr.top && bcr.top <= window.innerHeight && 0 <= bcr.bottom && bcr.bottom <= window.innerHeight) return;
		const bcr2 = tp.tabUl2.getBoundingClientRect();
		if (tp.isAccordion || (bcr2.top < 0 || window.innerHeight < bcr2.bottom)) {
			// const tar = tp.tabUl.firstChild.querySelector('[data-stile~="anchor-offset"]');
			// NS.jumpToElement(tar ? tar : tp.tabUl, 200, false);
		}
	}, 10);
}


// -------------------------------------------------------------------------


function extractIndexFromHash(hash, opts) {
	if (hash.indexOf('#' + opts.hashPrefix) !== 0) return [null, null];
	const cp = hash.replace('#' + opts.hashPrefix, '').split('-');
	if (cp.length !== 2) return [null, null];
	return [parseInt(cp[0]) - 1, parseInt(cp[1]) - 1];
}


// -------------------------------------------------------------------------


function update(tp, idx, opts) {
	// if (tp.isAccordion) {
	// 	idx = tp.currentIdx === idx ? -1 : idx;
	// 	// updateAccordion(tp, idx);
	// }
	// updateTab(tp, idx, opts);
	const ts  = tp.tabs;
	const ts2 = tp.tabs2;
	const ps  = tp.pages;

	for (let i = 0; i < ts.length; i += 1) {
		enableClass(i === idx, ts[i],  opts.styleCurrent);
		enableClass(i === idx, ts2[i], opts.styleCurrent);
		enableClass(i === idx, ps[i],  opts.styleCurrent);
	}
	tp.currentIdx = idx;
}

// function updateAccordion(tp, idx) {
	// const ts = tp.tabs, ts2 = tp.tabs2;

	// if (idx === -1) {
	// 	for (let i = 0; i < ts.length; i += 1) {
	// 		ts[i].style.display  = '';
	// 		ts2[i].style.display = 'none';
	// 	}
	// } else {
	// 	for (let i = 0; i < ts.length; i += 1) {
	// 		ts[i].style.display  = (i <= idx) ? '' : 'none';
	// 		ts2[i].style.display = (i > idx)  ? 'flex' : 'none';
	// 	}
	// }
// }

// function updateTab(tp, idx, opts) {
// 	const ts = tp.tabs, ts2 = tp.tabs2;
// 	const ps = tp.pages;

// 	for (let i = 0; i < ts.length; i += 1) {
// 		enableClass(i === idx, ts[i],  opts.styleCurrent);
// 		enableClass(i === idx, ts2[i], opts.styleCurrent);
// 		enableClass(i === idx, ps[i],  opts.styleCurrent);
// 	}
// 	tp.currentIdx = idx;
// }


// -------------------------------------------------------------------------


function onResizeAll(tps, opts) {
	for (let i = 0; i < tps.length; i += 1) {
		if (!tps[i]) continue;
		resizeOne(tps[i], opts);
	}
}

function resizeOne(tp, opts) {
	const cont = tp.container;
	tp.isAccordion = getComputedStyle(tp.tabUl2).flexDirection === 'column';

	if (tp.isAccordion) {
		cont.style.minHeight = '';
	} else {
		const minH = getMinHeight(tp);
		const h = (minH < window.innerHeight * PAGE_WINDOW_HEIGHT_RATIO) ? (minH + 'px') : '';
		cont.style.minHeight = h;

		if (tp.currentIdx === -1) {
			update(tp, 0, opts);
		}
	}
}

// function resizeAccordion(tp, prevIsAccordion, opts) {
// 	const cont = tp.container;
// 	cont.style.minHeight = '';
// 	// cont.style.height    = '';
// 	// if (prevIsAccordion !== tp.isAccordion) updateTab(tp, -1, opts);
// 	// updateAccordion(tp, tp.currentIdx);
// }

// function resizeTab(tp, suppressTabClick, opts) {
// 	const cont = tp.container;
// 	const minH = getMinHeight(tp);

// 	const h = (minH < window.innerHeight * PAGE_WINDOW_HEIGHT_RATIO) ? (minH + 'px') : '';
// 	cont.style.minHeight = h;
// 	// cont.style.height    = h;

// 	// const ts = tp.tabs, ts2 = tp.tabs2;

// 	// for (let i = 0; i < ts.length; i += 1) {
// 	// 	ts[i].style.display  = '';
// 	// 	ts2[i].style.display = '';
// 	// }
// 	if (tp.currentIdx === -1) tp.currentIdx = 0;
// 	if (!suppressTabClick) update(tp, tp.currentIdx, opts);
// }

function getMinHeight(tp) {
	const tabUl  = tp.tabUl;
	const tabUl2 = tp.tabUl2;

	let marginBtm = parseInt(getComputedStyle(tabUl).marginBottom);
	let marginTop = parseInt(getComputedStyle(tabUl2).marginTop);
	let height = 0;

	for (const p of tp.pages) {
		const ps = getComputedStyle(p);
		const mt = parseInt(ps.marginTop);
		const mb = parseInt(ps.marginBottom);
		const h  = p.getBoundingClientRect().height;

		marginBtm = Math.max(marginBtm, mt);
		marginTop = Math.max(marginTop, mb);
		height    = Math.max(height, h);
	}
	return tabUl.offsetHeight + tabUl2.offsetHeight + marginBtm + marginTop + height;
}
