var ID = function () {
    // Math.random should be unique because of its seeding algorithm.
    // Convert it to base 36 (numbers + letters), and grab the first 9 characters
    // after the decimal.
    return '_' + Math.random().toString(36).substr(2, 9);
};

function registerItem(item){
    document.getElementById('editorPane').appendChild(item);
}

function getDummyName(type){
    return type+' '+(document.getElementsByClassName(type + '-item').length+1);
}

function addNewItem(type, id, name){
    if(id===undefined)
        id = getID(type);
    if(name===undefined && type !== 'tasc')
        name = getDummyName(type);

    updateHistory(document.getElementById('editorPane'));
    var pos;
    if(type==='tasc'){
        pos = avoidOverlap(document.getElementsByClassName('tasc-item-pane'),300, document.body.clientWidth, tascItemWidth, tascItemHeight);
        if(pos!==undefined)
            registerItem(createTascItem(new Tasc(id, name),pos[0]+ xOffset,pos[1],tascItemWidth,tascItemHeight, name));
    }
    else{
        pos = avoidOverlap(document.getElementsByClassName('field-item-pane'),0, document.body.clientWidth, fieldItemWidth, fieldItemHeight);
        if(pos!==undefined)
            registerItem(createFieldItem(new DummyField(type, id, name), pos[0] + xOffset, pos[1] + yOffset, fieldItemWidth, fieldItemHeight, type));
    }
}

function addNewItemWithObject(dataObject, identityProvider, type){
    if(dataObject.id===undefined)
        dataObject.id = getID(type, identityProvider, dataObject.name);
    updateHistory(document.getElementById('editorPane'));
    var pos;
    if(type === 'tasc'){
        pos = avoidOverlap(document.getElementsByClassName('tasc-item-pane'),300, document.body.clientWidth, tascItemWidth, tascItemHeight);
        if(pos!==undefined)
            registerItem(createTascItem(dataObject,pos[0]+ xOffset,pos[1],tascItemWidth,tascItemHeight, dataObject.name));
    }
    else{
        pos = avoidOverlap(document.getElementsByClassName('field-item-pane'),0, document.body.clientWidth, fieldItemWidth, fieldItemHeight);
        if(pos!==undefined)
            registerItem(createFieldItem(dataObject, pos[0] + xOffset, pos[1] + yOffset, fieldItemWidth, fieldItemHeight, type));
    }
}

function orderToContext(order){
    if(order === '0')
        return 'given';
    else if(order === '1')
        return 'when';
    else if(order === '2')
        return 'who';
    else if(order === '3')
        return 'do';
    else if(order === '4')
        return 'follow';
    else if(order === '5')
        return 'before';
}

function download(data, filename, type) {
    var file = new Blob([data], {type: type});
    if (window.navigator.msSaveOrOpenBlob) // IE10+
        window.navigator.msSaveOrOpenBlob(file, filename);
    else { // Others
        var a = document.createElement("a"),
            url = URL.createObjectURL(file);
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        setTimeout(function() {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        }, 0);
    }
}

function download(data, filename, type) {
    var file = new Blob([data], {type: type});
    if (window.navigator.msSaveOrOpenBlob) // IE10+
        window.navigator.msSaveOrOpenBlob(file, filename);
    else { // Others
        var a = document.createElement("a"),
            url = URL.createObjectURL(file);
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        setTimeout(function() {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        }, 0);
    }
}

function saveScenario(){
    var scenario = exportTascToJSON(getID('scenario'), 'test', 'This is test',outputTascData);
    //var scenario = new Scenario(getID('scenario'), 'test', 'This is test', terminusData, actionData, conditionData, instructionData, tascData);//{ id: ID(), name:"testing", terminuses: terminusData, actions: actionData, conditions: conditionData, instructions: instructionData, scenario:tascData };
    download(JSON.stringify(scenario), scenario.name, 'application/json');
}

function loadScenario(){
    document.getElementById('file-input').click();
}

function clear(){
    var node = document.getElementById('editorPane');
    while (node.firstChild) {
        node.removeChild(node.firstChild);
    }
    clearDatabase();
    initialize();
}

function appendToDatabase(object, item, type){
    if(type ==='tasc'){
        tascData.push(object);
        tascItems.push(item);
    }
    else{
        if(type === 'terminus')
            terminusData.push(object);
        else if(type === 'action')
            actionData.push(object);
        else if(type === 'condition')
            conditionData.push(object);
        else if(type === 'instruction')
            instructionData.push(object);
        fieldItems.push(item);
    }
}

