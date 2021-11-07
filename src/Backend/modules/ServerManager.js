var idr = require('./InputDataReceiver')
var ods = require('./OutputDataSender')
var idp = require('./InputDataProcessing')

class ServerManager{
    static #privateInstance = true;

    ServerManager(){
        
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
    AIConnector(){
        return true;
    }
    static getInstance(){
        // inputDataReceiver = new idr.InputDataReceiver();
        // outputDataSender = new ods.OutputDataSender();
        // inputDataProcessing = new idp.InputDataProcessing();
        return this.#privateInstance;
    } // Singleton server
}

module.exports.ServerManager = ServerManager