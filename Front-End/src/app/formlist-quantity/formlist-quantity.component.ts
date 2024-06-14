/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable no-undef */
/* eslint-disable i18n-text/no-en */
/* eslint-disable @typescript-eslint/prefer-for-of */
/* eslint-disable github/array-foreach */
import {Component, Input, OnInit, ViewChild} from '@angular/core'
import {MatTableDataSource} from '@angular/material/table'
import {AlertService} from '../components/_alert'
import {FormService} from '../services/app.form.service'
import {RackService} from '../services/rack.service'
import * as $ from 'jquery'
import {UserService} from '../services/user.service'
import {MatPaginator} from '@angular/material/paginator'
import {NotificationService} from '../notification.service'
//import {Template} from '@angular/compiler/src/render3/r3_ast'
import {User} from '../models/user.model'
import {Notification} from '../models/notification.model'
import {NotificationSetting} from '../models/notificationSetting.model'
import swal from 'sweetalert2'
import {LogService} from '../services/log.service'
import {ActivatedRoute, Router} from '@angular/router'
import {Template} from '../models/template.model'
@Component({
  selector: 'app-formlist-quantity',
  templateUrl: './formlist-quantity.component.html',
  styleUrls: ['./formlist-quantity.component.css']
})
export class FormlistQuantityComponent implements OnInit {
  trayItems = {
    id: 0,
    quantity: 0,
    trayId: 0,
    formId: 0,
    rackId: 0,
    userFk: 0,
    tempId: 0,
    upperLimit: 0,
    lowerLimit: 0,
    notificationSettngFk: 0,
    rackName: '',
    trayName: '',
    productName: '',
    productTranslate: '',
    username: ''
  }

  @Input()
  selectedTemplate: Template

  @Input()
  isTrayView: boolean

  @Input()
  trayId: number

  @Input()
  rackId: number

  @Input()
  rackName: string
  //this rowDataList stores a dynamically generated column so any is used
  rowDataList: any = []
  //this trayData stores a dynamically generated column so any is used
  trayData: any
  templateName: string
  //filteredTemplates: Template[]
  //this trayViewData stores a dynamically generated column so any is used
  trayViewData: any = []
  options = {
    autoClose: true,
    keepAfterRouteChange: false
  }
  // switchButtonItemAndTray = false
  elasticSearch = {
    name: '',
    rackId: 0,
    username: '',
    attributes: [{}]
  }

  notification = {
    id: 0,
    settingName: '',
    location: ''
  }
  //this datasource stores a dynamically generated column so any is used
  dataSource = new MatTableDataSource<any>()
  pageSize = 5
  currentPage = 0
  quantity: string
  upperLimit: number
  lowerLimit: number
  notificationSettngFk: number
  schemaName: string
  displayedColumns: string[] = []

  UserObj: User = {}

  text: any
  notificationList: Notification[]
  notificationSetting: NotificationSetting = {
    settingName: '',
    notificationType: '',
    isEscalationRequired: false,
    storeFk: 0
  }
  value: string
  tray: string
  trayName: string

  @ViewChild(MatPaginator) paginator: MatPaginator
  formId: number
  totalNoOfQuantities: number
  constructor(
    private formService: FormService,
    private rackService: RackService,
    private alertService: AlertService,
    private notificationService: NotificationService,
    private logger: LogService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    console.log('selectedTemplate:', this.selectedTemplate)
    this.value = localStorage.getItem('item')
    if (this.value === null) {
      this.value = 'Product'
    }
    this.UserObj = JSON.parse(sessionStorage.getItem('userObj'))

    this.elasticSearch.username = this.UserObj.username
    this.trayItems.userFk = this.UserObj.id
    //this.retrieveForms()
    this.tray = localStorage.getItem('tray')
    if (this.tray === null) {
      this.tray = 'tray'
    }
    this.trayName = this.route.snapshot.params.trayName
    this.fetchNotificationsByRackId()
    this.schemaName = sessionStorage.getItem('clientName')
  }

