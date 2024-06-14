import {
  BelongsTo,
  Column,
  ForeignKey,
  HasMany,
  Model,
  Table
} from 'sequelize-typescript'
import { Store } from './store.model'
import { TrayItem } from './trayItem.model'
import { Escalation } from './esculation.model'

@Table({
  modelName: 'notificationSettings'
})
export class NotificationSettings extends Model<NotificationSettings> {
  @Column
    settingName!: string

  @Column
    notificationType!: string

  @Column
    isEscalationRequired!: boolean

  @ForeignKey(() => Store)
    storeFk!: number

  @HasMany(() => TrayItem)
    trayItems?: TrayItem[]

  @HasMany(() => Escalation)
    escalation!: Escalation[]

  @BelongsTo(() => Store)
    store!: Store
}
