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


    $(document).ready(initialize());
})();