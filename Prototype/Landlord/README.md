# Roomly landlord prototype

Open `index.html` directly in a modern browser. No installation or network is required.

## Pages

- `index.html`: Dashboard with billed versus confirmed monthly collections, chart data table, collection progress donut, occupancy, balances and review alerts.
- `tenants.html`: Search two current tenants, view tenancy details and edit their sample contact and emergency contact information.
- `payments.html`: Search/filter November submissions, inspect records, confirm after selecting a funds verification checkbox, reject with a required reason, and export filtered CSV records.
- `maintenance.html`: Table Maintenance means reference/master data. Edit default room rents and utility rates, add or rename payment methods, and activate/deactivate methods. At least one method must remain active. Changes do not recalculate issued November bills.

Uses the Home/tenant prototypes' Roomly styling. `styles.css` imports `../Tenant/styles.css`; preserve that sibling directory. Home and Login navigation also expects those existing sibling folders.

## Sample records and behavior

Snapshot: 25 November 2026. Both rooms are occupied. Maria has 5,800 billed, 3,000 confirmed and 2,800 pending. Alex has 5,630 billed and confirmed. Initially total billed is 11,430, confirmed is 8,630 and outstanding is 2,800. Due date is 30 November, so balances are not yet overdue. Confirming Maria's pending 2,800 makes collections 11,430 and outstanding zero; rejecting it leaves outstanding 2,800. Repeated confirmation is prevented. June–October chart values are illustrative historical totals.

Changes are stored under `roomly-landlord-demo-v1` in browser local storage and shared between these landlord pages when the browser allows it. File URL storage behavior varies; if edits are not retained across files, use a local web server. Storage failure falls back to in-memory changes on the current page. Reset demo restores original landlord data only. Tenant/Home/Login prototypes are independent and do not synchronize with this demo.

All people and contact numbers are fictional. No provider login, real tenant approval, payment transfer, receipt upload, database, or server authorization is connected. The prototype supports current tenant contact management; new occupancy and account invitation workflows are outside this demo. Do not enter actual tenant data.
