const money = value => new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value);
const months = [
  { month: 'Jun', rent: 5000, electric: 420, water: 180 },
  { month: 'Jul', rent: 5000, electric: 510, water: 190 },
  { month: 'Aug', rent: 5000, electric: 480, water: 200 },
  { month: 'Sep', rent: 5000, electric: 550, water: 200 },
  { month: 'Oct', rent: 5000, electric: 580, water: 200 },
  { month: 'Nov', rent: 5000, electric: 600, water: 200 }
];
const payments = [
  { id: 'PAY-006', date: '2026-11-22', period: 'November 2026', amount: 2800, method: 'Bank transfer', status: 'Pending', reference: 'DEMO-1122', note: 'Submitted for landlord review. This amount does not reduce the balance.' },
  { id: 'PAY-005', date: '2026-11-05', period: 'November 2026', amount: 3000, method: 'Bank transfer', status: 'Confirmed', reference: 'DEMO-1105' },
  { id: 'PAY-004', date: '2026-10-05', period: 'October 2026', amount: 5780, method: 'Bank transfer', status: 'Confirmed', reference: 'DEMO-1005' },
  { id: 'PAY-003', date: '2026-09-05', period: 'September 2026', amount: 5750, method: 'Cash', status: 'Confirmed', reference: 'DEMO-0905' },
  { id: 'PAY-002', date: '2026-08-05', period: 'August 2026', amount: 5680, method: 'Bank transfer', status: 'Confirmed', reference: 'DEMO-0805' },
  { id: 'PAY-001', date: '2026-07-05', period: 'July 2026', amount: 5700, method: 'Cash', status: 'Confirmed', reference: 'DEMO-0705' },
  { id: 'PAY-000', date: '2026-06-05', period: 'June 2026', amount: 5600, method: 'Bank transfer', status: 'Confirmed', reference: 'DEMO-0605' }
];
const isHistory = document.body.dataset.page === 'payments';
const dateLabel = date => new Date(date + 'T12:00:00').toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
const badge = status => `<span class="badge ${status.toLowerCase()}">${status === 'Confirmed' ? '✓ ' : '◷ '}${status}</span>`;
const totalConfirmed = payments.filter(p => p.status === 'Confirmed').reduce((sum, p) => sum + p.amount, 0);
document.querySelector('#app').innerHTML = `
<aside class="sidebar"><a class="brand" href="../Home/index.html" aria-label="Roomly home"><span class="brand-icon" aria-hidden="true">⌂</span>roomly<span>.</span></a><span class="nav-caption">YOUR LITTLE CORNER</span><nav aria-label="Tenant navigation"><a href="index.html" ${!isHistory ? 'aria-current="page"' : ''}><span aria-hidden="true">▦</span> Dashboard</a><a href="payments.html" ${isHistory ? 'aria-current="page"' : ''}><span aria-hidden="true">▤</span> Payment history</a></nav><div class="sidebar-bottom"><div class="home-note"><span aria-hidden="true">⌂</span><strong>A little more at home.</strong><p>Your rental essentials,<br>all together.</p></div><a class="home-link" href="../Home/index.html">Roomly home</a><a class="home-link" href="../Login/index.html">Back to login</a><div class="account"><span class="avatar">MS</span><div><strong>Maria Santos</strong><small>Tenant · Room 1</small></div></div></div></aside>
<div class="workspace"><header class="topbar"><span>MY TENANT PORTAL <span class="crumb">/ ${isHistory ? 'Payment history' : 'Dashboard'}</span></span><div><span class="prototype">Sample data</span><span class="avatar small">MS</span></div></header>
<main id="main"><div class="page-heading"><div><span class="eyebrow">${isHistory ? 'A CLEARER PICTURE' : 'WEDNESDAY, 25 NOVEMBER 2026'}</span><h1>${isHistory ? 'Your payment history.' : 'Welcome home, Maria.'}</h1><p>${isHistory ? 'Every payment, with a little more clarity.' : 'A little less keeping track. A little more peace of mind.'}</p></div><button class="button ${isHistory ? 'secondary' : 'primary'}" id="${isHistory ? 'export-csv' : 'view-bill'}">${isHistory ? 'Export CSV' : 'View this month’s bill'}</button></div>
${isHistory ? historyPage() : dashboardPage()}
<footer class="page-footer"><span>Roomly · Two rooms. One simple place.</span><span>Interactive prototype · Amounts in sample currency units</span></footer></main></div>`;

