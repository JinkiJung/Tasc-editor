function createTascItem(tascObject, x, y, width, height) {
    var topOffset = 0;
    if(tascObject.name === undefined || tascObject.name.length == 0)
        topOffset = tascItemNamelessOffset;

    var group = document.createElementNS( svgURI, 'g');
    group.setAttribute('id',tascObject.id);
    group.setAttribute( 'x', x );
    group.setAttribute( 'y', y );
    group.setAttribute('class', 'draggable tasc-item');
    group.setAttribute('render-order',0);
    group.setAttribute('data-array-index',tascData.length);
    if(topOffset !== 0) // if it does not contain name
        group.classList.add('nameless');

    // background pane
    var pane = document.createElementNS( svgURI, 'rect');
    pane.setAttribute( 'offset-x', '0' );
    pane.setAttribute( 'offset-y', '0' );
    pane.setAttribute( 'x', x );
    pane.setAttribute( 'y', y );
    pane.setAttribute( 'width', width );
    pane.setAttribute( 'height', height + topOffset );
    pane.setAttribute('rx','10');
    pane.setAttribute('ry','10');
    pane.setAttribute('fill','#eee');
    pane.setAttribute('class','tasc-item-pane');
    group.appendChild( pane );

    // if it has no name
    if(topOffset ===0){
        // title description
        var titleText = document.createElementNS( svgURI, 'text');
        titleText.setAttribute( 'offset-x', width/2 );
        titleText.setAttribute( 'offset-y', '12' );
        titleText.setAttribute( 'x', x+ (width/2) );
        titleText.setAttribute( 'y', y + 12);
        titleText.setAttribute( 'width', width );
        titleText.setAttribute( 'height', 30 );
        titleText.setAttribute('class','unselectable title-description');
        titleText.setAttribute('dominant-baseline','middle');
        titleText.setAttribute('text-anchor','middle');
        titleText.innerHTML = tascObject.name;
        group.appendChild( titleText );
    }

    var givenValue = (tascObject.given === undefined) ? '' : tascObject.given.name;
    var whenValue =(tascObject.when === undefined) ? '' : tascObject.when.name;
    var whoValue = (tascObject.who === undefined) ? '' : tascObject.who.name;
    var doValue = (tascObject.do === undefined) ? '' : tascObject.do.name;
    var untilValue = (tascObject.until === undefined) ? '' : tascObject.until.name;
    var followingValue = (tascObject.following === undefined) ? '' : tascObject.following.name;
    createField(group,'context', x, y, width, 0, topOffset, 'given',givenValue);
    createField(group,'condition', x, y, width, 1, topOffset, 'when',whenValue);
    createField(group,'terminus', x, y, width, 2, topOffset, 'who',whoValue);
    createField(group,'action', x, y, width, 3, topOffset, 'do',doValue);
    createField(group,'condition', x, y, width, 4, topOffset, 'until',untilValue);
    createField(group,'instruction', x, y, width, 5, topOffset, 'following',followingValue);
    // Link items
    group.appendChild(createLinkItem(tascObject.id, x, y, width, height, 0, 'top'));
    group.appendChild(createLinkItem(tascObject.id, x, y, width, height, topOffset, 'bottom'));
    group.appendChild(createLinkItem(tascObject.id, x, y, width, height, topOffset, 'left'));
    group.appendChild(createLinkItem(tascObject.id, x, y, width, height, topOffset, 'right'));

    appendToDatabase(tascObject, group);
    return group;
}

