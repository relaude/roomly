# Roomly

**Your space. Your home. All in one place.**

Roomly is a rental management application concept for a landlord managing two rooms. It brings tenant information, rent, utility bills, and payment records together in a simple portal for landlords and tenants.

This repository currently contains planning documents and interactive frontend prototypes. Real authentication, backend services, payment processing, and database access controls are not connected.

## Application roles

| Role | Planned access |
| --- | --- |
| Landlord | Manage both rooms, tenant records, monthly bills, payment verification, and reference data. |
| Tenant | View their approved tenancy, bills, and payment history, and maintain their contact information. |

Pending approval is an account status, not a third role. Google or Facebook sign-in confirms identity; the landlord approves which tenancy an account can access.

## Explore the prototypes

| Page | What you can explore |
| --- | --- |
| [Home](Prototype/Home/index.html) | Roomly introduction, benefits, onboarding steps, FAQs, and links to login. |
| [Login](Prototype/Login/index.html) | Simulated Google/Facebook sign-in with pending tenant, approved tenant, and landlord previews. |
| [Tenant Dashboard](Prototype/Tenant/index.html) | Monthly bill, outstanding balance, recent payments, charges chart, and utility breakdown. |
| [Tenant Payment History](Prototype/Tenant/payments.html) | Payment graph, search, month/status filters, details, and filtered CSV export. |
| [Landlord Dashboard](Prototype/Landlord/index.html) | Occupancy, balances, collection charts, and payment review alerts. |
| [Tenant Management](Prototype/Landlord/tenants.html) | Search current tenants and view or edit sample contact and emergency contact details. |
| [Payment Management](Prototype/Landlord/payments.html) | Review, confirm, or reject sample submissions and export filtered records. |
| [Table Maintenance](Prototype/Landlord/maintenance.html) | Maintain room rents, utility rates, and payment methods for future transactions. |

The prototypes share Roomly's indigo, blue, and pale lavender palette, house illustrations, and rounded interface elements. They adapt to desktop and mobile screens.

## Run locally

For a quick preview, open `Prototype/Home/index.html` in a modern browser. No installation or internet connection is needed. You can also open any prototype page directly.

For consistent local storage across landlord pages, serve the repository from a local web server. If Python is installed, run this command from the repository root:

```sh
python -m http.server 8000 --bind 127.0.0.1
```

Then open [Roomly Home](http://127.0.0.1:8000/Prototype/Home/). Stop the server with `Ctrl+C`.

Keep the folder structure intact: landlord styles import the tenant stylesheet, and navigation uses relative links between prototype directories.

## Demo data and behavior

- The sample billing snapshot is **25 November 2026**, with November bills due on **30 November 2026**.
- Tenant Room 1 has 5,800 billed, 3,000 confirmed, and 2,800 outstanding. A pending 2,800 submission does not reduce the balance.
- The landlord demo adds Room 2 with 5,630 billed and confirmed. Initial totals are 11,430 billed, 8,630 confirmed, and 2,800 outstanding.
- Landlord confirmation updates demo collections and balances. Rejection requires a reason and leaves the balance unchanged.
- Table maintenance changes apply to future reference values; they do not recalculate issued sample bills.
- All amounts use sample currency units. Names, contact details, and payment references are fictional.

Landlord edits are saved under `roomly-landlord-demo-v1` in browser local storage when available. **Reset demo** restores the original landlord records. File URL storage behavior varies by browser; use a local server if changes are not retained between pages. If storage is unavailable, changes last only on the current page.

Home, Login, Tenant, and Landlord are separate prototypes. Login previews do not establish a real session or route into the other prototypes, and landlord edits do not synchronize with the tenant demo. Do not enter real tenant information.

## Technology

### Current prototypes

- HTML, CSS, and vanilla JavaScript.
- Inline SVG and CSS charts; no external chart library or remote assets.
- Browser-local demo state for landlord interactions.
- No build step or package installation.

### Planned application

| Layer | Proposed technology |
| --- | --- |
| Frontend | React, TypeScript, and Vite |
| Styling and forms | Tailwind CSS and schema validation |
| Authentication | Supabase Auth with Google and Facebook |
| Database | Supabase PostgreSQL |
| Attachments | Private Supabase Storage |
| Hosting | Azure Static Web Apps |
| Delivery | GitHub-based deployment workflow |

PostgreSQL is the architecture baseline. MongoDB is an alternative requiring a separate backend API and authorization design; it is not provided as a Supabase database engine.

The deployment plan targets free service tiers where practical. Free tiers have quotas and availability restrictions and do not guarantee permanent zero cost or continuous availability. Check current provider terms before deployment.

## Planned security and billing rules

- Provision landlord access through controlled administrative setup; public signup cannot select that role.
- Link tenant access to an approved account and tenancy, not only a room number or typed name.
- Enforce authorization in database policies and restricted server-side commands.
- Keep provider secrets and administrative keys out of frontend code.
- Store receipt attachments privately and authorize file access.
- Count only confirmed funds toward balances.
- Confirm payments atomically and prevent duplicate processing.
- Preserve issued financial history through documented adjustments and reversals.
- Keep former occupants' records private when a room changes tenants.

These controls describe the intended production system. The static prototypes do not enforce real authentication or tenant isolation.

## Repository structure

```text
.
├── README.md
├── Documents/
│   ├── Two_Room_Rental_Portal_Plan.docx
│   ├── Tenant_Rental_Website_Architecture_Design.docx
│   └── Tenant_Rental_Login_Procedure_Guide.docx
└── Prototype/
    ├── Home/
    ├── Login/
    ├── Tenant/
    └── Landlord/
```

## Documentation

- [Application Plan](Documents/Two_Room_Rental_Portal_Plan.docx): requirements, recommended stack, cloud options, and delivery roadmap.
- [Architecture Design](Documents/Tenant_Rental_Website_Architecture_Design.docx): components, data model, authorization, billing transactions, and deployment.
- [Login Procedure Guide](Documents/Tenant_Rental_Login_Procedure_Guide.docx): sign-in and landlord approval explained with diagrams.
- Prototype-specific notes: [Home](Prototype/Home/README.md), [Login](Prototype/Login/README.md), [Tenant](Prototype/Tenant/README.md), and [Landlord](Prototype/Landlord/README.md).

## Prototype checks

If Node.js is installed, run these checks from the repository root:

```sh
node Prototype/Tenant/check.cjs
node Prototype/Landlord/check.cjs
```

These lightweight checks cover sample calculations, selected interactions, rendering functions, and local references. They do not replace browser layout checks, real OAuth testing, database authorization tests, or production integration tests.

## Next implementation steps

1. Confirm currency, timezone, rent terms, utility calculations, and opening balances.
2. Implement the application schema, protected roles, and tenancy access policies.
3. Connect Google/Facebook authentication and landlord approval.
4. Implement monthly billing, payment verification, private attachments, and statements.
5. Verify cross-tenant isolation, financial integrity, backups, and deployment before using real records.
