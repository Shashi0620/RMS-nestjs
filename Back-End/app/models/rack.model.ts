import {
  BelongsTo,
  Column,
  ForeignKey,
  HasMany,
  Model,
  Table
} from 'sequelize-typescript'
import { Client } from './client.model'
import { Store } from './store.model'
import { Tray } from './tray.model'

@Table({
  modelName: 'racks'
})
export class Rack extends Model<Rack> {
  @Column
    name!: string

  @Column
    no_of_rows!: number

  @Column
    no_of_columns!: number

  @ForeignKey(() => Client)
    client_fk!: number

  @ForeignKey(() => Store)
    storeFk!: number

  @Column
    createdBy!: string

  @HasMany(() => Tray)
    tray?: Tray[]

  @BelongsTo(() => Client)
    client!: Client

  @BelongsTo(() => Store)
    store!: Store
}
