

var express = require('express');
const path = require('path');
const fileUpload = require('express-fileupload');
const aop = require('../aop')
const cors = require('cors')
const uuid = require('uuid')
const bodyParser = require("body-parser");;

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
        app.use(bodyParser.json());
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

                res.send('File uploaded!');
            }
        ));

        /** post */
        app.post('/uiconnector/raw', middleware(
            function (req, res) {
                if (!req.body.ssatext || Object.keys(req.body.ssatext).length === 0) {
                    return res.status(400).send('Input can\'t be empty.');
                }

                if (!req.body.fileid || Object.keys(req.body.fileid).length === 0) {
                    return res.status(400).send('fileid can\'t be empty.');
                }

                ConnectorService.writeSsaInputRaw(req.body.ssatext + ' ', req.body.fileid);
                res.send('processing');
            }
        ));


        app.get('/parser', middleware(
            function (req, res) {
                console.log('\x1b[32m%s\x1b[0m','calling ai parser for fileid: ' + req.query.filename);
                const rez = OpinionModule.buildSentimentTrainingDataStructure(req.query.filename);
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
            console.log('\x1b[32m%s\x1b[0m','STATS: setting store file: ' + req.query.filename);

            ServerManager.store.file = req.query.filename;
            next();
        });
        
        setInterval( function () {
            if (resultsReaderFn){
                console.log('\x1b[32m%s\x1b[0m','STATS: reading ssa results:');
                const stats = resultsReaderFn();
                console.log(stats)
                longpoll.publish("/stats", stats);
            } else {
                longpoll.publish("/stats", {"mesage": "Fisierul incarat se prelucreaza."});
                console.log("Fisierul incarat nu a fost detectat.")
            }
        }, 17000);


        app.listen(3000, function () {
            console.log('Example app listening on port 3000!');
        });
        
    } // Singleton server
}

module.exports.ServerManager = ServerManager