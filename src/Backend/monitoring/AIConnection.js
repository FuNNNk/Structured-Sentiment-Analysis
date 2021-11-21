const aop = require('../aop')

function readAIStats(req) {
        aop.monitorAIConnection(req)
    }    


module.exports = {
    readAIStats 
}