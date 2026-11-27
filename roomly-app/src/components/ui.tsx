import { useId, type ButtonHTMLAttributes, type ReactNode } from 'react'

export function Button({ variant = 'primary', className = '', ...props }: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' }) {
  return <button type="button" className={`${variant === 'primary' ? 'button-primary' : 'button-secondary'} ${className}`} {...props} />
}

type FieldControl = { id: string; 'aria-invalid': boolean; 'aria-describedby': string | undefined }

export function Field({ label, hint, error, required, children }: {
  label: string; hint?: string; error?: string; required?: boolean
  children: (props: FieldControl) => ReactNode
}) {
  const id = useId()
  const describedBy = [hint ? `${id}-hint` : '', error ? `${id}-error` : ''].filter(Boolean).join(' ') || undefined
  return <div className="space-y-2">
    <label htmlFor={id} className="block text-sm font-semibold">{label}{required && <span className="ml-1 text-brand-700" aria-hidden="true">*</span>}</label>
    {children({ id, 'aria-invalid': Boolean(error), 'aria-describedby': describedBy })}
    {hint && <p id={`${id}-hint`} className="text-xs leading-relaxed text-muted">{hint}</p>}
    {error && <p id={`${id}-error`} className="text-sm text-red-700">{error}</p>}
  </div>
}

export function Section({ title, description, children }: { title: string; description: string; children: ReactNode }) {
  return <section className="border-b border-line pb-7 last:border-0 last:pb-0">
    <h3 className="text-base font-semibold">{title}</h3>
    <p className="mt-1 text-sm leading-relaxed text-muted">{description}</p>
    <div className="mt-5 grid gap-x-5 gap-y-6 sm:grid-cols-2">{children}</div>
  </section>
}

export function FormActions({ dirty, submitting, onReset, label }: { dirty: boolean; submitting: boolean; onReset: () => void; label: string }) {
  return <div className="mt-8 flex flex-col-reverse gap-3 border-t border-line pt-6 sm:flex-row sm:items-center sm:justify-between">
    <p className="text-xs text-muted">{dirty ? 'You have unsaved changes.' : 'Use sample details to try this form.'}</p>
    <div className="flex gap-3"><Button variant="secondary" onClick={onReset} disabled={submitting}>Reset</Button><Button type="submit" disabled={submitting}>{submitting ? 'Validating…' : label}</Button></div>
  </div>
}

export function FormFeedback({ success, invalid }: { success: string; invalid: boolean }) {
  return <>
    {invalid && <p role="alert" className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">Please check the highlighted fields. Your changes have not been saved.</p>}
    <p role="status" aria-live="polite" className={success ? 'mb-6 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900' : 'sr-only'}>{success}</p>
  </>
}
