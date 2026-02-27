export const validateNumberIfPositiveDecimal = (num: number) => {
  const positiveDecimallWith2PlacesRegEx = /^(?!0+(\.0{1,2})?$)\d+(\.\d{1,2})?$/

  return positiveDecimallWith2PlacesRegEx.test(String(num))
}
