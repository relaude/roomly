from docx import Document
from docx.shared import Inches, Pt, RGBColor
from docx.oxml import OxmlElement
from docx.oxml.ns import qn
from pathlib import Path

OUT=Path(__file__).parent
d=Document()
s=d.sections[0]; s.top_margin=s.bottom_margin=Inches(.7); s.left_margin=s.right_margin=Inches(.8)
for name in ['Normal','Title','Subtitle','Heading 1','Heading 2']:
 st=d.styles[name]; st.font.name='Calibri'; st.font.color.rgb=RGBColor(0,0,0)
d.styles['Normal'].font.size=Pt(11)
d.styles['Normal'].paragraph_format.space_after=Pt(7)
d.styles['Normal'].paragraph_format.line_spacing=1.08
d.styles['Title'].font.size=Pt(26)
d.styles['Heading 1'].font.size=Pt(18)
d.styles['Heading 2'].font.size=Pt(13)
def p(t): d.add_paragraph(t)
def h(t): d.add_heading(t,2)
def page(t): d.add_page_break(); d.add_heading(t,1)
def table(headers,rows,widths):
 t=d.add_table(rows=1,cols=len(headers)); t.autofit=False
 for c,w in zip(t.columns,widths): c.width=Inches(w)
 for c,x in zip(t.rows[0].cells,headers): c.text=x
 rep=OxmlElement('w:tblHeader'); t.rows[0]._tr.get_or_add_trPr().append(rep)
 for row in rows:
  for c,x in zip(t.add_row().cells,row): c.text=x
 for i,row in enumerate(t.rows):
  for c,w in zip(row.cells,widths):
   c.width=Inches(w); pr=c._tc.get_or_add_tcPr()
   shade=OxmlElement('w:shd'); shade.set(qn('w:fill'),'E6EDF3' if i==0 else ('F5F7F9' if i%2==0 else 'FFFFFF')); pr.append(shade)
   borders=OxmlElement('w:tcBorders')
   for side in ['top','left','bottom','right']:
    b=OxmlElement('w:'+side); b.set(qn('w:val'),'single'); b.set(qn('w:sz'),'4'); b.set(qn('w:color'),'D9D9D9'); borders.append(b)
   pr.append(borders)
   for para in c.paragraphs:
    para.paragraph_format.space_after=Pt(5); para.paragraph_format.space_before=Pt(5)
    for r in para.runs: r.font.size=Pt(10); r.bold=i==0
 d.add_paragraph().paragraph_format.space_after=Pt(0)

d.add_heading('Two Room Rental Portal Application Plan',0)
p('Prepared for the property owner | 25 November 2026')
d.add_heading('Recommended approach',1)
p('Build a mobile friendly tenant portal for your two rental units. Use React with TypeScript and Vite, Azure Static Web Apps Free for the website, and Supabase Free for the database, Google and Facebook sign in, and private payment attachments. This is the simplest proposed path to a zero monthly hosting bill at your scale, subject to free plan limits and availability. [1–6]')
p('The first release should let you manage tenants, issue monthly rent and utility charges, confirm payments, and show each tenant a clear statement. Tenants should see only their own information and tenancy records. Keep exactly two application roles: Landlord and Tenant.')
h('Scope and working assumptions')
p('Start with Room 1 and Room 2, one active tenancy per room, one landlord account, and a small number of approved tenant accounts. Keep tenancy history when occupants change. Confirm whether multiple adults need access to the same tenancy before development.')
p('Use one configurable currency and property timezone. Rent amounts, due dates, utility rates, deposits, and opening balances are setup values. Record payments made through your existing cash, bank, or wallet arrangements; online payment collection is a later option.')
h('What the first release includes')
p('Google and Facebook sign in; approved tenant onboarding; tenant and emergency contact profiles; room and lease records; monthly rent, electricity and water bills; partial payments; landlord verification; outstanding balance and payment history; downloadable statements and landlord CSV exports.')
h('Free hosting tradeoff')
p('Supabase Free projects may pause after one week of inactivity. Monthly use can trigger this, so the landlord may need to restore the project before tenants use it. Azure Free has no uptime SLA. A reliable always available service may eventually require a paid plan. Free service usage does not include development labor, domains, or payment processor fees. [1–3]')

