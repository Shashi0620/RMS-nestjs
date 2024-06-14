import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  HasMany,
  Model,
  Table
} from 'sequelize-typescript'
import { Menu } from './menu.model'
import { UserPreference } from './userPreference.model'
import { Client } from './client.model'

@Table({
  modelName: 'templates'
})
export class Template extends Model<Template> {
  @Column
    name!: string

  @Column
    description!: string

  @Column({ type: DataType.JSON })
    attributes!: [] | string

  @HasMany(() => Menu)
    menu?: Menu[]

  @HasMany(() => UserPreference)
    userPreference?: UserPreference[]

  @ForeignKey(() => Client)
    clientFk!: number

  @BelongsTo(() => Client)
    client!: Client
}
