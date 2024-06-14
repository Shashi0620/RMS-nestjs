import { Logger } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { Notification } from '../models/notification.model'

export interface ISaveNotification {
  notificationType: string
  email: string
  status: string
  userFk: number
  noOfRetry: number
  content: JSON
}
export class UserNotification {
  constructor (
    @InjectModel(Notification)
    private readonly notificationModel: typeof Notification
  ) {}

  public async saveNotification (payload: Notification): Promise<Notification> {
    Logger.log('Start of UserNotification : saveNotification', payload)
    const saveNotification = await this.notificationModel.create(payload)
    Logger.log(
      'End of UserNotification : saveNotification :response',
      saveNotification
    )
    return saveNotification
  }
}
