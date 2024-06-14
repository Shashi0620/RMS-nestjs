import {
  AutoIncrement,
  BelongsTo,
  Column,
  ForeignKey,
  Model,
  PrimaryKey,
  Table
} from 'sequelize-typescript'
import { Template } from './item.model'
import { NotificationSettings } from './notificationSettings.model'
import { Rack } from './rack.model'
import { Tray } from './tray.model'
import { User } from './user.model'

@Table({
  modelName: 'trayItems'
})
export class TrayItem extends Model<TrayItem> {
  @PrimaryKey
  @AutoIncrement
  @Column
    id!: number

  @Column
    quantity!: number

  @Column
    upperLimit!: number

  @Column
    lowerLimit!: number

  @Column
    formId?: number

  @ForeignKey(() => User)
    userFk!: number

  @ForeignKey(() => Rack)
    rackId?: number

  @ForeignKey(() => Tray)
    trayId?: number

  @ForeignKey(() => NotificationSettings)
    notificationSettngFk!: number

  @ForeignKey(() => Template)
    tempId?: number

  @BelongsTo(() => Rack)
    rack!: Rack

  @BelongsTo(() => Tray)
    tray!: Tray

  @BelongsTo(() => User)
    user!: User

  @BelongsTo(() => Template)
    template!: Template

  @BelongsTo(() => NotificationSettings)
    notificationSetting!: NotificationSettings
}
