var tascSchemaJson = {};
$(document).ready(function() {
    $.ajax({
        type: "GET",
        url: "../json/schema/tasc-schema.json",
        dataType: "text",
        success: function (schemaData) {
            tascSchemaJson = JSON.parse(schemaData);
            //console.log(generate("tasc", tascSchemaJson["definitions"]));
        }
    });
});