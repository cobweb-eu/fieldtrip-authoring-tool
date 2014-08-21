define([
  'jquery',
  'underscore',
  'backbone',
  'utils',
  'text!templates/homeTemplate.html'
], function($, _, Backbone, utils, homeTemplate){

    var enableEvents = function(){
        $(document).on('#open-login', 'click', function(){
            $("#dialog-login").dialog("open");
        });
    };

    var HomeView = Backbone.View.extend({
        el: $("#content"),

        render: function(){

            $('.menu li').removeClass('active');
            $('.menu li a[href="#"]').parent().addClass('active');
            utils.closeSidePanel();
            this.$el.html(homeTemplate);
            enableEvents();
        }
    });

    return HomeView;
});

