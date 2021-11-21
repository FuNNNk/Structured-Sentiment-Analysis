/** Helping function used to get all methods of an object */
const config = require("./config");

const getMethods = (obj) => Object.getOwnPropertyNames(Object.getPrototypeOf(obj)).filter(item => typeof obj[item] === 'function')

/** Replace the original method with a custom function that will call our aspect when the advice dictates */
function replaceMethod(target, methodName, aspect, advice) {
    const originalCode = target[methodName]
    target[methodName] = (...args) => {
        if(["before", "around"].includes(advice)) {
            aspect.apply(target, args)
        }
        const returnedValue = originalCode.apply(target, args)
        if(["after", "around"].includes(advice)) {
            aspect.apply(target, args)
        }
        if("afterReturning" == advice) {
            return aspect.apply(target, [returnedValue])
        } else {
            return returnedValue
        }
    }
}

module.exports = {
    //Main method exported: inject the aspect on our target when and where we need to
    inject: function(target, aspect, advice, pointcut, method = null) {
        if(pointcut == "method") {
            if(method != null) {
                replaceMethod(target, method, aspect, advice)    
            } else {
                throw new Error("Tryin to add an aspect to a method, but no method specified")
            }
        }
        if(pointcut == "methods") {
            const methods = getMethods(target)
            methods.forEach( m => {
                replaceMethod(target, m, aspect, advice)
            })
        }
    },

    monitorHeaders(headers){
        if (config.securityMiddleware) {
            console.log("Middleware headers log: \n", JSON.stringify(headers),"\n");
        } 
    },

    monitorOrigin(req){
        if (config.originMiddleware) {
            console.log("Middleware path log: ", JSON.stringify(req.originalUrl));
            console.log("url: ", req.url);
            console.log("method: ", req.method,"\n");
        }
    },

    monitorAIConnection(data){
        if(config.AIConnection) {
            console.log("AI Connection:", JSON.stringify(data));
        }
    },

    monitorFileUpload(file){
        if (config.trainingDataUpload) {
            console.log("Middleware data-upload log:");
            console.log("file name: ", file.name);
            console.log("file size: ", file.size);
            console.log("file md5: ", file.md5);
            console.log("file mimetype: ", file.mimetype,"\n");
        } 
    },
    
}