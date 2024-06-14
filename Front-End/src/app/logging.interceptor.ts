/*
 * This is logging.intercepter.ts
 */
import {Injectable} from '@angular/core'
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest
} from '@angular/common/http'
import {Observable} from 'rxjs'
import {AppService} from './app.service'
import {User} from './models/user.model'

@Injectable()
export class LoggingInterceptor implements HttpInterceptor {
  USER_NAME = 'x-access-token'
  UserObj: User

  constructor(private appService: AppService) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    this.UserObj = this.appService.getuserObject()
    this.UserObj = JSON.parse(sessionStorage.getItem('userObj'))
    if (this.UserObj) {
      const authReq = request.clone({
        headers: request.headers.set(
          'Authorization',
          `bearer ${localStorage.getItem('tokens')}`
        )
      })
      return next.handle(authReq)
    } else {
      const authReq = request.clone({
        headers: request.headers.set('Authorization', 'superAdmin')
      })
      return next.handle(authReq)
    }
  }
}
