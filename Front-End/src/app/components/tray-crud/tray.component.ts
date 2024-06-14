/* eslint-disable no-self-assign */
/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable import/named */
/*
 * This is tray.component.ts
 */
import {ActivatedRoute, Router} from '@angular/router'
import {Component, NgZone, OnDestroy, OnInit, ViewChild} from '@angular/core'
import {MatSelectChange} from '@angular/material/select'
import {Observable, Subscription, fromEvent, merge} from 'rxjs'
import {debounceTime, delay, filter} from 'rxjs/operators'
import {
  KtdDragEnd,
  KtdDragStart,
  KtdGridComponent,
  KtdGridLayout,
  KtdGridLayoutItem,
  KtdResizeStart,
  ktdTrackById
} from '@katoid/angular-grid-layout'
import {ktdArrayRemoveItem} from './tray.utils'
import {FormControl, FormGroup, Validators} from '@angular/forms'
import {RackService} from '../../services/rack.service'
import {AlertService} from '../_alert/alert.service'
import {UploadFilesService} from '../../services/upload-files.service'
import {HttpEventType, HttpResponse} from '@angular/common/http'
import {MatTableDataSource} from '@angular/material/table'
import {Tray} from '../../models/tray.model'
import {User} from '../../models/user.model'
import {environment} from '../../../environments/environment'
import {Plan} from '../../models/plan.model'
import {LogService} from '../../services/log.service'
import {MenuService} from '../../services/menu.service'
import {FileImg} from '../../models/fileimg.model'
import {Menu} from '../../models/menu.model'
import swal from 'sweetalert2'
const serverBaseURL = environment.baseUrl
@Component({
  selector: 'ktd-playground',
  templateUrl: './tray.component.html',
  styleUrls: ['./tray.component.scss']
})
export class TrayComponent implements OnInit, OnDestroy {
  searchtrayId: number
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
  menuObject: Menu[]
  plan: Plan = {
    name: '',
    planImg: '',
    rate: 0
  }
  displayedColumns: string[] = ['name', 'storeName']
  dataSource = new MatTableDataSource<Tray>()
  UserObj: User = {}
  trayId: number
  options = {
    autoClose: true,
    keepAfterRouteChange: false
  }

  selectedFiles?: FileList
  currentFile?: File
  progress = 0
  message = ''
  fileInfos?: Observable<FileImg>

  file: FileImg = {
    filename: '',
    filepath: `${serverBaseURL}/api/user/files/profile/trayImages/`,
    tray_fk: 0,
    user_fk: 0,
    rack_id: 0
  }
  tray_fk: number
  item: string
  tray: string
  product: string
  rack: string
  changeTitle: boolean
  borderColor: string

  constructor(
    private route: ActivatedRoute,
    private ngZone: NgZone,
    private rackService: RackService,
    private alertService: AlertService,
    private uploadService: UploadFilesService,
    public menuService: MenuService,
    private logger: LogService,
    private router: Router
  ) {}

  @ViewChild(KtdGridComponent, {static: true}) grid: KtdGridComponent
  trackById = ktdTrackById

  cols = 12
  rowHeight = 50
  compactType: 'vertical' | 'horizontal' | null
  trayList: KtdGridLayout = []
  initialTrayList: KtdGridLayout = []
  trayDataList: Tray[] = []
  fileList = []

  transitions: {name: string; value: string}[] = [
    {
      name: 'ease',
      value: 'transform 500ms ease, width 500ms ease, height 500ms ease'
    },
    {
      name: 'ease-out',
      value:
        'transform 500ms ease-out, width 500ms ease-out, height 500ms ease-out'
    },
    {
      name: 'linear',
      value: 'transform 500ms linear, width 500ms linear, height 500ms linear'
    },
    {
      name: 'overflowing',
      value:
        'transform 500ms cubic-bezier(.28,.49,.79,1.35), width 500ms cubic-bezier(.28,.49,.79,1.35), height 500ms cubic-bezier(.28,.49,.79,1.35)'
    },
    {
      name: 'fast',
      value: 'transform 200ms ease, width 200ms linear, height 200ms linear'
    },
    {
      name: 'slow-motion',
      value:
        'transform 1000ms linear, width 1000ms linear, height 1000ms linear'
    },
    {name: 'transform-only', value: 'transform 500ms ease'}
  ]
  currentTransition: string = this.transitions[0].value

  dragStartThreshold = 0
  disableDrag = false
  disableResize = false
  disableRemove = false
  autoResize = false
  isDragging = false
  isResizing = false
  resizeSubscription: Subscription
  currentlyBeingEditedTray = null
  traySelected
  fileId = undefined
  rackId: number
  rackName: string
  search = ''
  isQuantity = false
  addItems = false
  currentlyTraySearchable = false
  saveTrayFlag = false
  selectTrayItem = false
  trayview_support = 'trayview_support'
  trayedit_support = 'trayedit_support'
  form = new FormGroup({
    trayname: new FormControl('', Validators.required)
  })

