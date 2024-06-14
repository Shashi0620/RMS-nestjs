import {field} from '../global.model'

/*
 * This is Item model
 */
export class ItemObject {
  _id?: string
  attributes?: field[]
  name?: string
  description?: string
  clientFk?: number
  theme?: Object
  message?: string
}

export class Object {
  bgColor?: string
  textColor?: string
  bannerImage?: string
}
