import { UserPreferenceService } from '../service/userpreference.service'
import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  UseGuards
} from '@nestjs/common'
import { UserPreference } from '../models/userPreference.model'
import { JwtAuthGuard } from '../auth/gaurds/jwt-auth.gaurd'

@UseGuards(JwtAuthGuard)
@Controller('api/userPreference')
export default class userPrefernceControllers {
  constructor (private readonly userPreferenceService: UserPreferenceService) {}

  @Post('/createUserPreference')
  public async createUserPreference (
    @Body() body: UserPreference
  ): Promise<UserPreference> {
    try {
      return await this.userPreferenceService.createUserPreference(body)
    } catch (e) {
      throw new HttpException(
        'Error in userPrefernceControllers.createUserPreference',
        HttpStatus.INTERNAL_SERVER_ERROR
      )
    }
  }

  @Get('/fetchAllSelectedColumns/:templateId/:userFk')
  public async fetchAllSelectedColumns (
    @Param('templateId') templateId: string,
      @Param('userFk') userFk: string
  ): Promise<UserPreference[]> {
    try {
      return await this.userPreferenceService.fetchAllSelectedColumns(
        +templateId,
        +userFk
      )
    } catch (e) {
      throw new HttpException(
        'Error in userPrefernceControllers.fetchAllSelectedColumns',
        HttpStatus.INTERNAL_SERVER_ERROR
      )
    }
  }

  @Put('/:id')
  async updateSelectedColumns (
    @Param('id') id: string,
      @Body() body: UserPreference
  ): Promise<UserPreference[]> {
    try {
      return await this.userPreferenceService.updateSelectedColumns(+id, body)
    } catch (e) {
      throw new HttpException(
        'Error in userPrefernceControllers.updateSelectedColumns',
        HttpStatus.INTERNAL_SERVER_ERROR
      )
    }
  }
}
