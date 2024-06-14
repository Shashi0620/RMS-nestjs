/* eslint-disable prettier/prettier */
/* eslint-disable no-undef */
/* eslint-disable import/named */
/* eslint-disable i18n-text/no-en */
/*
 * This is rack-list.component.ts
 */
import {ActivatedRoute, Router} from '@angular/router'
import {Component, OnInit, ViewChild} from '@angular/core'
import {RackService} from '../../services/rack.service'
import {DatePipe} from '@angular/common'
import {MatTableDataSource} from '@angular/material/table'
import {MatPaginator} from '@angular/material/paginator'
import {AlertService} from '../_alert/alert.service'
import swal from 'sweetalert2'
import {Rack} from '../../models/rack.model'
import {User} from '../../models/user.model'
import {Plan} from '../../models/plan.model'
import {LogService} from '../../services/log.service'
import {Role} from '../../models/role.model'
import {Observable, catchError, of} from 'rxjs'

@Component({
  selector: 'app-rack-list',
  templateUrl: './rack-list.component.html',
  styleUrls: ['./rack-list.component.css']
})
export class RackListComponent implements OnInit {
  rackObject: Rack
  client_fk: number
  allRacks: boolean
  deleted: string
  rackArray?: Rack[]
  userId?: number
  searchString: string
  storeRackTrayName: boolean
  displayedColumns: string[] = ['name', 'store-name', 'createdAt', 'actions']
  storeRackTrayNameColumns: string[] = [
    'StoreName',
    'RackName',
    'TrayName',
    'Actions'
  ]
  dataSource = new MatTableDataSource<Rack>()
  storeRackTrayNames = new MatTableDataSource<string>()
  rackObj: Rack = {
    name: '',
    createdon: '',
    client_fk: 0
  }
  options = {
    autoClose: true,
    keepAfterRouteChange: false
  }

  @ViewChild(MatPaginator) paginator: MatPaginator
  search = ''
  datePicker = ''
  UserObj: User = {}
  RoleObj: Role = {}
  PlanObj: Plan = {
    name: '',
    planImg: '',
    rate: 0
  }
  RoleName = ''
  noOfRackscreated: Rack[] = []
  noOfRacks: number = 0
  isRackCreated = true
  schemaName: string
  trayID: number
  rack_support = 'racks_support'
  errorMessage: any
  storeTranslate: string
  racksTranslate: string

  constructor(
    private rackService: RackService,
    public datepipe: DatePipe,
    private router: Router,
    private alertService: AlertService,
    private route: ActivatedRoute,
    private logger: LogService
  ) {}
  rackName: string
  storeName: string
  trayName: string
  ngOnInit(): void {
    this.UserObj = JSON.parse(sessionStorage.getItem('userObj'))
    this.rackListing(this.UserObj.clientFk)
    this.storeTranslate = localStorage.getItem('Stores')
    this.racksTranslate = localStorage.getItem('Racks')
    this.RoleObj = JSON.parse(sessionStorage.getItem('roleObj'))
    this.RoleName = this.RoleObj[0].name
    this.PlanObj = JSON.parse(sessionStorage.getItem('planObj'))
    if (this.PlanObj != null && this.PlanObj != undefined) {
      this.noOfRacks = this.PlanObj[0].noOfRacks
    }

    this.rackObj.client_fk = this.route.snapshot.params.id
    this.rackName = localStorage.getItem('Racks')
    this.storeName = localStorage.getItem('Stores')
    this.trayName = localStorage.getItem('tray')
    this.client_fk = this.UserObj.clientFk
    this.userId = this.UserObj.id
    this.schemaName = sessionStorage.getItem('clientName')
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator
  }

  fetchRackById(id: number): void {
    this.logger.log('Start of RackListComponent : fetchRackById :id', id)
    this.rackService.getRackById(id).subscribe(response => {
      this.rackObject = response
      this.logger.log(
        'End of RackListComponent : fetchRackById :response',
        this.rackObject
      )
      this.router.navigate(['/editRack', this.rackObject.id])
    })
  }

