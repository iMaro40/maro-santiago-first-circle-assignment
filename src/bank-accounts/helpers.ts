export const validateNumberIfDecimal = (num: number) => {
  const decimalWith2PlacesRegEx = /^\d+(\.\d{1,2})?$/

  return !decimalWith2PlacesRegEx.test(String(num))
}
