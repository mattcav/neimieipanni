/* Load this script using conditional IE comments if you need to support IE 7 and IE 6. */

window.onload = function() {
	function addIcon(el, entity) {
		var html = el.innerHTML;
		el.innerHTML = '<span style="font-family: \'icomoon\'">' + entity + '</span>' + html;
	}
	var icons = {
			'icon-skull' : '&#x271d;',
			'icon-danger' : '&#x2757;',
			'icon-bomb' : '&#x2b55;',
			'icon-thumb-down' : '&#xe003;',
			'icon-thumb-up' : '&#xe004;',
			'icon-money' : '&#xe000;',
			'icon-sad' : '&#x2639;',
			'icon-happy' : '&#x263a;',
			'icon-time' : '&#x23f0;',
			'icon-arrow-rt' : '&#x2192;',
			'icon-arrow-lt' : '&#x2190;',
			'icon-arrow-left' : '&#x21e0;',
			'icon-arrow-right' : '&#x21e2;'
		},
		els = document.getElementsByTagName('*'),
		i, attr, c, el;
	for (i = 0; ; i += 1) {
		el = els[i];
		if(!el) {
			break;
		}
		attr = el.getAttribute('data-icon');
		if (attr) {
			addIcon(el, attr);
		}
		c = el.className;
		c = c.match(/icon-[^\s'"]+/);
		if (c && icons[c[0]]) {
			addIcon(el, icons[c[0]]);
		}
	}
};