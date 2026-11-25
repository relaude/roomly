from pathlib import Path
from PIL import Image, ImageDraw, ImageFont
import math
ROOT=Path(__file__).parent
exec((ROOT/'build_plan.py').read_text(encoding='utf-8').split("d.add_heading('Two Room Rental Portal Application Plan',0)")[0])
def canvas(name,size):
 im=Image.new('RGB',size,'white'); dr=ImageDraw.Draw(im)
 font=ImageFont.truetype('C:/Windows/Fonts/calibri.ttf',30)
 def box(rect,lines,fill='#EDF3F8'):
  dr.rounded_rectangle(rect,14,fill=fill,outline='#5D7389',width=3)
  y=(rect[1]+rect[3])/2-len(lines)*19
  for line in lines:
   dr.text(((rect[0]+rect[2])/2,y),line,font=font,fill='black',anchor='mt'); y+=38
 def arrow(points,label=None,pos=None):
  dr.line(points,fill='#334E68',width=4); x,y=points[-1]; x0,y0=points[-2]; ang=math.atan2(y-y0,x-x0)
  dr.polygon([(x,y),(x-18*math.cos(ang-.5),y-18*math.sin(ang-.5)),(x-18*math.cos(ang+.5),y-18*math.sin(ang+.5))],fill='#334E68')
  if label: dr.text(pos,label,font=font,fill='#334E68',anchor='mm')
 return im,box,arrow
im,b,a=canvas('journey',(1500,1200))
b((410,20,1090,120),['1  Open your rental website'])
b((410,175,1090,285),['2  Choose Google or Facebook'])
b((410,345,1090,465),['3  Provider checks your account','Password stays with Google or Facebook'])
b((410,525,1090,645),['4  Supabase signs you into the portal','Website checks role and room access'])
for y1,y2 in [(120,175),(285,345),(465,525)]:a([(750,y1),(750,y2)])
b((30,790,470,965),['Landlord account','Open landlord dashboard'])
b((530,790,970,965),['Approved tenant','Open own tenant dashboard'])
b((1030,790,1470,965),['Tenant awaiting approval','Show access pending page'])
a([(750,645),(750,710),(250,710),(250,790)])
a([(750,645),(750,790)])
a([(750,710),(1250,710),(1250,790)])
b((1030,1040,1470,1180),['Landlord verifies tenant','and assigns the tenancy'],'#F4F5F6')
a([(1250,965),(1250,1040)])
im.save(ROOT/'login_journey.png')
im,b,a=canvas('approval',(1500,790))
b((30,35,465,190),['Tenant signs in','Identity confirmed'])
b((535,35,970,190),['Pending profile','No room records yet'])
b((1040,35,1470,190),['Landlord verifies person','and intended tenancy'])
a([(465,112),(535,112)]); a([(970,112),(1040,112)])
b((1040,325,1470,505),['Landlord approves membership','User ID linked to Room 1 tenancy'])
a([(1255,190),(1255,325)])
b((535,325,970,505),['Tenant refreshes access','or returns to the website'])
a([(1040,415),(970,415)])
b((30,325,465,505),['Database checks membership','Returns Room 1 tenancy records'])
a([(535,415),(465,415)])
b((30,625,1470,760),['Room 2 tenancy stays private','Google or Facebook confirms identity; your landlord grants room access.'],'#F4F5F6')
im.save(ROOT/'login_approval.png')

d.add_heading('How Login Works in Your Rental Website',0)
p('A guide for the landlord and tenants | 25 November 2026')
p('Your tenant clicks Continue with Google or Continue with Facebook and signs in with that provider. Supabase then creates a signed in session for your website. Your application checks whether the person is the landlord or an approved tenant before allowing access to rental records.')
p('There are two separate checks: identity answers “Who are you?” and permission answers “Which rental records may you see?” A successful Google or Facebook login does not automatically grant access to a room.')
d.add_picture(str(ROOT/'login_journey.png'),width=Inches(6.6))
p('Figure 1  The proposed login journey. Landlord and Tenant are the only roles. Pending approval is a tenant access status, not another role.')

page('What happens when someone signs in')
h('Step 1  Open the rental website')
p('The person visits your website on a phone or computer. Azure Static Web Apps delivers the login page. It shows Continue with Google and Continue with Facebook. No role selection or room selection is needed on this page.')
h('Step 2  Choose an account provider')
p('The browser starts the sign in process through Supabase Auth and opens Google or Facebook. For Gmail users, Continue with Google uses their Google account. They do not create a separate rental website password.')
h('Step 3  Google or Facebook checks the account')
p('The provider may ask the person to choose an account, enter a password, complete a security check or approve basic profile sharing. If they are already signed in, some prompts may be skipped. Your website does not receive their Google or Facebook password or access to their mailbox. [1]')
h('Step 4  Supabase establishes the website session')
p('The provider returns the sign in result to the registered Supabase callback. Supabase validates the result and returns the browser to your website using an allowed redirect. The website completes the session setup. A session is the website’s way of remembering that this account has signed in. [1,2]')
h('Step 5  Your application checks access')
p('The application looks up the authenticated user ID, protected role and approved tenancy membership. A known landlord goes to the landlord dashboard. An approved tenant goes to their tenant dashboard. A new tenant sees an access pending page and can supply their own contact details.')
h('Step 6  The database checks every data request')
p('When the tenant opens bills, the request includes their session credential. Database row level security checks their approved tenancy access before returning records. Hiding another tenant’s menu is not sufficient; the database must reject unauthorized requests too. [3]')
table(['Participant','What it does'],[
('Google or Facebook','Confirms the person controls that provider account'),
('Supabase Auth','Creates the rental website identity and session'),
('Rental website','Shows pages and guides the person through onboarding'),
('Landlord','Verifies the tenant and approves the correct tenancy'),
('Database access policies','Restrict records on each request')],[1.8,4.85])

