import {field} from '../global.model'

/* eslint-disable filenames/match-regex */
export class Items {
  _id?: string
  attributes?: field[]
  name?: string
  description?: string
  clientFk?: number
  theme?: Objects
  message?: string
}

export class Objects {
  bgColor?: string
  textColor?: string
  bannerImage?: string
}
