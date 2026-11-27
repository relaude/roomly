import { useEffect, useRef, useState } from 'react'

const features = [
  { symbol: '▤', title: 'Know what’s due.', text: 'See rent, electricity, and water in one clear breakdown. Understand the amount paid and the balance left.', detail: 'Monthly bills, made clear' },
  { symbol: '↗', title: 'Keep the record.', text: 'Find your payment history and submit payment details for your landlord to review. No more wondering where things stand.', detail: 'Payments with a clear history' },
  { symbol: '⌂', title: 'Feel connected.', text: 'Keep your contact and emergency details up to date, with your room and tenancy information easy to find.', detail: 'Your tenancy, together' },
]
const steps = [
  ['Bring your existing account.', 'The planned portal will let you choose Google or Facebook. Your password stays with your account provider.'],
  ['Let your landlord connect you.', 'Your landlord will verify your account and link it to the right tenancy. Until then, your access stays pending.'],
  ['Make yourself at home.', 'Once approved, you will be able to view your bills, payment history, and tenancy details in your own portal.'],
]
const questions = [
  ['Do I need to create a new password?', 'No. The planned sign-in will use your existing Google or Facebook account. Your provider verifies your identity without sharing your password with Roomly.'],
  ['Why does my account need approval?', 'Sign-in confirms who you are. Your landlord then verifies your account and connects it to your specific tenancy, so you get the right rental records.'],
  ['Can other tenants see my information?', 'The planned portal will limit tenant access to their own profile and approved tenancy. Your landlord will have access to the records needed to manage the rental.'],
  ['Does submitting proof mark my bill as paid?', 'No. Your landlord must verify that the payment was received. Pending submissions do not reduce your outstanding balance.'],
  ['Is this a live rental portal?', 'This is a frontend demo with fictional information. You can try the profile, payment, and room settings forms. Authentication, stored tenant records, and payment processing are not connected yet.'],
]
const wrap = 'mx-auto w-full max-w-6xl px-5 sm:px-8 lg:px-10'
const eyebrow = 'text-[10px] font-semibold tracking-[.18em] text-brand-700'
const heading = 'mt-4 text-3xl font-semibold leading-tight tracking-tight sm:text-4xl'

function Brand() {
  return <span className="flex items-center gap-2.5 text-[29px] font-bold tracking-tight text-brand-700"><span aria-hidden="true" className="grid size-9 place-items-center rounded-xl border border-brand-200 text-3xl font-normal">⌂</span>roomly<span className="-ml-2 text-[#8b9ae2]">.</span></span>
}

