import { BankAccount } from './model'

export type CreateBankAccountRequestData = Omit<BankAccount, 'id' | 'balance'>

export type BankAccountActionRequestData = CreateBankAccountRequestData
