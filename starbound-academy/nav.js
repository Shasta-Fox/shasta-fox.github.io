/* Starbound menu: dropdown panels on wide screens, a Menu button on narrow ones.
   Hover or click opens a panel; Escape, a click elsewhere, or tabbing away closes it. */
(function () {
  var menu = document.querySelector('.starNav');
  if (!menu) return;
  var bar = menu.closest('.nav');
  var menuBtn = bar.querySelector('.menuBtn');
  var items = Array.prototype.slice.call(menu.querySelectorAll('.navItem'));
  var canHover = window.matchMedia('(hover: hover)');
  // site.css decides the breakpoint: the Menu button only shows on narrow screens.
  function barMode() { return getComputedStyle(menuBtn).display === 'none'; }
  var closeTimer;

  function setOpen(item, open) {
    item.classList.toggle('open', open);
    item.querySelector('.navTrigger').setAttribute('aria-expanded', open ? 'true' : 'false');
    if (!open) item.removeAttribute('data-hover');
  }
  function closeAll(except) {
    items.forEach(function (item) { if (item !== except) setOpen(item, false); });
  }
  function setMenu(open) {
    bar.classList.toggle('menuOpen', open);
    menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
    if (!open) closeAll();
  }

  items.forEach(function (item) {
    var trigger = item.querySelector('.navTrigger');
    trigger.addEventListener('click', function () {
      // A panel opened by hover stays open when its button is clicked.
      var open = !item.classList.contains('open') || item.hasAttribute('data-hover');
      closeAll(item);
      setOpen(item, open);
    });
    item.addEventListener('mouseenter', function () {
      if (!canHover.matches || !barMode()) return;
      clearTimeout(closeTimer);
      if (!item.classList.contains('open')) {
        closeAll(item);
        setOpen(item, true);
        item.setAttribute('data-hover', '');
      }
    });
    item.addEventListener('mouseleave', function () {
      if (!canHover.matches || !barMode()) return;
      closeTimer = setTimeout(function () { setOpen(item, false); }, 200);
    });
    item.addEventListener('focusout', function (e) {
      if (barMode() && !item.contains(e.relatedTarget)) setOpen(item, false);
    });
  });

  menuBtn.addEventListener('click', function () { setMenu(!bar.classList.contains('menuOpen')); });

  // Following a link closes everything, so in-page links do not leave a panel open.
  menu.addEventListener('click', function (e) { if (e.target.closest('a')) setMenu(false); });

  document.addEventListener('click', function (e) {
    if (!bar.contains(e.target)) setMenu(false);
  });
  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    var open = items.filter(function (item) { return item.classList.contains('open'); })[0];
    if (open) { setOpen(open, false); open.querySelector('.navTrigger').focus(); }
    else if (bar.classList.contains('menuOpen')) { setMenu(false); menuBtn.focus(); }
  });
  window.addEventListener('resize', function () { if (barMode()) bar.classList.remove('menuOpen'); });
})();
