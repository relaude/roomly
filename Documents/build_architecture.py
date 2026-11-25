from pathlib import Path
from PIL import Image, ImageDraw, ImageFont
ROOT=Path(__file__).parent
exec((ROOT/'build_plan.py').read_text(encoding='utf-8').split("d.add_heading('Two Room Rental Portal Application Plan',0)")[0])

def diagram():
 im=Image.new('RGB',(1500,1050),'white'); a=ImageDraw.Draw(im)
 font=ImageFont.truetype('C:/Windows/Fonts/calibri.ttf',27)
 small=ImageFont.truetype('C:/Windows/Fonts/calibri.ttf',23)
 def box(rect,lines,fill='#EDF3F8'):
  a.rounded_rectangle(rect,12,fill=fill,outline='#718397',width=2)
  x=(rect[0]+rect[2])/2; y=(rect[1]+rect[3])/2-len(lines)*17
  for line in lines:
   a.text((x,y),line,font=font,fill='black',anchor='mt'); y+=34
 def arrow(points,label=None,pos=None):
  a.line(points,fill='#334E68',width=4)
  x,y=points[-1]; x0,y0=points[-2]; import math
  ang=math.atan2(y-y0,x-x0)
  a.polygon([(x,y),(x-17*math.cos(ang-.5),y-17*math.sin(ang-.5)),(x-17*math.cos(ang+.5),y-17*math.sin(ang+.5))],fill='#334E68')
  if label:a.text(pos,label,font=small,fill='#334E68',anchor='mm')
 box((35,35,475,165),['Landlord and Tenant','Browser on phone or desktop'])
 box((35,285,475,435),['React application in browser','Profiles  Bills  Payments'])
 box((35,555,475,700),['Azure Static Web Apps','Serves HTML CSS JavaScript'])
 box((970,35,1465,165),['Google and Facebook','External identity providers'])
 a.rounded_rectangle((575,245,1465,1010),14,outline='#334E68',width=3)
 a.text((605,263),'SUPABASE MANAGED SERVICES',font=small,fill='black')
 box((650,325,1030,445),['Supabase Auth','Issues application session'])
 box((650,555,1030,700),['Data API and SQL functions','JWT  Role checks  RLS'])
 box((650,815,1030,960),['PostgreSQL','Tenancies and payment ledger'])
 box((1100,555,1420,700),['Private Storage','Payment proof files'])
 arrow([(255,165),(255,285)],'Uses app',(345,220))
 arrow([(255,555),(255,435)],'HTTPS assets',(350,490))
 arrow([(475,355),(650,355)],'Sign in',(560,320))
 arrow([(1030,355),(1215,355),(1215,165)],'OAuth',(1310,215))
 arrow([(475,405),(545,405),(545,625),(650,625)],'JWT requests',(545,500))
 arrow([(840,700),(840,815)],'Reads and writes',(730,758))
 arrow([(475,405),(530,405),(530,490),(1260,490),(1260,555)],'Browser file API with JWT',(1110,468))
 a.text((1250,745),'JWT and storage policies',font=small,fill='#334E68',anchor='mm')
 a.text((1250,780),'protect file access',font=small,fill='#334E68',anchor='mm')
 im.save(ROOT/'rental_architecture.png')
diagram()

d.add_heading('Tenant Rental Website Architecture Design',0)
p('Two rental units | Architecture version 1 | 25 November 2026')
p('Recommended design: a React application hosted on Azure Static Web Apps, with Supabase providing Google and Facebook authentication, PostgreSQL data services and private file storage. Keep exactly two business roles, Landlord and Tenant. Use database access policies and transactional functions to protect tenant records and keep billing accurate.')
p('This design develops the requirements in Two Room Rental Portal Application Plan into component responsibilities, data relationships, security rules and deployment steps. PostgreSQL remains the baseline; the MongoDB alternative is described at the end. The architecture is proposed for implementation and has not yet been deployed.')
d.add_picture(str(ROOT/'rental_architecture.png'),width=Inches(6.6))
p('Figure 1  Runtime components and trust boundaries. Azure serves the application files; the browser calls Supabase directly over HTTPS. The Supabase box represents managed services, not a private network. Every browser request is untrusted and requires authorization.')