  /**
   *There is no use of this method so removed */

  onLowerLimit(lowerLimit): void {
    this.lowerLimit = lowerLimit.target.value
  }

  onUpperLimit(upperLimit): void {
    this.upperLimit = upperLimit.target.value
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator
  }

  retrieveForms(): void {
    this.formService
      .getAllProductsByItemTempId(
        this.selectedTemplate.id,
        this.selectedTemplate.name.replace(/ /g, '_'),
        this.schemaName,
        this.currentPage,
        this.pageSize
      )
      .subscribe(data => {
        this.extractData(data)
      })
  }

  validateUserEnteredQuantityInCheckIn(x, totalProductQuantity): void {
    // appending the updated value to the variable
    if (
      x.target.value === '' ||
      (x.target.value > 0 && x.target.value < totalProductQuantity)
    ) {
      this.text = x.target.value
    } else {
      this.showCheckInQuantityWarningPopUp()
    }
  }

  validateUserEnteredQuantityInCheckOut(x, totalTrayQuantity): void {
    // appending the updated value to the variable
    if (
      x.target.value === '' ||
      (x.target.value > 0 && x.target.value <= totalTrayQuantity)
    ) {
      this.text = x.target.value
    } else {
      this.showCheckOutQuantityWarningPopUp()
    }
  }

  private async showCheckOutQuantityWarningPopUp(): Promise<void> {
    swal({
      title: 'Quantity Alert!',
      text: `Quantity of ${this.value} checked out from the ${this.tray} is higher than available`,
      type: 'warning',
      showCancelButton: false,
      confirmButtonColor: '#00B96F',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Ok'
    })
  }

  private async showCheckInQuantityWarningPopUp(): Promise<void> {
    swal({
      title: 'Quantity Alert!',
      text: `Quantity of ${this.value} checked into the ${this.tray} is higher than available`,
      type: 'warning',
      showCancelButton: false,
      confirmButtonColor: '#00B96F',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Ok'
    })
  }

  fetchAllProducts(): void {
    this.formService
      .getAllProductsByItemTempId(
        this.selectedTemplate.id,
        this.selectedTemplate.name.replace(/ /g, '_'),
        this.schemaName,
        this.currentPage,
        this.pageSize
      )
      .subscribe(data => {
        this.editFormList(data)
      })
  }

  updateQuantityOnCheckout(formId): void {
    this.trayItems.lowerLimit = this.lowerLimit
    this.trayItems.upperLimit = this.upperLimit
    this.trayItems.formId = formId
    this.trayItems.trayId = this.trayId
    this.trayItems.rackId = this.rackId
    this.trayItems.tempId = this.selectedTemplate.id
    this.trayItems.userFk = this.UserObj.id
    this.trayItems.notificationSettngFk = this.notificationSettngFk
    this.rackService
      .fetchTrayTemplateAndFormById(
        this.trayItems.trayId,
        this.trayItems.tempId,
        this.trayItems.formId
      )
      .subscribe(response => {
        if (response.length > 0) {
          this.trayItems.id = response[0].id
          this.trayItems.quantity = response[0].quantity
          this.trayItems.trayName = this.trayName
          this.trayItems.rackName = this.rackName
          this.trayItems.productTranslate = this.value
          this.trayItems.username = this.UserObj.username
          this.rackService
            .updateTrayItem(response[0].id, parseInt(this.text), this.trayItems)
            .subscribe(
              () => {
                this.text = 0
                this.alertService.success(
                  'Successfully Checked out',
                  this.options
                ),
                  ($('#closePopUp') as any).click()

                this.dataSource.data.length = 0
                this.retrieveForms()
              },
              error => {
                this.alertService.error(error.error.message, this.options)
              }
            )
        }
      })
  }

