import { CreateBankAccountRequestData } from './dto'
import { BankAccount } from './model'
import { v4 as uuidv4 } from 'uuid'

export class BankAccountRepository {
  private bankAccountsById: Record<string, BankAccount> = {}

  save({ userId }: CreateBankAccountRequestData): BankAccount {
    // Generating bankAccountId in repository level to simulate database PK
    const bankAccountId = uuidv4()

    const initialBalance = 0
    const bankAccount: BankAccount = {
      id: bankAccountId,
      userId,
      balance: initialBalance,
    }

    this.bankAccountsById[bankAccountId] = bankAccount

    return bankAccount
  }

  // Simply update the whole object for simplicity in this assignment.
  // Production systems would support partial updates which is more appropriate since we only update "balance" for withdrawals/deposits/transfers
  update(bankAccount: BankAccount) {
    this.bankAccountsById[bankAccount.id] = bankAccount

    return bankAccount
  }

  findBankAccountById(bankAccountId: string) {
    const bankAccount = this.bankAccountsById[bankAccountId]

    return bankAccount
  }
}
