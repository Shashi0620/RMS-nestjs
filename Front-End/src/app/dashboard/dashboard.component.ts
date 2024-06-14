/* eslint-disable import/no-unresolved */
/* eslint-disable @typescript-eslint/semi */
/* eslint-disable @typescript-eslint/prefer-for-of */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/await-thenable */
/* eslint-disable github/no-then */
/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-for-in-array */
/* eslint-disable github/array-foreach */
/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-undef */
/* eslint-disable i18n-text/no-en */
/*
 * This is dashboard.component.ts
 */
import {Component, ElementRef, NgZone, OnInit, ViewChild} from '@angular/core'
import {MatTableDataSource} from '@angular/material/table'
import {RackService} from '../services/rack.service'
import {Tray} from '../models/tray.model'
import {Observable} from 'rxjs'
import {GoogleMap, MapInfoWindow, MapMarker} from '@angular/google-maps'
import {LogService} from '../../app/services/log.service'
import {StoreService} from '../store.service'
import {Store} from '../models/store.model'
import {User} from '../models/user.model'
import {Router} from '@angular/router'
import {Support} from '../models/support.model'
import {UserService} from '../services/user.service'

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  map: any
  markers: any[] = []
  minZoomLevel = 2
  dashboardSupport = 'dashboard_support'
  latitude: string = ''
  longitude: string = ''
  selectedMarkerIndex: any
  removeMarkers: any
  storesData: any = []
  productsInStore: any = []
  //   latitude: number
  //   longitude: number
  //   markers: any[] = [];
  //   map: any;
  //   minZoomLevel = 2;
  address: string
  //   selectedMarker = null
  //   private geoCoder: any

  @ViewChild('search')
  searchElementRef: ElementRef
  displayedColumns: string[] = ['storeName']
  //   @ViewChild('myGoogleMap', { static: false })
  //   map!: GoogleMap
  //   @ViewChild(MapInfoWindow, { static: false })
  //   info!: MapInfoWindow

  search = ''
  //   maxZoom = 15
  //   minZoom = 8
  //   options = {
  //     zoomControl: false,
  //     scrollwheel: false,
  //     disableDoubleClickZoom: true,

  //     maxZoom: 15,
  //     minZoom: 8
  //   }
  clientStores: any = []
  storeNames: any = []
  showAllStores: Boolean
  showSearchedStore: Boolean
  //   infoContent = ''
  dataSource = new MatTableDataSource<Store[]>()
  newStoredataSource = new MatTableDataSource<any[]>()
  //   // dataSource = new MatTableDataSource<Object>()

  //   markers = []
  //   zoom: number
  //   apiLoaded: Observable<boolean>
  UserObj: User = {}
  userId?: number
  schemaName: string
  client_fk: number
  //   stores = [
  //     {
  //       name: 'Store 1',
  //       latitude: 40.785091,
  //       longitude: -73.968285,
  //       hours: '8AM to 10PM'
  //     },
  //     {
  //       name: 'Store 2',
  //       latitude: 4.3346285,
  //       longitude: 32.4352628,
  //       hours: '9AM to 9PM'
  //     }
  //   ]
  support: Support = {
    id: 0,
    title: '',
    support: '',
    videoLink: ''
  }

  currentDate = new Date()
  translatedSupport: Support = {}
  toolTipList = ['ToolTip1', 'ToolTip2', 'ToolTip3', 'ToolTip4', 'ToolTip5']
  forTrailUser = false
  nextButtonFlag = true
  previousButtonFlag = false
  isOpen = false
  currentToolTipListIndex = 0
  infoKey: string
  menuObj: [] = []
  constructor(
    private rackService: RackService,
    private storeService: StoreService,
    private ngZone: NgZone,
    private logger: LogService,
    private router: Router,
    private userService: UserService
  ) {
    // this.markers = []
    // this.zoom = 10
  }

  ngOnInit(): void {
    this.UserObj = JSON.parse(sessionStorage.getItem('userObj'))
    this.getStores(this.UserObj.clientFk)
    this.userId = this.UserObj.id
    this.schemaName = sessionStorage.getItem('clientName')
    this.client_fk = this.UserObj.clientFk
    // this.setCurrentLocation()
    const trailEndDateOfUser = new Date(this.UserObj.trialend)
    if (trailEndDateOfUser > this.currentDate) {
      this.forTrailUser = true
      if (
        localStorage.getItem('currentToolTipListIndex') != null &&
        localStorage.getItem('currentToolTipListIndex') != 'NaN'
      ) {
        const indexValue = parseInt(
          localStorage.getItem('currentToolTipListIndex')
        )
        if (indexValue >= this.toolTipList.length - 1) {
          localStorage.setItem('userGuide', 'none')
          this.isOpen = false
        } else {
          this.currentToolTipListIndex = indexValue
          this.infoKey = this.toolTipList[this.currentToolTipListIndex]
        }
      } else {
        this.currentToolTipListIndex = 0
        this.infoKey = this.toolTipList[this.currentToolTipListIndex]
      }
      const userGuide = localStorage.getItem('userGuide')
      if (userGuide === 'display') {
        this.isOpen = true
        this.retrieveDescription()
      }
      if (
        this.currentToolTipListIndex > 0 &&
        this.currentToolTipListIndex <= this.toolTipList.length - 1
      ) {
        this.previousButtonFlag = true
      }
    }
  }

  showNextToolTip(): void {
    if (this.currentToolTipListIndex <= this.toolTipList.length - 1) {
      this.currentToolTipListIndex++
      this.infoKey = this.toolTipList[this.currentToolTipListIndex]
      this.retrieveDescription()
    } else {
      this.nextButtonFlag = false
    }
    if (this.currentToolTipListIndex > 0) {
      this.previousButtonFlag = true
    }
    if (this.currentToolTipListIndex >= this.toolTipList.length - 1) {
      this.nextButtonFlag = false
    }
  }

  showPreviousToolTip(): void {
    if (this.currentToolTipListIndex > 0) {
      this.currentToolTipListIndex--
      this.infoKey = this.toolTipList[this.currentToolTipListIndex]
      this.retrieveDescription()
      if (this.currentToolTipListIndex === 0) {
        this.previousButtonFlag = false
        this.nextButtonFlag = true
      }
      if (this.currentToolTipListIndex < this.toolTipList.length - 1) {
        this.nextButtonFlag = true
      }

      // this.showNextToolTip();
    }
  }

  cancel(): void {
    this.isOpen = false
    localStorage.setItem(
      'currentToolTipListIndex',
      this.currentToolTipListIndex.toString()
    )
    localStorage.setItem('userGuide', 'none')
  }

  retrieveDescription(): void {
    this.userService.fetchDescription(this.infoKey).subscribe(data => {
      this.support = data
      this.menuObj.map((translate: any) => {
        if (this.translatedSupport.support.includes(translate.Key)) {
          this.translatedSupport.support = this.translatedSupport.support.replace(
            translate.Key,
            translate.Value
          )
        }
        this.support = this.translatedSupport
      })
    })
  }

  async getAllStoresandSearch(
    searchString,
    userid,
    clientFk,
    schemaName
  ): Promise<void> {
    if (searchString && searchString !== '') {
      await this.rackSearchListing(searchString, userid, clientFk, schemaName)
    } else {
      this.getStores(clientFk)
    }
  }

  getStores(client_fk: number): void {
    this.storeService
      .fetchAllStoresByClientFK(client_fk)
      .subscribe((data: undefined) => {
        this.dataSource.data = data
        this.showAllStores = true
        this.showSearchedStore = false
        this.clientStores = this.dataSource.data
      })
  }

  async rackSearchListing(
    searchString,
    userid,
    clientFk,
    schemaName
  ): Promise<void> {
    this.logger.log(
      'Start of RackListComponent : rackListing :filterValue',
      searchString
    )
    this.rackService
      .serachProductByRack(searchString, userid, clientFk, schemaName)
      .subscribe(async (data: any) => {
        this.productsInStore = data
        if (this.storesData.length > 0) {
          this.storesData.splice(0)
        }
        for (let res of data) {
          if (res.storeid != undefined && res.storeid != null) {
            this.storeService
              .getStoreById(res.storeid)
              .subscribe(async response => {
                this.storesData.push(response)
                await this.displayLocations()
              })
          }
        }
      })

    this.logger.log('Start of RackListComponent : searchString ')
  }

  private async displayLocations(): Promise<void> {
    this.openNav()
    const marker: any = []
    for (let store of this.storesData) {
      const storeLocation = new google.maps.Marker({
        position: {
          lat: parseFloat(store.latitude),
          lng: parseFloat(store.longitude)
        },
        map: this.map,
        title: store.storeName
      })
      marker.push(storeLocation)
      this.markers.push(storeLocation)
    }

    if (marker.length > 0) {
      for (let point of marker) {
        this.map.setCenter(point.getPosition())
      }
    }
  }

  //   private setCurrentLocation(): void {
  //     if ('geolocation' in navigator) {
  //       navigator.geolocation.getCurrentPosition(position => {
  //         this.markers.push({
  //           position: {
  //             lat: position.coords.latitude,
  //             lng: position.coords.longitude
  //           },
  //           label: {
  //             color: 'black'
  //           }
  //         })
  //         this.latitude = position.coords.latitude
  //         this.longitude = position.coords.longitude
  //         this.getAddress(this.latitude, this.longitude)
  //       })
  //     }
  //   }

  //   getAddress(latitude, longitude): void {
  //     this.geoCoder.geocode(
  //       { location: { lat: latitude, lng: longitude } },
  //       (results, status) => {
  //         if (status === 'OK') {
  //           if (results[0]) {
  //             this.zoom = 12
  //             this.address = results[0].formatted_address
  //           } else {
  //             window.alert('No results found')
  //           }
  //         } else {
  //           window.alert(`Geocoder failed due to: ${status}`)
  //         }
  //       }
  //     )
  //   }

  //   markerDragEnd($event: any): void {
  //     console.log($event)
  //     this.latitude = $event.coords.lat
  //     this.longitude = $event.coords.lng
  //     this.getAddress(this.latitude, this.longitude)
  //   }

  //   zoomIn(): void {
  //     if (this.zoom < this.maxZoom) this.zoom++
  //    // this.logger.log('Get Zoom', this.map.getZoom())
  //   }

  //   zoomOut(): void {
  //     if (this.zoom > this.minZoom) this.zoom--
  //   }

  //   eventHandler(event, name: string): void {
  //     this.logger.log(event, name)

  //     // Add marker on double click event
  //     if (name === 'mapDblclick') {
  //       this.dropMarker(event)
  //     }
  //   }

  //   // Markers
  //   logCenter(): void {
  //     //this.logger.log(JSON.stringify(this.map.getCenter()))
  //   }

  //   selectMarker(event): void {
  //     this.selectedMarker = {
  //       lat: event.latitude,
  //       lng: event.longitude
  //     }
  //   }

  //   dropMarker(event): void {
  //     this.markers.push({
  //       position: {
  //         lat: event.latLng.lat(),
  //         lng: event.latLng.lng()
  //       },
  //       label: {
  //         color: 'blue',
  //         text: `Marker label ${this.markers.length + 1}`
  //       },
  //       title: `Marker title ${this.markers.length + 1}`,
  //       info: `Marker info ${this.markers.length + 1}`,
  //       options: {
  //         animation: google.maps.Animation.DROP
  //       }
  //     })
  //   }

  //   mapClicked($event): void {
  //     this.markers.push({
  //       lat: $event.coords.lat,
  //       lng: $event.coords.lng,
  //       draggable: true
  //     })
  //   }

  // openInfo(marker: MapMarker, content: string): void {
  //   this.infoContent = content
  //   this.info.open(marker)
  // }

  // new code google maps

  center: google.maps.LatLngLiteral = {
    lat: 12.988529497277261,
    lng: 77.55455927096821
  }

  createCustomMarkerIcon(color: string): google.maps.Symbol {
    return {
      path: google.maps.SymbolPath.BACKWARD_CLOSED_ARROW,
      scale: 10, // Adjust the scale as needed
      fillColor: color,
      fillOpacity: 1,
      strokeWeight: 0
    }
  }

  zoomInOnClick(map: google.maps.Map, marker: google.maps.Marker) {
    const currentZoom = map.getZoom()

    if (currentZoom !== null && currentZoom !== undefined) {
      const newZoom = currentZoom + 2 // Increase the zoom level by 2

      const markerPosition = marker.getPosition()
      if (markerPosition !== null && markerPosition !== undefined) {
        map.setZoom(newZoom)
        map.setCenter(markerPosition) // Center the map on the clicked marker
      }
    }
  }

  // Common method to create markers
  createMarker(
    map: google.maps.Map,
    location: {lat: number; lng: number; label: string; color: string},
    label: string,
    color: string
  ) {
    const marker = new google.maps.Marker({
      position: location,
      map: map,
      label: label,
      icon: {
        path: google.maps.SymbolPath.BACKWARD_CLOSED_ARROW,
        scale: 5,
        fillColor: color,
        fillOpacity: 1,
        strokeColor: '#fff',
        strokeWeight: 1
      }
    })

    marker.addListener('click', () => {
      this.zoomInOnClick(map, marker)
    })

    return marker
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
  }

  updateMap(data: any) {
    this.map = new google.maps.Map(data.ele, {
      zoom: 4,
      center: this.center,
      minZoom: this.minZoomLevel // Set the minimum zoom level
    })
  }
  onSubmit(): void {
    // Ensure latitude and longitude are provided
    if (!this.latitude || !this.longitude) {
      console.error('Latitude and Longitude are required.')
      return
    }

    // Check if the map is already initialized
    if (!this.map) {
      console.error(
        'Map is not initialized. Ensure the map is initialized before calling submit.'
      )
      return
    }

    // Create a marker on the existing map
    const marker = new google.maps.Marker({
      position: {
        lat: parseFloat(this.latitude),
        lng: parseFloat(this.longitude)
      },
      map: this.map,
      title: 'Location'
    })

    // Center the map on the new marker
    this.map.setCenter(marker.getPosition())
  }

  private async removeMarkerByIndex(): Promise<void> {
    // Check if the index is valid
    for (let index = 0; index <= this.markers.length; index++) {
      // Remove the marker from the map
      this.markers[index].setMap(null)
      this.markers.splice(index, 1)
    }
  }

  public openNav() {
    document.getElementById('mySidenav').style.width = '400px'
  }

  public async closeNav() {
    document.getElementById('mySidenav').style.width = '0%'
    await this.removeMarkerByIndex()
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

  public async navigateToRacks() {
    this.router.navigate(['/racks'])
  }
}
