const fs = require('fs');
const WordnetUtils = require("./utils");

const opinionAdj = ['properly', 'not'];
const opinionVerb = ['recommend'];


async function buildSentimentTrainingDataStructure(prop) {
    const adjs = prop.filter(e => e.type == 'adj');
    const verbs = prop.filter(e => e.type == 'verb');

    console.log("Build Sentiment TrainingData Structure: ");
    console.log(adjs);
    const opinionAdj = adjs[0].word;
    const opinionVerb = verbs[0].word;

    const synsOpAdj = await WordnetUtils.lookupSyns(opinionAdj);
    const synsOpVerb = await WordnetUtils.lookupSyns(opinionVerb);

    const rezData = {
        "Target": "",
        "source": "",
        "Polar_expression": [adjs.word, verbs.word],
        "syns": [synsOpAdj, synsOpVerb]
      }

    fs.writeFile('./ssa-training.json', JSON.stringify(rezData), function (err) {
        if (err) return console.log(err);
        console.log('salvare date > ssa-training.txt');
      });

    return rezData;
}

const Opinion = {
    buildSentimentTrainingDataStructure
}

module.exports = Opinion;