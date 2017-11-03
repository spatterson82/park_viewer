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