function clearDatabase(){
    paths = [];
    pathHeads = [];
    tascItems = [];
    fieldItems = [];
    tascData = [{id:"start"},{id:"end"}];
    actionData = [];
    terminusData = [];
    conditionData = [];
    instructionData = [];
    outputTascData = [{id:"start"},{id:"end"}];
}

if (typeof JSON.clone !== "function") {
    JSON.clone = function(obj) {
        return JSON.parse(JSON.stringify(obj));
    };
}

function assignValue(focusedElement, selectedElement){
    var tascObjectindex = focusedElement.parentNode.getAttribute('data-array-index');
    var fieldDatum = getFieldDatum(selectedElement);
    var fieldContext = orderToContext(focusedElement.getAttribute('order'));

    if(tascObjectindex && fieldDatum){
        updateOutput(tascData[tascObjectindex].id, fieldContext, fieldDatum);
        setFieldValue(focusedElement, fieldDatum, selectedElement.getAttribute('data-array-index'));
    }
}

function updateNextOfData(targetID, nextID){
    registerOutput(targetID);
    registerOutput(nextID);
    for(var i=0; i<outputTascData.length ; i++){
        if(outputTascData[i].id === targetID){
            if(outputTascData[i].next=== undefined)
                outputTascData[i].next = [];
            outputTascData[i].next.push(nextID);
        }
    }
}

function IsAlreadyIncluded(one, another){
    var links = document.getElementById(one).getAttributeNS(null,'data-links');
    if(links ===null)
        links = [];
    else
        links = links.split(',');

    if(links.includes(another)){
        return true;
    }
    else{
        links.push(another);
        document.getElementById(one).setAttributeNS(null,'data-links',links);
        return false;
    }
}

function hasChildOfClass(doc, className){
    for (var i = 0; i < doc.childNodes.length; i++) {
        if (doc.childNodes[i].classList.contains(className)) {
            return true;
        }
    }
    return false;
}

function hasClass(item, className){
    return item.classList.contains(className);
}

function getTypeOf(item, suffix){
    if(hasClass(item, 'tasc' + suffix))
        return 'tasc';
    else if(hasClass(item, 'condition' + suffix))
        return 'condition';
    else if(hasClass(item, 'terminus' + suffix))
        return 'terminus';
    else if(hasClass(item, 'action' + suffix))
        return 'action';
    else if(hasClass(item, 'instruction' + suffix))
        return 'instruction';
    else if(hasChildOfClass(item, 'tasc' + suffix))
        return 'tasc';
    else if(hasChildOfClass(item, 'condition' + suffix))
        return 'condition';
    else if(hasChildOfClass(item, 'terminus' + suffix))
        return 'terminus';
    else if(hasChildOfClass(item, 'action' + suffix))
        return 'action';
    else if(hasChildOfClass(item, 'instruction' + suffix))
        return 'instruction';
}

function getTypeOfItem(item){
    return getTypeOf(item, '-item');
}

function getTypeOfField(item){
    return getTypeOf(item, '-field');
}

function removeInterrelationship(one, another){
    removeRelationship(document.getElementById(one), another);
    removeRelationship(document.getElementById(another), one);
    removeNextLink(document.getElementById(one), document.getElementById(another));
}

function setFieldValue(item, objectWithValue, dataArrayIndex){
    var order = item.getAttribute('order');
    var type = getTypeOfField(item);
    var objectType = getTypeFromID(objectWithValue.id);
    var tascDatumID = item.parentNode.getAttribute('id');
    for(var i=0; i<item.parentNode.children.length ; i++){
        if(type === objectType){ // normal assign
            if(item.parentNode.children[i].classList.contains('field-value') && item.parentNode.children[i].getAttributeNS(null, 'order') === order){
                item.setAttribute('data-array-index',dataArrayIndex);
                item.parentNode.children[i].classList.add('field-value-confirmed');
                var fieldContext = orderToContext(order);
                updateOutput(tascDatumID, fieldContext, objectWithValue);
                setAsAdditionalField(item, objectWithValue['name']);
                showText(item.parentNode.children[i], tascDatumID, fieldContext);
                //item.parentNode.children[i].innerHTML = objectWithValue['name'];
            }
            else if(item.parentNode.children[i].classList.contains('field-description') && item.parentNode.children[i].getAttributeNS(null, 'order') === order){
                //item.parentNode.children[i].innerHTML = ""; // continue to visualize it
            }
        }
        else{ // additional field
            if(item.parentNode.children[i].classList.contains(objectType+'-field-additional') && item.parentNode.children[i].getAttributeNS(null, 'order') === order){
                updateOutput(tascDatumID, orderToContext(order) +':target', objectWithValue);
            }
            else if(item.parentNode.children[i].classList.contains('field-value') && item.parentNode.children[i].getAttributeNS(null, 'order') === order){
                showText(item.parentNode.children[i], tascDatumID, orderToContext(order));
            }
        }
    }
}

