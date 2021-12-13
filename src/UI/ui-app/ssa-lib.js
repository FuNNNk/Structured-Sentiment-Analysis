window.ssa = {};

window.ssa.uploadFile = function (file, filename) {

    let fd = new FormData();
    fd.append('sample', file);

    $.ajax({
        url: "http://localhost:3000/uiconnector",
        method: 'post',
        data: fd,
        processData: false,
        contentType: false,
        success: function(data){
            console.log("uploaded", data);
            window.ssa.analise(filename);
            poolingResults();
        },
        error: function(e) {
           console.log("error: ", e)
        },
    });
};


window.ssa.analise = function (filename) {

    $.ajax({
        url: "http://localhost:3000/parser",
        method: 'get',
        data: {filename: filename},
        success: function(data){
            console.log("Started sentiment analysis...");
        },
        error: function(e) {
           console.log("error: ", e)
        },
    });
};


window.ssa.loader = function (state) {
    if(!state){
        $("#spinner").hide();
        return;
    }

    if(state == "stop"){
        $("#spinner").hide();
    }

    if(state == "start"){
        $("#spinner").show();
    }
    
    
};

function poolingResults() {
    const tm = setTimeout(()=>{
        window.ssa.loader("start");
    }, 5000);
    
    $.ajax({
    url: "http://localhost:3000/stats",
    success: function(data){

        const sentimentResults = JSON.stringify(data, null, '\t');
        $("#rezultate").text(sentimentResults);
        window.ssa.loader("stop");
        poolingResults();

    },
    error: function() {
        poolingResults();
    },
    timeout: 17000
    });
};