  isColorOpen = false
  isInputOpen = false
  hideInputBox = false
  saveLayoutFlag = false
  trayName: string
  openFileUpload: false
  storeTranslate: string
  racksTranslate: string

  ngOnInit(): void {
    this.storeTranslate = localStorage.getItem('Stores')
    this.racksTranslate = localStorage.getItem('Racks')
    this.rackId = this.route.snapshot.params.id
    this.getTrayProp(this.route.snapshot.params.id)
    this.getTrayDataById(this.route.snapshot.params.id)
    this.searchtrayId = this.route.snapshot.params.trayId
    this.UserObj = JSON.parse(sessionStorage.getItem('userObj'))
    this.file.user_fk = this.UserObj.clientFk
    this.rackName = this.route.snapshot.params.name
    this.resizeSubscription = merge(
      fromEvent(window, 'resize'),
      fromEvent(window, 'orientationchange')
    )
      .pipe(
        debounceTime(50),
        filter(() => this.autoResize)
      )
      .subscribe(() => {
        this.grid.resize()
      })
    this.item = localStorage.getItem('item')
    if (this.item === undefined || this.item === null) {
      this.item = 'item'
    }
    this.tray = localStorage.getItem('tray')
    if (this.tray === null) {
      this.tray = 'Trays'
    }
    this.product = localStorage.getItem('product')
    this.rack = localStorage.getItem('Racks')
  }
  ngOnDestroy(): void {
    this.resizeSubscription.unsubscribe()
  }
  onDragEnd(event: KtdDragEnd): void {
    this.isDragging = true
  }
  onDragStarted(event: KtdDragStart): void {
    this.isDragging = true
  }

  onResizeStarted(event: KtdResizeStart): void {
    this.isResizing = true
  }

  onDragEnded(): void {
    this.isDragging = false
    this.saveLayoutFlag = true
  }

  onResizeEnded(): void {
    this.isResizing = false
    this.saveLayoutFlag = true
  }

  onLayoutUpdated(layout: KtdGridLayout): void {
    this.trayList = layout
    if (this.initialTrayList != this.trayList) {
      this.saveLayoutFlag = true
    }
  }

  onCompactTypeChange(change: MatSelectChange): void {
    this.compactType = change.value
  }

  onTransitionChange(change: MatSelectChange): void {
    this.currentTransition = change.value
  }

  onDisableDragChange(checked: boolean): void {
    this.disableDrag = checked
  }

  onDisableResizeChange(checked: boolean): void {
    this.disableResize = checked
  }

  onDisableRemoveChange(checked: boolean): void {
    this.disableRemove = checked
  }

  onAutoResizeChange(checked: boolean): void {
    this.autoResize = checked
  }

  onColsChange(event: Event): void {
    this.cols = parseInt((event.target as HTMLInputElement).value, 10)
  }

  onRowHeightChange(event: Event): void {
    this.rowHeight = parseInt((event.target as HTMLInputElement).value, 10)
  }

  onDragStartThresholdChange(event: Event): void {
    this.dragStartThreshold = parseInt(
      (event.target as HTMLInputElement).value,
      10
    )
  }

  async selectFile(event): Promise<void> {
    this.selectedFiles = event.target.files
    await this.upload()
    // await this.saveTray()
  }

  selectColorOnClick(tray_id: number) {
    console.log(tray_id)
  }

  showImageSelectPopUp(tray_id: number) {
    ;($(`#img-upload_${tray_id}`) as any).click()
  }

  showColorPicker(tray_id: number): void {
    if (this.isColorOpen === false) {
      this.isColorOpen = true
      // ($(`#colour_picker_${tray_id}`) as any).modal('show')
    } else {
      this.isColorOpen = false
      //($(`#colour_picker_${tray_id}`) as any).modal('hide')
    }
  }

  inputBoxFlag(): void {
    this.isInputOpen = false
    this.saveTray()
  }

  inputBoxhide() {
    this.hideInputBox = true
  }