page('Component design and application structure')
table(['Component','Responsibility','Boundary'],[
('React and TypeScript','Tenant dashboard, landlord dashboard, forms and statements','Presentation only; cannot grant permissions'),
('Supabase Auth','Google and Facebook login and session lifecycle','Identity is separate from tenancy approval'),
('Data API and PostgreSQL','Authorized reads, contact updates and transactional commands','Row policies, grants and constraints'),
('Private Storage','Receipt images and proof documents','Authorized object paths and expiring links'),
('GitHub deployment workflow','Build static assets and deploy to Azure','Secrets restricted to deployment jobs')],[1.45,2.8,2.4])
h('Frontend modules')
p('Organize the frontend into auth, tenant profiles, units and tenancies, billing, payment submissions, landlord verification and reporting modules. Each module has pages, form validation and a small data service. Shared code owns currency formatting, timezone handling, accessible controls and error messages.')
p('Suggested routes: /login, /access-pending, /tenant/dashboard, /tenant/profile, /tenant/bills, /tenant/payments, /landlord/dashboard, /landlord/tenancies, /landlord/billing, /landlord/payments and /landlord/reports. Route guards improve navigation; database policies enforce security.')
h('Server responsibilities')
p('Use ordinary authorized API reads for profiles and statements. Route financial writes through database functions, including draft_invoice, publish_invoice, submit_payment, confirm_payment, reject_submission and reverse_payment. Function names describe the proposed contract, not existing APIs. Each command checks authenticated identity, business role, tenancy scope and input values.')
p('Start with no separate Node server, Azure Functions app, scheduled worker or payment gateway. SQL functions provide the server side business rules. If email reminders or third party webhooks are later required, add a server function with explicit authentication and secret handling. [1,2]')
h('Configuration')
p('Frontend configuration contains only the Supabase project URL and publishable key. Provider secrets stay in Supabase Auth settings. GitHub stores the Azure deployment credential. Database administrative credentials stay out of browser bundles, logs and source control. Rate settings, currency and property timezone are controlled records in PostgreSQL.')

page('Data model and financial integrity')
table(['Record','Key relationships and purpose'],[
('profiles and user_roles','profiles.user_id references Auth user; protected role is Landlord or Tenant'),
('units and tenancies','Unit has many historical tenancies; tenancy stores lease dates and rent terms'),
('tenancy_members','Links an approved user to a tenancy with access status and dates'),
('invoices and invoice_lines','Tenancy has monthly invoices; invoice has rent, electricity and water lines'),
('meter_readings and utility_sources','Readings and shared source bills support utility calculation and evidence'),
('payment_submissions and attachments','Tenant claim and private proof metadata; pending claims are not funds'),
('payments and payment_allocations','Confirmed funds allocated to invoice lines; excess stays unapplied'),
('adjustments and deposit_entries','Documented bill changes and separate deposit transactions'),
('audit_events','Actor, action, target, timestamp and reason for sensitive changes')],[2.05,4.6])
h('Relationship map')
p('Auth user 1 → 1 profile; Auth user 1 → many tenancy memberships; unit 1 → many tenancies; tenancy 1 → many invoices; invoice 1 → many invoice lines; tenancy 1 → many submissions and payments; payment 1 → many allocations; invoice line 1 → many allocations. A confirmed submission references at most one payment.')
h('Constraints and calculations')
p('Use UUID identifiers, foreign keys and integer minor currency units. Enforce one invoice per tenancy and billing period, one payment per accepted submission, unique command request IDs and no overlapping active tenancies for a unit. Enforce the two room limit in setup and reject unauthorized unit creation.')
p('Allocate payments only within the same tenancy and currency. Lock affected rows during confirmation and allocation. The sum of allocations cannot exceed confirmed funds or the remaining invoice amount. Validate these totals inside a transaction; ordinary row checks alone cannot enforce cross record totals.')
p('Store issued prices, meter readings, allocation method and rounding results as snapshots. Derive statements from posted records: charges plus debit adjustments minus credits minus valid confirmed allocations. Pending submissions are excluded. Deposits use a separate ledger and require an explicit transaction to apply them to rent.')
p('Keep issued records immutable. Void drafts when appropriate, and correct issued financial records with linked adjustment or reversal entries and a reason. Store timestamps in UTC; calculate due date status using the configured property timezone. Dashboard totals and exports use the same authorized calculation queries.')

