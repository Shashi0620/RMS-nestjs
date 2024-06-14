/*
 * This is translate.component.ts
 */
import {Component, OnInit, ViewChild} from '@angular/core'
import {MatTable, MatTableDataSource} from '@angular/material/table'
import {User} from './models/user.model'
import {MatPaginator} from '@angular/material/paginator'
import {UserService} from './services/user.service'
import {AddMenuComponent} from './dialog/add-translate.component'
import {MatDialog} from '@angular/material/dialog'
import swal from 'sweetalert2'
import {Translate} from './models/translate.model'
import {LogService} from './services/log.service'
import {ActivatedRoute, Router} from '@angular/router'
export interface PeriodicElement {
  Key: string
  Value: string
}

@Component({
  selector: 'app-root',
  templateUrl: './Translate-listing.html'
})
export class TranslateComponent implements OnInit {
  displayedColumns: string[] = ['Key', 'Value', 'Actions']
  dataSource = new MatTableDataSource<PeriodicElement>()

  @ViewChild(MatPaginator) paginator: MatPaginator
  @ViewChild(MatTable) table: MatTable<Translate>
  options = {
    autoClose: true,
    keepAfterRouteChange: false
  }
  value: string
  translateSupport = 'translate_support'
  constructor(
    private userService: UserService,
    public dialog: MatDialog,
    private logger: LogService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}
  UserObj: User = {}

  ngOnInit(): void {
    this.value = localStorage.getItem('Translate')
    this.UserObj = JSON.parse(sessionStorage.getItem('userObj'))
    this.getAllMenuData(this.UserObj.username)
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator
  }

  getAllMenuData(username): void {
    this.userService.getAllMenuData(username).subscribe(response => {
      this.dataSource.data = response
      this.dataSource.data.map(datavalues =>
        localStorage.setItem(datavalues.Key, datavalues.Value)
      )
    })
  }
  openDialog(action, obj): void {
    if (action === 'Delete') {
      this.removeForm(obj)
    } else {
      obj.action = action
      const dialogRef = this.dialog.open(AddMenuComponent, {
        width: '500px',
        data: obj
      })

      dialogRef.afterClosed().subscribe(result => {
        if (result.event === 'Add') {
          this.addRowData(result.data)
        } else if (result.event === 'Update') {
          this.updateRowData(result.data, obj)
        } else if (result.event === 'Delete') {
          this.removeForm(result.data)
        }
      })
    }
  }

  addRowData(row_obj): void {
    this.dataSource.data.push({
      Key: row_obj.Key,
      Value: row_obj.Value
    })
    this.userService
      .saveData(this.dataSource.data, this.UserObj.username)
      .subscribe(response => {
        this.getAllMenuData(this.UserObj.username)
        return response
      })
    this.refresh()
    this.table.renderRows()
  }

  updateRowData(row_obj, obj): void {
    const index = this.dataSource.data.findIndex(value => value.Key === obj.Key)
    delete row_obj.action
    this.dataSource.data[index] = row_obj
    localStorage.removeItem(obj.Key)
    this.userService
      .saveData(this.dataSource.data, this.UserObj.username)
      .subscribe(response => {
        this.getAllMenuData(this.UserObj.username)
        return response
      })
    this.refresh()
    this.table.renderRows()
  }

  async removeForm(row_obj): Promise<void> {
    try {
      swal({
        title: 'Please Confirm!',
        text:
          'By deleting this Translate it will also deletes the associated menus which are available for you, Do you want to procced?',
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#00B96F',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, remove!'
      }).then(result => {
        if (result.value) {
          this.deleteRowData(row_obj)
        }
      })
    } catch (e) {
      this.logger.log('Error In RemoveForm', e)
    }
  }

  async deleteRowData(row_obj): Promise<string> {
    const deletedRowIndex = this.dataSource.data.findIndex(
      value => value.Key === row_obj.Key
    )
    if (deletedRowIndex > 0) {
      this.dataSource.data.splice(deletedRowIndex, 1)
    } else {
      return 'Error in deleting Row Record'
    }
    localStorage.removeItem(row_obj.Key)

    this.table.renderRows()
  }

  save(): void {
    this.userService
      .saveData(this.dataSource.data, this.UserObj.username)
      .subscribe(response => {
        this.getAllMenuData(this.UserObj.username)
        return response
      })
    this.refresh()
  }

  refresh(): void {
    window.location.reload()
    this.router
      .navigateByUrl('/Translate', {skipLocationChange: true})
      .then(() => {
        this.router.navigate(['/Translate'], {relativeTo: this.activatedRoute})
      })
    //window.location.reload()
  }
}
