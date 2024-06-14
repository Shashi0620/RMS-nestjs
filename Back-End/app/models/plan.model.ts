import { Column, HasMany, Model, Table } from 'sequelize-typescript'
import { Client } from './client.model'

@Table({
  modelName: 'plans'
})
export class Plan extends Model<Plan> {
  @Column
    name!: string

  @Column
    noOfUsers!: number

  @Column
    noOfRacks!: number

  @Column
    noOfItemTypes!: number

  @Column
    totalNoOfStores!: number

  @Column
    rate?: number

  @Column
    planImg!: string

  @HasMany(() => Client)
    clients?: Client[]
}
