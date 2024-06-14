import { Inject, Injectable, Logger, forwardRef } from '@nestjs/common'
import { Store } from '../models/store.model'
import { InjectModel } from '@nestjs/sequelize'
import { RackService } from './rack.service'
import { sequelizeConfig } from '../config/seq.config'
import { QueryTypes } from 'sequelize'
import { Rack } from '../models/rack.model'

@Injectable()
export class StoreService {
  constructor (
    @InjectModel(Store)
    private readonly storeModel: typeof Store,
    @InjectModel(Rack)
    private readonly rackModel: typeof Rack,
    @Inject(forwardRef(() => RackService))
    private readonly rackService: RackService
  ) {}

  public async create (payload: Store): Promise<Store> {
    Logger.log('Start of StoreService : create ')
    const response = await this.storeModel.create(payload)
    Logger.log('End of StoreService : create :response', response)
    return response
  }

  public async fetchStoreById (id: number): Promise<Store | null> {
    Logger.log('Start of StoreService : fetchStoreById :id', id)
    const response = await this.storeModel.findByPk(id)
    Logger.log('End of StoreService : fetchStoreById  :response', response)
    return response
  }

  public async updateStore (
    payload: Store,
    id: number
  ): Promise<[number | Store]> {
    Logger.log('Start of StoreService : updateStore :id', id)
    const storeID = id
    const RequestBody = payload
    const updateStore = await this.storeModel.update(RequestBody, {
      where: { storeId: storeID }
    })
    Logger.log('End of StoreService : updateStore :response', updateStore)
    return updateStore
  }

  public async storeDelete (storeId: number): Promise<string> {
    Logger.log('Start of StoreService : storeDelete :id', storeId)
    const deleteRelatedStaffsToStore = `DELETE FROM "userStores" WHERE "storeId" = ${storeId}`
    await sequelizeConfig.query(deleteRelatedStaffsToStore, {
      type: QueryTypes.DELETE
    })
    const selectRackIdQuery = `SELECT id FROM racks WHERE "storeFk" = ${storeId}`
    const rackIdRelatedToStore = await sequelizeConfig.query(
      selectRackIdQuery,
      {
        type: QueryTypes.SELECT,
        model: this.rackModel
      }
    )
    if (rackIdRelatedToStore.length > 0) {
      await this.rackService.deleteRackById(+rackIdRelatedToStore[0].id)
    }
    const deleteEscalationsOnNotificationSettingFk = `DELETE FROM escalations WHERE "notificationSettngFk" IN ( SELECT ns.id FROM stores s JOIN "notificationSettings" ns ON ns."storeFk" = s."storeId" 
    JOIN escalations e ON e."notificationSettngFk" = ns.id WHERE s."storeId" = ${storeId})`
    await sequelizeConfig.query(deleteEscalationsOnNotificationSettingFk, {
      type: QueryTypes.SELECT,
      model: this.rackModel
    })
    await sequelizeConfig.query(
      `DELETE FROM "notificationSettings" WHERE "storeFk"= ${storeId}`,
      {
        type: QueryTypes.SELECT,
        model: this.rackModel
      }
    )
    await this.storeModel.destroy({
      where: { storeId }
    })
    Logger.log('End of StoreService : storeDelete')
    return 'deleted'
  }

  public async fetchAllStoresByClientFK (id: number): Promise<Store[]> {
    Logger.log('Start of StoreService : fetchAllStoresByClientFK :id', id)
    const data = await this.storeModel.findAll({ where: { client_fk: id } })
    Logger.log('End of StoreService : fetchAllStoresByClientFK :response', data)
    return data
  }
}
