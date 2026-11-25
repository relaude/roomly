// Lightweight checks for the offline prototype's data and interactions.
const fs = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const source = fs.readFileSync(__dirname + '/app.js', 'utf8');
function run(page) {
  const elements = new Map();
  function element(id) {
    if (!elements.has(id)) elements.set(id, { value: id === '#chart-range' ? '6' : id.endsWith('-filter') ? 'all' : '', innerHTML: '', textContent: '', listeners: {}, addEventListener(name, callback) { this.listeners[name] = callback; }, querySelector() { return element('.close'); }, showModal() { this.open = true; }, close() { this.open = false; } });
    return elements.get(id);
  }
  const document = { body: { dataset: { page } }, querySelector: element, addEventListener() {} };
  const context = vm.createContext({ document, Intl, Date, console });
  vm.runInContext(source, context);
  return { elements, context, element };
}
const dashboard = run('dashboard');
assert(dashboard.element('#app').innerHTML.includes('2,800'));
assert.equal(vm.runInContext('totalConfirmed', dashboard.context), 31510);
assert.equal(vm.runInContext('confirmedInMonth("Nov")', dashboard.context), 3000);
assert.equal((dashboard.element('#monthly-chart').innerHTML.match(/<rect /g) || []).length, 18);
dashboard.element('#chart-range').value = '3';
dashboard.element('#chart-range').listeners.change();
assert.equal((dashboard.element('#monthly-chart').innerHTML.match(/<rect /g) || []).length, 9);
dashboard.element('#view-bill').listeners.click();
assert(dashboard.element('#dialog-content').innerHTML.includes('5,800.00'));
const history = run('payments');
history.element('#status-filter').value = 'Pending';
history.element('#status-filter').listeners.change();
assert.equal(history.element('#filter-count').textContent, 'Showing 1 of 7 records');
history.element('#month-filter').value = 'Oct';
history.element('#month-filter').listeners.change();
assert(history.element('#payment-records').innerHTML.includes('No matching payments'));
history.element('#reset-filters').listeners.click();
assert.equal(history.element('#filter-count').textContent, 'Showing 7 of 7 records');
history.element('#payment-search').value = 'DEMO-1105';
history.element('#payment-search').listeners.input();
assert.equal(history.element('#filter-count').textContent, 'Showing 1 of 7 records');
assert(history.element('#payment-records').innerHTML.includes('PAY-005'));
for (const name of ['index.html', 'payments.html']) {
  const html = fs.readFileSync(__dirname + '/' + name, 'utf8');
  for (const match of html.matchAll(/(?:src|href)="([^"#]+)"/g)) assert(fs.existsSync(__dirname + '/' + match[1]), `Missing ${match[1]}`);
}
console.log('PASS: balances, confirmed totals, chart ranges, bill dialog, status/month/search filters, empty state, reset, and local assets.');
