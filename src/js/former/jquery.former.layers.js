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
            "remoteDir": "features",
            "path": file.name,
            "file": file,
            "contentType": false
        };

        if(publicEditor){
            options.urlParams = {
                'public': 'true'
            };
        }

        loading(true);
        var target = this.target;
        pcapi.uploadFile(options).then($.proxy(function(data){
            $("#dialog-upload").dialog("close");
            alert("File was uploaded");
            $.ajax({
                url: "templates/layersTemplate.html",
                dataType: 'html',
                success: function(tmpl){
                    var data = {
                        "i": findIForFieldcontain("#"+target, '.fieldcontain', "features"),
                        "type": "features",
                        "title": file.name,
                        "url": pcapi.buildFSUrl('features', file.name)
                    };
                    var template = _.template(tmpl);
                    $("#"+target).append(template(data));
                }
            });
            loading(false);
        }, this));
    }, this));
}