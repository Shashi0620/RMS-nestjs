import { Column, DataType, Model, Table } from 'sequelize-typescript'

@Table({
  modelName: 'support'
})
export class Support extends Model<Support> {
  @Column
    title!: string

  @Column({
    type: DataType.CHAR(4000)
  })
    support?: string

  @Column
    videoLink!: string
}
