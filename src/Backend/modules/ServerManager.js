

var express = require('express');
const path = require('path');
const fileUpload = require('express-fileupload');
const aop = require('../aop')

const ConnectorService = require("./ConnectorService");
const SecurityMiddleware = require("../monitoring/SecurityMiddleware");

const { securityMiddleware, originMiddleware, middlewareResolver } = SecurityMiddleware;

const pipe = (...fns) => (x) => fns.reduce((v, f) => f(v), x);

const middleware = middlewareResolver(pipe(securityMiddleware, originMiddleware));

class ServerManager{

    static startInstance(){

        var app = express();

        app.use(fileUpload());

         /** POST */
        app.post('/uiconnector', middleware(
            function (req, res) {
                let sampleFile;
                let uploadPath;
              
                if (!req.files || Object.keys(req.files).length === 0) {
                  return res.status(400).send('No files were uploaded.');
                }
                sampleFile = req.files.sample;
                uploadPath = path.resolve(__dirname, '../../data-upload-storage/' + sampleFile.name);
                
                aop.monitorFileUpload(sampleFile);

                sampleFile.mv(uploadPath, function(err) {
                  if (err) {
                    res.status(500).send(err);
                    throw new Error("eroare la incarcarea fisierului.")
                  }
                });
                // @TODO move code in ConnectorService
                // ConnectorService.setAIConnector();
                res.send('File uploaded!');
            }
        ));

        /** GET */
        app.get('/uiconnector', middleware(
            function (req, res) {
                // @TODO read from ConnectorService
                // ConnectorService.getAIConnectorData(); // read the AI output from localdb
                res.send('Test:  read the AI output from localdb');
            }
        ));

        app.get('/stats', middleware(
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