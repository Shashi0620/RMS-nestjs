import { Column, HasMany, Model, Table } from 'sequelize-typescript'
import { User } from './user.model'
import { Menu } from './menu.model'

@Table({
  modelName: 'roles'
})
export class Role extends Model<Role> {
  @Column
    name!: string

  @HasMany(() => User)
    users?: User[]

  @HasMany(() => Menu)
    menu?: Menu[]
}
