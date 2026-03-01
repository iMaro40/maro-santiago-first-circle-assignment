import { BankAccount } from './model'

export type CreateBankAccountRequestData = Omit<BankAccount, 'id' | 'balance'>
export interface DepositRequestData {
  bankAccountId: string
  amount: number // We will accept positive integers here. We will treat 10050 for example as $100.50 since that's how we store it.
}

export interface WithdrawRequestData {
  bankAccountId: string
  amount: number // We will accept positive integers here. We will treat 10050 for example as $100.50 since that's how we store it.
}

export interface BankTransferRequestData {
  fromBankAccountId: string
  toBankAccountId: string
  amount: number // We will accept positive integers here. We will treat 10050 for example as $100.50 since that's how we store it.
}
