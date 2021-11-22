import { Injectable } from '@angular/core';
import {beforeMethod, afterMethod, Metadata} from 'aspect-js';



@Injectable({
  providedIn: 'root'
})

export class LoggingAspect {
  @beforeMethod({
      className: /(Text|User)Service/,
      methodName: /get(Users|Texts)/
  })
  invokeBeforeMethod(meta: Metadata) {
      console.log('Inside the logger: Called ${meta.className) with input args $(meta.methodName)')
  }

  @afterMethod({
      className: /(Text|User)Service/,
      methodName: /get(Users|Texts)/
  })
  invokeAfterMethod(meta: Metadata) {
      console.log('Inside the logger: Called ${meta.className) with output args $(meta.methodName)')
  }

}