  updateQuantityOnCheckIn(trayId): void {
    this.trayItems.formId = this.formId
    this.trayItems.trayId = this.trayId
    this.trayItems.rackId = this.rackId
    this.trayItems.tempId = this.selectedTemplate.id
    this.trayItems.id = 0
    this.rackService
      .fetchTrayTemplateAndFormById(
        this.trayItems.trayId,
        this.trayItems.tempId,
        this.trayItems.formId
      )
      .subscribe(response => {
        if (response.length > 0) {
          this.trayItems.id = response[0].id
        }
        if (this.text === undefined || Number.isNaN(parseInt(this.text))) {
          this.trayItems.quantity = 0
        } else {
          this.trayItems.quantity = parseInt(this.text)
        }
        this.rackService
          .createTrayItems(
            this.trayItems,
            this.selectedTemplate.name.replace(/ /g, '_'),
            this.schemaName
          )
          .subscribe(
            response => {
              this.alertService.success('Successfully Checked In', this.options)
              this.fetchAllProducts()
            },
            error => {
              this.alertService.error(error.error.message, this.options)
            }
          )
      })
  }

  formListing(serverData): void {
    const rowDataList: any = []
    serverData.forEach(dbRecord => {
      let rowdata
      // Prepare Row Data
      rowdata = Object.assign({Id: dbRecord.id})

      // Extract label and values from the Attributes
      dbRecord.attributes.forEach(dbRecordCol => {
        const colVal = dbRecordCol.value ? dbRecordCol.value : ''
        const colLabel = dbRecordCol.label
        rowdata = Object.assign(rowdata, {[colLabel]: colVal})
      })
      rowdata = Object.assign(rowdata, {
        TotalQuantities: dbRecord.quantity
      })
      this.totalNoOfQuantities = dbRecord.quantity
      rowdata = Object.assign(rowdata, {Quantity: this.quantity})

      rowdata = Object.assign(rowdata, {Actions: ``})
      //push a record
      rowDataList.push(rowdata)
    })

    //Extract column names
    this.displayedColumns = Object.getOwnPropertyNames(rowDataList[0])
    this.dataSource.data = rowDataList
  }
  private extractData(serverData): void {
    // Prepare Row Data

    // rowdata = Object.assign(rowdata, {"name":dbRecord.name})
    if (this.isTrayView) {
      this.fetchTrayView(serverData)
    } else {
      this.formListing(serverData)
    }
  }

  fetchTrayView(trayData): void {
    const rowDataList: any = []
    trayData.forEach(dbRecord => {
      let rowdata
      this.rackService
        .fetchTemplateAndTrayById(this.selectedTemplate.id, this.trayId)
        .subscribe(response => {
          if (response.length > 0) {
            this.text = response[0].quantity
            rowdata = Object.assign({Id: dbRecord.id})
            for (let i = 0; i < response.length; i++) {
              if (dbRecord.id === response[i].formId) {
                this.quantity = response[i].quantity
                dbRecord.attributes.forEach(dbRecordCol => {
                  const colVal = dbRecordCol.value ? dbRecordCol.value : ''
                  const colLabel = dbRecordCol.label
                  rowdata = Object.assign(rowdata, {[colLabel]: colVal})
                })
                rowdata = Object.assign(rowdata, {
                  TotalQuantities: response[i].quantity
                })
                rowdata = Object.assign(rowdata, {
                  Quantity: this.quantity
                })
                this.totalNoOfQuantities = response[i].quantity
                this.getUpperAndLowerLimit(dbRecord.id, this.trayId)
                rowdata = Object.assign(rowdata, {Actions: ``})
                rowDataList.push(rowdata)
                this.displayedColumns = Object.getOwnPropertyNames(
                  rowDataList[0]
                )
                this.dataSource.data = rowDataList
              }
            }
          } else {
            this.displayedColumns = null
            this.dataSource.data = null
          }
        })
    }) 
  }

