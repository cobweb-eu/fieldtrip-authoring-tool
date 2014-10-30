var DTreeImplementation = function(target){
    this.target = target;
};

DTreeImplementation.prototype.implement = function(){
    if($("#"+this.target).find("#fieldcontain-dtree").length===0){
        $("#layers").trigger('click');
        $("#uploadbutton").addClass('hidden');
        $("#upload-button-dtree").removeClass('hidden');
    
        var file;
        $('#fileselect').unbind();
        // Set an event listener on the Choose File field.
        $('#fileselect').bind("change", function(e) {
            var files = e.target.files || e.dataTransfer.files;
            // Our file var now holds the selected file
            file = files[0];
        });
        
        $("#upload-button-dtree").click($.proxy(function(){
            if($("#form_title").text() === file.name.split(".")[0]){
                var options = {
                    "remoteDir": "editors",
                    "filename": file.name,
                    "file": file
                };
                loading(true);
                var target = this.target;
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
                                    "url": pcapi.buildFSUrl('editors', file.name)
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
            }
            else{
                giveFeedback("The name of the file should be the same as the editor's");
            }
        }, this));
    }
    else{
        giveFeedback("You can only add one decision tree button once!");
    }
}