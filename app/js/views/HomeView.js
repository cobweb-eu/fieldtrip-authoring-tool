define([
  'jquery',
  'underscore',
  'backbone',
  'utils',
  'config',
  'text!templates/homeTemplate.html'
], function($, _, Backbone, utils, config, homeTemplate){


    var doLogin = function(){
        $(document).on('click', '.redirect-me', function(){
            provider = $(this).attr("id");
            localStorage.setItem("provider", provider);
            if(provider === 'local'){
                var url = config.baseurl+versions[versions.length - 1]+"/pcapi/auth/"+provider;
                $("#dialog-local-login").dialog("open");
                $("#loginbutton").click(function(){
                    var $location = $(location);
                    $location.attr('href', $location.attr("href")+"?uid=123&oauth_token="+$('#user-email').val());
                });
            }
            else{
                var url = config.baseurl+config.versions[config.versions.length - 1]+"/pcapi/auth/"+provider+"?callback="+$(location).attr('href');
                console.log(url);
                $.getJSON(url, function(data) {
                    $(location).attr('href',data.url);
                });
            }
        });
    };

    var renderLogin = function(){
        var login = ['<ul id="providers">',
                    '<li><a href="javascript:void(0);" class="redirect-me" id="dropbox"><img src="images/dropbox.png" alt="Dropbox" /></a></li>',
                    '<li><a href="javascript:void(0);" class="redirect-me" id="local">Local Provider</a></li>',
                    '</ul>'];
        $("#myModalBody").html(login.join(""));
    }

    var HomeView = Backbone.View.extend({
        el: $("#content"),

        render: function(){

            $('.menu li').removeClass('active');
            $('.menu li a[href="#"]').parent().addClass('active');
            this.$el.html(homeTemplate);

            //render login options
            renderLogin();
            doLogin();
            utils.checkIfLoggedIn();
        }
    });

    return HomeView;
});

