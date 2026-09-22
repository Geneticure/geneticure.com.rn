(function () {
	var b = document.getElementById('burger'), m = document.getElementById('menu');
	b.addEventListener('click', function () {
		var open = m.classList.toggle('open');
		b.setAttribute('aria-expanded', open ? 'true' : 'false');
	});
	m.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', function () { m.classList.remove('open'); b.setAttribute('aria-expanded', 'false'); }); });
})();

/* Comparison-bar widths, as a percentage of the 35M eligible-patient track.
   Revise these figures here; the markup carries no widths. */
(function () {
	var BAR_WIDTHS = {
		'baseline-treated': 24,		// 8.4M treated without a selection test
		'baseline-benefit': 16.8,	// 5.9M of those who benefit
		'selected-screened': 70,	// 24.5M screened in as likely responders
		'selected-benefit': 54		// 18.9M treated, and benefiting
	};
	document.querySelectorAll('[data-bar]').forEach(function (el) {
		var w = BAR_WIDTHS[el.getAttribute('data-bar')];
		if (w != null) el.style.width = w + '%';
	});
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
