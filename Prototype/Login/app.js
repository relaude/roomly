const demoDialog = document.querySelector('#demo-dialog');
const infoDialog = document.querySelector('#info-dialog');
const loginView = document.querySelector('#login-view');
const resultView = document.querySelector('#result-view');
let provider = 'Google';
document.querySelectorAll('[data-provider]').forEach(button => {
  button.addEventListener('click', () => {
    provider = button.dataset.provider;
    document.querySelector('#demo-title').textContent = `Preview ${provider} sign-in`;
    demoDialog.showModal();
  });
});
const scenarios = {
  pending: `<span class="status-pill">Awaiting approval</span><h2>You're almost home.</h2><p>Your demo sign-in is complete. Your landlord needs to verify your account and connect you to the right tenancy.</p><div class="result-card"><dl><div><dt>Account</dt><dd>Maria Santos · Demo</dd></div><div><dt>Room access</dt><dd>Not assigned yet</dd></div><div><dt>Rental records</dt><dd>Private until approved</dd></div></dl></div><p>You only need approval once for your account and tenancy. After approval, refresh your access to open your dashboard.</p><button class="primary" id="refresh-access">Refresh access</button><p id="refresh-status" role="status"></p>`,
  tenant: `<span class="status-pill" style="background:#eaf6ef;color:#37755b">Approved tenant</span><h2>Welcome back, Maria.</h2><p>Here's a preview of your tenancy overview.</p><div class="result-card"><dl><div><dt>Your room</dt><dd>Room 1</dd></div><div><dt>Rent</dt><dd>5,000</dd></div><div><dt>Electricity</dt><dd>600</dd></div><div><dt>Water</dt><dd>200</dd></div><div><dt>Confirmed payment</dt><dd>3,000</dd></div><div><dt>Outstanding</dt><dd>2,800</dd></div></dl></div><p>Only records for your approved tenancy are available. Amounts above are sample figures in your chosen currency.</p>`,
  landlord: `<span class="status-pill" style="background:#edf0ff;color:#5864ad">Landlord account</span><h2>A place for everything.</h2><p>Here's a preview of your two rental units.</p><div class="result-card"><div class="room-row"><strong>Room 1 · Maria</strong><span>Occupied</span></div><div class="room-row"><strong>Room 2 · Alex</strong><span>Occupied</span></div></div><p>From your landlord dashboard, you can approve tenant accounts, issue bills, and confirm payments. Landlord access is assigned during secure account setup.</p>`
};
document.querySelectorAll('[data-scenario]').forEach(button => {
  button.addEventListener('click', () => {
    demoDialog.close();
    loginView.hidden = true;
    resultView.innerHTML = scenarios[button.dataset.scenario] + `<p class="demo-disclaimer">Demo via ${provider}. No real sign-in or rental data.</p><button class="text-button back" id="back-login">Return to login</button>`;
    resultView.hidden = false;
    const title = resultView.querySelector('h2');
    title.tabIndex = -1;
    title.focus();
    document.querySelector('#back-login').addEventListener('click', () => {
      resultView.hidden = true;
      loginView.hidden = false;
      document.querySelector(`[data-provider="${provider}"]`).focus();
    });
    document.querySelector('#refresh-access')?.addEventListener('click', () => {
      document.querySelector('#refresh-status').textContent = 'Still awaiting approval in this demo. Return to login and choose Approved tenant to preview the next step.';
    });
  });
});
function showInfo(title, paragraphs) {
  document.querySelector('#info-title').textContent = title;
  const copy = document.querySelector('#info-copy');
  copy.replaceChildren(...paragraphs.map(text => { const p = document.createElement('p'); p.textContent = text; return p; }));
  infoDialog.showModal();
}
document.querySelector('#help-button').addEventListener('click', () => showInfo('A familiar way to sign in', [
  '1. Choose Google or Facebook and sign in with your existing account. Your password stays with that provider.',
  '2. Your landlord verifies your account and links it to your tenancy. Until then, your account shows as pending.',
  '3. Once approved, you can view your own bills, payments, and tenancy details.',
  'This local prototype simulates the flow. No provider account is accessed. For tenancy assistance, use the contact details your landlord supplied.'
]));
document.querySelector('#privacy-button').addEventListener('click', () => showInfo('Your privacy', [
  'This prototype does not connect to Google, Facebook, Supabase, or any analytics service. It does not save profile details or sign-in sessions.',
  'In the planned application, your landlord will access the information needed to manage your tenancy. Other tenants will not have access to your records.',
  'A full privacy notice and retention policy must be provided before the live application collects tenant information.'
]));
document.querySelector('#info-done').addEventListener('click', () => infoDialog.close());
for (const dialog of [demoDialog, infoDialog]) {
  dialog.addEventListener('click', event => { if (event.target === dialog) { const r = dialog.getBoundingClientRect(); if (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) dialog.close(); } });
}
