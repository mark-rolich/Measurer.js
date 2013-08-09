/**
* This Javascript package allows to measure dimensions of the objects on html page
* Is available as a bookmarklet, please see bookmarklet.js and bookmarklet_ie.js files 
* provided with the package
*
* Tested in the following browsers: IE 8, FF 18, Chrome 24
*
* Measurer.js requires Event.js and Dragdrop.js packages, which can be acquired at the following links:
*
* Event.js
*
* Github - https://github.com/mark-rolich/Event.js
* JS Classes - http://www.jsclasses.org/package/212-JavaScript-Handle-events-in-a-browser-independent-manner.html
*
* Dragdrop.js
*
* Github - https://github.com/mark-rolich/Dragdrop.js
* JS Classes - http://www.jsclasses.org/package/215-JavaScript-Handle-drag-and-drop-events-of-page-elements.html
*
* @author Mark Rolich <mark.rolich@gmail.com>
*/
var Measurer = function (evt, dragdrop) {
    "use strict";

    this.enabled = 0;

    var tools       = [],
        i           = 0,
        measurer    = null,
        doc         = (document.body && (document.body.scrollLeft || document.body.scrollTop))
                      ? document.body
                      : document.documentElement,
        Tool        = function (e, src) {
            var tool        = null,
                info        = null,
                started     = 0,
                startX      = 0,
                startY      = 0,
                resizeHndl  = null,
                x           = 0,
                y           = 0,
                w           = 0,
                h           = 0,
                updateInfo  = function (x, y, w, h) {
                    info.innerHTML = 'X: ' + x + '<br>Y: ' + y + '<br>W: ' + (w + 2) + '<br>H: ' + (h + 2);
                },
                move        = function (elem) {
                    var x = parseInt(elem.style.left, 10),
                        y = parseInt(elem.style.top, 10);

                    updateInfo(x, y, w, h);
                },
                resize      = function (e) {
                    if (started === 1) {
                        w = e.clientX - startX + doc.scrollLeft;
                        h = e.clientY - startY + doc.scrollTop;

                        if (w <= 0) {
                            w = -w;
                            x = e.clientX + doc.scrollLeft;
                            tool.style.left = x + 'px';
                        }

                        if (h <= 0) {
                            h = -h;
                            y = e.clientY + doc.scrollTop;
                            tool.style.top = y + 'px';
                        }

                        tool.style.width = w + 'px';
                        tool.style.height = h + 'px';

                        updateInfo(x, y, w, h);
                    }
                },
                init        = function () {
                    if (src.id === 'measurer-area') {
                        x = startX = e.clientX + doc.scrollLeft;
                        y = startY = e.clientY + doc.scrollTop;

                        tool = document.createElement('div');

                        tool.style.cssText = 'position: absolute; top: ' + startY + 'px; left: ' + startX + 'px; cursor: crosshair; z-index: 9999; background-color: transparent; border: dotted 1px #000; visibility: visible; width: 0; height: 0';

                        tool.className = 'draggable';

                        info = document.createElement('div');

                        info.style.cssText = 'font: 12px Arial; padding: 3px; position: absolute; top: 100%; left: 100%; background-color: #C4ECFF; width: 45px; height: auto; border: solid 1px #aaa; cursor: crosshair';
                        info.appendChild(document.createTextNode('\xA0'));

                        tool.appendChild(info);

                        document.body.appendChild(tool);

                        evt.prevent(e);

                        updateInfo(x, y, 0, 0);

                        started = 1;
                        resizeHndl = evt.attach('mousemove', document, resize, true);
                        dragdrop.set(tool, {
                            onmove: move
                        });
                    }
                },
                stop        = function () {
                    if (started === 1) {
                        started = 0;
                        evt.detach('mousemove', document, resizeHndl, true);
                        tool.style.cursor = 'move';
                    }
                };

            this.destroy = function () {
                if (tool !== null) {
                    document.body.removeChild(tool);
                    tool = null;
                }
            };

            init();
            evt.attach('mouseup', document, stop, false);
        },
        render = function () {
            measurer = document.createElement('div');

            measurer.id = 'measurer-area';
            measurer.style.cssText = 'position: absolute; top: 0; left: 0; cursor: crosshair; z-index: 9998; background-color: transparent; opacity: 0.1; width: ' + doc.scrollWidth + 'px; height: ' + doc.scrollHeight + 'px; display: none';

            document.body.appendChild(measurer);
        };

    render();

    this.enable = function () {
        measurer.style.display = 'block';
        this.enabled = 1;
    };

    this.disable = function () {
        measurer.style.display = 'none';

        for (i = 0; i < tools.length; i += 1) {
            tools[i].destroy();
            delete tools[i];
        }

        tools = [];
        this.enabled = 0;
    };

    evt.attach('mousedown', document, function (e, src) {
        if (src.id === 'measurer-area') {
            if (e.shiftKey === false) {
                for (i = 0; i < tools.length; i += 1) {
                    tools[i].destroy();
                    delete tools[i];
                }

                tools = [];
            }

            tools.push(new Tool(e, src));
        }
    }, false);
};