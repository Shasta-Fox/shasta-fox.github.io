/* Compose a message in the visitor's email app; this site does not send or store it. */
(function () {
  'use strict';
  var form = document.getElementById('chef-contact');
  if (!form) return;
  form.addEventListener('submit', function (event) {
    event.preventDefault();
    var message = document.getElementById('chef-message');
    if (!message.value.trim()) {
      message.setCustomValidity('Please enter a question or comment.');
      message.reportValidity();
      return;
    }
    message.setCustomValidity('');
    var subject = 'Website comment for Chef Tony';
    var name = document.getElementById('chef-name').value.trim();
    var body = (name ? 'From: ' + name + '\n\n' : '') + message.value.trim();
    window.location.href = 'mailto:antrin27@gmail.com?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
    document.getElementById('chef-contact-status').textContent = 'If your email app did not open, copy your comment into an email to antrin27@gmail.com. Your message stays in this box until you leave or reload the page.';
  });
  document.getElementById('chef-message').addEventListener('input', function () {
    this.setCustomValidity('');
  });
}());
