import {Observable} from 'rxjs'
import {HttpClient} from '@angular/common/http'
import {Injectable} from '@angular/core'
import {environment} from '../../environments/environment'
import {Menu} from '../models/menu.model'

const baseUrl = environment.baseUrl

@Injectable({
  providedIn: 'root'
})
export class MenuService {
  isTrayMenu = false

  constructor(private http: HttpClient) {}

  showTrayMenu(): void {
    this.isTrayMenu = true
  }

  getRoleById(roleId: number): Observable<Menu> {
    return this.http.get(`${baseUrl}/api/menu/item/${roleId}`)
  }

  getMenuByItemId(itemId: number): Observable<Menu> {
    return this.http.get(`${baseUrl}/api/menu/item/${itemId}`)
  }

  fetchAllMenus(clientFk: number, roleId: number): Observable<Menu[]> {
    return this.http.get<Menu[]>(
      `${baseUrl}/api/menu/?clientFk=${clientFk}&roleId=${roleId}`
    )
  }

  createMenu(data: Menu): Observable<Menu> {
    return this.http.post(`${baseUrl}/api/menu/createMenu`, data)
  }

  templateDropdownRemoveUnderScore(obj) {
    const removeUnderScore = obj.map(e => ({
      ...e,
      label: e.label.replace(/_/g, ' ')
    }))
    const updatedMenuList = removeUnderScore.map(item => {
      const localStorageValue = localStorage.getItem(item.label)
      if (localStorageValue != null) {
        item.label = localStorageValue
      }
      return item
    })
    return updatedMenuList
  }
  templateListingRemoveUnderScore(obj) {
    const removeUnderScore = obj.map(e => ({
      ...e,
      name: e.name.replace(/_/g, ' '),
      description: e.description.replace(/_/g, ' ')
    }))
    return removeUnderScore
  }
}
