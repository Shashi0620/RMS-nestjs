/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/unbound-method */
/* eslint-disable no-undef */
/*
 * This is contactus.component.ts
 */
import {Component, Input, OnInit} from '@angular/core'
import {UserService} from '../../services/user.service'
import {Support} from '../../../app/models/support.model'
import {Notification} from 'src/app/models/notification.model'
import {User} from 'src/app/models/user.model'

@Component({
  selector: 'notification-view-component',
  templateUrl: './notification-view-component.html',
  styleUrls: ['./notification-view-component.css']
})
export class NotificationViewComponent implements OnInit {
  triggerOrigin: any
  isOpen = false
  support: Support = {}
  @Input() notificationID: string
  notificationTemplate = {}
  user: User = {}

  constructor(private userService: UserService) {}

  ngOnInit(): void {}

  async toggle(trigger: any): Promise<void> {
    if (this.notificationID != null && this.notificationID != undefined) {
      await this.retriveNotificationOnId()
    }
    this.triggerOrigin = trigger
    this.isOpen = !this.isOpen
  }

  cancel(): void {
    this.isOpen = !this.isOpen
  }

  async retriveNotificationOnId(): Promise<void> {
    this.userService
      .fetchNotificationById(this.notificationID)
      .subscribe(data => {
        this.notificationTemplate = data
      })
  }
}
