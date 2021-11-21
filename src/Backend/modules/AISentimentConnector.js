const aop = require('../aop')
const AIConnection = require("../monitoring/AIConnection")

function getSentiment(){
    AIConnection.readAIStats("positive")
    return "positive"
}

function readAccuracy(){ //text size accuracy
    AIConnection.readAIStats("100%")
    return "100%"
}

function getTarget(){
    AIConnection.readAIStats("Test Target")
    return "Test Target"
}

function getPositiveWords(){
    AIConnection.readAIStats({"beautiful":1, "nice":4})
    return {"beautiful":1, "nice":4}
}

function getNegativeWords(){
    AIConnection.readAIStats({"ugly":4,"bad":2})
    return {"ugly":4,"bad":2}
}

module.exports = {
    getSentiment,
    readAccuracy,
    getTarget,
    getPositiveWords,
    getNegativeWords
}