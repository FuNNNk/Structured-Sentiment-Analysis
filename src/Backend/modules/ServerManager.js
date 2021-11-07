var idr = require('./InputDataReceiver')
var ods = require('./OutputDataSender')
var idp = require('./InputDataProcessing')
const aop = require('../aop')

class ServerManager{
    static #privateInstance = true;

    constructor(){
        
        const http = require('http');

        const hostname = '127.0.0.1';
        const port = 3000;

        const server = http.createServer((req, res) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/plain');
        res.end('Hello World');
        });

        server.listen(port, hostname, () => {
            console.log(`Server running at http://${hostname}:${port}/`);
        });

    }

    UIConnector(text){
        let inputDataReceiver = new idr.InputDataReceiver(text);
        aop.inject(inputDataReceiver, this.loggingAspect,"before","methods");
        aop.inject(inputDataReceiver, this.printTypeOfData,"afterReturning","methods");
        if(typeof(text) === 'string')
            var data = inputDataReceiver.getText();
        else if(text instanceof File)
            if(text.split('.').pop() == 'json')
                var data = inputDataReceiver.getJsonFile();
            else
                var data = inputDataReceiver.getTextFile();
    }

    AIConnector(text){
        let outputDataSender = new ods.OutputDataSender(text);
        outputDataSender.sendText();
    }
    static getInstance(){
        
        return this.#privateInstance;
    } // Singleton server

    loggingAspect(text){
        console.log("== Calling the logger function ==");
        console.log("Text received: " + text);
    }

    printTypeOfData(data){
        console.log("Type of data is: " + typeof(data))
    }
}

module.exports.ServerManager = ServerManager