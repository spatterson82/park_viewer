$("#form").css({
    'position': "absolute",
    'left': ($(window).width() - $('#panel').outerWidth())/2 + 5,
    'top': ($(window).height() - $('#panel').outerHeight())/2 - 30,
    'height': '90%',
    'width': '85%',
    'background-color': '#f7e1b5'
});

$(window).resize(function() {
    console.log("resizing");
    $("#form").css({
        'position': "absolute",
        'left': ($(window).width() - $('#panel').outerWidth())/2 + 5,
        'top': ($(window).height() - $('#panel').outerHeight())/2 - 30,
        'height': '90%',
        'width': '85%',
        'background-color': '#f7e1b5'
    });
});
