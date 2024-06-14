import {
  Body,
  Controller,
  Post,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Res,
  UseInterceptors,
  UploadedFile
} from '@nestjs/common'
import { ContactUs, UserService } from '../service/user.service'
import { AuthService } from './auth.service'
import { type Plan } from '../models/plan.model'
import { User } from '../models/user.model'
import { Client } from '../models/client.model'
import { InjectModel } from '@nestjs/sequelize'
import { File } from '../models/file.model'
import { environment } from '../environment'
import { FileInterceptor } from '@nestjs/platform-express'
import { multerOptionsContactUs } from '../middleware/contactUsAttachment'
import { Response } from 'express'
import { NotificationService } from '../service/notification.service'
export interface ILoginPaylod {
  username: string
  password: string
  status: string
  trailend: Date
}

@Controller('api/user')
export class AuthController {
  constructor (
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly notififcationService: NotificationService,
    @InjectModel(File)
    private readonly fileModel: typeof File
  ) {}

  @Post('/client')
  public async createClient (@Body() body: Client): Promise<Client> {
    try {
      return await this.userService.createClient(body)
    } catch (e) {
      throw new HttpException(
        'Error in AuthController.createClient',
        HttpStatus.INTERNAL_SERVER_ERROR
      )
    }
  }

  // Activation is part of registration before so i moved to auth controller
  @Get('/activation/:clientFk/:userPk')
  public async updateUserStatus (
    @Param('clientFk') clientid: string,
      @Param('userPk') userid: string,
      @Res() res: Response
  ): Promise<void> {
    try {
      const user = await this.userService.updateUserStatus(+clientid, +userid)
      const fileName = 'registrationSuccessfull'
      res.render(fileName, {
        emailData: user?.dataValues,
        link: environment.frontEndUrl
      })
    } catch (e) {
      const fileName = 'activationFailed'
      res.render(fileName, {})
    }
  }

  @Post('/')
  public async createUser (@Body() body: User): Promise<User> {
    try {
      return await this.userService.CreateUser(body)
    } catch (e) {
      throw new HttpException(
        'Error in AuthController.createUser',
        HttpStatus.INTERNAL_SERVER_ERROR
      )
    }
  }

  @Get('/client/validation/:value/:type')
  public async validation (
    @Param('value') value: string,
      @Param('type') type: string
  ): Promise<User[]> {
    try {
      return await this.userService.validation(value, type)
    } catch (e) {
      throw new HttpException(
        'Error in AuthController.validation',
        HttpStatus.INTERNAL_SERVER_ERROR
      )
    }
  }

  @Get('/client/plans')
  public async findAllPlans (): Promise<Plan[]> {
    try {
      return await this.userService.findAllPlans()
    } catch (e) {
      throw new HttpException(
        'Error in AuthController.findAllPlans',
        HttpStatus.INTERNAL_SERVER_ERROR
      )
    }
  }

  @Post('auth/login')
  public async login (@Body() authLoginDto: ILoginPaylod): Promise<{ access_token: string }> {
    try {
      return await this.authService.login(authLoginDto)
    } catch (e) {
      throw new HttpException(
        'Error in AuthController.login',
        HttpStatus.INTERNAL_SERVER_ERROR
      )
    }
  }

  @Get('/files/profile/:name')
  async downloadProfileImages (@Res() res, @Param('name') name): Promise<Response> {
    try {
      await this.fileModel.findOne({
        where: {
          filename: name
        }
      })
      const filepath = environment.fileUploadFolderPath + 'profile/' + name
      return res.download(filepath)
    } catch (e) {
      throw new HttpException(
        'Error in AuthController.downloadTrayImages',
        HttpStatus.INTERNAL_SERVER_ERROR
      )
    }
  }

  @Get('/files/profile/trayImages/:rackId/:trayId/:name')
  async downloadTrayImages (
    @Res() res,
      @Param('name') name,
      @Param('rackId') rackId: string,
      @Param('trayId') trayId: string
  ): Promise<Response> {
    try {
      await this.fileModel.findOne({
        where: {
          filename: name
        }
      })
      const filepath =
        environment.fileUploadFolderPath +
        'rack_' +
        rackId +
        '/tray_' +
        trayId +
        '/' +
        name
      return res.download(filepath)
    } catch (e) {
      throw new HttpException(
        'Error in AuthController.downloadTrayImages',
        HttpStatus.INTERNAL_SERVER_ERROR
      )
    }
  }

  @Post('/client/resetPassword')
  async forgotPassword (@Body() userData: User): Promise<User[]> {
    try {
      return await this.userService.forgotpassword(userData)
    } catch (e) {
      throw new HttpException(
        'Error in AuthController.forgotPassword',
        HttpStatus.INTERNAL_SERVER_ERROR
      )
    }
  }

  @Post('/contactus')
  public async contactUs (@Body() body: ContactUs): Promise<void> {
    try {
      await this.userService.contactUs(body)
    } catch (e) {
      throw new HttpException(
        'Error in AuthController.contactUs',
        HttpStatus.INTERNAL_SERVER_ERROR
      )
    }
  }

  @Post('/contactusAttachment')
  @UseInterceptors(FileInterceptor('image', multerOptionsContactUs))
  public async contactUsAtachment (@UploadedFile() file: Express.Multer.File): Promise<Express.Multer.File> {
    try {
      return file
    } catch (e) {
      throw new HttpException(
        'Error in <AuthController.contactUsAtachment>',
        HttpStatus.INTERNAL_SERVER_ERROR
      )
    }
  }

  @Get('/:id')
  async retriveEmailTemplate (@Res() res: Response, @Param('id') id: string): Promise<void> {
    try {
      let fileName: string
      const notificationRecord =
        await this.notififcationService.fetchNotificationById(+id)
      if (notificationRecord?.notificationType === 'CONTACT-US') {
        if (notificationRecord.content.subject === 'Ticket') {
          fileName = 'ticket'
          res.render(fileName, { contactUsData: notificationRecord.content })
        } else {
          fileName = 'contactus'
          res.render(fileName, { contactUsData: notificationRecord.content })
        }
      } else if (notificationRecord?.notificationType === 'CHANGEPASSWORD') {
        fileName = 'changePassword'
        res.render(fileName, {
          contactUsData: notificationRecord.content,
          link: environment.frontEndUrl
        })
      } else if (notificationRecord?.notificationType === 'REGISTERED') {
        fileName = 'registration'
        res.render(fileName, {
          emailData: notificationRecord.content,
          link: environment.baseUrl
        })
      } else if (notificationRecord?.notificationType === 'STAFF-REGISTERED') {
        fileName = 'staffRegistration'
        res.render(fileName, {
          emailData: notificationRecord.content,
          link: environment.frontEndUrl
        })
      } else if (notificationRecord?.notificationType === 'QUANTITY-ALERT') {
        fileName = 'quantityAlert'
        res.render(fileName, { emailData: notificationRecord.content })
      }
    } catch (e) {
      throw new HttpException(
        'Error in authControllers.retriveEmailTemplate',
        HttpStatus.INTERNAL_SERVER_ERROR
      )
    }
  }

  @Get('/trail/packages')
  public async getPackages (): Promise<string> {
    return 'Your trail period has ended. Please click here to receive your invoice'
  }

  @Get('/faq/data')
  public async fetchFaqData (): Promise<string> {
    try {
      return await this.userService.readFaqFile()
    } catch (e) {
      throw new HttpException(
        'Error in AuthController.fetchFaqData',
        HttpStatus.INTERNAL_SERVER_ERROR
      )
    }
  }
}
