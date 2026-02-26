import { UserAccountService } from '../user-accounts/service'
import {
  BankAccountActionRequestData,
  CreateBankAccountRequestData,
} from './dto'
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
  private executeCreateAccount(data: CreateBankAccountRequestData) {
    this.bankAccountRepository.save(data)
  }
  createAccount(data: CreateBankAccountRequestData) {
    this.runBankAccountAction<BankAccount>(
      'CREATE_ACCOUNT',
      (d) => this.validateCreateAccountRequestData(d),
      (d) => this.executeCreateAccount(d),
      data,
    )
  }

  deposit() {}
  withdraw() {}
  transfer() {}
  getBalanceOfAccount() {}

  // Shared workflow wrapper for banking actions.
  // Handles validation, execution, and error logging.
  private runBankAccountAction<T>(
    actionName: string,
    validator: (data: BankAccountActionRequestData) => void,
    fn: (data: BankAccountActionRequestData) => any,
    data: BankAccountActionRequestData,
  ): T {
    try {
      console.log('Executing bank account action', actionName, data)

      validator(data)

      return fn(data)

      // NOTE: Ledger persistence is out of scope for this assignment. Deposit/withdraw/transfer actions will need to be written into some ledger or similar.
    } catch (e) {
      console.log('Error executing bank account action', actionName, data, e)

      throw e
    }
  }
}
