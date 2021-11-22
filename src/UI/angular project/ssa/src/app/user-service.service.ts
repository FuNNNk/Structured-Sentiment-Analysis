import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { Wove } from 'aspect-js'
import { map } from 'rxjs/operators';
import { User } from './User.model';
import { promise } from 'selenium-webdriver';
@Wove
@Injectable({
  providedIn: 'root'
})
export class UserService {
  private requestUrl = './jsons/users.json' 
  constructor(private http: HttpClient) {
   }
  
  public getUsers(): Observable<User[]> {
    console.log(this.requestUrl)
    // console.log(this.http.get<User[]>(requestUrl))
    // return this.http.get(requestUrl).map((jsonResponse) => <User[]>jsonResponse.json())
    return this.http.get<User[]>(this.requestUrl)
    // .pipe(
    //   map((users: User[]) => users.map(user => user.name)))
      // this.getClients.pipe(
      //   map((clients: Client[]) => clients.map(client => client.address))
    }
}
