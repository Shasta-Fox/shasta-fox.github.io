(function () {
  var q = document.getElementById('q'), count = document.getElementById('libCount'), empty = document.getElementById('libEmpty');
  var entries = Array.prototype.slice.call(document.querySelectorAll('.libEntry'));
  var groups = Array.prototype.slice.call(document.querySelectorAll('.libGroup'));
  var buttons = Array.prototype.slice.call(document.querySelectorAll('.libFilters button'));
  var cats = buttons.map(function (b) { return b.getAttribute('data-cat'); });
  var cat = 'all';
  function apply() {
    var term = (q.value || '').trim().toLowerCase(), shown = 0;
    entries.forEach(function (el) {
      var ok = (cat === 'all' || el.getAttribute('data-tags').split(' ').indexOf(cat) > -1) &&
               (!term || el.getAttribute('data-text').indexOf(term) > -1);
      el.hidden = !ok; if (ok) shown++;
    });
    groups.forEach(function (g) { g.hidden = !g.querySelector('.libEntry:not([hidden])'); });
    buttons.forEach(function (b) { b.setAttribute('aria-pressed', b.getAttribute('data-cat') === cat ? 'true' : 'false'); });
    count.textContent = (cat === 'all' && !term) ? 'Showing all ' + entries.length + ' guides' : 'Showing ' + shown + ' of ' + entries.length + ' guides';
    empty.hidden = shown > 0;
  }
  buttons.forEach(function (b) {
    b.addEventListener('click', function () {
      cat = b.getAttribute('data-cat');
      if (history.replaceState) history.replaceState(null, '', cat === 'all' ? location.pathname : '#' + cat);
      apply();
    });
  });
  q.addEventListener('input', apply);
  function fromHash() { var h = location.hash.replace('#', ''); cat = cats.indexOf(h) > -1 ? h : 'all'; apply(); }
  window.addEventListener('hashchange', fromHash);
  fromHash();
})();
