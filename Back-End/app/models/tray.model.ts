import { BelongsTo, Column, ForeignKey, Model, Table } from 'sequelize-typescript'
import { Rack } from './rack.model'

@Table({
  modelName: 'trays'
})
export class Tray extends Model<Tray> {
  @Column
    x!: number

  @Column
    y!: number

  @Column
    h!: number

  @Column
    w!: number

  @Column
    name?: string

  @Column
    color!: string

  @Column
    quantity!: number

  @Column
    searchable!: boolean

  @Column
    img!: string

  @Column
    attr1!: string

  @Column
    val1!: number

  @Column
    attr2!: string

  @Column
    val2!: number

  @Column
    attr3!: string

  @Column
    val3!: number

  @Column
    attr4!: string

  @Column
    val4!: string

  @Column
    attr5!: string

  @Column
    val5!: number

  @Column
    attribute!: string

  @Column
    createdBy!: string

  @Column
    modifiedBy!: string

  @ForeignKey(() => Rack)
    rack_fk!: number

  @BelongsTo(() => Rack)
    rack!: Rack
}
