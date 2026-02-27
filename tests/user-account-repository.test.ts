// ensure uuid is mocked to avoid ESM import issues
jest.mock('uuid')

import { UserAccountRepository } from '../src/user-accounts/repository'
import { CreateUserAccountRequestData } from '../src/user-accounts/dto'

describe('UserAccountRepository', () => {
  let repository: UserAccountRepository

  beforeEach(() => {
    repository = new UserAccountRepository()
  })

  describe('save', () => {
    it('should save a user account and return it with a generated id', () => {
      const data: CreateUserAccountRequestData = {
        email: 'john@example.com',
        name: 'John Doe',
      }

      const savedUser = repository.save(data)

      expect(savedUser).toBeDefined()
      expect(savedUser.id).toBeDefined()
      expect(savedUser.email).toBe(data.email)
      expect(savedUser.name).toBe(data.name)
    })
  })

  describe('findAccountByEmail', () => {
    it('should return the user when found by email', () => {
      const data: CreateUserAccountRequestData = {
        email: 'test@example.com',
        name: 'Test User',
      }
      const savedUser = repository.save(data)

      const foundUser = repository.findAccountByEmail('test@example.com')

      expect(foundUser).toEqual(savedUser)
    })

    it('should return undefined when user not found by email', () => {
      const foundUser = repository.findAccountByEmail('nonexistent@example.com')

      expect(foundUser).toBeUndefined()
    })

    it('should correctly handle multiple users and find the right one', () => {
      const user1Data: CreateUserAccountRequestData = {
        email: 'user1@example.com',
        name: 'User One',
      }
      const user2Data: CreateUserAccountRequestData = {
        email: 'user2@example.com',
        name: 'User Two',
      }
      const user3Data: CreateUserAccountRequestData = {
        email: 'user3@example.com',
        name: 'User Three',
      }

      repository.save(user1Data)
      const savedUser2 = repository.save(user2Data)
      repository.save(user3Data)

      const foundUser = repository.findAccountByEmail('user2@example.com')

      expect(foundUser).toEqual(savedUser2)
    })
  })

  describe('findAccountById', () => {
    it('should return the user when found by id', () => {
      const data: CreateUserAccountRequestData = {
        email: 'byid@example.com',
        name: 'By ID Test',
      }
      const savedUser = repository.save(data)

      const foundUser = repository.findAccountById(savedUser.id)

      expect(foundUser).toEqual(savedUser)
    })

    it('should return undefined when user not found by id', () => {
      const foundUser = repository.findAccountById('nonexistent-id')

      expect(foundUser).toBeUndefined()
    })

    it('should correctly handle multiple users and find the right one', () => {
      const user1Data: CreateUserAccountRequestData = {
        email: 'user1@example.com',
        name: 'User One',
      }
      const user2Data: CreateUserAccountRequestData = {
        email: 'user2@example.com',
        name: 'User Two',
      }
      const user3Data: CreateUserAccountRequestData = {
        email: 'user3@example.com',
        name: 'User Three',
      }

      repository.save(user1Data)
      const savedUser2 = repository.save(user2Data)
      repository.save(user3Data)

      const foundUser = repository.findAccountById(savedUser2.id)

      expect(foundUser).toEqual(savedUser2)
    })
  })
})
