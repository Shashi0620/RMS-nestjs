/*
 * This is notification model
 */
export class Notification {
  id?: number
  notificationType?: string
  email?: string
  status?: string
  noOfRetry?: number
  userFk?: number
  content?: any
  newNotification?: number
  notificationTemplate?: string
}
