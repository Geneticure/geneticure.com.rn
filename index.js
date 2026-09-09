(function () {
	var b = document.getElementById('burger'), m = document.getElementById('menu');
	b.addEventListener('click', function () {
		var open = m.classList.toggle('open');
		b.setAttribute('aria-expanded', open ? 'true' : 'false');
	});
	m.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', function () { m.classList.remove('open'); b.setAttribute('aria-expanded', 'false'); }); });
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
