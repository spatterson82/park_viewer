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
        var middle = '<option value="" disabled selected style="display: none;">Filter Layer:</option>';
        var final_array = Array.from(final_set);

        for (var i in final_array) {
            // middle += final_set[i];
            middle += '<option value="' + final_array[i] + '">' + final_array[i] + "</option>";
        }
        combo_html += middle + "</select>";
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


    function load_data(self) {
        $.getJSON(base_url + get_sql_query(self.id), function(data) {
            // TODO Create dropdown options for querying
            get_features(data.features, self.id);

            // register select box onchange
            var combo_id = '#' + self.id + '_combo';
            $(combo_id).change(function() {
                filter_data(this)
            });

            var new_layers;
            if (data.features[0].geometry.type === 'Point') {
                new_layers = L.geoJSON(data, {
                    onEachFeature: function (row, layer) {
                        // console.log(row, layer);
                        layer.bindPopup(createPopup(row));
                    },
                    id: self.id,
                    pointToLayer: function (feature, latlng) {
                        var geojsonMarkerOptions = {
                            radius: 8,
                            fillColor: "#ff7800",
                            color: "#000",
                            weight: 1,
                            opacity: 1,
                            fillOpacity: 0.8
                        };
                        return L.circleMarker(latlng, geojsonMarkerOptions);
                    }
                });
            } else if (data.features[0].geometry.type === 'Polygon') {
                new_layers = L.geoJSON(data, {
                    onEachFeature: function (row, layer) {
                        // console.log(row, layer);
                        layer.bindPopup(createPopup(row));
                    },
                    id: self.id,
                    style: function (feature) {
                        if (feature.geometry.type === 'Point') {

                        } else if (feature.geometry.type === 'Polygon') {
                            switch (feature.properties.party) {
                                case 'Republican':
                                    return {color: "#ff0000"};
                                case 'Democrat':
                                    return {color: "#0000ff"};
                            }
                        }
                    }
                });
            }
            console.log(self.id);
            new_layers.addTo(map);
        });
    }


    // checkbox logic
    var base_url = 'https://spatterson8.carto.com/api/v2/sql?format=GeoJSON&q=';
    $("input:checkbox").change(function() {
        console.log('ID: ' + this.id);

        if ($(this).is(":checked")) {
            console.log($('#' + this.id).is(':checked'));
            var self = this;
            load_data(self);
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



    // filtering if select box queried
    function filter_data(select_box) {
        console.log('select:', select_box, select_box.value);
        // TODO make this function be a filter version of load_data()

        // $.getJSON(base_url + get_sql_query(this.id), function(data) {
        //     // TODO Create dropdown options for querying
        //     get_features(data.features, self.id);
        //
        //     console.log("data:", data);
        //     var new_layers;
        //     if (data.features[0].geometry.type === 'Point') {
        //         new_layers = L.geoJSON(data, {
        //             onEachFeature: function (row, layer) {
        //                 // console.log(row, layer);
        //                 layer.bindPopup(createPopup(row));
        //             },
        //             id: self.id,
        //             pointToLayer: function (feature, latlng) {
        //                 var geojsonMarkerOptions = {
        //                     radius: 8,
        //                     fillColor: "#ff7800",
        //                     color: "#000",
        //                     weight: 1,
        //                     opacity: 1,
        //                     fillOpacity: 0.8
        //                 };
        //                 return L.circleMarker(latlng, geojsonMarkerOptions);
        //             }
        //         });
        //     } else if (data.features[0].geometry.type === 'Polygon') {
        //         var new_layers = L.geoJSON(data, {
        //             onEachFeature: function (row, layer) {
        //                 // console.log(row, layer);
        //                 layer.bindPopup(createPopup(row));
        //             },
        //             id: self.id,
        //             style: function (feature) {
        //                 console.log("feature:", feature);
        //                 if (feature.geometry.type === 'Point') {
        //
        //                 } else if (feature.geometry.type === 'Polygon') {
        //                     switch (feature.properties.party) {
        //                         case 'Republican':
        //                             return {color: "#ff0000"};
        //                         case 'Democrat':
        //                             return {color: "#0000ff"};
        //                     }
        //                 }
        //             }
        //         });
        //     }
        //     console.log(self.id);
        //     new_layers.addTo(map);
        // });
    }


    $(document).ready(initialize());
})();