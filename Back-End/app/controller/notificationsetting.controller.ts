/* eslint-disable @typescript-eslint/consistent-type-assertions */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { NotificationSettingService } from '../service/notificationsetting.service'
import {
  Body,
  Controller,
  Delete,
  forwardRef,
  Get,
  HttpException,
  HttpStatus,
  Inject,
  Param,
  Post,
  Put,
  Res,
  UseGuards
} from '@nestjs/common'
import { Response } from 'express'
import { NotificationSettings } from '../models/notificationSettings.model'
import { InjectModel } from '@nestjs/sequelize'
import { EscalationController } from './escalation.controller'
import { type Escalation } from '../models/esculation.model'
import { JwtAuthGuard } from '../auth/gaurds/jwt-auth.gaurd'

interface escalationType extends Escalation {
  escalationType: string
  noOfRemainder: number
  timeIntervalBetweenNotificationsInDays: number
  to: string
  notificationSettngFk: number
}

@UseGuards(JwtAuthGuard)
@Controller('api/notificationSetting')
export default class NotificationSettingController {
  constructor (
    private readonly notififcationService: NotificationSettingService,
    @InjectModel(NotificationSettings)
    private readonly notificationSettingsModel: typeof NotificationSettings,
    @Inject(forwardRef(() => EscalationController))
    private readonly escalationController: EscalationController
  ) {}

  @Get('/fetchNotificationSettingById/:id')
  public async fetchNotificationSettingById (
    @Param('id') id: string
  ): Promise<NotificationSettings | null> {
    try {
      return await this.notififcationService.fetchNotificationSettingById(+id)
    } catch (e) {
      throw new HttpException(
        'Error in NotificationController.fetchNotificationSettingById',
        HttpStatus.INTERNAL_SERVER_ERROR
      )
    }
  }

  @Delete('/deleteNotificationSetting/:id')
  public async deleteNotificationSetting (@Param('id') id: string): Promise<void> {
    try {
      await this.notififcationService.deleteNotificationSetting(+id)
    } catch (e) {
      throw new HttpException(
        'Error in NotificationController.deleteNotificationSetting',
        HttpStatus.INTERNAL_SERVER_ERROR
      )
    }
  }

  @Get('/fetchNotificationByStoreFk/:storeFk')
  public async fetchNotificationSettingByStoreFk (
    @Param('storeFk') storeFk: string
  ): Promise<NotificationSettings[]> {
    try {
      return await this.notififcationService.fetchNotificationSettingByStoreFk(
        +storeFk
      )
    } catch (e) {
      throw new HttpException(
        'Error in NotificationController.fetchNotificationSettingByStoreFk',
        HttpStatus.INTERNAL_SERVER_ERROR
      )
    }
  }

  @Post('/createNotificationSetting')
  public async createNotificationSetting (
    @Res() res: Response,
      @Body() body
  ): Promise<void> {
    // Save Notification in the database
    const data = await this.notificationSettingsModel.create(body)
    const escalation = {} as Escalation
    try {
      escalation.escalationType = body.escalationType
      escalation.noOfRemainder = body.noOfRemainder
      escalation.timeIntervalBetweenNotificationsInDays =
        body.timeIntervalBetweenNotificationsInDays
      escalation.to = body.to
      escalation.notificationSettngFk = data.id
      await this.escalationController.createEscalation(escalation)
      res.send(data)
    } catch (err) {
      res.status(500).send({
        message: 'Some error occurred while creating the Notification.', err
      })
    }
  }

  @Get('/fetchNotificationSettingAndEscalation/:id')
  public async fetchNotificationSettingAndEscakation (
    @Param('id') id: string
  ): Promise<NotificationSettings[]> {
    try {
      return await this.notififcationService.fetchNotificationSettingsAndEscalation(
        +id
      )
    } catch (e) {
      throw new HttpException(
        'Error in NotificationController.fetchNotificationSettingByStoreFkNotNull',
        HttpStatus.INTERNAL_SERVER_ERROR
      )
    }
  }

  @Put('/updateNotificationSetting/:id')
  public async updateNotificationSetting (
    @Res() res: Response,
      @Body() body,
      @Param('id') id: string
  ): Promise< any> {
    try {
      return await this.notififcationService.updateNotificationSetting(
        body,
        +id
      )
    } catch (err) {
      res.status(500).send({
        message: 'Some error occurred while creating the Notification.', err
      })
    }
  }

  @Get('notificationSetting/byRackId/:rackId')
  public async fetchAllNotificationSettingsOnRackId (
    @Param('rackId') rackId: number
  ): Promise<NotificationSettings[]> {
    try {
      return await this.notififcationService.fetchAllNotificationSettingsOnRackId(
        rackId
      )
    } catch (e) {
      throw new HttpException(
        'Error in NotificationController.fetchAllNotificationSettingsOnRackId',
        HttpStatus.INTERNAL_SERVER_ERROR
      )
    }
  }
}
