var api_key = '0bc661c1ea32153881fc4a135ca4ccb8c18bae18';


// function to authenticate
// https://{spatterson8}.carto.com/api/v2/sql?q={SQL statement}&api_key={api_key}
function get_sql_query(layer) {

    return 'SELECT * FROM ' + layer;
}

// function to lead selected layer
function load_selected_layer() {
    var base_url = 'https://{spatterson8}.carto.com/api/v2/sql?q=';
    $.getJSON(base_url + get_sql_query('morse_mountain_pts'), function(data) {
       $.each(data.rows, function(key, val) {
          console.log(key + ": " + val);
       });
    });
}

// function to remove any unselected layers


