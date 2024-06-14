/* eslint-disable @typescript-eslint/unbound-method */
/* eslint-disable no-shadow */
/* eslint-disable no-undef */
/* eslint-disable import/named */
/* eslint-disable import/no-unresolved */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/restrict-plus-operands */
/* eslint-disable i18n-text/no-en */
/*
 * This is app-component.ts
 */
import {
  ActivatedRoute,
  NavigationEnd,
  Router,
  RouterState
} from '@angular/router'
import {DOCUMENT, Location} from '@angular/common'
import {Component, Inject} from '@angular/core'
import {MenuService} from './services/menu.service'
import {Menu} from './models/menu.model'
import {ItemService} from './services/item.service'
import {UserProfileService} from './services/user-profile.service'
import {Profile} from './models/userProfile.model'
import {UploadFilesService} from './services/upload-files.service'
import {UserService} from './services/user.service'
//import {ChartDataset, ChartOptions, ChartType} from 'chart.js'
import {Plan} from './models/plan.model'
import {Notification} from './models/notification.model'
import {environment} from '../environments/environment'
import swal from 'sweetalert2'
import {Item} from './models/item.model'
import {User} from './models/user.model'
//import {Label} from 'ng2-charts'
import {LogService} from './services/log.service'
import {Subscription} from 'rxjs'
import {Tray} from './models/tray.model'
import {RackService} from './services/rack.service'
import {AlertService} from './components/_alert'
import {FormControl, FormGroup, Validators} from '@angular/forms'
import {ObjectFile} from './models/file.model'
import {Role} from './models/role.model'
import {DeviceDetectorService} from 'ngx-device-detector'
import {param} from 'jquery'
import {BusyIndicatorService} from './services/busy-indicator.service'
import {Title} from '@angular/platform-browser'

const userLogin = environment.isUserLoggedIn
const serverBaseURL = environment.baseUrl

