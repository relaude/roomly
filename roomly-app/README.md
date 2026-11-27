# Roomly application

React and TypeScript frontend with Tailwind CSS, React Hook Form, and Zod validation. The indigo palette, lavender backgrounds, rounded panels, and responsive workspace follow the existing Prototype screens.

## Run locally

```sh
npm ci
npm run dev
```

## Verify

```sh
npm run lint
npm test
npm run build
```

## Structure

- src/index.css: Tailwind theme tokens, base accessibility styles, and shared control styles.
- src/components/ui.tsx: reusable buttons, labeled fields, sections, and feedback.
- src/features/forms/schemas.ts: validation schemas, inferred value types, and decimal amount conversion.
- src/features/forms/RoomlyForms.tsx: profile, payment submission, and room settings forms.
- src/App.tsx: responsive demo workspace and form navigation.
- src/features/home/HomePage.tsx: default landing page based on Prototype/Home, with responsive navigation, sample bill, benefits, onboarding, FAQs, and a native privacy dialog. Demo actions open the form workspace; the workspace wordmark returns home and checks for unsaved edits.

Validation runs on blur and submission, focuses the first invalid field, and links errors and hints to each control. Transfers require a reference; cash does not. Decimal amounts are checked before conversion into integer minor units. Reset restores the last validated values in the active form; switching forms or refreshing clears the session. Navigation prompts before discarding unsaved edits.

## Backend integration

This is a frontend demo. Use fictional details. Forms do not persist records, authenticate users, upload proof, or send requests. The landlord settings preview is accessible for design review and does not grant a role. Pending submissions never change balances.

When connecting Supabase, validate again at the server/database boundary, enforce approved tenancy membership with row-level security, and restrict rate changes and payment confirmation to authorized landlord operations. Validate successful server responses before resetting a form; show failures without clearing edits. Load bill choices and settings from authorized records rather than these sample options.

Currency, property timezone, rates, and accepted payment methods need owner configuration. Demo amounts use sample units with two decimals; dates use the browser local calendar. Production date rules must use the configured property timezone. Due days are deliberately limited to 1-28. Utility rates in this demo are positive and use two decimals; extend precision and zero-rate policy once billing rules are agreed. Profile contact email does not change the authentication identity.

Implementation references: [Tailwind Vite integration](https://tailwindcss.com/docs/installation/using-vite), [React Hook Form](https://react-hook-form.com/get-started), [Zod](https://zod.dev/api).
