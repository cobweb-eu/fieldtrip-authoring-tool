define([
    'jquery',
    'underscore',
    'backbone',
    'utils',
    'map',
    'views/MapSideMenuView',
    'text!templates/mapTemplate.html'
], function($, _, Backbone, utils, map, MapSideMenuView, mapTemplate){

    /**
     * change height of the map on the fly
     */
    var prepareDivForMap = function(){
        var $map = $("#map");
        $map.height($(window).height() - $("#header").height());
        //$map.css('top', $("#header").height()-2)
    };

    var enableSideMenu = function(){
        $(document).off('click', '#left-menu-btn');
        $(document).on('click', '#left-menu-btn', function(){
            var $this = $(this);
            if (!$this.hasClass('active')) {
                utils.openSidePanel();
            }else{
                utils.closeSidePanel();
            }
        });
    };

    var MapView = Backbone.View.extend({
        el: "#content",

        render: function(){
            //TO-DO make buttons of menu work 
            $('.menu li').removeClass('active');
            $('.menu li a[href="#/map"]').parent().addClass('active');
            this.$el.html(mapTemplate);
            prepareDivForMap();
            console.log(utils.getParameters());
            map.initMap('map', utils.getParameters());
            map.getclusters();
            enableSideMenu();
            var sidemenuView = new MapSideMenuView();
            sidemenuView.render();
            
            utils.setUpCRF();
            
            $(document).on('click', '#searchbutton', map.getFilteredGeoJSON);
            
            $(document).on('click', '#resetbutton', function() {
                document.getElementById("searchform").reset();
                map.getclusters();
            });
            
        }
    });

    return MapView;
});