page('Roles and application pages')
table(['Capability','Landlord','Tenant'],[
('Room and tenancy setup','Create and manage both units','View assigned tenancy'),
('Tenant contact details','View and correct records','Edit own contact fields'),
('Bills and rent terms','Create and adjust with audit trail','Read own issued bills'),
('Payments','Confirm or reject submissions','Submit own payment details'),
('Reports and access','Export all and approve accounts','View own statements only')],[2.25,2.25,2.15])
h('Tenant experience')
p('Login shows Continue with Google and Continue with Facebook. A successful login without an approved tenancy shows an access pending message and landlord contact details. Pending is an account status, not a third role.')
p('Dashboard shows current billing month, rent, electricity, water, total outstanding, due date, and overdue balance. A clear View bill action opens the breakdown. Show pending payment submissions separately from confirmed payments.')
p('My profile contains full name, preferred name if needed, mobile number, contact email, emergency contact name, relationship and number. My tenancy shows room, start and end dates, rent, due day and deposit record. Bills and Payments show itemized charges, verified receipts and statements.')
h('Landlord experience')
p('Overview shows two room cards, occupancy, expected monthly charges, confirmed collections, total unpaid and overdue balances. Tenants and Rooms manage assignments and move in or move out history. Billing prepares monthly charges. Payments provides a verification queue. Reports exports statements and balances. Settings stores rates, due days and payment instructions.')
h('Design requirements')
p('Prioritize phone screens, readable amounts, large controls and plain status labels. Always show the billing period, currency, amount paid and amount remaining. Do not rely on color alone to communicate overdue or paid status. Display useful loading, empty, failed login and unavailable service states.')

page('Tenant onboarding and billing rules')
h('Safe social login')
p('Use Google account sign in for Gmail users; do not request access to their mailbox. Create Google OAuth and Meta developer applications, configure the Supabase callback and production redirect URLs, and keep provider secrets in Supabase configuration. Use only the identity permissions needed. [4,5]')
p('Create the landlord role through a controlled administrative setup. A user must never choose Landlord during signup. The landlord creates a tenancy invitation, the tenant signs in, and the landlord confirms the authenticated account before assigning access. Use authenticated user IDs as the identity key; email alone is not sufficient for assigning a tenancy.')
p('Facebook can omit email or have configuration requirements that block sign in. Provide a clear error and Google sign in fallback. Verify Meta live mode and any review or verification requirements before launch. If a tenant wants both providers, link identities only through a verified account linking process; never merge records by matching a typed name. [4,5]')
h('Monthly billing workflow')
p('1. Landlord selects a tenancy and billing month. Create one invoice for that tenancy and month; repeated clicks must not duplicate it. Rent uses the agreed rate effective for that billing period.')
p('2. Add electricity and water lines. If separately metered, charge consumption multiplied by the stored unit rate, plus any agreed fixed charge. Store previous and current readings, units, dates and rate snapshots. Reject negative consumption unless a documented meter replacement or correction is recorded.')
p('3. If utilities are shared, record the source bill and the agreed allocation method, such as equal split or actual submeter usage. Check that allocations reconcile to the amount being distributed. Publish only after review.')
p('4. Tenant sees the issued bill and submits payment date, amount, method, reference and optional proof. Landlord checks actual receipt of funds and confirms or rejects the submission with a reason.')
p('5. Allocate confirmed payments to invoice lines. Support partial payments and explicit unapplied credit. Corrections use reversals or documented adjustments rather than deletion of financial history.')
h('Balance and status definitions')
p('Invoice balance = issued charges + debit adjustments − credit adjustments − confirmed payment allocations. Unpaid means no confirmed amount allocated; Partially paid means a positive remainder after payment; Paid means zero remainder. Overdue applies when a positive balance remains after the due date in the property timezone. Pending proof never reduces the balance.')
p('Example in the chosen currency: rent 5,000 + electricity 600 + water 200 = 5,800 due. A confirmed payment of 3,000 leaves 2,800 outstanding. A further pending submission of 2,800 leaves that balance unchanged until confirmed. Keep deposits separate from rent unless explicitly applied.')

