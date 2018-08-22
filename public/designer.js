function newDesigner() {
    "use strict";
    var canvas, ctx, frame, coordinates, penDown;
    return { setUp: setUp, updateDisplay: updateDisplay };

    function setUp() {
        // set up canvas
        canvas = document.createElement('canvas');
        canvas.setAttribute('width', 500);
        canvas.setAttribute('height', 500);
        canvas.setAttribute('id', 'canvas');
        document.getElementById('drawingDiv').appendChild(canvas);

        ctx = canvas.getContext("2d");
        ctx.strokeStyle = "#42abcd";
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.lineWidth = 10;
        coordinates = [];
        penDown = false;

        // Load frame image
        frame = new Image();
        frame.src = "images/sail-outline.png";
        ctx.drawImage(frame, 0, 0, canvas.width, canvas.height);

        // Add mouse event listeners
        canvas.addEventListener("mousedown", penDownCallback);
        canvas.addEventListener("touchstart", penDownCallback);
        canvas.addEventListener("mousemove", penMoveCallback);
        canvas.addEventListener("touchmove", penMoveCallback);
        canvas.addEventListener("mouseup", penUpCallback);
        canvas.addEventListener("mouseout", penUpCallback);
        canvas.addEventListener("touchend", penUpCallback);
        canvas.addEventListener("touchcancel", penUpCallback);
    }

    function addToCoordinatesList(event, drag) {
        console.log(event);
        var rect = canvas.getBoundingClientRect();
        var coordinateInfo = { drag: drag };
        if (event.touches) {
            coordinateInfo.x = event.touches[0].clientX - rect.left;
            coordinateInfo.y = event.touches[0].clientY - rect.top;
        } else {
            coordinateInfo.x = event.clientX - rect.left;
            coordinateInfo.y = event.clientY - rect.top;
        }

        coordinates.push(coordinateInfo);
    }

    function penDownCallback(e) {
        penDown = true;
        addToCoordinatesList(e, false);
        updateDisplay();
    }

    function penMoveCallback(e) {
        if (penDown) {
            addToCoordinatesList(e, true);
            updateDisplay();
        }
        e.preventDefault(); // stops mobile scrolling
    }

    function penUpCallback() {
        penDown = false;
    }

    function updateDisplay() {
        // back the background white
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // draw all the previous coordinates
        var x, y;
        for (var i = 0; i < coordinates.length; i += 1) {
            // if mouseMoveCallbackging, draw a line to the previous click
            if (coordinates[i].drag) {
                x = coordinates[i - 1].x;
                y = coordinates[i - 1].y;
            } else {
                x = coordinates[i].x - 1;
                y = coordinates[i].y;
            }
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(coordinates[i].x, coordinates[i].y);
            ctx.stroke();
        }
        ctx.closePath();
        ctx.restore();

        // Draw the outline image
        ctx.drawImage(frame, 0, 0, canvas.width, canvas.height);
    }
}

var designer = newDesigner();
designer.setUp();
setTimeout(designer.updateDisplay, 100);
