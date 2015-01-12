var LayersImplementation = function(target){
    this.target = target;
};

LayersImplementation.prototype.implement = function(){
    $("#dialog-upload").dialog("open");

    var file;
    $('#fileselect').unbind();
    // Set an event listener on the Choose File field.
    $('#fileselect').bind("change", function(e) {
        var files = e.target.files || e.dataTransfer.files;
        // Our file var now holds the selected file
        file = files[0];
    });

    $("#upload-button").unbind('click');
    $("#upload-button").click($.proxy(function(){
        var publicEditor = utils.getParams().public === 'true';
        var options = {
            "remoteDir": "layers",
            "filename": file.name,
            "file": file
        };

        if(publicEditor){
            options.urlParams = {
                'public': 'true'
            };
        }

        loading(true);
        var target = this.target;
        pcapi.uploadFile(options, $.proxy(function(result, data){
            if(result){
                $("#dialog-upload").dialog("close");
                alert("File was uploaded");
                $.ajax({
                    url: "templates/layersTemplate.html",
                    dataType: 'html',
                    success: function(tmpl){
                        var data = {
                            "i": 1,
                            "type": "dtree",
                            "title": file.name,
                            "url": pcapi.buildFSUrl('layers', file.name)
                        };
                        var template = _.template(tmpl);
                        $("#"+target).append(template(data));
                    }
                });
            }
            else{
                alert("There was an error");
            }
            loading(false);
        }, this));
    }, this));
}