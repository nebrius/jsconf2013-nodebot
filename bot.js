var five = require('johnny-five'),
	servocontrol = require('./servocontrol.js'),
	board;

board = new five.Board();

board.on('ready', function() {

	// Create a new `servo` hardware instance.
	servocontrol.init(board, {
		servo1: {
			port: 'O0',
			defaultPosition: 90
		},
		servo2: {
			port: 'O1',
			defaultPosition: 50
		},
		servo3: {
			port: 'O2',
			defaultPosition: 90
		}
	});

	var keys = {
			a: {
				servo1: 106,
				servo2: 64,
				servo3: 46
			},
			d: {
				servo1: 90,
				servo2: 66,
				servo3: 36
			},
			e: {
				servo1: 90,
				servo2: 70,
				servo3: 45
			},
			f: {
				servo1: 81,
				servo2: 64,
				servo3: 35
			},
			h: {
				servo1: 62,
				servo2: 66,
				servo3: 32
			},
			j: {
				servo1: 55,
				servo2: 66,
				servo3: 33
			},
			l: {
				servo1: 41,
				servo2: 67,
				servo3: 40
			},
			o: {
				servo1: 47,
				servo2: 70,
				servo3: 47
			},
			r: {
				servo1: 83,
				servo2: 68,
				servo3: 42
			},
			s: {
				servo1: 98,
				servo2: 64,
				servo3: 38
			},
			w: {
				servo1: 100,
				servo2: 70,
				servo3: 49
			},
			period: {
				servo1: 33,
				servo2: 70,
				servo3: 34
			},
			space: {
				servo1: 60,
				servo2: 80,
				servo3: 18
			}
		},
		sequence = ['h', 'e', 'l', 'l', 'o', 'w', 'o', 'r', 'l', 'd', 'period', 'j', 's'],
		currentSequence = -1,
		counter,
		STATE_IDLE = 0,
		STATE_MOVING = 1,
		STATE_PRESSING = 2,
		STATE_RELEASING = 3,
		state = STATE_IDLE;

	function tick() {
		var key = keys[sequence[currentSequence]];
		switch(state) {
			case STATE_IDLE:
				currentSequence++;
				key = keys[sequence[currentSequence]];
				if (key) {
					console.log('\nPressing key ' + sequence[currentSequence]);
					console.log('Moving the arm');
					state = STATE_MOVING;
					counter = 0;
					function movingStateCallback() {
						counter++;
						if (counter === 2) {
							setTimeout(tick, 250);
						}
					}
					servocontrol.moveServo('servo1', key.servo1, movingStateCallback);
					servocontrol.moveServo('servo3', key.servo3, movingStateCallback);
				}
				break;
			case STATE_MOVING:
				console.log('Pressing the key');
				state = STATE_PRESSING;
				counter = 0;
				function pressingStateCallback() {
					counter++;
					if (counter === 2) {
						setTimeout(tick, 220);
					}
				}
				servocontrol.moveServo('servo2', key.servo2, pressingStateCallback);
				servocontrol.moveServo('servo3', key.servo3 + 5, pressingStateCallback);
				break;
			case STATE_PRESSING:
				console.log('Releasing the key');
				state = STATE_RELEASING;
				servocontrol.moveServo('servo2', 50, function () {
					setTimeout(tick, 250);
				});
				break;
			case STATE_RELEASING:
				state = STATE_IDLE;
				tick();
		}
	}
	tick();
});


// References
//
// http://servocity.com/html/hs-7980th_servo.html