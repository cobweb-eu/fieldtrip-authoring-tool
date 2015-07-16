//var $ = require('jquery')(window),
//    modalTemplate = require("../templates/modal.html");
var BLEImplementation = (function(){
    var thisType = "ble";

    var renderBLE = function(value, element){
        $.ajax({
            url: "templates/"+thisType+"Template.html",
            dataType: 'html'
        }).done(function(tmpl){
            $("#"+element).append(_.template(tmpl, {type: thisType, ble: value, title: "Bluetooth"}));
        });
    };

    var init = function(element){
        if($("#fieldcontain-ble").length === 0){
            renderBLE(thisType, element);
        }
    };

    return {
        init: init
    };
})();

//module.exports = GeometryTypeImplementation;