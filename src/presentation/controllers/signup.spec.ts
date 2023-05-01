import { SignUpController } from './signup'
import { MissingParamError, ServerError, InvalidParamError } from '../errors'
import { EmailValidator } from '../protocols/email-validator'

interface SutTypes {

  sut: SignUpController

  emailValidatorStub: EmailValidator
}

// factory system under test
const makeSUT = (): SutTypes => {
  // Stub is a fake class that returns a hard coded value, retorno marratado para ela, no caso true.
  class EmailValidatorStub implements EmailValidator {
    isValid (email: string): boolean {
      return true
    }
  }
  const emailValidatorStub = new EmailValidatorStub()

  const sut = new SignUpController(emailValidatorStub)

  return {
    sut,
    emailValidatorStub
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

  test('should return status code 500 if EmailValidator throws', () => {
    class EmailValidatorStub implements EmailValidator {
      isValid (email: string): boolean {
        throw new Error()
      }
    }
    const emailValidatorStub = new EmailValidatorStub()
    const sut = new SignUpController(emailValidatorStub)

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
})

// importante: sempre inicialize seu mock com valor positivo para ele
// não influenciar ou quebrar os demais testes.
