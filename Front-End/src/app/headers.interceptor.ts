/* eslint-disable no-undef */
import {Injectable} from '@angular/core'
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse
} from '@angular/common/http'
import {Observable, tap} from 'rxjs'
import {BusyIndicatorService} from './services/busy-indicator.service'

@Injectable()
export class HeadersInterceptor implements HttpInterceptor {
  constructor(private busyIndicatorService: BusyIndicatorService) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    this.busyIndicatorService.setBusy(true)

    request = request.clone({
      setHeaders: {
        Authorization: `Bearer ${localStorage.getItem('tokens')}`
      }
    })

    return next.handle(request).pipe(
      tap({
        next: (event: HttpEvent<any>) => {
          if (event instanceof HttpResponse) {
            this.busyIndicatorService.setBusy(false) // Set busy indicator to false on response
          }
        },
        error: error => {
          this.busyIndicatorService.setBusy(false) // Set busy indicator to false on error
        }
      })
    )
  }
}
