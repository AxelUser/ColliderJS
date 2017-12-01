/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 3);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = Vector;
function Vector(x, y){
    'use strict';

    this.x = x || 0;
    this.y = y || 0;

    var dx, dy;

    this.add = function(v){
        this.x += v.x;
        this.y += v.y;
        return this;
    };

    this.sub = function(v){
        this.x -= v.x;
        this.y -= v.y;
        return this;
    };

    this.nor = function(){
        var d = this.len();
        if(d > 0) {
            this.x = this.x / d;
            this.y = this.y / d;
        }
        return this;
    };

    this.dot = function(v){
        return this.x * v.x + this.y * v.y;
    };


    this.len2 = function(){
        return this.dot(this);
    };

    this.len = function(){
        return Math.sqrt(this.len2());
    };

    this.mul = function(v){
        if(typeof v === 'object'){
            this.x *= v.x;
            this.y *= v.y;
        } else {
            this.x *= v;
            this.y *= v;
        }

        return this;
    };

    this.copyFrom = function(v) {
        this.x = v.x;
        this.y = v.y;
        return this;
    };

    this.distance = function(v){
        dx = this.x - v.x;
        dy = this.y - v.y;
        return Math.sqrt(dx * dx + dy * dy);
    };
};

/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = Collider;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__grid__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__tools__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__render__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__mover__ = __webpack_require__(8);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__particle__ = __webpack_require__(2);






function Collider(canvasID, options){
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
        _defs = __WEBPACK_IMPORTED_MODULE_1__tools__["a" /* default */].deepExtend(_defs, options)
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
        __WEBPACK_IMPORTED_MODULE_3__mover__["a" /* default */].bounce(_particles, delta, _grid);
        _grid.update();        
    };    

    _fn.loop = function() {
        newTime = __WEBPACK_IMPORTED_MODULE_1__tools__["a" /* default */].getCurrentTime();
        var delta = (newTime - savedTime) / 100;
        savedTime = newTime;

        if(delta > 0.2){
            delta = 0.2;
        }

        _fn.update(delta);
        _fn.draw();
        __WEBPACK_IMPORTED_MODULE_1__tools__["a" /* default */].getAnimationFrame(_fn.loop);
    }

    _fn.draw = function() {
        Object(__WEBPACK_IMPORTED_MODULE_2__render__["a" /* default */])(_ctx, _width, _height, _pixelRatio, _particles, _grid, _defs);
    };

    _fn.initCanvas = function() {        
        _ctx = _canvas.getContext('2d');

        //todo: add fullscreen setting
        _pixelRatio = __WEBPACK_IMPORTED_MODULE_1__tools__["a" /* default */].getPixelRatio();
        _canvas.width = window.innerWidth;
        _canvas.height = window.innerHeight;

        _width = _canvas.width;
        _height = _canvas.height;
    };

    _fn.initGrid = function() {
        var o = {
            pixelRatio: _pixelRatio
        }
        _grid = new __WEBPACK_IMPORTED_MODULE_0__grid__["a" /* default */](_width, _height, o);
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

/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = Particle;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__vector__ = __webpack_require__(0);


function Particle(id, x, y){
    this.id = id;
    this.position = new __WEBPACK_IMPORTED_MODULE_0__vector__["a" /* default */](x, y);
    this.velocity = new __WEBPACK_IMPORTED_MODULE_0__vector__["a" /* default */]();
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

    var acceleration = new __WEBPACK_IMPORTED_MODULE_0__vector__["a" /* default */](),
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

/***/ }),
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__collider__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__readyColliders__ = __webpack_require__(9);



window.window.ColliderJS = __WEBPACK_IMPORTED_MODULE_0__collider__["a" /* default */];
Object(__WEBPACK_IMPORTED_MODULE_1__readyColliders__["a" /* default */])();