page('Authentication and authorization design')
h('Login and tenant approval sequence')
p('1. Browser starts Supabase OAuth with Google or Facebook. The provider authenticates the user and returns through the registered Supabase callback. Supabase establishes the application session and redirects to an allowlisted application URL.')
p('2. Create a basic profile for the authenticated user. A new account has Tenant role with pending access and no approved tenancy membership. The user can supply contact details but cannot discover existing tenants or room billing data.')
p('3. The landlord verifies the intended tenant and approves a membership linked to the authenticated user ID. A controlled administrative setup provisions the initial landlord; public signup cannot set or change roles.')
p('4. Subsequent requests use the application JWT. Database policies check current protected role and membership records. Revoking membership therefore stops data access without trusting an old role value in browser state. Provider linking requires a verified account workflow.')
table(['Data action','Landlord','Tenant'],[
('Read tenant and billing records','All records for this property','Own profile and approved tenancy scope'),
('Update personal contact fields','Authorized correction with audit','Own allowed fields only'),
('Create or issue bills','Restricted command functions','Denied'),
('Submit payment proof','Can record received payment separately','Own approved tenancy only'),
('Confirm or reverse payment','Restricted command functions','Denied'),
('Change role or membership','Controlled approval operation','Denied')],[2.1,2.25,2.3])
h('Database and file access')
p('Enable RLS on all exposed tables and use least privilege grants. Protect profile fields with column privileges or a narrow update function; row policies alone do not restrict which columns change. Views for balances must run with caller permissions, or be exposed through functions with explicit checks. [1]')
p('Default functions to invoker permissions. Any required SECURITY DEFINER function must use a fixed safe search_path, fully qualified objects and explicit actor checks. Revoke public and anonymous execution and grant only the intended authenticated entry points. Never trust a caller supplied actor or landlord ID. [2]')
p('Store proof objects under tenancy ID and submission ID with random file names. Storage policies check ownership and membership; paths alone are not authorization. Allow only small JPEG, PNG or PDF files, verify content types where practical, and use short lived signed links. Recheck authorization before issuing links. Historical access belongs to a tenancy, never to the room’s next occupant.')

page('Billing and payment transaction flows')
h('Issue the monthly bill')
p('Landlord → draft_invoice → tenancy and rent validation → rent and utility line calculation → landlord review → publish_invoice → issued bill visible to approved members. Publishing locks the draft, validates the period, utility allocation and totals, and records an audit event in the same transaction.')
p('A repeated request with the same idempotency key returns its original result. A conflicting request for the same tenancy and billing month returns the existing invoice or a clear conflict. Failed validation leaves the bill unissued.')
h('Submit and confirm payment')
p('Tenant → create pending submission → upload optional proof → attach object metadata → landlord checks actual receipt of funds → confirm_payment → payment and allocations committed → tenant statement refreshed. An uploaded image is evidence for review, not confirmation that money was received.')
p('Confirmation checks landlord authority, locks the pending submission and affected invoice lines, validates the amount and currency, creates exactly one confirmed payment, allocates funds and appends an audit event. Commit all records together or roll back all changes. Concurrent confirmations must not create duplicate receipts.')
p('If the payment exceeds outstanding charges, keep the remainder as unapplied credit visible to the landlord and tenant. Rejecting proof records a reason without changing the balance. A reversal appends linked counter entries and recalculates balances; it does not erase the original receipt.')
table(['Operation','Allowed caller','Result or failure behavior'],[
('publish_invoice(invoice_id, request_id)','Landlord','Issued invoice or validation conflict'),
('submit_payment(tenancy_id, details, request_id)','Approved tenant member','Pending submission; balance unchanged'),
('confirm_payment(submission_id, allocations, request_id)','Landlord','One atomic receipt and allocations'),
('reverse_payment(payment_id, reason, request_id)','Landlord','Linked reversal with audit record'),
('get_statement(tenancy_id, period)','Authorized member or landlord','Scoped charges, payments and balance')],[3.15,1.4,2.1])
h('Failure states and user feedback')
p('Expired sessions return the user to login without replaying financial writes blindly. Network timeouts offer a retry using the same request ID and a refreshed status check. A paused Supabase project shows a service unavailable message with landlord contact details; it must not show a zero balance. Cancelled uploads leave an unsubmitted or incomplete record that can be retried; remove abandoned files through a controlled cleanup process.')

