/*
 * This is forgot-password.component.ts
 */
import {Component, OnInit} from '@angular/core'
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms'
import {User} from '../../models/user.model'
import {UserService} from '../../services/user.service'
import {AppService} from 'src/app/app.service'

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {
  forgotPasswordForm: FormGroup = new FormGroup({})
  email = ''
  user: User = {
    email: '',
    clientFk: 0
  }

  UserObj: User = {}
  userObject: User
  isForgotPassword = true
  isUserRegister = false
  isUserLogin = false
  passChanged = false

  constructor(
    private userService: UserService,
    private formBuilder: FormBuilder,
    public appService: AppService
  ) {
    this.forgotPasswordForm = formBuilder.group({
      email: ['', [Validators.required]]
    })
  }

  get f(): {[key: string]: AbstractControl} {
    return this.forgotPasswordForm.controls
  }

  ngOnInit(): void {
    this.UserObj = JSON.parse(sessionStorage.getItem('userObj'))
  }

  submit(): void {
    this.reset()
  }

  handleError(err: ErrorEvent): void {
    alert(err)
  }

  reset(): void {
    this.userService.resetPassword(this.user).subscribe(
      response => {
        this.userObject = response
        this.passChanged = true
        // this.isUserLogin = true
        // this.isForgotPassword = false
      },
      error => {
        this.handleError(error.message)
      }
    )
  }

  showRegisterModal(): void {
    this.isUserRegister = true
    ;($('#registerModal') as any).modal('show')
    this.isForgotPassword = false
    ;($('#forgotpasswordModal') as any).modal('hide')
    this.appService.isForgotPassword = true
    this.appService.isRegisterForm = true
  }

  // reloadPage(): void {
  //   location.reload()
  // }
}
