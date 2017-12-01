import Grid from './grid';
import Tools from './tools';
import render from './render';
import Mover from './mover';
import Particle from './particle';

export default function Collider(canvasID, options){
    "use strict";

    /**Canvas context */
    var _ctx;
    var _canvas;
    var _pixelRatio;

    var _width = 0;
    var _height = 0;

    var _grid = null;
    var _particles = [];

    var _fn = {};

    var newTime = 0;
    var savedTime = 0;
    
    var _defs = {
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
        _defs = Tools.deepExtend(_defs, options)
    }

    _fn.formatParticles = function(particlesFactory) {
        var partiles = particlesFactory(_width, _height, _pixelRatio).map(function(p){
            p.speed *= _pixelRatio;
            return p;
        });
        return partiles;
    }

    //todo: check for concurrency issues
    _fn.addParticles = function(particlesFactory){
        var p = _fn.formatParticles(particlesFactory);
        _grid.addParticles(p);
        _particles = _grid.getAllParticles();
    };

    _fn.pushParticle = function(x, y){
        
    };

    _fn.update = function(delta) {
        Mover.bounce(_particles, delta, _grid);
        _grid.update();        
    };    

    _fn.loop = function() {
        newTime = Tools.getCurrentTime();
        var delta = (newTime - savedTime) / 100;
        savedTime = newTime;

        if(delta > 0.2){
            delta = 0.2;
        }

        _fn.update(delta);
        _fn.draw();
        Tools.getAnimationFrame(_fn.loop);
    }

    _fn.draw = function() {
        render(_ctx, _width, _height, _pixelRatio, _particles, _grid, _defs);
    };

    _fn.initCanvas = function() {        
        _ctx = _canvas.getContext('2d');

        //todo: add fullscreen setting
        _pixelRatio = Tools.getPixelRatio();
        _canvas.width = window.innerWidth;
        _canvas.height = window.innerHeight;

        _width = _canvas.width;
        _height = _canvas.height;
    };

    _fn.initGrid = function() {
        var o = {
            pixelRatio: _pixelRatio
        }
        _grid = new Grid(_width, _height, o);
        _grid.initGrid();
        if(_defs.handlers.particlesFactory != null) {
            _grid.addParticles(_fn.formatParticles(_defs.handlers.particlesFactory));
        }        
        _particles = _grid.getAllParticles();
    };

    _fn.initCollider = function() {
        _canvas = document.getElementById(canvasID);
        _fn.initCanvas();
        _fn.initGrid();
        _fn.loop();
    };

    this.pushParticle = _fn.pushParticle;
    this.addParticles = _fn.addParticles;

    _fn.initCollider();
}