/***/ }),
/* 4 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = Grid;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__vector__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__cell__ = __webpack_require__(5);



function Grid(width, height, options) {
    'use strict';
    
    var opt = options || {};
    opt.pixelRatio = opt.pixelRatio || 1;

    this.cells = [];

    this.cellFixedWidth = 32 * opt.pixelRatio;
    this.cellFixedHeight = 32 * opt.pixelRatio;

    this.debugMode = opt.enableDebug || false;

    this.rowsCount = 0;
    this.colsCount = 0;

    this.width = width;
    this.height = height;

    this.cellsSearchRadius = 1;
    this.cellsIgnoreRadius = 0;
    this.maxJoins = opt.maxJoins || 1;

    // Extesions
    var onAfterGridCreationCb = opt.onAfterGridCreation;
    var getTrianglesPointsCb = opt.trianglesPointsFactory;
    var onRequestAdditionalNeighborsCb = opt.onRequestAdditionalNeighbors;

    this.getCellForPosition = function(x, y){
        var xIndex = Math.floor(x / this.cellFixedWidth);
        var yIndex = Math.floor(y / this.cellFixedHeight);
        return this.cells[yIndex][xIndex];
    }

    this.getCellForParticle = function (particle) {
        var xIndex = Math.floor(particle.position.x / this.cellFixedWidth);
        var yIndex = Math.floor(particle.position.y / this.cellFixedHeight);
        return this.getCellForPosition(particle.position.x, particle.position.y);
    }

    this.getTrianglesPoints = function() {
        if(getTrianglesPointsCb){
            return getTrianglesPointsCb();
        } else {
            return null;
        }
    }

    this.initGrid = function () {
        var id = 0;
        this.cells = [];
        this.rowsCount = 0;

        for(var sumHeight = 0; sumHeight < this.height; sumHeight += this.cellFixedHeight, this.rowsCount++){
            this.colsCount = 0;
            this.cells.push([]);
            for(var sumWidth = 0; sumWidth < this.width; sumWidth += this.cellFixedWidth, this.colsCount++, id++){
                var pos = new __WEBPACK_IMPORTED_MODULE_0__vector__["a" /* default */](sumWidth, sumHeight);
                var h = sumHeight + this.cellFixedHeight <= this.height? this.cellFixedHeight: this.height - sumHeight;
                var w = sumWidth + this.cellFixedWidth <= this.width? this.cellFixedWidth: this.width - sumWidth;
                this.cells[this.rowsCount].push(new __WEBPACK_IMPORTED_MODULE_1__cell__["a" /* default */](id, this.rowsCount, this.colsCount, pos, w, h, this.maxJoins));
            }
        }
        
        this.initNeighborsForCells();

        if(onAfterGridCreationCb){
            onAfterGridCreationCb(this);
        }
    }

    this.addParticles = function(particles) {       
        console.log("Particles: " + particles.length);
        for(var i = 0; i < particles.length; i++) {
            var cell = this.getCellForParticle(particles[i]);
            cell.addParticle(particles[i]);
        }
    }

    this.guessOffset = function(px, py, cell) {
        var xOffset = 0;
        var yOffset = 0;        

        if(px < cell.left) {
            xOffset--;
        } else if (px > cell.right) {
            xOffset++;
        }

        if(py < cell.top) {
            yOffset--;
        } else if (py > cell.bottom) {
            yOffset++;
        }

        return {
            xOffset: xOffset,
            yOffset: yOffset
        };
    }

    this.updateParticlesInCells = function () {
        for (var i = 0; i < this.cells.length; i++) {
            for (var j = 0; j < this.cells[i].length; j++) {
                var cell = this.cells[i][j];
                var removed = cell.removeGoneParticles();
                for (var r = 0; r < removed.length; r++) {
                    var rp = removed[r];
                    var rpPosX = rp.position.x;
                    var rpPosY = rp.position.y;
                    var o = this.guessOffset(rpPosX, rpPosY, cell);
                    
                    o.yOffset = (i + o.yOffset) >= 0 && (i + o.yOffset) < this.rowsCount? o.yOffset: 0;
                    var yIndex = i + o.yOffset;
                    o.xOffset = (j + o.xOffset) >= 0 && (j + o.xOffset) < this.colsCount? o.xOffset: 0;
                    var xIndex = j + o.xOffset;                    
                    
                    this.cells[yIndex][xIndex].addParticle(rp);
                }                
            }
        }
    }

    this.initNeighborsForCells = function (minR, maxR, shouldShuffle) {
        minR = minR || this.cellsIgnoreRadius;
        maxR = maxR || this.cellsSearchRadius;
        shouldShuffle = shouldShuffle || true;

        var shuffle = function(array) {
            var currentIndex = array.length, temporaryValue, randomIndex;
            while (0 !== currentIndex) {
                randomIndex = Math.floor(Math.random() * currentIndex);
                currentIndex -= 1;
                temporaryValue = array[currentIndex];
                array[currentIndex] = array[randomIndex];
                array[randomIndex] = temporaryValue;
            }
          
            return array;
        }
        this.iterateCells(function(cell, grid) {
            var neighbors = grid.getCellsNeighbors(minR, maxR, cell, grid);

            cell.neighbors = shouldShuffle? shuffle(neighbors): neighbors;
        });
    }

    this.getCellsNeighbors = function(minR, maxR, cell, grid) {
        var neighbors = [];
        var ignoreY = [cell.rowIndex - minR, cell.rowIndex + minR];
        var ignoreX = [cell.colIndex - minR, cell.colIndex + minR];
        for (var yIndex = cell.rowIndex - maxR; yIndex <= (cell.rowIndex + maxR) && yIndex < grid.rowsCount; yIndex++) {
            for (var xIndex = cell.colIndex - maxR; xIndex <= (cell.colIndex + maxR) && xIndex < grid.colsCount; xIndex++) {
                if(yIndex >= 0 && xIndex >= 0) {
                    if((yIndex < ignoreY[0] || yIndex > ignoreY[1]) || (xIndex < ignoreX[0] || xIndex > ignoreX[1])) {
                        if(yIndex != cell.rowIndex || xIndex != cell.colIndex){
                            neighbors.push(grid.cells[yIndex][xIndex]);
                        }
                    }
                }
            }
        }
        return neighbors;
    }

    function getNeighbors(particle) {
        var neighbors = [];
        var cell = particle.cell;
        
        for (var i = 0; i < cell.neighbors.length; i++) {
            var neighborCell = cell.neighbors[i];
            neighbors = neighbors.concat(neighborCell.particles.filter(function(n){
                return n.connectionsMap[particle.id+""] == null;
            }));
        }
        if(neighbors.length == 0 && onRequestAdditionalNeighborsCb != null){
            neighbors = onRequestAdditionalNeighborsCb(particle);
        }

        return neighbors;
    }

    this.connectParticles = function() {
        for (var cr = 0; cr < this.cells.length; cr++) {
            var cellsRow = this.cells[cr];
            for (var ci = 0; ci < cellsRow.length; ci++) {
                var cell = cellsRow[ci];
                for (var i = 0; i < cell.particles.length; i++) {
                    var p = cell.particles[i];
                    p.addChilds(getNeighbors(p).slice(0, cell.maxJoins));
                }
            }
        }
    }


    this.iterateCells = function(cb) {
        for (var cr = 0; cr < this.cells.length; cr++) {
            var cellsRow = this.cells[cr];
            for (var ci = 0; ci < cellsRow.length; ci++) {
                var cell = cellsRow[ci];

                cb(cell, this);
            }
        }
    }

    this.getAllParticles = function() {
        var all = [];
        this.iterateCells(function(cell){
            all = all.concat(cell.particles);
        });
        return all;
    }

    this.update = function() {
        this.updateParticlesInCells();
        this.connectParticles();
    }
}

