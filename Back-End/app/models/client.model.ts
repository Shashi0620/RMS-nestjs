import {
  BelongsTo,
  Column,
  ForeignKey,
  HasMany,
  Model,
  Table
} from 'sequelize-typescript'
import { User } from './user.model'
import { Store } from './store.model'
import { Plan } from './plan.model'
import { Rack } from './rack.model'

@Table({
  modelName: 'clients'
})
export class Client extends Model<Client> {
  @Column
    name!: string

  @HasMany(() => User)
    users?: User[]

  @HasMany(() => Store)
    stores?: Store[]

  @ForeignKey(() => Plan)
    planFk!: number

  @HasMany(() => Rack)
    racks?: Rack[]

  @BelongsTo(() => Plan)
    plans!: Plan
}
