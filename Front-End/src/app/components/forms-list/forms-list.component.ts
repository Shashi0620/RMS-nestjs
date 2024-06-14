/* eslint-disable no-empty */
/* eslint-disable github/array-foreach */
/* eslint-disable i18n-text/no-en */
/*
 * This is form-list.component.ts
 */
import {Component, OnInit, ViewChild} from '@angular/core'
import {Product} from '../../models/form.model'
import {FormService} from './../../services/app.form.service'
import {ActivatedRoute, Router} from '@angular/router'
import {MatTableDataSource} from '@angular/material/table'
import swal from 'sweetalert2'
import {HttpClient} from '@angular/common/http'
import {MatPaginator, PageEvent} from '@angular/material/paginator'
import {environment} from '../../../environments/environment'
import {UserPreference} from '../../models/userpreference.model'
import {AlertService} from '../_alert'
import {User} from '../../models/user.model'
import {LogService} from '../../services/log.service'
import {UserPreferenceService} from '../../../app/userPreference.service'
import {Subject} from 'rxjs'
const columnLength = environment.columnLength
const frontendUrl = environment.frontendBaseUrl
interface CustomColumn {
  possition: number
  name: string
  isActive: boolean
}

@Component({
  selector: 'app-forms-list',
  templateUrl: './forms-list.component.html',
  styleUrls: ['./forms-list.component.css']
})
export class FormListComponent implements OnInit {
  products?: Product[]
  columnShowHideList: CustomColumn[] = []
  currentTemplate?: Product
  currentIndex = -1
  name = ''
  tempid = 0
  clientFk = 0
  UserObj: User = {}
  templateName: string
  length: number
  pageSize = 5
  pageSizeOptions: number[] = [5, 10, 25, 100]
  pageEvent: PageEvent
  options = {
    autoClose: true,
    keepAfterRouteChange: false
  }
  currentPage = 0
  showNextButton: boolean
  showprvtButton: boolean

  userPreference: UserPreference = {
    id: 0,
    userFk: 0,
    templateId: 0,
    selectedColumns: ''
  }

  userSelectedColumns: string[]

  showHideColumn = false

  displayedColumns: string[] = []
  selectedColumns = this.displayedColumns.toString()
  @ViewChild(MatPaginator) paginator: MatPaginator
  allColumns: string
  formName: string
  formHeadingName: string
  totalRows: number
  product: string
  prouductSuport = 'product_support'
  public loading$ = new Subject<boolean>()
  constructor(
    private formService: FormService,
    private alertService: AlertService,
    private userPreferenceService: UserPreferenceService,
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient,
    private logger: LogService
  ) {
    route.params.subscribe(() => {
      this.tempid = this.route.snapshot.params['id']
      this.retrieveForms()
      this.UserObj = JSON.parse(sessionStorage.getItem('userObj'))
      this.clientFk = this.UserObj.clientFk
    })
  }

  dataSource = new MatTableDataSource<any>()
  ngOnInit(): void {
    this.loading$.next(true)
    //this.getData();
    this.tempid = this.route.snapshot.params['id']

    this.retrieveForms()
    this.UserObj = JSON.parse(sessionStorage.getItem('userObj'))
    this.clientFk = this.UserObj.clientFk
    // this.retrieveSelectedColumns(this.tempid, this.UserObj.id)
    this.product = localStorage.getItem('product')
    if (this.product === undefined || this.product === null) {
      this.product = 'Product'
    }
  }

  async handlePageEvent(e: PageEvent) {
    console.log({e})
    this.pageEvent = e
    this.totalRows = e.length
    this.pageSize = e.pageSize
    this.currentPage = e.pageIndex
    await this.retrieveForms()
  }

  async retrieveForms(): Promise<void> {
    this.formName = this.route.snapshot.params.name
    this.formHeadingName = this.formName.replace(/_/g, ' ')
    const schemaName = sessionStorage.getItem('clientName')
    this.formService
      .getTotalItemsOnStore(
        this.tempid,
        this.route.snapshot.params.name,
        schemaName
      )
      .subscribe(data => {
        this.length = data.length
      })
    this.formService
      .getAllProductsByItemTempIdpagination(
        this.tempid,
        this.route.snapshot.params.name,
        schemaName,
        this.currentPage,
        this.pageSize
      )
      .subscribe(data => {
        this.extractData(data)
        //  this.retrieveSelectedColumns(this.tempid, this.UserObj.id)
      })
  }

  refreshList(): void {
    this.retrieveForms()
    this.currentTemplate = undefined
    this.currentIndex = -1
  }

  setActiveTemplate(Template: Product, index: number): void {
    this.currentTemplate = Template
    this.currentIndex = index
  }

  removeAllTemplates(): void {
    this.formService.deleteAll().subscribe(() => {
      this.refreshList()
    })
  }

  searchTitle(): void {
    this.currentTemplate = undefined
    this.currentIndex = -1

    this.formService.findByFormsName(this.name).subscribe(data => {
      this.products = data
    })
  }

  deleteFormData(id): void {
    this.logger.log('Start of form-list-component : deleteFormData :id', id)
    const schemaName = sessionStorage.getItem('clientName')
    this.formService
      .deleteFormData(id, this.route.snapshot.params.name, schemaName)
      .subscribe(
        response => {
          this.alertService.error(response.message, this.options)

          // this.retrieveForms()
          this.logger.log('End of form-list-component : deleteFormData')
        },
        error => {
          this.alertService.error(error.error.message, this.options)
        }
      )
  }

