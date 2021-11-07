class OutputDataSender{
    #text;
    constructor(data){
        this.#text = data
    }
    sendText(){
        console.log(this.#text)
        return this.#text;
    }
}
module.exports.OutputDataSender = OutputDataSender