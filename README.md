## About

1. I created the `BankAccountService` class to provide the functionalities outlined in the spec:
   - Account creation -> `createBankAccount()`
   - Deposit -> `deposit()`
   - Withdrawal -> `withdraw()`
   - Transfer -> `transfer`
   - Account balance: -> `getBalanceOfAccount()`
2. Data is stored in memory in the `BankAccountRepository` class via class variables.
   - This is a singleton class initialized in `init.ts`.
3. I've also created the `user-accounts` domain to mimic real life business flow where:
   - Ony valid users within your application should be able to create bank accounts
   - Users can create multiple bank accounts

## How To Run

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Install dependencies
npm install
```

### Running Tests

```bash
# Run all tests
npm run test


```
