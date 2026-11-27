import { useState } from 'react'
import { useForm, useWatch, type FieldPath, type FieldValues, type UseFormReturn } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Field, FormActions, FormFeedback, Section } from '../../components/ui'
import { localDate, paymentSchema, profileSchema, roomSchema, toMinorUnits, type PaymentValues, type ProfileValues, type RoomValues } from './schemas'

type FormField<T extends FieldValues> = {
  name: FieldPath<T>; label: string; hint?: string; required?: boolean
  type?: 'text' | 'email' | 'tel' | 'date' | 'textarea'
  autoComplete?: string; inputMode?: 'decimal' | 'numeric'; maxLength?: number
  options?: { value: string; label: string }[]
}
type FormSection<T extends FieldValues> = { title: string; description: string; fields: FormField<T>[] }

function DemoForm<T extends FieldValues>({ form, sections, action, successMessage }: {
  form: UseFormReturn<T>; sections: FormSection<T>[]; action: string
  successMessage: (values: T) => string
}) {
  const [success, setSuccess] = useState('')
  const { register, handleSubmit, reset, formState, getFieldState } = form
  return <form noValidate data-dirty={formState.isDirty} onChange={() => setSuccess('')} onSubmit={handleSubmit(values => {
    setSuccess(successMessage(values))
    reset(values)
  }, () => setSuccess(''))}>
    <FormFeedback success={success} invalid={formState.isSubmitted && !formState.isSubmitSuccessful && Object.keys(formState.errors).length > 0} />
    <p className="mb-6 text-xs text-muted">Fields marked <span aria-hidden="true">*</span><span className="sr-only">with an asterisk</span> are required.</p>
    <div className="space-y-7">{sections.map(section => <Section key={section.title} title={section.title} description={section.description}>
      {section.fields.map(field => <div key={field.name} className={field.type === 'textarea' ? 'sm:col-span-2' : ''}>
        <Field label={field.label} hint={field.hint} required={field.required} error={getFieldState(field.name, formState).error?.message}>
          {control => field.options ? <select {...control} {...register(field.name)} className="field-input" required={field.required}>
            {field.options.map(option => <option key={option.value} value={option.value}>{option.label}</option>)}
          </select> : field.type === 'textarea' ? <textarea {...control} {...register(field.name)} className="field-input min-h-28 resize-y" rows={3} maxLength={field.maxLength} required={field.required} /> :
            <input {...control} {...register(field.name)} className="field-input" type={field.type ?? 'text'} autoComplete={field.autoComplete ?? 'off'} inputMode={field.inputMode} maxLength={field.maxLength} required={field.required} />}
        </Field>
      </div>)}
    </Section>)}</div>
    <FormActions dirty={formState.isDirty} submitting={formState.isSubmitting} label={action} onReset={() => { reset(); setSuccess('') }} />
  </form>
}

const profileDefaults: ProfileValues = {
  fullName: 'Alex Morgan', preferredName: 'Alex', email: 'alex@example.com', phone: '+63 917 555 0101',
  emergencyName: '', relationship: '', emergencyPhone: '',
}
export function ProfileForm() {
  const form = useForm<ProfileValues>({ resolver: zodResolver(profileSchema), defaultValues: profileDefaults, mode: 'onBlur' })
  return <DemoForm form={form} action="Save demo profile" successMessage={() => 'Profile validated for this demo session. No data was sent to a server.'} sections={[
    { title: 'Personal information', description: 'Keep your contact details up to date so your landlord can reach you.', fields: [
      { name: 'fullName', label: 'Full name', required: true, autoComplete: 'name', maxLength: 100 },
      { name: 'preferredName', label: 'Preferred name', hint: 'Optional. What would you like us to call you?', autoComplete: 'nickname', maxLength: 100 },
      { name: 'email', label: 'Contact email', required: true, type: 'email', autoComplete: 'email', hint: 'Changing this does not change your sign-in account.' },
      { name: 'phone', label: 'Mobile number', required: true, type: 'tel', autoComplete: 'tel', hint: 'Include your country code, for example +63.' },
    ] },
    { title: 'Emergency contact', description: 'Someone we can contact if you need help. Please ask for their permission first.', fields: [
      { name: 'emergencyName', label: 'Contact name', required: true, autoComplete: 'section-emergency name', maxLength: 100 },
      { name: 'relationship', label: 'Relationship', required: true, hint: 'For example, parent, sibling, or friend.', maxLength: 100 },
      { name: 'emergencyPhone', label: 'Contact number', required: true, type: 'tel', autoComplete: 'section-emergency tel' },
    ] },
  ]} />
}

