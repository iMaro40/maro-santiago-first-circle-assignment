import { CreateUserAccountRequestData } from '../src/user-accounts/dto'
import { userAccountService } from '../src/init'

function main() {
  const createUserData: CreateUserAccountRequestData = {
    name: 'John Cena',
    email: 'john@cena.com',
  }

  const createdUser = userAccountService.createUserAccount(createUserData)

  const queriedUser = userAccountService.findUserById(createdUser.id)

  console.log(queriedUser)
}

main()