/***/ }),
/* 5 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = GridCell;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__vector__ = __webpack_require__(0);


function GridCell(id, rowIndex, colIndex, posLeftTop, width, height, maxJoins) {
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
    this.center = new __WEBPACK_IMPORTED_MODULE_0__vector__["a" /* default */](this.left + this.width / 2, this.top + this.height / 2);

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

/***/ }),
/* 6 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
 /**
  * Deep extend for object. Taken from here: https://gist.github.com/anvk/cf5630fab5cde626d42a
  */
function deepExtend(out) {
    out = out || {};

    for (var i = 1, len = arguments.length; i < len; ++i) {
        var obj = arguments[i];

        if (!obj) {
            continue;
        }

        for (var key in obj) {
            if (!obj.hasOwnProperty(key)) {
                continue;
            }

            if (Object.prototype.toString.call(obj[key]) === '[object Object]') {
                out[key] = deepExtend(out[key], obj[key]);
                continue;
            }

            out[key] = obj[key];
        }
    }

    return out;
};

function addEvent(el, eventType, handler) {
    if(el == null){
        return;
    }
    if (el.addEventListener) {
        el.addEventListener(eventType, handler, false);
    } else if (el.attachEvent) {
        el.attachEvent('on' + eventType, handler);
    } else {
        el['on' + eventType] = handler;
    }
};

function getAnimationFrame(callback){
    if(window.requestAnimationFrame){
        window.requestAnimationFrame(callback);
    } else if( window.webkitRequestAnimationFrame){
        window.webkitRequestAnimationFrame(callback);
    } else if (window.mozRequestAnimationFrame){
        window.mozRequestAnimationFrame(callback);
    } else {
        window.setTimeout(callback, 1000 / 60);
    }
};

function getCurrentTime(){
    var date = new Date();
    return date.getTime();
};