  async upload(): Promise<void> {
    this.progress = 0

    if (this.selectedFiles) {
      const file: File | null = this.selectedFiles.item(0)

      if (file) {
        this.currentFile = file

        this.uploadService
          .trayupload(this.currentFile, this.rackId, this.trayId)
          .subscribe(
            (event: any) => {
              if (event.type === HttpEventType.UploadProgress) {
                this.progress = Math.round((100 * event.loaded) / event.total)
                this.file.filename = this.currentFile.name
                this.file.tray_fk = this.trayId
                this.file.rack_id = this.rackId
                this.currentlyBeingEditedTray.img =
                  this.file.filepath +
                  this.rackId +
                  '/' +
                  this.trayId +
                  '/' +
                  this.file.filename
                if (this.fileId !== undefined) {
                  this.uploadService
                    .updateTrayByFile(this.trayId, this.file)
                    .subscribe(async () => {
                      // this.alertService.success(
                      //   'Image Updated successfully',
                      //   this.options
                      // )
                      await this.saveTray()
                      this.logger.log(
                        'UserProfile : upload : updateFile :server response',
                        this.file
                      )
                      this.fetchAllFiles(this.currentFile.name)
                    })
                } else {
                  this.file.filepath +
                    this.rackId +
                    '/' +
                    this.trayId +
                    '/' +
                    this.file.filename
                  this.uploadService
                    .createTrayFile(this.file)
                    .subscribe(async () => {
                      // this.alertService.success(
                      //   'Image uploaded successfully',
                      //   this.options
                      // )
                      await this.saveTray()
                      this.logger.log(
                        'UserProfile : updateProfile : createFile : server response',
                        this.file
                      )
                      this.fetchAllFiles(this.file.filename)
                    })
                }
              } else if (event instanceof HttpResponse) {
                this.message = event.body.message
                this.fileInfos = this.uploadService.getFiles()
              }
            },
            err => {
              this.progress = 0

              if (err.error && err.error.message) {
                this.message = err.error.message
              } else {
                this.message = 'Could not upload the file!'
              }
              this.currentFile = undefined
            }
          )
      }
      this.selectedFiles = undefined
    }
  }

  fetchAllFiles(name): void {
    this.uploadService.fetchAllTrayFiles().subscribe(response => {
      for (let i = 0; i < response.length; i++) {
        if (response[i].filename === name) {
          this.trayObject.img = this.file.filepath + response[i].filename
        }
      }
    })
  }

  /** Adds a grid item to the layout */
  async copyTray(trayList: Tray[]): Promise<void> {
    const maxId = this.trayList.reduce(
      (acc, cur) => Math.max(acc, parseInt(cur.id, 10)),
      -1
    )
    const nextId = maxId + 1
    const newLayoutItem: KtdGridLayoutItem = {
      id: nextId.toString(),
      x: 0,
      y: 0,
      w: 2,
      h: 2
    }

    // Important: Don't mutate the array, create new instance. This way notifies the Grid component that the layout has changed.
    this.trayList = [newLayoutItem, ...this.trayList]

    this.rackService
      .fetchTrayById(this.currentlyBeingEditedTray.id)
      .subscribe(response => {
        this.trayObject = response
        this.trayObject.id = null
        this.trayObject.name = this.form.controls.trayname.value
        this.rackService.createTray(this.trayObject).subscribe(() => {
          this.getTrayDataById(this.route.snapshot.params.id)
          this.getTrayProp(this.route.snapshot.params.id)
          //this.alertService.success('Tray Copied successfully', this.options)
        })
      })
  }

  /**
   * Fired when a mousedown happens on the remove grid item button.
   * Stops the event from propagating an causing the drag to start.
   * We don't want to drag when mousedown is fired on remove icon button.
   */
  stopEventPropagation(event: Event): void {
    event.preventDefault()
    event.stopPropagation()
  }

  /** Removes the item from the layout */
  removeTray(): void {
    const message = 'Tray deleted successfully'
    this.rackService
      .deleteTrayById(this.currentlyBeingEditedTray.id, this.rackId)
      .subscribe(response => {
        this.trayObject = response
        // this.alertService.success(message, this.options)

        this.getTrayDataById(this.route.snapshot.params.id)
      })
    // TODO: based on the ID execute database call and then in the success response execute the code below.
    this.trayList = ktdArrayRemoveItem(
      this.trayList,
      item => item.id === this.currentlyBeingEditedTray.id
    )
  }
  editTray(id: string): void {
    this.traySelected = true
    this.changeTitle = true
    this.borderColor = id
    const index = this.trayList.findIndex(item => item.id === id)
    if (index > -1) {
      this.currentlyBeingEditedTray = this.trayDataList[index]
      this.form.setValue({trayname: this.currentlyBeingEditedTray.name})
      this.trayId = this.currentlyBeingEditedTray.id
      this.currentlyTraySearchable = this.currentlyBeingEditedTray.searchable
      this.currentlyBeingEditedTray.cssClass = 'traySelected'
      this.menuService.showTrayMenu()
      this.trayName = this.currentlyBeingEditedTray.name
    }
    this.fetchFile(+id)
  }

  updateSearchValue(): void {
    this.currentlyBeingEditedTray.searchable = this.currentlyBeingEditedTray.searchable
    this.currentlyBeingEditedTray.searchable = !this.currentlyTraySearchable
    this.saveTray()
  }

