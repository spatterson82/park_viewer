$('#add_tree').click(function() {
    var selected_species = $('#species').val();
    console.log("species: ", selected_species);

    if (($('#species').val() === undefined) || ($('#species').val() === null)) {
        alert('Choose a tree species!');
    } else {
        L.DomUtil.addClass(map._container,'crosshair-cursor-enabled');
        closeNav();

        // toggle attribute to control map clicking
        editing = true;
        console.log('editing:', editing);

        map.on('click', function(location) {
            if (editing) {
                var tree_location = new L.marker(location.latlng, {
                    draggable: true
                });
                tree_location.bindPopup($('#species').val());
                tree_location.addTo(map);

                editing = false;
                L.DomUtil.removeClass(map._container,'crosshair-cursor-enabled');
            }
        });
    }


});