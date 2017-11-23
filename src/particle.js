import Vector from "./vector";

export default function Particle(id, x, y){
    this.id = id;
    this.position = new Vector(x, y);
    this.velocity = new Vector();
    this.speed = 0;
    this.parentId = null;
    this.connectionsMap = {};
    this.childs = [];
    this.linked = false;
    this.distance = false;
    this.alpha = 0.3;
    this.radius = 2;
    this.hasError = false;

    this.connectionsAlphaInc = 0.01;

    this.cell = null;
    this.isCustom = false;
    
    this.jointAlpha = 0.8;
    this.linkAlpha = this.alpha;
    this.linkToParentAlpha = 0;

    var acceleration = new Vector(),
        i = 0;

    
    this.riseError = function() {
        this.hasError = true;
        this.cell.hasError = true;
    }

    this.update = function(delta){
        acceleration = acceleration.copyFrom(this.velocity);
        acceleration.mul(this.speed * delta);
        this.position.add(acceleration);
        this.jointAlpha = 0.8;
        this.linkAlpha = this.alpha;
    }

    this.addChilds = function(childs){
        var newAlpha = 0;
        var child = null;
        var newConnections = {};
        var newChilds = [];
        for (var i = 0; i < childs.length; i++) {
            child = childs[i];
            newAlpha = this.connectionsMap[child.id+""] != null? this.connectionsMap[child.id+""] + this.connectionsAlphaInc: 0;
            newConnections[child.id+""] = newAlpha <= 0.3? newAlpha: 0.3;
            newChilds.push(child);
        }
        this.connectionsMap = newConnections;
        this.childs = newChilds;
        
    }
    this.removeChild = function(link){
        for(i = 0; i < this.childs.length; i++){
            if(this.childs[i] === link){
                this.childs.splice(i,1);
            }
        }
    }

    this.onLeaving = null;
};