function createSpecialTascItem(type, x, y, width, height) {
    var group = document.createElementNS( svgURI, 'g');
    group.setAttribute('id',type);
    group.setAttribute( 'x', x );
    group.setAttribute( 'y', y );
    group.setAttribute('class', 'draggable');
    group.setAttribute('render-order',0);

    // background pane
    var pane = document.createElementNS( svgURI, 'rect');
    pane.setAttribute( 'offset-x', '0' );
    pane.setAttribute( 'offset-y', '0' );
    pane.setAttribute( 'x', x );
    pane.setAttribute( 'y', y );
    pane.setAttribute( 'width', width );
    pane.setAttribute( 'height', height );
    pane.setAttribute('rx','2');
    pane.setAttribute('ry','2');
    if(type==='start')
        pane.setAttribute('fill','#00BFFF');
    else if(type==='end')
        pane.setAttribute('fill','blue');

    pane.classList.add('tasc-item-pane');
    group.appendChild( pane );

    //*
    // title description
    var titleText = document.createElementNS( svgURI, 'text');
    titleText.setAttribute( 'offset-x', width/2 );
    titleText.setAttribute( 'offset-y', (height/2) );
    titleText.setAttribute( 'x', x+ (width/2) );
    titleText.setAttribute( 'y', y + (height/2));
    titleText.setAttribute( 'width', width );
    titleText.setAttribute( 'height', height );
    titleText.setAttribute('class','unselectable title-description');
    titleText.setAttribute('dominant-baseline','middle');
    titleText.setAttribute('text-anchor','middle');
    if(type==='start')
        titleText.innerHTML = 'S';
    else if(type==='end')
        titleText.innerHTML = 'E';
    group.appendChild( titleText );

    /*
    // putting an icon
    var icon = document.createElementNS( svgURI, 'path');
    icon.setAttribute( 'offset-x', '0' );
    icon.setAttribute( 'offset-y', '0' );
    icon.setAttribute( 'x', x );
    icon.setAttribute( 'y', y );
    icon.setAttributeNS(null, 'd', "M52.524,23.925L12.507,0.824c-1.907-1.1-4.376-1.097-6.276,0C4.293,1.94,3.088,4.025,3.088,6.264v46.205   c0,2.24,1.204,4.325,3.131,5.435c0.953,0.555,2.042,0.848,3.149,0.848c1.104,0,2.192-0.292,3.141-0.843l40.017-23.103   c1.936-1.119,3.138-3.203,3.138-5.439C55.663,27.134,54.462,25.05,52.524,23.925z M49.524,29.612L9.504,52.716   c-0.082,0.047-0.18,0.052-0.279-0.005c-0.084-0.049-0.137-0.142-0.137-0.242V6.263c0-0.1,0.052-0.192,0.14-0.243   c0.042-0.025,0.09-0.038,0.139-0.038c0.051,0,0.099,0.013,0.142,0.038l40.01,23.098c0.089,0.052,0.145,0.147,0.145,0.249   C49.663,29.47,49.611,29.561,49.524,29.612z");
    group.appendChild( icon);
     */

    // Link items
    group.appendChild(createLinkItem(type, x, y, width, height, 0,'top'));
    group.appendChild(createLinkItem(type, x, y, width, height, 0, 'bottom'));
    group.appendChild(createLinkItem(type, x, y, width, height, 0,'left'));
    group.appendChild(createLinkItem(type, x, y, width, height,0,'right'));

    tascItems.push(group);
    return group;
}

function createLinkItem(parent_id, x, y, width, height, namelessOffset, location){
    var linkItem = document.createElementNS( svgURI, 'rect');
    var sizeOffset = linkItemSize/2;
    var widthOffset = width/2-sizeOffset;
    var heightOffset = height/2-sizeOffset;
    if(location ==='top'){
        linkItem.setAttribute( 'offset-x', widthOffset);
        linkItem.setAttribute( 'offset-y', - linkItemSize + namelessOffset);
        linkItem.setAttribute( 'x', x+ widthOffset);
        linkItem.setAttribute( 'y', y- linkItemSize + namelessOffset);
    }
    else if(location ==='bottom'){
        linkItem.setAttribute( 'offset-x', widthOffset);
        linkItem.setAttribute( 'offset-y', height + namelessOffset);
        linkItem.setAttribute( 'x', x+ widthOffset);
        linkItem.setAttribute( 'y', y + height + namelessOffset);
    }
    else if(location ==='left'){
        linkItem.setAttribute( 'offset-x', - linkItemSize );
        linkItem.setAttribute( 'offset-y', heightOffset + namelessOffset);
        linkItem.setAttribute( 'x', x - linkItemSize);
        linkItem.setAttribute( 'y', y + heightOffset + namelessOffset);
    }
    else if(location ==='right'){
        linkItem.setAttribute( 'offset-x', width );
        linkItem.setAttribute( 'offset-y', heightOffset + namelessOffset);
        linkItem.setAttribute( 'x', x+ width );
        linkItem.setAttribute( 'y', y + heightOffset + namelessOffset);
    }
    linkItem.setAttribute( 'id', parent_id + "::"+location);
    linkItem.setAttribute( 'width', 10 );
    linkItem.setAttribute( 'height', 10 );
    linkItem.setAttribute('class','linkItem linkable');
    return linkItem;
}

