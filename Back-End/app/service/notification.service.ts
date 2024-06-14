import { Op, QueryTypes } from 'sequelize'
import { sequelizeConfig } from '../config/seq.config'
import config from '../configemail.json'
import emailConfig from '../config/email.config'
import { Injectable, Logger } from '@nestjs/common'
import { Notification } from '../models/notification.model'
import { InjectModel } from '@nestjs/sequelize'
import { environment } from '../environment'
import fileOp, { existsSync } from 'fs'

@Injectable()
export class NotificationService {
  constructor (
    @InjectModel(Notification)
    private readonly notificationModel: typeof Notification
  ) {}

  public async createNotification (
    payload: Notification
  ): Promise<Notification> {
    Logger.log('Start of NotificationService : createNotification')
    const data = await this.notificationModel.create(payload)
    Logger.log('End of NotificationService : createNotification')
    return data
  }

  public async fetchNotificationById (id: number): Promise<Notification | null> {
    Logger.log('Start of NotificationService : fetchNotificationById :id', id)
    const notificationId = id
    const data = await this.notificationModel.findOne({
      where: { id: notificationId }
    })
    Logger.log(
      'End of NotificationService : fetchNotificationById :response',
      data
    )
    return data
  }

  public async updateNotification (
    paylod: Notification,
    notificationId: number
  ): Promise<[number | Notification]> {
    Logger.log(
      'Start of NotificationService : updateNotification :id',
      notificationId
    )
    const id = notificationId
    const updateNotification = await this.notificationModel.update(paylod, {
      where: { id }
    })
    Logger.log(
      'End of NotificationService : updateNotification :response',
      updateNotification
    )
    return updateNotification
  }

  public async deleteNotification (id: number): Promise<string> {
    Logger.log('Start of NotificationService : deleteNotification :id', id)
    const notificationId = id
    await this.notificationModel.destroy({
      where: { id: notificationId }
    })
    Logger.log('End of NotificationService : deleteNotification')
    return 'deleted'
  }

  public async fetchAllNotification (): Promise<Notification[]> {
    Logger.log('Start of NotificationService : fetchAllNotification ')
    const data = await this.notificationModel.findAll({
      where: {
        status: {
          [Op.notLike]: '%SENT%'
        }
      }
    })
    const emailData = data[0].content
    await this.sendNotificationBasedOnStatus(data, emailData)
    Logger.log(
      'End of NotificationService : fetchAllNotification :response',
      data
    )
    return data
  }

  public async fetchNotificationByUserFk (
    email: string
  ): Promise<Notification[]> {
    Logger.log(
      'Start of NotificationService : fetchNotificationByUserFk  :email',
      email
    )

    const data = await this.notificationModel.findAll({
      where: {
        [Op.and]: [
          { email: { [Op.like]: '%' + email + '%' } },
          {
            notificationType: {
              [Op.notLike]: '%REGISTERED%'
            }
          }
        ]
      }
    })
    Logger.log(
      'End of NotificationService : fetchNotificationByUserFk :response',
      data
    )
    return data
  }

  public async updateNewNotificationToOld (
    notificatioIDs: number[]
  ): Promise<number[]> {
    return await this.notificationModel.update(
      {
        newNotification: 0
      },
      {
        where: {
          id: notificatioIDs
        }
      }
    )
  }

  public async sendNotificationBasedOnStatus (data, emailData): Promise<void> {
    Logger.log('Start of NotificationService : sendNotificationBasedOnStatus')
    for (let i = 0; i < data.length; i++) {
      const email = data[i].email
      emailData = data[i].content
      const message = {
        from: `${config.fromEmailAddressName} ${config.fromEmailAddress}`,
        to: email,
        subject: '',
        template: ' ',
        context: {}
      }
      if (data[i].notificationType === 'QUANTITY-ALERT') {
        message.subject = config.quantityAlert
        message.template = 'quantityAlert'
        const link = environment.frontEndUrl
        message.context = {
          emailData,
          link
        }
        await this.sendMail(message, data[i])
      } else if (data[i].notificationType === 'TRAIL-END') {
        message.subject = config.trailend
        message.template = 'trailenddate'
        message.context = {
          emailData
        }
        await this.sendMail(message, data[i])

        // Update user status="TRAIL-ENDED"
      }
    }
    Logger.log('End of NotificationService : sendNotificationBasedOnStatus ')
  }

  public async sendNewUserRegsitrationMail (data, emailData): Promise<void> {
    const message = {
      from: `${config.fromEmailAddressName} ${config.fromEmailAddress}`,
      to: data.email,
      subject: '',
      template: ' ',
      context: {}
    }
    const link = environment.baseUrl
    message.subject = config.registrationEmailSubject
    message.template = 'registration'
    message.context = {
      emailData,
      link
    }
    await this.sendMail(message, data)
  }

