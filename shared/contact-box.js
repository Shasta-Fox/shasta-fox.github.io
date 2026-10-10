/* Contact & volunteer box for both academy sites, adapted from the Universal Contact & Volunteer Box.
   Use it with <contact-box preset="chef"></contact-box>. Each preset below sets the inbox, heading,
   topics, and color, so a box is added to a page with one line.

   Sending: paste a free Web3Forms access key (web3forms.com) into an inbox below. Messages then go
   straight to that inbox and the address stays out of the form. With no key, the box opens an email
   draft in the visitor's email app instead. */
(function () {
  'use strict';

  var INBOX = {
    shasta: { name: 'Shasta Fox', email: 'shastaandziggy@gmail.com', key: '' },
    chef:   { name: 'Chef Tony',  email: 'antrin27@gmail.com',       key: '' }
  };

  var PRESETS = {
    chef: {
      to: 'chef', site: 'East Side Catering Academy', accent: '#2d6a4f',
      heading: 'Message Chef Tony',
      intro: 'Ask a cooking question, ask about a class, or leave a comment.',
      topics: ['Cooking question', 'Class question', 'Comment'],
      placeholder: 'What would you like to ask Chef Tony?'
    },
    volunteer: {
      to: 'shasta', site: 'Aloha ʻĀina ʻe mālama iā Puna', accent: '#2d6a4f',
      heading: 'Volunteer or partner with us',
      intro: 'Tell us how you would like to help, and we will write back.',
      topics: ['Volunteer', 'Farm with extra produce', 'Community partner', 'Founding board member', 'Other'],
      placeholder: 'How would you like to help?'
    },
    starbound: {
      to: 'shasta', site: 'Starbound Academy', accent: '#4f46e5',
      heading: 'Send a message',
      intro: 'Ask about a course, ESL, tutoring, or essay review. Shasta Fox writes back by email.',
      topics: ['Courses', 'ESL', 'Tutoring', 'Essay review', 'Study guides', 'Other'],
      placeholder: 'What would you like to know?'
    }
  };

  var MAX = 1000;

  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  var CSS = [
    ':host{display:block;font:inherit;color:#1d2939}',
    '*,*:before,*:after{box-sizing:border-box}',
    '.card{background:#fff;border:1px solid #dde3df;border-radius:16px;padding:24px;box-shadow:0 12px 32px rgba(15,23,42,.08)}',
    'h3{margin:0 0 6px;font-size:20px;line-height:1.3;color:#101828}',
    '.intro{margin:0 0 18px;font-size:15px;line-height:1.55;color:#475467}',
    '.field{margin-top:16px}',
    'label,legend{display:block;margin:0 0 7px;font-size:14px;font-weight:650;color:#344054}',
    '.opt{font-weight:400;color:#667085}',
    'input[type=text],input[type=email],textarea{display:block;width:100%;padding:11px 12px;border:1px solid #c7d0ca;border-radius:10px;background:#fff;color:#101828;font:inherit;font-size:15px}',
    'textarea{min-height:130px;resize:vertical}',
    'input:focus-visible,textarea:focus-visible,button:focus-visible{outline:3px solid var(--accent);outline-offset:2px}',
    'fieldset{margin:16px 0 0;padding:0;border:0}',
    '.chips{display:flex;flex-wrap:wrap;gap:8px}',
    '.chip{position:relative;margin:0;font-weight:500}',
    '.chip input{position:absolute;opacity:0;width:1px;height:1px}',
    '.chip span{display:inline-block;padding:7px 13px;border:1px solid #c7d0ca;border-radius:999px;font-size:14px;color:#344054;cursor:pointer;user-select:none}',
    '.chip input:checked+span{background:var(--accent);border-color:var(--accent);color:#fff}',
    '.chip input:focus-visible+span{outline:3px solid var(--accent);outline-offset:2px}',
    '.labelRow{display:flex;justify-content:space-between;align-items:baseline;gap:12px}',
    '.count{font-size:13px;color:#667085;font-variant-numeric:tabular-nums}',
    '.count.near{color:#b42318}',
    '.meter{height:3px;margin-top:6px;border-radius:99px;background:#eaecf0;overflow:hidden}',
    '.meter i{display:block;height:100%;width:0;background:var(--accent)}',
    '.meter.near i{background:#b42318}',
    '.trap{position:absolute;left:-9999px;width:1px;height:1px;opacity:0}',
    'button{cursor:pointer;font:inherit}',
    '.send{margin-top:18px;padding:12px 22px;border:0;border-radius:999px;background:var(--accent);color:#fff;font-weight:700;font-size:15px}',
    '.send[disabled]{opacity:.65;cursor:progress}',
    '.note{margin:12px 0 0;font-size:13.5px;line-height:1.55;color:#667085}',
    '.status{margin:10px 0 0;font-size:14px;line-height:1.55;color:#344054}',
    '.status.error{color:#b42318}',
    '.status a,.note a{color:inherit}',
    '.done{text-align:left}',
    '.done p{margin:0 0 16px;color:#475467;line-height:1.55}',
    '.again{padding:10px 18px;border:1px solid #c7d0ca;border-radius:999px;background:#fff;color:#344054;font-weight:650}',
    '@media(max-width:520px){.card{padding:18px}}'
  ].join('');

  class ContactBox extends HTMLElement {
    connectedCallback() {
      if (this.shadowRoot) return;
      var p = PRESETS[this.getAttribute('preset')];
      if (!p) return;
      var inbox = INBOX[p.to];
      var pick = Math.max(0, p.topics.indexOf(this.getAttribute('topic')));
      var relay = !!inbox.key;
      var root = this.attachShadow({ mode: 'open' });
      root.innerHTML =
        '<style>' + CSS + ':host{--accent:' + p.accent + '}</style>' +
        '<div class="card">' +
        '<form novalidate>' +
          '<h3>' + esc(p.heading) + '</h3>' +
          '<p class="intro">' + esc(p.intro) + '</p>' +
          '<input class="trap" type="checkbox" name="botcheck" tabindex="-1" autocomplete="off" aria-hidden="true">' +
          '<div class="field"><label for="n">Your name <span class="opt">(optional)</span></label>' +
          '<input id="n" type="text" name="name" autocomplete="name" maxlength="100"></div>' +
          (relay ? '<div class="field"><label for="e">Your email</label>' +
            '<input id="e" type="email" name="email" autocomplete="email" maxlength="200" required></div>' : '') +
          '<fieldset><legend>Topic</legend><div class="chips">' +
            p.topics.map(function (t, i) {
              return '<label class="chip"><input type="radio" name="topic" value="' + esc(t) + '"' + (i === pick ? ' checked' : '') +
                '><span>' + esc(t) + '</span></label>';
            }).join('') +
          '</div></fieldset>' +
          '<div class="field"><div class="labelRow"><label for="m">Message</label>' +
          '<span class="count" aria-hidden="true">0 / ' + MAX + '</span></div>' +
          '<textarea id="m" name="message" maxlength="' + MAX + '" required placeholder="' + esc(p.placeholder) + '"></textarea>' +
          '<div class="meter" aria-hidden="true"><i></i></div></div>' +
          '<button class="send" type="submit">' + (relay ? 'Send message' : 'Open email draft') + '</button>' +
          '<p class="note">' + (relay
            ? 'Your message goes straight to ' + esc(inbox.name) + ', who replies by email.'
            : 'This opens your email app with your message addressed to ' + esc(inbox.name) + '. Review it there and press send.') +
          '</p>' +
          '<p class="status" role="status" aria-live="polite"></p>' +
        '</form>' +
        '<div class="done" hidden tabindex="-1"><h3>Message sent</h3>' +
          '<p>Thank you. ' + esc(inbox.name) + ' will reply by email.</p>' +
          '<button class="again" type="button">Write another message</button></div>' +
        '</div>';

      var form = root.querySelector('form');
      var msg = root.getElementById('m');
      var count = root.querySelector('.count');
      var meter = root.querySelector('.meter');
      var status = root.querySelector('.status');
      var send = root.querySelector('.send');
      var done = root.querySelector('.done');
      var mailLink = '<a href="mailto:' + inbox.email + '">' + inbox.email + '</a>';

      msg.addEventListener('input', function () {
        var n = msg.value.length, near = n > MAX * 0.9;
        count.textContent = n + ' / ' + MAX;
        count.classList.toggle('near', near);
        meter.classList.toggle('near', near);
        meter.firstChild.style.width = Math.min(100, n / MAX * 100) + '%';
        msg.setCustomValidity('');
      });

      function say(html, isError) {
        status.innerHTML = html;
        status.classList.toggle('error', !!isError);
      }
      function finish() {
        form.hidden = true;
        done.hidden = false;
        done.focus();
      }

      form.addEventListener('submit', function (e) {
        e.preventDefault();
        if (root.querySelector('.trap').checked) { finish(); return; }   // spam trap: people never see this box
        if (!msg.value.trim()) {
          msg.setCustomValidity('Please write a message.');
          msg.reportValidity();
          return;
        }
        var email = root.getElementById('e');
        if (email && !email.checkValidity()) { email.reportValidity(); return; }
        var topic = form.querySelector('input[name=topic]:checked').value;
        var name = root.getElementById('n').value.trim();
        var subject = p.site + ': ' + topic;

        if (!relay) {
          var body = (name ? 'From: ' + name + '\n\n' : '') + msg.value.trim();
          window.location.href = 'mailto:' + inbox.email + '?subject=' + encodeURIComponent(subject) +
            '&body=' + encodeURIComponent(body);
          say('Your email app should open with this message. If it did not, email ' + esc(inbox.name) + ' at ' + mailLink + '.');
          return;
        }

        var data = new FormData();
        data.append('access_key', inbox.key);
        data.append('subject', subject);
        data.append('from_name', p.site);
        data.append('name', name);
        data.append('email', email.value.trim());
        data.append('topic', topic);
        data.append('message', msg.value.trim());
        send.disabled = true;
        send.textContent = 'Sending…';
        say('');
        fetch('https://api.web3forms.com/submit', { method: 'POST', body: data, headers: { Accept: 'application/json' } })
          .then(function (r) { return r.json().then(function (j) { return r.ok && j.success; }); })
          .then(function (ok) {
            if (ok) finish();
            else say('Your message did not send. Please try again, or email ' + mailLink + '.', true);
          })
          .catch(function () { say('Your message did not send. Please check your connection, or email ' + mailLink + '.', true); })
          .then(function () { send.disabled = false; send.textContent = 'Send message'; });
      });

      root.querySelector('.again').addEventListener('click', function () {
        form.reset();
        msg.dispatchEvent(new Event('input'));
        say('');
        done.hidden = true;
        form.hidden = false;
        msg.focus();
      });
    }
  }

  if (!customElements.get('contact-box')) customElements.define('contact-box', ContactBox);
})();
