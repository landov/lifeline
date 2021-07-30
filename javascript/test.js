heCanvas = document.getElementById("canvasOne");
            context = theCanvas.getContext("2d");
            var status = document.getElementById('status');
            var $canvas = $("#canvasOne");
            var canvasOffset = $canvas.offset();
            var offsetX = canvasOffset.left;
            var offsetY = canvasOffset.top;
            var scrollX = $canvas.scrollLeft();
            var scrollY = $canvas.scrollTop();
            var cw = theCanvas.width;
            var ch = theCanvas.height;
            var scaleFactor = 1.00;
            var panX = 0;
            var panY = 0;

            var mainX = 250;
            // setting the middle point position X value
            var mainY = 100;
            // setting the middle point position Y value
            var mainR = 125;
            // main ellipse radius R
            var no = 5;
            // number of nodes to display
            var div_angle = 360 / no;

            var circle = {
                centerX: mainX,
                centerY: mainY + 100,
                radius: mainR,
                angle: .9
            };

            var ball = {
                x: 0,
                y: 0,
                speed: .1
            };
            var a = 1.8;
            //Ellipse width
            var b = .5;
            //Ellipse height

           //Scale and Pan variables
            var translatePos = {
                x: 1,
                y: 1
            };
            var startDragOffset = {};
            var mouseDown = false;

            var elements = [{}];

            // Animate
            var animateInterval = setInterval(drawScreen, 1);

            //Animation
            function drawScreen() {
                context.clearRect(0, 0, cw, ch);
                // Background box
                context.beginPath();
                context.fillStyle = '#EEEEEE';
                context.fillRect(0, 0, theCanvas.width, theCanvas.height);
                context.strokeRect(1, 1, theCanvas.width - 2, theCanvas.height - 2);
                context.closePath();

                context.save();
                context.translate(panX, panY);
                context.scale(scaleFactor, scaleFactor);

                ball.speed = ball.speed + 0.001;

                for (var i = 1; i <= no; i++) {
                    // male
                    new_angle = div_angle * i;
                    //Starting positions for ball 1 at different points on the ellipse
                    circle.angle = (new_angle * (0.0174532925)) + ball.speed;
                    //elliptical x position and y position for animation for the first ball
                    //xx and yy records the first balls coordinates
                    xx = ball.x = circle.centerX - (a * Math.cos(circle.angle)) * (circle.radius);
                    yy = ball.y = circle.centerY + (b * Math.sin(circle.angle)) * (circle.radius);
                    //Draw the first ball with position x and y
                    context.fillStyle = "#000000";
                    context.beginPath();
                    context.arc(ball.x, ball.y, 10, 0, Math.PI * 2, true);
                    context.fill();
                    context.closePath();

                    //alert("male Positions "+"X:  "+ball.x+ " Y: "+ball.y);

                    // female
                    new_angle = div_angle * i + 4;
                    //Starting positions for ball 2 at different points on the ellipse
                    circle.angle = (new_angle * (0.0174532925)) + ball.speed;
                    //elliptical x position and y position for animation for the second ball
                    //ball.x and ball.y record the second balls positions
                    ball.x = circle.centerX - (a * Math.cos(circle.angle)) * (circle.radius);
                    ball.y = circle.centerY + (b * Math.sin(circle.angle)) * (circle.radius);
                    context.fillStyle = "#000000";
                    context.beginPath();
                    context.arc(ball.x, ball.y, 10, 0, Math.PI * 2, true);
                    context.fill();
                    context.closePath();

                    //alert("female Positions "+"X:  "+ball.x+ " Y: "+ball.y);

                    //Record the ball positions in elements array for locating positions with mouse coordinates.
                    elements[i] = {
                        id: i,
                        femaleX: ball.x,
                        femaleY: ball.y,
                        maleX: xx,
                        maleY: yy,
                        w: 10 //radius of the ball to draw while locating the positions
                    };
                    //Text Numbering
                    context.beginPath();
                    context.fillStyle = "blue";
                    context.font = "bold 16px Arial";
                    context.fillText(elements[i].id, ball.x - 20, ball.y + 20);
                    context.closePath();
                    // line drawing--Connecting lines to the balls from the center.
                    context.moveTo(mainX, mainY);
                    context.lineTo((ball.x + xx) / 2, (ball.y + yy) / 2);
                    //Draw line till the middle point between ball1 and ball2
                    context.stroke();
                    context.fill();
                    context.closePath();
                }
                // center point
                context.fillStyle = "#000000";
                context.beginPath();
                context.arc(mainX, mainY, 15, 0, Math.PI * 2, true);
                context.fill();
                context.closePath();

                context.restore();
            }

            // Event Listeners
            // Mouse move event to alert the position of the ball on screen


            document.getElementById("plus").addEventListener("click", function () {
                scaleFactor *= 1.1;
                drawScreen();
            }, false);

            document.getElementById("minus").addEventListener("click", function () {
                scaleFactor /= 1.1;
                drawScreen();
            }, false);

            // Event listeners to handle screen panning
            context.canvas.addEventListener("mousedown", function (evt) {
                mouseDown = true;
                startDragOffset.x = evt.clientX - translatePos.x;
                startDragOffset.y = evt.clientY - translatePos.y;
            });

            context.canvas.addEventListener("mouseup", function (evt) {
                mouseDown = false;
            });

            context.canvas.addEventListener("mouseover", function (evt) {
                mouseDown = false;
            });

            context.canvas.addEventListener("mouseout", function (evt) {
                mouseDown = false;
            });

            context.canvas.addEventListener("mousemove", function (evt) {
                if (mouseDown) {
                    translatePos.x = evt.clientX - startDragOffset.x;
                    translatePos.y = evt.clientY - startDragOffset.y;

                    panX = translatePos.x;
                    panY = translatePos.y;

                    drawScreen();
                }

                evt.preventDefault();
                evt.stopPropagation();

                var mouseX = parseInt(evt.clientX - offsetX);
                var mouseY = parseInt(evt.clientY - offsetY);

                var mouseXT = parseInt((mouseX - panX) / scaleFactor);
                var mouseYT = parseInt((mouseY - panY) / scaleFactor);

                status.innerHTML = mouseXT + " | " + mouseYT;

                for (var i = 1; i < elements.length; i++) {
                    var b = elements[i];
                    context.closePath();
                    context.beginPath();
                    context.arc(b.femaleX, b.femaleY, 10, 0, Math.PI * 2);
                    context.arc(b.maleX, b.maleY, 10, 0, Math.PI * 2);

                    if (context.isPointInPath(mouseXT, mouseYT)) {
                        theCanvas.style.cursor = 'pointer';
                        alert(b.id + " female.x: " + b.femaleX + " female.y: " + b.femaleY + " ball.x: " + ball.x + " ball.y: " + ball.y);
                        return;
                    } else theCanvas.style.cursor = 'default';
                    context.closePath();
                }

            });`
