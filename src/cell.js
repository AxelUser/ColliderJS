import Vector from "./vector";

export default function GridCell(id, rowIndex, colIndex, posLeftTop, width, height, maxJoins) {
    'use strict';

    this.isCustom = false;
    this.isSelected = false;

    this.id = id || 0;
    this.width = width || 0;
    this.height = height || 0;
    this.rowIndex = rowIndex || 0;
    this.colIndex = colIndex || 0;

    this.maxJoins = maxJoins;

    this.top = posLeftTop.y;
    this.bottom = posLeftTop.y + height;
    this.left = posLeftTop.x;
    this.right = posLeftTop.x + width;
    this.center = new Vector(this.left + this.width / 2, this.top + this.height / 2);

    this.hasError = false;

    this.particles = [];
    this.neighbors = [];

    this.setParticles = function(particles) {
        self = this;
        this.particles = [].concat(particles.map(function(p){
            p.cell = self;
            return p;
        }));
    }

    this.addParticle = function(particle) {
        particle.cell = this;
        this.particles.push(particle);
    }

    this.check = function() {
        for(var i = 0; i < this.particles.length; i++) {
            var posX = this.particles[i].position.x;
            var posY = this.particles[i].position.y;
            if(Math.ceil(posX) < this.left || Math.floor(posX) > this.right || Math.ceil(posY) < this.top || Math.floor(posY) > this.bottom){
                return false;
            }
        }
        return true;
    }

    this.removeSelfFromNeighbors = function(ignorePredicate){
        for(var i = 0; i < this.neighbors.length; i++) {
            var n = this.neighbors[i];
            n.neighbors = n.neighbors.filter(function(nn){
                if(ignorePredicate != undefined && ignorePredicate(nn)){
                    return true;
                }
                return this.id != nn.id;
            },this);
        }
    }

    this.removeGoneParticles = function() {
        var removedParticles = [];
        var savedParticles = [];
        var posX = 0;
        var posY = 0;
        var p = null;
        for(var i = 0; i < this.particles.length; i++) {
            posX = Math.round(this.particles[i].position.x);
            posY = Math.round(this.particles[i].position.y);
            
            if(posX < this.left || posX > this.right || posY < this.top || posY > this.bottom){
                this.particles[i].cell = null;
                removedParticles.push(this.particles[i]);
                if(this.particles[i].onLeaving != null) {
                    this.particles[i].onLeaving(this.particles[i]);
                }
            } else {
                savedParticles.push(this.particles[i]);
            }
        }

        if(savedParticles.length < this.particles.length) {
            this.setParticles(savedParticles);
        }

        return removedParticles;
    }
}