import { UserAccount } from './model'

export type CreateUserAccountRequestData = Omit<UserAccount, 'id'>
