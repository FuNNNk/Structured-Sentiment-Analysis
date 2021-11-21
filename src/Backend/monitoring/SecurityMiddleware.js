const aop = require('../aop')

function readHeadersMiddleware(expressHandler) {
    return function(req, res){
        aop.monitorHeaders(req.headers)
        expressHandler.call(this, req, res);
    }    

}


module.exports = {
    readHeadersMiddleware 
}