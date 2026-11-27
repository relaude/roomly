import { describe, expect, it } from 'vitest'
import { amountSchema, paymentSchema, profileSchema, roomSchema, toMinorUnits } from './schemas'

const payment = { bill: 'room-1-2026-11', amount: '2800', paymentDate: '2026-01-01', method: 'bank', reference: 'TRANSFER-123', note: '' }
describe('Payment validation', () => {
  it.each(['0', '-5', '1.001', '1e3', 'Infinity', '', '  ', '10000000', '1,000'])('rejects unsafe amount %s', value => {
    expect(amountSchema.safeParse(value).success).toBe(false)
  })
  it('converts currency without floating point drift', () => {
    expect(toMinorUnits('0.29')).toBe(29)
    expect(toMinorUnits('12.1')).toBe(1210)
    expect(() => toMinorUnits('-1')).toThrow()
  })
  it('requires a reference for transfers but permits cash without one', () => {
    expect(paymentSchema.safeParse({ ...payment, reference: '' }).success).toBe(false)
    expect(paymentSchema.safeParse({ ...payment, method: 'cash', reference: '' }).success).toBe(true)
  })
  it('rejects future or invalid calendar dates and unknown bills', () => {
    expect(paymentSchema.safeParse({ ...payment, paymentDate: '2999-01-01' }).success).toBe(false)
    expect(paymentSchema.safeParse({ ...payment, paymentDate: '2026-02-30' }).success).toBe(false)
    expect(paymentSchema.safeParse({ ...payment, bill: 'unknown' }).success).toBe(false)
  })
})
describe('Profile validation', () => {
  const profile = { fullName: ' Alex Morgan ', preferredName: '', email: 'alex@example.com', phone: '+63 917 555 0101', emergencyName: 'Jamie Morgan', relationship: 'Sibling', emergencyPhone: '+63 917 555 0102' }
  it('trims names and permits an optional preferred name', () => {
    expect(profileSchema.parse(profile).fullName).toBe('Alex Morgan')
  })
  it('rejects empty emergency contacts, invalid emails, and short phone numbers', () => {
    expect(profileSchema.safeParse({ ...profile, emergencyName: ' ' }).success).toBe(false)
    expect(profileSchema.safeParse({ ...profile, email: 'alex@' }).success).toBe(false)
    expect(profileSchema.safeParse({ ...profile, phone: '123' }).success).toBe(false)
  })
})
describe('Room validation', () => {
  it('restricts due days to days available every month', () => {
    const room = { room: 'room-1', monthlyRent: '5000', dueDay: '28', effectiveDate: '2026-11-27', electricityRate: '12', waterRate: '25' }
    expect(roomSchema.safeParse(room).success).toBe(true)
    for (const dueDay of ['0', '29', '31', '1.5']) expect(roomSchema.safeParse({ ...room, dueDay }).success).toBe(false)
  })
})
