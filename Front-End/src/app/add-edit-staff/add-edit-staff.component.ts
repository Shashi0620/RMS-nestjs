/* eslint-disable github/array-foreach */
/* eslint-disable @typescript-eslint/prefer-for-of */
/* eslint-disable no-console */
/* eslint-disable no-useless-concat */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/unbound-method */
/* eslint-disable no-undef */
/* eslint-disable import/named */
/*
 * This is add-edit-staff.component.ts file
 */
import {Component, OnInit} from '@angular/core'
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms'
import {ActivatedRoute, Router} from '@angular/router'
import {UserService} from '../services/user.service'
import {Staff} from '../models/staff.model'
import {StoreService} from '../store.service'
import {Store} from '../models/store.model'
import {User} from '../models/user.model'
import {Plan} from '../models/plan.model'
import swal from 'sweetalert2'

@Component({
  selector: 'app-add-edit-staff',
  templateUrl: './add-edit-staff.component.html',
  styleUrls: ['./add-edit-staff.component.css']
})
export class AddStaffComponent implements OnInit {
  id?: number
  catFlag = false
  addForm?: boolean
  dropdownList = []
  selected: string[]
  dropdownSettings = {}

  staff: Staff = {
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  }
  storeList: Store[]
  UserObj: User = {}
  PlanObj: Plan = {
    name: '',
    planImg: '',
    rate: 0
  }

  staffRoleID: ''
  clientName: ''
  isStorePresent = true
  storeName: string
  staffObj: Staff = {
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    selectedStores: []
  }
  store: Store = {
    storeId: 0,
    storeName: '',
    location: ''
  }
  noOfUsers: ''
  isExist = false

  constructor(
    private userService: UserService,
    private storeService: StoreService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  loading = false
  submitted = false
  staffForm: FormGroup
  showPasswordNotMatching = false
  value: String
  stores: string
  ngOnInit(): void {
    this.dropdownSettings = {
      singleSelection: false,
      idField: 'storeId',
      textField: 'storeName',
      selectAllText: 'Select All',
      unSelectAllText: 'Unselect All',
      itemsShowLimit: 3
    }
    this.id = this.route.snapshot.params.id
    this.addForm = !this.id
    this.PlanObj = JSON.parse(sessionStorage.getItem('planObj'))
    this.UserObj = JSON.parse(sessionStorage.getItem('userObj'))
    this.getStaffRole()
    this.getClientName(this.UserObj.clientFk)
    this.staffForm = this.formBuilder.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      selectedStore: [this.storeList, Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(6)]],
      clientFk: this.UserObj.clientFk,
      status: 'ACTIVE',
      roleId: this.staffRoleID,
      storeFk: null,
      stores: {}
    })
    // if (this.PlanObj[0].name === 'Personal') {
    //   this.isStorePresent = false
    //   this.staffForm.value.storeFk = null
    // }
    this.getStores(this.UserObj.clientFk)
    if (this.route.snapshot.params.id) {
      this.getStaffData(this.route.snapshot.params.id)
    }
    this.value = localStorage.getItem('Staff')
    this.stores = localStorage.getItem('Stores')
  }

  getStores(client_fk): void {
    this.storeService.fetchAllStoresByClientFK(client_fk).subscribe(
      (data: Store[]) => {
        this.storeList = data
      },
      error => {
        this.handleError(error.message)
      }
    )
  }

  get f(): {[key: string]: AbstractControl} {
    return this.staffForm.controls
  }

  async saveClientStaff(): Promise<void> {
    this.submitted = true
    this.staffForm.controls['selectedStore'].setErrors(null)
    this.staffForm.controls['selectedStore'].markAsTouched()
    if (this.staffForm.invalid) {
      return
    }

    if (this.staffForm.value.password != this.staffForm.value.confirmPassword) {
      this.showPasswordNotMatching = true
    } else {
      this.showPasswordNotMatching = false
      if (this.staff.password === this.staff.confirmPassword) {
        if (this.route.snapshot.params.id) {
          return this.updateClientStaff()
        }
        this.staffForm.value.roleId = this.staffRoleID
        this.staffForm.value.username = `${this.clientName}.${this.staffForm.value.username}`
        this.staffForm.value.stores = this.staffObj.selectedStores
        this.userService
          .backendValidation(
            this.staffForm.value.username,
            this.staffForm.value.email
          )
          .subscribe(
            response => {
              if (response.length > 0) {
                this.isExist = true
              } else
                this.userService
                  .saveClientStaff(this.clientName, this.staffForm.value)
                  .subscribe(
                    async () => {
                      this.submitted = true
                      this.getSelectedValue()
                      await this.showStaffCreatedPopUp()
                    },
                    error => {
                      this.handleError(error.message)
                    }
                  )
            },
            error => {
              this.handleError(error.message)
            }
          )
      }
    }
  }

  async showStaffCreatedPopUp(): Promise<void> {
    swal({
      title: 'Staff Registered Successfully!',
      text:
        'Staff registered successfully, Please inform him/her to check there mail for login credentials',
      type: 'success',
      showCancelButton: false,
      confirmButtonColor: '#00B96F',
      confirmButtonText: 'Ok'
    }).then(result => {
      if (result.value) {
        this.router.navigate(['/staff'])
      }
    })
  }

  updateClientStaff(): void {
    this.submitted = true
    this.staffForm.controls['selectedStore'].setErrors(null)
    this.staffForm.controls['selectedStore'].markAsTouched()
    if (this.staffForm.invalid) {
      return
    }
    this.staffForm.value.stores = this.staffObj.selectedStores
    this.staffForm.value.roleId = this.staffRoleID
    this.userService
      .updateClientStaff(this.route.snapshot.params.id, this.staffForm.value)
      .subscribe(
        () => {
          this.submitted = true
          this.router.navigate(['/staff'])
        },
        error => {
          this.handleError(error.message)
        }
      )
  }

  getStaffRole(): void {
    this.userService.getStaffRole().subscribe(
      data => {
        this.staffRoleID = data[0].id
      },
      error => {
        this.handleError(error.message)
      }
    )
  }

  getClientName(id: number): void {
    this.userService.getClientName(id).subscribe(
      data => {
        this.clientName = data[0].name
      },
      error => {
        this.handleError(error.message)
      }
    )
  }

  getStaffData(id: number): void {
    this.userService.get(id).subscribe(
      data => {
        this.staffObj = data.staff
        this.staffObj.username = data.staff.username
        this.staffObj.password = data.staff.password
        this.staffObj.confirmPassword = data.staff.password
        this.staffObj.email = data.staff.email
        this.staffObj.selectedStores = data.staff.stores
      },
      error => {
        this.handleError(error.message)
      }
    )
  }

  handleError(err: ErrorEvent): void {
    alert(err)
  }

  onItemSelect(item: string): void {
    this.selected.push(item)
  }

  onSelectAll(items: string): void {
    this.selected.push(items)
  }

  getSelectedValue(): void {
    this.selected
  }
}
