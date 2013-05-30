var five = require('johnny-five'),
	servocontrol = require('./servocontrol.js'),
	board;

board = new five.Board();

board.on('ready', function() {

	// Create a new `servo` hardware instance.
	servocontrol.init(board, {
		servo1: {
			port: 'O0'
		},
		servo2: {
			port: 'O1'
		},
		servo3: {
			port: 'O2'
		}
	});

	var keys = {
			a: {
				servo1: 90,
				servo2: 90,
				servo3: 90
			},
			b: {
				servo1: 80,
				servo2: 80,
				servo3: 80
			}
		},
		resetPosition = {
			servo1: 90,
			servo2: 30,
			servo3: 30
		},
		sequence = ['a', 'a', 'b', 'a', 'b'],
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
				var key = keys[sequence[currentSequence]];
				console.log('\nPressing key ' + sequence[currentSequence]);
				console.log('Moving the arm');
				state = STATE_MOVING;
				counter = 0;
				function movingStateCallback() {
					counter++;
					if (counter === 2) {
						setTimeout(tick, 1000);
					}
				}
				servocontrol.moveServo('servo1', key.servo1, movingStateCallback);
				servocontrol.moveServo('servo2', key.servo2, movingStateCallback);
				break;
			case STATE_MOVING:
				console.log('Pressing the key');
				state = STATE_PRESSING;
				servocontrol.moveServo('servo3', key.servo3, function () {
					setTimeout(tick, 250);
				});
				break;
			case STATE_PRESSING:
				console.log('Releasing the key');
				state = STATE_RELEASING;
				servocontrol.moveServo('servo3', key.servo3 + 20, function () {
					setTimeout(tick, 1000);
				});
				break;
			case STATE_RELEASING:
				console.log('Resetting the arm');
				state = STATE_IDLE;
				counter = 0;
				function releasingStateCallback() {
					counter++;
					if (counter === 3) {
						setTimeout(tick, 1000);
					}
				}
				servocontrol.moveServo('servo1', resetPosition.servo1, releasingStateCallback);
				servocontrol.moveServo('servo2', resetPosition.servo2, releasingStateCallback);
				servocontrol.moveServo('servo3', resetPosition.servo3, releasingStateCallback);
		}
	}
	tick();
});


// References
//
// http://servocity.com/html/hs-7980th_servo.html