function createField(group, elementType, x, y, width, order, namelessOffset, description, givenValue){
    var classvalue = 'unselectable field-value';
    if(givenValue===undefined)
        givenValue = '';
    else
        classvalue += ' field-value-confirmed';
    group.appendChild(createFieldRect(x,y, width - fieldWidthOffset , order,namelessOffset, 'field ' +elementType+'-field'));
    group.appendChild(createFieldValue(x,y, width, order, namelessOffset,classvalue, givenValue));
    group.appendChild(createFieldDescription(x,y, width, order, namelessOffset,'unselectable field-description',description));
}

function createFieldRect(x, y, width, order, namelessOffset, classValue){
    var element = document.createElementNS( svgURI, 'rect');
    element.setAttribute( 'offset-x', innerOffset );
    element.setAttribute( 'offset-y', tascItemHeaderOffset + (fieldOffset* parseFloat(order)) + namelessOffset );
    element.setAttribute( 'x', x+ innerOffset );
    element.setAttribute( 'y', y + tascItemHeaderOffset + (fieldOffset* parseFloat(order)) + namelessOffset);
    element.setAttribute( 'width', width );
    element.setAttribute( 'height', fieldItemHeight );
    element.setAttribute( 'order', order );
    element.setAttribute('class',classValue);
    return element;
}

function createFieldValue(x, y, width, order, namelessOffset, classValue, text){
    var element = document.createElementNS( svgURI, 'text');
    var widthOffset = width/2;
    var heightOffset = fieldItemHeight / 2  + namelessOffset;
    element.setAttribute( 'offset-x', widthOffset);
    element.setAttribute( 'offset-y', tascItemHeaderOffset + (fieldOffset* parseFloat(order)) +heightOffset );
    element.setAttribute( 'x', x+ widthOffset );
    element.setAttribute( 'y', y + tascItemHeaderOffset + (fieldOffset* parseFloat(order))+heightOffset);
    element.setAttribute( 'width', width );
    element.setAttribute( 'height', fieldItemHeight );
    element.setAttribute( 'order', order );
    element.setAttribute('class',classValue);
    if(text !== undefined && text.length>0)
        element.innerHTML = text;
    return element;
}

