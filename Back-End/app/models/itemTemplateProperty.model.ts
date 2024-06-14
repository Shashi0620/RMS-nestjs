import { Column, Model, Table } from 'sequelize-typescript'

@Table({
  modelName: 'itemtemplatepropertys'
})
export class ItemTemplateProperty extends Model<ItemTemplateProperty> {
  @Column
    name!: string

  @Column
    description!: string

  @Column
    subscriberId!: number

  @Column
    label!: string

  @Column
    type!: string

  @Column
    required!: boolean
}
