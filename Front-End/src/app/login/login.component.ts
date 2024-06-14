/*
 * This is login.component.ts
 */
import {Component, OnInit} from '@angular/core'
import {Router} from '@angular/router'
import {User} from '../models/user.model'
import {UserService} from '../services/user.service'
import {FormBuilder, FormGroup, Validators} from '@angular/forms'
import {Client} from '../client'
import {AppService} from '../app.service'
import {LogService} from '../services/log.service'
import {UserProfile} from '../auth/user-profile'
import {BehaviorSubject} from 'rxjs'
import {AlertService} from '../components/_alert/alert.service'
import swal from 'sweetalert2'
import {environment} from 'src/environments/environment'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup
  loading = false
  submitted = false
  returnUrl: string
  showError = false
  showWarning = true
  showSuccess = false
  userObject: User = {}
  isUserRegister = false
  isForgotPassword = false
  isLogin = true
  client: Client = {
    clientFK: 0
  }
  message = false
  packagesString: {}

  options = {
    autoClose: true,
    keepAfterRouteChange: false
  }
  clienData
  constructor(
    private userService: UserService,
    private router: Router,
    private formBuilder: FormBuilder,
    public appService: AppService,
    private logger: LogService,
    private alertService: AlertService
  ) {
    this.isLogin = true
    this.isUserRegister = false
    this.isForgotPassword = false
  }
  userProfile = new BehaviorSubject<UserProfile | null>(null)
  currentDate = new Date()
  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    })
    this.isLogin = true
    this.isUserRegister = false
    this.isForgotPassword = false
  }

  // convenience getter for easy access to form fields
  get f(): User {
    return this.loginForm.controls
  }

  async onFormSubmit(): Promise<void> {
    this.logger.log('Start of LoginComponent : onFormSubmit')
    this.submitted = true
    if (this.loginForm.invalid) {
      return
    }
    const authToken = await this.userService.loginAuth(this.loginForm.value)
    localStorage.setItem('tokens', authToken.access_token)
    this.userObject = await this.userService.login(this.loginForm.value)
    if (this.userObject !== null) {
      this.appService.setuserObject(this.userObject)
      sessionStorage.setItem('userObj', JSON.stringify(this.userObject))
      sessionStorage.setItem('userProfileName', this.userObject.username)
      localStorage.setItem('userGuide', 'display')
      const userObj = JSON.parse(sessionStorage.getItem('userObj'))
      const trailEndDateOfUser = new Date(userObj.trialend)
      if (this.currentDate > trailEndDateOfUser) {
        sessionStorage.clear()
        localStorage.clear()
        this.warning()
      } else {
        await this.getClientList(this.userObject.clientFk)
        this.showSuccess = true
        await this.retrievePlan(this.clienData.planFk)
        await this.retrieveRole(this.userObject.roleId)
        this.client.clientFK = this.userObject.clientFk
      }
    } else {
      this.showError = true
      localStorage.removeItem('tokens')
    }
    this.logger.log('End of LoginComponent : onFormSubmit ')
  }

  warning(): void {
    ;($('#loginModal') as any).modal('hide')
    const link = environment.frontendBaseUrl
    swal({
      title: 'Trail Pack Expired',
      text: `Your trail period has ended. Please click below to receive your invoice.`,
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#00B96F',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Get invoice',
      cancelButtonText: 'Decline'
    }).then(result => {
      if (result.value == true) {
        // get invoice URL
      } else {
        this.router.navigate(['/'])
        sessionStorage.clear()
        localStorage.clear()
        window.location.reload(), ($('#loginModal') as any).modal('hide')
      }
    })
  }

  showforgotPasswordModal(): void {
    this.isForgotPassword = true
    this.appService.isUserLogin = false
    //(document.getElementById('registerModal')as any).modal('')
    ;($('#forgotpasswordModal') as any).modal('show')
    this.isForgotPassword = false
    ;($('#loginModal') as any).modal('hide')
  }

  showRegisterModal(): void {
    this.isUserRegister = true
    this.appService.isUserLogin = false
    this.isLogin = false
    ;($('#registerModal') as any).modal('show')
    this.isUserRegister = false
    ;($('#loginModal') as any).modal('hide')
  }

  retrieveRole(id): void {
    this.logger.log('Start of login component : retrieveRole : id', id)
    this.userService.getRoleNameByID(id).subscribe(data => {
      sessionStorage.setItem('roleObj', JSON.stringify(data))
      if (data[0].name === 'staff') {
        this.router.navigate(['/form']).then(() => {
          window.location.reload()
        })
      } else if (data) {
        this.submitted = true
        sessionStorage.setItem('redirect_to', '/dashboard')
        window.location.reload()
      }
      this.logger.log('End of LoginComponent : retrieveRole :', data)
    })
  }

  private async getClientList(clientFk): Promise<void> {
    this.logger.log(
      'Start of login component : getClientList : clientFk',
      clientFk
    )
    const data = await this.userService.getClientList(clientFk)
    this.clienData = data[0]
    sessionStorage.setItem('clientName', data[0].name)
  }

  private async retrievePlan(id: number): Promise<void> {
    this.logger.log('Start of login component : retrievePlan : id', id)
    const data = await this.userService.getPlanByID(id)
    this.logger.log('End of login component : retrievePlan : id', id)
    sessionStorage.setItem('planObj', JSON.stringify(data))
  }

  reloadPage(): void {
    location.reload()
  }
}
