/*
 * This is store-listing.component.ts
 */
import {Component, OnInit, ViewChild} from '@angular/core'
import {MatTableDataSource} from '@angular/material/table'
import {StoreService} from '../store.service'
import swal from 'sweetalert2'
import {MatPaginator} from '@angular/material/paginator'
import {AlertService} from '../components/_alert'
import {Router} from '@angular/router'
import {User} from '../models/user.model'
import {Store} from '../models/store.model'
import {LogService} from '../services/log.service'
import {environment} from 'src/environments/environment'
import {Plan} from '../models/plan.model'
@Component({
  selector: 'app-store-listing',
  templateUrl: './store-listing.component.html',
  styleUrls: ['./store-listing.component.css']
})
export class StoreListingComponent implements OnInit {
  UserObj: User = {}
  message = 'Store Deleted Successfully'
  options = {
    autoClose: true,
    keepAfterRouteChange: false
  }
  value: string
  storeTranslate: string
  stores: Store[] = []
  displayedColumns: string[] = ['storeName', 'address', 'actions']
  dataSource = new MatTableDataSource<Store[]>()
  storeSupport = 'store_support'
  PlanObj: Plan = {
    name: '',
    planImg: '',
    rate: 0
  }
  totalStoresCount = 0
  @ViewChild(MatPaginator) paginator: MatPaginator
  constructor(
    private storeService: StoreService,
    private alertService: AlertService,
    private router: Router,
    private logger: LogService
  ) {}

  ngOnInit(): void {
    this.UserObj = JSON.parse(sessionStorage.getItem('userObj'))
    this.storeTranslate = localStorage.getItem('Stores')
    this.getStores(this.UserObj.clientFk)
    this.value = localStorage.getItem('Stores')
    this.PlanObj = JSON.parse(sessionStorage.getItem('planObj'))
    if (this.PlanObj != null && this.PlanObj != undefined) {
      this.totalStoresCount = this.PlanObj[0].totalNoOfStores
    }
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator
  }
  async getStores(client_fk: number): Promise<void> {
    this.storeService
      .fetchAllStoresByClientFK(client_fk)
      .subscribe((data: undefined) => {
        this.dataSource.data = data
      })
  }

  deleteStore(id: number): void {
    swal({
      title: 'Please Confirm!',
      text:
        'By deleting this store it will also deletes related Notification settings of this Store, Do you want to procced?',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#00B96F',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, remove!'
    }).then(result => {
      if (result.value) {
        this.deleteStoreById(id)
        // this.reload()
      }
    })
  }

  async deleteStoreById(id): Promise<void> {
    this.logger.log('Start of StoreListing : deleteStoreById :id', id)
    this.storeService.deleteStoreById(id).subscribe(response => {
      if (response === 'deleted') {
        this.alertService.success(this.message, this.options)
      } else {
        this.alertService.error('Store is not deleted', this.options)
      }
    })
    this.ngOnInit()
    this.logger.log('End of StoreListing : deleteStoreById')
  }

  fetchNotificationsBelongsToStore(storeId): void {
    this.logger.log(
      'Start of StoreListing : fetchNotificationsBelongsToStore :storeId',
      storeId
    )
    this.router.navigate(['/fetchNotification', storeId])
    this.logger.log('End of StoreListing : fetchNotificationsBelongsToStore')
  }

  // reload(): void {
  //   window.location.reload()
  // }

  storeLimitPopUp(): void {
    swal({
      title: 'Stores limit alert!',
      text: 'You cannot add stores more than' + ' ' + this.totalStoresCount,
      type: 'warning',
      showCancelButton: false,
      confirmButtonColor: '#00B96F',
      confirmButtonText: 'Ok'
    })
  }
}
