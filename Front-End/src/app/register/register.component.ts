/* eslint-disable i18n-text/no-en */
/* eslint-disable @typescript-eslint/unbound-method */
/*
 * This is register.component.ts
 */
import {Component, EventEmitter, OnInit, Output} from '@angular/core'
import {FormBuilder, FormGroup, Validators} from '@angular/forms'
import {Router} from '@angular/router'
import {AlertService} from '../components/_alert'
import {UserService} from '../services/user.service'
import {User} from '../models/user.model'
import {ConfirmedValidator} from '../components/change-password/validator'
import {Plan} from '../models/plan.model'
import swal from 'sweetalert2'
import {AppService} from '../app.service'
import {environment} from 'src/environments/environment'

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html'
})
export class RegisterComponent implements OnInit {
  user: User = {
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    location: ''
  }

  isUserRegister = true
  isLogin = false
  options = {
    autoClose: true,
    keepAfterRouteChange: false
  }
  userLogin: boolean = true
  @Output() setUserLoginModal = new EventEmitter<boolean>()
  constructor(
    private router: Router,
    private userService: UserService,
    private formBuilder: FormBuilder,
    private alertService: AlertService,
    public appService: AppService
  ) {
    this.isUserRegister = true
    this.isLogin = false
  }
  loading = false
  submitted = false
  registerForm: FormGroup
  isExist = false
  ngOnInit(): void {
    this.registerForm = this.formBuilder.group(
      {
        username: [
          '',
          [Validators.required, Validators.pattern('[a-zA-Z0-9]*')]
        ],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', [Validators.required, Validators.minLength(6)]],
        phone: ['', Validators.required],
        location: ['', Validators.required],
        plan: 2,
        acceptTerms: [false, Validators.requiredTrue],
        clientFk: '',
        roleId: 1,
        esUrl: ''
      },
      {
        validator: ConfirmedValidator('password', 'confirmPassword')
      }
    )
    this.isUserRegister = true
    this.isLogin = false
  }

  get f(): User {
    return this.registerForm.controls
  }

  async saveUser(): Promise<void> {
    this.submitted = true
    if (this.registerForm.invalid) {
      return
    }
    const client = {
      name: this.registerForm.value.username,
      planFk: this.registerForm.value.plan
    }
    this.userService.createClient(client).subscribe(response => {
      this.submitted = true
      this.registerForm.value.clientFk = response.id
      this.userService
        .backendValidation(client.name, this.registerForm.value.email)
        .subscribe(responses => {
          if (responses.length > 0) {
            this.isExist = true
          } else
            this.userService
              .create(this.registerForm.value)
              .subscribe(async userData => {
                await this.registerSuccessPopUp()
                this.submitted = true
                this.isUserRegister = false
                ;(this.isLogin = true),
                  ($('#registerModal') as any).modal('hide')
              })
        })
    })
  }

  private async registerSuccessPopUp(): Promise<void> {
    swal({
      title: 'Registration Successfull',
      text:
        'Registration is successfull please check your email for activation link',
      type: 'success',
      showCancelButton: false,
      confirmButtonColor: '#00B96F',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Ok'
    }).then(result => {
      if (result.value == true) {
        location.reload()
      }
    })
  }

  showLoginModal(): void {
    this.isLogin = true
    this.appService.isUserLogin = true
    ;($('#loginModal') as any).modal('show')
    this.isUserRegister = false
    ;($('#registerModal') as any).modal('hide')
    if (this.appService.isRegisterForm === true) {
      this.isUserRegister = true
    } else {
      this.appService.isRegisterForm = true
    }
  }

  reloadPage(): void {
    location.reload()
  }
}
