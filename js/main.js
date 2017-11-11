function openNav() {
    console.log("clicked open");
    document.getElementById("panel_border").style.width = "90%";
    $("#panel_title").html('Morse Mountain');
    $("#map_title").html('');
}

function closeNav() {
    console.log("clicked close");
    document.getElementById("panel_border").style.width = "0";
    $("#panel_title").html('');
    $("#map_title").html('Morse Mountain');
}



(function() {
    'use strict';

    function initialize() {
        map = L.map('map', {
            center: [43.738, -69.831],
            zoom: 14,
            minZoom: 14,
            maxBounds: L.latLngBounds(L.latLng(43.756836916525415, -69.81064796447755),
                L.latLng(43.71919477900117, -69.85133171081544)),
            zoomControl: false
        });
        L.Control.zoomHome().addTo(map);
        L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/satellite-streets-v9/tiles/256/{z}/{x}/{y}?' +
            'access_token=pk.eyJ1Ijoic3BhdHRlcnNvbjgiLCJhIjoiY2lzZzBnbmlxMDFzNjJzbnZ1cXJ0bDJ5cSJ9.r_0eIQ9LIuNS3LV-GL1AIg'
        ).addTo(map);
        // , {doubleClickZoom: false})
        // map.locate({setView: true, maxZoom: 11});

        // map.panTo(new L.LatLng(40, -85));
    }


    // ##################################################
    // form actions
    // ##################################################
    var api_key = '0bc661c1ea32153881fc4a135ca4ccb8c18bae18';

    // function to authenticate
    function get_sql_query(layer) {
        return 'SELECT * FROM ' + layer + '&api_key=' + api_key;
        // return 'SELECT * FROM ' + layer + ' WHERE ' + layer + '.the_geom  && ST_MakeEnvelope(-69.85, 43.72, -69.8, 43.76);';
    }

    function createPopup(feature) {
        var prop = feature.properties;

        return L.popup().setContent('<p>' + prop.type + '</p>');
    }

    var base_url = 'https://spatterson8.carto.com/api/v2/sql?format=GeoJSON&q=';

    $("input:checkbox").change(function() {
        console.log('ID: ' + this.id);
        if ($(this).is(":checked")) {
            console.log($('#' + this.id).is(':checked'));
            var self = this;
            $.getJSON(base_url + get_sql_query(this.id), function(data) {
                var new_layers = L.geoJSON(data, {
                    onEachFeature: function (row, layer) {
                        layer.bindPopup(createPopup(row));
                    },
                    id: self.id
                });
                console.log(self.id);
                new_layers.addTo(map);
            });
        } else {
            console.log($('#' + this.id).is(':checked'));
            var layer_list = map._layers;
            for (var layer in layer_list) {
                if (layer_list[layer].options.id === this.id) {
                    map.removeLayer(layer_list[layer]);
                }
            }

        }
    });


    $(document).ready(initialize());
})();