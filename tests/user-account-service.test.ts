import { UserAccountService } from '../src/user-accounts/service'
import { UserAccountRepository } from '../src/user-accounts/repository'
import { CreateUserAccountRequestData } from '../src/user-accounts/dto'
import { UserAccount } from '../src/user-accounts/model'

describe('UserAccountService', () => {
  let repo: jest.Mocked<UserAccountRepository>
  let service: UserAccountService

  beforeEach(() => {
    // create a manual mock of the repository
    repo = {
      save: jest.fn(),
      findAccountByEmail: jest.fn(),
      findAccountById: jest.fn(),
    } as any

    service = new UserAccountService(repo)
  })

  describe('createUserAccount', () => {
    const validData: CreateUserAccountRequestData = {
      email: 'test@example.com',
      name: 'Test User',
    }

    it('should save a new user when data is valid and email does not exist', () => {
      repo.findAccountByEmail.mockReturnValue(undefined)
      const fakeUser: UserAccount = { ...validData, id: 'some-id' }
      repo.save.mockReturnValue(fakeUser)

      expect(() => service.createUserAccount(validData)).not.toThrow()
      expect(repo.findAccountByEmail).toHaveBeenCalledWith(validData.email)
      expect(repo.save).toHaveBeenCalledWith(validData)
    })

    it('should throw if the email is invalid', () => {
      const badData = { ...validData, email: 'not-an-email' }
      expect(() => service.createUserAccount(badData)).toThrow('Invalid email')
      expect(repo.findAccountByEmail).not.toHaveBeenCalled()
      expect(repo.save).not.toHaveBeenCalled()
    })

    it('should throw if a user with the same email already exists', () => {
      repo.findAccountByEmail.mockReturnValue({
        ...validData,
        id: 'existing-id',
      })

      expect(() => service.createUserAccount(validData)).toThrow(
        'User with email exists',
      )
      expect(repo.findAccountByEmail).toHaveBeenCalledWith(validData.email)
      expect(repo.save).not.toHaveBeenCalled()
    })
  })

  describe('findUserById', () => {
    it('should return the user when found', () => {
      const user: UserAccount = {
        id: 'abc-123',
        name: 'Jane Doe',
        email: 'jane@example.com',
      }
      repo.findAccountById.mockReturnValue(user)

      const result = service.findUserById(user.id)
      expect(result).toBe(user)
      expect(repo.findAccountById).toHaveBeenCalledWith(user.id)
    })

    it('should throw an error if the user does not exist', () => {
      repo.findAccountById.mockReturnValue(undefined)
      expect(() => service.findUserById('missing-id')).toThrow(
        'User does not exist',
      )
    })
  })
})
