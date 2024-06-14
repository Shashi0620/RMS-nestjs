import { Injectable } from '@nestjs/common'
import * as bcrypt from 'bcrypt'

@Injectable()
export class HashService {
  async hashPassword (password: string): Promise<void> {
    const saltOrRounds = 10
    return bcrypt.hash(password, saltOrRounds)
  }

  async comparePassword (password: string, hash): Promise<void> {
    return bcrypt.compare(password, hash)
  }
}