export function HomePage({ onOpenPortal }: { onOpenPortal: () => void }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const navigation = useRef<HTMLDivElement>(null)
  const menuButton = useRef<HTMLButtonElement>(null)
  const privacy = useRef<HTMLDialogElement>(null)
  useEffect(() => {
    if (!menuOpen) return
    function onKey(event: KeyboardEvent) {
      if (event.key === 'Escape') { setMenuOpen(false); menuButton.current?.focus() }
    }
    function onPointer(event: PointerEvent) {
      if (event.target instanceof Node && !navigation.current?.contains(event.target)) setMenuOpen(false)
    }
    document.addEventListener('keydown', onKey)
    document.addEventListener('pointerdown', onPointer)
    return () => { document.removeEventListener('keydown', onKey); document.removeEventListener('pointerdown', onPointer) }
  }, [menuOpen])

  return <div className="bg-white">
    <a href="#main" className="fixed -top-20 left-4 z-50 rounded-lg bg-white p-4 text-brand-700 shadow-lg focus:top-4">Skip to content</a>
    <header className={`${wrap} flex min-h-24 items-center justify-between gap-5`}>
      <a href="#main" aria-label="Roomly home"><Brand /></a>
      <div ref={navigation} className="relative">
        <button ref={menuButton} type="button" aria-expanded={menuOpen} aria-controls="home-navigation" onClick={() => setMenuOpen(!menuOpen)} className="button-secondary md:hidden">Menu <span className="ml-3" aria-hidden="true">☰</span></button>
        <nav id="home-navigation" aria-label="Main navigation" className={`${menuOpen ? 'flex' : 'hidden'} absolute right-0 top-15 z-20 w-64 flex-col gap-5 rounded-2xl border border-line bg-white p-6 text-sm text-muted shadow-lg md:static md:flex md:w-auto md:flex-row md:items-center md:gap-8 md:border-0 md:p-0 md:shadow-none`}>
          <a href="#features" onClick={() => setMenuOpen(false)} className="hover:text-brand-700">Why Roomly</a><a href="#how-it-works" onClick={() => setMenuOpen(false)} className="hover:text-brand-700">How it works</a><a href="#questions" onClick={() => setMenuOpen(false)} className="hover:text-brand-700">FAQs</a><button type="button" onClick={onOpenPortal} className="button-secondary">Explore demo <span aria-hidden="true" className="ml-3">↗</span></button>
        </nav>
      </div>
    </header>
    <main id="main" tabIndex={-1}>
      <section className={`${wrap} grid items-center gap-10 pt-8 pb-12 md:grid-cols-2 md:gap-12 md:pt-12 md:pb-16`}>
        <div>
          <p className={`${eyebrow} flex items-center gap-2`}><span aria-hidden="true" className="text-xl">⌂</span>A LITTLE MORE PEACE OF MIND</p>
          <h1 className="mt-6 text-[clamp(3rem,5.3vw,4.5rem)] leading-[1.08] font-semibold tracking-[-.045em]">Your space.<br />Your home.<br /><span className="text-[#6577c4]">All in one place.</span></h1>
          <p className="mt-6 text-base leading-8 text-muted">Rent, bills, and the little details of home.<br />Keep them together, and get on with living.</p>
          <div className="mt-8 flex flex-wrap items-center gap-5"><button type="button" onClick={onOpenPortal} className="button-primary">Open the demo portal <span aria-hidden="true">→</span></button><a href="#how-it-works" className="text-sm font-semibold text-brand-700 hover:underline">See how it works</a></div>
          <p className="mt-4 text-xs leading-6 text-muted">A preview of your next home for rental essentials.</p>
        </div>
        <div className="relative isolate mx-auto w-full max-w-lg overflow-hidden rounded-3xl bg-brand-700 px-5 pt-8 pb-7 sm:px-9" aria-label="Illustrative preview of a Roomly monthly bill">
          <div aria-hidden="true" className="absolute -top-40 -right-24 -z-10 size-96 rounded-full border border-white/10" />
          <p className="text-[9px] font-semibold tracking-[.22em] text-indigo-100">A PLACE FOR THE EVERYDAY</p>
          <img src="/roomly-home.svg" alt="" width="560" height="370" className="-mt-2 w-full" />
          <div className="relative -mt-13 -rotate-2 rounded-2xl bg-white p-5 shadow-xl sm:p-6">
            <div className="flex items-center gap-3"><span aria-hidden="true" className="grid size-10 shrink-0 place-items-center rounded-xl bg-brand-50 text-3xl text-brand-500">⌂</span><div><h2 className="text-sm font-semibold">Your home at a glance</h2><p className="mt-1 text-[11px] text-muted">Room 1 · Sample tenancy</p></div><span className="ml-auto text-[8px] tracking-widest text-muted">PREVIEW</span></div>
            <dl className="mt-5 space-y-3 text-xs text-muted"><div className="flex justify-between gap-4"><dt>Monthly rent</dt><dd className="font-medium tabular-nums text-ink">5,000</dd></div><div className="flex justify-between gap-4"><dt>Electricity &amp; water</dt><dd className="font-medium tabular-nums text-ink">800</dd></div><div className="flex items-center justify-between gap-4 border-t border-line pt-4"><dt>Total this month</dt><dd className="text-2xl font-semibold tracking-tight text-brand-700">5,800<span className="text-sm text-muted">.00</span></dd></div></dl>
            <p className="mt-3 text-[10px] text-muted">Illustrative amounts in sample currency units.</p>
          </div>
          <div className="relative mx-auto mt-5 flex w-fit rotate-2 items-center gap-3 rounded-xl bg-brand-50 px-4 py-3 text-[11px] text-brand-700"><span aria-hidden="true" className="grid size-7 shrink-0 place-items-center rounded-full bg-emerald-100 text-emerald-800">✓</span><div>One less thing to keep track of.<p className="mt-1 text-[10px] text-muted">More room for everyday life.</p></div></div>
        </div>
      </section>
      <div className={wrap}><div className="flex flex-wrap items-center justify-between gap-5 border-y border-line py-6 text-xs text-muted"><span className="text-[9px] font-semibold tracking-[.15em]">THOUGHTFULLY SIMPLE</span>{['Your own rental records', 'Familiar sign-in', 'Made for your phone'].map(text => <p key={text}><span aria-hidden="true" className="mr-2 text-brand-500">✓</span>{text}</p>)}</div></div>
      <section id="features" className={`${wrap} scroll-mt-6 py-16 sm:py-24`}>
        <div className="flex flex-wrap items-center justify-between gap-5"><div><p className={eyebrow}>LESS KEEPING TRACK</p><h2 className={heading}>A little clarity.<br />A lot more comfort.</h2></div><p className="text-sm leading-7 text-muted">No scattered notes or guessing what’s due.<br />Your rental essentials have a home, too.</p></div>
        <div className="mt-10 grid gap-10 md:grid-cols-3">{features.map(feature => <article key={feature.title}><span aria-hidden="true" className="grid size-12 place-items-center rounded-2xl bg-brand-50 text-2xl text-brand-500">{feature.symbol}</span><h3 className="mt-5 text-lg font-semibold">{feature.title}</h3><p className="mt-3 text-sm leading-7 text-muted">{feature.text}</p><p className="mt-6 border-t border-line pt-4 text-xs text-muted">{feature.detail}</p></article>)}</div>
      </section>
      <section id="how-it-works" className="scroll-mt-6 border-y border-line bg-canvas py-16 sm:py-20"><div className={`${wrap} grid gap-10 md:grid-cols-2 md:gap-20`}><div><p className={eyebrow}>SETTLE IN SIMPLY</p><h2 className={heading}>A familiar sign-in.<br />A space that’s yours.</h2><p className="mt-5 text-sm leading-7 text-muted">A look at how the full portal will work.<br />For now, explore the forms with sample details.</p><button type="button" onClick={onOpenPortal} className="mt-6 text-sm font-semibold text-brand-700 hover:underline">Try the demo <span aria-hidden="true">→</span></button><svg aria-hidden="true" viewBox="0 0 180 100" fill="none" className="mt-6 hidden w-36 md:block"><circle cx="57" cy="45" r="27" stroke="#9BAAEB" strokeWidth="13" /><path d="m79 61 49 30 12-18M112 81l10-17" stroke="#9BAAEB" strokeWidth="13" strokeLinejoin="round" /><circle cx="57" cy="45" r="7" fill="#CAD3FF" /><path d="M133 24h22M144 13v22" stroke="#BCC7F3" strokeWidth="3" /></svg></div><ol className="divide-y divide-line">{steps.map(([title, text], i) => <li key={title} className="flex gap-5 py-6 first:pt-0"><span className="grid size-10 shrink-0 place-items-center rounded-full border border-brand-200 text-xs text-brand-700">0{i + 1}</span><div><h3 className="text-base font-semibold">{title}</h3><p className="mt-3 text-sm leading-7 text-muted">{text}</p></div></li>)}</ol></div></section>
      <section id="questions" className={`${wrap} grid scroll-mt-6 gap-10 py-16 sm:py-24 md:grid-cols-[.9fr_1.1fr] md:gap-20`}><div><p className={eyebrow}>A FEW HELPFUL ANSWERS</p><h2 className={heading}>Before you<br className="hidden md:block" /> settle in.</h2><p className="mt-5 text-sm text-muted">A little reassurance goes a long way.</p></div><div>{questions.map(([question, answer], i) => <details key={question} open={i === 0} className="group border-b border-line py-5 first:pt-0"><summary className="flex min-h-7 cursor-pointer list-none items-start justify-between gap-5 text-sm leading-6 font-semibold [&::-webkit-details-marker]:hidden">{question}<span aria-hidden="true" className="text-xl font-normal text-brand-500 group-open:hidden">+</span><span aria-hidden="true" className="hidden text-xl font-normal text-brand-500 group-open:inline">−</span></summary><p className="mt-3 pr-6 text-sm leading-7 text-muted">{answer}</p></details>)}</div></section>
      <div className={wrap}><section className="relative isolate flex flex-wrap items-center justify-between gap-8 overflow-hidden rounded-2xl bg-brand-700 p-8 text-white sm:p-12"><div><p className="text-[9px] font-semibold tracking-[.16em] text-indigo-100">YOUR RENTAL ESSENTIALS, TOGETHER</p><h2 className={`${heading} sm:text-3xl`}>A little more organized.<br />A lot more at home.</h2><p className="mt-4 text-sm text-indigo-100">Your portal is a good place to start.</p></div><button type="button" onClick={onOpenPortal} className="button-secondary border-white text-brand-700">Explore Roomly <span aria-hidden="true" className="ml-3">→</span></button><span aria-hidden="true" className="absolute right-1/4 -bottom-20 -z-10 text-[240px] text-white/5">⌂</span></section></div>
    </main>
    <footer className={`${wrap} pt-12 pb-7`}><div className="flex flex-wrap items-center justify-between gap-7"><div><a href="#main" aria-label="Roomly home"><Brand /></a><p className="mt-3 text-xs text-muted">Two rooms. One simple place.</p></div><nav aria-label="Footer navigation" className="flex gap-7 text-xs text-muted"><a href="#features" className="hover:underline">Why Roomly</a><a href="#questions" className="hover:underline">FAQs</a><button type="button" onClick={() => privacy.current?.showModal()} className="hover:underline">Privacy</button></nav></div><p className="mt-8 border-t border-line pt-5 text-[10px] tracking-wide text-muted">Roomly · Frontend demo · Sample data only</p></footer>
    <dialog ref={privacy} aria-labelledby="privacy-title" aria-describedby="privacy-description" className="fixed inset-0 m-auto w-[calc(100%-2.5rem)] max-w-lg rounded-2xl border border-line bg-white p-8 text-ink shadow-2xl backdrop:bg-ink/40 backdrop:backdrop-blur-sm" onClick={event => { if (event.target === event.currentTarget) { const bounds = event.currentTarget.getBoundingClientRect(); if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) privacy.current?.close() } }}><p className={eyebrow}>YOUR INFORMATION</p><h2 id="privacy-title" className="mt-4 text-2xl font-semibold">Your details deserve care.</h2><div id="privacy-description" className="mt-4 space-y-4 text-sm leading-7 text-muted"><p>This demo uses sample information. Forms validate in your browser and do not send your details to a server or store them after a refresh. Google and Facebook sign-in are not connected.</p><p>Please use fictional details. Before a live launch, Roomly will need a full privacy notice covering landlord access, retention, and deletion.</p></div><form method="dialog" className="mt-6"><button className="button-primary">Got it</button></form></dialog>
  </div>
}
