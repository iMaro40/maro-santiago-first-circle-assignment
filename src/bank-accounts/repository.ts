import { CreateBankAccountRequestData } from './dto'
import { BankAccount } from './model'
import { v4 as uuidv4 } from 'uuid'

export class BankAccountRepository {
  private bankAccountsById: Record<string, BankAccount> = {}

  save({ userId }: CreateBankAccountRequestData) {
    // Generating bankAccountId in repository level to simulate database PK
    const bankAccountId = uuidv4()

    const initialBalance = 0
    const bankAccount: BankAccount = {
      id: bankAccountId,
      userId,
      balance: initialBalance,
    }

    this.bankAccountsById[bankAccountId] = bankAccount
  }
}
