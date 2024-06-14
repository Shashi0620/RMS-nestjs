/*
 * This is upload-files.service.ts
 */
import {Injectable} from '@angular/core'
import {HttpClient, HttpEvent, HttpRequest} from '@angular/common/http'
import {Observable} from 'rxjs'
import {environment} from '../../environments/environment'
import {FileImg} from '../models/fileimg.model'
import {ImgFile} from '../models/imgfile.model'
@Injectable({
  providedIn: 'root'
})
export class UploadFilesService {
  private baseUrl = environment.baseUrl

  constructor(private http: HttpClient) {}

  upload(file: File): Observable<HttpEvent<FormData>> {
    const formData: FormData = new FormData()

    formData.append('image', file)

    const req = new HttpRequest('POST', `${this.baseUrl}/api/files`, formData, {
      reportProgress: true,
      responseType: 'json'
    })

    return this.http.request(req)
  }

  public trayupload(
    file: File,
    rackId: number,
    trayId: number
  ): Observable<HttpEvent<FormData>> {
    const formData: FormData = new FormData()

    formData.append('image', file)

    const req = new HttpRequest(
      'POST',
      `${this.baseUrl}/api/files/trayFile/${rackId}/${trayId}`,
      formData,
      {
        reportProgress: true,
        responseType: 'json'
      }
    )

    return this.http.request(req)
  }

  getFiles(): Observable<FileImg> {
    return this.http.get(`${this.baseUrl}/files`)
  }

  createFile(file: FileImg): Observable<FileImg> {
    return this.http.post(`${this.baseUrl}/api/file`, file)
  }

  createTrayFile(file: FileImg): Observable<FileImg> {
    return this.http.post(`${this.baseUrl}/api/file/trayfile`, file)
  }

  //display file
  fetchFile(user_fk: number): Observable<FileImg> {
    return this.http.get(`${this.baseUrl}/api/file/fetchFileById/${user_fk}`)
  }

  fetchTrayFile(tray_fk: number): Observable<ImgFile[]> {
    return this.http.get<ImgFile[]>(
      `${this.baseUrl}/api/file/fetchTrayFile/${tray_fk}`
    )
  }

  updateFile(id: number, file: FileImg): Observable<FileImg> {
    return this.http.put(`${this.baseUrl}/api/file/updateFile/${id}`, file)
  }

  updateTrayByFile(tray_fk: number, file: FileImg): Observable<FileImg> {
    return this.http.put(
      `${this.baseUrl}/api/file/updateTrayByFile/${tray_fk}`,
      file
    )
  }

  fetchAllFiles(): Observable<FileImg[]> {
    return this.http.get<FileImg[]>(`${this.baseUrl}/api/files/files/profile`)
  }

  fetchAllTrayFiles(): Observable<FileImg[]> {
    return this.http.get<FileImg[]>(`${this.baseUrl}/api/files/files/profile`)
  }

  fetchImageByName(name: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/files/profile/${name}`)
  }
}
