/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import { extname } from 'path'
import { existsSync, mkdirSync } from 'fs'
import { diskStorage } from 'multer'
import { HttpException, HttpStatus } from '@nestjs/common'
import { environment } from '../environment'

export const multerConfig = {
  dest: environment.fileUploadFolderPath + 'profile'
}

export const multerOptions = {
  fileFilter: (req: any, file: any, cb: any) => {
    if (file.mimetype.match(/\/(jpg|jpeg|png|gif|txt|pdf)$/)) {
      cb(null, true)
    } else {
      cb(
        new HttpException(
          `Unsupported file type ${extname(file.originalname as string)}`,
          HttpStatus.BAD_REQUEST
        ),
        false
      )
    }
  },

  storage: diskStorage({
    destination: (req: any, file: any, cb: any) => {
      const uploadPath = multerConfig.dest
      console.log(uploadPath)

      if (!existsSync(uploadPath)) {
        mkdirSync(uploadPath)
      }
      cb(null, uploadPath)
    },

    filename: (req: any, file: any, cb: any) => {
      cb(null, file.originalname)
    }
  })
}
