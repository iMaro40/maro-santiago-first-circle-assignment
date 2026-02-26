import { CreateAccountRequestData } from './dto'
import { UserAccount } from './model'
import { v4 as uuidv4 } from 'uuid'

export class UserAccountRepository {
  // Using an additional index map to achieve O(1) lookup by email.
  // This is just a simple demonstration. In production this would likely be handled by database indexing.
  private usersById: Record<string, UserAccount> = {}
  private usersByEmail: Record<string, UserAccount> = {}

  save({ email, name }: CreateAccountRequestData): UserAccount {
    const userId = uuidv4()

    const user: UserAccount = {
      email,
      name,
      id: userId,
    }

    // The write overhead of the "indexing". Now we need to make sure to maintain all the records.
    this.usersById[userId] = user
    this.usersByEmail[email] = user

    return user
  }

  findAccountByEmail(email: string) {
    const user = this.usersByEmail[email]

    return user
  }
}
