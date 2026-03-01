export interface BankAccount {
  id: string
  userId: string // Foreign Key for a UserAccount
  balance: number // Here, we store 10050 -> represents $100.50 to avoid floating point imprecision.
}
