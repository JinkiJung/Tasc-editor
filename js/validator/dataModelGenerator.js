function expand(schema){

}
function generate(objectName, schema){
    const properties = schema.properties;
    console.log(schema.definitions);
    Object.keys(schema.definitions).forEach(key => {
        if(key === objectName){

            console.log(schema.definitions[key].properties);
            jsonObject = {};
            Object.keys(schema.definitions[key].properties).forEach(subkey => {
                if(schema.definitions[key].properties[subkey].type === "string")
                    jsonObject[subkey] = "";
                else if(schema.definitions[key].properties[subkey].type === "boolean")
                    jsonObject[subkey] = false;
                else if(schema.definitions[key].properties[subkey].type === "integer")
                    jsonObject[subkey] = 0;
                else if(schema.definitions[key].properties[subkey].type === "number")
                    jsonObject[subkey] = 0;
                else if(schema.definitions[key].properties[subkey].type === "object")
                    jsonObject[subkey] = {};
            })
            console.log(jsonObject);
        }
    })
    Object.keys(schema).forEach(key => {
        console.log(key);
        /*
        if (this._validateSubSchema[key]) {
            errors.push(...this._validateSubSchema[key].call(this, schema, value, path))
        }

         */
    })
    return true;
}
function readTextFile(file, callback) {
    var rawFile = new XMLHttpRequest();
    rawFile.overrideMimeType("application/json");
    rawFile.open("GET", file, true);
    rawFile.onreadystatechange = function() {
        if (rawFile.readyState === 4 && rawFile.status == "200") {
            callback(rawFile.responseText);
        }
    }
    rawFile.send(null);
}