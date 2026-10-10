(function () {
  var pages = document.getElementById('pages');
  var label = document.getElementById('zoomLevel');
  var BASE = 860, STEPS = [0.5, 0.67, 0.8, 0.9, 1, 1.1, 1.25, 1.5, 1.75, 2, 2.5, 3];
  var z = 1;
  function fitZoom() { return Math.max(0.3, Math.min(3, (pages.clientWidth - 32) / BASE)); }
  function apply() {
    document.documentElement.style.setProperty('--pg-w', Math.round(BASE * z) + 'px');
    label.textContent = Math.round(z * 100) + '%';
  }
  function step(dir) {
    var i, next = z;
    if (dir > 0) { for (i = 0; i < STEPS.length; i++) if (STEPS[i] > z + 0.001) { next = STEPS[i]; break; } }
    else { for (i = STEPS.length - 1; i >= 0; i--) if (STEPS[i] < z - 0.001) { next = STEPS[i]; break; } }
    z = next; apply();
  }
  document.querySelectorAll('[data-zoom]').forEach(function (b) {
    b.addEventListener('click', function () {
      var a = b.getAttribute('data-zoom');
      if (a === 'in') step(1); else if (a === 'out') step(-1); else { z = fitZoom(); apply(); }
    });
  });
  z = Math.min(1, fitZoom()); apply();

  // Printing is part of the $1 printable copy.
  var modal = document.getElementById('printModal');
  function showPrintNote() { modal.hidden = false; document.getElementById('pmClose').focus(); }
  document.getElementById('pmClose').addEventListener('click', function () { modal.hidden = true; });
  modal.addEventListener('click', function (e) { if (e.target === modal) modal.hidden = true; });
  document.addEventListener('keydown', function (e) {
    var k = (e.key || '').toLowerCase();
    if ((e.ctrlKey || e.metaKey) && k === 'p') { e.preventDefault(); showPrintNote(); return; }
    if (k === 'escape') { modal.hidden = true; return; }
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    var t = e.target.tagName; if (t === 'INPUT' || t === 'TEXTAREA') return;
    if (k === '+' || k === '=') step(1); else if (k === '-') step(-1); else if (k === '0') { z = fitZoom(); apply(); }
  });
  window.addEventListener('beforeprint', showPrintNote);
  pages.addEventListener('contextmenu', function (e) { if (e.target.tagName === 'IMG') e.preventDefault(); });
  pages.addEventListener('dragstart', function (e) { e.preventDefault(); });
})();
