define([
    'jquery',
    'underscore',
    'backbone',
    'bootstrap',
    'collections/FilterCollection',
    'text!templates/filterTemplate.html'
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
		console.log(html);
                $(this.el).html(html);
                $('.collapse').collapse();

		// add in capacity sliders
		$('#slider').noUiSlider({
						start: [ 1, 1000 ],
						range: {
							'min': 1,
							'max': 1000
						}
					});

        $('#slider').change(function(){
            var vals=$("#slider").val();
            $("#slider-info").html(vals);
        });

		$('#slider2').noUiSlider({
						start: [ 1, 1000 ],
						range: {
							'min': 1,
							'max': 1000
						}
					});

            }, this));

            return this;
        }

    });

    return SidePanelView;
});
