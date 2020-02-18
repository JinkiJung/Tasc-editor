function Tasc(id, name, given, when, who, does, until, next, following){ //, evaluation){
    return {id: id, name: getLink(name), given: getLink(given), when: getLink(when), who: getLink(who), do: getLink(does),
        until: getLink(until), following: getLink(following), next: getArray(next), };
}

function getLink(object){
    if(object)
        return object;
    else
        return "";
}

function getArray(object){
    if(object)
        return object;
    else
        return [];
}

function DummyField(type, id, name){
    if(type ==='terminus')
        return new Terminus(id,name, '', '');
    else if(type ==='action')
        return new Action(id,name);
    else if(type ==='condition')
        return new Condition(id,name,'');
    else if(type ==='instruction')
        return new Instruction(id,name);
    else
        return undefined;
}

function Context(id, name){
    return { id: id, name: name, template:false };
}

function Terminus(id, name, location, role){
    return { id: id, name: name, location: getLink(location), role: getLink(role), template:false };
}

function Condition(id, name, state, target){
    return { id: id, name: name, state: state, target: getLink(target), template:false };
}

function Action(id, name, target){
    return { id: id, name: name, target: getLink(target), template:false };
}

function Instruction(id, name){
    return { id: id, name: name, template:false};
}

function Scenario(id, name, description, terminuses, actions, conditions, instructions, tascs){
        return { id: id, name: name, description: description, terminuses: terminuses,
        actions: actions, conditions: conditions, instructions: instructions, scenario: tascs, templates:[] };
}