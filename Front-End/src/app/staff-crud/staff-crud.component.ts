/*
 * This is staff-crud.component.ts
 */
import {Component, OnInit, ViewChild} from '@angular/core'
import {UserService} from '../services/user.service'
import {MatTableDataSource} from '@angular/material/table'
import swal from 'sweetalert2'
import {MatPaginator} from '@angular/material/paginator'
import {AlertService} from '../components/_alert'
import {User} from '../models/user.model'
import {Role} from '../models/role.model'
import {environment} from 'src/environments/environment'

@Component({
  selector: 'app-staff-crud',
  templateUrl: './staff-crud.component.html',
  styleUrls: ['./staff-crud.component.css']
})
export class StaffCrudComponent implements OnInit {
  UserObj: User = {}
  PlanObj = []
  displayedColumns: string[] = ['name', 'email', 'actions']
  dataSource = new MatTableDataSource<User>()

  @ViewChild(MatPaginator) paginator: MatPaginator
  constructor(
    private userService: UserService,
    private alertService: AlertService
  ) {}
  roleId: 0
  RoleObj: Role = {}
  RoleName = ''
  noOfstaff: User[] = []
  noOfUsers: any
  planName: ''
  options = {
    autoClose: true,
    keepAfterRouteChange: false
  }
  disable_button: boolean
  staffSupport = 'staff_support'
  staffTranslate: string

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator
  }
  value: String
  ngOnInit(): void {
    this.PlanObj = JSON.parse(sessionStorage.getItem('planObj'))
    this.RoleObj = JSON.parse(sessionStorage.getItem('roleObj'))
    this.staffTranslate = localStorage.getItem('Staff')
    this.disable_button = true
    if (this.PlanObj != null && this.PlanObj != undefined) {
      this.RoleName = this.RoleObj[0].name
      this.planName = this.PlanObj[0].name
      this.noOfUsers = this.PlanObj[0].noOfUsers
    }

    this.getStaffByRole()
    this.UserObj = JSON.parse(sessionStorage.getItem('userObj'))

    this.value = localStorage.getItem('Staff')
  }

  getClientStaffList(): void {
    this.userService
      .getClientStaffList(this.UserObj.clientFk, this.roleId)
      .subscribe(data => {
        this.noOfstaff = data
        this.dataSource.data = data
      })
  }

  getStaffByRole(): void {
    this.userService.getStaffRole().subscribe(data => {
      this.roleId = data[0].id
      this.getClientStaffList()
    })
  }

  deleteStaff(id): void {
    swal({
      title: 'Please Confirm!',
      text:
        'By deleting this staff you cant able to create a new staff with same name, Do you want to procced??',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#00B96F',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, remove!'
    }).then(result => {
      if (result.value) {
        this.deleteStaffById(id)
        //  window.location.reload()
      }
    })
  }

  staffLimitPopUp(): void {
    if (this.PlanObj[0].name === 'Company/Traders') {
      swal({
        title: 'Staffs limit alert!',
        text: 'According to your plan you can create only 5 staffs',
        type: 'warning',
        showCancelButton: false,
        confirmButtonColor: '#00B96F',
        confirmButtonText: 'Ok'
      })
    } else if (this.PlanObj[0].name === 'Personal') {
      swal({
        title: 'Are you sure?',
        text: 'According to your plan you can create only 1 staff',
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#00B96F',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Ok'
      })
    } else {
      swal({
        title: 'Are you sure?',
        text: 'According to your plan you can create only 25 staffs',
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#00B96F',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Ok'
      })
    }
  }

  deleteStaffById(id): void {
    this.userService.delete(id).subscribe(() => {
      this.alertService.success('Staff Deleted Successfully', this.options)
      this.userService.getClientStaffList(this.UserObj.clientFk, this.roleId)
      this.getClientStaffList()
    })
  }
}
