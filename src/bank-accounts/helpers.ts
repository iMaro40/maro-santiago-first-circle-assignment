import { Money } from './dto'

// The "Money" type is a positive integer representing the amount in cents. For example, $100.50 would be represented as 10050.
export const isValidPositiveInteger = (value: unknown): value is Money => {
  if (typeof value !== 'number') return false
  if (!Number.isFinite(value)) return false
  if (!Number.isInteger(value)) return false
  if (value <= 0) return false

  return true
}
