define([], function(){

    return {
        'checkIfLoggedIn': function(){
            if ("oauth_token" in this.getParams() && this.getParams()["oauth_token"] !== undefined) {
                $(".menu-btn").removeClass("hide");
                $("#login-btn").addClass("hide");
            }else if ("group" in this.getParams() && this.getParams()["group"] !== undefined) {
                $(".menu-btn").removeClass("hide");
                $("#login-btn").addClass("hide");
            }
        },
        'getParams':  function(){
            var query = window.location.search.substring(1);
            var query_string = {};
            var params = query.split("&");
            for(var i=0; i<params.length; i++){
                var pair = params[i].split("=");
                if (typeof query_string[pair[0]] === "undefined") {
                    query_string[pair[0]] = pair[1];
                    // If second entry with this name
                }
                else if (typeof query_string[pair[0]] === "string") {
                    var arr = [ query_string[pair[0]], pair[1] ];
                    query_string[pair[0]] = arr;
                    // If third or later entry with this name
                }
                else {
                    query_string[pair[0]].push(pair[1]);
                }
            }
            return query_string;
        }
    };
});
