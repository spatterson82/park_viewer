function openNav() {
    console.log("clicked open");
    editing = false;
    console.log('editing:', editing);
    document.getElementById("panel_border").style.width = "350px";
    $("#map_border").css('background-color', '#999999');
    $("#panel_title").html('Morse Mountain');
    $("#map_title").html('');
}

function closeNav() {
    console.log("clicked close");
    document.getElementById("panel_border").style.width = "0";
    $("#map_border").css('background-color', 'white');
    $("#panel_title").html('');
    $("#map_title").html('Morse Mountain');
}



(function() {
    'use strict';

    function initialize() {
        map = L.map('map', {
            center: [43.738, -69.831],
            zoom: 13,
            minZoom: 13,
            maxBounds: L.latLngBounds(L.latLng(43.76, -69.71),
                L.latLng(43.69, -69.92)),
            zoomControl: false
        });
        L.Control.zoomHome().addTo(map);
        L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/satellite-streets-v9/tiles/256/{z}/{x}/{y}?' +
            'access_token=pk.eyJ1Ijoic3BhdHRlcnNvbjgiLCJhIjoiY2lzZzBnbmlxMDFzNjJzbnZ1cXJ0bDJ5cSJ9.r_0eIQ9LIuNS3LV-GL1AIg'
        ).addTo(map);
    }


    // ##################################################
    // form actions
    // ##################################################
    var api_key = '0bc661c1ea32153881fc4a135ca4ccb8c18bae18';

    // function to authenticate
    function get_sql_query(layer) {
        return 'SELECT * FROM ' + layer + '&api_key=' + api_key;
    }


    function createPopup(feature) {
        // TODO make popup unique by layer and show everything

        var prop = feature.properties;
        return L.popup().setContent('<p>' + prop.type + '</p>');
    }



    function build_query_combo(final_set, id) {
        // console.log("final set: ", final_set);
        var combo_html = '<select id="' + id + '_combo">';
        var middle = '';
        var final_array = Array.from(final_set);

        for (var i in final_array) {
            // middle += final_set[i];
            middle += '<option value="' + final_array[i] + '">' + final_array[i] + "</option>";
        }
        combo_html += middle + "</select>";

        // TODO Add styling to move select box over or underneath
        $(combo_html).appendTo("#" + id + '_div');
    }
    function get_features(features, id) {
        // console.log("new_layers: ", features);
        var query_set = new Set();
        features.forEach(function(feature) {
            query_set.add(feature.properties.type);
        });
        build_query_combo(query_set, id);
    }


    // checkbox logic
    var base_url = 'https://spatterson8.carto.com/api/v2/sql?format=GeoJSON&q=';
    $("input:checkbox").change(function() {
        console.log('ID: ' + this.id);
        if ($(this).is(":checked")) {
            console.log($('#' + this.id).is(':checked'));
            var self = this;
            $.getJSON(base_url + get_sql_query(this.id), function(data) {
                // TODO Create dropdown options for querying
                get_features(data.features, self.id);

                var new_layers = L.geoJSON(data, {
                    onEachFeature: function (row, layer) {
                        console.log(row, layer);
                        layer.bindPopup(createPopup(row));
                    },
                    id: self.id
                });
                console.log(self.id);


                // console.log("new_layers: ", new_layers);
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

            // remove combo boxes
            $('#' + this.id + '_combo').remove();

        }
    });


    $(document).ready(initialize());
})();