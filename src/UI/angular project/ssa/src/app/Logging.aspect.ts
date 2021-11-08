import {Injectable} from '@angular/core'
import {beforeMethod, afterMethod, Metadata} from 'aspect.js/dist/lib/aspect'
@Injectable()

export class LoggingAspect {
    @beforeMethod({
        className: /UserService/
        methodName: /get/
    })
    invokeBeforeMethod(meta: Metadata) {
        console.log('Inside the logger: Called ${meta.className) with input args $(meta.methodName)')
    }

    @afterMethod({
        className: /UserService/
        methodName: /get/
    })
    invokeAfterMethod(meta: Metadata) {
        console.log('Inside the logger: Called ${meta.className) with output args $(meta.methodName)')
    }

}

