import { SignUpController } from './signup'
describe('SignUp Controller', () => {
  test('should return status code 400 if name not provided', () => {
    // system under test
    const sut = new SignUpController()
    // Body request method Post without name
    const httpRequest = {
      email: 'any_email',
      password: 'any_password',
      passwordConfirmation: 'any_password'
    }

    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
  })
})
