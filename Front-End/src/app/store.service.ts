/*
 * This is store.service.ts
 */
import {HttpClient} from '@angular/common/http'
import {Injectable} from '@angular/core'
import {Observable} from 'rxjs'
import {environment} from '../environments/environment'
import {Store} from './models/store.model'
const baseUrl = environment.baseUrl
@Injectable({
  providedIn: 'root'
})
export class StoreService {
  constructor(private http: HttpClient) {}

  getStoreById(storeId: number): Observable<Store> {
    return this.http.get(`${baseUrl}/api/store/fetchStoreById/${storeId}`)
  }
  fetchAllStoresByClientFK(client_fk: number): Observable<Store[]> {
    return this.http.get<Store[]>(
      `${baseUrl}/api/store/fetchAllStoresByClientFK/${client_fk}`
    )
  }
  fetchAllStoresByStoreName(
    client_fk: number,
    storeName: string
  ): Observable<Store[]> {
    return this.http.get<Store[]>(
      `${baseUrl}/api/store/fetchStoreByStoreName/${client_fk}/${storeName}`
    )
  }

  deleteStoreById(storeId: number): Observable<string> {
    let HTTPOptions: Object = {
      responseType: 'text'
    }
    return this.http.delete<string>(
      `${baseUrl}/api/store/${storeId}`,
      HTTPOptions
    )
  }

  createStore(store: Store): Observable<Store> {
    return this.http.post(`${baseUrl}/api/store/createStore`, store)
  }

  updateStore(storeId: number, store: Store): Observable<Store> {
    return this.http.put<Store>(
      `${baseUrl}/api/store/updateById/` + `${storeId}`,
      store
    )
  }
}
