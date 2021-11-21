const aop = require('../aop')

function securityMiddleware(req) { 
    aop.monitorHeaders(req.headers);
    return req;
}

function originMiddleware(req) { 
    aop.monitorOrigin(req);
    return req;
}

function middlewareResolver(middleware) { 

    return function(expressHandler){
        return function(req, res){
            middleware(req);
            expressHandler.call(this, req, res);
        }
    } 
}


module.exports = {
    securityMiddleware,
    originMiddleware,
    middlewareResolver
}