import { QueryTypes } from 'sequelize'
import { sequelizeConfig } from '../config/seq.config'
import fileOp, { existsSync } from 'fs'
import { environment } from '../environment'
import { Injectable, Logger } from '@nestjs/common'
import { File } from '../models/file.model'
import { InjectModel } from '@nestjs/sequelize'
const baseUrl = environment.baseUrl + '/api/user/files/profile/'
const directoryPath = environment.fileUploadFolderPath

export interface IFileDownload {
  filename: string
  filePath?: string
  user_fk?: number
  tray_fk: number
  rack_id?: number
}

@Injectable()
export class FileDownLoadService {
  constructor (
    @InjectModel(File)
    private readonly fileModel: typeof File
  ) {}

  public async fileCreate (payload: File): Promise<File> {
    Logger.log(
      'Start : FileDownLoadService : fileCreate : file name =',
      payload.filename
    )
    const filePath = baseUrl + payload.filename
    payload.filepath = filePath
    fileOp.copyFile(
      directoryPath + payload.filename,
      directoryPath + payload.filename,
      err => {
        if (err !== null) {
          Logger.error('file not copied', err)
        }
      }
    )
    const data = await this.fileModel.create(payload)
    Logger.log('End : FileDownLoadService : fileCreate : response =', data)
    return data
  }

  public async fileCreateTray (payload: IFileDownload): Promise<File> {
    Logger.log(
      'Start : FileDownLoadService : fileCreateTray : file name =',
      payload.filename
    )
    const filePath =
      baseUrl + payload.rack_id + '/' + payload.tray_fk + '/' + payload.filename
    payload.filePath = filePath
    const file = {
      filename: payload.filename,
      filepath: payload.filePath,
      tray_fk: payload.tray_fk
    } as File
    fileOp.copyFile(
      directoryPath +
        'rack_' +
        payload.rack_id +
        '/tray_' +
        payload.tray_fk +
        '/' +
        file.filename,
      directoryPath +
        'rack_' +
        payload.rack_id +
        '/tray_' +
        payload.tray_fk +
        '/' +
        file.filename,
      err => {
        if (err !== null) {
          Logger.error('file not copied', err)
        }
      }
    )
    const data = await this.fileModel.create(file)
    Logger.log('End : FileDownLoadService : fileCreateTray : response =', data)
    return data
  }

  public async findOne (id: string): Promise<File[]> {
    Logger.log('Start : FileDownLoadService  : findOne : file id =', id)

    const data = await this.fileModel.findAll({ where: { user_fk: id } })
    Logger.log('End : FileDownLoadService : findOne : responce :', data)
    return data
  }

  public async updateFile (updateId: number, payload: File): Promise<void> {
    Logger.log(
      'Start : FileDownLoadService : updateFile : update Id : ',
      updateId
    )
    const id = updateId
    const file = {
      filename: payload.filename,
      filepath: payload.filepath + payload.filename
    }
    const query = `UPDATE files SET filepath = '${file.filepath}',filename = '${file.filename}' WHERE id = ${id}`
    const data = await sequelizeConfig.query(query, {
      type: QueryTypes.UPDATE
    })
    if (data[1] !== null) {
      fileOp.copyFile(
        directoryPath + file.filename,
        directoryPath + '/profile/' + file.filename,
        err => {
          if (err !== null) Logger.error('file copied')
        }
      )
      Logger.log('profile password was updated successfully.')
    } else {
      Logger.error(`Cannot update profile password id=${id}`)
    }
    Logger.log('End : FileDownLoadService : updateFile ')
  }

  public async fetchTrayFile (id: number): Promise<File[]> {
    Logger.log('Start : FileDownLoadService : fetchTrayFile')
    const data = await this.fileModel.findAll({ where: { tray_fk: id } })
    Logger.log('End : FileDownLoadService : Response :', data)
    return data
  }

  public async updateTrayByFile (
    trayFk: number,
    payload: IFileDownload
  ): Promise<File[]> {
    Logger.log(
      'Start : FileDownLoadService : updateTrayByFile File name = ',
      payload.filename,
      ' Tray_fk = ',
      payload.tray_fk
    )

    let data: File[] = []
    const filename = `SELECT filename from files WHERE tray_fk = ${trayFk}`
    const trayFileName = await sequelizeConfig.query(filename, {
      type: QueryTypes.SELECT,
      model: this.fileModel
    })

    const folderDirectory =
      directoryPath +
      'rack_' +
      payload.rack_id +
      '/tray_' +
      trayFk +
      '/' +
      trayFileName[0].filename
    if (existsSync(folderDirectory)) {
      fileOp.unlink(
        directoryPath +
          'rack_' +
          payload.rack_id +
          '/tray_' +
          trayFk +
          '/' +
          trayFileName[0].filename,
        err => {
          if (err !== null) {
            throw err
          }
        }
      )
      const file = {
        filename: payload.filename,
        filepath: directoryPath
      }
      const query = `UPDATE files SET filepath = '${file.filepath}' WHERE tray_fk = ${trayFk}`
      data = await sequelizeConfig.query(query, {
        type: QueryTypes.UPDATE,
        model: this.fileModel
      })
    } else {
      Logger.error(
        'End : FileDownLoadService : updateTrayByFile : Old Tray File Path Not Found',
        folderDirectory
      )
    }
    Logger.log('End : FileDownLoadService : updateTrayByFile : response ', data)
    return data
  }
}
