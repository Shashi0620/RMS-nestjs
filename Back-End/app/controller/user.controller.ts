import {
  ILoginPaylod,
  type IRole,
  type IStaff,
  type IclientName,
  ISaveData,
  UserService
} from '../service/user.service'
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
  Query,
  UseGuards
} from '@nestjs/common'
import { type User } from '../models/user.model'
import { type Client } from '../models/client.model'
import { type Role } from '../models/role.model'
import { type Plan } from '../models/plan.model'
import { Menu } from '../models/menu.model'
import { JwtAuthGuard } from '../auth/gaurds/jwt-auth.gaurd'

@UseGuards(JwtAuthGuard)
@Controller('api/user')
export default class userControllers {
  constructor (private readonly userService: UserService) {}

  @Post('/login')
  public async loginUser (@Body() body: ILoginPaylod): Promise<User | null> {
    try {
      return await this.userService.login(body)
    } catch (e) {
      throw new HttpException(
        'Error in userControllers.loginUser',
        HttpStatus.INTERNAL_SERVER_ERROR
      )
    }
  }

  @Get('/client/staff/role')
  public async getRole (): Promise<IRole[]> {
    try {
      return await this.userService.getRole()
    } catch (e) {
      throw new HttpException(
        'Error in userControllers.getRole',
        HttpStatus.INTERNAL_SERVER_ERROR
      )
    }
  }

  @Get('/client/staff')
  public async getClientStaffList (
    @Query('clientFk') clientFk: string,
      @Query('roleId') roleId: string
  ): Promise<Client[]> {
    try {
      return await this.userService.getClientStaffList(clientFk, roleId)
    } catch (e) {
      throw new HttpException(
        'Error in userControllers.getClientStaffList',
        HttpStatus.INTERNAL_SERVER_ERROR
      )
    }
  }

  @Get('/client/name')
  public async getClientNameByID (
    @Query('clientFk') clientFk: string
  ): Promise<IclientName[]> {
    try {
      return await this.userService.getClientNameByID(clientFk)
    } catch (e) {
      throw new HttpException(
        'Error in userControllers.getClientNameByID',
        HttpStatus.INTERNAL_SERVER_ERROR
      )
    }
  }

  @Delete('client/staff/delete/:user_fk')
  public async deleteStaff (@Param('user_fk') userFk: string): Promise<string> {
    try {
      return await this.userService.deleteStaff(+userFk)
    } catch (e) {
      throw new HttpException(
        'Error in userControllers.deleteStaff',
        HttpStatus.INTERNAL_SERVER_ERROR
      )
    }
  }

  @Get('/role')
  public async getRoleNameByID (
    @Query('roleId') roleId: string
  ): Promise<Role[]> {
    try {
      return await this.userService.getRoleNameByID(roleId)
    } catch (e) {
      throw new HttpException(
        'Error in userControllers.getRoleNameByID',
        HttpStatus.INTERNAL_SERVER_ERROR
      )
    }
  }

  @Get('/getData/:username')
  public async readUserFile (
    @Param('username') username: string
  ): Promise<User> {
    try {
      return await this.userService.readUserFile(username)
    } catch (e) {
      throw new HttpException(
        'Error in userControllers.readUserFile',
        HttpStatus.INTERNAL_SERVER_ERROR
      )
    }
  }

  @Get('/client/fetchdata/:clientId')
  public async getClient (
    @Param('clientId') clientId: string
  ): Promise<Client[]> {
    try {
      return await this.userService.getClient(+clientId)
    } catch (e) {
      throw new HttpException(
        'Error in userControllers.getClient',
        HttpStatus.INTERNAL_SERVER_ERROR
      )
    }
  }

  @Post('/translateData/:username')
  public async saveData (
    @Param('username') username: string,
      @Body() body: ISaveData
  ): Promise<string> {
    try {
      return await this.userService.saveData(body, username)
    } catch (e) {
      throw new HttpException(
        'Error in userControllers.saveData',
        HttpStatus.INTERNAL_SERVER_ERROR
      )
    }
  }

  @Post('/addingUserMenuNewData/:userPk')
  public async addingUserMenuNewData (
    @Param('userPk') userPk: string,
      @Body() body: Menu
  ): Promise<string> {
    try {
      return await this.userService.addingUserMenuNewData(body, userPk)
    } catch (e) {
      throw new HttpException(
        'Error in userControllers.addingUserMenuNewData',
        HttpStatus.INTERNAL_SERVER_ERROR
      )
    }
  }

  @Get('/client/staff/:id')
  public async findOneByStaffId (@Param('id') id: string): Promise<IStaff> {
    try {
      return await this.userService.findOneByStaffId(+id)
    } catch (e) {
      throw new HttpException(
        'Error in userControllers.findOneByStaffId',
        HttpStatus.INTERNAL_SERVER_ERROR
      )
    }
  }

  @Put('/client/staff/update/:id')
  public async updateStaffByID (
    @Param('id') id: string,
      @Body() body: ISaveData
  ): Promise<[number | ISaveData]> {
    try {
      return await this.userService.updateStaffByID(body, +id)
    } catch (e) {
      throw new HttpException(
        'Error in userControllers.updateStaffByID',
        HttpStatus.INTERNAL_SERVER_ERROR
      )
    }
  }

  @Get('/plan/getPlan')
  public async getPlan (@Query('planId') planId: number): Promise<Plan[]> {
    try {
      planId = +planId
      return await this.userService.getPlan(planId)
    } catch (e) {
      throw new HttpException(
        'Error in userControllers.getPlan',
        HttpStatus.INTERNAL_SERVER_ERROR
      )
    }
  }

  @Post('/client/staff/save/:clientName')
  public async saveClientStaff (
    @Param('clientName') clientName: string,
      @Body() body: ISaveData
  ): Promise<ISaveData> {
    try {
      return await this.userService.saveClientStaff(clientName, body)
    } catch (e) {
      throw new HttpException(
        'Error in userControllers.saveClientStaff',
        HttpStatus.INTERNAL_SERVER_ERROR
      )
    }
  }

  @Get('/getusername/:roleId')
  public async getUserName (@Param('roleId') roleId: string): Promise<string> {
    try {
      return await this.userService.getRoleName(+roleId)
    } catch (e) {
      throw new HttpException(
        'Error in userControllers.updateUserStatus',
        HttpStatus.INTERNAL_SERVER_ERROR
      )
    }
  }
}