declare let gtag: Function

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  // barChartOptions: ChartOptions = {
  //   responsive: true
  // }

  //barChartLabels: Label[] = ['rate']
  //barChartType: ChartType = 'bar'
  barChartLegend = true
  barChartPlugins = []

  // barChartData: ChartDataset[] = [
  //   {data: [], label: ''},
  //   {data: [], label: ''},
  //   {data: [], label: ''}
  // ]

  itemPk: number
  profile: Profile = {
    id: 0,
    userName: '',
    email: '',
    address: '',
    city: '',
    image: '',
    phone: '',
    user_fk: 0
  }

  plan: Plan = {
    name: '',
    planImg: '',
    rate: 0
  }

  itemlabel: string
  afterClickOnNotification = true
  itemObject: Item
  dataObject: Menu
  menuObject: Menu[]
  trayDataList = []
  notifications: Notification[]
  newnotifications: Notification[]
  ifNewNotification = false
  id: number
  planList: Plan[]
  img: ''
  objectKeys = Object.keys
  menu: Menu = {
    label: '',
    action: '',
    menu_fk: 0,
    roleId: 0,
    itemId: 0
  }

  file: ObjectFile = {
    filename: '',
    filepath: `${serverBaseURL}/api/user/files/profile/`,
    user_fk: 0
  }
  showHeader
  traySelected
  trayObject: Tray = {
    id: 0,
    trayLayoutId: '',
    x: 0,
    y: 0,
    h: 0,
    w: 0,
    color: '',
    quantity: 0,
    rack_fk: 0,
    name: '',
    searchable: false,
    img: '',
    cssClass: ''
  }
  currentlyBeingEditedTray = null
  notificationImage = environment.notificationStatusSent
  notificationStatusNew = environment.notificationStatusNew
  showData = true
  isUserAuthenticated = true
  authSubscription: Subscription
  tab: number
  templateTabAddColor: string
  form = new FormGroup({
    trayname: new FormControl('', Validators.required)
  })

  options: Object = {
    autoClose: true,
    keepAfterRouteChange: false
  }
  deviceInfo = null
  isMobile = null
  isDesktopDevice = null
  imgSrc: string

  constructor(
    private menuService: MenuService,
    private itemService: ItemService,
    private activatedRoute: ActivatedRoute,
    private userProfile: UserProfileService,
    private uploadService: UploadFilesService,
    private userService: UserService,
    private router: Router,
    private logger: LogService,
    private rackService: RackService,
    private alertService: AlertService,
    private deviceService: DeviceDetectorService,
    private busyIndicatorService: BusyIndicatorService,
    private titleService: Title,
    @Inject(DOCUMENT) private document: Document
  ) {
    this.epicFunction()
    this.handleRouteEvents()
  }

  UserObj: User = {}
  PlanObj: Plan = {
    name: '',
    planImg: '',
    rate: 0
  }
  RoleObj: Role = {}
  MenuObject: Menu = {}
  rackId: number
  isSuperAdmin = false
  isOtherUser = true
  isPlanImg = true
  MenuTranslateCollection
  product: string
  userProfileName: string
  isLoading$ = this.busyIndicatorService.busy$
  staffTranslate: string

  ngOnInit(): void {
    this.logger.log('Appcomponent : getPlans :oninit')
    this.product = localStorage.getItem('product')
    this.staffTranslate = localStorage.getItem('Staff')
    this.getPlans()
    this.PlanObj = JSON.parse(sessionStorage.getItem('planObj'))
    this.UserObj = JSON.parse(sessionStorage.getItem('userObj'))
    this.userProfileName = sessionStorage.getItem('userProfileName')
    this.RoleObj = JSON.parse(sessionStorage.getItem('roleObj'))
    this.afterClickOnNotification = true
    if (this.RoleObj != null) {
      if (this.RoleObj[0].name === userLogin) {
        this.isSuperAdmin = true
        this.isOtherUser = false
      }
    }

    this.itemPk = this.activatedRoute.snapshot.params['id']
    if (this.UserObj != null) {
      this.getAllMenuData(this.UserObj.username)
    }
    this.fetchAllmenus()
    this.rackId = this.activatedRoute.snapshot.params.id
    // this.getTrayDataById(this.route.snapshot.params.id)

    if (this.product === null) {
      this.product = 'Products'
    }
    if (window.location.href) {
      const setTab = localStorage.getItem('tabindex')
      if (setTab === null) {
        this.tab = 1
      } else {
        this.tab = Number(setTab)
      }
    }

    const redirectURL = sessionStorage.getItem('redirect_to')
    if (this.UserObj != null) {
      this.fetchFile(this.UserObj.id)
      this.fetchNotificationByUserFk(this.UserObj.email)
      this.fetchNotificationByStoreId(this.UserObj.id)
    }
    if (redirectURL === undefined || redirectURL === '/dashboard') {
      sessionStorage.setItem('redirect_to', null)
      this.router
        .navigateByUrl('/dashboard', {skipLocationChange: true})
        .then(() => {
          this.router.navigate(['DashboardComponent'], {
            relativeTo: this.activatedRoute
          })
        })
    } else {
      sessionStorage.setItem('redirect_to', null)
      this.router.navigateByUrl(redirectURL, {skipLocationChange: true})
    }

    if (this.UserObj != null) {
      this.fetchFile(this.UserObj.id)
      this.fetchNotificationByUserFk(this.UserObj.email)
      this.fetchNotificationByStoreId(this.UserObj.id)
    }
  }

  handleRouteEvents() {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        const title = this.getTitle(
          this.router.routerState,
          this.router.routerState.root
        ).join('-')
        this.titleService.setTitle(title)
        gtag('event', 'page_view', {
          page_title: title,
          page_path: event.urlAfterRedirects,
          page_location: this.document.location.href
        })
      }
    })
  }

  getTitle(state: RouterState, parent: ActivatedRoute): string[] {
    const data = []
    if (parent && parent.snapshot.data && parent.snapshot.data['title']) {
      data.push(parent.snapshot.data['title'])
    }
    if (state && parent && parent.firstChild) {
      data.push(...this.getTitle(state, parent.firstChild))
    }
    return data
  }

  fetchItemById(itemId: number): void {
    this.logger.log('start of the Appcomponent: fetchItemById :itemId', itemId)
    this.itemService.getItemById(itemId).subscribe(data => {
      this.itemObject = data
      this.createMenu(this.menu)
      this.logger.log(
        'End of the Appcomponent: fetchItemById :response',
        this.itemObject
      )
    })
  }
  getAllMenuData(username): void {
    this.logger.log(
      'End of the Appcomponent: getAllMenuData :username',
      username
    )
    this.userService.getAllMenuData(username).subscribe(response => {
      const data = response
      sessionStorage.setItem('menuObj', JSON.stringify(data))
      data.map(datavalues =>
        localStorage.setItem(datavalues.Key, datavalues.Value)
      )
      this.logger.log('End of the Appcomponent: getAllMenuData :response', data)
    })
  }
  createMenu(menu: Menu): void {
    this.logger.log('End of the Appcomponent: createMenu :menu', menu)
    const data = {
      label: this.itemObject.name,
      action: `menu/${this.itemObject.name}/${this.itemObject.id}`,
      menu_fk: 1,
      roleId: 1,
      itemId: this.itemObject.id
    }

    this.menuService.createMenu(data).subscribe((data: Menu) => {
      this.dataObject = data
      this.logger.log(
        'End of the Appcomponent: createMenu :data',
        this.dataObject
      )
      this.fetchAllmenus()
    })
  }

  fetchAllRacks(): void {
    this.logger.log('Start of the Appcomponent: fetchAllRacks')
    this.id = this.UserObj.clientFk
    this.router.navigate(['/rackList', this.id])
    this.logger.log('End of the Appcomponent: fetchAllRacks')
  }

  fetchAllmenus(): void {
    this.logger.log('Start of the Appcomponent: fetchAllmenus')

    if (this.UserObj != null) {
      this.menuService
        .fetchAllMenus(this.UserObj.clientFk, this.UserObj.roleId)
        .subscribe(data => {
          if (this.plan.name === 'Personal') {
            sessionStorage.setItem('menuObj', JSON.stringify(data))
            //changed proobj
            this.menuObject = data.filter(menus => menus.label !== 'Stores')
          } else {
            const updatedMenuList = this.menuService.templateDropdownRemoveUnderScore(
              data
            )
            this.logger.log(
              '2st logger of the Appcomponent: updatedMenuList :response',
              updatedMenuList
            )
            this.logger.log(
              '1st logger of the Appcomponent: fetchAllmenus :response',
              this.menuObject
            )
            /**
             * Below code loads translated words for staff 
             */
            const adminName = this.UserObj.username.substring(
              0,
              this.UserObj.username.indexOf('.')
            )
            if (adminName.length > 0) {
              this.userService.getAllMenuData(adminName).subscribe(response => {
                const data = response
                console.log(data)

                for (let translate of data) {
                  for (let menu of this.menuObject) {
                    if (translate.Key === menu.label) {
                      menu.label = translate.Value
                      localStorage.setItem(translate.Key, menu.label)
                    }
                  }
                  if (translate.Key === 'item') {
                    localStorage.setItem(translate.Key, translate.Value)
                  } else if (translate.Key === 'product') {
                    localStorage.setItem(translate.Key, translate.Value)
                  }
                }

                this.logger.log(
                  'End of the Appcomponent: getAllMenuData :response',
                  data
                )
              })
            }

            this.menuObject = updatedMenuList
            this.logger.log(
              'end logger of the Appcomponent: fetchAllmenus :response',
              this.menuObject
            )
          }
        })
    }
  }

  redirect(): void {
    this.router.navigate(['/action'])
  }

  logout(): void {
    swal({
      title: 'Are you sure?',
      text: 'Do You Want To Logout ?',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#00B96F',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes',
      cancelButtonText: 'No'
    }).then(result => {
      if (result.value) {
        this.userLogout()
        const helpIndex = localStorage.getItem('currentToolTipListIndex')
        localStorage.clear()
        localStorage.setItem('currentToolTipListIndex', helpIndex)
      }
    })
  }

  userLogout(): void {
    window.sessionStorage.clear()
    this.router.navigate(['/']).then(() => {
      window.location.reload()
    })
  }

  refreshPage(action: string, i: number): void {
    this.templateTabAddColor = action
    this.tab = i
    if (i !== undefined) {
      localStorage.setItem('tabindex', i.toString())
    }
    this.router.navigate([`/${action}`])
  }
  refreshPage2(name: string, name2: string): void {
    console.log(name, name2)
  }

  fetchUserProfileFK(): void {
    this.id = this.UserObj.id
    this.logger.log(
      'Start of the Appcomponent: fetchUserProfileFK :userObj',
      this.UserObj.id
    )
    this.userProfile.fetchProfileByUserFK(this.id).subscribe(response => {
      this.profile = response
      this.logger.log(
        'End of the Appcomponent: fetchUserProfileFK :response',
        this.profile
      )
      this.fetchFile(this.id)
      this.router.navigate(['/userProfile', this.profile[0].id])
    })
  }

  fetchFile(user_fk: number): void {
    this.logger.log('Start of the Appcomponent: fetchFile :user_fk', user_fk)
    this.uploadService.fetchFile(user_fk).subscribe(response => {
      this.profile.image = this.file.filepath + response[0].filename
      this.logger.log(
        'End of the Appcomponent: fetchFile :response',
        this.profile.image,
        user_fk
      )
    })
  }

  changePasswordByUserFk(): void {
    this.id = this.UserObj.clientFk
    this.logger.log(
      'Start of the Appcomponent: changePasswordByUserFk :UserObj.clientFk',
      this.UserObj.clientFk
    )
    this.router.navigate(['/changePassword', this.id])
    this.logger.log('End of the Appcomponent: changePasswordByUserFk ')
  }

  getPlans(): void {
    this.logger.log('start of the Appcomponent : getPlans')
    this.userService.getPlansList().subscribe(data => {
      this.planList = data
      if (this.RoleObj != null) {
        if (this.RoleObj[0].name === userLogin) {
          this.isPlanImg = false
        }
      }
      if (this.PlanObj != null) {
        this.plan.planImg = this.PlanObj.planImg
      }

      this.logger.log('End of the Appcomponent : getPlans ', this.planList)
    })
  }

  labels(plans: Plan[]): void {
    this.logger.log('start of the Appcomponent : labels')
    for (let i = 0; i < plans.length; i++) {
      // this.barChartLabels.push(plans[i].name);
      // this.barChartData[i].label = plans[i].name
      // this.barChartData[i].data.push(plans[i].rate)
    }
    this.logger.log('End of the Appcomponent : labels ')
  }

  async fetchNotificationByUserFk(email: string): Promise<void> {
    this.logger.log(
      'start of the Appcomponent : fetchNotificationByUserFk :email',
      email
    )
    this.userService.fetchNotificationByEmail(email).subscribe(response => {
      this.notifications = response

      this.newnotifications = this.notifications.filter(obj => {
        return obj.newNotification === 1
      })

      if (
        this.newnotifications != null &&
        this.newnotifications != undefined &&
        this.newnotifications.length > 0
      ) {
        this.ifNewNotification = true
      }
    })

    this.logger.log(
      'End of the Appcomponent : fetchNotificationByUserFk :response',
      this.notifications
    )
  }

  async fetchAllNotifications(): Promise<void> {
    this.logger.log('start of the Appcomponent : fetchAllNotifications')
    this.afterClickOnNotification = true
    this.fetchNotificationByUserFk(this.UserObj.email)
    if (this.ifNewNotification === true) {
      await this.updateNewNotificationToOld()
    }
    this.logger.log('End of the Appcomponent : fetchAllNotifications')
  }

  public async updateNewNotificationToOld(): Promise<void> {
    const notificationIDs = this.newnotifications.map(
      notification => notification.id
    )
    this.userService
      .updateNewNotificationToOld(notificationIDs)
      .subscribe(data => {
        this.ifNewNotification = false
      })
  }

  saveTray(): void {
    this.currentlyBeingEditedTray.name = this.form.controls.trayname.value

    if (this.currentlyBeingEditedTray.img === undefined) {
      this.file.filepath = ''
      this.currentlyBeingEditedTray.img = this.file.filepath
    }

    this.rackService
      .updateTray(
        this.currentlyBeingEditedTray.id,
        this.currentlyBeingEditedTray
      )
      .subscribe(
        response => {
          this.trayObject = response
          this.alertService.success('Tray Is Saved Successfully', this.options)

          this.getTrayDataById(this.activatedRoute.snapshot.params.id)
        },
        error => {
          return error
        }
      )
    this.fetchProfileObject(this.currentlyBeingEditedTray.id)
  }

  getTrayDataById(rack_fk: number): void {
    this.rackService.getTrayDataById(rack_fk).subscribe(
      data => {
        this.trayDataList = data
        this.trayDataList = this.trayDataList.map(newValue => ({
          ...newValue,
          cssClass: ''
        }))
      },
      error => {
        return error
      }
    )
  }

  fetchProfileObject(id: number): void {
    this.logger.log('Start of UserProfile : fetchProfileObject :id', id)
    this.rackService.fetchTrayById(id).subscribe(response => {
      this.currentlyBeingEditedTray = response
      this.logger.log(
        'End of UserProfile : fetchProfileObject :server response',
        this.currentlyBeingEditedTray
      )
      this.fetchFile(this.currentlyBeingEditedTray.id)
    })
  }

  pageRelode(): void {
    window.location.reload()
  }

  fetchNotificationByStoreId(userFk: number): void {
    this.logger.log(
      'start of the Appcomponent : fetchNotificationByStoreId :storeId',
      userFk
    )
    this.userService.fetchNotificationByStoreId(userFk).subscribe(response => {
      this.notifications = response
    })
    this.logger.log(
      'End of the Appcomponent : fetchNotificationByStoreId :response',

      this.notifications
    )
  }
  select(value: string, i): void {
    this.tab = i
    this.product = value
    this.templateTabAddColor = value
  }

  navigateToContactUsPage(): void {
    this.id = this.UserObj.clientFk
    this.logger.log(
      'Start of the Appcomponent: changePasswordByUserFk :UserObj.clientFk'
    )
    this.router.navigate(['/contactus'])
    this.logger.log('End of the Appcomponent: changePasswordByUserFk ')
  }

  epicFunction(): void {
    console.log('hello `Home` component')
    this.deviceInfo = this.deviceService.getDeviceInfo()
    this.isMobile = this.deviceService.isMobile()
    this.isDesktopDevice = this.deviceService.isDesktop()
  }

  refreshPageMobileView(action: string, i: number): void {
    this.tab = i
    action = 'racks'
    if (i !== undefined) {
      localStorage.setItem('tabindex', i.toString())
    }
    this.router.navigate([`/${action}`])
  }

  onClick(event): void {
    const imgElem = event.target
    var target = event.target || event.srcElement || event.currentTarget
    var srcAttr = target.attributes.src
    this.imgSrc = srcAttr.nodeValue
  }

  clearInputsInBootstrap() {
    $('input[type=email]').each(function () {
      $(this).val('')
    })
    $('#message').val('')
  }

  reloadPage(): void {
    this.router.navigate(['/'])
  }

  changePassword() {
    sessionStorage.setItem('redirect_to', `/dashboard`)
    window.location.reload()
  }
}
