class InputDataProcessing{
    #text;
    constructor(text){
        this.#text = text;
    }
    transformText(text){
        return this.#text;
    }
}


module.exports.InputDataProcessing = InputDataProcessing