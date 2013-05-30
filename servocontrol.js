var five = require('johnny-five'),
	state = {};

function init(board, config) {
	var servo;

	// Inject the `servo` hardware into the Repl instance's context; allows direct command line access
	board.repl.inject({
		servo: servo
	});

	// Initialize the servos
	for (servo in config) {
		state[servo] = {
			position: config[servo].defaultPosition,
			destination: config[servo].defaultPosition,
			controller: new five.Servo(config[servo].port),
			callback: null
		};
		state[servo].controller.move(config[servo].defaultPosition);
	}

	// Servo event loop
	setInterval(function () {
		var servo;
		for (servo in state) {
			if (state.hasOwnProperty(servo)) {
				servo = state[servo];
				if (servo.position < servo.destination) {
					servo.position++;
					servo.controller.move(servo.position);
				} else if (servo.position > servo.destination) {
					servo.position--;
					servo.controller.move(servo.position);
				} else if (servo.callback) {
					servo.callback();
					servo.callback = null;
				}
			}
		}
	}, 6);
}

function moveServo(servo, position, callback) {
	if (!state.hasOwnProperty(servo)) {
		throw new Error('Unknown servo "' + servo + '"');
	}
	state[servo].destination = position;
	state[servo].callback = callback;
}

function resetServos() {
	var servo;
	for (servo in state) {
		if (state.hasOwnProperty(servo)) {
			state[servo].position = 0;
		}
	}
}

module.exports = {
	init: init,
	moveServo: moveServo,
	resetServos: resetServos
};