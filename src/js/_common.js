/**
 *
 * Common Functions
 *
 * @author Takuto Yanagida
 * @version 2021-10-19
 *
 */


function getFirstHeading(container) {
	const cs = container.children;
	for (let i = 0; i < cs.length; i += 1) {
		if (/^H[1-6]$/.test(cs[i].tagName)) return cs[i];
	}
	return null;
}