page('Technology and data architecture')
table(['Layer','Recommended choice','Reason'],[
('Website','React and TypeScript with Vite','Static build suitable for Azure hosting'),
('Styling and forms','Tailwind CSS and schema validation','Responsive forms and consistent UI'),
('Authentication','Supabase Auth','Google and Facebook identity providers'),
('Database','Supabase PostgreSQL','Relational billing and access policies'),
('Attachments','Private Supabase Storage','Protected receipt images and files'),
('Delivery','GitHub and Azure Static Web Apps','Versioned source and automated deploys')],[1.15,2.35,3.15])
p('Architecture: browser → Azure hosted frontend → Supabase Auth and database APIs. Database row level security enforces access. Sensitive operations such as payment confirmation and invoice publication run through restricted database functions with transactions. No separate always running server is required. [6]')
h('Core data records')
p('Profiles: authenticated user ID, name, phone and emergency contact. User roles: protected Landlord or Tenant assignment. Units: two room records. Tenancies: unit, lease dates, rent and due day. Tenancy members: approved user access to a tenancy, with status and access dates.')
p('Invoices and invoice lines: billing period, due date, rent and utility breakdown, issued amounts and rates. Meter readings: unit, utility, dates and readings. Payment submissions: tenant supplied proof and verification status. Payments and allocations: confirmed funds and distribution to charges. Adjustments and audit events: who changed what, when and why.')
h('Integrity and privacy controls')
p('Use decimal amounts or integer minor currency units. Enforce unique invoice periods, positive payment amounts, valid allocation totals and nonoverlapping active tenancies. Apply confirmations atomically and make retries safe to prevent duplicate receipts.')
p('Enable row level security on every exposed table. Tenant reads must be limited through approved tenancy membership, including historical records for that tenancy only. Tenant updates must allow only approved contact fields. Only landlord authorized operations can change rates, roles, bills, allocations or verification status. Test these rules through direct API requests, not just hidden menus. [6]')
p('Use private attachment buckets with access policies and short lived signed links. Validate upload size and file type. Never ship service role keys or OAuth secrets in the frontend. Avoid collecting identity documents or unnecessary personal data. Publish a privacy notice and define retention and access revocation at move out.')

page('Cloud deployment and operating cost')
table(['Option','Cost expectation','Assessment'],[
('Azure frontend plus Supabase','Target USD 0 within both Free plans','Recommended for simplicity; hybrid cloud'),
('AWS frontend plus Supabase','Depends on AWS account and hosting allowances','Possible, but verify each service and expiry'),
('Entirely on AWS','Usage based beyond applicable allowances','More setup; no permanent zero cost promise'),
('Entirely on Azure','Requires separate backend and identity design','Reassess costs before choosing this route')],[1.65,2.3,2.7])
p('Azure Static Web Apps Free includes 100 GB monthly bandwidth and 250 MB per environment. It is positioned for personal projects and has no SLA. Use its supplied hostname and HTTPS. Handle social identity in Supabase rather than relying on Azure Free custom authentication provider registration. [1,2]')
p('Supabase Free includes a 500 MB database, 1 GB file storage, 5 GB egress and 50,000 monthly active users. These allowances are ample for the proposed two room workload, but receipt files and downloads still need monitoring. Export backups yourself; do not assume paid backup features are included. [3]')
p('AWS alternative architecture: Amplify Hosting for the frontend, Cognito for social identity, API Gateway and Lambda for business rules, DynamoDB for records, and private S3 for attachments. This is feasible but introduces more services and billing controls. New AWS free accounts have a credit based plan lasting up to six months or until credits run out. Do not treat introductory credits as permanent free hosting. [7]')
h('Deployment steps')
p('1. Create a private source repository and local development configuration. Create a Supabase Free project near users; apply versioned schema migrations and access policies. Seed only Room 1 and Room 2, with no real tenant data in development.')
p('2. Configure Google and Facebook identity providers, privacy pages, callback URLs and exact allowed redirects. Provision the landlord account securely and verify that provider sign in works for ordinary users outside developer test accounts.')
p('3. Create Azure Static Web Apps on the Free plan and connect the repository. Build the Vite frontend into dist. Configure single page application route fallback. Supply only the Supabase URL and publishable key as frontend settings; database policies provide the protection.')
p('4. Test on the production hostname using two separate tenant accounts. Add the real lease data and reconcile opening balances before issuing the first live bills. Retain a manual billing record until reconciliation succeeds.')
h('Keeping the bill at zero')
p('Avoid paid upgrades, a custom domain, SMS, payment gateways and automated email services in the first release. Keep attachments small, check quotas monthly, and export encrypted backups after each billing cycle. Test restoring a backup before launch. Configure available usage alerts; alerts are not a spending cap. Plan for Supabase pause and restoration or budget for an upgrade if continuous access becomes necessary.')

