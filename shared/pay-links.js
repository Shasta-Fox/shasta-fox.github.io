/* Payment links for both academies. This is the only file to edit.
   Paste a PayPal.me link between the quotes, for example "https://paypal.me/yourname".
   Every Book button already carries its own price, so one link covers every class.
   Until a link is pasted, the buttons open an email to the academy instead. */
var PAYPAL = {
  shasta: "",  // Starbound classes, tutoring, essay review, printable guides; Earthbound herbs and gardening
  chef: ""     // Chef Rinaldi's cooking classes. While this is empty, they use Shasta's link.
};
Array.prototype.forEach.call(document.querySelectorAll('[data-price]'), function (a) {
  var link = PAYPAL[a.getAttribute('data-pay')] || PAYPAL.shasta;
  if (!link) return;
  a.href = link.replace(/\/+$/, '') + '/' + a.getAttribute('data-price') + 'USD';
  a.target = '_blank'; a.rel = 'noopener noreferrer';
});
