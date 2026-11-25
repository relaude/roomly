# Rental login prototype

Open `index.html` in a modern browser. No installation, server, external fonts, or internet connection is required.

The temporary brand is **Roomly**. The page adapts to desktop and phone screens.

## Preview interactions

- Select Google or Facebook to open a clearly labeled demo account chooser.
- Preview a new tenant awaiting approval, an approved Room 1 tenant, or the landlord.
- Refreshing pending access keeps it pending; the prototype never grants approval automatically.
- Return to login to explore another scenario.
- Open How sign-in works or Privacy for explanatory dialogs.
- Dialogs support keyboard focus, Escape to close, and backdrop dismissal.

All people, amounts, and account states are samples. This is a frontend prototype; there is no real authentication, persistent session, approval operation, or database. The role chooser is a preview control and must not become a production role selector.

## Production integration

Replace demo handlers with Supabase OAuth for Google and Facebook. Configure provider applications, callbacks, allowed redirects, and session handling. Resolve protected role and approved tenancy membership after authentication. Enforce access in database policies and restricted commands before exposing real data. Supply real branding, landlord contact details, currency, and privacy notice before launch.
