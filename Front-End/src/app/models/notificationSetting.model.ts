/*
 * This is notificationsetting model
 */
export class NotificationSetting {
  id?: number
  settingName?: string
  notificationType?: string
  isEscalationRequired?: boolean
  storeFk?: number
}
