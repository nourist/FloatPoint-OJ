import chalk from 'chalk';

var mapping = {
	log: chalk.greenBright,
	warn: chalk.yellow,
	error: chalk.red,
};

['log', 'warn', 'error'].forEach(function (method) {
	var oldMethod = console[method].bind(console);
	console[method] = function (...args) {
		oldMethod(mapping[method](...args));
	};
});
