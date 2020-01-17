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

function addNewItem(type, id, title){
    if(id===undefined)
        id = ID();
    if(title===undefined)
        title = getDummyName(type);

    updateHistory(document.getElementById('editorPane'));
    var pos;
    if(type==='tasc'){
        pos = avoidOverlap(document.getElementsByClassName('tasc-item-pane'),300, document.body.clientWidth, tascItemWidth, tascItemHeight);
        if(pos!==undefined)
            registerItem(createTascItem(new Tasc(id, title),pos[0]+ xOffset,pos[1],tascItemWidth,tascItemHeight, title));
    }
    else{
        pos = avoidOverlap(document.getElementsByClassName('field-item-pane'),0, document.body.clientWidth, fieldItemWidth, fieldItemHeight);
        if(pos!==undefined)
            registerItem(createFieldItem(new DummyField(type, id, title), pos[0] + xOffset, pos[1] + yOffset, fieldItemWidth, fieldItemHeight, type));
    }
}

function addNewItemWithObject(dataObject){
    updateHistory(document.getElementById('editorPane'));
    var pos;
    if(dataObject instanceof Tasc){
        pos = avoidOverlap(document.getElementsByClassName('tasc-item-pane'),300, document.body.clientWidth, tascItemWidth, tascItemHeight);
        if(pos!==undefined)
            registerItem(createTascItem(dataObject,pos[0]+ xOffset,pos[1],tascItemWidth,tascItemHeight, dataObject.name));
    }
    else{
        pos = avoidOverlap(document.getElementsByClassName('field-item-pane'),0, document.body.clientWidth, fieldItemWidth, fieldItemHeight);
        if(pos!==undefined)
            registerItem(createFieldItem(dataObject, pos[0] + xOffset, pos[1] + yOffset, fieldItemWidth, fieldItemHeight, dataObject.constructor.name.toLowerCase()));
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
        return 'until';
}

function openForm() {
    document.getElementById("myForm").style.display = "block";
}

function closeForm() {
    document.getElementById("myForm").style.display = "none";
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
    //console.log(JSON.stringify(tascData));
    var scenario = { id: ID(), name:"testing", terminuses: terminusData, actions: actionData, conditions: conditionData, scenario:tascData };
    console.log(JSON.stringify(scenario));
    //download(JSON.stringify(tascData), "tasc", "json");
}

function loadScenario(){
    document.getElementById('file-input').click();
}

function removeAllItems(){
    var node = document.getElementById('editorPane');
    while (node.firstChild) {
        node.removeChild(node.firstChild);
    }
    clearDatabase();
    initialize();
}

function appendToDatabase(object, item){
    if(object.constructor.name ==='Tasc'){
        tascData.push(object);
        tascItems.push(item);
    }
    else{
        if(object.constructor.name === 'Terminus')
            terminusData.push(object);
        else if(object.constructor.name === 'Action')
            actionData.push(object);
        else if(object.constructor.name === 'Condition')
            conditionData.push(object);
        fieldItems.push(item);
    }
}

function updateData(tascObject, fieldName, fieldObject){
    tascObject[fieldName] = fieldObject;
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
}

function updateValue(focusedElement, selectedElement){
    var tascObjectindex = focusedElement.parentNode.getAttribute('data-array-index');
    var fieldDatum = getFieldDatum(selectedElement);
    var fieldContext = orderToContext(focusedElement.getAttribute('order'));

    if(tascObjectindex && fieldDatum){
        updateData(tascData[tascObjectindex], fieldContext, fieldDatum);
        setFieldValue(focusedElement, fieldDatum);
    }
}

function updateNextOfData(targetID, nextID){
    for(var i=0; i<tascData.length ; i++){
        if(tascData[i].id === targetID){
            if(tascData[i].next=== undefined)
                tascData[i].next = [];
            tascData[i].next.push(nextID);
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

function removeInterrelationship(one, another){
    removeRelationship(document.getElementById(one), another);
    removeRelationship(document.getElementById(another), one);
    removeNextLink(document.getElementById(one), document.getElementById(another));
}

function setFieldValue(item, object){
    var order = item.getAttribute('order');
    for(var i=0; i<item.parentNode.children.length ; i++){
        if(item.parentNode.children[i].tagName ==='text' && item.parentNode.children[i].getAttributeNS(null, 'order') === order){
            item.parentNode.children[i].classList.add('field-value-confirmed');
            item.parentNode.children[i].innerHTML = object.name;
        }
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

function deletePath(path){
    // removing style of link boxes
    var one = path.getAttributeNS(null,'startID');
    var another = path.getAttributeNS(null,'endID')
    removeInterrelationship(one.split('::')[0], another.split('::')[0]);
    deactivateLinkedItemStyle(document.getElementById(one));
    deactivateLinkedItemStyle(document.getElementById(another));
    document.getElementById('editorPane').removeChild(path);
    var pathIndex = paths.indexOf(path);

    document.getElementById('editorPane').removeChild(pathHeads[pathIndex]);
    paths.splice( pathIndex, 1 );
    pathHeads.splice( pathIndex, 1 );
    path = null;
}

function getFieldData(item){
    for(var i=0; i<item.children.length ; i++){
        if(item.children[i].classList.contains("terminus-item"))
            return terminusData;
        else if(item.children[i].classList.contains("action-item"))
            return actionData;
        else if(item.children[i].classList.contains("condition-item"))
            return conditionData;
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

function removeNextLink(from, to){
    var fromIndex = from.getAttribute('data-array-index');
    var toIndex = to.getAttribute('data-array-index');
    if(fromIndex && toIndex){
        var toID = tascData[toIndex].id;
        tascData[fromIndex].next.splice( tascData[fromIndex].next.indexOf(toID), 1 );
    }
}

function removeRelationship(element, id_of_another){
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

function updateHistory(svg) {
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
    removeAllItems();
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