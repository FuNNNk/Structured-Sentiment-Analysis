const wndb = require('wordnet-db');
const WordNet = require("node-wordnet");

const wordnet = new WordNet({ dataDir: "C:\\Users\\bvolo\\snn-taip\\src\\Backend\\node_modules\\wordnet-db\\dict" });


async function lookupSyns(opinionAdj) {

   return new Promise((resolve, reject)=> {
        wordnet.lookupAsync(opinionAdj).then(function (results) {
            console.log('Sinonime pt adj: ' + opinionAdj);

            const synList = results.reduce((acc, result) => {
                if (result.synonyms) {
                    result.synonyms.forEach(e => {
                        if (!acc.includes(e)) {
                            acc.push(e);
                        }
                    });
                }
                return acc;
            }, []);

            console.log(synList);
            resolve(synList);
        });
    });
}

module.exports = {
    lookupSyns
}