  fetchTrayView(id: number, name: string): void {
    this.logger.log(
      'Start of RackListComponent : fetchTrayView :id',
      id,
      'name',
      name
    )
    this.router.navigate(['/racklayout', id, name])
    this.logger.log('End of RackListComponent : fetchTrayView')
  }

  fetchTrayViewAfterSearch(id: number, trayId: number, name: string): void {
    this.logger.log(
      'Start of RackListComponent : fetchTrayView :id',
      id,
      'name',
      name,
      'trayId',
      trayId
    )
    this.router.navigate(['/racksearchlayout', id, trayId, name])
    this.logger.log('End of RackListComponent : fetchTrayView')
  }

  deleteRack(id): void {
    this.logger.log('Start of RackListComponent : deleteRack :id', id)
    swal({
      title: 'Please Confirm!',
      text:
        'By deleting this Rack it will also deletes related trays and tray items of this Rack, Do you want to procced?',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#00B96F',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, remove!'
    }).then(result => {
      if (result.value) {
        this.deleteRackById(id)
        //window.location.reload()
      }
    })
    this.logger.log('End of RackListComponent : deleteRack')
  }

  async deleteRackById(id: number): Promise<void> {
    this.logger.log('Start of RackListComponent : deleteRackById :id', id)
    this.rackService.deleteRackById(id).subscribe((response: string) => {
      this.deleted = response
      this.alertService.success('Rack Deleted Successfully', this.options)
      this.logger.log('End of RackListComponent : deleteRackById')
      this.rackListing(this.UserObj.clientFk)
    })
  }

  handleError(err: ErrorEvent): void {
    alert(err)
  }

  async rackListing(client_fk: number): Promise<void> {
    this.logger.log(
      'Start of RackListComponent : rackListing :client_fk',
      client_fk
    )
    this.rackService.fetchAllRacks(client_fk).subscribe((data: Rack[]) => {
      this.noOfRackscreated = data
      this.dataSource.data = data
      if (
        this.noOfRackscreated.length < this.noOfRacks &&
        this.RoleName === 'Admin'
      ) {
        this.isRackCreated = true
      }

      this.logger.log('End of RackListComponent : rackListing: response', data)
    })
  }
  cancel(): void {
    this.router.navigate(['/createRack'])
  }

  applyFilter(filterValue: string): void {
    this.logger.log(
      'Start of RackListComponent : rackListing :filterValue',
      filterValue
    )
    filterValue = filterValue.trim() // Remove whitespace
    filterValue = filterValue.toLowerCase() // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue
    this.logger.log('Start of RackListComponent : applyFilter ')
  }

  rackSearchListing(searchString, userid, clientFk, schemaName): void {
    this.logger.log(
      'Start of RackListComponent : rackListing :filterValue',
      searchString
    )
    if (searchString === undefined || searchString === '') {
      this.allRacks = true
      this.storeRackTrayName = false
    } else {
      this.storeRackTrayName = true
      this.allRacks = false
      this.rackService
        .serachProductByRack(searchString, userid, clientFk, schemaName)
        .pipe(
          catchError(
            (error: any): Observable<any> => {
              console.error('There was an error!', error)
              if (error.status === 500) {
                this.storeRackTrayNames.data = []
              }

              return of()
            }
          )
        )
        .subscribe((data: string[]) => {
          this.storeRackTrayNames.data = data
        })

      this.logger.log('Start of RackListComponent : searchString ')
    }
  }

  private async racksLimitPopUp(): Promise<void> {
    if (this.PlanObj[0].name === 'Company/Traders') {
      swal({
        title: 'Racks limit alert!',
        text: 'According to your plan you can create only 10 Racks',
        type: 'warning',
        showCancelButton: false,
        confirmButtonColor: '#00B96F',
        confirmButtonText: 'Ok'
      })
    } else if (this.PlanObj[0].name === 'Personal') {
      swal({
        title: 'Are you sure?',
        text: 'According to your plan you can create only 2 Racks',
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#00B96F',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Ok'
      })
    } else {
      swal({
        title: 'Are you sure?',
        text: 'According to your plan you can create only 50 Racks',
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#00B96F',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Ok'
      })
    }
  }
}
