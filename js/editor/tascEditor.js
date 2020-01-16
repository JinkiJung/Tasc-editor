var innerOffset = 10;
var fieldOffset = 43;
var fieldWidthOffset = innerOffset * 2;
var linkItemSize = 10;
var itemHeight = 25;
var xOffset= 10;
var yOffset= 10;
var svgURI = 'http://www.w3.org/2000/svg';

function createStartingTascItem(id, x, y, width, height, title) {
    var group = document.createElementNS( svgURI, 'g');
    group.setAttribute('id',id);
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
    pane.setAttribute('fill','#00BFFF');
    pane.classList.add('tasc-item-pane');
    group.appendChild( pane );

    /*
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
    titleText.innerHTML = title;
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
    group.appendChild(createLinkItem(id, x, y, width, height,'top'));
    group.appendChild(createLinkItem(id, x, y, width, height, 'bottom'));
    group.appendChild(createLinkItem(id, x, y, width, height, 'left'));
    group.appendChild(createLinkItem(id, x, y, width, height,'right'));

    return group;
}

function createTascItem(tascObject, x, y, width, height) {
    var group = document.createElementNS( svgURI, 'g');
    group.setAttribute('id',tascObject.id);
    group.setAttribute( 'x', x );
    group.setAttribute( 'y', y );
    group.setAttribute('class', 'draggable tasc-item');
    group.setAttribute('render-order',0);

    // background pane
    var pane = document.createElementNS( svgURI, 'rect');
    pane.setAttribute( 'offset-x', '0' );
    pane.setAttribute( 'offset-y', '0' );
    pane.setAttribute( 'x', x );
    pane.setAttribute( 'y', y );
    pane.setAttribute( 'width', width );
    pane.setAttribute( 'height', height );
    pane.setAttribute('rx','10');
    pane.setAttribute('ry','10');
    pane.setAttribute('fill','#eee');
    pane.setAttribute('class','tasc-item-pane');
    group.appendChild( pane );

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
    titleText.innerHTML = tascObject.title;
    group.appendChild( titleText );

    var givenValue = (tascObject.given === undefined) ? '' : tascObject.given.name;
    var whenValue =(tascObject.when === undefined) ? '' : tascObject.when.name;
    var whoValue = (tascObject.who === undefined) ? '' : tascObject.who.name;
    var doValue = (tascObject.do === undefined) ? '' : tascObject.do.name;
    var untilValue = (tascObject.until === undefined) ? '' : tascObject.until.name;
    createField(group,'context', x, y, width, 0, 'Given',givenValue);
    createField(group,'condition', x, y, width, 1, 'When',whenValue);
    createField(group,'terminus', x, y, width, 2, 'Who',whoValue);
    createField(group,'action', x, y, width, 3, 'Do',doValue);
    createField(group,'condition', x, y, width, 4, 'Until',untilValue);
    // Link items
    group.appendChild(createLinkItem(tascObject.id, x, y, width, height,'top'));
    group.appendChild(createLinkItem(tascObject.id, x, y, width, height, 'bottom'));
    group.appendChild(createLinkItem(tascObject.id, x, y, width, height, 'left'));
    group.appendChild(createLinkItem(tascObject.id, x, y, width, height,'right'));

    return group;
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


function createLinkItem(parent_id, x, y, width, height, location){
    var linkItem = document.createElementNS( svgURI, 'rect');
    var sizeOffset = linkItemSize/2;
    var widthOffset = width/2-sizeOffset;
    var heightOffset = height/2-sizeOffset;
    if(location ==='top'){
        linkItem.setAttribute( 'offset-x', widthOffset);
        linkItem.setAttribute( 'offset-y', - linkItemSize );
        linkItem.setAttribute( 'x', x+ widthOffset);
        linkItem.setAttribute( 'y', y- linkItemSize);
    }
    else if(location ==='bottom'){
        linkItem.setAttribute( 'offset-x', widthOffset);
        linkItem.setAttribute( 'offset-y', height);
        linkItem.setAttribute( 'x', x+ widthOffset);
        linkItem.setAttribute( 'y', y + height);
    }
    else if(location ==='left'){
        linkItem.setAttribute( 'offset-x', - linkItemSize );
        linkItem.setAttribute( 'offset-y', heightOffset );
        linkItem.setAttribute( 'x', x - linkItemSize);
        linkItem.setAttribute( 'y', y + heightOffset);
    }
    else if(location ==='right'){
        linkItem.setAttribute( 'offset-x', width );
        linkItem.setAttribute( 'offset-y', heightOffset );
        linkItem.setAttribute( 'x', x+ width );
        linkItem.setAttribute( 'y', y + heightOffset);
    }
    linkItem.setAttribute( 'id', parent_id + "::"+location);
    linkItem.setAttribute( 'width', 10 );
    linkItem.setAttribute( 'height', 10 );
    linkItem.setAttribute('class','linkItem linkable');
    return linkItem;
}

function createFieldInteractable(elementType, x, y, width, order, classValue, text){
    //var item = createField(elementType, x, y, width, order, classValue, text);
    //item.setAttribute('onclick',"alert('!!')");
    //return item;
}

function createField(group, elementType, x, y, width, order, description, givenValue){
    var classvalue = 'unselectable field-value';
    if(givenValue===undefined)
        givenValue = '';
    else
        classvalue += ' field-value-confirmed';
    group.appendChild(createFieldText(x,y, width, order, 'unselectable field-description',description));
    group.appendChild(createFieldRect(x,y, width - fieldWidthOffset , order, 'field ' +elementType+'-field'));
    group.appendChild(createFieldValue(x,y, width, order, classvalue, givenValue));
}

function createFieldRect(x, y, width, order, classValue){
    var defaultYOffset = 34;
    var element = document.createElementNS( svgURI, 'rect');
    element.setAttribute( 'offset-x', innerOffset );
    element.setAttribute( 'offset-y', defaultYOffset + (fieldOffset* parseFloat(order)) );
    element.setAttribute( 'x', x+ innerOffset );
    element.setAttribute( 'y', y + defaultYOffset + (fieldOffset* parseFloat(order)));
    element.setAttribute( 'width', width );
    element.setAttribute( 'height', itemHeight );
    element.setAttribute( 'order', order );
    element.setAttribute('class',classValue);
    return element;
}

function createFieldValue(x, y, width, order, classValue, text){
    var defaultYOffset = 34;
    var element = document.createElementNS( svgURI, 'text');
    var widthOffset = width/2;
    var heightOffset = itemHeight / 2;
    element.setAttribute( 'offset-x', widthOffset);
    element.setAttribute( 'offset-y', defaultYOffset + (fieldOffset* parseFloat(order)) +heightOffset );
    element.setAttribute( 'x', x+ widthOffset );
    element.setAttribute( 'y', y + defaultYOffset + (fieldOffset* parseFloat(order))+heightOffset);
    element.setAttribute( 'width', width );
    element.setAttribute( 'height', itemHeight );
    element.setAttribute( 'order', order );
    element.setAttribute('class',classValue);
    if(text !== undefined && text.length>0)
        element.innerHTML = text;
    return element;
}

function createFieldText(x, y, width, order, classValue, text){
    var defaultYOffset = 32;
    var element = document.createElementNS( svgURI, 'text');
    element.setAttribute( 'offset-x', innerOffset );
    element.setAttribute( 'offset-y', defaultYOffset + (fieldOffset* parseFloat(order)) );
    element.setAttribute( 'x', x+ innerOffset );
    element.setAttribute( 'y', y + defaultYOffset + (fieldOffset* parseFloat(order)));
    element.setAttribute( 'width', width );
    element.setAttribute( 'height', itemHeight );
    element.setAttribute('class',classValue);
    if(text !== undefined && text.length>0)
        element.innerHTML = text;
    return element;
}

function registerItem(item){
    document.getElementById('editorPane').appendChild(item);
}

function createFieldItem(id, title, x, y, width, height, type) {
    var group = document.createElementNS( svgURI, 'g');
    group.setAttribute('id',id);
    group.setAttribute( 'x', x );
    group.setAttribute( 'y', y );
    group.setAttribute('class', 'draggable field-item');
    group.setAttribute('render-order',1);

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
    titleText.innerHTML = title;
    group.appendChild( titleText );

    return group;
}

var ID = function () {
    // Math.random should be unique because of its seeding algorithm.
    // Convert it to base 36 (numbers + letters), and grab the first 9 characters
    // after the decimal.
    return '_' + Math.random().toString(36).substr(2, 9);
};

function getNewStepName(){
    return 'Step '+(document.getElementsByClassName('tasc-item').length+1);
}

function addNewTascItem(id, title){
    if(title===undefined)
        title = getNewStepName();
    var pos = avoidOverlap(document.getElementsByClassName('tasc-item-pane'),300, document.body.clientWidth, 180, 250);
    registerItem(createTascItem(new Tasc(ID(),title),pos[0],pos[1],180,250, title));
}

function openForm() {
    document.getElementById("myForm").style.display = "block";
}

function closeForm() {
    document.getElementById("myForm").style.display = "none";
}

registerItem(createStartingTascItem("start",0+ xOffset,200 + yOffset,30,30));