export const isValidPositiveInteger = (value: unknown): value is number => {
  if (typeof value !== 'number') return false
  if (!Number.isFinite(value)) return false
  if (!Number.isInteger(value)) return false
  if (value <= 0) return false

  return true
}