  removeForm(id): void {
    swal({
      title: 'Please Confirm!',
      text:
        'By deleting this Product it will also deletes this product if you have added inside the tray , Do you want to procced?',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#00B96F',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, remove!'
    }).then(result => {
      if (result.value) {
        this.deleteFormData(id)
        this.retrieveForms()
        // this.router
        //   .navigateByUrl(
        //     `/menu/${this.route.snapshot.params.name}/${this.tempid}`,
        //     {skipLocationChange: true}
        //   )
        //   .then(() => {
        //     this.router.navigate(
        //       [`menu/${this.route.snapshot.params.name}/${this.tempid}`],
        //       {relativeTo: this.route}
        //     )
        //   })
      }
    })
  }

  addNewForm(): void {
    this.router.navigate([
      `/addForm/${this.route.snapshot.params.name}/${this.tempid}`
    ])
  }

  private extractData(serverData): void {
    this.logger.log(
      'Start of form-list-component : extractData :serverData',
      serverData
    )
    const rowDataList: any = []
    if (serverData.length !== 0) {
      serverData.forEach(dbRecord => {
        let rowdata
        //Prepare Row Data
        rowdata = Object.assign({Id: dbRecord.id})
        //rowdata = Object.assign(rowdata, {name: dbRecord.name})

        //Extract label and values from the Attributes
        dbRecord.attributes.forEach(dbRecordCol => {
          const colVal = dbRecordCol.value ? dbRecordCol.value : ''
          const colLabel = dbRecordCol.label
          rowdata = Object.assign(rowdata, {[colLabel]: colVal})
        })
        rowdata = Object.assign(rowdata, {
          Quantities: dbRecord.quantity
        })
        rowdata = Object.assign(rowdata, {
          Actions: ``
        })
        //push a record
        rowDataList.push(rowdata)
        this.logger.log(
          'End of form-list-component : extractData :response',
          rowdata
        )
      })

      //Extract column names
      this.displayedColumns = Object.getOwnPropertyNames(rowDataList[0])
      if (this.displayedColumns.length > columnLength) {
        this.showHideColumn = true
        this.initializeColumnProperties()
      }
      this.dataSource.data = rowDataList
      //this.length = rowDataList.length
    } else {
      this.dataSource.data = serverData
      this.displayedColumns = null
    }
  }

  initializeColumnProperties(): void {
    this.displayedColumns.forEach((element, index) => {
      if (this.columnShowHideList.length === this.displayedColumns.length - 1) {
      } else if (element === 'Actions') {
      } else {
        this.columnShowHideList.push({
          possition: index,
          name: element,
          isActive: true
        })
      }
    })
  }

  toggleColumn(column): void {
    if (column.isActive) {
      if (column.possition > this.displayedColumns.length - 1) {
        this.displayedColumns.push(column.name)
      } else {
        this.displayedColumns.splice(column.possition, 0, column.name)
      }
    } else {
      const i = this.displayedColumns.indexOf(column.name)
      const opr = i > -1 ? this.displayedColumns.splice(i, 1) : undefined
    }
  }

  saveUserSelected(): void {
    ;(this.userPreference.selectedColumns = this.displayedColumns.toString()),
      (this.userPreference.templateId = this.tempid),
      (this.userPreference.userFk = this.UserObj.id),
      (this.userPreference.id = this.userPreference.id)
    if (this.userPreference.id) {
      this.updateSelectedColumns(this.userPreference.id)
      this.refresh()
    } else {
      this.userPreferenceService
        .createUserPreference(this.userPreference)
        .subscribe(
          () => {
            this.alertService.success(
              'Selected Columns Saved Sucessfully',
              this.options
            )
            this.refresh()
          },
          error => {
            console.log(error)
          }
        )
    }
  }
  refresh(): void {
    window.location.reload()
  }

  retrieveSelectedColumns(tempid, userFk): void {
    this.userPreferenceService
      .getAllSelectedColumns(this.tempid, userFk)
      .subscribe(data => {
        if (data.length > 0) {
          this.userPreference = data[0]
          this.userSelectedColumns = data[0].selectedColumns.split(',')
          this.displayedColumns = this.userSelectedColumns
          this.columnShowHideList.forEach(element => {
            if (!this.displayedColumns.includes(element.name)) {
              element.isActive = false
            }
          })
        }
      })
  }

  toggleColumns(column): void {
    if (column.isActive) {
      if (column.possition > this.displayedColumns.length - 1) {
        this.displayedColumns.push(column.name)
      } else {
        this.displayedColumns.splice(column.possition, 0, column.name)
      }
    } else {
      const i = this.displayedColumns.indexOf(column.name)
      const opr = i > -1 ? this.displayedColumns.splice(i, 1) : undefined
    }
  }

  updateSelectedColumns(id: number): void {
    this.userPreferenceService
      .updateSelectedColumns(id, this.userPreference)
      .subscribe(data => {
        this.userPreference = data
      })
  }

  routeToProductEdit(formName: string, formId: number): void {
    this.router.navigate(['/EditForm', formName, formId])
  }
}
