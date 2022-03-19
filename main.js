document.addEventListener('DOMContentLoaded', function () {
    'use strict';

    const
        /** @type HTMLCanvasElement */
        canvas = document.getElementById('canvas'),

        /** @type CanvasRenderingContext2D */
        context = canvas.getContext('2d', { alpha: false }),

        UPS = 50,

        FPS = 60;

    canvas.width = screen.width * 0.6;
    canvas.height = canvas.width * 3 / 4;

    let ball = {
        x: 0,
        y: 0,
        sx: 7,
        sy: -4,
        radius: 10
    };
    ResetBall();

    let paddleLeft = {
        x: 0,
        y: 0,
        w: 10,
        h: 100,
        score: 0
    };

    paddleLeft.y = canvas.height / 2 - paddleLeft.h / 2;

    let paddleRight = {
        x: 0,
        y: 0,
        w: 10,
        h: 100,
        score: 0,
        speed: 0.15,
        maxSpeed: 7
    };

    paddleRight.x = canvas.width - paddleRight.w;
    paddleRight.y = canvas.height / 2 - paddleRight.h / 2;

    let mouse = {
        x: 0,
        y: 0
    };

    canvas.addEventListener('mousemove', function (evt) {
        let bound = canvas.getBoundingClientRect();
        let root = document.documentElement;
        mouse.x = evt.clientX - bound.left - root.scrollLeft;
        mouse.y = evt.clientY - bound.top - root.scrollTop;
    });

    setInterval(Update, 1000 / UPS);
    setInterval(Draw, 1000 / FPS);

    function Update() {
        MoveBall();
        MovePaddleLeft();
        // MovePaddleRight();
        MovePaddleRightImpossible();
    }

    function MoveBall() {
        ball.x += ball.sx;
        ball.y += ball.sy;

        if (
            ball.x > canvas.width - ball.radius - paddleRight.w &&
            ball.y >= paddleRight.y && ball.y <= paddleRight.y + paddleRight.h
        ) {
            ball.sx *= -1;
        } else if (ball.x > canvas.width - ball.radius) {
            ResetBall();
            paddleLeft.score++;
        }


        if (
            ball.x < ball.radius + paddleLeft.w && ball.y >= paddleLeft.y &&
            ball.y <= paddleLeft.y + paddleLeft.h
        ) {
            ball.sx *= -1;
        } else if (ball.x < ball.radius) {
            ResetBall();
            paddleRight.score++;
        }

        if (ball.y > canvas.height - ball.radius) {
            ball.sy *= -1;
        }
        if (ball.y < ball.radius) {
            ball.sy *= -1;
        }
    }

    function MovePaddleLeft() {
        paddleLeft.y = mouse.y - paddleLeft.h / 2;
        if (paddleLeft.y < 0) {
            paddleLeft.y = 0;
        } else if (paddleLeft.y + paddleLeft.h > canvas.height) {
            paddleLeft.y = canvas.height - paddleLeft.h;
        }
    }

    function MovePaddleRight() {
        let target = ball.sx > 0 && ball.x >= canvas.width / 2 ? ball.y : canvas.height / 2;
        let mov = (target - paddleRight.y - paddleRight.h / 2) * paddleRight.speed;
        let dir = mov >= 0 ? 1 : -1;
        paddleRight.y += Math.min(paddleRight.maxSpeed, Math.abs(mov)) * dir;

        if (paddleRight.y < 0) {
            paddleRight.y = 0;
        } else if (paddleRight.y + paddleRight.h > canvas.height) {
            paddleRight.y = canvas.height - paddleRight.h;
        }
    }

    // In the "impossible" version the computer predicts the movement
    let predict = null;

    function MovePaddleRightImpossible() {
        let target;

        if (ball.sx > 0) {
            if (predict !== null) {
                target = predict;
            } else {
                let initialX = ball.x;
                let finalX = canvas.width - ball.radius - paddleRight.w;
                let speed = ball.sy;
                predict = ball.y;

                while (initialX < finalX) {
                    initialX += ball.sx;
                    predict += speed;

                    if (predict > canvas.height - ball.radius || predict < ball.radius) {
                        speed *= -1;
                    }
                }
                target = predict;
            }
        } else {
            target = canvas.height / 2;
            predict = null;
        }
        let mov = (target - paddleRight.y - paddleRight.h / 2) * paddleRight.speed;
        let dir = mov >= 0 ? 1 : -1;
        paddleRight.y += Math.min(paddleRight.maxSpeed, Math.abs(mov)) * dir;

        if (paddleRight.y < 0) {
            paddleRight.y = 0;
        } else if (paddleRight.y + paddleRight.h > canvas.height) {
            paddleRight.y = canvas.height - paddleRight.h;
        }
    }

    function ResetBall() {
        ball.x = canvas.width / 2 - ball.radius / 2;
        ball.y = canvas.height / 2 - ball.radius / 2;
        ball.sx = Random(5, 8) * (ball.sx > 0 ? -1 : 1);
        ball.sy = Random(5, 8) * (Random(1, 100) % 2 == 0 ? 1 : -1);
    }

    function Draw() {
        FillRect('black', 0, 0, canvas.width, canvas.height);
        FillText(paddleLeft.score, canvas.width / 4, 50);
        FillText(paddleRight.score, canvas.width / 4 * 3, 50);
        FillRect('white', canvas.width / 2, 0, 1, canvas.height);
        FillRect('white', paddleLeft.x, paddleLeft.y, paddleLeft.w, paddleLeft.h);
        FillRect('white', paddleRight.x, paddleRight.y, paddleRight.w, paddleRight.h);
        FillCirc('red', ball.x, ball.y, ball.radius);
    }

    function FillRect(color, x, y, w, h) {
        context.fillStyle = color;
        context.fillRect(x, y, w, h);
    }

    function FillCirc(color, x, y, radius) {
        context.beginPath();
        context.fillStyle = color;
        context.arc(x, y, radius, 0, Math.PI * 2, false);
        context.fill();
    }

    function FillText(text, x, y) {
        context.font = '20px Arial';
        context.fillStyle = 'white';
        context.textAlign = 'center';
        context.fillText(text, x, y);
    }

    function Random(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }
});
