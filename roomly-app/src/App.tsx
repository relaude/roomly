import { useState } from 'react'
import { PaymentForm, ProfileForm, RoomForm } from './features/forms/RoomlyForms'
import { HomePage } from './features/home/HomePage'

const pages = {
  profile: { label: 'My profile', icon: 'person', eyebrow: 'YOUR ACCOUNT', title: 'A little more about you', description: 'Your home starts with the details. Keep yours up to date.', formTitle: 'Tenant profile', formDescription: 'Your personal details and emergency contact.', badge: 'Tenant' },
  payment: { label: 'Submit a payment', icon: 'payment', eyebrow: 'BILLS AND PAYMENTS', title: 'Keep your payments in order', description: 'Already made a payment? Share the details for verification.', formTitle: 'New payment submission', formDescription: 'Record your payment against a monthly bill.', badge: 'Tenant' },
  settings: { label: 'Room settings', icon: 'home', eyebrow: 'PROPERTY MANAGEMENT', title: 'A place for every detail', description: 'Manage room rent and utility rates for your next billing cycle.', formTitle: 'Room and utility settings', formDescription: 'Set up clear, consistent rates for your rooms.', badge: 'Landlord preview' },
} as const

type Page = keyof typeof pages
function Icon({ name, className = 'size-5' }: { name: string; className?: string }) {
  return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {name === 'home' ? <><path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1Z" /><path d="M9 21v-8h6v8M8 8h.01" /></> : name === 'person' ? <><circle cx="12" cy="8" r="4" /><path d="M4 21v-2a8 8 0 0 1 16 0v2" /></> : name === 'payment' ? <><rect x="3" y="5" width="18" height="14" rx="3" /><path d="M3 10h18M7 15h3" /></> : <><path d="m12 3 8 4v5c0 5-8 9-8 9s-8-4-8-9V7Z" /><path d="m8 12 3 3 5-6" /></>}
  </svg>
}

function FormsWorkspace({ onHome }: { onHome: () => void }) {
  const [active, setActive] = useState<Page>('profile')
  const page = pages[active]
  function navigate(next: Page) {
    if (next === active) return
    const form = document.querySelector('form')
    // React Hook Form exposes the dirty state to the shared form wrapper.
    if (form?.dataset.dirty === 'true' && !window.confirm('Leave this form and discard unsaved changes?')) return
    setActive(next)
  }
  return <>
    <a href="#main" className="fixed -top-20 left-4 z-50 rounded-lg bg-white p-4 text-brand-700 shadow-lg focus:top-4">Skip to content</a>
    <aside className="border-b border-line bg-white lg:fixed lg:inset-y-0 lg:left-0 lg:flex lg:w-64 lg:flex-col lg:border-r lg:border-b-0">
      <div className="flex items-center justify-between px-6 py-7 lg:px-8 lg:py-10">
        <button type="button" onClick={() => {
          const form = document.querySelector('form')
          if (form?.dataset.dirty === 'true' && !window.confirm('Leave this form and discard unsaved changes?')) return
          onHome()
        }} className="flex items-center gap-2.5 text-[30px] font-bold tracking-tight text-brand-700" aria-label="Roomly home"><span className="grid size-10 place-items-center rounded-xl border border-brand-200"><Icon name="home" className="size-7" /></span>roomly<span className="-ml-2 text-brand-500">.</span></button>
        <span className="rounded-full bg-brand-50 px-3 py-1 text-xs font-medium text-brand-700 lg:hidden">Demo</span>
      </div>
      <nav aria-label="Form previews" className="px-4 pb-4 lg:px-5">
        <p className="mb-4 hidden px-3 text-[10px] font-semibold tracking-[.18em] text-muted lg:block">ROOMLY WORKSPACE</p>
        <div className="flex flex-wrap gap-2 lg:flex-col">{(Object.keys(pages) as Page[]).map(key => <button key={key} type="button" onClick={() => navigate(key)} aria-current={active === key ? 'page' : undefined} className={`flex min-h-12 items-center gap-3 rounded-xl px-4 py-3 text-left text-sm transition-colors ${active === key ? 'bg-brand-50 font-semibold text-brand-700' : 'text-muted hover:bg-canvas'}`}><Icon name={pages[key].icon} />{pages[key].label}</button>)}</div>
      </nav>
      <div className="mt-auto hidden px-6 pb-7 lg:block">
        <div className="mb-6 rounded-2xl border border-brand-100 bg-brand-50/70 p-5"><Icon name="home" className="mb-3 size-9 text-brand-500" /><p className="text-sm font-semibold text-brand-700">Your space. Your home.</p><p className="mt-2 text-xs leading-6 text-muted">The little details that make renting feel simpler.</p></div>
        <div className="flex items-center gap-3 border-t border-line pt-5"><span className="grid size-10 place-items-center rounded-full bg-brand-50 text-xs font-semibold text-brand-700">AM</span><div><p className="text-sm font-semibold">Alex Morgan</p><p className="mt-1 text-xs text-muted">Sample account</p></div></div>
      </div>
    </aside>
    <div className="lg:ml-64">
      <header className="flex min-h-20 items-center justify-between gap-4 border-b border-line bg-white px-5 sm:px-10"><p className="text-xs text-muted">Roomly <span className="mx-3 text-slate-300">/</span><span className="text-ink">{page.label}</span></p><span className="rounded-full border border-brand-100 bg-brand-50 px-3 py-1.5 text-xs font-medium text-brand-700">Demo workspace</span></header>
      <main id="main" className="mx-auto max-w-7xl px-5 py-8 sm:px-10 sm:py-10" tabIndex={-1}>
        <div className="mb-8"><p className="text-[10px] font-semibold tracking-[.18em] text-brand-700">{page.eyebrow}</p><h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">{page.title}</h1><p className="mt-3 text-sm leading-6 text-muted">{page.description}</p></div>
        <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_260px]">
          <section aria-labelledby="form-title" className="min-w-0 rounded-2xl border border-line bg-white shadow-sm">
            <div className="flex items-start justify-between gap-4 border-b border-line p-6 sm:px-8"><div><h2 id="form-title" className="text-lg font-semibold">{page.formTitle}</h2><p className="mt-1.5 text-sm leading-6 text-muted">{page.formDescription}</p></div><span className="shrink-0 rounded-full bg-brand-50 px-3 py-1.5 text-xs font-medium text-brand-700">{page.badge}</span></div>
            <div className="p-6 sm:p-8" key={active}>{active === 'profile' ? <ProfileForm /> : active === 'payment' ? <PaymentForm /> : <RoomForm />}</div>
          </section>
          <aside aria-label="Form guidance" className="space-y-5">
            <section className="rounded-2xl border border-brand-100 bg-brand-50 p-6"><span className="mb-4 grid size-11 place-items-center rounded-xl bg-white text-brand-700"><Icon name="shield" className="size-6" /></span><h2 className="font-semibold text-brand-700">{active === 'profile' ? 'Your details, with care' : active === 'payment' ? 'Clear payment records' : 'Built for your next bill'}</h2><p className="mt-3 text-sm leading-7 text-muted">{active === 'profile' ? 'Your contact profile is separate from your sign-in identity. Room assignments and access need landlord approval.' : active === 'payment' ? 'Pending submissions stay separate from confirmed payments. Your landlord verifies each payment before it changes a balance.' : 'New rates should never rewrite issued bills. Keep historical charges and payment records intact.'}</p></section>
            <section className="rounded-2xl border border-line bg-white p-6"><p className="text-[10px] font-semibold tracking-[.16em] text-muted">ABOUT THIS PREVIEW</p><h2 className="mt-3 text-sm font-semibold">A safe place to try things</h2><p className="mt-3 text-sm leading-7 text-muted">Use fictional details. Forms validate in your browser; nothing is sent to a server. Reset restores the last validated values. Switching forms or refreshing clears this demo session.</p></section>
          </aside>
        </div>
        <footer className="mt-8 flex flex-wrap justify-between gap-3 text-xs leading-6 text-muted"><span>Roomly · Your space. Your home. All in one place.</span><span>Two rooms. A simpler way to manage them.</span></footer>
      </main>
    </div>
  </>
}

export default function App() {
  const [view, setView] = useState<'home' | 'portal'>('home')
  function changeView(next: 'home' | 'portal') {
    setView(next)
    window.scrollTo({ top: 0, behavior: 'instant' })
    requestAnimationFrame(() => document.getElementById('main')?.focus({ preventScroll: true }))
  }
  return view === 'home' ? <HomePage onOpenPortal={() => changeView('portal')} /> : <FormsWorkspace onHome={() => changeView('home')} />
}
