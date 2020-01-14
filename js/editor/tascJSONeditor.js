document.getElementById('file-input').addEventListener('change', getFile);

function getFile(event) {
    const input = event.target
    if ('files' in input && input.files.length > 0) {
        placeFileContent(
            document.getElementById('content-target'),
            input.files[0])
    }
}

function placeFileContent(target, file) {
    readFileContent(file).then(content => {
        convertJSONToTasc(JSON.parse(content)); //target.value = content
    }).catch(error => console.log(error));
}
function readFileContent(file) {
    const reader = new FileReader()
    return new Promise((resolve, reject) => {
        reader.onload = event => resolve(event.target.result)
    reader.onerror = error => reject(error)
    reader.readAsText(file)
})
}

function convertJSONToTasc(json){
    var linkedPair = [];
    if(json.scenario!==undefined){
        for(var i=0; i<json.scenario.length ; i++){
            var elem = json.scenario[i];
            if(document.getElementById(elem.id)===null){
                var data = new Tasc(elem.id, elem.title, elem.given, elem.when, elem.who, elem.do, elem.until);
                registerItem(createTascItem(data, 400 + xOffset,200 + yOffset,180,250));
                if(elem.next)
                    linkedPair.push({from:elem.id, to:elem.next});
            }
        }
    }
    makeLink(linkedPair);
    if(json.terminuses!==undefined){
        for(var i=0; i<json.terminuses.length ; i++){
            var elem = json.terminuses[i];
            if(document.getElementById(elem.id)===null) {
                registerItem(createFieldItem(ID(), elem.name, 0 + xOffset, 0 + yOffset, 160, itemHeight, 'terminus'));
            }
        }
    }
    if(json.actions!==undefined){
        for(var i=0; i<json.actions.length ; i++){
            var elem = json.actions[i];
            if(document.getElementById(elem.id)===null) {
                registerItem(createFieldItem(ID(), elem.name, 0 + xOffset, 0 + yOffset, 160, itemHeight, 'action'));
            }
        }
    }
    if(json.conditions!==undefined){
        for(var i=0; i<json.conditions.length ; i++){
            var elem = json.conditions[i];
            if(document.getElementById(elem.id)===null) {
                registerItem(createFieldItem(ID(), elem.name, 0 + xOffset, 0 + yOffset, 160, itemHeight, 'condition'));
            }
        }
    }
}

function makeLink(linkList){

}