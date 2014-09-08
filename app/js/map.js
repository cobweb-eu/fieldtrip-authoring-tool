define(['utils', 'leaflet'], function(utils, L){

    var map;
    var markers;
    var POILayer;

    var zoomdisplay;

    /**
     * bind popups to each point of geojson
     * @param feature
     * @param layer
     */
     
    var onEachFeature = function (feature, layer) {
        // generate popup content client-side
        if (feature.properties) {
            var props = feature.properties;
            var html = "<h3>"+props.name+"</h3>";
            html += "<p>Last updated "+ props.lastupdate + "</p>";
            html += "<hr/><p>";
            html += props.technology+ " - " + props.subtechnology + "<br />";
            html += "Planned capacity "+ props.plannedcapacity +"<br />"; 
            html += "Operational capacity "+ props.operationalcapacity +"<br />";
            html += "</p>";
            layer.bindPopup(html);
        }
        return;
    };

    var pointToLayer = function (feature, latlng) {
        // choose icon according to technology
        if (feature.properties) {
            var props = feature.properties;        
            var tech = props.technology;
            var whichicon = orangeIcon;
            if (tech=="Hydro") whichicon = blueIcon;
            if (tech=="Solar") whichicon = yellowIcon;
            if (tech=="Wind") whichicon = greyIcon;
            if (tech=="Heat Pumps") whichicon = redIcon;
            if (tech=="Marine") whichicon = cyanIcon;
            if (tech=="Bioenergy") whichicon = greenIcon;
            var M = new L.Marker(latlng , {icon:whichicon} );
            //alert ("M is "+M);
            return M;
        }
        return;
    };

    var roundNumber = function(num, dec) {
        // round to dec decimal places
        return Math.round(num * Math.pow(10, dec)) / Math.pow(10, dec);
    };

    function nicedescription(amountinKw) {
        // convert kW to kW / MW / GW
        if (amountinKw>1000000) {
            return roundNumber((amountinKw/1000000),2) + " GW";
        }
        amountinKw = parseInt(amountinKw,10);
        if (amountinKw>1000) {
            return roundNumber((amountinKw/1000),2) + " MW";
        }
        return roundNumber(amountinKw,2) + " kW";
    };

    function onEachCluster(feature, layer) {
        // generate popup content
        var props = feature.properties;
        popuphtml = "<h3>"+props.name+"</h3><hr />";
        popuphtml += props.projectcount + " projects<br />";
        popuphtml += "Technology: "+props.technology + "<br />";
        popuphtml += nicedescription(props.plannedcapacity) + " planned capacity<br />";
        popuphtml += nicedescription(props.operationalcapacity) + " operational capacity<br />";
        popuphtml += "<a href='"+props.url_view+"'><span class='glyphicon glyphicon-info'>View Project</span></a>";
        if (feature.properties) {
            layer.bindPopup(popuphtml);
            layer.on('click', function (e) {
                this.openPopup();
            });
        }
    };

    /**
     * Gets all clusters according to current zoom level
     */
    var getclusters = function () {

        var jqxhr = $.ajax( "/archipelago/cluster/zoom"+map.getZoom()+"/").done(function() {
        
            data = JSON.parse(jqxhr.responseText);
        
            if (typeof POILayer != 'undefined') {
                map.removeLayer(POILayer);
            }
            POILayer = L.geoJson(data, {onEachFeature:onEachCluster, pointToLayer:pointToLayer });
            POILayer.addTo(map);

        }).fail(function() {
            console.log(jqxhr.responseText);
            return {};
        });
        
        return "";
    };

    return{
        /**
         * Initialize Map
         * @param divId the id of the div where map initializes
         */
         
        "initMap": function(divId, options){
            //alert(""+getCookie("zoom"));
            if (getCookie("zoom")!=undefined) {
                //alert("using cookie");
                var latlng = new L.LatLng(parseFloat(getCookie("lat")), parseFloat(getCookie("lng")));
                var zoom = parseInt(getCookie("zoom"));
                map=L.map(divId,{ zoomControl:false }).setView(latlng).setZoom(zoom);
            } else if (options && "zoom" in options) {
                //alert("Using options");
                var latlng = new L.LatLng(parseFloat(options["lat"]), parseFloat(options["lon"]));
                var zoom = parseInt(options["zoom"]);
                map=L.map(divId,{ zoomControl:false }).setView(latlng).setZoom(zoom);
            } 
            else {
                //alert("Using default");
                map = L.map(divId, { zoomControl:false }).setView([55.6, -3.5], 13).setZoom(7);
            } 
                
            L.Icon.Default.imagePath = 'images';

            new L.Control.Zoom({ position: 'topright' }).addTo(map);

            map.on('zoomend', function(event)
            {
                var newzoomlevel = event.target._animateToZoom;
                $('#zoomit').html("<a href='#'><span class='leaflet-control-zoom-in'>"+ newzoomlevel.toString() +"</span></a>");
                getclusters();
            });
    
            // Zoom level display custom control
            zoomdisplay = L.control({position: 'topright'});
            zoomdisplay.onAdd = function (map) {
                var div = L.DomUtil.create('div', 'leaflet-control-zoom leaflet-bar leaflet-control');
                div.innerHTML="<div id='zoomit'><a href='#'><span class='leaflet-control-zoom-in'>"+ map.getZoom().toString() +"</span></a></div>";
                return div;
            }
            zoomdisplay.addTo(map);

            // Record/Home custom control.

            var snapshot = L.control({position: 'topright'});  
            snapshot.onAdd = function (map) {
                var div = L.DomUtil.create('div', 'leaflet-control-zoom leaflet-bar leaflet-control');
                div.innerHTML="<a id='record' class='leaflet-control-zoom-in'><span class='glyphicon glyphicon-screenshot'></span></a><a id='home' class='leaflet-control-zoom-in'><span class='glyphicon glyphicon-home'></a>";
                return div;
            }
            snapshot.addTo(map);
            
            // Legend custom control
            
            var legend = L.control({position: 'topright'});  
            legend.onAdd = function (map) {
                var div = L.DomUtil.create('div', 'leaflet-control-zoom leaflet-bar leaflet-control');
                div.innerHTML="<a id='togglelegend' class='leaflet-control-zoom-in'><span class='glyphicon glyphicon-list-alt'></span></a><a id='togglehelp' class='leaflet-control-zoom-in'><span class='glyphicon glyphicon-question-sign'></span></a><a id='showall' class='leaflet-control-zoom-in'><span class='glyphicon glyphicon-globe'></span></a>";
                div.innerHTML+='<div id="legend-panel" style="display:none;"> <h3>Legend</h3> <img src="/images/marker-icon-orange.png"><span>Region / Other</span><br /> <img src="/images/marker-icon-red.png"><span>Heat Pumps</span><br /> <img src="/images/marker-icon-green.png"><span>BioEnergy</span><br /> <img src="/images/marker-icon-blue.png"><span>Hydro</span><br /> <img src="/images/marker-icon-cyan.png"><span>Marine</span><br /> <img src="/images/marker-icon-yellow.png"><span>Solar</span><br /> <img src="/images/marker-icon-grey.png"><span>Wind</span><br /> </div>';
                div.innerHTML+='<div id="help-popup" style="display:none;"> <h3>About these icons</h3> <table> <tr> <td>7</td> <td>Current Zoom level (0-15)</td> <tr> <tr> <td><span class="glyphicon glyphicon-screenshot"></span></td> <td>Record the current position of the map (needs Cookies enabled)</td> <tr> <tr> <td><span class="glyphicon glyphicon-home"></span></td> <td>Go to your recorded location</td> <tr> <tr> <td><span class="glyphicon glyphicon-list-alt"></span></td> <td>Show / Hide Map legend</td> <tr> <tr> <td><span class="glyphicon glyphicon-globe"></span></td> <td>Show all projects</td> <tr></table> </div>';
                return div;
            }
            legend.addTo(map);
            
           
    
            // scale control
            L.control.scale({position: 'bottomright'}).addTo(map);

            // tile provider
            
            //L.tileLayer('http://otile1.mqcdn.com/tiles/1.0.0/map/{z}/{x}/{y}.jpg', {
            //L.tileLayer('http://{s}.tile.stamen.com/toner/{z}/{x}/{y}.png', {
            
            L.tileLayer('https://{s}.tiles.mapbox.com/v4/paulgeorgie.j7j1jj3n/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoicGF1bGdlb3JnaWUiLCJhIjoiX2Z1c3BTRSJ9.XZwZb8enmNLdJ9HZSpS57w', {
                attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
                maxZoom: 15
            }).addTo(map);
        }
    };
});
