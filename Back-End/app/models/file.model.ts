import { BelongsTo, Column, ForeignKey, Model, Table } from 'sequelize-typescript'
import { Tray } from './tray.model'
import { User } from './user.model'

@Table({
  modelName: 'files'
})
export class File extends Model<File> {
  @Column
    filename!: string

  @Column
    filepath!: string

  @ForeignKey(() => User)
    user_fk!: number

  @ForeignKey(() => Tray)
    tray_fk!: number

  @BelongsTo(() => User)
    users!: User

  @BelongsTo(() => Tray)
    tray!: Tray
}
