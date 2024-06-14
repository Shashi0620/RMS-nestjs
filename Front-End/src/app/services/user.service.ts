/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-useless-concat */
/*
 * This is user.service.ts
 */
import {Injectable} from '@angular/core'
import {HttpClient, HttpEvent, HttpRequest} from '@angular/common/http'
import {Observable} from 'rxjs'
import {environment} from '../../environments/environment'
import {User} from '../models/user.model'
import {Staff} from '../models/staff.model'
import {Plan} from '../models/plan.model'
import {Notification} from '../models/notification.model'
import {Client} from '../models/client.model'
import {Role} from '../models/role.model'
import {Elasticsearch} from '../models/eslaticSearch.model'
import {Support} from '../models/support.model'
import {Faq} from '../components/faq-component/faq-component'
import {Router} from '@angular/router'
const baseUrl = environment.baseUrl

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private http: HttpClient, private router: Router) {}

  create(data: User): Observable<User> {
    return this.http.post(`${baseUrl}/api/user`, data)
  }

  async loginAuth(data: User): Promise<any> {
    return await this.http
      .post(`${baseUrl}/api/user/auth` + `/login`, data)
      .toPromise()
  }

  async login(data: User): Promise<User> {
    return await this.http
      .post<User>(`${baseUrl}/api/user` + `/login`, data)
      .toPromise()
  }

  createClient(data: Client): Observable<Client> {
    return this.http.post(`${baseUrl}/api/user` + `/client`, data)
  }

  resetPassword(data: User): Observable<User> {
    return this.http.post(`${baseUrl}/api/user/client/resetPassword`, data)
  }

  backendValidation(value: string, type: string): Observable<User[]> {
    return this.http.get<User[]>(
      `${baseUrl}/api/user/client/validation/${value}/${type}`
    )
  }

  saveClientStaff(clientName: string, data: Staff): Observable<Staff> {
    return this.http.post(
      `${baseUrl}/api/user/client/staff/save/${clientName}`,
      data
    )
  }

  getStaffRole(): Observable<Staff> {
    return this.http.get(`${baseUrl}/api/user/client/staff/role`)
  }

  getClientStaffList(clientFk: number, roleId: number): Observable<User[]> {
    return this.http.get<User[]>(
      `${baseUrl}/api/user/client/staff?clientFk=${clientFk}&roleId=${roleId}`
    )
  }

  getClientName(clientFk: number): Observable<Client> {
    return this.http.get(`${baseUrl}/api/user/client/name?clientFk=${clientFk}`)
  }

  get(id: number): Observable<any> {
    return this.http.get(`${baseUrl}/api/user/client/staff/${id}`)
  }

  updateClientStaff(id: number, data: Staff): Observable<Staff> {
    return this.http.put(`${baseUrl}/api/user/client/staff/update/${id}`, data)
  }

  delete(id: number): Observable<string> {
    let HTTPOptions: Object = {
      responseType: 'text'
    }
    return this.http.delete<string>(
      `${baseUrl}/api/user/client/staff/delete/${id}`,
      HTTPOptions
    )
  }

  getPlansList(): Observable<Plan[]> {
    return this.http.get<Plan[]>(`${baseUrl}/api/user/client/plans`)
  }

  getRoleNameByID(roleId: number): Observable<Role[]> {
    return this.http.get<Role[]>(`${baseUrl}/api/user/role?roleId=${roleId}`)
  }

  async getPlanByID(planId: number): Promise<Plan[]> {
    return await this.http
      .get<Plan[]>(`${baseUrl}/api/user/plan/getPlan?planId=${planId}`)
      .toPromise()
  }

  async getClientList(clientId: number): Promise<Client> {
    return await this.http
      .get(`${baseUrl}/api/user/client/fetchdata/${clientId}`)
      .toPromise()
  }

  fetchNotificationByUserFk(userFk: number): Observable<Notification> {
    return this.http.get(
      `${baseUrl}/api/notification/fetchNotificationByUserFk/${userFk}`
    )
  }

  saveData(data, username: string) {
    return this.http.post(`${baseUrl}/api/user/translateData/${username}`, data)
  }
  getAllMenuData(username: string): Observable<any> {
    return this.http.get(`${baseUrl}/api/user/getData/${username}`)
  }

  updateUserElasticSearchUrl(
    userPk: number,
    elasticSearch: Elasticsearch
  ): Observable<Elasticsearch> {
    return this.http.put<Elasticsearch>(
      `${baseUrl}/api/user/updateUserElasticSearchUrl/${userPk}`,
      elasticSearch
    )
  }

  fetchNotificationByEmail(email: string): Observable<Notification[]> {
    return this.http.get<Notification[]>(
      `${baseUrl}/api/notification/fetchNotificationByEmail/${email}`
    )
  }

  fetchNotificationById(id: string): Observable<any> {
    let HTTPOptions: Object = {
      responseType: 'HTML'
    }
    return this.http.get<any>(`${baseUrl}/api/user/${id}`, HTTPOptions)
  }

  updateNewNotificationToOld(
    notificationIDs: number[]
  ): Observable<Notification[]> {
    const ids: number[] = notificationIDs
    return this.http.put<Notification[]>(
      `${baseUrl}/api/notification/updateNewNotificationToOld/${ids}`,
      null
    )
  }

  fetchNotificationByStoreId(userFk: number): Observable<Notification[]> {
    return this.http.get<Notification[]>(
      `${baseUrl}/api/notification/fetchNotificationByuserFk/${userFk}`
    )
  }

  fetchDescription(title: string): Observable<Support> {
    return this.http.get<Support>(`${baseUrl}/api/support/${title}`)
  }

  contactUs(data: any): Observable<any> {
    return this.http.post(`${baseUrl}/api/user` + `/contactus`, data)
  }

  uploadContactUsAttachment(file: File): Observable<HttpEvent<FormData>> {
    const formData: FormData = new FormData()

    formData.append('image', file)

    const req = new HttpRequest(
      'POST',
      `${baseUrl}/api/user/contactusAttachment`,
      formData,
      {
        reportProgress: true,
        responseType: 'json'
      }
    )

    return this.http.request(req)
  }

  userActivation(clientFk: number, userId: number): Observable<any> {
    return this.http.get(
      `${baseUrl}/api/user` + `/activation/${clientFk}/${userId}`
    )
  }

  selectPackages(): Observable<{}> {
    return this.http.get(`${baseUrl}/api/user/trail/packages`)
  }

  fetchFaqData(): Observable<any> {
    return this.http.get<any>(`${baseUrl}/api/user/faq/data`)
  }

  changePage(path: string, component: string): void {
    this.router
      .navigateByUrl(`/${path}`, {skipLocationChange: true})
      .then(() => {
        this.router.navigate([`${component}`])
      })
  }
}
