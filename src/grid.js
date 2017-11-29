import Vector from "./vector";
import GridCell from "./cell";

export default function Grid(width, height, options) {
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
                var pos = new Vector(sumWidth, sumHeight);
                var h = sumHeight + this.cellFixedHeight <= this.height? this.cellFixedHeight: this.height - sumHeight;
                var w = sumWidth + this.cellFixedWidth <= this.width? this.cellFixedWidth: this.width - sumWidth;
                this.cells[this.rowsCount].push(new GridCell(id, this.rowsCount, this.colsCount, pos, w, h, this.maxJoins));
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