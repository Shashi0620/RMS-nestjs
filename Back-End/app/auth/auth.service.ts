import { Injectable } from '@nestjs/common'
import { UserService, type ILoginPaylod } from '../service/user.service'
import { JwtService } from '@nestjs/jwt'
import crypto from 'crypto'
@Injectable()
export class AuthService {
  constructor (
    private readonly usersService: UserService,
    private readonly jwtService: JwtService
  ) {}

  async validateUser (username: string, password: string): Promise<any> {
    const user = await this.usersService.findOne(username, password)
    const hash = crypto.createHash('md5').update(password).digest('hex')
    password = hash
    if ((user != null) && user.password === password) {
      const { password, ...result } = user
      return result
    }
    return null
  }

  async login (user: ILoginPaylod): Promise<{ access_token: string }> {
    return {
      access_token: this.jwtService.sign(user)
    }
  }
}
