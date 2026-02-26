import { BankAccount } from './model'

export type CreateBankAccountRequestData = Omit<BankAccount, 'id' | 'balance'>
export interface DepositRequestData {
  bankAccountId: string
  amount: number // Assumes requests coming in are decimals with max. 2 decimal places.
}

export interface WithdrawRequestData {
  bankAccountId: string
  amount: number // Assumes requests coming in are decimals with max. 2 decimal places.
}
