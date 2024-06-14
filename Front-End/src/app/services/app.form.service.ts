/* eslint-disable @typescript-eslint/no-unused-vars */
/*
 * This is app.form.service.ts
 */
// eslint-disable-next-line filenames/match-regex
import {Injectable} from '@angular/core'
import {HttpClient} from '@angular/common/http'
import {Observable} from 'rxjs'
import {Template} from '../models/template.model'
import {Product} from '../models/form.model'
import {environment} from '../../environments/environment'
import {Item} from '../models/item.model'
import {Form} from '../models/getform.model'
import {Menu} from '../models/menu.model'
import {ItemObject} from '../models/itemobject.model'
import {FindItemsOnTray} from '../models/findtrayitems.model'

const baseUrl = environment.baseUrl

@Injectable({
  providedIn: 'root'
})
export class FormService {
  pageNo = 0
  pageSize = 5

  pageNumber = 0
  size = 5

  constructor(private http: HttpClient) {}

  getAll(clientFk: number): Observable<Item[]> {
    return this.http.get<Item[]>(`${baseUrl}/api/items?clientFk=${clientFk}`)
  }

  findAllTemplatesWhichHaveProducts(
    schemaName: string
  ): Observable<Template[]> {
    return this.http.get<Template[]>(
      `${baseUrl}/api/items/templates/productscount/${schemaName}`
    )
  }

  get(id: number): Observable<Template> {
    return this.http.get(`${baseUrl}/api/items/${id}`)
  }

  findAlltemplatesByTrayId(trayId: number): Observable<Template[]> {
    return this.http.get<Template[]>(
      `${baseUrl}/api/items/retreiveTemplatesByTrayId?trayId=${trayId}`
    )
  }

  getById(name: string, id: number): Observable<Template> {
    return this.http.get(`${baseUrl}/api/items/${name}/${id}`)
  }

  create(data: Item): Observable<Item> {
    return this.http.post(`${baseUrl}/api/items`, data)
  }

  saveForm(data: ItemObject): Observable<ItemObject> {
    return this.http.post(`${baseUrl}/api/items`, data)
  }

  update(id: number, data: ItemObject): Observable<ItemObject> {
    return this.http.put(`${baseUrl}/api/items/${id}`, data)
  }

  updateForm(
    id: number,
    name: string,
    data: ItemObject
  ): Observable<ItemObject> {
    return this.http.put(`${baseUrl}/api/items/${id}/${name}`, data)
  }

  createTemplate(
    clientFk: number,
    schemaName: string,
    template: ItemObject
  ): Observable<ItemObject> {
    return this.http.post(
      `${baseUrl}/api/items/createTemplate/${clientFk}/${schemaName}`,
      template
    )
  }

  delete(id: number, name: string, schemaName): Observable<string> {
    let HTTPOptions: Object = {
      responseType: 'text'
    }
    return this.http.delete<string>(
      `${baseUrl}/api/items/${id}/${name}/${schemaName}`,
      HTTPOptions
    )
  }

  deleteAll(): Observable<Item> {
    return this.http.delete(`${baseUrl}/api/items`)
  }

  findByTitle(name: string): Observable<Template[]> {
    return this.http.get<Template[]>(`${baseUrl}/api/items?name=${name}`)
  }

  createForm(
    data: Object,
    tempName: string,
    schemaName: string
  ): Observable<Item> {
    return this.http.post(
      `${baseUrl}/api/form/${schemaName}/?tempName=${tempName}`,
      data
    )
  }

  getAllProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${baseUrl}/api/form`)
  }

  getAllProductsByItemTempId(
    itemTempId: number,
    formName: string,
    schemaName: string,
    page: number,
    size: number
  ): Observable<Product[]> {
    return this.http.get<Product[]>(
      `${baseUrl}/api/form/${schemaName}?itemTempId=${itemTempId}&formName=${formName}&page=${page}&size=${size}`
    )
  }
  findProductsOnTray(
    itemTempId: number,
    trayId: number,
    name: string,
    schemaName: string
  ): Observable<FindItemsOnTray> {
    return this.http.get<FindItemsOnTray>(
      `${baseUrl}/api/form/fetchTrayProducts/${schemaName}?itemTempId=${itemTempId}&formName=${name}&trayId=${trayId}`
    )
  }

  fetchUpperAndLowerLimit(trayItemId: number): Observable<Item> {
    return this.http.get<Item>(`${baseUrl}/api/form/findByForm/${trayItemId}`)
  }

  getFormData(id: number): Observable<Item> {
    return this.http.get(`${baseUrl}/api/form/${id}`)
  }

  getFormDataByName(
    id: number,
    name: string,
    schemaName: string
  ): Observable<Item> {
    return this.http.get(`${baseUrl}/api/form/${id}/${name}/${schemaName}`)
  }

  updateFormData(
    id: string,
    data: Object,
    name: string,
    schemaName: string
  ): Observable<Item> {
    return this.http.put(
      `${baseUrl}/api/form/${id}/${name}/${schemaName}`,
      data
    )
  }

  deleteFormData(
    id: number,
    name: string,
    schemaName: string
  ): Observable<ItemObject> {
    return this.http.delete(`${baseUrl}/api/form/${id}/${name}/${schemaName}`)
  }

  findByFormsName(name: string): Observable<Product[]> {
    return this.http.get<Product[]>(`${baseUrl}/api/form?name=${name}`)
  }

  templateValidation(value: string): Observable<Item[]> {
    return this.http.get<Item[]>(
      `${baseUrl}/api/items/template/validate/${value}`
    )
  }

  getMenyById(templateID: number): Observable<Menu> {
    return this.http.get(
      `${baseUrl}/api/menu/fetchMenu/?templateID=${templateID}`
    )
  }

  fetchAllTemplates(): Observable<Template> {
    return this.http.get(`${baseUrl}/api/form/fetchAllTemplates/`)
  }

  alterTable(
    id: number,
    name: string,
    schemaName: string,
    data: Object,
    menuId: number
  ): Observable<Item> {
    return this.http.put(
      `${baseUrl}/api/items/${id}/${name}/${menuId}/${schemaName}`,
      data
    )
  }

  getTotalItemsOnStore(
    itemTempId: number,
    formName: string,
    schemaName: string
  ): Observable<Product[]> {
    return this.http.get<Product[]>(
      `${baseUrl}/api/form/totalItems/${schemaName}?itemTempId=${itemTempId}&formName=${formName}`
    )
  }

  getAllProductsByItemTempIdpagination(
    itemTempId: number,
    formName: string,
    schemaName: string,
    pageNo: number,
    pageSize: number
  ): Observable<Product[]> {
    return this.http.get<Product[]>(
      `${baseUrl}/api/form/${schemaName}?itemTempId=${itemTempId}&formName=${formName}&page=${pageNo}&size=${pageSize}`
    )
  }
}
