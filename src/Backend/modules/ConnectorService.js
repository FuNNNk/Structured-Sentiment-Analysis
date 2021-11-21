const aop = require('../aop')
var idr = require('./InputDataReceiver')
var ods = require('./OutputDataSender')
var idp = require('./InputDataProcessing')

function UIConnector (text) {
    let inputDataReceiver = new idr.InputDataReceiver(text);
    aop.inject(inputDataReceiver, loggingAspect,"before","methods");
    aop.inject(inputDataReceiver, printTypeOfData,"afterReturning","methods");
    if(typeof(text) === 'string')
        var data = inputDataReceiver.getText();
    else if(text instanceof File)
        if(text.split('.').pop() == 'json')
            var data = inputDataReceiver.getJsonFile();
        else
            var data = inputDataReceiver.getTextFile();
}

function setAIConnector (text) {
    let outputDataSender = new ods.OutputDataSender(text);
    outputDataSender.sendText();
}

function getAIConnectorStats () {
    // TODO aop.monitorAIconnection()
    const modelStat={
        "sentiment": "", // AiSentimentConnector.getSentiment(), //"positive" | "negative"
        "target": "",
        "accuracy": "", // AiSentimentConnector.readAccuracy(), //  monitorin pt text size 
        "positive-words": {"beautiful": 5, "nice": 3, love:1},
        "negative-words": {"hate": 5, "ugly": 3, bad:1}
    }

    return { 
        data: modelStat,
        info: "empty"
    }
};


function loggingAspect(text){
    console.log("== Calling the logger function ==");
    console.log("Text received: " + text);
}

function printTypeOfData(data){
    console.log("Type of data is: " + typeof(data))
}




module.exports = {
    UIConnector,
    setAIConnector,
    getAIConnectorStats,
    loggingAspect,
    printTypeOfData
}