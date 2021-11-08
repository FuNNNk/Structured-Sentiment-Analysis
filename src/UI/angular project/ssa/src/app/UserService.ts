import {Injectable} from '@angular/core'
import {Http} from '@angular/Http';
import {Observable} from 'rxjs/Observable';
import 'rxjs/Rx'
import {User} from './User.model'

export class UserService {
    private identifier: string = 'users'
    constructor(private http: Http) {}
    protected BuildUrl(): string {
        return '${this.identifier}/users.json'
    }
    public getUsers(): Observable<User[]> {
        let requestUrl = this.BuildUrl()
        console.log(`requestUrl:$(requestUrl)`)
        return this.http.get(requestUrl)
            .map((jsonResponse) => <User[]>jsonResponse.json())
    }

}