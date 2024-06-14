/*
 * This is app.service.ts
 */
import {Injectable} from '@angular/core'
import {User} from './models/user.model'
export interface InternalStateType {
  [key: string]: string
}
@Injectable({
  providedIn: 'root'
})
export class AppService {
  isUserLogin: boolean
  isForgotPassword: boolean
  isRegisterForm: boolean
  _state: InternalStateType = {}
  userObject: User

  setuserObject(data: User): void {
    if (data) {
      this.userObject = data
    }
  }

  getuserObject(): User {
    return this.userObject
  }

  showLoginModal(): void {
    this.isUserLogin = true
    this.isForgotPassword = false
    this.isRegisterForm = false
  }

  showForgotPasswordForm(): void {
    this.isForgotPassword = true
    this.isUserLogin = false
    this.isRegisterForm = false
  }
}
