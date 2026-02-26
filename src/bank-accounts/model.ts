export interface BankAccount {
  id: string
  userId: string // Foreign Key for a UserAccount
  balance: number // Stored in smallest currency unit (e.g. cents). e.g. 10050 represents $100.50
}
