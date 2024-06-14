import { BelongsTo, Column, ForeignKey, Model, Table } from 'sequelize-typescript'
import { Template } from './item.model'
import { User } from './user.model'

@Table({
  modelName: 'userPreferences'
})
export class UserPreference extends Model<UserPreference> {
  @Column
    selectedColumns!: string

  @ForeignKey(() => User)
    userFk!: number

  @ForeignKey(() => Template)
    templateId!: number

  @BelongsTo(() => Template)
    template!: Template

  @BelongsTo(() => User)
    user!: User
}
