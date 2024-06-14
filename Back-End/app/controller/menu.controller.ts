import { MenuService } from '../service/menu.service'
import {
  Body,
  Controller,
  forwardRef,
  Get,
  HttpException,
  HttpStatus,
  Inject,
  Param,
  Post,
  Query,
  UseGuards
} from '@nestjs/common'

import { Menu } from '../models/menu.model'
import { JwtAuthGuard } from '../auth/gaurds/jwt-auth.gaurd'

@UseGuards(JwtAuthGuard)
@Controller('api/menu')
export default class MenuController {
  constructor (
    @Inject(forwardRef(() => MenuService))
    private readonly menuService: MenuService
  ) {}

  @Post('/createMenu')
  public async menuCreate (@Body() body: Menu): Promise<Menu> {
    try {
      return await this.menuService.menuCreate(body)
    } catch (e) {
      throw new HttpException(
        'Error in MenuController.menuCreate',
        HttpStatus.INTERNAL_SERVER_ERROR
      )
    }
  }

  @Get('/item/:itemId')
  public async findMenuById (
    @Param('itemId') itemId: string
  ): Promise<Menu | null> {
    try {
      return await this.menuService.findMenuById(+itemId)
    } catch (e) {
      throw new HttpException(
        'Error in MenuController.findMenuById',
        HttpStatus.INTERNAL_SERVER_ERROR
      )
    }
  }

  @Get('/')
  public async findAll (
    @Query('clientFk') clientFk: string,
      @Query('roleId') roleId: string
  ): Promise<Menu[]> {
    try {
      return await this.menuService.findAll(clientFk, roleId)
    } catch (e) {
      throw new HttpException(
        'Error in MenuController.findAll',
        HttpStatus.INTERNAL_SERVER_ERROR
      )
    }
  }

  @Get('/fetchMenu/')
  public async findById (
    @Query('templateID') templateID: string
  ): Promise<Menu[]> {
    try {
      return await this.menuService.findById(templateID)
    } catch (e) {
      throw new HttpException(
        'Error in MenuController.findById',
        HttpStatus.INTERNAL_SERVER_ERROR
      )
    }
  }
}
