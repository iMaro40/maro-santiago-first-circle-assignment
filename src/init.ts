import { BankAccountRepository } from './bank-accounts/repository'
import { BankAccountService } from './bank-accounts/service'
import { UserAccountRepository } from './user-accounts/repository'
import { UserAccountService } from './user-accounts/service'

const userAccountRepository = new UserAccountRepository()
export const userAccountService = new UserAccountService(userAccountRepository)

const bankAccountRepository = new BankAccountRepository()
export const bankAccountService = new BankAccountService(
  bankAccountRepository,
  userAccountService,
)
