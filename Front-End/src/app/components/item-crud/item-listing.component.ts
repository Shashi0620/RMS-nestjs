/*
 * This is item-listing.component.ts
 */
import {SelectionModel} from '@angular/cdk/collections'
import {Component, ViewChild} from '@angular/core'
import {MatTableDataSource} from '@angular/material/table'
import {FormService} from '../../services/app.form.service'
import {User} from '../../models/user.model'
import {Template} from '../../models/template.model'
import {ActivatedRoute, Router} from '@angular/router'
import {MenuService} from '../../services/menu.service'
import {Tray} from '../../models/tray.model'
import {FormlistQuantityComponent} from '../../formlist-quantity/formlist-quantity.component'
import {AlertService} from '../_alert/alert.service'

@Component({
  selector: 'item-listing',
  templateUrl: 'item-listing.component.html'
})
export class ItemListingComponent {
  @ViewChild('child') child: FormlistQuantityComponent
  displayedColumns: string[] = []
  dataSource = new MatTableDataSource<Template>()
  selection = new SelectionModel<Template>(true, [])

  templateList: Template[]
  associatedtemplateList: Template[]

  selectedTemplate: Template

  trayId: number
  rackId: string
  rackName: string

  itemTranslate: string
  productTranslate: string
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

  schemaName: string
  trayTranslate: string
  trayName: string
  trayViewFlag: boolean
  productViewFlag: boolean
  rackTranslate: string
  dropdownValue: string
  productViewDropdownValue: string
  template: string
  racksTranslaye: string
  options: Object = {
    autoClose: false,
    keepAfterRouteChange: false
  }
  showWarningMessage: boolean
  helpSection: string
  constructor(
    private formService: FormService,
    private route: ActivatedRoute,
    public menuService: MenuService,
    private router: Router,
    private alertService: AlertService
  ) {}

  ngOnInit(): void {
    this.trayViewFlag = true
    this.helpSection = 'checkin_checkout_item'
    this.template = localStorage.getItem('Categories')
    this.racksTranslaye = localStorage.getItem('Racks')
    if (this.template === null) {
      this.template = 'Categories'
    }

    this.trayId = this.route.snapshot.params.trayId
    this.rackId = this.route.snapshot.params.rackId
    this.rackName = this.route.snapshot.params.rackName
    this.itemTranslate = localStorage.getItem('item')
    if (this.itemTranslate === null || this.itemTranslate === undefined) {
      this.itemTranslate = 'Products'
    }
    this.productTranslate = localStorage.getItem('product')
    if (this.productTranslate === null || this.productTranslate === undefined) {
      this.productTranslate = 'Product'
    }
    this.rackTranslate = localStorage.getItem('Racks')
    this.trayName = this.route.snapshot.params.trayName
    this.trayTranslate = localStorage.getItem('tray')
    if (this.trayTranslate === null) {
      this.trayTranslate = 'tray'
    }
    this.findAlltemplatesByTrayId()
    this.schemaName = sessionStorage.getItem('clientName')
    this.retrieveTemplates(this.schemaName)
  }

  retrieveTemplates(schemaName: string): void {
    this.formService
      .findAllTemplatesWhichHaveProducts(schemaName)
      .subscribe(data => {
        this.dataSource.data = data
        this.templateList = this.dataSource.data
        this.templateList.map(template => {
          template.name = template.name.replace(/_/g, ' ')
        })

        console.log(this.templateList)
      })
  }

  findAlltemplatesByTrayId(): void {
    this.formService
      .findAlltemplatesByTrayId(this.trayId)
      .subscribe(templates => {
        if (templates && templates.length > 0) {
          this.dataSource.data = templates
          this.associatedtemplateList = templates
          this.associatedtemplateList.map(template => {
            template.name = template.name.replace(/_/g, ' ')
          })
          localStorage.setItem('tempname', this.associatedtemplateList[0].name)
          this.selectedTemplate = this.associatedtemplateList[0]
          this.retriveItemsFromChildComponent()
        } else {
          this.productViewFlag = false
          this.showWarningMessage = true         
          this.dropdownValue = `There is no ${this.template} to display`          
          this.retriveItemsFromChildComponent()
          this.selectedTemplate.name = `There is no ${this.template} to display` 
        }
      })
  }

  handleError(err: ErrorEvent): void {
    alert(err)
  }

  onSelectedTemplate(selectedTemplate: Template): void {
    this.selectedTemplate = selectedTemplate
    this.retriveItemsFromChildComponent()
  }

  switchToProduct() {
    this.retrieveTemplates(this.schemaName)
    this.productViewFlag = true
    this.showWarningMessage = false
    this.trayViewFlag = false
    if (this.templateList && this.templateList.length > 0) {
      this.productViewDropdownValue = this.templateList[0].name
      this.selectedTemplate = this.templateList[0]
    } else {
      this.productViewDropdownValue = `There is no ${this.template} to display`
    }

    this.retriveItemsFromChildComponent()
  }

  switchToTrayView() {
    this.trayViewFlag = true
    this.productViewFlag = false
    this.ngOnInit()
  }

  retriveItemsFromChildComponent(): void {
    if (this.selectedTemplate !== undefined) {
      this.child.selectedTemplate = this.selectedTemplate
      this.child.isTrayView = this.trayViewFlag
      this.child.rackName = this.rackName
      this.child.retriveItems()
    }
  }

  changePage(path: string, rackId: string, rackName: string): void {
    this.router
      .navigateByUrl(`/${path}/${rackId}/${rackName}`, {
        skipLocationChange: true
      })
      .then(() => {
        this.router.navigate([`${path}/${rackId}/${rackName}`], {
          relativeTo: this.route
        })
      })
  }
}
