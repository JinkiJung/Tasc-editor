function Tasc(id, name, given, when, who, does, until, next){ //, instruction, evaluation){
    this.id = id;
    this.name = name;
    if(given)
        this.given = new Context(ID(), given);
    if(when)
        this.when = new Condition(ID(), when.name);
    if(who)
        this.who = new Terminus(ID(), who.name, who.location, who.role);
    if(does)
        this.do = new Action(ID(), does.name);
    if(until)
        this.until = new Condition(ID(), until.name);
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
        return json; };
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

function Context(id, name){
    this.id = id;
    this.name = name;

    Context.prototype.toJSON = function() {
        return { id: this.id, name: this.name };
    }
}

function Terminus(id, name, location, role){
    this.id = id;
    this.name = name;
    this.location = location;
    this.role = role;
    Terminus.prototype.toJSON = function() {
        return { id: this.id, name: this.name, location: this.location, role: this.role };
    }
}

function Condition(id, name, state){
    this.id = id;
    this.name = name;
    this.state = state;
    Condition.prototype.toJSON = function() {
        return { id: this.id, name: this.name, state: this.state };
    }
}

function Action(id, name){
    this.id = id;
    this.name = name;
    Action.prototype.toJSON = function() {
        return { id: this.id, name: this.name };
    }
}