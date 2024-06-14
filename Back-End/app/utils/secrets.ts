import { Logger } from '@nestjs/common'
export const JWT_SECRET = 'ThisIsMySecret'
if (!JWT_SECRET) {
  Logger.log('No JWT secret string. Set JWT_SECRET environment variable.')
  process.exit(1)
}
