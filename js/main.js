function openNav() {
    console.log("clicked open");
    document.getElementById("panel_border").style.width = "100%";
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
        map = L.map('map').setView([43.738, -69.831], 14);
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
    // https://{spatterson8}.carto.com/api/v2/sql?q={SQL statement}&api_key={api_key}
    function get_sql_query(layer) {
        return 'SELECT * FROM ' + layer + '&api_key=' + api_key;
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

            $.getJSON(base_url + get_sql_query(this.id), function(data) {
                var new_layers = L.geoJSON(data, {
                    onEachFeature: function (row, layer) {
                        layer.bindPopup(createPopup(row));
                    }
                });
                new_layers.addTo(map);
                // L.layerGroup(new_layers._layers).addTo(map);
            });
        } else {
            console.log($('#' + this.id).is(':checked'));
            for (var layer in map._layers) {
                if (layer > 26) {
                    map.removeLayer(map._layers[layer]);
                }
            }

        }
    });


    $(document).ready(initialize());
})();