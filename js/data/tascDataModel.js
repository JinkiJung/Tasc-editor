function Tasc(id, title, given, when, who, does, until){ //, instruction, evaluation){
    this.id = id;
    this.title = title;
    this.given = given;
    this.when = when;
    if(who)
        this.who = new Terminus(ID(), who.name);
    this.do = does;
    this.until = until;

    Tasc.prototype.toString = function(){console.log(this.who);};
}

function Terminus(id, name, position){
    this.id = id;
    this.name = name;
    this.position = position;
}