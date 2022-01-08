

$(document).ready(function(){

    window.ssa.loader("stop");

    $("#ssa-file-upload-btn").click((e)=>{
       let file = $("#ssa-file-upload").prop('files')[0];
        window.ssa.loader("start");
        const fisierBlob = $("#ssa-file-upload")[0].files[0];
        if (fisierBlob){
            window.ssa.uploadFile(file, fisierBlob.name);
        } else {
            $("#file-name").text("Error: Select a file");
            $("#file-name").addClass("eroare")
            window.ssa.uploadFile(file, null);
        }
       
    });

    $("#ssa-text-upload-btn").click((e)=>{
        const fileid = (""+Math.random(10)).split(".")[1]
        let ssatext = $("#ssatext").val();
         window.ssa.loader("start");
         if (!ssatext) {
             $("#ssa-input-label").addClass("eroare")
         }

         window.ssa.uploadText(ssatext, fileid);
        
     });

    $("#ssa-file-upload").change((e)=>{
        var fileName = e.target.files[0].name;
        $("#file-name").removeClass("eroare")
        $("#file-name").text("Selected file: " + fileName);
    });


})



