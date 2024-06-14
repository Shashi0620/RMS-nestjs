/*
 * This is create-rack.component.ts
 */
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms'
import {Router} from '@angular/router'
import {Component, OnInit} from '@angular/core'
import {Rack} from '../../models/rack.model'
import {RackService} from '../../services/rack.service'
import {StoreService} from '../../store.service'
import {Store} from '../../models/store.model'
import {environment} from '../../../environments/environment'
import {User} from '../../models/user.model'
import {Plan} from '../../models/plan.model'
import {LogService} from '../../services/log.service'
const selectedPlan = environment.selectedPlan
@Component({
  selector: 'app-create-rack',
  templateUrl: './create-rack.component.html',
  styleUrls: ['./create-rack.component.css']
})
export class CreateRackComponent implements OnInit {
  UserObj: User = {}
  PlanObj: Plan = {
    name: '',
    planImg: '',
    rate: 0
  }

  rack: Rack = {
    name: '',
    no_of_rows: 0,
    no_of_columns: 0,
    client_fk: 0,
    createdon: '',
    storeFk: 0
  }
  store: Store = {
    storeId: 0,
    storeName: '',
    location: ''
  }
  storeList: Store[]
  totalNoOfRows = environment.rackNoOfrows
  totalNoOfCols = environment.rackNoOfColumns

  constructor(
    private router: Router,
    private rackService: RackService,
    private formBuilder: FormBuilder,
    private storeService: StoreService,
    private logger: LogService
  ) {}
  loading = false
  submitted = false
  rackForm: FormGroup
  rackObj: Rack
  createdon: string
  isStorePresent = true
  value: string
  storeTranslate: string
  racksTranslate: string
  ngOnInit(): void {
    this.PlanObj = JSON.parse(sessionStorage.getItem('planObj'))
    this.UserObj = JSON.parse(sessionStorage.getItem('userObj'))
    this.storeTranslate = localStorage.getItem('Stores')
    this.racksTranslate = localStorage.getItem('Racks')
    this.rack.client_fk = this.UserObj.clientFk
    this.rackForm = this.formBuilder.group({
      name: ['', Validators.required],
      no_of_rows: [''],
      no_of_columns: [''],
      client_fk: this.UserObj.clientFk,
      store: ['', Validators.required],
      storeFk: ''
    })
    this.getStores(this.UserObj.clientFk)
    this.value = localStorage.getItem('Racks')
    // if (this.PlanObj != null) {
    //   if (this.PlanObj[0].name === selectedPlan) {
    //     this.isStorePresent = false
    //     this.rackForm.value.store = null
    //   }
    // }
  }

  getStores(client_fk: number): void {
    this.logger.log(
      'Start of createRackComponent : getStores :client_fk',
      client_fk
    )
    this.storeService
      .fetchAllStoresByClientFK(client_fk)
      .subscribe((data: Store[]) => {
        this.storeList = data
        this.logger.log(
          'End of createRackComponent : getStores :response',
          this.storeList
        )
      })
  }

  get f(): {[key: string]: AbstractControl} {
    return this.rackForm.controls
  }

  async saveRack(): Promise<Rack> {
    this.logger.log('Start of createRackComponent : saveRack')
    this.rackForm.value.storeFk = this.rackForm.value.store
    this.rackForm.value.no_of_rows = 3
    this.rackForm.value.no_of_columns = 3
    this.submitted = true
    if (this.rackForm.invalid) {
      return
    }
    try {
      this.rack = await this.rackService
        .createRack(this.rackForm.value)
        .toPromise()
      this.logger.log(
        'End of createRackComponent : saveRack :response',
        this.rackForm.value
      )
      this.router.navigate(['/racks'])
      return this.rack
    } catch (error) {
      this.handleError(error.message)
    }
  }
  handleError(err: ErrorEvent): void {
    alert(err)
  }
  fetchAllRacks(): void {
    this.logger.log('Start of createRackComponent : fetchAllRacks')
    this.router.navigate(['/racks'])
    this.logger.log('End of createRackComponent : fetchAllRacks')
  }
}
