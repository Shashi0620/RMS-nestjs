import {
  BelongsTo,
  Column,
  ForeignKey,
  HasMany,
  Model,
  Table
} from 'sequelize-typescript'
import { Client } from './client.model'
import { Role } from './role.model'
import { Store } from './store.model'
import { TrayItem } from './trayItem.model'
import { UserPreference } from './userPreference.model'
@Table({
  modelName: 'users'
})
export class User extends Model<User> {
  @Column
    email!: string

  @Column
    password!: string

  @Column
    username!: string

  @Column
    phone!: string

  @Column
    location?: string

  @Column
    token!: string

  @Column
    status?: string

  @Column
    esUrl!: string

  @Column
    trialend!: string

  @Column
    logindate!: Date

  @ForeignKey(() => Client)
    clientFk!: number

  @ForeignKey(() => Role)
    roleId!: number

  @ForeignKey(() => Store)
    storeFk!: number

  @HasMany(() => TrayItem)
    trayItems?: TrayItem[]

  @HasMany(() => UserPreference)
    userPreference?: UserPreference[]

  @BelongsTo(() => Client)
    client!: Client

  @BelongsTo(() => Store)
    user!: Store

  @BelongsTo(() => Role)
    role!: Role
}
