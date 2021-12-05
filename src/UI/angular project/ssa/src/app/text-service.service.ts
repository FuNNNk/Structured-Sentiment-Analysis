import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Wove } from 'aspect-js'

import { TextModel } from './text-model';

@Wove
@Injectable({
  providedIn: 'root'
})
export class TextService {
  private requestUrl = './jsons/texts.json' 
  constructor(private http: HttpClient) {
   }
  
  public getTexts(): Observable<TextModel[]> {
    console.log(this.requestUrl)
    
    return this.http.get<TextModel[]>(this.requestUrl)
    }
}
