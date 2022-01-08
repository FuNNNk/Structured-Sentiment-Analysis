const fs = require('fs');
const WordnetUtils = require("./utils");

const opinionAdj = ['properly', 'not'];
const opinionVerb = ['recommend'];
const { exec } = require("child_process");
const settings = require("../../ssa-settings.json");


function getAIExec(){
    return settings['ai-exec'];
}

async function buildSentimentTrainingDataStructure(filename) {
    const aiCmd = getAIExec();
    const dataStorageLocation = "..\\data-upload-storage\\" + filename;
    const aiModuleLocation = "..\\AI\\";
    const execCmd = `${aiCmd} ${dataStorageLocation}`

  exec(`(cd ${aiModuleLocation} && ${execCmd} )`, (error, stdout, stderr) => {
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
}

const Opinion = {
    buildSentimentTrainingDataStructure
}

module.exports = Opinion;