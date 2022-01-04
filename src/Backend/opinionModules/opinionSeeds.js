const fs = require('fs');
const WordnetUtils = require("./utils");

const opinionAdj = ['properly', 'not'];
const opinionVerb = ['recommend'];
const { exec } = require("child_process");


async function buildSentimentTrainingDataStructure(filename) {
  
  exec("(cd ..\\AI\\ && python main.py -nn -predict ..\\data-upload-storage\\" + filename + " )", (error, stdout, stderr) => {
      if (error) {
          console.log(`error: ${error.message}`);
          return;
      }
      if (stderr) {
          console.log(`stderr: ${stderr}`);
          return;
      }
      console.log(`stdout: ${stdout}`);
  });
    // fs.writeFile('./ssa-training.json', JSON.stringify(rezData), function (err) {
    //     if (err) return console.log(err);
    //     console.log('salvare date > ssa-training.txt');
    //   });

    // return rezData;
}

const Opinion = {
    buildSentimentTrainingDataStructure
}

module.exports = Opinion;