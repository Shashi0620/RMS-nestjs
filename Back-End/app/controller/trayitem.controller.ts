import { TrayItemService } from '../service/trayItem.service'
import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  Req,
  UseGuards
} from '@nestjs/common'
import { Request } from 'express'
import { TrayItem } from '../models/trayItem.model'
import { JwtAuthGuard } from '../auth/gaurds/jwt-auth.gaurd'

@UseGuards(JwtAuthGuard)
@Controller('api/trayItem')
export default class TrayItemController {
  constructor (private readonly trayItemSevice: TrayItemService) {}
  @Post('/createTrayItem/:templateName/:schemaName')
  public async trayItemCreate (
    @Body() body: TrayItem,
      @Param('templateName') templateName: string,
      @Param('schemaName') schemaName: string
  ): Promise<TrayItem> {
    try {
      return await this.trayItemSevice.trayItemCreate(
        body,
        templateName,
        schemaName
      )
    } catch (e) {
      throw new HttpException(
        'Error in TrayItemController.trayItemCreate',
        HttpStatus.INTERNAL_SERVER_ERROR
      )
    }
  }

  @Get('/findAllItems')
  public async findAllItemsFromTray (): Promise<TrayItem[]> {
    try {
      return await this.trayItemSevice.fetchAllItemsFromTray()
    } catch (e) {
      throw new HttpException(
        'Error in TrayItemController.findAllItems',
        HttpStatus.INTERNAL_SERVER_ERROR
      )
    }
  }

  @Get('/fetchItem/:formId')
  public async fetchItemByFormId (
    @Param('formId') formId: string
  ): Promise<TrayItem[]> {
    try {
      return await this.trayItemSevice.fetchItemByFormId(+formId)
    } catch (e) {
      throw new HttpException(
        'Error in TrayItemController.fetchItemByFormId',
        HttpStatus.INTERNAL_SERVER_ERROR
      )
    }
  }

  @Get('/fetchTemplateAndTrayById/:tempId/:trayId')
  public async fetchTemplateAndTrayById (
    @Param('tempId') tempId: string,
      @Param('trayId') trayId: string
  ): Promise<TrayItem[]> {
    try {
      return await this.trayItemSevice.fetchTemplateAndTrayById(
        +tempId,
        +trayId
      )
    } catch (e) {
      throw new HttpException(
        'Error in TrayItemController.fetchTemplateAndTrayById',
        HttpStatus.INTERNAL_SERVER_ERROR
      )
    }
  }

  @Get('/fetchTrayTemplateAndFormById/:trayId/:tempId/:formId')
  public async fetchTrayTemplateAndFormById (
    @Param('trayId') trayid: string,
      @Param('tempId') tempid: string,
      @Param('formId') formid: string
  ): Promise<TrayItem[]> {
    try {
      return await this.trayItemSevice.fetchTrayTemplateAndFormById(
        +trayid,
        +tempid,
        +formid
      )
    } catch (e) {
      throw new HttpException(
        'Error in TrayItemController.fetchTrayTemplateAndFormById',
        HttpStatus.INTERNAL_SERVER_ERROR
      )
    }
  }

  @Put('/:id/:productQuantity')
  public async checkOutTrayQuantity (
    @Param('id') trayItemId: string,
      @Param('productQuantity') productQuantity: number,
      @Body() body: TrayItem,
      @Req() req: Request
  ): Promise<TrayItem[]> {
    try {
      return await this.trayItemSevice.checkOutTrayQuantity(
        +trayItemId,
        body,
        req,
        productQuantity
      )
    } catch (e) {
      throw new HttpException(
        'Error in TrayItemController.fetchTemplateAndTrayById',
        HttpStatus.INTERNAL_SERVER_ERROR
      )
    }
  }

  @Put('/:id')
  public async updateLowerAndUpperLimit (
    @Param('id') trayId: string,
      @Body() body: TrayItem
  ): Promise<TrayItem[]> {
    try {
      return await this.trayItemSevice.updateLowerAndUpperLimit(+trayId, body)
    } catch (e) {
      throw new HttpException(
        'Error in TrayItemController.fetchTemplateAndTrayById',
        HttpStatus.INTERNAL_SERVER_ERROR
      )
    }
  }

  @Get('/calculateEscalationBasedAlertConfiguration')
  public async createNotificationBasedOnTimeInterval (): Promise<any> {
    try {
      return await this.trayItemSevice.createNotificationBasedOnTimeInterval()
    } catch (e) {
      throw new HttpException(
        'Error in TrayItemController.createNotificationBasedOnTimeInterval',
        HttpStatus.INTERNAL_SERVER_ERROR
      )
    }
  }
}
