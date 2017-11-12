$('#add_tree').click(function() {
    L.DomUtil.addClass(map._container,'crosshair-cursor-enabled');
    closeNav();
    // toggle attribute to control map clicking
    editing = true;
    console.log('editing:', editing);

    map.on('click', function(location) {
        if (editing) {
            var tree_location = new L.marker(location.latlng).addTo(map);
            editing = false;
            L.DomUtil.removeClass(map._container,'crosshair-cursor-enabled');
        }
    });
});