page('Deployment operations and release gates')
h('Deployment topology')
p('Developer → private GitHub repository → checks and Vite build → Azure Static Web Apps production hostname. Browser loads dist assets over HTTPS and calls the production Supabase project. Configure SPA route fallback, allowlisted Auth redirects and suitable browser security headers. Azure frontend route rules do not replace Supabase authorization.')
p('Use local Supabase for development where available and an isolated test project for staging. Keep real tenant data out of previews. Version schema changes and policy tests with the application; deploy compatible database changes before the frontend. Restrict migration and production deployment credentials to trusted release jobs.')
h('Free plan operating model')
p('Azure Free supplies static hosting with HTTPS and GitHub integration but no uptime SLA. Supabase Free currently includes 500 MB database storage and 1 GB file storage and may pause after one week of inactivity. Target zero monthly service fees within allowances; this is not a guarantee of uninterrupted operation. Monitor quotas and recheck terms before launch. [3,4]')
p('Use manual monthly billing and verification initially. Keep receipt uploads small, use the supplied Azure hostname, and omit SMS, paid email and payment gateways. Review database size, storage and egress each month. Upgrade when restoration delays or availability limits no longer meet tenant needs.')
h('Backup and recovery')
p('After each billing session, export the application database and separately back up attachment files and an object inventory. Protect exports with encryption and restricted access. A CSV statement export is useful for reconciliation but is not a full database backup. Auth identities and provider settings need a separate recovery procedure; do not assume an application schema dump restores them.')
p('Proposed recovery targets for owner approval: recover within one business day and lose no more than the last billing session. Take a backup after every session and before migrations to support these targets. Restore into an isolated environment and reconcile invoice totals, allocations, identities and file links before reopening access. Keep manual receipts during outages.')
h('Release gates')
p('Test with two independent tenant accounts and direct API calls: cross tenant reads and writes fail; revoked users lose access; tenants cannot edit roles, rates or payment status; file links are scoped. Verify both social providers on the production hostname using ordinary accounts.')
p('Verify duplicate and concurrent confirmation, partial payment, overpayment, reversal, shared utility rounding, move out isolation and overdue boundaries. Reconcile dashboard and exported balances. Test deep links, phone layouts, backup restoration and the unavailable service state. Roll back frontend assets if needed; use forward repair migrations for financial schema changes.')

page('Architecture decisions and implementation order')
table(['Decision','Reason','Consequence'],[
('Azure frontend plus Supabase','Few managed components for two rooms','Two providers and separate configuration'),
('PostgreSQL baseline','Relationships, constraints and transactions suit billing','Schema migrations and SQL policy tests required'),
('SQL command functions','Central rules for sensitive writes','Careful grants and transaction design'),
('Manual payment verification','Fits cash bank and wallet payments','Owner must check actual funds'),
('No scheduled billing initially','Keeps first release simple','Landlord initiates monthly invoices')],[1.9,2.45,2.3])
h('If MongoDB is selected later')
p('Replace the PostgreSQL data API and SQL command layer with a secure backend API connected to MongoDB Atlas. The browser calls that API, which validates Supabase Auth tokens, checks current roles and tenancy membership, and performs billing commands using MongoDB transactions and unique indexes. Keep MongoDB credentials only in the backend.')
p('Supabase Auth can remain for login, but PostgreSQL RLS does not protect MongoDB. Authorization, totals, idempotency and audit rules must be implemented in the backend. Private proof storage also needs a clearly owned authorization path; retained Supabase Storage requires database backed policies or a backend that authorizes and signs file access. Reassess backend hosting cost before adopting this alternative.')
h('Implementation sequence')
p('First build the schema, controlled landlord setup, login and tenancy isolation tests. Then build profiles and room assignment. Add invoice drafting and publishing, followed by submissions, atomic confirmation and statements. Finish with storage policies, deployment, restore testing and the two room pilot. Keep the original application plan as the requirements baseline.')
h('Outstanding owner decisions')
p('Confirm currency and property timezone, each lease rate and due day, meter or shared utility rules, deposit treatment, opening balances, co tenant access and former tenant retention. These are configuration and business rule decisions; the baseline architecture supports them without adding a third role.')
h('References')
p('Requirements source: Two_Room_Rental_Portal_Plan.docx in the Documents folder. Product references checked 25 November 2026; URLs below support the managed service capabilities, permission model and free plan constraints.')
for label,url in [
('1 Supabase row level security','https://supabase.com/docs/guides/database/postgres/row-level-security'),
('2 Supabase database functions','https://supabase.com/docs/guides/database/functions'),
('3 Azure Static Web Apps plans','https://learn.microsoft.com/en-us/azure/static-web-apps/plans'),
('4 Supabase pricing','https://supabase.com/pricing')]:
 para=d.add_paragraph(label+'  '+url)
 for r in para.runs:r.font.size=Pt(9)
d.core_properties.title='Tenant Rental Website Architecture Design'
d.core_properties.subject='Components data security transactions and deployment'
d.save(ROOT/'Tenant_Rental_Website_Architecture_Design.docx')
print(ROOT/'Tenant_Rental_Website_Architecture_Design.docx')