  onKeyPress(keyPress) {
    if (this.saveTrayFlag === true) {
    }
    // this.currentlyBeingEditedTray.name = keyPress
  }

  showInputBox() {
    this.isInputOpen = true
  }

  async saveTray(): Promise<void> {
    this.currentlyBeingEditedTray.name = this.form.controls.trayname.value

    if (this.currentlyBeingEditedTray.img === undefined) {
      this.currentlyBeingEditedTray.img = this.file.filepath
    }

    this.rackService
      .updateTray(
        this.currentlyBeingEditedTray.id,
        this.currentlyBeingEditedTray
      )
      .subscribe(response => {
        this.trayObject = response
        //this.alertService.success('Tray Is updated Successfully', this.options)

        this.getTrayDataById(this.route.snapshot.params.id)
      })
    this.fetchProfileObject(this.currentlyBeingEditedTray.id)
  }

  fetchProfileObject(id: number): void {
    this.logger.log('Start of UserProfile : fetchProfileObject :id', id)
    this.rackService.fetchTrayById(id).subscribe(response => {
      this.currentlyBeingEditedTray = response
      this.logger.log(
        'End of UserProfile : fetchProfileObject :server response',
        this.currentlyBeingEditedTray
      )
      //this.fetchFile(id)
    })
  }

  fetchFile(tray_fk: number): void {
    this.logger.log('Start of UserProfile : fetchFile :tray_fk', tray_fk)
    this.uploadService.fetchTrayFile(tray_fk).subscribe(response => {
      this.currentlyBeingEditedTray.image =
        this.file.filepath + response[0].filename
      this.fileId = response[0].id
      this.logger.log('Start of UserProfile : fetchFile :response', this.fileId)
    })
  }
  changeColorComplete(event): void {
    this.currentlyBeingEditedTray.color = event.color.hex
    this.saveTray()
    this.isColorOpen = false
  }

  getTrayProp(rack_fk: number): void {
    this.rackService.getTrayPropById(rack_fk).subscribe(data => {
      this.trayList = data
    })
  }

  fetchTrayList(trayId: number): void {
    this.rackService.getTrayPropById(trayId).subscribe(data => {
      this.trayList = data
      this.initialTrayList = data
    })
  }

  async saveTrayLayout(trayList: Tray[], isCopy?: boolean): Promise<void> {
    this.rackService
      .saveTrayLayout(trayList, this.trayId)
      .subscribe(response => {
        // this.alertService.success(
        //   'Tray Layout Updated Successfully',
        //   this.options
        // )
        this.getTrayDataById(this.rackId)
        this.saveLayoutFlag = false

        if (isCopy) {
          this.copyTray(trayList)
        }
      })
  }

  getTrayDataById(rack_fk: number): void {
    this.rackService.getTrayDataById(rack_fk).subscribe(data => {
      this.trayDataList = data
      this.trayDataList.forEach(tray => {
        if (tray.img === null || tray.img === undefined) {
          tray.img =
            environment.baseUrl + '/api/user/files/profile/defaultTray.jpg'
        }
      })
      this.trayDataList = this.trayDataList.map(newValue => ({
        ...newValue,
        cssClass: ''
      }))
    })
  }
  refreshPage(action: string): void {
    this.router.navigate([`/${action}`])
  }

  onLayoutChange(trayList: Tray[]): void {
    this.changeTitle = false
    this.borderColor = ''
    this.menuService.isTrayMenu = false
    if (this.saveLayoutFlag === true) {
      this.saveTrayLayout(trayList)
    }
    this.router.navigate(['/racks'])
  }

  showDeleteTrayPopUp(trayList: Tray[]) {
    swal({
      title: 'Please Confirm!',
      text: `By deleting this ${this.tray} it will also deletes related ${this.item} and files of this ${this.tray}, Do you want to procced?`,
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#00B96F',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes'
    }).then(result => {
      if (result.value == true) {
        if (this.saveLayoutFlag === true) {
          this.saveTrayLayout(trayList)
        }
        this.removeTray()
      }
    })
  }

  public changePage(
    path: string,
    trayId: string,
    rackId: string,
    rackName: string,
    trayName: string,
    trayList: Tray[]
  ): void {
    if (this.saveLayoutFlag === true) {
      this.saveTrayLayout(trayList)
    }
    this.router
      .navigateByUrl(`/${path}/${trayId}/${rackId}/${rackName}/${trayName}`, {
        skipLocationChange: true
      })
      .then(() => {
        this.router.navigate(
          [`${path}/${trayId}/${rackId}/${rackName}/${trayName}`],
          {relativeTo: this.route}
        )
      })

    this.menuService.isTrayMenu = false
  }

  testPage() {
    const trayId = 2
    const rackId = 3
    const rackname = 'aaaa'
    this.router.navigate(['/test'])
  }
}
