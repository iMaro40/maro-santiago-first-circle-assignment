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

  createUserAccount(data: CreateUserAccountRequestData) {
    this.validateCreateAccountRequest(data)

    this.userAccountRepository.save(data)
  }

  findUserById(userId: string): UserAccount {
    const user = this.userAccountRepository.findAccountById(userId)

    if (!user) throw new Error('User does not exist')

    return user
  }
}
