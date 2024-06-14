import { UserStore } from '../models/userStore.model'
import { Logger } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'

export class UserStoreServices {
  constructor (
    @InjectModel(UserStore)
    private readonly userStoreModel: typeof UserStore
  ) {}

  public async addStaffToStore (userStore: UserStore): Promise<UserStore> {
    Logger.log(
      'Start of UserStoreController : addStaffToStore :payload',
      userStore
    )
    const data = await this.userStoreModel.create(userStore)
    Logger.log('End of UserStoreController : addStaffToStore :reponse', data)
    return data
  }

  public async fetchStoreByStaffId (userFk, staffdata): Promise<any> {
    Logger.log(
      'Start of UserStoreController : fetchStoreByStaffId :payload',
      userFk,
      'payload',
      staffdata
    )
    const userFkId = userFk
    const staff = staffdata
    const staffToStore = { staff: { stores: {} } }
    staffToStore.staff = staff
    const fetchStoreByStaffIds = await this.userStoreModel.findAll({
      where: { userFk: userFkId }
    })
    staffToStore.staff.stores = fetchStoreByStaffIds
    const data = staffToStore
    Logger.log(
      'End of UserStoreController : fetchStoreByStaffId ',
      fetchStoreByStaffIds
    )
    return data
  }

  public async deleteStoreByStaffId (id: number): Promise<string> {
    Logger.log('Start of UserStoreController : deleteStoreByStaffId :id', id)
    const userFk = id
    await this.userStoreModel.destroy({
      where: { userFk }
    })
    Logger.log('Start of UserStoreController : deleteStoreByStaffId')
    return 'deleted'
  }
}
