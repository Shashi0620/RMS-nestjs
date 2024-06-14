import {
  AutoIncrement,
  BelongsTo,
  Column,
  ForeignKey,
  Model,
  PrimaryKey,
  Table
} from 'sequelize-typescript'
import { Client } from './client.model'
import { Template } from './item.model'
import { Role } from './role.model'

@Table({
  modelName: 'menus'
})
export class Menu extends Model<Menu> {
  @PrimaryKey
  @AutoIncrement
  @Column
    id!: number

  @Column
    label!: string

  @Column
    action!: string

  @ForeignKey(() => Role)
    roleId!: number

  @ForeignKey(() => Client)
    clientFk!: number

  @ForeignKey(() => Menu)
    menu_fk!: number

  @ForeignKey(() => Template)
    templateID!: number

  @BelongsTo(() => Menu)
    menu!: Menu

  @BelongsTo(() => Role)
    role!: Role

  @BelongsTo(() => Client)
    client!: Client

  @BelongsTo(() => Template)
    itemTemplate!: Template
}
