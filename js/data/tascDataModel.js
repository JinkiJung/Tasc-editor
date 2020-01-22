function Tasc(id, name, given, when, who, does, until, next, following){ //, evaluation){
    return {id: id, name: name, given: given, when: when, who: who, do: does, until: until, next: next, following: following};
    /*
    this.id = id;
    this.name = name;
    if(given)
        this.given = new Context("context"+ID(), given.name);
    if(when)
        this.when = new Condition("condition"+ID(), when.name);
    if(who)
        this.who = new Terminus("terminus"+ID(), who.name, who.location, who.role);
    if(does)
        this.do = new Action("action"+ID(), does.name);
    if(until)
        this.until = new Condition("condition"+ID(), until.name);
    if(following)
        this.following = new Instruction("instruction"+ID(), following.name);
    this.next = next;

    Tasc.prototype.toString = function(){console.log(this.who);};
    Tasc.prototype.toJSON = function(){var json = { id:this.id, name:this.name};
        if(this.given)
            json["given"] = this.given.toJSON();
        if(this.when)
            json["when"] = this.when.toJSON();
        if(this.who)
            json["who"] = this.who.toJSON();
        if(this.do)
            json["do"] = this.do.toJSON();
        if(this.until)
            json["until"] = this.until.toJSON();
        if(this.next)
            json["next"] = JSON.stringify(this.next);
        if(this.following)
            json["following"] = this.following.toJSON();
        return json; };

     */
}

function DummyField(type, id, name){
    if(type ==='terminus')
        return new Terminus(id,name);
    else if(type ==='action')
        return new Action(id,name);
    else if(type ==='condition')
        return new Condition(id,name);
    else if(type ==='instruction')
        return new Instruction(id,name);
    else
        return undefined;
}

function Context(id, name){
    /*
    this.id = id;
    this.name = name;

    Context.prototype.toJSON = function() {

     */
        return { id: id, name: name };
    //}
}

function Terminus(id, name, location, role){
    /*
    this.id = id;
    this.name = name;
    this.location = location;
    this.role = role;
    Terminus.prototype.toJSON = function() {\

     */
        return { id: id, name: name, location: location, role: role };
    //}
}

function Condition(id, name, state){
    /*
    this.id = id;
    this.name = name;
    this.state = state;
    Condition.prototype.toJSON = function() {

     */
        return { id: id, name: name, state: state };
    //}
}

function Action(id, name){
    /*
    this.id = id;
    this.name = name;
    Action.prototype.toJSON = function() {

     */
        return { id: id, name: name };
    //}
}

function Instruction(id, name){
    /*
    this.id = id;
    this.name = name;
    Instruction.prototype.toJSON = function() {

     */
        return { id: id, name: name};
    //}
}

function Scenario(id, name, description, terminuses, actions, conditions, instructions, tascs){
    /*
    this.id = id;
    this.name = name;
    this.description = description;
    this.terminuses = terminuses;
    this.actions = actions;
    this.conditions = conditions;
    this.instructions = instructions;
    this.tascs = tascs;

    Scenario.prototype.toJSON = function() {

     */
        return { id: id, name: name, description: description, terminuses: terminuses,
        actions: actions, conditions: conditions, instructions: instructions, scenario: tascs };
    //}
}