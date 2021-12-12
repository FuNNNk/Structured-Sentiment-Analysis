window.ssa = {};

window.ssa.uploadFile = function (file) {

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
            window.ssa.analise();
            poolingResults();
        },
        error: function(e) {
           console.log("error: ", e)
        },
    });
};


window.ssa.analise = function (file) {

    $.ajax({
        url: "http://localhost:3000/parser",
        method: 'get',
        success: function(data){
            console.log("Started sentiment analysis...");
        },
        error: function(e) {
           console.log("error: ", e)
        },
    });
};

function poolingResults() {
    $.ajax({
    url: "http://localhost:3000/stats",
    success: function(data){
        console.log(data); 

        const sentimentResults = JSON.stringify(data, null, '\t');
        $("#rezultate").text(sentimentResults);
        poolingResults();
    },
    error: function() {
        poolingResults();
    },
    timeout: 17000
    });
};


