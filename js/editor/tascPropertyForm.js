var openedObject;
var openedObjectIndex;

function hidePropertyForm() {
    openedObject = undefined;
    document.getElementById("itemForm").style.display = "none";
}

function showPropertyForm(item){
    if(item.getAttribute('data-array-index')){
        removeForm();
        createForm(item);
        document.getElementById("itemForm").style.display = "block";
    }
}

function replaceDataWithObject(data, datum){
    for(var i=0 ; i<data.length ; i++){
        if(data[i].id === datum.id){
            data[i] = datum;
        }
    }
}

function updateObjectFromForm(object){
    var index = openedObjectIndex;

    var inputs = document.getElementsByClassName('property-form-input');
    for(var i=0 ; i<inputs.length; i++){
        var input = inputs[i];
        var tagName = input.getAttribute('for');
        if(object.id.startsWith('tasc')){
            tascData[index][tagName] = input.value;
        }
        else if(object.id.startsWith('terminus')){
            terminusData[index][tagName] = input.value;
        }
        else if(object.id.startsWith('action')){
            actionData[index][tagName] = input.value;
        }
        else if(object.id.startsWith('condition')){
            conditionData[index][tagName] = input.value;
        }
        else if(object.id.startsWith('instruction')){
            instructionData[index][tagName] = input.value;
        }
    }
}

function saveAndClose(){
    updateObjectFromForm(openedObject);
    openedObject = undefined;
    openedObjectIndex = -1;
}

function getTascObject(item){
    var index = item.getAttribute('data-array-index');
    openedObjectIndex = index;

    if(index){
        if(item.id.startsWith('tasc'))
            return tascData[index];
        else if(item.id.startsWith('action'))
            return actionData[index];
        else if(item.id.startsWith('terminus'))
            return terminusData[index];
        else if(item.id.startsWith('condition'))
            return conditionData[index];
        else if(item.id.startsWith('instruction'))
            return instructionData[index];
    }
}

function createForm(item){
    var json = getTascObject(item);
    openedObject = json;

    var div = document.getElementById("itemForm");
    //div.setAttribute('class', 'form-container');

    var label = document.createElement("H1");
    label.setAttribute('for','name');
    label.innerHTML = json.name;
    div.appendChild(label);

    for(var tagName in json){
        if(tagName === 'id')
            continue;
        {
            var label = document.createElement("label");
            label.setAttribute('for','name');
            label.innerHTML = tagName;

            var input = document.createElement("input");
            input.setAttribute('class', 'property-form-input');
            input.setAttribute('type','text');
            input.setAttribute('for',tagName);
            input.setAttribute('placeholder','Enter '+tagName);
            if(json[tagName])
                input.value = json[tagName];

            div.appendChild(label);
            div.appendChild(input);
        }
    }

    var submit = document.createElement("button");
    submit.setAttribute('class', 'btn');
    submit.setAttribute('onclick', 'saveAndClose()');
    submit.innerHTML = "Save";
    div.appendChild(submit);

    var cancel = document.createElement("button");
    cancel.setAttribute('onclick', 'hidePropertyForm()');
    cancel.setAttribute('class', 'btn cancel');
    cancel.innerHTML = "Close";
    div.appendChild(cancel);
}

function removeForm(){
    var form = document.getElementById('itemForm');
    while (form.firstChild) {
        form.removeChild(form.firstChild);
    }
}