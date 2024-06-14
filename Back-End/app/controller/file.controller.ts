import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { InjectModel } from '@nestjs/sequelize'
import { multerOptions } from '../middleware/upload'
import { FileService, type IgetListFiles } from '../service/file.service'
import { File } from '../models/file.model'
import { JwtAuthGuard } from '../auth/gaurds/jwt-auth.gaurd'
import { multerOptionsTray } from '../middleware/trayFileUpload'
import { environment } from '../environment'

@UseGuards(JwtAuthGuard)
@Controller('/api/files')
export default class FileControllers {
  constructor (
    private readonly fileService: FileService,
    @InjectModel(File)
    private readonly fileModel: typeof File
  ) {}

  @Post('/')
  @UseInterceptors(FileInterceptor('image', multerOptions))
  public async upload (@UploadedFile() file: Express.Multer.File): Promise<Express.Multer.File> {
    try {
      return file
    } catch (e) {
      throw new HttpException(
        'Error in <FileControllers.upload>',
        HttpStatus.INTERNAL_SERVER_ERROR
      )
    }
  }

  @Post('/trayFile/:rackId/:trayId')
  @UseInterceptors(FileInterceptor('image', multerOptionsTray))
  public async trayFileUpload (
    @UploadedFile() file: Express.Multer.File,
      @Param('rackId') rackId: number,
      @Param('trayId') trayId: number
  ): Promise<Express.Multer.File> {
    try {
      return file
    } catch (e) {
      throw new HttpException(
        'Error in <FileControllers.trayFileUpload>',
        HttpStatus.INTERNAL_SERVER_ERROR
      )
    }
  }

  @Get('/files')
  public async getListFiles (): Promise<IgetListFiles[]> {
    try {
      return await this.fileService.getListFiles()
    } catch (e) {
      throw new HttpException(
        'Error in <FileControllers.getListFiles>',
        HttpStatus.INTERNAL_SERVER_ERROR
      )
    }
  }

  @Get('/files/profile')
  public async getListFilesInProfile (): Promise<IgetListFiles[]> {
    try {
      return await this.fileService.getListFilesInProfile()
    } catch (e) {
      throw new HttpException(
        'Error in <FileControllers.getListFilesInProfile>',
        HttpStatus.INTERNAL_SERVER_ERROR
      )
    }
  }

  @Get('/files/:name')
  public async download (@Param('name') name: string): Promise<string> {
    try {
      return await this.fileService.download(name)
    } catch (e) {
      throw new HttpException(
        'Error in <FileControllers.download>',
        HttpStatus.INTERNAL_SERVER_ERROR
      )
    }
  }

  @Get('/files/profile/:name')
  @UseInterceptors()
  async downloadProfileImages (@Res() res, @Param('name') name): Promise<void> {
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
        'Error in <FileControllers.downloadProfileImages>',
        HttpStatus.INTERNAL_SERVER_ERROR
      )
    }
  }
}
