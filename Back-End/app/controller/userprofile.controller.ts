import { UserProfile } from '../models/userProfile.model'
import { UserProfilesService } from '../service/userProfile.service'
import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Put,
  UseGuards
} from '@nestjs/common'
import { JwtAuthGuard } from '../auth/gaurds/jwt-auth.gaurd'

@UseGuards(JwtAuthGuard)
@Controller('api/profile')
export default class UserProfileController {
  constructor (private readonly userProfileService: UserProfilesService) {}
  @Get('/client/staff/role')
  public async fetchAllProfiles (): Promise<UserProfile[]> {
    try {
      return await this.userProfileService.fetchAllProfiles()
    } catch (e) {
      throw new HttpException(
        'Error in UserProfileController.fetchAllProfiles',
        HttpStatus.INTERNAL_SERVER_ERROR
      )
    }
  }

  @Get('/fetchProfileById/:id')
  public async fetchProfileById (
    @Param('id') id: string
  ): Promise<UserProfile | null> {
    try {
      return await this.userProfileService.fetchProfileById(+id)
    } catch (e) {
      throw new HttpException(
        'Error in UserProfileController.fetchProfileById',
        HttpStatus.INTERNAL_SERVER_ERROR
      )
    }
  }

  @Get('/fetchProfileByUserFK/:user_fk')
  public async fetchProfileByUserFK (
    @Param('user_fk') userFk: string
  ): Promise<UserProfile[]> {
    try {
      return await this.userProfileService.fetchProfileByUserFK(+userFk)
    } catch (e) {
      throw new HttpException(
        'Error in UserProfileController.fetchProfileByUserFK',
        HttpStatus.INTERNAL_SERVER_ERROR
      )
    }
  }

  @Put('/:id')
  public async updateProfile (
    @Param('id') id: string,
      @Body() body: UserProfile
  ): Promise<UserProfile[]> {
    try {
      return await this.userProfileService.updateProfile(body, +id)
    } catch (e) {
      throw new HttpException(
        'Error in UserProfileController.updateProfile',
        HttpStatus.INTERNAL_SERVER_ERROR
      )
    }
  }

  @Put('/updatePassword/:id')
  public async updatePassword (
    @Param('id') id: string,
      @Body() body: UserProfile
  ): Promise<UserProfile> {
    try {
      return await this.userProfileService.updatePassword(body, +id)
    } catch (e) {
      throw new HttpException(
        'Error in UserProfileController.updatePassword',
        HttpStatus.INTERNAL_SERVER_ERROR
      )
    }
  }
}
