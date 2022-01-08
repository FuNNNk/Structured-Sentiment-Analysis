const { exec } = require("child_process");


for (let i = 0; i<=20; i++){
    setTimeout(() => {console.log("Client" + i)}, 2000);
    exec(`start http://127.0.0.1:8081/WebApp/`, (error, stdout, stderr) => {
        if (error) {
            console.log(`error: ${error.message}`);
            return;
        }
        if (stderr) {
            console.log(`stderr: ${stderr}`);
            return;
        }
        
    });
}