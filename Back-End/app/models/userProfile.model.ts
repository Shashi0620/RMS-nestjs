import { BelongsTo, Column, ForeignKey, Model, Table } from 'sequelize-typescript'
import { User } from './user.model'

@Table({
  modelName: 'userprofiles'
})
export class UserProfile extends Model<UserProfile> {
  @Column
    email!: string

  @Column
    password!: string

  @Column
    userName!: string

  @Column
    phone!: string

  @Column
    address?: string

  @Column
    city!: string

  @Column
    image!: string

  @Column
    createdBy!: string

  @ForeignKey(() => User)
    user_fk!: number

  @BelongsTo(() => User)
    user!: User
}
