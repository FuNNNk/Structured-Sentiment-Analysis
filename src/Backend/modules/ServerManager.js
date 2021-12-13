

var express = require('express');
const path = require('path');
const fileUpload = require('express-fileupload');
const aop = require('../aop')
const cors = require('cors')

var expressPooling = require("express-longpoll")

const ConnectorService = require("./ConnectorService");
const SecurityMiddleware = require("../monitoring/SecurityMiddleware");

const OpinionModule = require("../opinionModules/opinionSeeds");


const { securityMiddleware, originMiddleware, middlewareResolver } = SecurityMiddleware;

const pipe = (...fns) => (x) => fns.reduce((v, f) => f(v), x);

const middleware = middlewareResolver(pipe(securityMiddleware, originMiddleware));

class ServerManager{

    static store = {
        file: "",
    };

    static startInstance(){

        var app = express();
        app.use(cors())

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


        app.get('/parser', middleware(
            function (req, res) {
                const input = "Even though the price is decent for Paris, I would not recommend this hotel ."
                const posInput = input.split(" ").map(w => {
                    if (w=="decent") {
                        return {word: w, type: 'adj'};
                    } else if (w=="recommend") {
                        return {word: w, type: 'verb'};
                    }
                    return {word: w, type: 'noun'};
                });
                console.log(posInput);

                const rez = OpinionModule.buildSentimentTrainingDataStructure(posInput);
                res.send("Datele au fost salvate > ssa-training.txt");
            }
            
        ));

        const longpoll = expressPooling(app);
        let resultsReaderFn = null;
       
       
        longpoll.create("/stats", (req, res, next)=>{
            if (!resultsReaderFn) {
                resultsReaderFn = ConnectorService.getAIConnectorStats(req.query.filename)
            }
            // initializeaza un reader pentru un fisier nou
            if ( ServerManager.store.file != req.query.filename) {
                resultsReaderFn = ConnectorService.getAIConnectorStats(req.query.filename);
            }

            ServerManager.store.file = req.query.filename;
            next();
        });
        
        setInterval( function () {
            const stats = resultsReaderFn();
           longpoll.publish("/stats", stats);
        }, 17000);


        app.listen(3000, function () {
            console.log('Example app listening on port 3000!');
        });
        
    } // Singleton server
}

module.exports.ServerManager = ServerManager