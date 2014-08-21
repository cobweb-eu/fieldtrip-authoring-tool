define([
  'jquery',
  'underscore',
  'backbone',
  'utils',
  'text!templates/homeTemplate.html'
], function($, _, Backbone, utils, homeTemplate){

    var HomeView = Backbone.View.extend({
        el: $("#content"),

        render: function(){

            $('.menu li').removeClass('active');
            $('.menu li a[href="#"]').parent().addClass('active');
            utils.closeSidePanel();
            this.$el.html(homeTemplate);
        }
    });

    return HomeView;
});

