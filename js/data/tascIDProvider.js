function getID(type, identityProvider, name){
    if(identityProvider ===undefined)
        identityProvider = testIDP;
    if(name)
        return "tasc:"+type+ ":"+ identityProvider+ ":" +getSafeName(name);
    else
        return "tasc:"+type+ ":"+ identityProvider+ ":" + ID();
}

function getSafeName(name){
    return name.replace(/[^a-z0-9]/gi, '_').toLowerCase();
}

function getAugmentedID(existingID, nameToBeAdded){
    var idArray = existingID.split(":");
    if(idArray.length === 4)
        return existingID +":"+ getSafeName(nameToBeAdded);
    else if(idArray.length > 4){
        idArray[4] = getSafeName(nameToBeAdded);
        return idArray.join(":");
    }
    return undefined;
}

function getTypeFromID(objectID){
    var id = objectID.substr(5);
    if(id.startsWith('tasc'))
        return 'tasc';
    else if(id.startsWith('condition'))
        return 'condition';
    else if(id.startsWith('action'))
        return 'action';
    else if(id.startsWith('terminus'))
        return 'terminus';
    else if(id.startsWith('instruction'))
        return 'instruction';
}