page('How a new tenant receives room access')
p('For your two rooms, manual approval is a simple approach. A tenant can sign in before approval, but receives no tenancy records until you verify the person and link their account to the correct tenancy.')
d.add_picture(str(ROOT/'login_approval.png'),width=Inches(6.6))
p('Figure 2  First login and landlord approval. Tenancy means the specific occupancy or lease, so a future Room 1 occupant does not inherit the former occupant’s records.')
h('Example with your two rooms')
p('Maria rents Room 1 and signs in with Google. Her new account is pending. You check that the signed in account belongs to Maria, then approve her membership for the current Room 1 tenancy. When she refreshes access, she sees that tenancy’s rent, electricity, water and confirmed payments. Room 2 records remain inaccessible.')
h('What you do as the landlord')
p('Prepare the room and tenancy details. Ask the tenant to sign in and complete their profile. Verify the account directly with the tenant using your established contact details; do not rely only on a matching name. Approve the account’s user ID for the correct tenancy. An invitation can help identify the expected tenant, but it must not grant landlord privileges.')
h('How your own landlord login works')
p('During initial setup, a trusted administrator provisions your authenticated account with the protected Landlord role. You use the same Google or Facebook login buttons as tenants. The website reads your stored role and opens the landlord dashboard. Public signup never allows a person to select Landlord.')
h('Does approval happen every time')
p('No. Normal approval happens once per account and tenancy. On later visits, the website checks the existing approval. You change or revoke that membership when the tenancy ends or access needs to change. Decide separately whether a former tenant may retain read only access to their own historical statements.')

page('Returning visits logout and common questions')
h('Returning to the website')
p('If the browser still has a valid session, the website may open the dashboard without showing the provider login again. Supabase uses short lived access credentials and a refresh mechanism to maintain the session. If the session cannot be refreshed, the person signs in again. Approval remains stored and does not need to be repeated. [2]')
h('Logging out and removing access')
p('Logout clears the website session and returns the person to the login page. It does not necessarily sign them out of Google or Facebook. On a shared device, they should also protect or sign out of their provider account. Previously issued access credentials can remain valid until expiry; the design checks current tenancy membership on each request so membership revocation blocks new protected data access promptly. [2,3]')
table(['Situation','What the website should do'],[
('Person cancels provider login','Return to login with a clear retry option'),
('Unknown person signs in','Show pending access and no tenancy records'),
('Tenant uses a different account','Require verification before granting it access'),
('Tenant wants both login providers','Use a verified account linking process; never merge by name'),
('Facebook cannot complete login','Explain the error and offer Google as an alternative'),
('Authentication service is unavailable','Show an unavailable message; do not display a false zero balance'),
('Tenant attempts another room URL','Database denies access regardless of the URL')],[2.25,4.4])
h('What information is stored')
p('Store the Supabase user ID, protected role, profile information and approved tenancy membership. The tenant provides their contact number and emergency contact; these should not be assumed to come from Google or Facebook. Provider identity details are used for account identification, while rental and payment records stay in your application database.')
h('Before the login feature goes live')
p('The developer must configure the Google and Meta applications, Supabase provider settings, callback and website redirect URLs, profile creation, protected landlord setup and database policies. Test both providers with ordinary tenant accounts, pending approval, account switching, logout and cross tenant access. These diagrams describe the intended design, not an already deployed feature.')
h('References')
p('Based on Tenant Rental Website Architecture Design and the original application plan in the Documents folder. Official technical references checked 25 November 2026.')
for label,url in [('1 Social sign in','https://supabase.com/docs/guides/auth/social-sign-in'),('2 User sessions','https://supabase.com/docs/guides/auth/sessions'),('3 Database row level security','https://supabase.com/docs/guides/database/postgres/row-level-security')]:
 para=d.add_paragraph(label+'  '+url)
 for r in para.runs:r.font.size=Pt(9)
d.core_properties.title='How Login Works in Your Rental Website'
d.core_properties.subject='Google Facebook login tenant approval and access explained'
d.save(ROOT/'Tenant_Rental_Login_Procedure_Guide.docx')
print(ROOT/'Tenant_Rental_Login_Procedure_Guide.docx')
