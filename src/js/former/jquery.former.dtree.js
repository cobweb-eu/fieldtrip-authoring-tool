var DTreeImplementation = function(target){
    this.target = target;
};

DTreeImplementation.prototype.implement = function(){
    if($("#"+this.target).find("#fieldcontain-dtree").length===0){
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
            // TODO: When we migrate to modules get the sid & publicEditor from core
            var dtreeFname = utils.getParams().sid + '.json';
            var publicEditor = utils.getParams().public === 'true';
            var options = {
                "remoteDir": "editors",
                "path": dtreeFname,
                "file": file,
                "contentType": false
            };

            loading(true);
            var target = this.target;

            if(publicEditor){
                options.urlParams = {
                    'public': 'true'
                };
            }

            pcapi.uploadFile(options).then($.proxy(function(result, data){
                $("#dialog-upload").dialog("close");
                alert("File was uploaded");
                $.ajax({
                    url: "templates/dtreeTemplate.html",
                    dataType: 'html',
                    success: function(tmpl){
                        var data = {
                            "i": findIForFieldcontain("#"+target, '.fieldcontain', "dtree"),
                            "type": "dtree",
                            "title": file.name,
                            "dtree": dtreeFname,
                            "url": pcapi.buildFSUrl('editors', dtreeFname)
                        };
                        var template = _.template(tmpl);
                        $("#"+target).append(template(data));
                    }
                });
                loading(false);
            }, this));
        }, this));
    }
    else{
        giveFeedback("You can only add one decision tree button once!");
    }
}