import { UserAccountService } from '../user-accounts/service'
import {
  CreateBankAccountRequestData,
  DepositRequestData,
  WithdrawRequestData,
} from './dto'
import { validateNumberIfPositiveDecimal } from './helpers'
import { BankAccount } from './model'
import { BankAccountRepository } from './repository'

// NOTE: No try/catch in the methods here just to make my submission less verbose. In production, what we can do is let service errors just bubble up like this, and then handle the errors in an upper, more centralized layer.
// In production, important considerations for retries would be:
// 1. Idempotency: ensure retrying operations will not cause unintended duplications
// 2. Ordered retries: ensure that retries are processed in the correct order, especially for operations that depend on each other (e.g., a withdrawal after a deposit)
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

  // NOTE: Checking the permissions/authorization of the user requesting the deposit/withdrawal/transfer is out of scope for my submission.
  private validateDepositRequestData({
    amount,
    bankAccountId,
  }: DepositRequestData) {
    const isAmountValid = validateNumberIfPositiveDecimal(amount)
    if (!isAmountValid)
      throw new Error('Amount must be valid number with at most 2 decimals')

    const bankAccount = this.getAndValidateBankAccountById(bankAccountId)

    return bankAccount
  }

  deposit(data: DepositRequestData) {
    const bankAccount = this.validateDepositRequestData(data)

    // NOTE: This is a simple, straightforward implementation for my submission, but in production this would most likely run into concurrency issues.
    // This does not safely handle concurrent deposits happening at the same time for the same bank account.
    // In production, this would likely be handled by a database transaction with proper isolation level, or by using some locking mechanism.
    const newBalance = bankAccount.balance + data.amount
    const updatedBankAccount = { ...bankAccount, balance: newBalance }

    this.bankAccountRepository.update(updatedBankAccount)
  }

  private validateWithdrawRequestData({
    amount,
    bankAccountId,
  }: WithdrawRequestData): BankAccount {
    const isAmountValid = validateNumberIfPositiveDecimal(amount)
    if (!isAmountValid)
      throw new Error('Amount must be valid number with at most 2 decimals')

    const bankAccount = this.getAndValidateBankAccountById(bankAccountId)

    const isAmountToWithdrawValid = amount <= bankAccount.balance
    if (!isAmountToWithdrawValid) throw new Error('Invalid amount')

    return bankAccount
  }

  withdraw(data: WithdrawRequestData) {
    const bankAccount = this.validateWithdrawRequestData(data)

    // NOTE: Runs into the same concurrency issues as the deposit method in production
    // Additionally, we probably need some locking mechanism again to ensure that withdrawals are checking the most up-to-date balance.
    const newBalance = bankAccount.balance - data.amount
    const updatedBankAccount = { ...bankAccount, balance: newBalance }

    this.bankAccountRepository.update(updatedBankAccount)
  }

  getBalanceOfAccount(bankAccountId: string) {
    const bankAccount = this.getAndValidateBankAccountById(bankAccountId)

    // NOTE: In production, might run into read-after-write issues but that really just depends on the whole setup (e.g. caching?  read replicas?)
    const response = {
      id: bankAccount.id,
      balance: bankAccount.balance,
    }

    return response
  }

  transfer() {}
}
