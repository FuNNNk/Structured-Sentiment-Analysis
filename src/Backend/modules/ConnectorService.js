const aop = require('../aop')
const fs = require('fs');
const path = require('path');
const AiSentimentConnector = require("./AISentimentConnector")
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

function getAIConnectorStats (file) {
    let filename = file;
    let data = "no data"
    return () => {
        const filePath = path.resolve(__dirname, '../../data-upload-storage/' + filename+"_result")
        fs.readFile(filePath, 'utf8', function(err, d){
            data = d;
        });
        return data;
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