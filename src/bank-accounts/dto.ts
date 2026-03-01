export type Money = number // We will treat this as a positive integer representing the amount in cents. For example, $100.50 would be represented as 10050.

export type CreateBankAccountRequestData = {
  userId: string
  initialBalance?: Money // a.k.a. Initial deposit
}
export interface DepositRequestData {
  bankAccountId: string
  amount: Money
}

export interface WithdrawRequestData {
  bankAccountId: string
  amount: Money
}

export interface BankTransferRequestData {
  fromBankAccountId: string
  toBankAccountId: string
  amount: Money
}
