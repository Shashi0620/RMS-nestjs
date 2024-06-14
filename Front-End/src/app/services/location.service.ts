import {Injectable} from '@angular/core'
import {HttpClient, HttpHeaders} from '@angular/common/http'
import {Observable} from 'rxjs'

@Injectable({
  providedIn: 'root'
})
export class LocationService {
  constructor(private httpClient: HttpClient) {}

  getLocations(): Observable<any> {
    const url = 'https://api.openai.com/v1/chat/completions'
    const httpHeaders = new HttpHeaders().set(
      'Authorization',
      'Bearer "API KEY" '
    )
    const payload = {
      model: 'gpt-3.5-turbo',
      messages: [{role: 'system', content: 'You are a helpful assistant.'}]
    }

    return this.httpClient.post(url, payload, {headers: httpHeaders})
  }
}
