/* Payment links for Starbound Academy: the one place to paste them.
   Put each PayPal link between the quotes, for example "https://paypal.me/yourname/120USD".
   Until an item has a link, its button opens an email to the academy instead. */
var PAY = {
  algebra: "",                   // Algebra Demystified, $120
  ideas: "",                     // From Socrates to Kuhn, $150
  tutoring: "",                  // Tutoring, $30 per session
  "print-coordinate-plane": "",  // Printable copy: Coordinate Plane Mastery, $1
  "print-pre-algebra": "",       // Printable copy: Cumulative Pre-Algebra Review, $1
  "print-reading": ""            // Printable copy: ACT + LSAT Reading guide, $1
};
Array.prototype.forEach.call(document.querySelectorAll('[data-book]'), function (a) {
  var link = PAY[a.getAttribute('data-book')];
  if (link) { a.href = link; a.target = '_blank'; a.rel = 'noopener noreferrer'; }
});
