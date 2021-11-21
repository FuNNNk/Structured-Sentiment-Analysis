

var express = require('express')

const ConnectorService = require("./ConnectorService");
const SecurityMiddleware = require("../monitoring/SecurityMiddleware");


class ServerManager{

    static startInstance(){

        var app = express();

        app.get('/', function (req, res) {
            res.send('hello world. Test');
        });

         /** POST */
        app.post('/uiconnector', function (req, res) {
            console.log(req.body);
            // fiser atasat pe request (postman)

            // pentru partea de monitoring 
            // size, file type, (txt, pdf, json) ext, date
            // monitoring pt security: headers, origin, params

            // write data to disk/db for ai module to read from

            // ConnectorService.setAIConnector();
            res.send('hello world. Test');
        });

        /** GET */
        app.get('/uiconnector', function (req, res) {
           
            // fiser atasat pe request (postman)

            // pentru partea de monitoring 
            // size, file type, (txt, pdf, json) ext, date
            // monitoring pt security: headers, origin, params

            // ConnectorService.getAIConnectorData(); // read the AI output from localdb

            res.send('Test:  read the AI output from localdb');
        });

        app.get('/stats', SecurityMiddleware.readHeadersMiddleware(
            function (req, res) {
                const stats = ConnectorService.getAIConnectorStats();
                res.send(stats);
            }
        ));

        app.listen(3000, function () {
            console.log('Example app listening on port 3000!');
        });
        
    } // Singleton server
}

module.exports.ServerManager = ServerManager