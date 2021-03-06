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
        clear();
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

function prepareMakingLink(elem, linkedPair){
    if(elem.next){
        for(var t=0; t<elem.next.length; t++){
            linkedPair.push({from:elem.id, to:elem.next[t]});
        }
    }
}

function convertJSONToTasc(json){
    var linkedPair = [];
    if(json.scenario!==undefined){
        for(var i=0; i<json.scenario.length ; i++){
            var elem = json.scenario[i];
            if(elem.id ==='start' || elem.id ==='end'){
                prepareMakingLink(elem, linkedPair);
            }
            else if(document.getElementById(elem.id)===null){
                addNewItemWithObject(elem, testIDP,'tasc');
                prepareMakingLink(elem, linkedPair);
            }
        }
    }
    makeLink(linkedPair);
    if(json.terminuses!==undefined){
        for(var i=0; i<json.terminuses.length ; i++){
            var elem = new Terminus(json.terminuses[i].id, json.terminuses[i].name, json.terminuses[i].location, json.terminuses[i].role);
            if(document.getElementById(elem.id)===null) {
                addNewItemWithObject(elem, testIDP,'terminus');
            }
        }
    }
    if(json.actions!==undefined){
        for(var i=0; i<json.actions.length ; i++){
            var elem = json.actions[i];
            if(document.getElementById(elem.id)===null) {
                addNewItemWithObject(elem, testIDP,'action');
            }
        }
    }
    if(json.conditions!==undefined){
        for(var i=0; i<json.conditions.length ; i++){
            var elem = json.conditions[i];
            if(document.getElementById(elem.id)===null) {
                addNewItemWithObject(elem, testIDP,'condition');
            }
        }
    }
    if(json.instructions!==undefined){
        for(var i=0; i<json.instructions.length ; i++){
            var elem = json.instructions[i];
            if(document.getElementById(elem.id)===null) {
                addNewItemWithObject(elem, testIDP,'instruction');
            }
        }
    }
}

function generateLinkPath(start_id, end_id){
    var tempPath = document.createElementNS( svgURI, 'path');
    tempPath.setAttributeNS(null, 'class', 'path');
    tempPath.setAttributeNS(null, 'startID', start_id);
    tempPath.setAttributeNS(null, 'endID', end_id);
    return tempPath;
}

function makeLink(linkListGroup){
    if(linkListGroup === undefined)
    {
        console.log("ERROR: there is no link list.");
        return ;
    }
    var svg = document.getElementById("editorPane");
    for(var g=0 ; g<linkListGroup.length ; g++){
        var linkItem = linkListGroup[g];
        if(linkItem.from === undefined || document.getElementById(linkItem.from) === undefined
            || linkItem.to === undefined || document.getElementById(linkItem.to) === undefined){
            console.log("ERROR: there were no from and to information");
            return ;
        }
        var fromItem = document.getElementById(linkItem.from + "::right");
        var toItem = document.getElementById(linkItem.to + "::left");
        if(fromItem === undefined || fromItem === null){
            console.log("Warning: " + linkItem.from +" is missing!");
            continue;
        }
        if(toItem === undefined || toItem === null){
            console.log("Warning: " + linkItem.to +" is missing!");
            continue;
        }
        var tempLinkPath = generateLinkPath(fromItem.id, toItem.id);
        svg.appendChild(tempLinkPath);

        activateLinkedItemStyle(fromItem);
        activateLinkedItemStyle(toItem);
        //evt.target.setAttributeNS(null, 'pathIndex', paths.length);
        var tempLinkHead = createLinkHead("",parseFloat(toItem.getAttribute('x')) + linkItemSizeOffset,
            parseFloat(toItem.getAttribute('y')) + linkItemSizeOffset);
        svg.appendChild(tempLinkHead);

        pathHeads.push(tempLinkHead);
        paths.push(tempLinkPath);
        updatePath(tempLinkPath, parseFloat(fromItem.getAttribute('x')) + linkItemSizeOffset,
            parseFloat(fromItem.getAttribute('y')) + linkItemSizeOffset,
            parseFloat(toItem.getAttribute('x')) + linkItemSizeOffset,
            parseFloat(toItem.getAttribute('y')) + linkItemSizeOffset);
    }
}

function exportTascToJSON(id, name, description, tascs){
    if(!validate(tascs))
        return undefined;
    return new Scenario(id, name, description, terminusData, actionData, conditionData, instructionData, outputTascData);
}