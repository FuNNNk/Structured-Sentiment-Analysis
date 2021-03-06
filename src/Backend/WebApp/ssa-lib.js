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
            poolingResults(filename);
        },
        error: function(e) {
           console.log("error: ", e)
        },
    });
};


window.ssa.uploadText = function (ssatext, filename) {

    let fd = new FormData();
    fd.append('ssatext', ssatext);
    fd.append('fileid', filename);
    console.log('ssatext',ssatext)
    console.log('fileid',filename)
    $.ajax({
        url: "http://localhost:3000/uiconnector/raw",
        method: 'post',
        data: fd,
        processData: false,
        contentType: false,
        success: function(data){
            console.log("uploaded", data);
            window.ssa.analise(filename + '.txt');
            poolingResults(filename + '.txt');
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

function poolingResults(filename) {
    console.log('poolingResults',filename)
    const tm = setTimeout(()=>{
        window.ssa.loader("start");
    }, 5000);
    
    $.ajax({
    url: "http://localhost:3000/stats",
    data: {filename: filename},
    success: function(data){
        // Backup
        //  const sentimentResults = JSON.stringify(data, null, '\t');
        // $("#rezultate").text(sentimentResults);
        $("#rezultate").text("Results will be placed here")
        if(data == "no data")
        {
            poolingResults(filename);
            return;
        }
        let dd =  data.replace("\n", "").replace("\r", "").replace("\t", "");
        
        let dataAsJsonParsed = JSON.parse(dd);
        console.log(dataAsJsonParsed);

        const list = $("<ul></ul>")

        list.append("<li>The sentiment analysis for the file is:</li>")
        dataAsJsonParsed.forEach((e)=>{
            const listitem = $("<ul></ul>")
            listitem.append("<li class=\"opiniontext\">" + e.text + "</li>")
            e.opinions.forEach((k)=> {
                Object.keys(k).forEach((key)=> {
                    listitem.append("<li> <span class=\"opinionlist\">" + key + "</span>:  " +  k[key] + "</li>")
                })
                
            })
            list.append("<li class=\"separator\"> </li>")
            list.append(listitem)
        });

        $("#rezultate").append(list)

        window.ssa.loader("stop");
        poolingResults(filename);

    },
    error: function() {
        poolingResults(filename);
    },
    filename: filename,
    timeout: 17000
    });
};


