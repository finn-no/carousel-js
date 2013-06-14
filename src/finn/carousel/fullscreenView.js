/*! carousel-js - 2013-06-14. Copyright (c) 2013 FINN.no AS - http://finn.no/; Licensed MIT */
FINN.carousel = FINN.carousel || {};

(function(C,$, B){
    "use strict";

    C.hasFullscreenSupport = function(){
        var docElm = document.documentElement;
        if (docElm.requestFullscreen) {
            return true;
        }
        else if (docElm.mozRequestFullScreen) {
            return true;
        }
        else if (docElm.webkitRequestFullScreen) {
            return true;
        }
        return false;
    };

    C.setupFullscreenSupport = function(triggerId, controller){
        var viewFullScreen = document.getElementById(triggerId);
        if (viewFullScreen) {
            viewFullScreen.addEventListener("click", function () {
                $("#" + triggerId).hide();
                enterFullscreen();
            }, false);
        }
        document.addEventListener("fullscreenchange", function () {
            if (!document.fullscreen){
                $("#" + triggerId).show();
            }
        }, false);

        document.addEventListener("mozfullscreenchange", function () {
            if (!document.mozFullScreen){
                $("#" + triggerId).show();
            }
        }, false);

        document.addEventListener("webkitfullscreenchange", function () {
            if (!document.webkitIsFullScreen){
                $("#" + triggerId).show();
            }
        }, false);

    };
    C.setupKeyboardShortcut = function(keyCode){
        $(document).bind("keyup", function (e) {
            if (e) {
                console.log(e.which);
                if (e.which === 70){
                    enterFullscreen();
                }
            }
        });
    };
    function enterFullscreen(){
        var docElm = document.documentElement;
        if (docElm.requestFullscreen) {
            docElm.requestFullscreen();
        }
        else if (docElm.mozRequestFullScreen) {
            docElm.mozRequestFullScreen();
        }
        else if (docElm.webkitRequestFullScreen) {
            docElm.webkitRequestFullScreen();
        }
    }
}(FINN.carousel, jQuery, buster));