

$(document).ready(function(){

    window.ssa.loader("stop");

    $("#ssa-file-upload-btn").click((e)=>{
       let file = $("#ssa-file-upload").prop('files')[0];
        window.ssa.loader("start");
        window.ssa.uploadFile(file, $("#ssa-file-upload")[0].files[0].name);
       
    });

    $("#ssa-file-upload").change((e)=>{
        var fileName = e.target.files[0].name;
        $("#file-name").text("Fisier selectat: " + fileName);
    });


})



