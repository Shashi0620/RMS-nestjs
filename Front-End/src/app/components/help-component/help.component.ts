/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/unbound-method */
/* eslint-disable no-undef */
/*
 * This is contactus.component.ts
 */
import {Component, ElementRef, Input, ViewChild} from '@angular/core'
import {UserService} from '../../services/user.service'
import {Support} from '../../../app/models/support.model'
import {User} from 'src/app/models/user.model'
import {DomSanitizer, SafeResourceUrl} from '@angular/platform-browser'

@Component({
  selector: 'app-help',
  templateUrl: './help.component.html',
  styleUrls: ['./help.component.css']
})
export class HelpComponent {
  videoSource = '../../../assets/videoGuide/'

  safeSrc: SafeResourceUrl
  @ViewChild('videoPlayer') videoplayer: any
  public startedPlay: boolean = false
  public show: boolean = false

  triggerOrigin: any
  isOpen = false
  support: Support = {}
  translatedSupport: Support = {}
  @Input() infoKey: string
  @Input() notificationID: string
  notificationTemplate = {}
  user: User = {}
  toolTipList = ['ToolTip1', 'ToolTip2', 'ToolTip3', 'ToolTip4', 'ToolTip5']
  currentToolTipListIndex = 0
  forTrailUser = false
  nextButtonFlag = true
  previousButtonFlag = false
  currentDate = new Date()
  menuObj: [] = []
  videoPlayerScreen = false
  currentSectionTitle: string

  constructor(
    private userService: UserService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.currentSectionTitle = this.infoKey
    this.menuObj = JSON.parse(sessionStorage.getItem('menuObj'))
  }

  async toggle(trigger: any): Promise<void> {
    this.retrieveDescription()
    this.triggerOrigin = trigger
    this.isOpen = !this.isOpen
  }

  retrieveDescription(): void {
    this.userService.fetchDescription(this.infoKey).subscribe(data => {
      this.translatedSupport = data
      if (this.menuObj === null) {
        this.menuObj = JSON.parse(sessionStorage.getItem('menuObj'))
      }
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

  async sectionsVideoPlayer(trigger: any): Promise<void> {
    this.userService
      .fetchDescription(this.currentSectionTitle)
      .subscribe(async data => {
        if (
          data.videoLink != null &&
          data.videoLink != '' &&
          data.videoLink != undefined
        ) {
          await window.open(data.videoLink)
        }
      })
  }

  pauseVideo(videoplayer) {
    videoplayer.nativeElement.play()
    setTimeout(() => {
      videoplayer.nativeElement.pause()
      if (videoplayer.nativeElement.paused) {
        this.show = !this.show
      }
    }, 5000)
  }
}
