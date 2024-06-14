import { RackService } from '../service/rack.service'
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
  UseGuards
} from '@nestjs/common'
import { type UpdateTrayLayout } from '../service/rack.service'
import { Rack } from '../models/rack.model'
import { Tray } from '../models/tray.model'
import { JwtAuthGuard } from '../auth/gaurds/jwt-auth.gaurd'

@UseGuards(JwtAuthGuard)
@Controller('api/rack')
export default class RackController {
  constructor (
    @Inject(forwardRef(() => RackService))
    private readonly rackSevice: RackService
  ) {}

  @Post('/createRack')
  public async rackCreate (@Body() body: Rack): Promise<Rack> {
    try {
      return await this.rackSevice.rackCreate(body)
    } catch (e) {
      throw new HttpException(
        'Error in RackController.rackCreate',
        HttpStatus.INTERNAL_SERVER_ERROR
      )
    }
  }

  @Get('/fetchRackById/:id')
  public async fetchRackById (@Param('id') id: string): Promise<Rack | null> {
    try {
      return await this.rackSevice.fetchRackById(+id)
    } catch (e) {
      throw new HttpException(
        'Error in RackController.rackCreate',
        HttpStatus.INTERNAL_SERVER_ERROR
      )
    }
  }

  @Get('/:client_fk')
  public async findAllRackOnClientFk (
    @Param('client_fk') clientFk: string
  ): Promise<Rack[]> {
    try {
      return await this.rackSevice.findAllRackOnClientFk(+clientFk)
    } catch (e) {
      throw new HttpException(
        'Error in RackController.findAllRackOnClientFk',
        HttpStatus.INTERNAL_SERVER_ERROR
      )
    }
  }

  @Delete('/:id')
  public async deleteRackById (@Param('id') id: string): Promise<void> {
    try {
      await this.rackSevice.deleteRackById(+id)
    } catch (e) {
      throw new HttpException(
        'Error in RackController.deleteRackById',
        HttpStatus.INTERNAL_SERVER_ERROR
      )
    }
  }

  @Get('/fetchRackByClientId/:name/:client_fk')
  public async fetchRackByClientId (
    @Param('name') name: string,
      @Param('client_fk') clientFk: string
  ): Promise<Rack[]> {
    try {
      return await this.rackSevice.fetchRackByClientId(name, +clientFk)
    } catch (e) {
      throw new HttpException(
        'Error in RackController.fetchRackByClientId',
        HttpStatus.INTERNAL_SERVER_ERROR
      )
    }
  }

  /**
   * this method not used in frontend so removed
   */

  @Post('/tray')
  public async trayCreate (@Body() body: Tray): Promise<Tray> {
    try {
      return await this.rackSevice.trayCreate(body)
    } catch (e) {
      throw new HttpException(
        'Error in RackController.trayCreate',
        HttpStatus.INTERNAL_SERVER_ERROR
      )
    }
  }

  @Get('/tray/:id')
  public async fetchTrayById (@Param('id') id: string): Promise<Tray | null> {
    try {
      return await this.rackSevice.fetchTrayById(+id)
    } catch (e) {
      throw new HttpException(
        'Error in RackController.fetchTrayById',
        HttpStatus.INTERNAL_SERVER_ERROR
      )
    }
  }

  @Delete('/tray/:trayId/:rackId')
  public async deleteTrayById (
    @Param('trayId') trayId: number,
      @Param('rackId') rackId: number
  ): Promise<void> {
    try {
      await this.rackSevice.deleteTrayById(trayId, rackId)
    } catch (e) {
      throw new HttpException(
        'Error in RackController.deleteTrayById',
        HttpStatus.INTERNAL_SERVER_ERROR
      )
    }
  }

  @Delete('/DeleteItemFromTray/:formId')
  public async deleteTrayItem (@Param('formId') formId: string): Promise<void> {
    try {
      await this.rackSevice.deleteTrayItem(+formId)
    } catch (e) {
      throw new HttpException(
        'Error in RackController.deleteTrayItem',
        HttpStatus.INTERNAL_SERVER_ERROR
      )
    }
  }

