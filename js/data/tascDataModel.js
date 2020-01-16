function Tasc(id, title, given, when, who, does, until){ //, instruction, evaluation){
    this.id = id;
    this.title = title;
    this.given = given;
    if(when)
        this.when = new Condition(ID(), when.name);
    if(who)
        this.who = new Terminus(ID(), who.name, who.location, who.role);
    if(does)
        this.do = new Action(ID(), does.name);
    if(until)
        this.until = new Condition(ID(), until.name);

    Tasc.prototype.toString = function(){console.log(this.who);};
}

function DummyField(type, id, name){
    if(type ==='terminus')
        return new Terminus(id,name);
    else if(type ==='action')
        return new Action(id,name);
    else if(type ==='condition')
        return new Condition(id,name);
    else
        return undefined;
}

function Terminus(id, name, location, role){
    this.id = id;
    this.name = name;
    this.location = location;
    this.role = role;
}

function Condition(id, name, state){
    this.id = id;
    this.name = name;
    this.state = state;
}

function Action(id, name){
    this.id = id;
    this.name = name;
}