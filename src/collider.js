"use strict";

import Grid from './grid';
import Tools from './tools';
import render from './render';
import Mover from './mover';
import Particle from './particle';


function Collider(canvasID, options){
    
    /**Canvas context */
    var __ctx;
    var __canvas;

    var __width = 0;
    var __height = 0;

    var __grid = null;
    var __particles = [];

    var __fn = {};

    var newTime = 0;
    var savedTime = 0;
    
    var __defs = {
        grid: {
            //sizes
            cellFixedWidth: 32,
            cellFixedHeight: 32,

            //connections
            cellsSearchRadius: 1,
            cellsIgnoreRadius: 0,
            maxConnections: 1,

            //particles settings
            particleSpeed: 2,

            //optimizations
            stopOnBlur: true
        },
        handlers: {
            onAfterGridCreation: null,
            particlesFactory: null,
        },
        debug: {
            showGrid: false,
            pauseOnCtrlClick: false,
            selectOnDblClick: false
        }

    };

    if(options != null) {
        __defs = Tools.deepExtend(__defs, options)
    }

    //todo: check for concurrency issues
    __fn.addParticles = function(particlesFactory){
        var p = particlesFactory(__grid);
        __grid.addParticles(p);
        __particles = __grid.getAllParticles();
    };

    __fn.pushParticle = function(x, y){
        
    };

    __fn.update = function(delta) {
        Mover.bounce(__particles, delta, __grid);
        __grid.update();
    };    

    __fn.loop = function() {
        newTime = Tools.getCurrentTime();
        var delta = (newTime - savedTime) / 100;
        savedTime = newTime;

        if(delta > 0.2){
            delta = 0.2;
        }

        __fn.update(delta);
        __fn.draw();
        Tools.getAnimationFrame(__fn.loop);
    }

    __fn.draw = function() {
        render(__ctx, __width, __height, __particles, __grid, __defs);
    };

    __fn.initCanvas = function() {        
        __ctx = __canvas.getContext('2d');

        //todo: add fullscreen setting
        __width = __canvas.width = window.innerWidth;
        __height = __canvas.height = window.innerHeight;
    };

    __fn.initGrid = function() {
        __grid = new Grid(__width, __height);
        __grid.initGrid();
        if(__defs.handlers.particlesFactory != null) {
            __grid.addParticles(__defs.handlers.particlesFactory);
        }        
        __particles = __grid.getAllParticles();
    };

    __fn.initCollider = function() {
        __canvas = document.getElementById(canvasID);
        __fn.initCanvas();
        __fn.initGrid();
        __fn.loop();
    };

    this.pushParticle = __fn.pushParticle;
    this.addParticles = __fn.addParticles;

    __fn.initCollider();
}

Collider.createSimple = function(canvasID){
    var o = {
        handlers: {
            particlesFactory: function(grid) {
                var particles = [];
                var count = 150;
                var x = 0,
                    y = 0;
                for(var i = 0; i < count; i++){
                    x = Math.random() * window.innerWidth;
                    y = Math.random() * window.innerHeight;
        
                    var particle = new Particle(i, x, y);
                    particle.velocity.x = Math.random() -0.5;
                    particle.velocity.y = Math.random() -0.5;
                    particle.velocity.nor();
                    particle.speed = 2;
                    particles.push(particle);
                }
        
                return particles;
            }
        }
    }

    return new Collider(canvasID, o);
}

window.ColliderJS = Collider;