  @Delete('/DeleteTrayItem/:trayid/:formid')
  public async deleteTrayItemByFormAndTrayId (
    @Param('trayid') trayid: string,
      @Param('formid') formid: string
  ): Promise<void> {
    try {
      await this.rackSevice.deleteTrayItemByFormAndTrayId(+trayid, +formid)
    } catch (e) {
      throw new HttpException(
        'Error in RackController.deleteTrayItem',
        HttpStatus.INTERNAL_SERVER_ERROR
      )
    }
  }

  @Get('/traylisting/data/:rack_fk')
  public async fetchTrayDataByRackId (
    @Param('rack_fk') rackFk: string
  ): Promise<object[]> {
    try {
      return await this.rackSevice.fetchTrayDataByRackId(+rackFk)
    } catch (e) {
      throw new HttpException(
        'Error in RackController.fetchTrayDataByRackId',
        HttpStatus.INTERNAL_SERVER_ERROR
      )
    }
  }

  @Get('/traylisting/props/:rack_fk')
  public async fetchTrayPropByRackId (
    @Param('rack_fk') rackFk: string
  ): Promise<Tray[]> {
    try {
      return await this.rackSevice.fetchTrayPropByRackId(+rackFk)
    } catch (e) {
      throw new HttpException(
        'Error in RackController.fetchTrayPropByRackId',
        HttpStatus.INTERNAL_SERVER_ERROR
      )
    }
  }

  @Get('/fetchRackByStoreFk/:storeFk')
  public async fetchRackByStoreFk (
    @Param('storeFk') storeFk: string
  ): Promise<Rack[]> {
    try {
      return await this.rackSevice.fetchRackByStoreFk(+storeFk)
    } catch (e) {
      throw new HttpException(
        'Error in RackController.fetchRackByStoreFk',
        HttpStatus.INTERNAL_SERVER_ERROR
      )
    }
  }

  @Get('/tray/items')
  public async fetchTrays (): Promise<Tray[]> {
    try {
      return await this.rackSevice.fetchTrays()
    } catch (e) {
      throw new HttpException(
        'Error in RackController.fetchTrays',
        HttpStatus.INTERNAL_SERVER_ERROR
      )
    }
  }

  @Put('/tray/:id')
  public async updateTray (
    @Body() body: Tray,
      @Param('id') id: string
  ): Promise<[number | Tray]> {
    try {
      return await this.rackSevice.updateTray(body, +id)
    } catch (e) {
      throw new HttpException(
        'Error in RackController.updateTray',
        HttpStatus.INTERNAL_SERVER_ERROR
      )
    }
  }

  @Put('/:id')
  public async updateRackById (
    @Body() body: Rack,
      @Param('id') id: string
  ): Promise<[number | Rack]> {
    try {
      return await this.rackSevice.updateRackById(body, +id)
    } catch (e) {
      throw new HttpException(
        'Error in RackController.updateRackById',
        HttpStatus.INTERNAL_SERVER_ERROR
      )
    }
  }

  @Put('/tray/props/:trayId')
  public async updateTrayLayout (
    @Body() body: UpdateTrayLayout[],
      @Param('trayId') id: string
  ): Promise<UpdateTrayLayout[]> {
    try {
      return await this.rackSevice.updateTrayLayout(body, +id)
    } catch (e) {
      throw new HttpException(
        'Error in RackController.saveTrayLayout',
        HttpStatus.INTERNAL_SERVER_ERROR
      )
    }
  }

  @Get('/:searchstring/:userID/:clientFk/:schemaName')
  public async searchItemsByRack (
    @Param('searchstring') searchString: string,
      @Param('userID') userID: string,
      @Param('clientFk') clientFk: string,
      @Param('schemaName') schemaName: string
  ): Promise<object[]> {
    try {
      return await this.rackSevice.searchItemsByRack(
        searchString,
        +userID,
        +clientFk,
        schemaName
      )
    } catch (e) {
      throw new HttpException(
        'Error in RackController.searchname',
        HttpStatus.INTERNAL_SERVER_ERROR
      )
    }
  }
}
