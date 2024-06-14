// busy-indicator.service.ts
import {Injectable} from '@angular/core'
import {BehaviorSubject} from 'rxjs'

@Injectable({
  providedIn: 'root'
})
export class BusyIndicatorService {
  private _busy: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false)

  get busy$() {
    return this._busy.asObservable()
  }

  setBusy(busy: boolean) {
    this._busy.next(busy)
  }
}
