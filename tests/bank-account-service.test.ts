import { BankAccountService } from '../src/bank-accounts/service'
import { BankAccountRepository } from '../src/bank-accounts/repository'
import { UserAccountService } from '../src/user-accounts/service'
import {
  CreateBankAccountRequestData,
  DepositRequestData,
  WithdrawRequestData,
  BankTransferRequestData,
} from '../src/bank-accounts/dto'
import { BankAccount } from '../src/bank-accounts/model'

// only repository and user service are used, so we can create jest mocks manually

describe('BankAccountService', () => {
  let repo: jest.Mocked<BankAccountRepository>
  let userService: jest.Mocked<UserAccountService>
  let service: BankAccountService

  beforeEach(() => {
    repo = {
      save: jest.fn(),
      update: jest.fn(),
      findBankAccountById: jest.fn(),
    } as any

    userService = {
      findUserById: jest.fn(),
    } as any

    service = new BankAccountService(repo, userService)
  })

  describe('createBankAccount', () => {
    const data: CreateBankAccountRequestData = { userId: 'user-1' }

    it('should create if user exists', () => {
      userService.findUserById.mockReturnValue({
        id: 'user-1',
        email: 'a@b.com',
        name: 'A',
      })
      const account: BankAccount = {
        id: 'acc-1',
        userId: data.userId,
        balance: 0,
      }
      repo.save.mockReturnValue(account)

      const result = service.createBankAccount(data)
      expect(result.id).toBe(account.id)
      expect(userService.findUserById).toHaveBeenCalledWith(data.userId)
      expect(repo.save).toHaveBeenCalledWith(data)
    })

    it('should throw when user not found', () => {
      userService.findUserById.mockReturnValue(undefined)
      expect(() => service.createBankAccount(data)).toThrow('User not found')
      expect(repo.save).not.toHaveBeenCalled()
    })
  })

  describe('deposit', () => {
    const deposit: DepositRequestData = { bankAccountId: 'acc-1', amount: 100 }
    let account: BankAccount

    beforeEach(() => {
      account = { id: 'acc-1', userId: 'user-1', balance: 200 }
    })

    it('should update balance when valid', () => {
      repo.findBankAccountById.mockReturnValue(account)
      service.deposit(deposit)
      expect(repo.update).toHaveBeenCalledWith({ ...account, balance: 300 })
    })

    it('should throw for invalid amount', () => {
      repo.findBankAccountById.mockReturnValue(account)
      expect(() => service.deposit({ ...deposit, amount: -5 })).toThrow(
        'Amount must be a valid positive integer',
      )
      expect(repo.update).not.toHaveBeenCalled()
    })

    it('should throw when account missing', () => {
      repo.findBankAccountById.mockReturnValue(undefined)
      expect(() => service.deposit(deposit)).toThrow(
        'Bank account does not exist',
      )
    })
  })

  describe('withdraw', () => {
    const withdraw: WithdrawRequestData = { bankAccountId: 'acc-1', amount: 50 }
    let account: BankAccount

    beforeEach(() => {
      account = { id: 'acc-1', userId: 'user-1', balance: 100 }
    })

    it('should subtract when valid', () => {
      repo.findBankAccountById.mockReturnValue(account)
      service.withdraw(withdraw)
      expect(repo.update).toHaveBeenCalledWith({ ...account, balance: 50 })
    })

    it('should throw on negative amount', () => {
      repo.findBankAccountById.mockReturnValue(account)
      expect(() => service.withdraw({ ...withdraw, amount: -1 })).toThrow(
        'Amount must be a valid positive integer',
      )
    })

    it('should throw on insufficient funds', () => {
      repo.findBankAccountById.mockReturnValue({ ...account, balance: 10 })
      expect(() => service.withdraw(withdraw)).toThrow('Invalid amount')
    })

    it('should throw when account missing', () => {
      repo.findBankAccountById.mockReturnValue(undefined)
      expect(() => service.withdraw(withdraw)).toThrow(
        'Bank account does not exist',
      )
    })
  })

  describe('getBalanceOfAccount', () => {
    it('should return id and balance when account exists', () => {
      const account: BankAccount = {
        id: 'acc-1',
        userId: 'user-1',
        balance: 999,
      }
      repo.findBankAccountById.mockReturnValue(account)
      const result = service.getBalanceOfAccount(account.id)
      expect(result).toEqual({ id: account.id, balance: account.balance })
    })

    it('should throw when account missing', () => {
      repo.findBankAccountById.mockReturnValue(undefined)
      expect(() => service.getBalanceOfAccount('acc-unknown')).toThrow(
        'Bank account does not exist',
      )
    })
  })

  describe('transfer', () => {
    const transfer: BankTransferRequestData = {
      fromBankAccountId: 'acc-1',
      toBankAccountId: 'acc-2',
      amount: 30,
    }
    const from: BankAccount = { id: 'acc-1', userId: 'user-1', balance: 100 }
    const to: BankAccount = { id: 'acc-2', userId: 'user-2', balance: 20 }

    it('should move funds when valid', () => {
      repo.findBankAccountById.mockImplementation((id) =>
        id === from.id ? from : id === to.id ? to : undefined,
      )
      service.transfer(transfer)
      expect(repo.update).toHaveBeenCalledWith({ ...from, balance: 70 })
      expect(repo.update).toHaveBeenCalledWith({ ...to, balance: 50 })
    })

    it('should throw when insufficient balance', () => {
      repo.findBankAccountById.mockReturnValue(from)
      expect(() => service.transfer({ ...transfer, amount: 200 })).toThrow(
        'Invalid amount',
      )
    })

    it('should throw when from account missing', () => {
      repo.findBankAccountById.mockReturnValueOnce(undefined)
      expect(() => service.transfer(transfer)).toThrow(
        'Bank account does not exist',
      )
    })

    it('should throw when to account missing', () => {
      repo.findBankAccountById.mockImplementation((id) =>
        id === from.id ? from : undefined,
      )
      expect(() => service.transfer(transfer)).toThrow(
        'Bank account does not exist',
      )
    })

    it('should throw on invalid amount format', () => {
      repo.findBankAccountById.mockReturnValue(from)
      expect(() => service.transfer({ ...transfer, amount: -10 })).toThrow(
        'Amount must be a valid positive integer',
      )
    })
  })
})
