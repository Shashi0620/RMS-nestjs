// import {uploadFile} from "../middleware/upload"
import fs from 'fs'
import { environment } from '../environment'
import { Injectable, Logger } from '@nestjs/common'
const baseUrl = environment.baseUrl + '/files/'
const baseUrlProfile = environment.baseUrl + '/files/profile/'

// we need filename and file path for return type so i added interface
export interface IgetListFiles {
  fileName?: string
  filePath?: string
}

@Injectable()
export class FileService {
  /**
   * Below code is not using anywhere
   * File upload is in another controller
   */

  // public async upload(file): Promise<void> {
  //   Logger.log("Start : FileService : upload : file =", file)
  //   try {
  //     await uploadFile(file)
  //   } catch (e) {
  //     throw new HttpException(
  //       "Error in <FileControllers.upload>",
  //       HttpStatus.INTERNAL_SERVER_ERROR
  //     )
  //   }
  //   Logger.log("End : FileService : upload:")
  // }

  public async getListFiles (): Promise<IgetListFiles[]> {
    Logger.log('Start : FileService : getListFiles')
    const fileInfos: IgetListFiles[] = []
    const directoryPath = environment.fileUploadFolderPath + 'profile'
    fs.readdir(directoryPath, function (err, files) {
      if (err !== null) {
        Logger.error('Error in reading directory', directoryPath)
      }
      files.forEach(file => {
        fileInfos.push({
          fileName: file,
          filePath: baseUrl + file
        })
      })
      Logger.log('End : FileService : getListFiles : responce =', fileInfos)
    })
    return fileInfos
  }

  public async getListFilesInProfile (): Promise<IgetListFiles[]> {
    Logger.log('Start : FileService : getListFilesInProfile ')
    const fileInfos: IgetListFiles[] = []
    const directoryPath = environment.fileUploadFolderPath + 'profile'
    const files = fs.readdirSync(directoryPath)
    files.forEach(file => {
      fileInfos.push({
        fileName: file,
        filePath: baseUrlProfile + file
      })
    })
    Logger.log(
      'End : FileService : getListFilesInProfile : responce =',
      fileInfos
    )
    return fileInfos
  }

  public async download (fileName: string): Promise<string> {
    Logger.log('Start : FileService : download : file name =' + fileName)
    const directoryPath = environment.fileUploadFolderPath + 'profile'
    const filePath = directoryPath + fileName
    Logger.log('End : FileService : download : download file path =', filePath)
    return filePath
  }

  public async downloadProfileImages (fileName: string): Promise<string> {
    Logger.log(
      'Start : FileService : downloadProfileImages : file name =',
      fileName
    )
    const directoryPath =
      global.__basedir + '\\resources\\static\\assets\\uploads\\profile\\'
    const filePath = directoryPath + fileName
    Logger.log(
      'End : FileService : downloadProfileImages : file name =',
      fileName
    )
    return filePath
  }
}
