var InputDataProcessing = require("./InputDataProcessing");

class InputDataReceiver{
    #text;
    #textFile;
    #JsonFile;
    inputDataProcessing;

    constructor(text, textFile=0, JsonFile=0){
           this.#text = text;
           this.#textFile = textFile;
           this.#JsonFile = JsonFile;
           let inputDataProcessing = new InputDataProcessing.InputDataProcessing(this.#text);
    };
    getText(){
        if(this.#text != null){
            console.log("Textul este bun:" + this.#text);
            return this.#text;
        }
        else
            console.log("Textul nu este bun");
    };
    async getTextFile(){
        try {
            const response = await fetch(this.#textFile);
            const data = await response.text();
            console.log(data);
            return data
        } catch(err) {
            console.log(err);
            return err;
        }
    };
    async getJsonFile(){
        try {
            const response = await fetch(this.#JsonFile);
            const data = await response.text();
            console.log(data);
            return data
        } catch(err) {
            console.log(err);
            return err;
        }
    };
}

module.exports.InputDataReceiver = InputDataReceiver