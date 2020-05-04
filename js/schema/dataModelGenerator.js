function generate(objectName, schema){
    var jsonObject = {};
    Object.keys(schema).forEach(key => {
        if(key === objectName){
            Object.keys(schema[key].properties).forEach(subkey => {
                if(schema[key].properties[subkey].type === "string")
                    jsonObject[subkey] = "";
                else if(schema[key].properties[subkey].type === "boolean")
                    jsonObject[subkey] = false;
                else if(schema[key].properties[subkey].type === "integer")
                    jsonObject[subkey] = 0;
                else if(schema[key].properties[subkey].type === "number")
                    jsonObject[subkey] = 0;
                else if(schema[key].properties[subkey].type === "object")
                    jsonObject[subkey] = {};
                else if(schema[key].properties[subkey].type === "array")
                    jsonObject[subkey] = [];
                else if(schema[key].properties[subkey]["$ref"]){
                    let variable = schema[key].properties[subkey]["$ref"].split("/");
                    jsonObject[subkey] = generate(variable[variable.length-1], schema);
                }
            });
        }
    });
    /*
    Object.keys(schema).forEach(key => {
        console.log(key);
        if (this._validateSubSchema[key]) {
            errors.push(...this._validateSubSchema[key].call(this, schema, value, path))
        }
    })

     */
    return jsonObject;
}

function readTextFile(file, callback) {
    var rawFile = new XMLHttpRequest();
    rawFile.overrideMimeType("application/json");
    rawFile.open("GET", file, true);
    rawFile.onreadystatechange = function() {
        if (rawFile.readyState === 4 && rawFile.status === "200") {
            callback(rawFile.responseText);
        }
    }
    rawFile.send(null);
}