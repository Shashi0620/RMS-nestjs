/* eslint-disable @typescript-eslint/consistent-type-assertions */
/* eslint-disable @typescript-eslint/no-misused-promises */
import { NotificationService } from '../service/notification.service'
import { Request } from 'express'
import { UserService } from '../service/user.service'
import {
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Req,
  UseGuards
} from '@nestjs/common'
import { Controller } from '@nestjs/common/decorators/core/controller.decorator'
import { InjectModel } from '@nestjs/sequelize'
import { Escalation } from '../models/esculation.model'
import { JwtAuthGuard } from '../auth/gaurds/jwt-auth.gaurd'

@UseGuards(JwtAuthGuard)
@Controller()
export class EscalationController {
  constructor (
    @InjectModel(Escalation)
    private readonly escalationModel: typeof Escalation,
    @Inject(forwardRef(() => NotificationService))
    private readonly notificationController: NotificationService,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService
  ) {}

  public async createEscalation (payload: Escalation): Promise<Escalation> {
    try {
      const escalation = {} as Escalation
      escalation.escalationType = payload.escalationType
      escalation.noOfRemainder = payload.noOfRemainder
      escalation.timeIntervalBetweenNotificationsInDays =
        payload.timeIntervalBetweenNotificationsInDays
      escalation.to = payload.to
      escalation.notificationSettngFk = payload.notificationSettngFk
      const data = await this.escalationModel.create(escalation)
      return data
    } catch (e) {
      throw new HttpException(
        'Error in MenuController.findMenuById',
        HttpStatus.INTERNAL_SERVER_ERROR
      )
    }
  }

  public async fetchEscalationByNotificationId (
    @Req() req: Request
  ): Promise<void> {
    try {
      const notificationSettngFk = req.params.notificationSettngFk
      const notification = req.body.notification
      const notificationToEscalation = {
        notification: { escalation: {} }
      }
      notificationToEscalation.notification = notification.dataValues
      const data = await this.escalationModel.findAll({
        where: {
          notificationSettngFk
        }
      })

      notificationToEscalation.notification.escalation = data
    } catch (e) {
      throw new HttpException(
        'Error in MenuController.findMenuById',
        HttpStatus.INTERNAL_SERVER_ERROR
      )
    }
  }

  public async fetchByNotificationId (
    id: number,
    @Req() req: Request,
    userFk: number
  ): Promise<void> {
    try {
      const notificationSettngFk = id

      const data = await this.escalationModel.findAll({
        where: {
          notificationSettngFk
        }
      })
      data.forEach(async escalation => {
        req.body.email = escalation.to
        req.body.status = 'NEW'
        req.body.noOfRetry = 3
        req.body.userFk = userFk
        req.body.noOfRemainder = escalation.noOfRemainder
        await this.userService.createNotificationQuantityAlert(req.body)
      })
    } catch (e) {
      throw new HttpException(
        'Error in MenuController.findMenuById',
        HttpStatus.INTERNAL_SERVER_ERROR
      )
    }
  }

  public async deleteEscalationByNotificationId (
    @Req() req: Request
  ): Promise<void> {
    try {
      const notificationSettngFk = req.params.notificationSettngFk

      await this.escalationModel.destroy({
        where: {
          notificationSettngFk
        }
      })
    } catch (e) {
      throw new HttpException(
        'Error in MenuController.findMenuById',
        HttpStatus.INTERNAL_SERVER_ERROR
      )
    }
  }

  public async updateEsculationData (payload: Escalation, id: number): Promise<void> {
    try {
      await this.escalationModel.update(payload, {
        where: {
          notificationSettngFk: id
        }
      })
    } catch (e) {
      throw new HttpException(
        'Error in EscalationController.updateEsculationData',
        HttpStatus.INTERNAL_SERVER_ERROR
      )
    }
  }
}
