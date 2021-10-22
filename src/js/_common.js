/**
 *
 * Common Functions
 *
 * @author Takuto Yanagida
 * @version 2021-10-22
 *
 */


function getFirstHeading(container) {
	const cs = container.children;
	for (let i = 0; i < cs.length; i += 1) {
		if (/^H[1-6]$/.test(cs[i].tagName)) return cs[i];
	}
	return null;
}

function createAnchor(h) {
	const a = document.createElement('a');
	a.href = '#' + h.id;
	a.innerHTML = h.elm.innerHTML;
	a.querySelectorAll('small').forEach(e => e.remove());
	a.querySelectorAll('a').forEach(e => e.remove());
	a.title = a.innerText;
	return a;
}
