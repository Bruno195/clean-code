import { SignUpController } from './signup'
import { MissingParamError, ServerError, InvalidParamError } from '../../errors'
import { EmailValidator, AccountModel, AddAccount, AddAccountParam } from './signup-protocols'

interface SutTypes {

  sut: SignUpController

  emailValidatorStub: EmailValidator
}

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid (email: string): boolean {
      return true
    }
  }
  return new EmailValidatorStub()
}

const makeAddAccount = (): AddAccount => {
  class AddAccountStub implements AddAccount {
    async add (account: AddAccountParam): Promise<AccountModel> {
      const fakeAccount = {
        id: 'valid_id',
        name: 'valid_name',
        email: 'valid_email@mail.com',
        password: 'valid_password'
      }

      return fakeAccount
    }
  }
  return new AddAccountStub()
}

interface SutTypes {

  sut: SignUpController
  emailValidatorStub: EmailValidator
  addAccountStub: AddAccount

}

// factory system under test
const makeSUT = (): SutTypes => {
  // Stub is a fake class that returns a hard coded value, retorno marretado para ela, no caso true.
  const emailValidatorStub = makeEmailValidator()
  const addAccountStub = makeAddAccount()
  const sut = new SignUpController(emailValidatorStub, addAccountStub)

  return {
    sut,
    emailValidatorStub,
    addAccountStub
  }
}

describe('SignUp Controller', () => {
  test('should return status code 400 if name not provided', () => {
    // system under test
    const { sut } = makeSUT()
    // Body request method Post without name
    const httpRequest = {
      body: {
        email: 'any_email',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    }

    const httpResponse = sut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(400)

    expect(httpResponse.body).toEqual(new MissingParamError('name'))
  })

  test('should return status code 400 if name not provided', () => {
    // system under test
    const { sut } = makeSUT()
    // Body request method Post without name
    const httpRequest = {
      body: {
        name: 'any_name',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    }

    const httpResponse = sut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(400)

    expect(httpResponse.body).toEqual(new MissingParamError('email'))
  })

  test('should return status code 400 if no password is provided', () => {
    // system under test
    const { sut } = makeSUT()
    // Body request method Post without name
    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email',
        passwordConfirmation: 'any_password'
      }
    }

    const httpResponse = sut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(400)

    expect(httpResponse.body).toEqual(new MissingParamError('password'))
  })

  test('should return status code 400 if no password confirmation is provided', () => {
    // system under test
    const { sut } = makeSUT()
    // Body request method Post without name
    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email',
        password: 'any_password'
      }
    }

    const httpResponse = sut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(400)

    expect(httpResponse.body).toEqual(new MissingParamError('passwordConfirmation'))
  })

  test('should return status code 400 if is invalid e-mail', () => {
    // system under test
    const { sut, emailValidatorStub } = makeSUT()
    // Mockando o retorno do método isValid do emailValidatorStub
    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)
    // Body request method Post without name
    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'invalid_email@mail.com',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    }

    const httpResponse = sut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(400)

    expect(httpResponse.body).toEqual(new InvalidParamError('email'))
  })

  test('should call EmailValidator with correct email', () => {
    // system under test
    const { sut, emailValidatorStub } = makeSUT()
    // Mockando o retorno do método isValid do emailValidatorStub
    const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid')
    // Body request method Post without name
    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    }

    sut.handle(httpRequest)
    expect(isValidSpy).toHaveBeenCalledWith('any_email@mail.com')
  })

  test('should return 400 if password confirmation fails', () => {
    const { sut } = makeSUT()

    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email@gmail.com',
        password: 'any_password',
        passwordConfirmation: 'invalid_password'
      }
    }

    const httpResponse = sut.handle(httpRequest)

    // toEqual compara objetos, toBe compara referências de objetos

    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new InvalidParamError('passwordConfirmation fails'))
  })

  test('should return status code 500 if EmailValidator throws', () => {
    const { sut, emailValidatorStub } = makeSUT()

    jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => {
      throw new Error()
    })

    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    }

    const httpResponse = sut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(500)

    expect(httpResponse.body).toEqual(new ServerError())
  })

  test('should call AddAccount with correct values', () => {
    const { sut, addAccountStub } = makeSUT()

    const addSpy = jest.spyOn(addAccountStub, 'add')
    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    }

    sut.handle(httpRequest)

    expect(addSpy).toHaveBeenCalledWith({
      name: 'any_name',
      email: 'any_email@mail.com',
      password: 'any_password'
    })
  })
})

// importante: sempre inicialize seu mock com valor positivo para ele
// não influenciar ou quebrar os demais testes.
