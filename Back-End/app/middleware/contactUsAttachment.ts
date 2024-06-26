import { extname } from 'path'
import { existsSync, mkdirSync } from 'fs'
import { diskStorage } from 'multer'
import { HttpException, HttpStatus } from '@nestjs/common'
import { environment } from '../environment'

export const multerConfig = {
  dest: environment.fileUploadFolderPath + 'contactUs'
}

export const multerOptionsContactUs = {
  fileFilter: (req: any, file: any, cb: any) => {
    if (file.mimetype.match(/\/(jpg|jpeg|png|gif|txt|pdf|mp4|mp3)$/)) {
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
