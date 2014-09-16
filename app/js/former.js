/*
Copyright (c) 2014, EDINA.
All rights reserved.

Redistribution and use in source and binary forms, with or without modification,
are permitted provided that the following conditions are met:

1. Redistributions of source code must retain the above copyright notice, this
   list of conditions and the following disclaimer.
2. Redistributions in binary form must reproduce the above copyright notice, this
   list of conditions and the following disclaimer in the documentation and/or
   other materials provided with the distribution.
3. All advertising materials mentioning features or use of this software must
   display the following acknowledgement: This product includes software
   developed by the EDINA.
4. Neither the name of the EDINA nor the names of its contributors may be used to
   endorse or promote products derived from this software without specific prior
   written permission.

THIS SOFTWARE IS PROVIDED BY EDINA ''AS IS'' AND ANY EXPRESS OR IMPLIED
WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF
MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT
SHALL EDINA BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY,
OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT,
STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY
OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH
DAMAGE.
*/

define([
  'jquery',
  'formerUtils',
  'text!templates/textFieldTemplate.html',
  'text!templates/textareaFieldTemplate.html',
  'jqueryui'
], function($, futils, textTemplate, textareaTemplate){

    var choices = {
          "textAction": ["text", "Text"],
          "rangeAction": ["range", "Range"],
          "textareaAction": ["textarea", "Text Area"],
          "checkboxAction": ["checkbox", "Multiple Choice Selector"],
          "radioAction": ["radio", "Single Choice Selector"],
          "selectAction": ["select", "Drop down Selector"],
          "photoAction": ["image", "Image Capture"],
          "photoPointAction": ["image", "Image with Point"],
          "audioAction": ["audio", "Audio Capture"],
          "warningAction": ["warning", "Warning Message"]
    };

    var addElement = function(element, target){
        console.log(element+"Action")
        //myActions[element+"Action"](target, element, getElements());
        for(choice in choices){
            if(choices[choice][1] === element){
                myActions[choice](target, choices[choice][0], getElements());
                return false;
            }
        }
        return true;
    };


    var enableEvents = function(dragId, dropId){
        enableDragging(dragId);
        enableDropping(dropId);
    };
    
    /**
     * function for enabling dragging
     */
    var enableDragging = function(id){
        $("#"+id+" li").draggable({
            appendTo: "body",
            helper: "clone",
            iframeFix: true,
            start: function(event, ui){
            }
        });
    };

    /**
     * function for enabling drop
     */
    var enableDropping = function(id){
        var $id = $("#"+id);
        $id.droppable({
            activeClass: "ui-state-default",
            hoverClass: "ui-state-hover",
            accept: ":not(.ui-sortable-helper)",
            drop: function(event, ui){
                addElement(ui.draggable.children().text(), id);
                updateSyncStatus(false);
                if($("#iframe").length > 0){
                    $("#iframe").remove();
                }
            }
        });
    };

    /**
     * function for getting elements
     */
    var getElements = function(){
        var elements = new Array();
        for(choice in choices){
            elements.push(choices[choice][0])
        }
        return elements;
    };

    var myActions = {
        textAction : function(target, element, elements){
            var data = {
                "i": 1,
                "type": "text",
                "title": "Title",
                "elements": elements,
                "fields": {
                    "value": "",
                    "maxlength": 10
                }
            };
            $("#"+target).append(_.template(textTemplate, data))
        },
        textareaAction : function(target, element, elements){
            var data = {
                "i": 1,
                "type": "textarea",
                "title": "Description",
                "elements": elements,
                "fields": {
                    "placeholder": "Placeholder",
                    "required": "required",
                    "readonly": "readonly" 
                }
            };
            $("#"+target).append(_.template(textareaTemplate, data))
        },
        warningAction : function(target, element, elements){
            var warningimplementation = new WarningImplementation(target, "WARNING", element, elements);
            warningimplementation.implement();
        },
        checkboxAction : function(target, element, elements){
            var i = findHighestElement(target, "input:checkbox", element+"-");
            i++;
            var checkboxes = new Object();
            checkboxes[i] = "Checkbox";
            var checkboximplementation = new CheckBoxImplementation(target, "Choose", element, elements, checkboxes);
            checkboximplementation.implement();
        },
        radioAction : function(target, element, elements){
            var i = findHighestElement(target, ".fieldcontain", "fieldcontain-radio-");
            var j = findHighestElement(this.target, "input:radio", "form-radio"+i+"-");
            i++;
            var radios = new Object();
            radios[i+"-1"] = "Radio";
            var radioimplementation = new RadioImplementation(target, "Choose", element, elements, radios);
            radioimplementation.implement();
        },
        selectAction : function(target, element, elements){
            var i = findHighestElement(target, "select", element+"-");
            i++;
            var options = new Object();
            options[i] = "Select";
            var optionsimplementation = new OptionsImplementation(target, "Choose", element, elements, options);
            optionsimplementation.implement();
        },
        photoAction : function(target, element, elements){
            var photoimplementation = new PhotoImplementation(target, "image", "Take", element, elements);
            photoimplementation.implement();
        },
        photoPointAction : function(target, element, elements){
            var photoimplementation = new PhotoPointImplementation(target, "image", "Take", element, elements);
            photoimplementation.implement();
        },
        audioAction : function(target, element, elements){
            var audioimplementation = new AudioImplementation(target, "audio", "Record", element, elements);
            audioimplementation.implement();
        },
        gpsAction : function(target, elements){
            var gpsimplementation = new GPSImplementation(target, "poiCapture", "gps", elements);
            gpsimplementation.implement();
        },
        rangeAction : function(target, element, elements){
            var textimplementation = new TextImplementation(target, "Range", element, elements, "", 1, 0, 10, 10);
            textimplementation.implement();
        }
    };

    var updateSyncStatus = function(sync){
        if(sync == true){
            $("#sync_status").removeClass("label-warning").addClass("label-success").text("Synchronized");
        }else{
            $("#sync_status").removeClass("label-success").addClass("label-warning").text("Unsynchronized");
        }
    };

    return {
        'init': function(dragId, dropId){
            enableEvents(dragId, dropId);
        }
    };
});