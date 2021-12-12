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

        },
        error: function(e) {
           console.log("error: ", e)
        },
    });
};


window.ssa.analise = function (file) {

    $.ajax({
        url: "http://localhost:3000/parse",
        method: 'get',
        data: fd,
        success: function(data){
            console.log("Started sentiment analysis...");
        },
        error: function(e) {
           console.log("error: ", e)
        },
    });
};


