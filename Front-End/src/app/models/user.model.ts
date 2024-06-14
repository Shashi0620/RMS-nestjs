/*
 * This is User model
 */
export class User {
  id?: number
  username?: string
  email?: string
  password?: string
  confirmPassword?: string
  phone?: string
  location?: string
  clientFk?: number
  roleId?: number
  token?: string
  storeId?: string
  trialend?: string
}
