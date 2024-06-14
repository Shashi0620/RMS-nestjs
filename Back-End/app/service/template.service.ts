import { QueryTypes } from 'sequelize'
import { sequelizeConfig } from '../config/seq.config'
import { forwardRef, Inject, Injectable, Logger } from '@nestjs/common'
import { FormService } from './form.service'
import { MenuService } from './menu.service'
import { Template } from '../models/item.model'
import { InjectModel } from '@nestjs/sequelize'
import { type Menu } from '../models/menu.model'
import { RackService } from './rack.service'
// alter name i have to pass name as a payload so i used interface
export interface IitemRename {
  name: string
}

@Injectable()
export class TemplateService {
  constructor (
    @InjectModel(Template)
    private readonly templateModel: typeof Template,
    @Inject(forwardRef(() => MenuService))
    private readonly menuService: MenuService,
    @Inject(forwardRef(() => FormService))
    private readonly formService: FormService,
    @Inject(forwardRef(() => RackService))
    private readonly rackService: RackService
  ) {}

  public async create (
    clientFk: string,
    templateName: string,
    schemaName: string | undefined
  ): Promise<Template> {
    Logger.log(
      'Start : TemplateService  : create : templateName =',
      templateName,
      'schemaName = ',
      schemaName
    )
    const template = {} as Template
    template.attributes = []
    template.name = templateName
    template.description = templateName
    template.clientFk = +clientFk

    let query = `CREATE TABLE ${schemaName}.${templateName}_template (
      `
    query += ` id SERIAL PRIMARY KEY, 
      name character varying(255), 
      itemTempId integer, 
      description character varying(255), 
      attributes json, 
      quantity integer, 
      createdAt timestamp with time zone NULL, 
      updatedAt timestamp with time zone NULL, 
      CONSTRAINT ${templateName}_fkey FOREIGN KEY (itemTempId) REFERENCES templates (id) ON UPDATE NO ACTION ON DELETE NO ACTION
    `
    query += ')'
    await sequelizeConfig.query(query)
    const data = await this.templateModel.create(template)
    const menu = {} as Menu
    menu.label = data.dataValues.name
    menu.action = 'menu' + '/' + data.dataValues.name + '/' + data.dataValues.id
    menu.menu_fk = 1
    menu.roleId = 1
    menu.templateID = data.dataValues.id
    menu.clientFk = +clientFk
    await this.menuService.menuCreate(menu)
    Logger.log('End : TemplateService  : create : Response : ', data)

    return data
  }

  public async createNewTemplate (
    clientFk: number,
    schemaName: string,
    payload: Template
  ): Promise<Template> {
    payload.name = payload.name.replace(/ /g, '_')
    let query = `CREATE TABLE ${schemaName}.${payload.name}_template (
  `
    query += ` id SERIAL PRIMARY KEY, 
  name character varying(255), 
  itemTempId integer, 
  description character varying(255), 
  attributes json, 
  quantity integer, 
  createdAt timestamp with time zone NULL, 
  updatedAt timestamp with time zone NULL, 
  CONSTRAINT ${payload.name}_fkey FOREIGN KEY (itemTempId) REFERENCES templates (id) ON UPDATE NO ACTION ON DELETE NO ACTION
  `
    query += ')'
    await sequelizeConfig.query(query)

    payload.attributes = JSON.stringify(payload.attributes)
    const data = await this.templateModel.create(payload)

    const menu = {} as Menu
    menu.label = data.dataValues.name
    menu.action = 'menu' + '/' + data.dataValues.name + '/' + data.dataValues.id
    menu.menu_fk = 1
    menu.roleId = 1
    menu.templateID = data.dataValues.id
    menu.clientFk = +clientFk
    await this.menuService.menuCreate(menu)

    return data
  }

  public async findAll (id: number): Promise<Template[]> {
    Logger.log('Start : TemplateService  : findAll : client Fk =' + id)
    const clientFk = id
    const query = `SELECT * FROM templates WHERE "clientFk" = ${clientFk}`
    const data = await sequelizeConfig.query(query, {
      type: QueryTypes.SELECT,
      model: this.templateModel
    })
    Logger.log('End : TemplateService  : findAll : Response : ', data)
    return data
  }

