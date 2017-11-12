/**
 * Styling of square border window by window size
 */
$("#form").css({
    'position': "absolute",
    'left': ($(window).width() - $('#panel').outerWidth())/5,
    'top': ($(window).height() - $('#panel').outerHeight())/2 - 30,
    'height': '90%',
    'width': 'calc(100% - ' + ($(window).width() - $('#panel').outerWidth())/4,
});

$(window).resize(function() {
    console.log("resizing");
    $("#form").css({
        'position': "absolute",
        'left': ($(window).width() - $('#panel').outerWidth())/5,
        'top': ($(window).height() - $('#panel').outerHeight())/2 - 30,
        'height': '90%',
        'width': 'calc(100% - ' + ($(window).width() - $('#panel').outerWidth())/4,
    });
});
