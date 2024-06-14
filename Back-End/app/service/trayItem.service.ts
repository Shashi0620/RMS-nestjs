/* eslint-disable no-unreachable-loop */
import { sequelizeConfig } from '../config/seq.config'
import { EscalationController } from '../controller/escalation.controller'
import { QueryTypes } from 'sequelize'
import { forwardRef, Inject, Injectable, Logger, Req } from '@nestjs/common'
import { TrayItem } from '../models/trayItem.model'
import { InjectModel } from '@nestjs/sequelize'
import { Request } from 'express'
@Injectable()
export class TrayItemService {
  constructor (
    @InjectModel(TrayItem)
    private readonly trayItemModel: typeof TrayItem,
    @Inject(forwardRef(() => EscalationController))
    private readonly escalationController: EscalationController
  ) {}

  public async trayItemCreate (
    payload: TrayItem,
    templateName: string,
    schemaName: string
  ): Promise<TrayItem> {
    Logger.log('Start of TrayItemService : trayItemCreate')
    const trayItem = {} as TrayItem
    trayItem.quantity = payload.quantity
    trayItem.rackId = payload.rackId
    trayItem.trayId = payload.trayId
    trayItem.formId = payload.formId
    trayItem.tempId = payload.tempId
    trayItem.userFk = payload.userFk
    let createTray = {} as TrayItem
    if (payload.id === 0) {
      createTray = await this.trayItemModel.create(trayItem)
    } else {
      await this.checkInTrayQuantity(payload.id, payload.quantity)
    }
    await sequelizeConfig.query(
      `UPDATE ${schemaName}.${templateName}_template SET  quantity =  quantity - ${payload.quantity} WHERE id=${payload.formId}`,
      { type: QueryTypes.UPDATE }
    )
    Logger.log('End of TrayItemService : trayItemCreate :response', createTray)
    return createTray
  }

  public async checkInTrayQuantity (
    trayItemId: number,
    trayQuantity: number
  ): Promise<TrayItem[]> {
    Logger.log('Start of TrayItemService : updateTrayQuantity')
    const updateTrayQuantityByTrayIdQuery = `UPDATE "trayItems" set quantity = quantity + ${trayQuantity} WHERE Id = ${trayItemId}`
    Logger.log('End of TrayItemService : updateTrayQuantity ')
    const executeUpdate = await sequelizeConfig.query(
      updateTrayQuantityByTrayIdQuery,
      {
        type: QueryTypes.UPDATE,
        model: this.trayItemModel
      }
    )
    return executeUpdate
  }

  public async checkOutTrayQuantity (
    trayItemId: number,
    payload: TrayItem,
    @Req() req: Request,
    productQuantity: number
  ): Promise<TrayItem[]> {
    Logger.log(
      'Start of TrayItemService : updateTrayItems :trayItemId',
      trayItemId
    )
    const updateTrayItemsQuery = `UPDATE "trayItems" set quantity = quantity - ${productQuantity} WHERE Id = ${trayItemId}`
    const updateEscalation = await sequelizeConfig.query(updateTrayItemsQuery, {
      type: QueryTypes.UPDATE,
      model: this.trayItemModel
    })
    try {
      if (updateEscalation[1] !== null && updateEscalation[1] !== undefined) {
        if (
          payload.quantity <= payload.lowerLimit ||
          payload.quantity >= payload.upperLimit
        ) {
          await this.escalationController.fetchByNotificationId(
            payload.notificationSettngFk,
            req,
            payload.userFk
          )
        }
      } else {
        Logger.log(`Cannot update trayItems with id=${trayItemId}.`)
      }
    } catch (err) {
      Logger.error(`Error updating Form with id=${trayItemId}.`, err)
    }
    Logger.log(
      'End of TrayItemService : updateTrayItems :response',
      updateEscalation
    )
    return updateEscalation
  }

  public async updateLowerAndUpperLimit (
    trayItemId: number,
    payload: TrayItem
  ): Promise<TrayItem[]> {
    Logger.log(
      'Start of TrayItemService : updateLowerAndUpperLimit :trayId',
      trayItemId
    )

    const updateLowerAndUpperLimitQuery = `UPDATE 
    "trayItems" 
  SET 
    "lowerLimit" = ${payload.lowerLimit}, 
    "upperLimit" = ${payload.upperLimit}, 
    "notificationSettngFk" = ${payload.notificationSettngFk} 
  WHERE 
    id = ${trayItemId} 
    And "trayId" = ${payload.trayId} 
    And "tempId" = ${payload.tempId} 
    And "formId" = ${payload.formId}`
    const updateLowerAndUpperLimit = await sequelizeConfig.query(
      updateLowerAndUpperLimitQuery,
      {
        type: QueryTypes.UPDATE,
        model: this.trayItemModel
      }
    )
    Logger.log(
      'End of TrayItemService : updateLowerAndUpperLimit :response',
      updateLowerAndUpperLimit
    )
    return updateLowerAndUpperLimit
  }

