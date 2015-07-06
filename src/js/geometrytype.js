//var $ = require('jquery')(window),
//    modalTemplate = require("../templates/modal.html");
var GeometryTypeImplementation = (function(){
    var modalGeometry = "#modalGeometry";
    var thisType = "geometryType";

    var prepareOptions = function(){
        var options = [];
        options.push('<div class="control-group">');
        options.push('<label class="radio"><input type="checkbox" name="'+thisType+'" value="point">point</label>');
        options.push('<label class="radio"><input type="checkbox" name="'+thisType+'" value="line">line</label>');
        options.push('<label class="radio"><input type="checkbox" name="'+thisType+'" checked="checked" value="polygon">polygon</label>');
        options.push('<label class="radio"><input type="checkbox" name="'+thisType+'" value="box">box</label>');
        options.push('</div>');
        return options;
    };

    var renderGeometry = function(value, element){
        $.ajax({
            url: "templates/"+thisType+"Template.html",
            dataType: 'html'
        }).done(function(tmpl){
            $("#"+element).append(_.template(tmpl, {type: thisType, geometry: value}));
        });
    };

    var init = function(element){
        if($("#fieldcontain-geometryType").length === 0){
            $.ajax({
                url: "templates/modal.html",
                dataType: "html"
            }).done(function(data){
                var modalTemplate = _.template(data);
                $('body').append(modalTemplate({id: "modalGeometry", title: "Choose the geometry type: ", body: prepareOptions().join("")}));
                var $modalGeometry = $(modalGeometry);
                $modalGeometry.modal('show');

                $modalGeometry.off("click", "button");
                $modalGeometry.on("click", "button", function(){
                    var values = [];
                    $('input[name='+thisType+']:checked', modalGeometry).each(function(){
                        values.push($(this).val());
                    });
                    renderGeometry(values.join(","), element);
                    $modalGeometry.modal('hide');
                });
            });
        }
        else{
            
        }
    };

    return {
        init: init
    };
})();

//module.exports = GeometryTypeImplementation;