!function(t,i){"object"==typeof exports&&"undefined"!=typeof module?i():"function"==typeof define&&define.amd?define(i):i()}(0,function(){"use strict";function t(t,i){var e,s;this.x=t||0,this.y=i||0,this.add=function(t){return this.x+=t.x,this.y+=t.y,this},this.sub=function(t){return this.x-=t.x,this.y-=t.y,this},this.nor=function(){var t=this.len();return t>0&&(this.x=this.x/t,this.y=this.y/t),this},this.dot=function(t){return this.x*t.x+this.y*t.y},this.len2=function(){return this.dot(this)},this.len=function(){return Math.sqrt(this.len2())},this.mul=function(t){return"object"==typeof t?(this.x*=t.x,this.y*=t.y):(this.x*=t,this.y*=t),this},this.copyFrom=function(t){return this.x=t.x,this.y=t.y,this},this.distance=function(t){return e=this.x-t.x,s=this.y-t.y,Math.sqrt(e*e+s*s)}}function i(i,e,s,n,o,h,l){this.isCustom=!1,this.isSelected=!1,this.id=i||0,this.width=o||0,this.height=h||0,this.rowIndex=e||0,this.colIndex=s||0,this.maxJoins=l,this.top=n.y,this.bottom=n.y+h,this.left=n.x,this.right=n.x+o,this.center=new t(this.left+this.width/2,this.top+this.height/2),this.hasError=!1,this.particles=[],this.neighbors=[],this.setParticles=function(t){self=this,this.particles=[].concat(t.map(function(t){return t.cell=self,t}))},this.addParticle=function(t){t.cell=this,this.particles.push(t)},this.check=function(){for(var t=0;t<this.particles.length;t++){var i=this.particles[t].position.x,e=this.particles[t].position.y;if(Math.ceil(i)<this.left||Math.floor(i)>this.right||Math.ceil(e)<this.top||Math.floor(e)>this.bottom)return!1}return!0},this.removeSelfFromNeighbors=function(t){for(var i=0;i<this.neighbors.length;i++){var e=this.neighbors[i];e.neighbors=e.neighbors.filter(function(i){return!(void 0==t||!t(i))||this.id!=i.id},this)}},this.removeGoneParticles=function(){for(var t=[],i=[],e=0,s=0,n=0;n<this.particles.length;n++)e=Math.round(this.particles[n].position.x),s=Math.round(this.particles[n].position.y),e<this.left||e>this.right||s<this.top||s>this.bottom?(this.particles[n].cell=null,t.push(this.particles[n]),null!=this.particles[n].onLeaving&&this.particles[n].onLeaving(this.particles[n])):i.push(this.particles[n]);return i.length<this.particles.length&&this.setParticles(i),t}}function e(e,s,n){var o=n||{};o.pixelRatio=o.pixelRatio||1,this.cells=[],this.cellFixedWidth=32*o.pixelRatio,this.cellFixedHeight=32*o.pixelRatio,this.debugMode=o.enableDebug||!1,this.rowsCount=0,this.colsCount=0,this.width=e,this.height=s,this.cellsSearchRadius=1,this.cellsIgnoreRadius=0,this.maxJoins=o.maxJoins||1;var h=o.onAfterGridCreation,l=o.trianglesPointsFactory,r=o.onRequestAdditionalNeighbors;function a(t){for(var i=[],e=t.cell,s=0;s<e.neighbors.length;s++){var n=e.neighbors[s];i=i.concat(n.particles.filter(function(i){return null==i.connectionsMap[t.id+""]}))}return 0==i.length&&null!=r&&(i=r(t)),i}this.getCellForPosition=function(t,i){var e=Math.floor(t/this.cellFixedWidth),s=Math.floor(i/this.cellFixedHeight);return this.cells[s][e]},this.getCellForParticle=function(t){Math.floor(t.position.x/this.cellFixedWidth),Math.floor(t.position.y/this.cellFixedHeight);return this.getCellForPosition(t.position.x,t.position.y)},this.getTrianglesPoints=function(){return l?l():null},this.initGrid=function(){var e=0;this.cells=[],this.rowsCount=0;for(var s=0;s<this.height;s+=this.cellFixedHeight,this.rowsCount++){this.colsCount=0,this.cells.push([]);for(var n=0;n<this.width;n+=this.cellFixedWidth,this.colsCount++,e++){var o=new t(n,s),l=s+this.cellFixedHeight<=this.height?this.cellFixedHeight:this.height-s,r=n+this.cellFixedWidth<=this.width?this.cellFixedWidth:this.width-n;this.cells[this.rowsCount].push(new i(e,this.rowsCount,this.colsCount,o,r,l,this.maxJoins))}}this.initNeighborsForCells(),h&&h(this)},this.addParticles=function(t){console.log("Particles: "+t.length);for(var i=0;i<t.length;i++){this.getCellForParticle(t[i]).addParticle(t[i])}},this.guessOffset=function(t,i,e){var s=0,n=0;return t<e.left?s--:t>e.right&&s++,i<e.top?n--:i>e.bottom&&n++,{xOffset:s,yOffset:n}},this.updateParticlesInCells=function(){for(var t=0;t<this.cells.length;t++)for(var i=0;i<this.cells[t].length;i++)for(var e=this.cells[t][i],s=e.removeGoneParticles(),n=0;n<s.length;n++){var o=s[n],h=o.position.x,l=o.position.y,r=this.guessOffset(h,l,e);r.yOffset=t+r.yOffset>=0&&t+r.yOffset<this.rowsCount?r.yOffset:0;var a=t+r.yOffset;r.xOffset=i+r.xOffset>=0&&i+r.xOffset<this.colsCount?r.xOffset:0;var c=i+r.xOffset;this.cells[a][c].addParticle(o)}},this.initNeighborsForCells=function(t,i,e){t=t||this.cellsIgnoreRadius,i=i||this.cellsSearchRadius,e=e||!0;this.iterateCells(function(s,n){var o=n.getCellsNeighbors(t,i,s,n);s.neighbors=e?function(t){for(var i,e,s=t.length;0!==s;)e=Math.floor(Math.random()*s),i=t[s-=1],t[s]=t[e],t[e]=i;return t}(o):o})},this.getCellsNeighbors=function(t,i,e,s){for(var n=[],o=[e.rowIndex-t,e.rowIndex+t],h=[e.colIndex-t,e.colIndex+t],l=e.rowIndex-i;l<=e.rowIndex+i&&l<s.rowsCount;l++)for(var r=e.colIndex-i;r<=e.colIndex+i&&r<s.colsCount;r++)l>=0&&r>=0&&(l<o[0]||l>o[1]||r<h[0]||r>h[1])&&(l==e.rowIndex&&r==e.colIndex||n.push(s.cells[l][r]));return n},this.connectParticles=function(){for(var t=0;t<this.cells.length;t++)for(var i=this.cells[t],e=0;e<i.length;e++)for(var s=i[e],n=0;n<s.particles.length;n++){var o=s.particles[n];o.addChilds(a(o).slice(0,s.maxJoins))}},this.iterateCells=function(t){for(var i=0;i<this.cells.length;i++)for(var e=this.cells[i],s=0;s<e.length;s++){t(e[s],this)}},this.getAllParticles=function(){var t=[];return this.iterateCells(function(i){t=t.concat(i.particles)}),t},this.update=function(){this.updateParticlesInCells(),this.connectParticles()}}function s(t,i,e){null!=t&&(t.addEventListener?t.addEventListener(i,e,!1):t.attachEvent?t.attachEvent("on"+i,e):t["on"+i]=e)}var n={deepExtend:function t(i){i=i||{};for(var e=1,s=arguments.length;e<s;++e){var n=arguments[e];if(n)for(var o in n)n.hasOwnProperty(o)&&("[object Object]"!==Object.prototype.toString.call(n[o])?i[o]=n[o]:i[o]=t(i[o],n[o]))}return i},addEvent:s,getAnimationFrame:function(t){window.requestAnimationFrame?window.requestAnimationFrame(t):window.webkitRequestAnimationFrame?window.webkitRequestAnimationFrame(t):window.mozRequestAnimationFrame?window.mozRequestAnimationFrame(t):window.setTimeout(t,1e3/60)},getCurrentTime:function(){return(new Date).getTime()},addPauseOnInactiveTab:function(t,i){var e="",n="";void 0!==document.hidden?(e="hidden",n="visibilitychange"):void 0!==document.msHidden?(e="msHidden",n="msvisibilitychange"):void 0!==document.webkitHidden&&(e="webkitHidden",n="webkitvisibilitychange"),void 0===document[e]?(console.log("This footage requires a browser, such as Google Chrome or Firefox, that supports the Page Visibility API. Will be using fallback."),s(window,"focus",t),s(window,"blur",i)):s(document,n,function(){document[e]?i():t()})},getPixelRatio:function(){return null!=window.devicePixelRatio&&window.devicePixelRatio>1?window.devicePixelRatio:1}};var o={bounce:function(t,i,e){for(var s=0;s<t.length;s++)t[s].update(i),t[s].position.x>e.width&&(t[s].velocity.x*=-1,t[s].position.x=e.width),t[s].position.x<0&&(t[s].velocity.x*=-1,t[s].position.x=0),t[s].position.y>e.height&&(t[s].velocity.y*=-1,t[s].position.y=e.height),t[s].position.y<0&&(t[s].velocity.y*=-1,t[s].position.y=0)}};function h(i,e,s){this.id=i,this.position=new t(e,s),this.velocity=new t,this.speed=0,this.parentId=null,this.connectionsMap={},this.childs=[],this.linked=!1,this.distance=!1,this.alpha=.3,this.radius=2,this.hasError=!1,this.connectionsAlphaInc=.01,this.cell=null,this.isCustom=!1,this.jointAlpha=.8,this.linkAlpha=this.alpha,this.linkToParentAlpha=0;var n=new t,o=0;this.riseError=function(){this.hasError=!0,this.cell.hasError=!0},this.update=function(t){(n=n.copyFrom(this.velocity)).mul(this.speed*t),this.position.add(n),this.jointAlpha=.8,this.linkAlpha=this.alpha},this.addChilds=function(t){for(var i=0,e=null,s={},n=[],o=0;o<t.length;o++)e=t[o],i=null!=this.connectionsMap[e.id+""]?this.connectionsMap[e.id+""]+this.connectionsAlphaInc:0,s[e.id+""]=i<=.3?i:.3,n.push(e);this.connectionsMap=s,this.childs=n},this.removeChild=function(t){for(o=0;o<this.childs.length;o++)this.childs[o]===t&&this.childs.splice(o,1)},this.onLeaving=null}function l(t,i){var s,h,l,r=0,a=0,c=null,d=[],u={},f=0,p=0,g={grid:{cellFixedWidth:32,cellFixedHeight:32,cellsSearchRadius:1,cellsIgnoreRadius:0,maxConnections:1,particleSpeed:2,stopOnBlur:!0},handlers:{onAfterGridCreation:null,particlesFactory:null},debug:{showGrid:!1,pauseOnCtrlClick:!1,selectOnDblClick:!1}};null!=i&&(g=n.deepExtend(g,i)),u.formatParticles=function(t){return t(r,a,l).map(function(t){return t.speed*=l,t})},u.addParticles=function(t){var i=u.formatParticles(t);c.addParticles(i),d=c.getAllParticles()},u.pushParticle=function(t,i){},u.update=function(t){o.bounce(d,t,c),c.update()},u.loop=function(){var t=((f=n.getCurrentTime())-p)/100;p=f,t>.2&&(t=.2),u.update(t),u.draw(),n.getAnimationFrame(u.loop)},u.draw=function(){!function(t,i,e,s,n,o,h){t.clearRect(0,0,i,e),t.lineWidth=1.5*s;for(var l=null,r=0;r<n.length;r++){l=n[r],t.fillStyle="rgba(255, 255, 255, "+l.jointAlpha.toPrecision(3)+")",t.strokeStyle="rgba(255, 255, 255, "+l.linkAlpha.toPrecision(3)+")",t.beginPath(),t.arc(l.position.x,l.position.y,l.radius*s,0,2*Math.PI),t.fill();for(var a=0;a<l.childs.length;a++)t.strokeStyle="rgba(255, 255, 255, "+l.connectionsMap[l.childs[a].id+""].toPrecision(3)+")",t.beginPath(),t.moveTo(l.position.x,l.position.y),t.lineTo(l.childs[a].position.x,l.childs[a].position.y),t.stroke()}h.debug.showGrid&&(t.strokeStyle="green",t.fillStyle="rgba(255, 255, 255, 0.5)",o.iterateCells(function(i){t.font=10*s+"px Arial",t.fillText(i.id,i.left,i.top+10*s),t.rect(i.left,i.top,i.width,i.height),i.isSelected&&(t.fillStyle="rgba(0, 0, 255, 0.3)",t.fillRect(i.left,i.top,i.width,i.height),t.fillStyle="rgba(255, 255, 255, 0.5)")}),t.stroke())}(s,r,a,l,d,c,g)},u.initCanvas=function(){s=h.getContext("2d"),l=n.getPixelRatio(),h.width=window.innerWidth,h.height=window.innerHeight,r=h.width,a=h.height},u.initGrid=function(){(c=new e(r,a,{pixelRatio:l})).initGrid(),null!=g.handlers.particlesFactory&&c.addParticles(u.formatParticles(g.handlers.particlesFactory)),d=c.getAllParticles()},u.initCollider=function(){h=document.getElementById(t),u.initCanvas(),u.initGrid(),u.loop()},this.pushParticle=u.pushParticle,this.addParticles=u.addParticles,u.initCollider()}window.window.ColliderJS=l,l.createSimple=function(t){return new l(t,{handlers:{particlesFactory:function(t,i,e){for(var s=[],n=t*i/(1e4*e),o=0;o<n;o++){var l=new h(o,Math.random()*t,Math.random()*i);l.velocity.x=Math.random()-.5,l.velocity.y=Math.random()-.5,l.velocity.nor(),l.speed=2,s.push(l)}return s}}})}});