  public async forgotPasswordMail (data, emailData): Promise<void> {
    const message = {
      from: `${config.fromEmailAddressName} ${config.fromEmailAddress}`,
      to: data.email,
      subject: '',
      template: ' ',
      context: {}
    }
    const link = environment.baseUrl
    message.subject = config.subjectofPasswordEmail
    message.template = 'forgotpassword'
    message.context = {
      emailData,
      link
    }
    await this.sendMail(message, data)
  }

  public async sendStaffRegistrationMail (data, emailData): Promise<void> {
    const email = data.email
    emailData = data.content
    const message = {
      from: `${config.fromEmailAddressName} ${config.fromEmailAddress}`,
      to: email,
      subject: '',
      template: ' ',
      context: {}
    }
    const link = environment.frontEndUrl
    message.subject = config.staffregistrationEmailSubject
    message.template = 'staffRegistration'
    message.context = {
      emailData,
      link
    }
    await this.sendMail(message, data)
  }

  public async changePasswordMail (data, emailData): Promise<void> {
    const email = data.email
    emailData = data.content
    const message = {
      from: `${config.fromEmailAddressName} ${config.fromEmailAddress}`,
      to: email,
      subject: '',
      template: ' ',
      context: {}
    }
    const link = environment.baseUrl
    message.subject = config.changePassword
    message.template = 'changePassword'
    message.context = {
      emailData,
      link
    }
    await this.sendMail(message, data)
  }

  public async sendMail (message, data): Promise<void> {
    Logger.log('Start of NotificationService : sendMail :data', data)
    await emailConfig.sendMail(message, async (error): Promise<void> => {
      await this.updateNotificationStatus(error, data, message)
      if (
        data.notificationType === 'CONTACT-US' &&
        message.attachments.length !== 0
      ) {
        await this.deleteContactUsFileAfterSent(message.attachments[0].path as string)
      }
    })

    Logger.log('End of NotificationService : sendMail :data', data)
  }

  public async updateNotificationStatus (error, data, message): Promise<void> {
    Logger.log(
      'Start of NotificationService : updateNotificationStatus :data',
      data
    )
    let query: string
    if (error !== null || error !== undefined) {
      query = `UPDATE  notifications  SET "status"='RETRY', "noOfRetry" = "noOfRetry"-1 WHERE "id"=${data.id}`
      Logger.error('mail has not sent.')
    } else {
      if (data.notificationType === 'QUANTITY-ALERT') {
        query = `UPDATE notifications SET "noOfRemainder" = "noOfRemainder"-1 , "updatedAt" = NOW(), "status" = 'SENT' WHERE "id" = ${data.id}`
      } else {
        query = `UPDATE notifications SET "status" = 'SENT',"updatedAt" = NOW() WHERE "id" = ${data.id}`
        Logger.log('mail has sent.')
      }
    }
    await sequelizeConfig.query(query, {
      type: QueryTypes.UPDATE
    })
    Logger.log('End of NotificationService : updateNotificationStatus ')
  }

  public async fetchNotificationByuserFk (
    userFk: number
  ): Promise<Notification[]> {
    Logger.log(
      'Start of NotificationService : fetchNotificationByuserFk  :userFk',
      userFk
    )
    const joinQuery = ` SELECT n.*, u."roleId",us2."storeId" 
    FROM "userStores" us1, "userStores" us2,
    notifications n , users u
    WHERE us1."userFk"= ${userFk} and us1."storeId"= us2."storeId" and
     n."userFk"=us2."userFk" and us2."userFk" =u.id and 
      n."notificationType"  NOT Like 'REGISTERED%' order by "createdAt";`

    const joins = await sequelizeConfig.query(joinQuery, {
      type: QueryTypes.SELECT,
      model: this.notificationModel
    })

    Logger.log('End of fetchNotificationByuserFk :', joins)
    return joins
  }

  private async deleteContactUsFileAfterSent (filePath: string): Promise<void> {
    Logger.log(
      'Start of NotificationService : deleteContactUsFileAfterSent :response'
    )
    if (existsSync(filePath)) {
      fileOp.unlink(filePath, err => {
        if (err !== null) {
          Logger.error(
            'Error in NotificationService : deleteContactUsFileAfterSent : file not deleted',
            filePath
          )
          throw err
        }
      })
    }
    Logger.log(
      'End of NotificationService : deleteContactUsFileAfterSent :response'
    )
  }
}