function dashboardPage() {
  return `<section class="overview" aria-label="Current month summary"><article class="balance-card"><div class="card-label">YOUR OUTSTANDING BALANCE <span>◷ Partially paid</span></div><strong class="big-number">2,800<span>.00</span></strong><p>November 2026 · Due 30 November</p><div class="payment-progress"><span></span></div><div class="progress-caption"><span>3,000.00 confirmed</span><span>5,800.00 billed</span></div></article><article class="card summary-stat"><div class="stat-icon">▤</div><p>This month’s charges</p><strong>5,800<span>.00</span></strong><small>Rent + electricity + water</small></article><article class="card summary-stat"><div class="stat-icon green">✓</div><p>Confirmed this month</p><strong>3,000<span>.00</span></strong><small>Last payment on 5 Nov 2026</small></article></section>
  <div class="pending-note"><span class="pending-icon" aria-hidden="true">◷</span><div><strong>Your latest submission is being reviewed.</strong><p>2,800.00 submitted on 22 November. Your balance updates after your landlord confirms receipt.</p></div><button class="text-button" data-payment="PAY-006">View details</button></div>
  <div class="dashboard-grid"><section class="card chart-panel"><div class="panel-heading"><div><h2>Your rental at a glance</h2><p>Monthly charges · June–November 2026</p></div><label class="sr-only" for="chart-range">Chart date range</label><select id="chart-range"><option value="6">Last 6 months</option><option value="3">Last 3 months</option></select></div><div class="legend"><span><i class="rent"></i>Rent</span><span><i class="electric"></i>Electricity</span><span><i class="water"></i>Water</span></div><div id="monthly-chart"></div><details class="chart-data"><summary>View chart data</summary><div id="chart-data"></div></details></section>
  <section class="card breakdown"><div class="panel-heading"><div><h2>This month’s breakdown</h2><p>November 2026</p></div><span class="subtle-icon">◔</span></div><div class="donut" role="img" aria-label="November charges: rent 5000, electricity 600, water 200; total 5800"><div><small>TOTAL CHARGES</small><strong>5,800<span>.00</span></strong></div></div><div class="breakdown-lines"><div><span><i class="rent"></i>Monthly rent</span><strong>5,000.00</strong></div><div><span><i class="electric"></i>Electricity</span><strong>600.00</strong></div><div><span><i class="water"></i>Water</span><strong>200.00</strong></div></div></section></div>
  <div class="bottom-grid"><section class="card recent"><div class="panel-heading"><div><h2>Recent payments</h2><p>A record of the little details.</p></div><a class="text-button" href="payments.html">View all</a></div>${table(payments.slice(0, 3), false)}</section><section class="tenancy-card"><div class="tenancy-house" aria-hidden="true">⌂</div><span class="eyebrow">YOUR SPACE</span><h2>Room 1</h2><p>A place to call home.</p><dl><div><dt>Tenant</dt><dd>Maria Santos</dd></div><div><dt>Tenancy started</dt><dd>1 June 2026</dd></div><div><dt>Monthly rent</dt><dd>5,000.00</dd></div></dl></section></div>`;
}
function historyPage() {
  return `<section class="history-stats" aria-label="Payment summary"><article class="card compact-stat"><span class="stat-icon green">✓</span><div><p>Total confirmed</p><strong>${money(totalConfirmed)}</strong><small>June–November 2026</small></div></article><article class="card compact-stat"><span class="stat-icon amber">◷</span><div><p>Awaiting review</p><strong>2,800.00</strong><small>1 payment submission</small></div></article><article class="card compact-stat"><span class="stat-icon">▤</span><div><p>Outstanding balance</p><strong>2,800.00</strong><small>Due 30 November 2026</small></div></article></section>
  <section class="card history-chart"><div class="panel-heading"><div><h2>Payments over time</h2><p>Confirmed payments only · June–November 2026</p></div><span class="chart-tag">6 MONTHS</span></div>${paymentChart()}<details class="chart-data"><summary>View chart data</summary><div class="mini-data">${months.map(m => `${m.month}: ${money(confirmedInMonth(m.month))}`).join(' · ')}</div></details></section>
  <section class="card history-panel"><div class="panel-heading"><div><h2>Payment records</h2><p>Pending submissions stay separate from confirmed payments.</p></div><span class="record-count">7 records</span></div><div class="filters"><label class="search"><span aria-hidden="true">⌕</span><span class="sr-only">Search payments</span><input id="payment-search" type="search" placeholder="Search reference or billing month…"></label><label><span class="sr-only">Payment status</span><select id="status-filter"><option value="all">All statuses</option><option>Confirmed</option><option>Pending</option></select></label><label><span class="sr-only">Billing month</span><select id="month-filter"><option value="all">All months</option>${[...months].reverse().map(m => `<option value="${m.month}">${m.month} 2026</option>`).join('')}</select></label><button class="text-button reset" id="reset-filters">Reset</button></div><div id="payment-records">${table(payments, true)}</div><div class="table-foot"><span id="filter-count" role="status">Showing 7 of 7 records</span><span>Sample records · No real transactions</span></div></section>`;
}
function table(rows, full) {
  if (!rows.length) return '<div class="empty-state"><strong>No matching payments.</strong><p>Try another month, status, or search term.</p></div>';
  return `<div class="table-scroll"><table><caption class="sr-only">${full ? 'Payment history' : 'Recent payments'}</caption><thead><tr><th scope="col">Payment date</th>${full ? '<th scope="col">Billing period</th><th scope="col">Method</th>' : ''}<th scope="col" class="numeric">Amount</th><th scope="col">Status</th><th scope="col"><span class="sr-only">Details</span></th></tr></thead><tbody>${rows.map(p => `<tr><td><strong>${dateLabel(p.date)}</strong><small>${p.id}</small></td>${full ? `<td>${p.period}</td><td>${p.method}</td>` : ''}<td class="numeric">${money(p.amount)}</td><td>${badge(p.status)}</td><td><button class="text-button" data-payment="${p.id}" aria-label="View ${p.id} details">Details</button></td></tr>`).join('')}</tbody></table></div>`;
}
function monthlyChart(count) {
  const rows = months.slice(-count), max = 6000, scale = 180 / max, step = 450 / rows.length;
  return `<svg class="bar-chart" viewBox="0 0 530 250" role="img" aria-label="Monthly rent electricity and water charges for the last ${count} months. Exact values available below.">${[0, 2000, 4000, 6000].map(v => `<line x1="52" x2="510" y1="${210-v*scale}" y2="${210-v*scale}" stroke="#edf0f6"/><text x="40" y="${214-v*scale}" text-anchor="end">${v === 0 ? '0' : v/1000+'k'}</text>`).join('')}${rows.map((m, i) => { const x = 52 + step*i + step/2 - 17; return `<g><title>${m.month}: rent ${m.rent}, electricity ${m.electric}, water ${m.water}; total ${m.rent+m.electric+m.water}</title><rect x="${x}" y="${210-m.rent*scale}" width="34" height="${m.rent*scale}" fill="#4757c8"/><rect x="${x}" y="${210-(m.rent+m.electric)*scale}" width="34" height="${m.electric*scale}" fill="#99a8eb"/><rect x="${x}" y="${210-(m.rent+m.electric+m.water)*scale}" width="34" height="${m.water*scale}" fill="#cdd7fb" rx="2"/><text x="${x+17}" y="238" text-anchor="middle">${m.month}</text></g>`; }).join('')}</svg>`;
}
function confirmedInMonth(shortMonth) { return payments.filter(p => p.status === 'Confirmed' && p.period.startsWith(shortMonth)).reduce((sum, p) => sum+p.amount, 0); }
function paymentChart() {
  const vals = months.map(m => confirmedInMonth(m.month));
  const pts = vals.map((v, i) => `${75+i*162},${155-v/6000*120}`);
  return `<svg class="payment-chart" viewBox="0 0 960 205" role="img" aria-label="Confirmed monthly payments: June 5600, July 5700, August 5680, September 5750, October 5780, November 3000. Pending November submission excluded."><defs><linearGradient id="area" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#cdd5fb" stop-opacity=".6"/><stop offset="1" stop-color="#f6f7fe" stop-opacity=".1"/></linearGradient></defs>${[0,3000,6000].map(v => `<line x1="60" x2="920" y1="${155-v/6000*120}" y2="${155-v/6000*120}" stroke="#edf0f6"/><text x="42" y="${159-v/6000*120}" text-anchor="end">${v ? v/1000+'k' : '0'}</text>`).join('')}<path d="M${pts[0]} L${pts.join(' L')} L885,155 L75,155 Z" fill="url(#area)"/><polyline points="${pts.join(' ')}" fill="none" stroke="#6577c4" stroke-width="3"/>${vals.map((v,i) => `<g><title>${months[i].month}: ${money(v)} confirmed</title><circle cx="${75+i*162}" cy="${155-v/6000*120}" r="5" fill="white" stroke="#6577c4" stroke-width="3"/><text x="${75+i*162}" y="${141-v/6000*120}" text-anchor="middle">${money(v).replace('.00','')}</text><text x="${75+i*162}" y="190" text-anchor="middle">${months[i].month}</text></g>`).join('')}</svg>`;
}
function refreshChart() {
  const count = Number(document.querySelector('#chart-range').value);
  document.querySelector('#monthly-chart').innerHTML = monthlyChart(count);
  document.querySelector('#chart-data').innerHTML = `<div class="table-scroll"><table><caption class="sr-only">Monthly charge data</caption><thead><tr><th>Month</th><th>Rent</th><th>Electricity</th><th>Water</th><th>Total</th></tr></thead><tbody>${months.slice(-count).map(m => `<tr><th scope="row">${m.month}</th><td>${money(m.rent)}</td><td>${money(m.electric)}</td><td>${money(m.water)}</td><td>${money(m.rent+m.electric+m.water)}</td></tr>`).join('')}</tbody></table></div>`;
}
function filteredPayments() {
  const query = document.querySelector('#payment-search').value.trim().toLowerCase();
  const status = document.querySelector('#status-filter').value;
  const month = document.querySelector('#month-filter').value;
  return payments.filter(p => (status === 'all' || p.status === status) && (month === 'all' || p.period.startsWith(month)) && `${p.id} ${p.period} ${p.reference} ${p.method}`.toLowerCase().includes(query));
}
function filter() {
  const rows = filteredPayments();
  document.querySelector('#payment-records').innerHTML = table(rows, true);
  document.querySelector('#filter-count').textContent = `Showing ${rows.length} of ${payments.length} records`;
}
const dialog = document.querySelector('#detail-dialog');
function showDialog(content) { document.querySelector('#dialog-content').innerHTML = content; dialog.showModal(); }
document.addEventListener('click', event => {
  const button = event.target.closest('[data-payment]');
  if (!button) return;
  const p = payments.find(row => row.id === button.dataset.payment);
  if (!p) return;
  showDialog(`<span class="eyebrow">PAYMENT DETAILS · SAMPLE</span><h2 id="dialog-title">${p.status === 'Confirmed' ? 'Payment confirmed.' : 'Awaiting a little review.'}</h2>${badge(p.status)}<div class="dialog-amount">${money(p.amount)}</div><dl class="details-list"><div><dt>Record</dt><dd>${p.id}</dd></div><div><dt>Payment date</dt><dd>${dateLabel(p.date)}</dd></div><div><dt>Billing period</dt><dd>${p.period}</dd></div><div><dt>Method</dt><dd>${p.method}</dd></div><div><dt>Reference</dt><dd>${p.reference}</dd></div><div><dt>Tenant / room</dt><dd>Maria Santos · Room 1</dd></div></dl><p>${p.note || 'Sample funds confirmed by the landlord and allocated to this billing period.'}</p><p class="fine-print">Prototype record only. This is not an official receipt.</p><button class="button primary" data-close>Done</button>`);
});
dialog.querySelector('.close').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', event => {
  if (event.target.closest('[data-close]')) dialog.close();
  if (event.target === dialog) { const r = dialog.getBoundingClientRect(); if (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) dialog.close(); }
});
if (!isHistory) {
  refreshChart();
  document.querySelector('#chart-range').addEventListener('change', refreshChart);
  document.querySelector('#view-bill').addEventListener('click', () => showDialog(`<span class="eyebrow">ROOM 1 · NOVEMBER 2026</span><h2 id="dialog-title">Your monthly bill.</h2><p>Due 30 November 2026 · Sample statement</p><dl class="details-list"><div><dt>Monthly rent</dt><dd>5,000.00</dd></div><div><dt>Electricity</dt><dd>600.00</dd></div><div><dt>Water</dt><dd>200.00</dd></div><div><dt>Total charges</dt><dd>5,800.00</dd></div><div><dt>Confirmed payments</dt><dd>3,000.00</dd></div><div><dt>Outstanding</dt><dd>2,800.00</dd></div></dl><p>The pending 2,800.00 submission is awaiting landlord review and has not reduced this balance.</p><a class="button primary" href="payments.html">View payment history</a>`));
} else {
  document.querySelector('#payment-search').addEventListener('input', filter);
  ['status-filter','month-filter'].forEach(id => document.querySelector('#'+id).addEventListener('change', filter));
  document.querySelector('#reset-filters').addEventListener('click', () => { document.querySelector('#payment-search').value = ''; document.querySelector('#status-filter').value = 'all'; document.querySelector('#month-filter').value = 'all'; filter(); });
  document.querySelector('#export-csv').addEventListener('click', () => {
    const rows = filteredPayments();
    const quote = value => `"${String(value).replaceAll('"','""')}"`;
    const csv = [['Record','Date','Billing period','Amount in sample units','Method','Status','Reference'],...rows.map(p => [p.id,p.date,p.period,p.amount.toFixed(2),p.method,p.status,p.reference])].map(row => row.map(quote).join(',')).join('\r\n');
    const url = URL.createObjectURL(new Blob(['\uFEFF'+csv], { type:'text/csv;charset=utf-8;' }));
    const link = document.createElement('a'); link.href = url; link.download = 'roomly-sample-payments.csv'; document.body.append(link); link.click(); link.remove(); setTimeout(() => URL.revokeObjectURL(url), 1000);
    document.querySelector('#announcement').textContent = `Exported ${rows.length} sample payment records.`;
  });
}
