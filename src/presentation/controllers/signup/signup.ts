import { AddAccount, EmailValidator } from '../signup/signup-protocols'
import { MissingParamError, InvalidParamError } from '../../errors'
import { badRequest, serverError } from '../../helpers/http-helper'
import { HttpRequest, HttpResponse, Controller } from '../../protocols'

export class SignUpController implements Controller {
  private readonly emailValidator: EmailValidator
  private readonly addAccount: AddAccount
  constructor (emailValidator: EmailValidator, addAccount: AddAccount) {
    this.emailValidator = emailValidator
    this.addAccount = addAccount
  }

  handle (httpRequest: HttpRequest): HttpResponse {
    try {
      const requiredFields = ['name', 'email', 'password', 'passwordConfirmation']

      for (const field of requiredFields) {
        if (!httpRequest.body[field]) {
          return badRequest(new MissingParamError(field))
        }
      }

      const { name, passwordConfirmation, password, email } = httpRequest.body

      if (password !== passwordConfirmation) {
        return badRequest(new InvalidParamError('passwordConfirmation fails'))
      }

      const isValid = this.emailValidator.isValid(email)
      if (!isValid) {
        return badRequest(new InvalidParamError('email'))
      }
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      this.addAccount.add({
        name,
        email,
        password
      })

      return badRequest(new MissingParamError('any_param'))
    } catch (error) {
      return serverError()
    }
  }
}

// Importante: não posso dizer que o tipo do emailValidator será emailValidatorStub,
// porque não posso colocar uma classe stub em produção, então eu coloco o tipo any.
// Mas ao invés de passar any, crio uma interface para o emailValidator, e desaclopo este
// Controlador de qualquer implementação concreta de uma classe.
