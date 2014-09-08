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

define([], function(){
    return {
        findIForFieldcontain: function(div_id, where, type){
            var finds = $(div_id).find($(where));
            //console.log(finds);
            var i = 0;
            if(finds.length > 0){
                for(var k=0; k<finds.length; k++){
                    var id = $(finds[k]).attr("id");
                    //console.log(id);
                    if(id != undefined){
                        var splits = id.split("-");
                        if(splits[1] === type){
                            var j = parseInt(splits[2]);
                            if(j>i){
                                i=j;
                            }
                        }
                    }
                }
            }
            return i+1;
        },
        findHighestElement: function (id, element, word){
            //var found = $("#"+id).contents().find(element);
            var found = $("#"+id+' '+element);
            var j = 0;
            if(found.length > 0){
                for(f=0; f<found.length; f++){
                    var i = parseInt($(found[f]).prop("id").split(word)[1]);
                    if(i > j){
                        j = i;
                    }
                }
            }
            return j;
        },
        getValueFromEditForm: function (type, dialog_id, fid){
            var updateValues = {
                text: function(dialog_id, fid){
                    return $("#"+dialog_id+" #"+fid+" input").val();
                    },
                textarea: function(dialog_id, fid){
                    return $("#"+dialog_id+" #"+fid+" textarea").val();
                },
                warning: function(dialog_id, fid){
                    return $("#"+dialog_id+" #"+fid+" warning").val();
                },
                checkbox: function(dialog_id, fid){
                    return $("#"+dialog_id+" #"+fid+" input[type=checkbox]:checked").val();
                },
                radio: function(dialog_id, fid){
                    return $("#"+dialog_id+" #"+fid+" input[type=radio]:checked").val();
                },
                select: function(dialog_id, fid){
                    return $("#"+dialog_id+" #"+fid+" select option:selected").val();
                },
                image: function(dialog_id, fid){
                    var splits = $("#"+dialog_id+" #"+fid+" img").attr("src").split("/");
                    return splits[splits.length-1];
                },
                audio: function(dialog_id, fid){
                    var splits = $("#"+dialog_id+" #"+fid+" a").attr("href").split("/");
                    return splits[splits.length-1];
                },
                range: function(dialog_id, fid){
                    return $("#"+dialog_id+" #"+fid+" input").val();
                },
                track: function(dialog_id, fid){
                    return $("#"+dialog_id+" #"+fid+" input").val();
                }
            }
            return updateValues[type](dialog_id, fid);
        },
        limitChars: function (textid, limit, infodiv){
            var text = $('#'+textid).val();
            var textlength = text.length;
            if(textlength > limit){
                $('#' + infodiv).html('You cannot write more then '+limit+' characters!');
                $('#'+textid).val(text.substr(0,limit));
                return false;
            }
            else{
                $('#' + infodiv).html('You have '+ (limit - textlength) +' characters left.');
                return true;
            }
        }
    }
});