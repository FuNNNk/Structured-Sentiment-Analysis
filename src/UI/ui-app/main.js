

$(document).ready(function(){



    $("#ssa-file-upload-btn").click((e)=>{
       let file = $("#ssa-file-upload").prop('files')[0];
        window.ssa.uploadFile(file);
       
    });

    $("#ssa-file-upload").change((e)=>{
        var fileName = e.target.files[0].name;
        $("#file-name").text("Fisier selectat: " + fileName);
    });


})



