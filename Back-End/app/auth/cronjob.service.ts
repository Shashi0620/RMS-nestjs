import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
  forwardRef
} from '@nestjs/common'
import { Cron, CronExpression } from '@nestjs/schedule'
import { HttpService } from '@nestjs/axios'
import { environment } from '../environment'

@Injectable()
export class CronJobService {
  constructor (
    @Inject(forwardRef(() => HttpService))
    private readonly httpService: HttpService
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_11PM)
  async handleCron (): Promise<void> {
    Logger.log('Start : CronJobService : handleCron')
    try {
      Logger.log(
        'Start : CronJobService : handleCron : calculateEscalationBasedAlertConfiguration'
      )
      const user = {
        username: environment.username,
        password: environment.password
      }
      const token = await this.httpService.axiosRef.post(
        `${environment.baseUrl}/api/user/auth/login`,
        user
      )
      const authorization = `bearer ${token.data.access_token}`
      await this.httpService.axiosRef.get(
        `${environment.baseUrl}/api/trayItem/calculateEscalationBasedAlertConfiguration`,
        {
          headers: {
            Authorization: authorization
          }
        }
      )
      Logger.log(
        'End : CronJobService : handleCron : calculateEscalationBasedAlertConfiguration'
      )

      Logger.log('Start : CronJobService : handleCron : sendMailNotification')
      await this.httpService.axiosRef.get(
        `${environment.baseUrl}/api/notification/sendEmailNotification`,
        {
          headers: {
            Authorization: authorization
          }
        }
      )
      Logger.log('End : CronJobService : handleCron : sendMailNotification')
    } catch (e) {
      throw new HttpException(
        'Error in CronJobService.handleCron',
        HttpStatus.INTERNAL_SERVER_ERROR
      )
    }
  }
}
