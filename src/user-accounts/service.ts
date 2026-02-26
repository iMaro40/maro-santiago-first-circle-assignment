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

  createAccount(data: CreateUserAccountRequestData) {
    try {
      this.validateCreateAccountRequest(data)

      this.userAccountRepository.save(data)
    } catch (e) {
      console.error('Error creating user account', e)

      throw e
    }
  }

  findUserById(userId: string): UserAccount {
    try {
      const user = this.userAccountRepository.findAccountById(userId)

      if (!user) throw new Error('User does not exist')

      return user
    } catch (e) {
      console.error('Error finding user account', e)

      throw e
    }
  }
}
