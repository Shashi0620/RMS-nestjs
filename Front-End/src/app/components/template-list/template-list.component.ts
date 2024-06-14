/* eslint-disable import/no-unresolved */
/* eslint-disable no-invalid-this */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-undef */
/* eslint-disable i18n-text/no-en */
/*
 * This is template-list.component.ts
 */
import {Component, OnInit, ViewChild} from '@angular/core'
import {Template} from '../../models/template.model'
import {FormService} from '../../services/app.form.service'
import {MatTableDataSource} from '@angular/material/table'
import {MatPaginator, PageEvent} from '@angular/material/paginator'
import {MatSort} from '@angular/material/sort'
import swal from 'sweetalert2'
import {User} from '../../models/user.model'
import {Router} from '@angular/router'
import {LogService} from '../../services/log.service'
import {Role} from '../../models/role.model'
import {Support} from '../../models/support.model'
import {MenuService} from 'src/app/services/menu.service'
import {UserService} from 'src/app/services/user.service'
import {Plan} from 'src/app/models/plan.model'
import {environment} from '../../../environments/environment'

@Component({
  selector: 'app-Templates-list',
  templateUrl: './template-list.component.html',
  styleUrls: ['./template-list.component.css']
})
export class TemplateListComponent implements OnInit {
  templates: Template[] = []
  currentTemplate?: Template
  currentIndex = -1
  name = ''
  roleId: ''
  UserObj: User = {}
  support: Support = {
    id: 0,
    title: '',
    support: '',
    videoLink: ''
  }
  clientFk: number
  templateSupport = 'template_support'
  displayedColumns: string[] = ['Name', 'Description', 'Actions']
  dataList: Template[]
  dataSource: MatTableDataSource<Template> = new MatTableDataSource(
    this.templates
  )
  value: string
  schemaName: string
  @ViewChild(MatPaginator) paginator: MatPaginator
  @ViewChild(MatSort) sort: MatSort

  RoleObj: Role = {}
  PlanObj: Plan = {
    name: '',
    planImg: '',
    rate: 0
  }
  RoleName = ''
  noOfItemTypes = 0

  constructor(
    private formService: FormService,
    private router: Router,
    private logger: LogService,
    private menuService: MenuService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.dataSource.paginator = this.paginator
    this.PlanObj = JSON.parse(sessionStorage.getItem('planObj'))
    if (this.PlanObj != null && this.PlanObj != undefined) {
      this.noOfItemTypes = this.PlanObj[0].noOfItemTypes
    }
    this.schemaName = sessionStorage.getItem('clientName')
    this.RoleObj = JSON.parse(sessionStorage.getItem('roleObj'))
    this.RoleName = this.RoleObj[0].name
    this.UserObj = JSON.parse(sessionStorage.getItem('userObj'))
    this.clientFk = this.UserObj.clientFk
    this.retrieveTemplates()
    this.value = localStorage.getItem('Home')
    if (this.value === null) {
      this.value = 'Template'
    }
  }
  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator
    this.dataSource.sort = this.sort
  }

  applyFilter(filterValue: string): void {
    this.logger.log(
      'start of TemplateListComponent : applyFilter :filterValue',
      filterValue
    )
    filterValue = filterValue.trim() // Remove whitespace
    filterValue = filterValue.toLowerCase() // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue
    this.logger.log(
      'start of TemplateListComponent : applyFilter :response',
      this.dataSource.filter
    )
  }

  retrieveTemplates(): void {
    this.logger.log('start of TemplateListComponent : retrieveTemplates')
    this.formService.getAll(this.clientFk).subscribe(data => {
      this.templates = this.menuService.templateListingRemoveUnderScore(data)
      this.dataSource.data = this.templates
    })
    this.logger.log('End of TemplateListComponent : retrieveTemplates')
  }

  refreshList(): void {
    this.retrieveTemplates()
    this.currentTemplate = undefined
    this.currentIndex = -1
  }

  setActiveTemplate(template: Template, index: number): void {
    this.logger.log(
      'start of TemplateListComponent : setActiveTemplate :template',
      template,
      'index',
      index
    )
    this.currentTemplate = template
    this.currentIndex = index
    this.logger.log(
      'End of TemplateListComponent : setActiveTemplate :response',
      this.currentTemplate,
      this.currentIndex
    )
  }

  removeAllTemplates(): void {
    this.logger.log('start of TemplateListComponent : removeAllTemplates ')
    this.formService.deleteAll().subscribe(() => {
      this.refreshList()
      this.logger.log('start of TemplateListComponent : removeAllTemplates')
    })
  }

  searchTitle(): void {
    this.logger.log('start of TemplateListComponent : searchTitle ')
    this.currentTemplate = undefined
    this.currentIndex = -1

    this.formService.findByTitle(this.name).subscribe(data => {
      this.templates = data
      this.logger.log(
        'start of TemplateListComponent : searchTitle :response',
        this.templates
      )
    })
  }

  deleteTemplate(id, name): void {
    this.logger.log('start of TemplateListComponent : deleteTemplate ')
    this.formService.delete(id, name, this.schemaName).subscribe(() => {
      this.formService.getAll(this.clientFk)
      this.logger.log('start of TemplateListComponent : deleteTemplate')
      sessionStorage.setItem('redirect_to', '/template')
      window.location.reload()
    })
  }
  handleError(err: ErrorEvent): void {
    alert(err)
  }

  removeTemplate(id, name): void {
    swal({
      title: 'Are you sure?',
      text:
        'By deleting this template it will also deletes related products of this template, Do you want to procced?',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#00B96F',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, remove!'
    }).then(result => {
      if (result.value) {
        this.deleteTemplate(id, name)
        this.retrieveTemplates()
      }
    })
  }
}
