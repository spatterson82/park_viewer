/**
 * Function to reopen the layer table of contents
 */
function openNav() {
    console.log("clicked open");
    editing = false;
    console.log('editing:', editing);
    document.getElementById("panel_border").style.width = "350px";
    $("#map_border").css('background-color', '#999999');
    $("#panel_title").html('Morse Mountain');
    $("#map_title").html('');
}


/**
 * Function to hide the layer table of contents
 */
function closeNav() {
    console.log("clicked close");
    document.getElementById("panel_border").style.width = "0";
    $("#map_border").css('background-color', 'white');
    $("#panel_title").html('');
    $("#map_title").html('Morse Mountain');
}



(function() {
    'use strict';


    /**
     * Main function to instantiate a map object
     */
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


    /**
     * JSON for colors
     */
    var colorCodes = {
        'addresses' : '#7574ff',
        'land_type' : null,
        'morse_mountain_pts' : '#ff7800',
        'trs' : null,
        'parcels' : null
    }

    // ##################################################
    // form actions
    // ##################################################
    var api_key = '0bc661c1ea32153881fc4a135ca4ccb8c18bae18';


    /**
     * Function for generating an SQL statement
     * that selects all features for a layer
     * @param layer CartoDB layer name
     * @returns {string} SQL Query statement
     */
    function get_sql_query(layer) {
        return 'SELECT * FROM ' + layer + '&api_key=' + api_key;
    }


    /**
     * Function to create a simple popup
     * @param feature Current feature
     * @param id Element ID for selected layer
     * @returns {L.popup} Popup object for the feature
     */
    function createPopup(feature, id) {
        // TODO make popup unique by layer and show everything

        var prop = feature.properties;
        if (id === 'addresses') {
            return L.popup().setContent('<p style="font-size:12px"><b>Address: </b>' + prop.address + '</p>');
        } else {
            return L.popup().setContent('<p style="font-size:12px"><b>Type: </b>' + prop.type + '</p>');
        }
    }


    /**
     * Function to build the HTML data for the current
     * layer's select box
     * @param final_set Set of unique features to populate the select box
     * @param id Element ID for the current layer
     */
    function build_query_combo(final_set, id) {
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


    /**
     * Function to build the select box for the
     * currently checked layer
     * @param features All current features for the selected layer
     * @param id Element ID for the selected layer
     */
    function get_features(features, id) {
        // console.log("new_layers: ", features);
        var query_set = new Set();
        features.forEach(function(feature) {
            if (id === 'addresses') {
                query_set.add(feature.properties.address);
            } else {
                query_set.add(feature.properties.type);
            }
        });
        build_query_combo(query_set, id);
    }


    /**
     * Main function to load data if a layer's
     * checkbox is checked
     * @param self Current checkbox object to pass to AJAX
     */
    function load_data(self) {
        $.getJSON(base_url + get_sql_query(self.id), function(data) {
            // TODO Create dropdown options for querying
            get_features(data.features, self.id);

            // register select box onchange
            var combo_id = '#' + self.id + '_combo';
            $(combo_id).change(function() {
                filter_data(this, self.id);
            });

            var new_layers;
            var data_type = data.features[0].geometry.type;
            if (data_type === 'Point') {
                new_layers = L.geoJSON(data, {
                    onEachFeature: function (row, layer) {
                        layer.bindPopup(createPopup(row, self.id), {className: 'popup_data'});
                    },
                    id: self.id,
                    pointToLayer: function (feature, latlng) {
                        var geojsonMarkerOptions = {
                            radius: 8,
                            fillColor: colorCodes[self.id],
                            color: "#000",
                            weight: 1,
                            opacity: 1,
                            fillOpacity: 0.8
                        };
                        return L.circleMarker(latlng, geojsonMarkerOptions);
                    }
                });
            } else if (data_type === 'Polygon' || data_type === 'MultiPolygon') {
                new_layers = L.geoJSON(data, {
                    onEachFeature: function (row, layer) {
                        console.log(row.properties);
                        layer.bindPopup(createPopup(row, self.id));
                    },
                    id: self.id,
                    style: function (feature) {
                        switch (self.id) {
                            case 'parcels':
                                return {color: "#ff6689"};
                            case 'trs':
                                return {color: "#faffa0"};
                            case 'land_type':
                                return {color: "#38ff87"};
                        }
                    }
                });
            }
            console.log(self.id);
            new_layers.addTo(map);
        });
    }


    /**
     * Layer checkbox events and logic
     */
    var base_url = 'https://spatterson8.carto.com/api/v2/sql?format=GeoJSON&q=';
    $("input:checkbox").change(function() {
        console.log('ID: ' + this.id);

        if ($(this).is(":checked")) {
            console.log($('#' + this.id).is(':checked'));
            var self = this;
            load_data(self);
        } else {
            console.log($('#' + this.id).is(':checked'));
            remove_data(this.id);

            // remove combo boxes
            $('#' + this.id + '_combo').remove();

        }
    });


    /**
     * Remove the layer associated with the
     * checkbox that was unchecked
     */
    function remove_data(id) {
        var layer_list = map._layers;
        for (var layer in layer_list) {
            if (layer_list[layer].options.id === id) {
                map.removeLayer(layer_list[layer]);
            }
        }
    }


    /**
     * Same as load_data() but filters based on
     * the select box value for the layer checked
     * @param select_box Current layer's select box object
     * @param id Element ID for the current layer that is checked
     */
    function filter_data(select_box, id) {
        // remove all current data for the selected layer
        remove_data(id);

        $.getJSON(base_url + get_sql_query(id), function(data) {
            var data_type = data.features[0].geometry.type;
            var new_layers;
            if (data_type === 'Point') {
                new_layers = L.geoJSON(data, {
                    onEachFeature: function (row, layer) {
                        layer.bindPopup(createPopup(row, id), {className: 'popup_data'});
                    },
                    id: id,
                    pointToLayer: function (feature, latlng) {
                        var geojsonMarkerOptions = {
                            radius: 8,
                            fillColor: colorCodes[id],
                            color: "#000",
                            weight: 1,
                            opacity: 1,
                            fillOpacity: 0.8
                        };
                        return L.circleMarker(latlng, geojsonMarkerOptions);
                    },
                    filter: function(feature, layer) {
                        if (id === 'addresses') {
                            return feature.properties.address === select_box.value;
                        } else {
                            return feature.properties.type === select_box.value;
                        }
                    }
                });
            } else if (data_type === 'Polygon' || data_type === 'MultiPolygon') {
                new_layers = L.geoJSON(data, {
                    onEachFeature: function (row, layer) {
                        layer.bindPopup(createPopup(row, id));
                    },
                    id: id,
                    style: function (feature) {
                        switch (id) {
                            case 'parcels':
                                return {color: "#ff6689"};
                            case 'trs':
                                return {color: "#faffa0"};
                            case 'land_type':
                                return {color: "#38ff87"};
                        }
                    },
                    filter: function(feature, layer) {
                        if (id === 'trs') {
                            if (select_box.value === 'null') {
                                return feature.properties.type === null;
                            } else {
                                return feature.properties.type === select_box.value;
                            }

                        } else {
                            return feature.properties.type === select_box.value;
                        }
                    }
                });
            }
            console.log(id);
            new_layers.addTo(map);
        });
    }


    $(document).ready(initialize());
})();