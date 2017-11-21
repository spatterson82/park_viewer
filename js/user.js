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

        var treeicon = L.icon({
            iconUrl: 'img/green-circle.png',
            iconSize:     [20, 20], // size of the icon
            iconAnchor:   [7, 5], // point of the icon which will correspond to marker's location
            popupAnchor:  [5, -5], // point from which the popup should open relative to the iconAnchor
            id: 'tree_location'
        });

        var tree_location;
        map.on('click', function(location) {
            if (editing) {
                tree_location = new L.marker(location.latlng, {
                    icon: treeicon,
                    draggable: true,
                    opacity: 1
                });
                var popup = '<b>Species:</b> ' + $('#species').val() + '<br><br><a id="popup_button">Remove</a>';
                tree_location.bindPopup(popup);
                tree_location.addTo(map);

                tree_location.on('popupopen', remove_user_point);

                editing = false;
                L.DomUtil.removeClass(map._container,'crosshair-cursor-enabled');
            }
        });
    }
});

function remove_user_point() {
    var marker = this;
    $("#popup_button:visible").click(function () {
        map.removeLayer(marker);
    });
}