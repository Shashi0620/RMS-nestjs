import { QueryTypes } from 'sequelize'
import { sequelizeConfig } from '../config/seq.config'
import { Injectable, Logger } from '@nestjs/common'
import { ItemForms } from '../models/itemForm.model'
import { InjectModel } from '@nestjs/sequelize'
import { Template } from '../models/item.model'

/* While inserting data to dynamic table i have added exta column name "quantity" so i have used interface
rather than the model */
export interface IFormCreate {
  name?: string
  description?: string
  attributes?: string
  itemTempId?: number
  quantity?: number
}

// uses this because query is fetching only some of the columns so i added only those columns
export interface IFindItemsOnTray {
  id: number
  name: string
  itemtempid: number
  description: string
  attributes: []
  quantity: number
  upperLimit: number
  lowerLimit: number
  notificationSettngFk: number
}
// to fetch upper , lower and notificationsettngfk
export interface LowerAndUpper {
  upperLimit: number
  lowerLimit: number
  notificationSettngFk: number
}

@Injectable()
export class FormService {
  constructor (
    @InjectModel(ItemForms)
    private readonly itemFormsModel: typeof ItemForms,
    @InjectModel(Template)
    private readonly templateModel: typeof Template
  ) {}

  public async CreateForm (
    paylod: IFormCreate,
    tempName: string,
    schemaName: string
  ): Promise<void> {
    const bodyAttribute = paylod.attributes
    const formData = JSON.stringify(bodyAttribute)
    const formItem = {
      attributes: formData,
      name: paylod.name,
      itemTempId: paylod.itemTempId,
      quantity: paylod.quantity,
      description: paylod.description
    }
    let insert = `INSERT INTO ${schemaName}.${tempName}_template(`
    for (const key in formItem) {
      if (key === 'description') {
        insert += `${key}`
      } else {
        insert += `${key}, `
      }
    }
    insert += ') VALUES ('
    for (const key in formItem) {
      if (key === 'description') {
        insert += `'${formItem[key]}'`
      } else {
        insert += `'${formItem[key]}', `
      }
    }
    insert += ')'
    insert += 'RETURNING id'
    await sequelizeConfig.query(insert, {
      type: QueryTypes.INSERT
    })
  }

  public async findOne (
    username: string,
    customerId: number,
    schemaName: string
  ): Promise<object[]> {
    Logger.log('Start : FormService : findOne : customerid =', customerId)
    const id = customerId
    const name = username
    const data = await sequelizeConfig.query(
      `SELECT * FROM ${schemaName}.${name}_template  WHERE id = ${id} `,
      {
        type: QueryTypes.SELECT
      }
    )
    Logger.log('End : FormService : findAll : Response : ', data)
    return data
  }

  public async update (
    updateId: number,
    formname: string,
    schemaName: string,
    payload: IFormCreate
  ): Promise<void> {
    Logger.log('Start : FormService : update : updateid =', updateId)
    const id = updateId
    const name = formname
    const templateName = payload.name
    const templateAttribute = payload.attributes
    const num = await sequelizeConfig.query(
      `UPDATE ${schemaName}.${name}_template SET name = '${templateName}',description = '${
        payload.description
      }', quantity = ${payload.quantity},
  attributes = '${JSON.stringify(templateAttribute)}' WHERE id = ${id}`,
      { type: QueryTypes.UPDATE }
    )
    Logger.log('End : FormService : update : Response : ', num)
  }

  public async deleteForm (
    formid: string,
    formname: string,
    schemaName: string
  ): Promise<void> {
    Logger.log('Start : FormService : deleteForm : form id =', formid)
    const id = formid
    const name = formname
    const tableName = 'trayItems'
    await sequelizeConfig.query(
      `Delete from ${schemaName}.${name}_template WHERE id = ${id}`,
      {
        type: QueryTypes.DELETE
      }
    )
    await sequelizeConfig.query(
      `Delete from "${tableName}" WHERE "formId" = ${id}`,
      {
        type: QueryTypes.DELETE
      }
    )
    Logger.log('End : FormService : deleteForm')
  }

  public async fetchAllTemplates (): Promise<Template[]> {
    Logger.log('Start : FormService  : fetchAllTemplates ')
    const query = 'SELECT * from templates '
    const data = await sequelizeConfig.query(query, {
      type: QueryTypes.SELECT,
      model: this.templateModel
    })

    Logger.log('End : FormService : deleteForm : response : ', data)
    return data
  }

  public async deleteFromTemplate (
    formname: string,
    formid: number,
    schemaName: string
  ): Promise<string> {
    Logger.log('Start : FormService : deleteFromTemplate : from Id =', formid)
    const name = formname.replace(/ /g, '_').toLowerCase()
    await sequelizeConfig.query(`DROP TABLE ${schemaName}.${name}_template`, {
      type: QueryTypes.DELETE
    })
    Logger.log('End : FormService : deleteFromTemplate ')
    return 'deleted'
  }

  public async findTemplates (name: string): Promise<object> {
    Logger.log('Start : FormService : findTemplates : form name =', name)
    const formName = name

    const data = await sequelizeConfig.query(
      `SELECT * FROM ${formName}_template`,
      {
        type: QueryTypes.SELECT
      }
    )
    Logger.log('End : FormService : findTemplates : response : ', data)
    return data
  }

  public async findItemsOnStore (
    itemTempId: string,
    name: string,
    schemaName: string,
    page: number,
    size: number
  ): Promise<object> {
    Logger.log(
      'Start : FormService : findTemplates : form name =',
      name,
      'itemTempId',
      itemTempId
    )
    const formName = name
    const offset = page * size
    const data = await sequelizeConfig.query(
      `SELECT * FROM ${schemaName}.${formName}_template order by id  LIMIT ${size} OFFSET ${offset}`,
      {
        type: QueryTypes.SELECT
      }
    )

    return data
  }

  public async findTotalItemsOnStore (
    itemTempId: string,
    name: string,
    schemaName: string
  ): Promise<object> {
    Logger.log(
      'Start : FormService : findTotalItemsOnStore : form name =',
      name,
      'itemTempId',
      itemTempId
    )
    const formName = name
    const data = await sequelizeConfig.query(
      `SELECT * FROM ${schemaName}.${formName}_template order by id`,
      {
        type: QueryTypes.SELECT
      }
    )
    Logger.log(
      'End : FormService : findTotalItemsOnStore : form name =',
      name,
      'itemTempId',
      itemTempId
    )
    return data
  }

  public async fetchUpperLowerAndNotification (
    trayItemId: number
  ): Promise< object[] > {
    Logger.log(
      'Start : FormService : fetchUpperLowerAndNotification : formId =',
      trayItemId
    )
    const data = await sequelizeConfig.query(
      ` select ti."upperLimit", ti."lowerLimit", ti."notificationSettngFk" from "trayItems" ti where ti.id=${trayItemId}`,
      {
        type: QueryTypes.SELECT
      }
    )
    Logger.log(
      'End : FormService : fetchUpperLowerAndNotification : formId =',
      trayItemId
    )
    return data
  }
}