page('Delivery roadmap and launch criteria')
table(['Stage','Work','Completion evidence'],[
('1  Define','Confirm leases, currency and utilities','Approved billing rules and page outline'),
('2  Accounts','Social login, profiles, access policies','Both providers work; isolation checks pass'),
('3  Billing','Invoices, readings and payment ledger','Sample month reconciles correctly'),
('4  Launch','Deploy, backups and owner walkthrough','Two room pilot and restore test pass')],[1.0,2.6,3.05])
p('Planning estimate: about 3 to 5 weeks for one experienced developer working part time, depending on existing code, design changes and provider approval. This is an effort estimate, not a quoted delivery commitment. Start provider setup early.')
h('Required launch checks')
p('A tenant cannot fetch another tenant profile, invoice or receipt through URLs, API calls or storage paths. An unapproved login sees no tenancy records. Tenant attempts to promote a role or confirm payment are rejected by the database.')
p('Test both Google and Facebook login, cancelled login, expired session, missing Facebook email and production callback behavior. Test move out and new occupancy so new tenants never inherit prior occupants’ private records.')
p('Verify partial payment, rejected proof, overpayment, reversal, overdue date boundaries, shared utilities, meter correction and duplicate submission. Summary totals must reconcile with the transaction ledger. Test phone layout, readable statements, backup restoration and paused service recovery.')
h('Decisions to settle before development')
p('Confirm monthly rent and due day for each room, electricity and water calculation methods, currency and timezone, deposit handling, accepted payment methods, existing balances, whether each room has multiple account holders, and how long former tenants retain statement access.')
h('Later enhancements')
p('After the core ledger is stable, consider scheduled reminders, downloadable PDF receipts, maintenance requests, lease attachments and online payment collection. Evaluate new charges and access requirements before adding each service.')
h('Sources and verification date')
p('Official product documentation checked 25 November 2026. Pricing and quotas can change; recheck before deployment.')
sources=[
('1 Azure hosting plans','https://learn.microsoft.com/en-us/azure/static-web-apps/plans'),
('2 Azure quotas','https://learn.microsoft.com/en-us/azure/static-web-apps/quotas'),
('3 Supabase pricing','https://supabase.com/pricing'),
('4 Google sign in','https://supabase.com/docs/guides/auth/social-sign-in/auth-google'),
('5 Facebook sign in','https://supabase.com/docs/guides/auth/social-sign-in/auth-facebook'),
('6 Row level security','https://supabase.com/docs/guides/database/postgres/row-level-security'),
('7 AWS Free Tier','https://docs.aws.amazon.com/awsaccountbilling/latest/aboutv2/free-tier.html')]
for label,url in sources:
 para=d.add_paragraph(label+'  '+url); para.paragraph_format.space_after=Pt(3)
 for r in para.runs:r.font.size=Pt(9)
d.core_properties.title='Two Room Rental Portal Application Plan'
d.core_properties.subject='Requirements technology deployment and delivery plan'
d.save(OUT/'Two_Room_Rental_Portal_Plan.docx')
print(OUT/'Two_Room_Rental_Portal_Plan.docx')
