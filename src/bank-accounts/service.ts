import { UserAccountService } from '../user-accounts/service'
import {
  CreateBankAccountRequestData,
  DepositRequestData,
  WithdrawRequestData,
} from './dto'
import { validateNumberIfDecimal } from './helpers'
import { BankAccount } from './model'
import { BankAccountRepository } from './repository'

// NOTE: No try/catch in the service methods and just let errors bubble up because I assume errors will be handled in an upper layer
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
    this.validateCreateAccountRequestData(data)

    const createdBankAccount = this.bankAccountRepository.save(data)

    return createdBankAccount
  }

  private getAndValidateBankAccountById(bankAccountId: string): BankAccount {
    const bankAccount =
      this.bankAccountRepository.findBankAccountById(bankAccountId)
    if (!bankAccount) throw new Error('Bank account does not exist')

    return bankAccount
  }

  // NOTE: Checking the permissions/authorization of the user requesting the deposit/withdrawal/transfer is out of scope for the assignment
  private validateDepositRequestData({
    amount,
    bankAccountId,
  }: DepositRequestData) {
    const isAmountValid = validateNumberIfDecimal(amount)
    if (!isAmountValid)
      throw new Error('Amount must be valid number with at most 2 decimals')

    const bankAccount = this.getAndValidateBankAccountById(bankAccountId)

    return bankAccount
  }
  deposit(data: DepositRequestData) {
    const bankAccount = this.validateDepositRequestData(data)

    // NOTE: explain how in production this simple implementation is gonna need some help
    // Runs into concurrency problems
    // Needs transactions/DB locking
    const newBalance = bankAccount.balance + data.amount
    const updatedBankAccount = { ...bankAccount, balance: newBalance }

    this.bankAccountRepository.update(updatedBankAccount)

    // NOTE: Persisting the deposit/withdraw/transfer actions to some ledger is out of scope for the assignment
    // NOTE: Usually some notification system is used to alert users of successful deposits/withdrawals/transfers
  }

  private validateWithdrawRequestData({
    amount,
    bankAccountId,
  }: WithdrawRequestData): BankAccount {
    const isAmountValid = validateNumberIfDecimal(amount)
    if (!isAmountValid)
      throw new Error('Amount must be valid number with at most 2 decimals')

    const bankAccount = this.getAndValidateBankAccountById(bankAccountId)

    const isAmountToWithdrawValid = amount <= bankAccount.balance
    if (!isAmountToWithdrawValid) throw new Error('Invalid amount')

    return bankAccount
  }

  withdraw(data: WithdrawRequestData) {
    const bankAccount = this.validateWithdrawRequestData(data)

    const newBalance = bankAccount.balance - data.amount
    const updatedBankAccount = { ...bankAccount, balance: newBalance }

    this.bankAccountRepository.update(updatedBankAccount)
  }

  getBalanceOfAccount(bankAccountId: string) {
    const bankAccount = this.getAndValidateBankAccountById(bankAccountId)

    const response = {
      id: bankAccount.id,
      balance: bankAccount.balance,
    }

    return response
  }

  transfer() {}
}
