var openedObject;
var openedObjectIndex;

function hidePropertyForm() {
    openedObject = undefined;
    document.getElementById("itemForm").style.display = "none";
}

function showPropertyForm(item){
    if(item.getAttribute('data-array-index')){
        removeForm();
        var div = document.getElementById("itemForm");
        var json = getTascObject(item);
        openedObject = json;
        createForm(div, json, true);
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

function getFieldValueText(object){
    for(var i=0; i<object.children.length ; i++){
        if(object.children[i].classList.contains('field-value-confirmed'))
            return object.children[i];
    }
    return undefined;
}

function updateObjectFromForm(object){
    var index = openedObjectIndex;

    var inputs = document.getElementsByClassName('property-form-input');
    for(var i=0 ; i<inputs.length; i++){
        var input = inputs[i];
        if(input.value || input.checked){
            var tagName = input.getAttribute('for');
            if(getTypeFromID(object.id) === 'tasc'){
                updateOutput(object.id, tagName, input.value);
            }
            else {
                updateData(object.id, index, tagName, input);
            }
        }
    }
}

function getValueFromInput(input){
    if(input.type ==='checkbox')
        return input.checked;
    else
        return input.value;
}

// update boolean value
function updateData(id, index, tagName, input){
    if(getTypeFromID(id) === 'terminus')
        terminusData[index][tagName] = getValueFromInput(input);
    else if(getTypeFromID(id) === 'action')
        actionData[index][tagName] = getValueFromInput(input);
    else if(getTypeFromID(id) === 'condition')
        conditionData[index][tagName] = getValueFromInput(input);
    else if(getTypeFromID(id) === 'instruction')
        instructionData[index][tagName] = getValueFromInput(input);

    if(tagName === 'name')
        updateFieldItem(getFieldValueText(document.getElementById(id)), getValueFromInput(input));
}

function saveAndClose(){
    updateObjectFromForm(openedObject);
    openedObject = undefined;
    openedObjectIndex = -1;
    hidePropertyForm();
}

function getTascObject(item){
    var index = item.getAttribute('data-array-index');
    openedObjectIndex = index;

    if(index){
        if(getTypeFromID(item.id) === 'tasc'){
            var tascDatum = getOutputDatum(item.id);
            if(tascDatum)
                return tascDatum;
            else
                return tascData[index];
        }
        else if(getTypeFromID(item.id) === 'action')
            return actionData[index];
        else if(getTypeFromID(item.id) === 'terminus')
            return terminusData[index];
        else if(getTypeFromID(item.id) === 'condition')
            return conditionData[index];
        else if(getTypeFromID(item.id) === 'instruction')
            return instructionData[index];
    }
    else{
        return generate(getTypeFromID(item.id), tascSchemaJson["definitions"]);
    }
}

function makeSectionOfObject(div, object, fieldContext){
    var section = document.createElement("section");
    createForm(section, object, false, fieldContext);
    div.appendChild(section);
}

function getNestedFieldContext(parent, child){
    if(parent)
        return parent + ":" + child;
    else
        return child;
}

function createForm(parent, json, addButtons, fieldContext){
    var tableElement = document.createElement("table");
    if(json.name && json.name.length >0){
        var tr = tableElement.appendChild(document.createElement('tr'));
        var td = tr.appendChild(document.createElement('th'));
        var label = document.createElement("p");
        label.setAttribute('for','name');
        label.innerHTML = json.name;
        td.appendChild(label);
    }

    for(var tagName in json){
        if(tagName === 'id')
            continue;
        {
            var tr = tableElement.appendChild(document.createElement('tr'));
            var td = tr.appendChild(document.createElement('td'));

            var label = document.createElement("label");
            label.setAttribute('for','name');
            label.innerHTML = tagName + ": ";
            td.appendChild(label);
            //console.log(json[tagName]["tasc-editor-form"]);
            //console.log(json.name);
            //console.log(tascSchemaJson["definitions"][json.name]);
            if(json[tagName] && json[tagName] instanceof Object){
                makeSectionOfObject(td, json[tagName], getNestedFieldContext(fieldContext, tagName));
            }
            else{
                var input = document.createElement("input");
                input.setAttribute('class', 'property-form-input');
                if(typeof json[tagName] === "boolean"){
                    input.setAttribute('type','checkbox');
                    if(json[tagName])
                        input.setAttribute('checked', json[tagName]);
                }
                else
                    input.setAttribute('type','text');
                input.setAttribute('for',getNestedFieldContext(fieldContext, tagName));
                input.setAttribute('placeholder','Enter '+tagName);
                input.value = json[tagName];
                td.appendChild(input);
                td.appendChild(document.createElement("br"));
            }
        }
    }

    if(addButtons){
        var tr = tableElement.appendChild(document.createElement('tr'));
        var td = tr.appendChild(document.createElement('td'));
        var submit = document.createElement("button");
        submit.setAttribute('class', 'btn');
        submit.setAttribute('onclick', 'saveAndClose()');
        submit.innerHTML = "Save";
        td.appendChild(submit);

        var cancel = document.createElement("button");
        cancel.setAttribute('onclick', 'hidePropertyForm()');
        cancel.setAttribute('class', 'btn cancel');
        cancel.innerHTML = "Close";
        td.appendChild(cancel);
    }
    parent.appendChild(tableElement);
}

function removeForm(){
    var form = document.getElementById('itemForm');
    while (form.firstChild) {
        form.removeChild(form.firstChild);
    }
}