function createFieldDescription(x, y, width, order, namelessOffset, classValue, context){
    var element = document.createElementNS( svgURI, 'text');
    var widthOffset = width/2;
    var heightOffset = fieldItemHeight / 2  + namelessOffset;
    element.setAttribute( 'offset-x', widthOffset );
    element.setAttribute( 'offset-y', tascItemHeaderOffset + (fieldOffset* parseFloat(order))+heightOffset);
    element.setAttribute( 'x', x+ widthOffset );
    element.setAttribute( 'y', y + tascItemHeaderOffset + (fieldOffset* parseFloat(order))+heightOffset);
    element.setAttribute( 'width', width );
    element.setAttribute( 'height', fieldItemHeight );
    element.setAttribute('class',classValue);
    element.setAttribute('order',order);
    element.setAttribute('context',context);
    if(context !== undefined && context.length>0)
        element.innerHTML = context.charAt(0).toUpperCase() + context.slice(1);
    return element;
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function createEditableText(){
    var textdiv = document.createElement("div");
    var textnode = document.createTextNode("Click to edit");
    textdiv.appendChild(textnode);
    textdiv.setAttribute("contentEditable", "true");
    textdiv.setAttribute("width", "auto");
    myforeign.setAttribute("width", "100%");
    myforeign.setAttribute("height", "100%");
    myforeign.classList.add("foreign"); //to make div fit text
    textdiv.classList.add("insideforeign"); //to make div fit text
    textdiv.addEventListener("mousedown", elementMousedown, false);
    myforeign.setAttributeNS(null, "transform", "translate(" + localpoint.x + " " + localpoint.y + ")");
    svg.appendChild(myforeign);
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function createFieldItem(fieldObject, x, y, width, height, type) {
    var group = document.createElementNS( svgURI, 'g');
    group.setAttribute('id',fieldObject.id);
    group.setAttribute( 'x', x );
    group.setAttribute( 'y', y );
    group.setAttribute('class', 'draggable field-item');
    group.setAttribute('render-order',1);
    if(fieldObject.constructor.name === "Terminus")
        group.setAttribute('data-array-index',terminusData.length);
    else if(fieldObject.constructor.name === "Action")
        group.setAttribute('data-array-index',actionData.length);
    else if(fieldObject.constructor.name === "Condition")
        group.setAttribute('data-array-index',conditionData.length);
    else if(fieldObject.constructor.name === "Instruction")
        group.setAttribute('data-array-index',instructionData.length);
    // background pane
    var pane = document.createElementNS( svgURI, 'rect');
    pane.setAttribute( 'offset-x', '0' );
    pane.setAttribute( 'offset-y', '0' );
    pane.setAttribute( 'x', x );
    pane.setAttribute( 'y', y );
    pane.setAttribute( 'width', width );
    pane.setAttribute( 'height', height );
    if(type ==='terminus'){
        pane.setAttribute('class', 'field-item-pane terminus-item');
    }
    else if(type ==='action'){
        pane.setAttribute('class', 'field-item-pane action-item');
    }
    else if(type ==='condition'){
        pane.setAttribute('class', 'field-item-pane condition-item');
    }
    else if(type ==='instruction'){
        pane.setAttribute('class', 'field-item-pane instruction-item');
    }
    group.appendChild( pane );

    // title description
    var titleText = document.createElementNS( svgURI, 'text');
    titleText.setAttribute( 'offset-x', width/2 );
    titleText.setAttribute( 'offset-y', '12' );
    titleText.setAttribute( 'x', x+ (width/2) );
    titleText.setAttribute( 'y', y + 12);
    titleText.setAttribute( 'width', width );
    titleText.setAttribute( 'height', height/2 );
    titleText.setAttribute('class','unselectable field-value-confirmed');
    titleText.innerHTML = fieldObject.name;
    group.appendChild( titleText );

    appendToDatabase(fieldObject, group);
    return group;
}

function activeFieldFocused(item){
    if(focusedElement)
        return ;
    focusedElement = item;
    focusedElement.classList.add("field-focused");
}

function deactiveFieldFocused(){
    if(focusedElement){
        focusedElement.classList.remove("field-focused");
    }
    focusedElement = null;
}

function makeFieldItemSelectable(item){
    for (var i = 0; i < item.childNodes.length; i++) {
        for (var t=0; t < fieldTypes.length ; t++) {
            if (item.childNodes[i].classList.contains(fieldTypes[t] + '-item')) {
                item.childNodes[i].classList.remove('unselectable');
            }
        }
    }
}

function makeFieldItemUnselectable(item){
    for (var i = 0; i < item.childNodes.length; i++) {
        for (var t=0; t < fieldTypes.length ; t++){
            if (item.childNodes[i].classList.contains(fieldTypes[t] + '-item')) {
                item.childNodes[i].classList.add('unselectable');
            }
        }
    }
}

function activateFieldHighlight(item, type){
    if(hasChildOfClass(item, type + '-item')){
        var items = document.getElementsByClassName( type + '-field');
        for(var t=0; t<items.length ; t++){
            items[t].classList.add('field-highlighted');
        }
        relatedFieldHighlighted = true;
    }
}

function deactiveFieldHighlight(){
    var items = document.getElementsByClassName('field-highlighted');
    while (items[0]) {
        items[0].classList.remove('field-highlighted')
    }
    relatedFieldHighlighted = false;
}

function deactiveChosenPathStyle(path){
    path.classList.remove("chosen-path");
    path.classList.add("path");
    if(paths.indexOf(path)>=0){
        pathHeads[paths.indexOf(path)].classList.remove("chosen-path-head");
        pathHeads[paths.indexOf(path)].classList.add("path-head");
    }
}

function activeChosenPathStyle(path){
    path.classList.add("chosen-path");
    path.classList.remove("path");
    if(paths.indexOf(path)>=0) {
        pathHeads[paths.indexOf(path)].classList.add("chosen-path-head");
        pathHeads[paths.indexOf(path)].classList.remove("path-head");
    }
}

function activateLinkedItemStyle(item){
    item.classList.remove('linkItem');
    item.classList.add('linkedItem');
}

function deactivateLinkedItemStyle(item){
    item.classList.add('linkItem');
    item.classList.remove('linkedItem');
}

function createLinkPath(start_id, start_x, start_y){
    var tempPath = document.createElementNS( svgURI, 'path');
    tempPath.setAttributeNS(null, 'start_x', start_x);
    tempPath.setAttributeNS(null, 'start_y', start_y);
    tempPath.setAttributeNS(null, 'class', 'path');
    tempPath.setAttributeNS(null, 'startID', start_id);
    tempPath.classList.add('unselectable');
    return tempPath;
}

function getHeadPath(x,y){
    return 'M'+(x-12)+","+(y-4)+ " L"+(x-12)+","+(y+4)+" L"+(x)+","+(y)+" z";
}

function updateHead(head, x, y){
    head.setAttributeNS(null, 'd', getHeadPath(x,y));
}

function createLinkHead(start_id, start_x, start_y){
    var head = document.createElementNS( svgURI, 'path');
    head.setAttributeNS(null, 'start_x', start_x);
    head.setAttributeNS(null, 'start_y', start_y);
    head.setAttributeNS(null, 'class', 'path-head');
    head.setAttributeNS(null, 'd', getHeadPath(start_x,start_y));
    head.setAttributeNS(null, 'fill', '#f00');
    head.classList.add('unselectable');
    return head;
}

function doIfItOverlaps(classType, targetItem, callback){
    var items = document.getElementsByClassName(classType);
    for(var i=0; i<items.length ; i++){
        if(items[i] === targetItem)
            continue;
        if(isAssignable(items[i], targetItem, 0.5)){
            callback(items[i]);
        }
    }
}

function setSelectedElement(element){
    selectedElement = element;
    if(selectedElement)
        setSelectedArea(selectedElement);
    else
        selectedArea = undefined;
}

function setSelectedArea(selectedElement){
    for(var i=0; i<selectedElement.children.length ; i++){
        if(selectedElement.children[i].nodeName ==='rect')
            selectedArea = selectedElement.children[i];
    }
}

function storeOriginPos(selectedElement, x, y){
    selectedElement.setAttribute("origin-x",x);
    selectedElement.setAttribute("origin-y",y);
}
function loadOriginPos(selectedElement){
    return [selectedElement.getAttribute("origin-x"), selectedElement.getAttribute("origin-y")];
}

function moveItem(selectedElement, x, y){
    x = parseFloat(x);
    y = parseFloat(y);
    selectedElement.setAttributeNS(null, "x", x);
    selectedElement.setAttributeNS(null, "y", y);

    var topOffset = 0;
    if(selectedElement.classList.contains('nameless'))
        topOffset = tascItemNamelessOffset;
    // here children will be moved together with parent
    for(var i= 0; i<selectedElement.children.length; i++){
        var target = selectedElement.children[i];
        var new_x = x + parseFloat(target.getAttributeNS(null, "offset-x"));
        var new_y = y + parseFloat(target.getAttributeNS(null, "offset-y"));
        // when it is linkable
        if(target.classList.contains('linkable')) {
            for(var t=0; t<paths.length ; t++){
                if (paths[t].getAttributeNS(null, 'endID') === target.id) {
                    updatePath(paths[t], parseFloat(paths[t].getAttributeNS(null, "start_x")), parseFloat(paths[t].getAttributeNS(null, "start_y")), new_x + linkItemSizeOffset, new_y + linkItemSizeOffset);
                    updateHead(pathHeads[t],new_x + linkItemSizeOffset, new_y + linkItemSizeOffset);
                } else if (paths[t].getAttributeNS(null, 'startID') === target.id) {
                    updatePath(paths[t], new_x + linkItemSizeOffset, new_y + linkItemSizeOffset, parseFloat(paths[t].getAttributeNS(null, "end_x")), parseFloat(paths[t].getAttributeNS(null, "end_y")));
                    updateHead(pathHeads[t],parseFloat(paths[t].getAttributeNS(null, "end_x")), parseFloat(paths[t].getAttributeNS(null, "end_y")));
                }
            }
        }
        target.setAttributeNS(null, "x", new_x);
        target.setAttributeNS(null, "y", new_y);
    }
}