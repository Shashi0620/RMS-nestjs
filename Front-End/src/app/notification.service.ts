/* eslint-disable @typescript-eslint/no-explicit-any */
/*
 * This is notification.service.ts
 */
import {HttpClient} from '@angular/common/http'
import {Injectable} from '@angular/core'
import {Observable} from 'rxjs'
import {environment} from '../environments/environment'
import {Notification} from './models/notification.model'
import {NotificationSetting} from './models/notificationSetting.model'
const baseUrl = environment.baseUrl

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  constructor(private http: HttpClient) {}

  createNotification(notification: Notification): Observable<Notification> {
    return this.http.post(
      `${baseUrl}/api/notification/createNotification`,
      notification
    )
  }

  createNotificationSetting(
    notificationSettings: NotificationSetting
  ): Observable<NotificationSetting> {
    return this.http.post<NotificationSetting>(
      `${baseUrl}/api/notificationSetting/createNotificationSetting`,
      notificationSettings
    )
  }

  updateNotificationSettings(
    notificationSettingId: number,
    notificationSettings: NotificationSetting
  ): Observable<NotificationSetting> {
    return this.http.put<NotificationSetting>(
      `${baseUrl}/api/notificationSetting/updateNotificationSetting/` +
        `${notificationSettingId}`,
      notificationSettings
    )
  }

  fetchNotificationByStoreFk(storeFk: number): Observable<Notification[]> {
    return this.http.get<Notification[]>(
      `${baseUrl}/api/notificationSetting/fetchNotificationByStoreFk/${storeFk}`
    )
  }

  fetchAllNotificationSettingsOnRackId(
    rackId: number
  ): Observable<NotificationSetting[]> {
    return this.http.get<NotificationSetting[]>(
      `${baseUrl}/api/notificationSetting/notificationSetting/byRackId/${rackId}`
    )
  }

  fetchNotificationSettingandEscalation(
    id: number
  ): Observable<NotificationSetting> {
    return this.http.get<NotificationSetting>(
      `${baseUrl}/api/notificationSetting/fetchNotificationSettingAndEscalation/${id}`
    )
  }

  fetchNotificationSettingById(id: number): Observable<NotificationSetting> {
    return this.http.get(
      `${baseUrl}/api/notificationSetting/fetchNotificationSettingById/${id}`
    )
  }

  deleteNotificationSetting(id: number): Observable<string> {
    let HTTPOptions: Object = {
      responseType: 'text'
    }
    return this.http.delete<string>(
      `${baseUrl}/api/notificationSetting/deleteNotificationSetting/${id}`,
      HTTPOptions
    )
  }
}
