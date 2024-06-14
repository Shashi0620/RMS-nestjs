import { BelongsTo, Column, ForeignKey, Model, Table } from 'sequelize-typescript'
import { Store } from './store.model'
import { User } from './user.model'

@Table({
  modelName: 'userStores'
})
export class UserStore extends Model<UserStore> {
  @Column
    storeName!: string

  @ForeignKey(() => User)
    userFk!: number

  @ForeignKey(() => Store)
    storeId!: number

  @BelongsTo(() => User)
    user!: User

  @BelongsTo(() => Store)
    store!: Store
}
