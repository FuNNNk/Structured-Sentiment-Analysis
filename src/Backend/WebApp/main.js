

$(document).ready(function(){

    window.ssa.loader("stop");

    $("#ssa-file-upload-btn").click((e)=>{
       let file = $("#ssa-file-upload").prop('files')[0];
        window.ssa.loader("start");
        const fisierBlob = $("#ssa-file-upload")[0].files[0];
        if (fisierBlob){
            window.ssa.uploadFile(file, fisierBlob.name);
        } else {
            $("#file-name").text("Eroare: Selecteaza un fisier");
            $("#file-name").addClass("eroare")
            window.ssa.uploadFile(file, null);
        }
       
    });

    $("#ssa-file-upload").change((e)=>{
        var fileName = e.target.files[0].name;
        $("#file-name").removeClass("eroare")
        $("#file-name").text("Fisier selectat: " + fileName);
    });


})



