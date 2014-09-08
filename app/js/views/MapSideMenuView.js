define([
    'jquery',
    'underscore',
    'backbone',
    'bootstrap'
], function($, _, Backbone, bootstrap, FilterCollection, filterTemplate){

    var SidePanelView = Backbone.View.extend({
        el: '#accordion',
        initialize: function(){
            this.collection = new FilterCollection;
            this.template = _.template(filterTemplate);
        },

        render: function(baseUrl){

            // show some loading message
            this.$el.html('Loading');

            // fetch, when that is done, replace 'Loading' with content
            this.collection.fetch().done($.proxy(function(){
                var prep_data = this.collection.toJSON()[0];
                console.log(prep_data);
                var data = {
                    "orgtypes": prep_data.orgtypes,
                    "ownershiptypes": prep_data.ownershiptypes,
                    "statuses": prep_data.statuses,
                    "supportmechanisms": prep_data.supportmechanisms,
                    "techtypes": prep_data.techtypes,
                    "venturetypes": prep_data.venturetypes
                };
                var html = this.template(data);
                $(this.el).html(html);
                $('.collapse').collapse();


            }, this));

            return this;
        }

    });

    return SidePanelView;
});
