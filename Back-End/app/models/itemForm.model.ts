import { BelongsTo, Column, ForeignKey, Model, Table } from 'sequelize-typescript'
import { Template } from './item.model'

@Table({
  modelName: 'itemforms'
})
export class ItemForms extends Model<ItemForms> {
  @Column
    name!: string

  @Column
    description!: string

  @Column({ type: 'json' })
    attributes?: string

  @ForeignKey(() => Template)
    itemTempId!: number

  @BelongsTo(() => Template)
    itemTemplate!: Template
}
