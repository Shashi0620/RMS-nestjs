import {
  AutoIncrement,
  BelongsTo,
  Column,
  ForeignKey,
  HasMany,
  Model,
  PrimaryKey,
  Table
} from 'sequelize-typescript'
import { Client } from './client.model'
import { Rack } from './rack.model'
import { NotificationSettings } from './notificationSettings.model'

@Table({
  modelName: 'stores'
})
export class Store extends Model<Store> {
  @PrimaryKey
  @AutoIncrement
  @Column
    storeId!: number

  @Column
    storeName!: string

  @Column
    address!: string

  @Column
    longitude!: number

  @Column
    latitude!: number

  @ForeignKey(() => Client)
    client_fk!: number

  @HasMany(() => Rack)
    racks?: Rack[]

  @HasMany(() => NotificationSettings)
    NotificationSettings?: NotificationSettings[]

  @BelongsTo(() => Client)
    client!: Client
}