  public async fetchAllItemsFromTray (): Promise<TrayItem[]> {
    Logger.log('Start of TrayItemService : updateTrayItems')
    const findAllTrayItems = await this.trayItemModel.findAll({
      order: [['updatedAt', 'ASC']]
    })
    Logger.log(
      'End of TrayItemService : updateTrayItems :response',
      findAllTrayItems
    )
    return findAllTrayItems
  }

  public async fetchItemByFormId (id: number): Promise<TrayItem[]> {
    Logger.log('Start of TrayItemService : fetchItemByFormId : id', id)
    const formId = id
    const findAllByFormId = await this.trayItemModel.findAll({
      where: { formId }
    })
    Logger.log(
      'End of TrayItemService : fetchItemByFormId :response',
      findAllByFormId
    )
    return findAllByFormId
  }

  public async fetchTemplateAndTrayById (
    tempid: number,
    trayid: number
  ): Promise<TrayItem[]> {
    Logger.log('Start of TrayItemService : fetchTemplateAndTrayById : id')
    const tempId = tempid
    const trayId = trayid
    const fetchAllTrayById = await this.trayItemModel.findAll({
      where: { tempId, trayId },
      order: [['updatedAt', 'ASC']]
    })
    Logger.log(
      'End of TrayItemService : fetchTemplateAndTrayById :response',
      fetchAllTrayById
    )
    return fetchAllTrayById
  }

  public async fetchTrayTemplateAndFormById (
    trayid: number,
    tempid: number,
    formid: number
  ): Promise<TrayItem[]> {
    Logger.log(
      'Start of TrayItemService : fetchTrayTemplateAndFormById : id',
      trayid
    )
    const trayId = trayid
    const tempId = tempid
    const formId = formid
    const trayByTrayId = await this.trayItemModel.findAll({
      where: {
        trayId,
        tempId,
        formId
      },
      order: [['updatedAt', 'DESC']]
    })
    Logger.log(
      'End of TrayItemService : fetchTrayTemplateAndFormById :response',
      trayByTrayId
    )
    return trayByTrayId
  }

  public async createNotificationBasedOnTimeInterval (): Promise<any> {
    let content: any

    Logger.log(
      'Start of TrayItemService : createNotificationBasedOnTimeInterval'
    )
    let notificationdata: Array<{
      content: any
      updatedAt: Date
      noofreminders: number
      id: number
    }> = []
    let timeIntervalRecord: Array<{
      timeIntervalBetweenNotificationsInDays: number
    }> = []
    let trayItemRecord: Array<{
      quantity: number
      lowerLimit: number
      upperLimit: number
    }> = []
    const notificationQuery = `SELECT 
    * 
  FROM 
    public.notifications AS "time" 
  WHERE 
    "time"."createdAt" BETWEEN NOW() - INTERVAL '7 DAYS' 
    AND NOW() 
    AND "notificationType" = 'QUANTITY-ALERT' 
    AND status = 'SENT' 
    AND "noOfRemainder" > 0 
  ORDER BY 
    "time"."createdAt" DESC
  `
    notificationdata = await sequelizeConfig.query(notificationQuery, {
      type: QueryTypes.SELECT
    })

    for (let i = 0; i < notificationdata.length; i++) {
      content = notificationdata[i].content
      const trayItemQuery = `SELECT * FROM "trayItems" WHERE "trayId"='${content.trayId}'  AND "rackId"='${content.rackId}'  AND "tempId" = '${content.tempId}'`
      trayItemRecord = await sequelizeConfig.query(trayItemQuery, {
        type: QueryTypes.SELECT
      })
      const timeIntervalQuery = `SELECT "timeIntervalBetweenNotificationsInDays" FROM escalations 
      WHERE "notificationSettngFk"= '${notificationdata[i].content.notificationSettngFk}'`
      timeIntervalRecord = await sequelizeConfig.query(timeIntervalQuery, {
        type: QueryTypes.SELECT
      })
      const presentDate = new Date().getTime()
      const previousUpdatedDate = new Date(
        notificationdata[i].updatedAt
      ).getTime()
      const diffTime = Math.abs(presentDate - previousUpdatedDate)
      const noOfDaysSincePreviousNotifications = Math.ceil(
        diffTime / (1000 * 60 * 60 * 24)
      )
      const timeIntervalBetweenNotificationsInDays =
        timeIntervalRecord[0].timeIntervalBetweenNotificationsInDays

      if (
        (trayItemRecord[0].quantity <= trayItemRecord[0].lowerLimit ||
          trayItemRecord[0].quantity >= trayItemRecord[0].upperLimit) &&
        noOfDaysSincePreviousNotifications >=
          timeIntervalBetweenNotificationsInDays
      ) {
        const updateNotificationRecordQuery = `UPDATE notifications SET status='NEW'
        WHERE id = ${notificationdata[i].id}`
        return await sequelizeConfig.query(updateNotificationRecordQuery, {
          type: QueryTypes.UPDATE
        })
      } else {
        return notificationdata
      }
    }
    Logger.log(
      'End of TrayItemService : createNotificationBasedOnTimeInterval :response'
    )
  }
}
