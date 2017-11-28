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

export default {
    deepExtend: deepExtend,
    addEvent: addEvent,
    getAnimationFrame: getAnimationFrame,
    getCurrentTime: getCurrentTime,
    addPauseOnInactiveTab: addPauseOnInactiveTab
}