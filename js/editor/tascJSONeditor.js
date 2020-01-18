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
            if(elem.id ==='start'){
                prepareMakingLink(elem, linkedPair);
            }
            else if(document.getElementById(elem.id)===null){
                var data = new Tasc(elem.id, elem.name, elem.given, elem.when, elem.who, elem.do, elem.until);
                addNewItemWithObject(data);
                prepareMakingLink(elem, linkedPair);
            }
        }
    }
    makeLink(linkedPair);
    if(json.terminuses!==undefined){
        for(var i=0; i<json.terminuses.length ; i++){
            var elem = json.terminuses[i];
            if(document.getElementById(elem.id)===null) {
                addNewItem('terminus',elem.id,elem.name);
                //registerItem(new Terminus(ID(), elem.name), 0 + xOffset, 0 + yOffset, fieldItemWidth, fieldItemHeight, 'terminus');
            }
        }
    }
    if(json.actions!==undefined){
        for(var i=0; i<json.actions.length ; i++){
            var elem = json.actions[i];
            if(document.getElementById(elem.id)===null) {
                addNewItem('action',elem.id,elem.name);
                //registerItem(new Action(ID(), elem.name), 0 + xOffset, 0 + yOffset, fieldItemWidth, fieldItemHeight, 'action');
            }
        }
    }
    if(json.conditions!==undefined){
        for(var i=0; i<json.conditions.length ; i++){
            var elem = json.conditions[i];
            if(document.getElementById(elem.id)===null) {
                addNewItem('condition',elem.id,elem.name);
                //registerItem(new Condition(ID(), elem.name), 0 + xOffset, 0 + yOffset, fieldItemWidth, fieldItemHeight, 'condition');
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
            console.log("ERROR: there were no from and to infomation");
            return ;
        }
        var fromItem = document.getElementById(linkItem.from + "::right");
        var toItem = document.getElementById(linkItem.to + "::left");
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

function updateTasc(item, field){
    //if(field.)
}