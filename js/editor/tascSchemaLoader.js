var tascSchemaJson = {};
$(document).ready(function() {
    // load paper mining json schema file
    $.ajax({
        type: "GET",
        url: "../json/schema/tasc-schema.json",
        dataType: "text",
        success: function (schemaData) {
            tascSchemaJson = JSON.parse(schemaData);
            console.log(tascSchemaJson);
        }
    });
});