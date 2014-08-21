// Filename: router.js
define([
  'jquery',
  'underscore',
  'backbone',
  'views/HomeView',
  'views/AuthorView',
  'views/RecordsMapView',
  'views/EditorsView',
  'views/LayersView'
], function($, _, Backbone, HomeView, AuthorView, RecordsMapView, EditorsView, LayersView ) {

    var AppRouter = Backbone.Router.extend({
        routes: {
            // Define some URL routes
            'author': 'showAuthor',
            'viewer': 'showRecords',
            'editors': 'showEditors',
            'layers': 'showLayers',
            // Default
            '*actions': 'defaultAction'
        }
    });

    var initialize = function(baseUrl){

        var app_router = new AppRouter;

        app_router.on('route:showAuthor', function(){
            var authorView = new AuthorView();
            authorView.render();
        });

        app_router.on('route:showRecords', function(){
            var recordsMapView = new RecordsMapView();
            recordsMapView.render();
        });

        app_router.on('route:showEditors', function(){
            // Call render on the module we loaded in via the dependency array
            var editorsView = new EditorsView();
            editorsView.render();
        });
    
        app_router.on('route:showLayers', function () {
            var layersView = new LayersView();
            layersView.render();
        });

        app_router.on('route:defaultAction', function (actions) {
            // We have no matching route, lets display the home page
            var homeView = new HomeView();
            homeView.render();
        });

        // Unlike the above, we don't call render on this view as it will handle
        // the render call internally after it loads data. Further more we load it
        // outside of an on-route function to have it loaded no matter which page is
        // loaded initially.
        //var footerView = new FooterView();

        Backbone.history.start();
    };

    return { 
        initialize: initialize
    };
});
