// useCases where stay the business rules
// this file is the interface of the useCase

import { AccountModel } from '../models/account'

// AddAccountModel is the data that the useCase will receive
// Is the params that the useCase will receive
export interface AddAccountParam {
  name: string
  email: string
  password: string
}

// AddAccount is the interface of the useCase
export interface AddAccount {
  add: (account: AddAccountParam) => Promise<AccountModel>
}
