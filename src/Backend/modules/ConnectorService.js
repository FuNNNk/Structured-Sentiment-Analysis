const aop = require('../aop')
const fs = require('fs');
const path = require('path');
var idr = require('./InputDataReceiver');
const { FILE } = require('dns');

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

function getAIConnectorStats (file) {
    console.log('\x1b[36m%s\x1b[0m', "Connector service: get AI connector stats");
    let filename = file;
    let data = "no data"
    return () => {
        const filePath = path.resolve(__dirname, '../../data-upload-storage/' + filename.split('.')[0]+'.json')
        console.log('\x1b[36m%s\x1b[0m', filename);
        fs.readFile(filePath, 'utf8', function(err, d){
            data = d;
            console.log('\x1b[36m%s\x1b[0m', 'Connector service: success reading');

        });
        return data;
    }
};

function writeSsaInputRaw(ssaText, fileid) {
    console.log('\x1b[32m%s\x1b[0m','wrinting file with id: ' + fileid );
    const filePath = path.resolve(__dirname, '../../data-upload-storage/' +  fileid + ".txt");
    fs.writeFile(filePath, ssaText, function (err) {
        if (err) return console.log(err);

        console.log('\x1b[32m%s\x1b[0m','succes saved to disk fileid: ' + fileid );
        aop.monitorFileWrite(fileid);
        });
}


function loggingAspect(text){
    console.log("== Calling the logger function ==");
    console.log("Text received: " + text);
}

function printTypeOfData(data){
    console.log("Type of data is: " + typeof(data))
}




module.exports = {
    UIConnector,
    getAIConnectorStats,
    loggingAspect,
    printTypeOfData,
    writeSsaInputRaw
}