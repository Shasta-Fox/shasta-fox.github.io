/* Phone layout helpers: swipe counters, folded reference panels, credentials toggle. */
(function () {
  // 1. Swipe rows: "Swipe · 2 of 10" with dots, updated as the row scrolls.
  Array.prototype.forEach.call(document.querySelectorAll('.swipe'), function (row) {
    var items = Array.prototype.filter.call(row.children, function (c) { return !c.hidden; });
    if (items.length < 2) return;
    var label = row.getAttribute('data-swipe-label') || 'items';
    var hint = document.createElement('p');
    hint.className = 'swipeHint';
    hint.setAttribute('aria-hidden', 'true');
    var dots = items.map(function () { return '<i></i>'; }).join('');
    hint.innerHTML = '<span>Swipe for more ' + label + ' · <b class="swipeNow">1</b> of ' + items.length + '</span><span class="swipeDots">' + dots + '</span>';
    row.parentNode.insertBefore(hint, row.nextSibling);
    var now = hint.querySelector('.swipeNow'), dotEls = hint.querySelectorAll('.swipeDots i');
    function update() {
      var left = row.getBoundingClientRect().left, best = 0, bestD = Infinity;
      items.forEach(function (el, i) {
        var d = Math.abs(el.getBoundingClientRect().left - left - 20);
        if (d < bestD) { bestD = d; best = i; }
      });
      if (row.scrollLeft + row.clientWidth >= row.scrollWidth - 4) best = items.length - 1;
      now.textContent = best + 1;
      Array.prototype.forEach.call(dotEls, function (d, i) { d.className = i === best ? 'on' : ''; });
    }
    var t; row.addEventListener('scroll', function () { cancelAnimationFrame(t); t = requestAnimationFrame(update); }, { passive: true });
    update();
  });

  // 1b. Links to a card inside a swipe row (#esl, #mental-math...): bring that card into view.
  function showTarget() {
    var id = location.hash.slice(1); if (!id) return;
    var el = document.getElementById(id);
    if (!el || !el.parentNode || !el.parentNode.classList || !el.parentNode.classList.contains('swipe')) return;
    var row = el.parentNode;
    if (getComputedStyle(row).display !== 'flex') return;
    row.scrollLeft = el.offsetLeft - row.firstElementChild.offsetLeft;
    var top = row.getBoundingClientRect().top + window.pageYOffset - 90;
    window.scrollTo(0, top);
  }
  window.addEventListener('hashchange', function () { setTimeout(showTarget, 0); });
  if (location.hash) setTimeout(showTarget, 60);
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[href*="#"]');
    if (a && a.hash && a.pathname === location.pathname && a.hash === location.hash) setTimeout(showTarget, 0);
  });

  // 2. Folded reference panels: tapping opens the existing enlarged view.
  Array.prototype.forEach.call(document.querySelectorAll('.foldPhone'), function (panel) {
    var note = document.createElement('p');
    note.className = 'foldNote';
    note.textContent = 'Tap to open the full chart ›';
    var h = panel.querySelector('h3');
    if (h) h.parentNode.insertBefore(note, h.nextSibling);
  });

  // 3. Credentials: show four, then a button for the rest.
  Array.prototype.forEach.call(document.querySelectorAll('.credsFold'), function (list) {
    var n = list.children.length;
    if (n <= 4) return;
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'credsToggle';
    btn.setAttribute('aria-expanded', 'false');
    btn.textContent = 'Show all ' + n + ' credentials';
    list.parentNode.insertBefore(btn, list.nextSibling);
    btn.addEventListener('click', function () {
      var open = list.classList.toggle('open');
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
      btn.textContent = open ? 'Show fewer' : 'Show all ' + n + ' credentials';
    });
  });
})();
