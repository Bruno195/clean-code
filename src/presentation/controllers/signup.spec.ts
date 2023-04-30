import { SignUpController } from './signup'
import { MissingParamError } from '../errors/missing-param-error'

const makeSUT = (): SignUpController => {
  return new SignUpController()
}

describe('SignUp Controller', () => {
  test('should return status code 400 if name not provided', () => {
    // system under test
    const sut = makeSUT()
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
    const sut = makeSUT()
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
})
