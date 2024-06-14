import { NotificationService } from '../service/notification.service'
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  UseGuards
} from '@nestjs/common'
import { Notification } from '../models/notification.model'
import { JwtAuthGuard } from '../auth/gaurds/jwt-auth.gaurd'

@UseGuards(JwtAuthGuard)
@Controller('api/notification')
export default class NotificationController {
  constructor (private readonly notififcationService: NotificationService) {}
  @Post('/createNotification')
  public async createNotification (
    @Body() body: Notification
  ): Promise<Notification> {
    try {
      const notificationRes =
        await this.notififcationService.createNotification(body)
      return notificationRes
    } catch (e) {
      throw new HttpException(
        'Error in NotificationController.createNotification',
        HttpStatus.INTERNAL_SERVER_ERROR
      )
    }
  }

  @Get('/fetchNotificationById/:id')
  public async fetchNotificationById (
    @Param('id') id: string
  ): Promise<Notification | null> {
    try {
      return await this.notififcationService.fetchNotificationById(+id)
    } catch (e) {
      throw new HttpException(
        'Error in NotificationController.fetchNotificationById',
        HttpStatus.INTERNAL_SERVER_ERROR
      )
    }
  }

  @Delete('/deleteNotification/:id')
  public async deleteNotification (@Param('id') id: string): Promise<string> {
    try {
      return await this.notififcationService.deleteNotification(+id)
    } catch (e) {
      throw new HttpException(
        'Error in NotificationController.deleteNotification',
        HttpStatus.INTERNAL_SERVER_ERROR
      )
    }
  }

  @Get('/sendEmailNotification')
  public async fetchAllNotification (): Promise<Notification[]> {
    try {
      return await this.notififcationService.fetchAllNotification()
    } catch (e) {
      throw new HttpException(
        'Error in NotificationController.fetchAllNotification',
        HttpStatus.INTERNAL_SERVER_ERROR
      )
    }
  }

  @Get('/fetchNotificationByEmail/:email')
  public async fetchNotificationByUserFk (
    @Param('email') email: string
  ): Promise<Notification[]> {
    try {
      return await this.notififcationService.fetchNotificationByUserFk(email)
    } catch (e) {
      throw new HttpException(
        'Error in NotificationController.fetchNotificationByUserFk',
        HttpStatus.INTERNAL_SERVER_ERROR
      )
    }
  }

  @Put('/updateNewNotificationToOld/:ids')
  public async updateNewNotificationToOld (
    @Param('ids') notificationIDs: number[]
  ): Promise<number[]> {
    try {
      const idsArray = JSON.parse('[' + notificationIDs + ']')
      return await this.notififcationService.updateNewNotificationToOld(
        idsArray as number[]
      )
    } catch (e) {
      throw new HttpException(
        'Error in NotificationController.updateNotification',
        HttpStatus.INTERNAL_SERVER_ERROR
      )
    }
  }

  @Put('/updateNotification/:id')
  public async updateNotification (
    @Body() body: Notification,
      @Param('id') storeId: string
  ): Promise<[number | Notification]> {
    try {
      return await this.notififcationService.updateNotification(body, +storeId)
    } catch (e) {
      throw new HttpException(
        'Error in NotificationController.updateNotification',
        HttpStatus.INTERNAL_SERVER_ERROR
      )
    }
  }

  @Get('/fetchNotificationByuserFk/:userFk')
  public async fetchNotificationByuserFk (
    @Param('userFk') userFk: number
  ): Promise<Notification[]> {
    try {
      return await this.notififcationService.fetchNotificationByuserFk(userFk)
    } catch (e) {
      throw new HttpException(
        'Error in NotificationController.fetchNotificationByUserFk',
        HttpStatus.INTERNAL_SERVER_ERROR
      )
    }
  }
}