function getOutputDatum(id){
    return getDatumByDataAndID(outputTascData, id);
}

function getDatumByDataAndID(data, id){
    if(data && id){
        for(var i=0; i<data.length ; i++)
            if(data[i].id === id)
                return data[i];
    }
    return undefined;
}

function getDatumByID(objectID){
    return getDatumByDataAndID(getDataByType(getTypeFromID(objectID)),objectID);
}

function getIndexByID(dataArray, id){
    for(var i=0; i<dataArray.length ; i++){
        if(dataArray[i].id === id)
            return i;
    }
    return -1;
}

function doesArrayHaveID(dataArray, id){
    return getIndexByID(dataArray, id) >= 0;
}

function registerDatumToOutput(datum){
    outputTascData.push(JSON.clone(datum));
}

function assignFieldValue(object){
    if (object instanceof Object)
        return JSON.clone(object)
    else
        return object;
}

function updateSubfieldRecursively(datum, fieldContext, object){
    if(fieldContext.includes(':')){
        var keys = fieldContext.split(':');
        var firstKey = keys[0];
        keys.shift();
        if(datum[firstKey])
            updateSubfieldRecursively(datum[firstKey],keys.join(':'), object);
    }
    else{
        datum[fieldContext] = assignFieldValue(object);
    }
}

function updateOutputDatum(id, fieldContext, object){
    var datum = outputTascData[getIndexByID(outputTascData, id)];
    if(datum && fieldContext){
        if(object instanceof Object && getTypeFromFieldContext(fieldContext) === getTypeFromID(object.id)) // where they are same type
            datum[fieldContext] = assignFieldValue(object);
        else if(fieldContext.includes(':')){
            updateSubfieldRecursively(datum, fieldContext, object);

            // update the id as well
            //datum.id = getAugmentedID(datum.id, object.name);
            //console.log(datum.id);
        }
    }
}

function registerOutput(id){
    if(!doesArrayHaveID(outputTascData, id)){
        registerDatumToOutput(getDatumByDataAndID(tascData,id));
    }
}

function updateOutput(id, fieldContext, object){
    registerOutput(id);
    updateOutputDatum(id, fieldContext, object);
}

function getNameWithTarget(object){
    if(object && object.name){
        if(object.target && object.target instanceof Object)
            return getAugmentedName(object.name, object.target.name);
        else
            return getAugmentedName(object.name);
    }
    else
        return "";
}

function getAugmentedName(name, additionalName){
    if(name === undefined)
        return "";
    if(name.includes('[') && additionalName)
        return name.substr(0, name.indexOf('[')) +'[' + additionalName +']';
    else
        return name;
}

function showText(item, id, key){
    var outputDatum = getOutputDatum(id);
    item.innerHTML = getNameWithTarget(outputDatum[key]);
}

function setAsAdditionalField(item, value){
    if(value.includes('[')){
        var context = value.substring(value.indexOf('[')+1,value.indexOf(']'));
        item.classList.add(context.toLowerCase()+"-field-additional");
    }
}

function getSortedPathID(one, another){
    /*
    var values = [];
    values.push(one);
    values.push(another);
    values.sort(function (a, b) {
        return ('' + a.attr).localeCompare(b.attr);
    })
    return values.join('--');

     */
    // we don't need sorted path because of directional link
    return one + '--' + another;
}

function getItemID(linkID){
    if(typeof linkID === 'string')
        return linkID.split('::')[0];
    else
        return '';
}

function removePath(path){
    // removing style of link boxes
    var one = path.getAttributeNS(null,'startID');
    var another = path.getAttributeNS(null,'endID')
    removeInterrelationship(getItemID(one), getItemID(another));
    deactivateLinkedItemStyle(document.getElementById(one));
    deactivateLinkedItemStyle(document.getElementById(another));
    document.getElementById('editorPane').removeChild(path);
    var pathIndex = paths.indexOf(path);
    if(pathIndex>=0){
        document.getElementById('editorPane').removeChild(pathHeads[pathIndex]);
        paths.splice( pathIndex, 1 );
        pathHeads.splice( pathIndex, 1 );
        path = null;
        return true;
    }
    else
        return false;
}

