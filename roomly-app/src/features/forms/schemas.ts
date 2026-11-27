import { z } from 'zod'

const name = z.string().trim().min(2, 'Enter at least 2 characters.').max(100, 'Use 100 characters or fewer.')
const phone = z.string().trim().regex(/^\+?[\d ()-]+$/, 'Enter a valid phone number.').refine(value => {
  const digits = value.replace(/\D/g, '').length
  return digits >= 7 && digits <= 15
}, 'Enter a phone number with 7 to 15 digits.')

export const profileSchema = z.object({
  fullName: name,
  preferredName: z.string().trim().max(100, 'Use 100 characters or fewer.'),
  email: z.string().trim().max(254, 'Use 254 characters or fewer.').pipe(z.email('Enter a valid email address.')),
  phone,
  emergencyName: name,
  relationship: name,
  emergencyPhone: phone,
})
export type ProfileValues = z.infer<typeof profileSchema>

// Check decimal format before converting to integer minor units for arithmetic.
export const amountSchema = z.string().trim().regex(/^\d{1,7}(\.\d{1,2})?$/, 'Enter an amount with up to 2 decimal places.').refine(value => {
  const [whole, fraction = ''] = value.split('.')
  return Number(whole) * 100 + Number(fraction.padEnd(2, '0')) > 0
}, 'Amount must be greater than zero.')
export function toMinorUnits(value: string) {
  const parsed = amountSchema.parse(value)
  const [whole, fraction = ''] = parsed.split('.')
  return Number(whole) * 100 + Number(fraction.padEnd(2, '0'))
}
export function localDate(date = new Date()) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}
const dateSchema = z.iso.date('Enter a valid date.')
export const paymentSchema = z.object({
  bill: z.enum(['room-1-2026-11', 'room-1-2026-10'], { error: 'Choose a bill.' }),
  amount: amountSchema,
  paymentDate: dateSchema.refine(value => value <= localDate(), 'Payment date cannot be in the future.'),
  method: z.enum(['bank', 'wallet', 'cash'], { error: 'Choose a payment method.' }),
  reference: z.string().trim().max(100, 'Use 100 characters or fewer.'),
  note: z.string().trim().max(500, 'Use 500 characters or fewer.'),
}).superRefine((value, context) => {
  if (value.method !== 'cash' && value.reference.length < 3) {
    context.addIssue({ code: 'custom', path: ['reference'], message: 'Enter a transfer reference with at least 3 characters.' })
  }
})
export type PaymentValues = z.infer<typeof paymentSchema>
export const roomSchema = z.object({
  room: z.enum(['room-1', 'room-2']),
  monthlyRent: amountSchema,
  dueDay: z.string().regex(/^(?:[1-9]|1\d|2[0-8])$/, 'Choose a due day between 1 and 28.'),
  effectiveDate: dateSchema,
  electricityRate: amountSchema,
  waterRate: amountSchema,
})
export type RoomValues = z.infer<typeof roomSchema>
