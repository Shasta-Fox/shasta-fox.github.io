/* Payment buttons for both academies. This is the only file to edit.
   PAYPAL: a PayPal.me link, for example "https://paypal.me/yourname".
   VENMO: a Venmo username without the @, for example "Your-Name".
   Every Book and Pay button carries its own price (data-price), so one entry covers every class.
   Pressing a button opens a small window with the amount and a PayPal and a Venmo button.
   A button whose owner has neither link keeps its email link. */
var PAYPAL = {
  shasta: "https://paypal.me/ShastaLFox", // Starbound classes, tutoring, essay review, printable guides; East Side herbs and gardening
  chef: ""                                 // Chef Rinaldi's cooking classes (buttons marked data-pay="chef")
};
var VENMO = {
  shasta: "",   // Off until the Venmo business profile @StarboundAcademy is verified; then put StarboundAcademy here
  chef: ""
};

(function () {
  'use strict';
  var buttons = Array.prototype.slice.call(document.querySelectorAll('[data-price]'));
  if (!buttons.length) return;

  function money(n) { return '$' + Number(n).toLocaleString('en-US'); }

  // What the payment is for, taken from the button's email subject or from its section heading.
  function itemName(a) {
    var m = (a.getAttribute('href') || '').match(/[?&]subject=([^&]*)/);
    if (m) {
      var s = m[1];
      try { s = decodeURIComponent(s); } catch (e) {}
      return s.replace(/^Book:\s*/, '').replace(/^Printable copy \(\$1\):\s*/, 'Printable copy: ').trim();
    }
    var box = a.closest('article, section'), h = box && box.querySelector('h3, h2');
    return h ? h.textContent.trim() : document.title;
  }

  function links(a) {
    var who = a.getAttribute('data-pay') || 'shasta';
    var price = a.getAttribute('data-price'), item = itemName(a);
    var pp = PAYPAL[who] || '', vm = VENMO[who] || '';
    return {
      price: price, item: item,
      paypal: pp ? pp.replace(/\/+$/, '') + '/' + price + 'USD' : '',
      venmo: vm ? 'https://venmo.com/' + encodeURIComponent(vm) + '?txn=pay&amount=' + price + '&note=' + encodeURIComponent(item) : '',
      mail: /^mailto:/i.test(a.getAttribute('href') || '') ? a.getAttribute('href') : ''
    };
  }

  var earth = !!document.querySelector('.earthSite');
  var accent = earth ? '#2d6a4f' : '#4f46e5';
  var host, root, card, title, itemEl, ppBtn, vmBtn, ppNote, vmNote, vmFollow, lastButton;

  function build() {
    host = document.createElement('div');
    document.body.appendChild(host);
    root = host.attachShadow({ mode: 'open' });
    root.innerHTML =
      '<style>' +
      ':host{all:initial}' +
      '*,*:before,*:after{box-sizing:border-box}' +
      '.back{position:fixed;inset:0;z-index:2147483000;display:flex;align-items:center;justify-content:center;padding:16px;background:rgba(15,23,42,.55);font-family:Inter,system-ui,-apple-system,"Segoe UI",sans-serif;color:#101828}' +
      '.back[hidden]{display:none}' +
      '.card{position:relative;width:100%;max-width:420px;max-height:calc(100vh - 32px);overflow:auto;background:#fff;border-radius:20px;padding:26px 24px 22px;box-shadow:0 24px 60px rgba(15,23,42,.35)}' +
      'h2{margin:0;font-size:24px;line-height:1.2;font-weight:800;color:#101828}' +
      '.item{margin:6px 32px 18px 0;font-size:15px;line-height:1.45;color:#475467}' +
      '.btns{display:grid;gap:10px}' +
      '.pay{display:flex;align-items:center;justify-content:center;min-height:48px;padding:12px 16px;border-radius:999px;font-size:16px;font-weight:800;text-decoration:none;letter-spacing:.01em}' +
      '.pp{background:#ffc439;color:#111}' +
      '.vm{background:#008cff;color:#fff}' +
      '.pay:hover{filter:brightness(.95)}' +
      '.pay:focus-visible,.close:focus-visible,.notes a:focus-visible{outline:3px solid ' + accent + ';outline-offset:3px}' +
      '.notes{margin:18px 0 0;padding:0;list-style:none;display:grid;gap:10px;font-size:14px;line-height:1.55;color:#344054}' +
      '.notes li{padding:10px 12px;border-radius:12px;background:#f4f5f7}' +
      '.notes li[hidden]{display:none}' +
      '.notes strong{color:#101828}' +
      '.notes a{color:' + accent + ';font-weight:700}' +
      '.close{position:absolute;top:14px;right:14px;width:36px;height:36px;border:0;border-radius:50%;background:#f2f4f7;color:#344054;font-size:22px;line-height:1;cursor:pointer}' +
      '</style>' +
      '<div class="back" hidden>' +
        '<div class="card" role="dialog" aria-modal="true" aria-labelledby="t">' +
          '<button class="close" type="button" aria-label="Close">×</button>' +
          '<h2 id="t"></h2>' +
          '<p class="item"></p>' +
          '<div class="btns">' +
            '<a class="pay pp" target="_blank" rel="noopener noreferrer">Pay with PayPal</a>' +
            '<a class="pay vm" target="_blank" rel="noopener noreferrer">Pay with Venmo</a>' +
          '</div>' +
          '<ul class="notes">' +
            '<li class="ppNote"><strong>PayPal:</strong> write <span class="q"></span> in the payment note. PayPal sends your email address with the payment.</li>' +
            '<li class="vmNote"><strong>Venmo:</strong> the amount and note are filled in. Venmo does not share your email address, so after you pay, <span class="follow"></span>.</li>' +
          '</ul>' +
        '</div>' +
      '</div>';
    card = root.querySelector('.card');
    title = root.querySelector('h2');
    itemEl = root.querySelector('.item');
    ppBtn = root.querySelector('.pp');
    vmBtn = root.querySelector('.vm');
    ppNote = root.querySelector('.ppNote');
    vmNote = root.querySelector('.vmNote');
    vmFollow = root.querySelector('.follow');
    var back = root.querySelector('.back');
    root.querySelector('.close').addEventListener('click', close);
    back.addEventListener('click', function (e) { if (e.target === back) close(); });
    root.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') { e.preventDefault(); close(); return; }
      if (e.key !== 'Tab') return;
      var f = Array.prototype.filter.call(root.querySelectorAll('button, a[href]'), function (el) {
        return el.getClientRects().length > 0;
      });
      if (!f.length) return;
      var first = f[0], last = f[f.length - 1], cur = root.activeElement;
      if (e.shiftKey && cur === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && cur === last) { e.preventDefault(); first.focus(); }
    });
  }

  function open(a, L) {
    if (!host) build();
    lastButton = a;
    title.textContent = 'Pay ' + money(L.price);
    itemEl.textContent = L.item;
    root.querySelector('.q').textContent = '“' + L.item + '”';
    ppBtn.hidden = ppNote.hidden = !L.paypal;
    if (L.paypal) ppBtn.href = L.paypal; else ppBtn.removeAttribute('href');
    vmBtn.hidden = vmNote.hidden = !L.venmo;
    if (L.venmo) vmBtn.href = L.venmo; else vmBtn.removeAttribute('href');
    // How a Venmo payer sends an email address: an email draft, or the message box on this page.
    vmFollow.textContent = '';
    if (L.mail) {
      var addr = L.mail.replace(/^mailto:/i, '').split('?')[0];
      var f = document.createElement('a');
      f.href = 'mailto:' + addr + '?subject=' + encodeURIComponent('Paid by Venmo: ' + L.item) +
        '&body=' + encodeURIComponent('I paid ' + money(L.price) + ' by Venmo for ' + L.item + '.\n\nMy name on Venmo: \n\nPlease reply to this email address.');
      f.textContent = 'send your name and email address';
      vmFollow.appendChild(f);
    } else if (document.getElementById('enroll')) {
      var g = document.createElement('a');
      g.href = '#enroll';
      g.textContent = 'send your name and email address with the message box';
      g.addEventListener('click', close);
      vmFollow.appendChild(g);
    } else {
      vmFollow.textContent = 'send your name and email address';
    }
    root.querySelector('.back').hidden = false;
    document.documentElement.style.overflow = 'hidden';
    (L.paypal ? ppBtn : vmBtn).focus();
  }

  function close() {
    if (!root) return;
    root.querySelector('.back').hidden = true;
    document.documentElement.style.overflow = '';
    if (lastButton) lastButton.focus();
  }

  buttons.forEach(function (a) {
    var L = links(a);
    if (!L.paypal && !L.venmo) return;          // no link for this owner yet: keep the email link
    a.href = L.paypal || L.venmo;               // opening in a new tab still reaches a payment page
    a.setAttribute('data-pay-ready', '');
    a.addEventListener('click', function (e) {
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.button === 1) return;
      e.preventDefault();
      open(a, L);
    });
  });
})();
