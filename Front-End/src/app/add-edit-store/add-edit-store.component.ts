/*
 * This is add-edit-store.component.ts file
 */
import {Component, OnInit} from '@angular/core'
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms'
import {ActivatedRoute, Router} from '@angular/router'
import {Store} from '../models/store.model'
import {User} from '../models/user.model'
import {StoreService} from '../store.service'
import {environment} from 'src/environments/environment'
import {Plan} from '../models/plan.model'
// import LocationPicker from 'location-picker'

@Component({
  selector: 'app-add-edit-store',
  templateUrl: './add-edit-store.component.html',
  styleUrls: ['./add-edit-store.component.css']
})
export class AddEditStoreComponent implements OnInit {
  id?: number
  addForm?: boolean
  store: Store = {
    storeId: 0,
    storeName: '',
    location: '',
    latitude: 0,
    longitude: 0
  }
  stores
  UserObj: User = {}
  storeObj: any = {
    storeId: 0,
    storeName: '',
    address: '',
    latitude: 0,
    longitude: 0
  }
  PlanObj: Plan = {
    name: '',
    planImg: '',
    rate: 0
  }
  totalNoOfStores = 0
  constructor(
    private router: Router,
    private storeService: StoreService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute
  ) {}

  loading = false
  submitted = false
  storeForm: FormGroup
  value: String
  //lp: LocationPicker
  map: any
  minZoomLevel = 2
  center: google.maps.LatLngLiteral = {
    lat: 12.988529497277261,
    lng: 77.55455927096821
  }
  storeTranslate: string
  ngOnInit(): void {
    this.UserObj = JSON.parse(sessionStorage.getItem('userObj'))
    this.storeTranslate = localStorage.getItem('Stores')
    this.storeForm = this.formBuilder.group({
      storeName: ['', Validators.required],
      address: ['', Validators.required],
      latitude: ['', Validators.required],
      longitude: ['', Validators.required],
      client_fk: this.UserObj.clientFk
    })
    if (this.route.snapshot.params.storeId) {
      this.getStoreById(this.route.snapshot.params.storeId)
    }
    this.id = this.route.snapshot.params.storeId
    this.addForm = !this.id
    this.value = localStorage.getItem('Stores')
    this.PlanObj = JSON.parse(sessionStorage.getItem('planObj'))
    if (this.PlanObj != null && this.PlanObj != undefined) {
      this.totalNoOfStores = this.PlanObj[0].totalNoOfStores
    }
    // this.lp = new LocationPicker('map', {
    //   setCurrentPosition: true,
    //   lat: this.storeObj.latitude,
    //   lng: this.storeObj.longitude
    // })
  }

  get f(): {[key: string]: AbstractControl} {
    return this.storeForm.controls
  }

  ngAfterViewInit(): void {
    const ele = document.getElementById('contents') as HTMLElement
    this.map = new google.maps.Map(ele, {
      zoom: 8,
      center: this.center,
      minZoom: this.minZoomLevel // Set the minimum zoom level
    })

    google.maps.event.addListener(this.map, 'zoom_changed', () => {
      if (this.map.getZoom() < this.minZoomLevel) {
        this.map.setZoom(this.minZoomLevel)
      }
      console.log(this.map.getZoom())
    })

    let infoWindow = new google.maps.InfoWindow({
      content: 'Click the map to get Latitude/Longitude!',
      position: this.center
    })

    infoWindow.open(this.map)

    this.map.addListener('click', mapsMouseEvent => {
      // Close the current InfoWindow.
      infoWindow.close()

      // Create a new InfoWindow.
      infoWindow = new google.maps.InfoWindow({
        position: mapsMouseEvent.latLng
      })
      infoWindow.setContent(
        JSON.stringify(mapsMouseEvent.latLng.toJSON(), null, 2)
      )
      const location = JSON.stringify(mapsMouseEvent.latLng.toJSON(), null, 2)
      const storeCurrentLocation = JSON.parse(location)
      this.storeObj.latitude = storeCurrentLocation.lat
      this.storeObj.longitude = storeCurrentLocation.lng
      this.storeForm.value.latitude = storeCurrentLocation.lat
      this.storeForm.value.longitude = storeCurrentLocation.lng
      console.log(
        'latitude',
        storeCurrentLocation.lat,
        'logitude',
        storeCurrentLocation.lng
      )
      infoWindow.open(this.map)
    })
  }

  saveStore(): void {
    this.submitted = true
    if (this.storeForm.invalid) {
      return
    }
    if (this.route.snapshot.params.storeId) {
      return this.updateStoreById()
    }
    this.storeService.createStore(this.storeForm.value).subscribe(
      () => {
        this.router.navigate(['/stores'])
      },
      error => {
        this.handleError(error.message)
      }
    )
  }

  getStoreById(storeId): void {
    this.storeService.getStoreById(storeId).subscribe(response => {
      this.storeObj = response
      this.center.lat = this.storeObj.latitude
      this.center.lng = this.storeObj.longitude
    })
  }

  handleError(err: ErrorEvent): void {
    alert(err)
  }

  updateStoreById(): void {
    this.submitted = true
    if (this.storeForm.invalid) {
      return
    }
    this.storeService
      .updateStore(this.route.snapshot.params.storeId, this.storeForm.value)
      .subscribe(
        () => {
          this.submitted = true
          this.router.navigate(['/stores'])
        },
        error => {
          this.handleError(error.message)
        }
      )
  }
}
