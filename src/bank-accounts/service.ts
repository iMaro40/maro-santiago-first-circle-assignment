import { UserAccountService } from '../user-accounts/service'
import {
  BankTransferRequestData,
  CreateBankAccountRequestData,
  DepositRequestData,
  Money,
  WithdrawRequestData,
} from './dto'
import { isValidPositiveInteger } from './helpers'
import { BankAccount } from './model'
import { BankAccountRepository } from './repository'

// NOTE: No try/catch in the methods here just to make my submission less verbose. In production, what we can do is let service errors just bubble up like this, and then handle the errors in some upper, centralized layer.
// Additionally, important considerations for retries in production would be:
// 1. Idempotency: ensure retries do not cause unintended duplications
// 2. Ordered retries: ensure that retries are processed in the correct order, especially for operations that depend on each other (e.g., a withdrawal after a deposit)
export class BankAccountService {
  constructor(
    private bankAccountRepository: BankAccountRepository,
    private userAccountService: UserAccountService,
  ) {}

  // NOTE: In production, we need to ensure there is clear documentation and communication on how we treat "amount" and "balance" to avoid confusion (i.e. we multiply by 100 to avoid floating point imprecision)
  private validateAmount(amount: Money): asserts amount is Money {
    const isAmountValid = isValidPositiveInteger(amount)

    if (!isAmountValid)
      throw new Error('Amount must be a valid positive integer')
  }

  private validateCreateAccountRequestData({
    userId,
    initialBalance,
  }: CreateBankAccountRequestData) {
    if (initialBalance != undefined) this.validateAmount(initialBalance)

    const userExists = this.userAccountService.findUserById(userId)
    if (!userExists) throw new Error('User not found')
  }

  // NOTE: Checking the permissions/authorization of the user requesting these actions is out of scope for my submission.
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

  private validateDepositRequestData({
    amount,
    bankAccountId,
  }: DepositRequestData) {
    this.validateAmount(amount)

    const bankAccount = this.getAndValidateBankAccountById(bankAccountId)

    return bankAccount
  }

  deposit(data: DepositRequestData) {
    const bankAccount = this.validateDepositRequestData(data)

    // NOTE: This is a simple, straightforward implementation for my submission, but in production this would most likely run into concurrency issues.
    // This does not safely handle concurrent deposits happening at the same time for the same bank account.
    // In production, this would likely be handled by a database transaction, or by using some lock.
    const newBalance = bankAccount.balance + data.amount
    const updatedBankAccount = { ...bankAccount, balance: newBalance }

    return this.bankAccountRepository.update(updatedBankAccount)
  }

  private validateWithdrawRequestData({
    amount,
    bankAccountId,
  }: WithdrawRequestData): BankAccount {
    this.validateAmount(amount)

    const bankAccount = this.getAndValidateBankAccountById(bankAccountId)

    const isAmountToWithdrawValid = amount <= bankAccount.balance
    if (!isAmountToWithdrawValid) throw new Error('Invalid amount')

    return bankAccount
  }

  withdraw(data: WithdrawRequestData) {
    // NOTE: In production, this will probably need to be wrapped in a transaction or use some lock to ensure that withdrawals are checking the most up-to-date balance.
    const bankAccount = this.validateWithdrawRequestData(data)

    // NOTE: Also runs into the same concurrency issues as the deposit method
    const newBalance = bankAccount.balance - data.amount
    const updatedBankAccount = { ...bankAccount, balance: newBalance }

    return this.bankAccountRepository.update(updatedBankAccount)
  }

  getBalanceOfAccount(bankAccountId: string) {
    const bankAccount = this.getAndValidateBankAccountById(bankAccountId)

    // NOTE: In production, might run into read-after-write issues but that really depends on what the whole setup is like (e.g. stale cache?  read replicas lag?)
    const response = {
      id: bankAccount.id,
      balance: bankAccount.balance,
    }

    return response
  }
  private validateBankTransferRequestData({
    fromBankAccountId,
    toBankAccountId,
    amount,
  }: BankTransferRequestData) {
    this.validateAmount(amount)

    const fromBankAccount =
      this.getAndValidateBankAccountById(fromBankAccountId)
    const toBankAccount = this.getAndValidateBankAccountById(toBankAccountId)

    if (fromBankAccountId === toBankAccountId)
      throw new Error('Cannot transfer to the same account')

    const isAmountToTransferValid = amount <= fromBankAccount.balance
    if (!isAmountToTransferValid) throw new Error('Invalid amount')

    return { fromBankAccount, toBankAccount }
  }

  transfer(data: BankTransferRequestData) {
    // NOTE: In production, this all needs to be wrapped in a transaction because we need this to be atomic

    const { fromBankAccount, toBankAccount } =
      this.validateBankTransferRequestData(data)

    const newFromBalance = fromBankAccount.balance - data.amount
    const updatedFromBankAccount = {
      ...fromBankAccount,
      balance: newFromBalance,
    }

    const newToBalance = toBankAccount.balance + data.amount
    const updatedToBankAccount = { ...toBankAccount, balance: newToBalance }

    // NOTE: This should be atomic. We would need need to use a transaction to make sure both accounts are updated together (or not at all in case of an error)
    this.bankAccountRepository.update(updatedFromBankAccount)
    this.bankAccountRepository.update(updatedToBankAccount)
  }
}