  public async findAllTemplatesWhichHaveProducts (
    schemaName: string
  ): Promise<Template[]> {
    Logger.log(
      'Start : TemplateService  : findAllTemplatesWhichHaveProducts : schemaName =' +
        schemaName
    )
    schemaName = schemaName.toLowerCase()
    const getTemplatesWhichHaveProducts = `select 
    * 
  from 
    templates 
  WHERE 
    lower(NAME) IN (
      SELECT 
        REPLACE(TABLE_NAME, '_template', '') 
      from 
        (
          select 
            table_name, 
            table_schema, 
            query_to_xml(
              format(
                'select count(*) as cnt from %I.%I', 
                table_schema, table_name
              ), 
              false, 
              true, 
              ''
            ) as xml_count 
          from 
            information_schema.tables 
          where 
            table_schema = '${schemaName}' --<< change here for the schema you want
            ) t 
      WHERE 
        (
          xpath('/row/cnt/text()', xml_count)
        ) [1] :: text :: INT > 0
    )  
  `
    const templateRecords = await sequelizeConfig.query(
      getTemplatesWhichHaveProducts,
      {
        type: QueryTypes.SELECT,
        model: this.templateModel
      }
    )

    Logger.log(
      'End : TemplateService  : findAllTemplatesWhichHaveProducts : schemaName =' +
        schemaName
    )
    return templateRecords
  }

  public async findAlltemplatesByTrayId (trayId: number): Promise<Template[]> {
    Logger.log(
      'Start : TemplateService  : findAlltemplatesByTrayId : trayId =' + trayId
    )
    const query = `SELECT 
    t.* 
  FROM 
    "templates" t 
    JOIN "trayItems" ti ON t.id = ti."tempId" 
    JOIN "trays" tr ON tr.id = ti."trayId" 
  WHERE 
    tr.id = ${trayId} 
  GROUP BY 
    t.id
  `
    const data = await sequelizeConfig.query(query, {
      type: QueryTypes.SELECT,
      model: this.templateModel
    })
    Logger.log(
      'End : TemplateService  : findAlltemplatesByTrayId : trayId =' + trayId
    )
    return data
  }

  public async findOne (customerId: string): Promise<Template | null> {
    Logger.log(
      'Start : TemplateService  : findOne : customer Id =' + customerId
    )
    const id = customerId
    const data = await this.templateModel.findByPk(id)
    Logger.log('End : TemplateService  : findOne : Response : ', data)
    return data
  }

  public async findOneTemplate (
    username: string,
    customerId: number
  ): Promise<Template[]> {
    Logger.log(
      'Start : TemplateService  : findOneTemplate :  customer Id =',
      customerId
    )
    const id = customerId
    const name = username
    const data = await sequelizeConfig.query(
      `SELECT * FROM ${name}_template  WHERE id = ${id} `,
      {
        type: QueryTypes.SELECT,
        model: this.templateModel
      }
    )
    Logger.log('End : TemplateService  : findOneTemplate :  Response ', data)
    return data
  }

  public async updatetemp (
    updateId: number,
    name: string,
    payload: Template
  ): Promise<[number | Template]> {
    const id = updateId
    payload.attributes = JSON.stringify(payload.attributes)
    const num = await this.templateModel.update(payload, {
      where: { id }
    })
    return num
  }

  public async validation (name: string): Promise<Template[]> {
    Logger.log('Start : TemplateService  : validation :  name =', name)
    const value = name
    const data = await this.templateModel.findAll({ where: { name: value } })
    Logger.log('End : TemplateService  : validation :  response =', data)
    return data
  }

  public async deleteItem (
    id: number,
    name: string,
    schemaName: string
  ): Promise<string> {
    Logger.log('Start : TemplateService  : deleteItem :  name =', name)
    const templateId = id
    await this.menuService.deleteMenu(templateId)
    await this.rackService.deleteTrayByTemplateId(templateId)
    await this.formService.deleteFromTemplate(name, templateId, schemaName)
    await this.templateModel.destroy({
      where: { id }
    })
    Logger.log('Start : TemplateService  : deleteItem :  name =', name)
    return 'deleted'
  }

  public async alterTable (
    updateId: number,
    name: string,
    schemaName: string,
    payload: IitemRename,
    menuid: number
  ): Promise<[number | IitemRename]> {
    Logger.log('Start : TemplateService  : deleteItem :  name =', name)
    const id = updateId
    const tableName = name
    const menuId = menuid

    const updateTemplateName = payload.name.replaceAll(/ /g, '_')
    const currentTableName = tableName.replaceAll(/ /g, '_')
    await sequelizeConfig.query(
      `ALTER TABLE ${schemaName}.${currentTableName}_template
    RENAME TO ${updateTemplateName}_template;`,
      { type: QueryTypes.UPDATE }
    )
    payload.name = payload.name.replaceAll(/ /g, '_')
    const num = await this.templateModel.update(payload, {
      where: { id }
    })
    const menu = {} as Menu
    menu.label = payload.name
    menu.id = menuId
    menu.action = 'menu' + '/' + payload.name + '/' + id
    if (num[0] === 1) {
      await this.menuService.update(menu)
    } else {
      Logger.error('cannot update menu')
    }
    Logger.log('Start : TemplateService  : deleteItem :  name =', name)
    return num
  }
}