export function PaymentForm() {
  const form = useForm<PaymentValues>({ resolver: zodResolver(paymentSchema), mode: 'onBlur', defaultValues: {
    bill: 'room-1-2026-11', amount: '', paymentDate: localDate(), method: 'bank', reference: '', note: '',
  } })
  const method = useWatch({ control: form.control, name: 'method' })
  return <>
    <div className="mb-7 rounded-xl border border-brand-100 bg-brand-50 p-4 text-sm leading-relaxed text-brand-700"><strong>Submitting a payment does not reduce your balance.</strong> Your landlord must verify that the funds were received. Amounts shown here use sample currency units.</div>
    <DemoForm form={form} action="Submit demo payment" successMessage={values => `Demo payment of ${(toMinorUnits(values.amount) / 100).toLocaleString('en', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} sample units validated. Pending landlord verification in this session only; your balance is unchanged.`} sections={[
      { title: 'Payment details', description: 'Record a payment you have already made. Partial payments are welcome.', fields: [
        { name: 'bill', label: 'Bill to pay', required: true, options: [{ value: 'room-1-2026-11', label: 'Room 1 · November 2026' }, { value: 'room-1-2026-10', label: 'Room 1 · October 2026' }] },
        { name: 'amount', label: 'Amount paid', required: true, inputMode: 'decimal', hint: 'Sample currency units. Up to 2 decimal places.' },
        { name: 'paymentDate', label: 'Payment date', required: true, type: 'date', hint: 'Use the date on your receipt. Future dates are not accepted.' },
        { name: 'method', label: 'Payment method', required: true, options: [{ value: 'bank', label: 'Bank transfer' }, { value: 'wallet', label: 'Mobile wallet' }, { value: 'cash', label: 'Cash' }] },
        { name: 'reference', label: 'Payment reference', required: method !== 'cash', hint: method === 'cash' ? 'Optional for cash payments.' : 'Enter the reference from your transfer receipt.', maxLength: 100 },
        { name: 'note', label: 'Note to landlord', type: 'textarea', hint: 'Optional. Up to 500 characters. Do not include account passwords.', maxLength: 500 },
      ] },
    ]} />
  </>
}

export function RoomForm() {
  const form = useForm<RoomValues>({ resolver: zodResolver(roomSchema), mode: 'onBlur', defaultValues: {
    room: 'room-1', monthlyRent: '5000', dueDay: '28', effectiveDate: localDate(), electricityRate: '12', waterRate: '25',
  } })
  return <>
    <div className="mb-7 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm leading-relaxed text-amber-900"><strong>Landlord settings preview.</strong> These rates apply to future bills. Issued bills and payment history stay unchanged.</div>
    <DemoForm form={form} action="Save demo settings" successMessage={() => 'Room settings validated for this demo session. Existing bills have not been recalculated.'} sections={[
      { title: 'Room and rent', description: 'Set the monthly rent and when new rates take effect.', fields: [
        { name: 'room', label: 'Room', required: true, options: [{ value: 'room-1', label: 'Room 1' }, { value: 'room-2', label: 'Room 2' }] },
        { name: 'monthlyRent', label: 'Monthly rent', required: true, inputMode: 'decimal', hint: 'Sample currency units.' },
        { name: 'dueDay', label: 'Payment due day', required: true, options: Array.from({ length: 28 }, (_, index) => ({ value: String(index + 1), label: `Day ${index + 1} of each month` })), hint: 'Days 1–28 are available in every month.' },
        { name: 'effectiveDate', label: 'Effective from', required: true, type: 'date' },
      ] },
      { title: 'Metered utility rates', description: 'For individually metered usage. Shared bill allocation will be configured separately.', fields: [
        { name: 'electricityRate', label: 'Electricity per kWh', required: true, inputMode: 'decimal', hint: 'Sample currency units per kilowatt-hour.' },
        { name: 'waterRate', label: 'Water per cubic meter', required: true, inputMode: 'decimal', hint: 'Sample currency units per cubic meter.' },
      ] },
    ]} />
  </>
}
