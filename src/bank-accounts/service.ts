import { UserAccountService } from '../user-accounts/service'
import { CreateBankAccountRequestData, WithdrawRequestData } from './dto'
import { BankAccount } from './model'
import { BankAccountRepository } from './repository'

export class BankAccountService {
  constructor(
    private bankAccountRepository: BankAccountRepository,
    private userAccountService: UserAccountService,
  ) {}

  private validateCreateAccountRequestData(data: CreateBankAccountRequestData) {
    const userExists = this.userAccountService.findUserById(data.userId)
    if (!userExists) throw new Error('User not found')
  }
  createBankAccount(data: CreateBankAccountRequestData): BankAccount {
    try {
      this.validateCreateAccountRequestData(data)

      const createdBankAccount = this.bankAccountRepository.save(data)

      return createdBankAccount
    } catch (e) {
      console.error('Error creating bank account', data, e)

      throw e
    }
  }

  private validateWithdrawRequestData({
    amount,
    bankAccountId,
  }: WithdrawRequestData): BankAccount {
    const decimalWith2PlacesRegEx = /^\d+(\.\d{1,2})?$/
    if (!decimalWith2PlacesRegEx.test(String(amount)))
      throw new Error('Amount must be valid number with at most 2 decimals')

    const bankAccount =
      this.bankAccountRepository.findBankAccountById(bankAccountId)
    if (!bankAccount) throw new Error('Bank account does not exist')

    const isAmountToWithdrawValid = amount <= bankAccount.balance
    if (!isAmountToWithdrawValid) throw new Error('Invalid amount')

    return bankAccount
  }
  withdraw(data: WithdrawRequestData) {
    try {
      console.log('Received withdraw request', data)

      const bankAccount = this.validateWithdrawRequestData(data)

      console.log('Executing withdraw request', data)

      const newBalance = bankAccount.balance - data.amount
      const updatedBankAccount = { ...bankAccount, balance: newBalance }

      this.bankAccountRepository.update(updatedBankAccount)

      // NOTE: Writing withdraw/deposit/transfer actions to a ledger is out of scope for this assignment
    } catch (e) {
      console.error('Error performing withdraw', data, e)

      throw e
    }
  }

  deposit() {}
  transfer() {}
  getBalanceOfAccount() {}
}
