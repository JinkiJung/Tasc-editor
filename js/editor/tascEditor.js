var innerOffset = 10;
var fieldOffset = 43;
var fieldWidthOffset = innerOffset * 2;
var linkItemSize = 10;
var svgURI = 'http://www.w3.org/2000/svg';

function createTascItem(id, x, y, width, height, title) {
    var group = document.createElementNS( svgURI, 'g');
    group.setAttribute('id',id);
    group.setAttribute( 'x', x );
    group.setAttribute( 'y', y );
    group.setAttribute('class', 'draggable tasc-item');

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
    group.appendChild( pane );

    // title description
    var titleText = document.createElementNS( svgURI, 'text');
    titleText.setAttribute( 'offset-x', width/2 );
    titleText.setAttribute( 'offset-y', '12' );
    titleText.setAttribute( 'x', x+ (width/2) );
    titleText.setAttribute( 'y', y + 12);
    titleText.setAttribute( 'width', width );
    titleText.setAttribute( 'height', 30 );
    titleText.setAttribute('class','unselectable titleDescription');
    titleText.setAttribute('dominant-baseline','middle');
    titleText.setAttribute('text-anchor','middle');
    titleText.innerHTML = title;
    group.appendChild( titleText );

    // Field items
    group.appendChild(createField('text',x,y, width, 0, 'unselectable fieldDescription','Given'));
    group.appendChild(createFieldInteractable('rect',x,y, width - fieldWidthOffset , 0, 'field',''));
    group.appendChild(createField('text',x,y, width, 1, 'unselectable fieldDescription','When'));
    group.appendChild(createFieldInteractable('rect',x,y, width - fieldWidthOffset , 1, 'field condition-field',''));
    group.appendChild(createField('text',x,y, width, 2, 'unselectable fieldDescription','Who'));
    group.appendChild(createFieldInteractable('rect',x,y, width - fieldWidthOffset , 2, 'field terminus-field',''));
    group.appendChild(createField('text',x,y, width, 3, 'unselectable fieldDescription','Do'));
    group.appendChild(createFieldInteractable('rect',x,y, width - fieldWidthOffset , 3, 'field action-field',''));
    group.appendChild(createField('text',x,y, width, 4, 'unselectable fieldDescription','Until'));
    group.appendChild(createFieldInteractable('rect',x,y, width - fieldWidthOffset , 4, 'field condition-field',''));

    // Link items
    group.appendChild(createLinkItem(id, x, y, width, height,'top'));
    group.appendChild(createLinkItem(id, x, y, width, height, 'bottom'));
    group.appendChild(createLinkItem(id, x, y, width, height, 'left'));
    group.appendChild(createLinkItem(id, x, y, width, height,'right'));

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
    var item = createField(elementType, x, y, width, order, classValue, text);
    //item.setAttribute('onclick',"alert('!!')");
    return item;
}

function createField(elementType, x, y, width, order, classValue, text){
    var defaultYOffset = 32;
    if(elementType ==='rect')
        defaultYOffset += 2;
    var element = document.createElementNS( svgURI, elementType);
    element.setAttribute( 'offset-x', innerOffset );
    element.setAttribute( 'offset-y', defaultYOffset + (fieldOffset* parseFloat(order)) );
    element.setAttribute( 'x', x+ innerOffset );
    element.setAttribute( 'y', y + defaultYOffset + (fieldOffset* parseFloat(order)));
    element.setAttribute( 'width', width );
    element.setAttribute( 'height', 25 );
    element.setAttribute('class',classValue);
    if(text !== undefined && text.length>0)
        element.innerHTML = text;
    return element;
}

function registerItem(item){
    document.getElementById('editorPane').appendChild(item);
}

function createFieldItem(id, x, y, width, height, type, title) {
    var group = document.createElementNS( svgURI, 'g');
    group.setAttribute('id',id);
    group.setAttribute( 'x', x );
    group.setAttribute( 'y', y );
    group.setAttribute('class', 'draggable field-item');

    // background pane
    var pane = document.createElementNS( svgURI, 'rect');
    pane.setAttribute( 'offset-x', '0' );
    pane.setAttribute( 'offset-y', '0' );
    pane.setAttribute( 'x', x );
    pane.setAttribute( 'y', y );
    pane.setAttribute( 'width', width );
    pane.setAttribute( 'height', height );
    if(type ==='terminus'){
        pane.setAttribute('class', 'terminus-item');
    }
    else if(type ==='action'){
        pane.setAttribute('class', 'action-item');
    }
    else if(type ==='condition'){
        pane.setAttribute('class', 'condition-item');
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
    titleText.setAttribute('class','unselectable titleDescription');
    titleText.setAttribute('dominant-baseline','middle');
    titleText.setAttribute('text-anchor','middle');
    titleText.innerHTML = title;
    group.appendChild( titleText );

    return group;
}

registerItem(createTascItem(0,0,0,180,250, 'Test1'));
registerItem(createTascItem(1,0,0,180,250, 'Test2'));
registerItem(createTascItem(2,0,0,180,250, 'Test3'));
registerItem(createFieldItem("terminus001", 100, 100, 160, 25, 'terminus',"Jinki"));
registerItem(createFieldItem("action001", 100, 100, 160, 25, 'action',"hit"));
registerItem(createFieldItem("condition001", 100, 100, 160, 25, 'condition',"anytime"));
