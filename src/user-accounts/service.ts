import { CreateUserAccountRequestData } from './dto'
import { UserAccountRepository } from './repository'

export class UserAccountService {
  private userAccountRepository: UserAccountRepository

  constructor(userAccountRepository: UserAccountRepository) {
    this.userAccountRepository = userAccountRepository
  }

  private validateCreateAccountRequest(data: CreateUserAccountRequestData) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    const isEmailValid = emailRegex.test(data.email)

    if (!isEmailValid) throw new Error('Invalid email')

    const userAccountByEmail = this.userAccountRepository.findAccountByEmail(
      data.email,
    )
    if (userAccountByEmail) throw new Error('User with email exists')
  }

  // TO DO: Optimistic locking
  createAccount(data: CreateUserAccountRequestData) {
    try {
      this.validateCreateAccountRequest(data)

      this.userAccountRepository.save(data)
    } catch (e) {
      console.error('Error creating user account', e)

      // TO DO: Maybe send some notification to the user that the request failed

      throw e
    }
  }
}
