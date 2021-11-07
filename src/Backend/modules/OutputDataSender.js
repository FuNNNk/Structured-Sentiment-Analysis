class OutputDataSender{
    #text;
    #textFile;
    #sJsonFile;
    OutputDataSender(){};
    sendText(text){
        return true;
    };
    sendTextFile(textFile){
        return true;
    };
    sendJsonFile(JsonFile){
        return true;
    };
}

module.exports.OutputDataSender = OutputDataSender