  getUpperAndLowerLimit(formId: number, trayId: number): void {
    this.formId = formId
    this.trayItems.formId = this.formId
    this.trayItems.trayId = this.trayId
    this.trayItems.rackId = this.rackId
    this.trayItems.tempId = this.selectedTemplate.id
    this.rackService
      .fetchTrayTemplateAndFormById(
        this.trayItems.trayId,
        this.trayItems.tempId,
        this.trayItems.formId
      )
      .subscribe(response => {
        if (response.length > 0) {
          this.formService
            .fetchUpperAndLowerLimit(response[0].id)
            .subscribe(data => {
              data
              this.upperLimit = data[0].upperLimit
              this.lowerLimit = data[0].lowerLimit
              this.notificationSettngFk = data[0].notificationSettngFk
            })
        } else {
          this.upperLimit = null
          this.lowerLimit = null
          this.notificationSettngFk = null
        }
      })
  }

  updateUpperAndLowerLimit(): void {
    this.trayItems.lowerLimit = this.lowerLimit
    this.trayItems.upperLimit = this.upperLimit
    this.trayItems.formId = this.formId
    this.trayItems.trayId = this.trayId
    this.trayItems.rackId = this.rackId
    this.trayItems.tempId = this.selectedTemplate.id
    this.trayItems.notificationSettngFk = this.notificationSettngFk
    this.rackService
      .fetchTrayTemplateAndFormById(
        this.trayItems.trayId,
        this.trayItems.tempId,
        this.trayItems.formId
      )
      .subscribe(response => {
        if (response.length > 0) {
          this.trayItems.id = response[0].id
          this.rackService
            .updateLowerAndUpperLimit(response[0].id, this.trayItems)
            .subscribe(
              () => {
                this.alertService.success(
                  'Notification Alert Setted Successfully',
                  this.options
                ),
                  ($('#closePopUp') as any).click()
              },
              error => {
                this.alertService.error(error.error.message, this.options)
              }
            )
        }
      })
  }

  editFormList(serverData): void {
    const rowDataList: any = []
    serverData.forEach(dbRecord => {
      let rowdata
      // Prepare Row Data
      rowdata = Object.assign({Id: dbRecord.id})

      // Extract label and values from the Attributes
      dbRecord.attributes.forEach(dbRecordCol => {
        const colVal = dbRecordCol.value ? dbRecordCol.value : ''
        const colLabel = dbRecordCol.label
        rowdata = Object.assign(rowdata, {[colLabel]: colVal})
      })
      rowdata = Object.assign(rowdata, {
        TotalQuantities: dbRecord.quantity
      })
      this.totalNoOfQuantities = dbRecord.quantity
      rowdata = Object.assign(rowdata, {Quantity: ``})
      rowdata = Object.assign(rowdata, {Actions: ``})
      // push a record
      rowDataList.push(rowdata)
    })
    //Extract column names
    this.displayedColumns = Object.getOwnPropertyNames(rowDataList[0])
    this.rackService
      .fetchTemplateAndTrayById(this.selectedTemplate.id, this.trayId)
      .subscribe(response => {
        this.dataSource.data = this.filterObjects(rowDataList, response)
        this.dataSource.data = this.dataSource.data.sort((a, b) => b.id - a.id)
      })
  }

  filterObjects = (arr1, arr2) => {
    let res = []
    res = arr1.filter(formList => {
      return !arr2.find(retrievedFromDb => {
        return retrievedFromDb.formId === formList.id
      })
    })
    return res
  }

  retriveItems(): void {
    if (this.isTrayView) {
      this.retrieveForms()
    } else {
      this.fetchAllProducts()
      this.quantity = null
      this.text = null
    }
  }

  private async fetchNotificationsByRackId(): Promise<void> {
    this.notificationService
      .fetchAllNotificationSettingsOnRackId(this.rackId)
      .subscribe(response => {
        this.notificationList = response
      })
  }

  onClickUpdateQuantityOnCheckIn(formId) {
    this.formId = formId
    this.updateQuantityOnCheckIn(this.formId)
  }
}
