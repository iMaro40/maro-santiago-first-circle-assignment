// manual mock for uuid package because I was running into some ESM issues with this package with Jest
// Manually create some unique ID's for testing purposes
let counter = 0
export function v4(): string {
  return String(counter++)
}