function removeRelatedPaths(item){
    for(var i=0; i<paths.length ; i++){
        if((paths[i].getAttributeNS(null,'startID') && getItemID(paths[i].getAttributeNS(null,'startID')) === item.id)
        || (paths[i].getAttributeNS(null,'endID') && getItemID(paths[i].getAttributeNS(null,'endID')) === item.id))
            if(removePath(paths[i]))
                return removeRelatedPaths(item); // recursively remove path when there is update..
    }
}

function removeItem(item){
    removeRelatedPaths(item);
    cancelChosenItem();
    removeOutputTascData(item.id);
    document.getElementById('editorPane').removeChild(item);
}

function removeOutputTascData(id){
    for(var i=0; i<outputTascData.length ; i++){
        if(outputTascData[i].id === id)
            outputTascData.splice( i, 1 );
    }
}

function getFieldData(item){
    for(var i=0; i<item.children.length ; i++){
        if(item.children[i].classList.contains("tasc-item"))
            return tascData;
        else if(item.children[i].classList.contains("terminus-item"))
            return terminusData;
        else if(item.children[i].classList.contains("action-item"))
            return actionData;
        else if(item.children[i].classList.contains("condition-item"))
            return conditionData;
        else if(item.children[i].classList.contains("instruction-item"))
            return instructionData;
    }
    return undefined;
}

function getFieldDatum(item){
    var index = item.getAttribute('data-array-index');
    var fieldData = getFieldData(item);
    //if(item.classList.contains())
    if(index && fieldData)
        return fieldData[index];
    else
        return undefined;
}

function getDataByType(type){
    if(type==='tasc')
        return tascData;
    else if(type==='action')
        return actionData;
    else if(type==='condition')
        return conditionData;
    else if(type==='instruction')
        return instructionData;
    else if(type==='terminus')
        return terminusData;
}

function getDatum(type, index){
    return getDataByType(type)[index];
}

function removeNextLink(from, to){
    var fromIndex = from.getAttribute('data-array-index');
    var toIndex = to.getAttribute('data-array-index');
    if(fromIndex && toIndex){
        var toID = tascData[toIndex].id;
        tascData[fromIndex].next.splice( tascData[fromIndex].next.indexOf(toID), 1 );
    }
}

function removeRelationship(element, id_of_another){
    if(element){
        var links = element.getAttributeNS(null, 'data-links');
        if(links ===null)
            links = [];
        else
            links = links.split(',');
        if(links.includes(id_of_another)){
            links.splice( links.indexOf(id_of_another), 1 );
            element.setAttributeNS(null,'data-links',links);
        }
    }
}

function getTypeFromFieldContext(fieldContext){
    if(fieldContext === 'when' || fieldContext === 'before')
        return 'condition';
    else if(fieldContext === 'do')
        return 'action';
    else if(fieldContext === 'who' || fieldContext === 'target')
        return 'terminus';
    else if(fieldContext === 'follow')
        return 'instruction';
}

function updateHistory(svg) {
}

function removeChosenOne(chosenPath, chosenItem){
    if (chosenPath) {
        removePath(chosenPath);
    }else if(chosenItem){
        removeItem(chosenItem);
    }
}

/*
// future implementation - UNDO REDO
function importItemsFromOld(svg, old){
    console.log(old);
    for(var i=0; i<old.length; i++){
        console.log(old[i]);
        svg.appendChild(old[i]);
    }
}

function updateHistory(svg){
    var clone = [];
    for(var i=0; i<tascItems.length ; i++){
        clone.push(tascItems[i]);
    }
    for(var i=0; i<paths.length ; i++){
        clone.push(paths[i]);
    }
    for(var i=0; i<fieldItems.length ; i++){
        clone.push(fieldItems[i]);
    }

    svgHistory.push(clone);
}

function undo(){
    clear();
    var svg = document.getElementById('editorPane');
    importItemsFromOld(svg, svgHistory[svgHistory.length - svgHistoryIndex]);

    //console.log(svgHistory[svgHistory.length - svgHistoryIndex]);
    //svg = svgHistory[svgHistory.length - svgHistoryIndex];
    svgHistoryIndex+=1;
}

function redo(){

}
*/

function initialize(){
    registerItem(createSpecialTascItem("start",0+ xOffset,200 + yOffset,30,30));
    registerItem(createSpecialTascItem("end",1000+ xOffset,200 + yOffset,30,30));
}

initialize();