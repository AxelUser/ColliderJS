!function(t){function i(n){if(e[n])return e[n].exports;var o=e[n]={i:n,l:!1,exports:{}};return t[n].call(o.exports,o,o.exports,i),o.l=!0,o.exports}var e={};i.m=t,i.c=e,i.d=function(t,e,n){i.o(t,e)||Object.defineProperty(t,e,{configurable:!1,enumerable:!0,get:n})},i.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return i.d(e,"a",e),e},i.o=function(t,i){return Object.prototype.hasOwnProperty.call(t,i)},i.p="",i(i.s=2)}([function(t,i,e){"use strict";i.a=function(t,i){this.x=t||0,this.y=i||0;var e,n;this.add=function(t){return this.x+=t.x,this.y+=t.y,this},this.sub=function(t){return this.x-=t.x,this.y-=t.y,this},this.nor=function(){var t=this.len();return t>0&&(this.x=this.x/t,this.y=this.y/t),this},this.dot=function(t){return this.x*t.x+this.y*t.y},this.len2=function(){return this.dot(this)},this.len=function(){return Math.sqrt(this.len2())},this.mul=function(t){return"object"==typeof t?(this.x*=t.x,this.y*=t.y):(this.x*=t,this.y*=t),this},this.copyFrom=function(t){return this.x=t.x,this.y=t.y,this},this.distance=function(t){return e=this.x-t.x,n=this.y-t.y,Math.sqrt(e*e+n*n)}}},function(t,i,e){"use strict";e(0),e(1)},function(t,i,e){"use strict";Object.defineProperty(i,"__esModule",{value:!0});var n=e(0);e(1),e(3);i.default=function(t,i){var e,o,r,s,l,c,u,h,a,d,f=[],y=0,w=0,p={},g=i||!1,x=i||!1,b=i||!1,m=!1,v=i||!1,S=!0,k=i||!1,P=null;this.setDebugMode=function(t){g=t,x=t,b=t,v=t,k=t};var A=function(){document[a]?M():R()},q=function(t){t.ctrlKey&&(S?M():R())},F=function(t){null!=P&&(P.isSelected=!1,P.neighbors.forEach(function(t){t.isSelected=!1}));var i=p.getCellForPosition(t.clientX,t.clientY);i.isSelected=!0,i.neighbors.forEach(function(t){t.isSelected=!0}),P=i},E=function(){void 0!==document.hidden?(a="hidden",d="visibilitychange"):void 0!==document.msHidden?(a="msHidden",d="msvisibilitychange"):void 0!==document.webkitHidden&&(a="webkitHidden",d="webkitvisibilitychange"),void 0===document[a]?(console.log("This footage requires a browser, such as Google Chrome or Firefox, that supports the Page Visibility API. Will be using fallback."),C(window,"focus",R),C(window,"blur",M)):C(document,d,A)},R=function(){S||(S=!0,T())},M=function(){S=!1},T=function(){!S||b&&m||(w=W(),l=(w-y)/100,y=w,l>.2&&(l=.2),z(l),O(),_(T))},j=function(){o=t.width=window.innerWidth,r=t.height=window.innerHeight,s=new n.a(o/2,r/2),H()},H=function(){p=createSnowflakeParticleGrid(o,r,2,i),f=p.getAllParticles()},C=function(t,i,e){null!=t&&(t.addEventListener?t.addEventListener(i,e,!1):t.attachEvent?t.attachEvent("on"+i,e):t["on"+i]=e)},O=function(){for(e.clearRect(0,0,o,r),e.lineWidth=1.5,h={},c=0;c<f.length;c++)for(h=f[c],e.strokeStyle="rgba(255, 255, 255, "+h.linkAlpha.toPrecision(3)+")",x&&h.hasError?(m=!0,e.fillStyle="red",e.fillRect(h.position.x-2,h.position.y-2,5,5)):(e.beginPath(),e.fillStyle="rgba(255, 255, 255, "+h.jointAlpha.toPrecision(3)+")",e.arc(h.position.x,h.position.y,h.radius,0,2*Math.PI),e.fill()),u=0;u<h.childs.length;u++)e.strokeStyle="rgba(255, 255, 255, "+h.connectionsMap[h.childs[u].id+""].toPrecision(3)+")",e.beginPath(),e.moveTo(h.position.x,h.position.y),e.lineTo(h.childs[u].position.x,h.childs[u].position.y),e.stroke();g&&(e.strokeStyle="green",e.fillStyle="rgba(255, 255, 255, 0.5)",p.iterateCells(function(t){e.font="10px Arial",e.fillText(t.id,t.left,t.top+10),e.rect(t.left,t.top,t.width,t.height),t.isSelected&&(e.fillStyle="rgba(0, 0, 255, 0.3)",e.fillRect(t.left,t.top,t.width,t.height),e.fillStyle="rgba(255, 255, 255, 0.5)"),x&&t.hasError&&(e.fillStyle="rgba(255, 0, 0, 0.2)",e.fillRect(t.left,t.top,t.width,t.height),e.fillStyle="rgba(255, 255, 255, 0.5)")}),e.stroke())},_=function(t){window.requestAnimationFrame?window.requestAnimationFrame(t):window.webkitRequestAnimationFrame?window.webkitRequestAnimationFrame(t):window.mozRequestAnimationFrame?window.mozRequestAnimationFrame(t):window.setTimeout(t,1e3/60)},z=function(t){for(c=0;c<f.length;c++)f[c].update(t),f[c].position.x>o&&(f[c].velocity.x*=-1,f[c].position.x=o),f[c].position.x<0&&(f[c].velocity.x*=-1,f[c].position.x=0),f[c].position.y>r&&(f[c].velocity.y*=-1,f[c].position.y=r),f[c].position.y<0&&(f[c].velocity.y*=-1,f[c].position.y=0);p.update()},W=function(){return(new Date).getTime()};!function(){if(!t)return!1;y=W(),e=t.getContext("2d"),C(window,"resize",j),E(),k&&C(window,"dblclick",F),v&&C(window,"click",q),j(),T()}()}},function(t,i,e){"use strict"}]);