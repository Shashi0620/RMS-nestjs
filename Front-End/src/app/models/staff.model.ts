import {Store} from './store.model'
/*
 * This is Staff model
 */
export class Staff {
  id?: number
  username?: string
  email?: string
  password?: string
  confirmPassword?: string
  selectedStores?: Store[]
}
