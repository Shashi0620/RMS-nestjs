import { BelongsTo, Column, ForeignKey, Model, Table } from 'sequelize-typescript'
import { NotificationSettings } from './notificationSettings.model'

@Table({
  modelName: 'escalations'
})
export class Escalation extends Model<Escalation> {
  @Column
    escalationType!: string

  @Column
    noOfRemainder!: number

  @Column
    timeIntervalBetweenNotificationsInDays!: number

  @Column
    to!: string

  @ForeignKey(() => NotificationSettings)
    notificationSettngFk!: number

  @BelongsTo(() => NotificationSettings)
    notificationSetting!: NotificationSettings
}