function addPauseOnInactiveTab(startCb, stopCb) {
    var hidden = "";
    var visibilityChange = "";

    if (typeof document.hidden !== "undefined") {
        hidden = "hidden";
        visibilityChange = "visibilitychange";
    } else if (typeof document.msHidden !== "undefined") {
        hidden = "msHidden";
        visibilityChange = "msvisibilitychange";
    } else if (typeof document.webkitHidden !== "undefined") {
        hidden = "webkitHidden";
        visibilityChange = "webkitvisibilitychange";
    }

    if (typeof document[hidden] === "undefined") {
        console.log("This footage requires a browser, such as Google Chrome or Firefox, that supports the Page Visibility API. Will be using fallback.");
        addEvent(window, 'focus', startCb);
        addEvent(window, 'blur', stopCb);
    } else {
        var handleVisibilityChange = function(){
            if (document[hidden]) {
                stopCb();
            } else {
                startCb();
            }
        };
        addEvent(document, visibilityChange, handleVisibilityChange);
    }
}

function getPixelRatio() {
    if(window.devicePixelRatio != null && window.devicePixelRatio > 1){
        return window.devicePixelRatio;
    } else {
        return 1;
    }
}

/* harmony default export */ __webpack_exports__["a"] = ({
    deepExtend: deepExtend,
    addEvent: addEvent,
    getAnimationFrame: getAnimationFrame,
    getCurrentTime: getCurrentTime,
    addPauseOnInactiveTab: addPauseOnInactiveTab,
    getPixelRatio: getPixelRatio
});

/***/ }),
/* 7 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = Render;

function Render(context, width, height, pixelRatio, particles, grid, options) {
    context.clearRect(0, 0, width, height);
    context.lineWidth = 1.5 * pixelRatio;
    var particle = null;

    for(var i = 0; i < particles.length; i++){
        particle = particles[i];
        context.fillStyle = 'rgba(255, 255, 255, ' +particle.jointAlpha.toPrecision(3) + ')';
        context.strokeStyle = 'rgba(255, 255, 255, ' + particle.linkAlpha.toPrecision(3) + ')';
        context.beginPath();        
        context.arc(particle.position.x, particle.position.y, particle.radius * pixelRatio, 0, 2 * Math.PI);
        context.fill();

        for(var y = 0; y < particle.childs.length; y++){            
            context.strokeStyle = 'rgba(255, 255, 255, ' + particle.connectionsMap[particle.childs[y].id+""].toPrecision(3) + ')';
            context.beginPath();
            context.moveTo(particle.position.x, particle.position.y);
            context.lineTo(particle.childs[y].position.x, particle.childs[y].position.y);
            context.stroke();
        }
    }

    //drawTriangles(context, grid);

    if(options.debug.showGrid) {
        context.strokeStyle = 'green';
        context.fillStyle = 'rgba(255, 255, 255, 0.5)';
        grid.iterateCells(function(cell) {
            
            context.font = 10*pixelRatio+"px Arial";
            context.fillText(cell.id, cell.left, cell.top + 10 * pixelRatio);
            context.rect(cell.left, cell.top, cell.width, cell.height);
            if(cell.isSelected) {
                context.fillStyle = 'rgba(0, 0, 255, 0.3)';
                context.fillRect(cell.left, cell.top, cell.width, cell.height);
                context.fillStyle = 'rgba(255, 255, 255, 0.5)';
            }
        });
        context.stroke();
    }
}

/***/ }),
/* 8 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
function bounce(particles, delta, grid) {
    for(var i = 0; i < particles.length; i++){
        particles[i].update(delta);

        if(particles[i].position.x > grid.width){
            particles[i].velocity.x *= -1;
            particles[i].position.x = grid.width;
        }

        if(particles[i].position.x < 0){
            particles[i].velocity.x *= -1;
            particles[i].position.x = 0;
        }

        if(particles[i].position.y > grid.height){
            particles[i].velocity.y *= -1;
            particles[i].position.y = grid.height;
        }

        if(particles[i].position.y < 0){
            particles[i].velocity.y *= -1;
            particles[i].position.y = 0;
        }
    }
}

/* harmony default export */ __webpack_exports__["a"] = ({
    bounce: bounce
});

/***/ }),
/* 9 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = initColliders;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__collider__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__particle__ = __webpack_require__(2);



function initColliders() {
    __WEBPACK_IMPORTED_MODULE_0__collider__["a" /* default */].createSimple = function(canvasID){
        var o = {
            handlers: {
                particlesFactory: function(canvasWidth, canvasHeight, ratio) {
                    var particles = [];
                    var count = canvasWidth * canvasHeight / (10000 * ratio);
                    var x = 0,
                        y = 0;
                    for(var i = 0; i < count; i++){
                        x = Math.random() * canvasWidth;
                        y = Math.random() * canvasHeight;
            
                        var particle = new __WEBPACK_IMPORTED_MODULE_1__particle__["a" /* default */](i, x, y);
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
    
        return new __WEBPACK_IMPORTED_MODULE_0__collider__["a" /* default */](canvasID, o);
    }
}

/***/ })
/******/ ]);