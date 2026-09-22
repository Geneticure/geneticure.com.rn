(function () {
	var b = document.getElementById('burger'), m = document.getElementById('menu');
	b.addEventListener('click', function () {
		var open = m.classList.toggle('open');
		b.setAttribute('aria-expanded', open ? 'true' : 'false');
	});
	m.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', function () { m.classList.remove('open'); b.setAttribute('aria-expanded', 'false'); }); });
})();

/* The 35M eligible-patient chart. Each bar is the full 35M; its segments are
   widths as a percentage of that track and must sum to 100. Bracket widths are
   the share of the 35M the willingness figure below the bar is drawn from.
   Revise the figures here; the markup and the stylesheet carry none. */
(function () {
	var CHART = {
		unscreened: {
			bracket: 100,			// willingness applies to all 35M eligible
			segments: [
				{ fill: 'responding', width: 16.86, label: '5.9M' },
				{ fill: 'noresponse', width: 7.14, label: '2.5M' },
				{ fill: 'untreated', width: 76, label: '26.6M never treated' }
			]
		},
		screened: {
			bracket: 100,			// willingness applies to all 35M eligible
			segments: [
				{ fill: 'responding', width: 54, label: '18.9M treated and responding' },
				{ fill: 'declined', width: 16, label: '5.6M' },
				{ fill: 'untreated', width: 30, label: '10.5M screened out' }
			]
		}
	};

	var labels = [];
	Object.keys(CHART).forEach(function (key) {
		var track = document.querySelector('[data-track="' + key + '"]');
		if (!track) return;
		var read = [];
		CHART[key].segments.forEach(function (s) {
			var seg = document.createElement('span');
			seg.className = 'bar-seg seg-' + s.fill;
			seg.style.width = s.width + '%';
			var label = document.createElement('span');
			label.className = 'seg-label';
			label.textContent = s.label;
			seg.appendChild(label);
			track.appendChild(seg);
			labels.push(label);
			read.push(s.label);
		});
		track.setAttribute('aria-label', 'Of 35M eligible patients: ' + read.join(', ') + '.');

		var bracket = document.querySelector('[data-bracket="' + key + '"]');
		if (bracket) bracket.style.width = CHART[key].bracket + '%';
	});
	if (!labels.length) return;

	/* Drop any inline label the segment is too narrow to hold, rather than let
	   it overflow. The legend and the caption below the bar carry the meaning. */
	function fitLabels() {
		labels.forEach(function (l) { l.classList.remove('hide'); });
		labels.forEach(function (l) {
			if (l.offsetWidth + 12 > l.parentNode.clientWidth) l.classList.add('hide');
		});
	}
	fitLabels();
	if (window.ResizeObserver) {
		var ro = new ResizeObserver(fitLabels);
		document.querySelectorAll('[data-track]').forEach(function (t) { ro.observe(t); });
	} else {
		window.addEventListener('resize', fitLabels);
	}
	if (document.fonts && document.fonts.ready) document.fonts.ready.then(fitLabels);
})();

(function () {
	var f = document.getElementById('contactForm'); if (!f) return;
	var s = document.getElementById('cformStatus');
	var btn = f.querySelector('.cform-btn');
	f.addEventListener('submit', function (e) {
		e.preventDefault();
		s.textContent = 'Sending…'; s.className = 'cform-status'; btn.disabled = true;

		fetch('/', {
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
			},
			method: 'POST',
			body: new URLSearchParams(new FormData(f)).toString(),
		})
			.then(function (j) {
				if (j.ok) { s.textContent = 'Thanks. Your message has been sent.'; s.className = 'cform-status ok'; f.reset(); }
				else { s.textContent = 'Something went wrong. Please try again.'; s.className = 'cform-status err'; }
			})
			.catch(function () { s.textContent = 'Network error. Please try again.'; s.className = 'cform-status err'; })
			.then(function () { btn.disabled = false; });
	});
})();
