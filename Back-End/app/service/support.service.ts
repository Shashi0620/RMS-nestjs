import { Injectable, Logger } from '@nestjs/common'
import { Support } from '../models/support.model'
import { InjectModel } from '@nestjs/sequelize'

@Injectable()
export class SupportService {
  constructor (
    @InjectModel(Support)
    private readonly suppotModel: typeof Support
  ) {}

  public async getSupportByTitle (title: string): Promise<Support | null> {
    Logger.log('Start of SupportService: getSupportByTitle :description', title)
    const support = await this.suppotModel.findOne({
      where: {
        title
      }
    })
    Logger.log('End of SupportService : getSupportByTitle :response', support)
    return support
  }
}
