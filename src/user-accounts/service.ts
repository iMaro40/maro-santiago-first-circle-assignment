import { CreateUserAccountRequestData } from './dto'
import { UserAccount } from './model'
import { UserAccountRepository } from './repository'

export class UserAccountService {
  constructor(private userAccountRepository: UserAccountRepository) {}

  private validateCreateAccountRequest(data: CreateUserAccountRequestData) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    const isEmailValid = emailRegex.test(data.email)

    if (!isEmailValid) throw new Error('Invalid email')

    const userAccountByEmail = this.userAccountRepository.findAccountByEmail(
      data.email,
    )
    if (userAccountByEmail) throw new Error('User with email exists')
  }

  createUserAccount(data: CreateUserAccountRequestData): UserAccount {
    this.validateCreateAccountRequest(data)

    return this.userAccountRepository.save(data)
  }

  findUserById(userId: string): UserAccount | undefined {
    const user = this.userAccountRepository.findAccountById(userId)

    return user
  }
}
