import { QueryTypes } from 'sequelize'
import { sequelizeConfig } from '../config/seq.config'
import { Injectable, Logger } from '@nestjs/common'
import { UserPreference } from '../models/userPreference.model'
import { InjectModel } from '@nestjs/sequelize'

@Injectable()
export class UserPreferenceService {
  constructor (
    @InjectModel(UserPreference)
    private readonly userPreference: typeof UserPreference
  ) {}

  public async createUserPreference (
    payload: UserPreference
  ): Promise<UserPreference> {
    Logger.log('Start of UserPreferenceService : createUserPreference')
    const data = await this.userPreference.create(payload)
    Logger.log(
      'End of UserPreferenceService : createUserPreference :response',
      data
    )
    return data
  }

  public async updateSelectedColumns (
    id: number,
    payload: UserPreference
  ): Promise<UserPreference[]> {
    Logger.log('Start of UserPreferenceService : updateSelectedColumns')
    const updateid = id
    const updateSelectedColumns = await sequelizeConfig.query(
      `UPDATE "userPreferences" SET "selectedColumns" = '${payload.selectedColumns}' WHERE id = ${updateid} And "templateId" = ${payload.templateId}`,
      { type: QueryTypes.UPDATE, model: UserPreference, mapToModel: true }
    )
    Logger.log(
      'End of UserPreferenceService : updateSelectedColumns :response',
      updateSelectedColumns
    )
    return updateSelectedColumns
  }

  public async fetchAllSelectedColumns (
    templateid: number,
    userfk: number
  ): Promise<UserPreference[]> {
    Logger.log(
      'Start of UserPreferenceService : fetchAllSelectedColumns : templateid ',
      templateid,
      ':userfk',
      userfk
    )
    const templateId = templateid
    const userFk = userfk
    const data = await sequelizeConfig.query(
      `SELECT * FROM "userPreferences" where "templateId" = ${templateId} AND "userFk" = ${userFk}`,
      {
        type: QueryTypes.SELECT,
        model: UserPreference,
        mapToModel: true
      }
    )
    Logger.log(
      'End of UserPreferenceService : fetchAllSelectedColumns : response ',
      data
    )
    return data
  }
}
