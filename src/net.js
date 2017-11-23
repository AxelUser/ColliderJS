import Vector from "./vector";
import Particle from "./particle";
import GridCell from "./cell";
import ParticleGrid from "./grid";

export default function ParticleNet($canvas, enableDebug){
    'use strict';
  
    var darkTriangleColor = "#7A0006",
        lightTriangleColor = "#A20008",
        yearColor = "#A20008";

    var particleSpeed = 2.0;

    var context,
        width,
        height,
        center,
        particles = [],
        time = 0,
        newTime = 0,
        delta,
        i, y,
        particle;

    var grid = {};

    //for debug
    var showGrid = enableDebug || false;

    var showParticlesWithError = enableDebug || false;
    var stopOnErrors = enableDebug || false;
    var hasError = false;

    var hidden, visibilityChange;
    var pauseOnClick = enableDebug || false;
    var stopOnBlur = true;
    var runLoop = true;

    var selectOnDbClick = enableDebug || false;
    var selectedCell = null;

    this.setDebugMode = function(isDebug) {
        showGrid = isDebug;
        showParticlesWithError = isDebug;
        stopOnErrors = isDebug;
        pauseOnClick = isDebug;
        selectOnDbClick = isDebug;
    }

    var handleVisibilityChange = function() {
        if (document[hidden]) {
            stopLoop();
        } else {
            continueLoop();
        }
    }

    var handlePauseClick = function(e){
        if(e.ctrlKey) {
            if(runLoop) {
                stopLoop();
            } else {
                continueLoop();
            }
        }
    }

    var handleSelectDbClick = function(e){
        if(selectedCell != null) {
            selectedCell.isSelected = false;
            selectedCell.neighbors.forEach(function(val) {
                val.isSelected = false;
            });
        }
        var c = grid.getCellForPosition(e.clientX, e.clientY);
        c.isSelected = true;
        c.neighbors.forEach(function(val) {
            val.isSelected = true;
        });
        selectedCell = c;
    }

    var initPauseOnInactiveTab = function() {
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
            addEvent(window, 'focus', continueLoop);
            addEvent(window, 'blur', stopLoop);
        } else {
            addEvent(document, visibilityChange, handleVisibilityChange);
        }
    }

    var init = function(){
        if(!$canvas){
            return false;
        }

        time = getCurrentTime();
        context = $canvas.getContext('2d');
        addEvent(window, 'resize', initCanvas);

        if(stopOnBlur) {
            initPauseOnInactiveTab();
        }

        if(selectOnDbClick) {
            addEvent(window, 'dblclick', handleSelectDbClick);
        }

        if(pauseOnClick) {
            addEvent(window, 'click', handlePauseClick);
        }

        initCanvas();
        loop();
    };

    var continueLoop = function() {
        if(!runLoop) {
            runLoop = true;
            loop();
        }
    }

    var stopLoop = function() {
        runLoop = false;
    }

    var loop = function(){
        if(!runLoop || stopOnErrors && hasError){
            return;
        }
        newTime = getCurrentTime();
        delta = (newTime - time) / 100;
        time = newTime;

        if(delta > 0.2){
            delta = 0.2;
        }

        update(delta);
        draw();
        getAnimationFrame(loop);
    };

    var initCanvas = function(){
        width = $canvas.width = window.innerWidth;
        height = $canvas.height = window.innerHeight;
        center = new Vector(width/2, height/2);
        initGrid();
    };

    var particlesFactory = function(grid) {
        var count = width * height / 6000;
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
    
    var initGrid = function() {
        grid = new ParticleGrid(width, height);
        grid.initGrid();
        grid.addParticles(particlesFactory);
        particles = grid.getAllParticles();
    }

    var addEvent = function($el, eventType, handler) {
        if($el == null){
            return;
        }
        if ($el.addEventListener) {
            $el.addEventListener(eventType, handler, false);
        } else if ($el.attachEvent) {
            $el.attachEvent('on' + eventType, handler);
        } else {
            $el['on' + eventType] = handler;
        }
    };

    var draw = function(){
        context.clearRect ( 0 , 0 , width , height );
        context.lineWidth = 1.5;
        particle = {};
        for(i = 0; i < particles.length; i++){
            particle = particles[i];
            
            context.strokeStyle = 'rgba(255, 255, 255, ' + particle.linkAlpha.toPrecision(3) + ')';
            if(showParticlesWithError && particle.hasError) {
                hasError = true;
                context.fillStyle = 'red';
                context.fillRect(particle.position.x-2, particle.position.y-2, 5, 5);
            } else {
                context.beginPath();
                context.fillStyle = 'rgba(255, 255, 255, ' +particle.jointAlpha.toPrecision(3) + ')';
                context.arc(particle.position.x, particle.position.y, particle.radius, 0, 2 * Math.PI);
                context.fill();
            } 


            for(y = 0; y < particle.childs.length; y++){
                
                context.strokeStyle = 'rgba(255, 255, 255, ' + particle.connectionsMap[particle.childs[y].id+""].toPrecision(3) + ')';
                context.beginPath();
                context.moveTo(particle.position.x, particle.position.y);
                context.lineTo(particle.childs[y].position.x, particle.childs[y].position.y);
                context.stroke();
            }
        }

        //drawTriangles(context, grid);

        if(showGrid) {
            context.strokeStyle = 'green';
            context.fillStyle = 'rgba(255, 255, 255, 0.5)';
            grid.iterateCells(function(cell) {
                
                context.font = "10px Arial";
                context.fillText(cell.id, cell.left, cell.top + 10);
                context.rect(cell.left, cell.top, cell.width, cell.height);
                if(cell.isSelected) {
                    context.fillStyle = 'rgba(0, 0, 255, 0.3)';
                    context.fillRect(cell.left, cell.top, cell.width, cell.height);
                    context.fillStyle = 'rgba(255, 255, 255, 0.5)';
                }
                if(showParticlesWithError && cell.hasError) {
                    context.fillStyle = 'rgba(255, 0, 0, 0.2)';
                    context.fillRect(cell.left, cell.top, cell.width, cell.height);
                    context.fillStyle = 'rgba(255, 255, 255, 0.5)';
                }
            });
            context.stroke();
        }
    };

    var drawTriangles = function(context, grid){
        var trianlesPoints = grid.getTrianglesPoints();
        var color = darkTriangleColor;
        if(trianlesPoints != null) {
            for (var t = 0; t < trianlesPoints.length; t++) {
                var triangle = trianlesPoints[t];
                context.beginPath();
                context.moveTo(triangle[0].position.x, triangle[0].position.y);
                context.fillStyle = color;
                for(var p = 1; p < 3; p++){
                    context.lineTo(triangle[p].position.x, triangle[p].position.y);
                }

                context.fill();

                for(var p = 0; p < 3; p++){
                    context.beginPath();
                    context.fillStyle = 'rgba(255, 255, 255, 1)';
                    context.arc(triangle[p].position.x, triangle[p].position.y, triangle[p].radius, 0, 2 * Math.PI);
                    context.fill();
                }                

                color = lightTriangleColor;
            }
        }
    }

    var getAnimationFrame = function(callback){
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
 
    var update = function(delta){
        for(i = 0; i < particles.length; i++){
            particles[i].update(delta);

            if(particles[i].position.x > width){
                particles[i].velocity.x *= -1;
                particles[i].position.x = width;
            }

            if(particles[i].position.x < 0){
                particles[i].velocity.x *= -1;
                particles[i].position.x = 0;
            }

            if(particles[i].position.y > height){
                particles[i].velocity.y *= -1;
                particles[i].position.y = height;
            }

            if(particles[i].position.y < 0){
                particles[i].velocity.y *= -1;
                particles[i].position.y = 0;
            }
        }
        grid.update();
    };

    var getCurrentTime = function(){
        var date = new Date();
        return date.getTime();
    };

    init();
};