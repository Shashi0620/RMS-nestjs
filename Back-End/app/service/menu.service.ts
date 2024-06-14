import { QueryTypes } from 'sequelize'
import { sequelizeConfig } from '../config/seq.config'
import { UserService } from './user.service'
import 'reflect-metadata'
import { forwardRef, Inject, Injectable, Logger } from '@nestjs/common'
import { Menu } from '../models/menu.model'
import { InjectModel } from '@nestjs/sequelize'

@Injectable()
export class MenuService {
  constructor (
    @InjectModel(Menu)
    private readonly menuModel: typeof Menu,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService
  ) {}

  public async menuCreate (payload: Menu): Promise<Menu> {
    Logger.log('Start of MenuService : menuCreate :payload', payload)
    const data = await this.menuModel.create(payload)
    Logger.log('End of MenuService : menuCreate :response', data)
    return data
  }

  public async findMenuById (id: number): Promise<Menu | null> {
    Logger.log('Start of MenuService : findMenuById :id', id)
    const menuId = id
    const data = await this.menuModel.findByPk(menuId)
    Logger.log('End of MenuService : findMenuById')
    return data
  }

  public async findAll (clientFk: string, roleId: string): Promise<Menu[]> {
    Logger.log('Start of MenuService : menuCreate')
    const roleName = await this.userService.getRoleName(+roleId)
    let query = `SELECT * FROM menus WHERE "clientFk" IS NULL OR "clientFk" = ${clientFk}`
    if (roleName === 'Staff') {
      query = `SELECT * FROM menus  WHERE "clientFk" =${clientFk}  OR "label"='Staff' OR "label"='Racks'`
    }
    const findAllMenus = await sequelizeConfig.query(query, {
      type: QueryTypes.SELECT,
      model: this.menuModel
    })
    Logger.log('End of MenuService : findAll :response', findAllMenus)
    return findAllMenus
  }

  public async deleteMenu (id: number): Promise<string> {
    Logger.log('Start of MenuService : deleteMenu :id', id)
    const templateID = id
    await this.menuModel.destroy({
      where: { templateID }
    })
    Logger.log('End of MenuService : deleteMenu')
    return 'Menu Deleted'
  }

  public async update (payload: Menu): Promise<[number | Menu]> {
    Logger.log('Start of MenuService : update :id', payload.id)
    const id = payload.id
    const menuUpdate = await this.menuModel.update(payload, {
      where: { id }
    })
    Logger.log('End of MenuService : updateId')
    return menuUpdate
  }

  public async findById (id: string): Promise<Menu[]> {
    Logger.log('Start of MenuService : findById :id', id)
    const templateID = id
    const data = await this.menuModel.findAll({
      where: { templateID }
    })
    Logger.log('End of MenuService : findById')
    return data
  }
}
