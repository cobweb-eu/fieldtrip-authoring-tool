define([], function(){
    /**
    * function for checking if a request method is valid
    * @param method
    */
    var csrfSafeMethod = function (method) {
        // these HTTP methods do not require CSRF protection
        return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
    };
    
    /**
    * function for fetching cookie by name
    * @param name of the cookie
    * @return cookie value
    */
    var getCookie = function (name) {
        var cookieValue = null;
        if (document.cookie && document.cookie != '') {
            var cookies = document.cookie.split(';');
            for (var i = 0; i < cookies.length; i++) {
                var cookie = jQuery.trim(cookies[i]);
                // Does this cookie string begin with the name we want?
                if (cookie.substring(0, name.length + 1) == (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    };

    var sameOrigin = function (url) {
        // test that a given url is a same-origin URL
        // url could be relative or scheme relative or absolute
        var host = document.location.host; // host + port
        var protocol = document.location.protocol;
        var sr_origin = '//' + host;
        var origin = protocol + sr_origin;
        // Allow absolute or scheme relative URLs to same origin
        return (url == origin || url.slice(0, origin.length + 1) == origin + '/') ||
          (url == sr_origin || url.slice(0, sr_origin.length + 1) == sr_origin + '/') ||
          // or any other URL that isn't scheme relative or absolute i.e relative.
          !(/^(\/\/|http:|https:).*/.test(url));
    };
    
    
    return {
        'closeSidePanel': function () {
            // close side panel when clicking on menu button
            $('#left-menu-btn').removeClass('active');
            $('body').removeClass('cbp-spmenu-push-toright');
            $('#cbp-spmenu-s1').removeClass('cbp-spmenu-open');
        },
        'getBaseURL': function(){
            return '/archipelago/';
        },
        'getParameters': function (){
            var query = window.location.search.substring(1);
            var query_string = {};
            var params = query.split("&");
            for(var i=0; i<params.length; i++){
                var pair = params[i].split("=");
                if (typeof query_string[pair[0]] === "undefined") {
                    query_string[pair[0]] = pair[1];
                    // If second entry with this name
                } else if (typeof query_string[pair[0]] === "string") {
                    var arr = [ query_string[pair[0]], pair[1] ];
                    query_string[pair[0]] = arr;
                    // If third or later entry with this name
                } else {
                    query_string[pair[0]].push(pair[1]);
                }
            }
            return query_string;
        },
        'openSidePanel': function () {
            // close side panel when clicking on menu button
            $('#left-menu-btn').addClass('active');
            $('body').addClass('cbp-spmenu-push-toright');
            $('#cbp-spmenu-s1').addClass('cbp-spmenu-open');
        },
        'setUpCRF': function(){
            /** Need this if we keep CSRF turned on */
  
            var csrftoken = getCookie('csrftoken');
  
  
            /** Set up to automatically send CSRF in AJAX POST headers, but only to this domain, and only for POST (not GET) */
            $.ajaxSetup({
                beforeSend: function(xhr, settings) {
                    if (!csrfSafeMethod(settings.type) && sameOrigin(settings.url)) {
                        // Send the token to same-origin, relative URLs only.
                        // Send the token only if the method warrants CSRF protection
                        // Using the CSRFToken value acquired earlier
                        xhr.setRequestHeader("X-CSRFToken", csrftoken);
                    } else {
                        console.log("Not setting csrf...");
                    }
                }
            });
        }
    };
});
