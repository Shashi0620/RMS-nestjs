import { Column, Model, Table } from 'sequelize-typescript'

@Table({
  modelName: 'itemtemplates'
})
export class ItemTemplate extends Model<ItemTemplate> {
  @Column
    name!: string

  @Column
    description!: string

  @Column
    subscriberId!: number
}
