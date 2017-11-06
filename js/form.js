$("input:checkbox").change(function() {
    console.log('ID: ' + this.id);
    if ($(this).is(":checked")) {
        console.log($('#' + this.id).is(':checked'));
    } else {
        console.log($('#' + this.id).is(':checked'));
    }
});