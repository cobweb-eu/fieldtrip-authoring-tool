define([
  'jquery',
  'underscore',
  'backbone',
  'utils',
  'text!templates/loginTemplate.html'
], function($, _, Backbone, utils, LoginTemplate){

    var LoginView = Backbone.View.extend({
        el: $("#content"),

        render: function(){

            $('.menu li').removeClass('active');
            $('.menu li a[href="#/login"]').parent().addClass('active');
            utils.closeSidePanel();
            //this.$el.html(LoginTemplate);
            utils.setUpCRF();
            $.ajax({
                url: "/archipelago/login/",
                dataType: "html",
            }).done($.proxy(function(data){
                this.$el.html(data);
            }, this));
        }
    });

    return LoginView;

});

