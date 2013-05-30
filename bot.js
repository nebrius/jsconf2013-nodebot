var five = require('johnny-five'),
	servocontrol = require('./servocontrol.js'),
	board;

board = new five.Board();

var keys = {
		a: {
			servo1: 90,
			servo2: 90,
			servo3: 90
		}
	},
	STATE_IDLE = 0
	STATE_MOVING = 1,
	STATE_PRESSING;

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


	/*var key = keys.a,
		state = 0,

	setInterval(function () {
		var position = positions[current],
			servo;
		for (servo in position) {
			servocontrol.moveServo(servo, position[servo]);
		}
		current++;
	}, 2000);*/
});


// References
//
// http://servocity.com/html/hs-7980th_servo.html