// ensure uuid is mocked to avoid ESM import issues
jest.mock('uuid')

import { BankAccountRepository } from '../src/bank-accounts/repository'
import { CreateBankAccountRequestData } from '../src/bank-accounts/dto'
import { BankAccount } from '../src/bank-accounts/model'

describe('BankAccountRepository', () => {
  let repository: BankAccountRepository

  beforeEach(() => {
    repository = new BankAccountRepository()
  })

  describe('save', () => {
    it('should save a bank account and return it with a generated id and initial balance of 0', () => {
      const data: CreateBankAccountRequestData = {
        userId: 'user-123',
      }

      const savedAccount = repository.save(data)

      expect(savedAccount).toBeDefined()
      expect(savedAccount.id).toBeDefined()
      expect(typeof savedAccount.id).toBe('string')
      expect(savedAccount.userId).toBe(data.userId)
      expect(savedAccount.balance).toBe(0)
    })

    it('should allow multiple accounts for the same user', () => {
      const userId = 'user-same'
      const data1: CreateBankAccountRequestData = { userId }
      const data2: CreateBankAccountRequestData = { userId }

      const savedAccount1 = repository.save(data1)
      const savedAccount2 = repository.save(data2)

      expect(savedAccount1.id).not.toBe(savedAccount2.id)
      expect(savedAccount1.userId).toBe(savedAccount2.userId)
    })
  })

  describe('findBankAccountById', () => {
    it('should return the account when found by id', () => {
      const data: CreateBankAccountRequestData = {
        userId: 'user-123',
      }
      const savedAccount = repository.save(data)

      const foundAccount = repository.findBankAccountById(savedAccount.id)

      expect(foundAccount).toEqual(savedAccount)
    })

    it('should return undefined when account not found by id', () => {
      const foundAccount = repository.findBankAccountById('nonexistent-id')

      expect(foundAccount).toBeUndefined()
    })

    it('should correctly retrieve the right account among multiple', () => {
      repository.save({ userId: 'user-1' })
      const account2 = repository.save({ userId: 'user-2' })
      repository.save({ userId: 'user-3' })

      const foundAccount = repository.findBankAccountById(account2.id)

      expect(foundAccount).toEqual(account2)
      expect(foundAccount?.userId).toBe('user-2')
    })
  })

  describe('update', () => {
    it('should update the balance of an existing account and return it', () => {
      const savedAccount = repository.save({ userId: 'user-123' })

      const updatedAccount: BankAccount = {
        ...savedAccount,
        balance: 50000, // $500.00
      }

      const result = repository.update(updatedAccount)

      expect(result).toEqual(updatedAccount)
      expect(result.balance).toBe(50000)
    })
  })
})
