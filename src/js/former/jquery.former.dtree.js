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
                    "filename": dtreeFname,
                    "file": file
                };
                loading(true);
                var target = this.target;

                if(publicEditor){
                    var pubOptions = $.extend({}, options, {userid: config.pcapianonymous});
                    pcapi.uploadFile(pubOptions, function(result, data){
                        console.debug(result);
                    });
                }

                pcapi.uploadFile(options, $.proxy(function(result, data){
                    if(result){
                        $("#dialog-upload").dialog("close");
                        alert("File was uploaded");
                        $.ajax({
                            url: "templates/dtreeTemplate.html",
                            dataType: 'html',
                            success: function(tmpl){
                                var data = {
                                    "i": 1,
                                    "type": "dtree",
                                    "title": file.name,
                                    "dtree": 'editors/' + dtreeFname,
                                    "url": pcapi.buildFSUrl('editors', dtreeFname)
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
    else{
        giveFeedback("You can only add one decision tree button once!");
    }
}